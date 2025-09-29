import { supabase } from './lib/supabaseClient';
import type { Event } from './types/Event';
import { VisitStocktonScraper } from './scrapers';

interface ScrapeResult {
  scraper: string;
  success: boolean;
  eventsFound: number;
  eventsInserted: number;
  errors: string[];
}

export class EventScrapingRunner {
  private scrapers = [
    new VisitStocktonScraper(),
    // Add new scrapers here as they are created
  ];

  async runScraping(): Promise<ScrapeResult[]> {
    console.log('🚀 Starting event scraping process...');
    const results: ScrapeResult[] = [];

    for (const scraper of this.scrapers) {
      const result: ScrapeResult = {
        scraper: scraper.sourceName,
        success: false,
        eventsFound: 0,
        eventsInserted: 0,
        errors: []
      };

      try {
        console.log(`📡 Scraping events from ${scraper.sourceName}...`);
        
        // Fetch events from scraper
        const events = await scraper.fetchEvents();
        result.eventsFound = events.length;
        
        if (events.length === 0) {
          console.log(`⚠️  No events found from ${scraper.sourceName}`);
          result.success = true;
          results.push(result);
          continue;
        }

        // Insert events into Supabase
        const insertedCount = await this.insertEvents(events);
        result.eventsInserted = insertedCount;
        result.success = true;
        
        console.log(`✅ ${scraper.sourceName}: Found ${events.length} events, inserted ${insertedCount} new events`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(errorMessage);
        console.error(`❌ Error scraping ${scraper.sourceName}:`, errorMessage);
      }

      results.push(result);
    }

    this.logSummary(results);
    return results;
  }

  private async insertEvents(events: Event[]): Promise<number> {
    let insertedCount = 0;

    for (const event of events) {
      try {
        // Check for duplicates based on source + title + start_date
        const { data: existingEvent } = await supabase
          .from('events')
          .select('id')
          .eq('source', event.source)
          .eq('title', event.title)
          .eq('start_date', event.start_date)
          .single();

        if (existingEvent) {
          console.log(`⏭️  Skipping duplicate event: ${event.title}`);
          continue;
        }

        // Insert new event
        const { data, error } = await supabase
          .from('events')
          .insert([{
            city: event.city,
            source: event.source,
            title: event.title,
            description: event.description,
            start_date: event.start_date,
            end_date: event.end_date,
            location: event.location,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();

        if (error) {
          console.error(`❌ Error inserting event "${event.title}":`, error);
          continue;
        }

        insertedCount++;
        console.log(`✅ Inserted event: ${event.title}`);

      } catch (error) {
        console.error(`❌ Error processing event "${event.title}":`, error);
      }
    }

    return insertedCount;
  }

  private logSummary(results: ScrapeResult[]): void {
    console.log('\n📊 Scraping Summary:');
    console.log('==================');
    
    let totalFound = 0;
    let totalInserted = 0;
    let successfulScrapers = 0;

    results.forEach(result => {
      console.log(`${result.success ? '✅' : '❌'} ${result.scraper}:`);
      console.log(`   Events found: ${result.eventsFound}`);
      console.log(`   Events inserted: ${result.eventsInserted}`);
      
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(', ')}`);
      }
      
      totalFound += result.eventsFound;
      totalInserted += result.eventsInserted;
      if (result.success) successfulScrapers++;
    });

    console.log('\n🎯 Overall Results:');
    console.log(`   Successful scrapers: ${successfulScrapers}/${results.length}`);
    console.log(`   Total events found: ${totalFound}`);
    console.log(`   Total events inserted: ${totalInserted}`);
  }
}

// Export function for easy importing
export async function runEventScraping(): Promise<ScrapeResult[]> {
  const runner = new EventScrapingRunner();
  return await runner.runScraping();
}
