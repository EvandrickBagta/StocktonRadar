import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Event, EventScraper } from '../types/Event';

export class VisitStocktonScraper implements EventScraper {
  public readonly city = 'Stockton';
  public readonly sourceName = 'Visit Stockton';
  private readonly baseUrl = 'https://www.visitstockton.org';

  async fetchEvents(): Promise<Event[]> {
    try {
      console.log(`[${this.sourceName}] Starting to fetch events...`);
      
      // Fetch the events page
      const response = await axios.get(`${this.baseUrl}/events`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const events: Event[] = [];

      // Look for event containers - this selector may need adjustment based on actual HTML structure
      $('.event-item, .event-card, .event').each((index, element) => {
        try {
          const $element = $(element);
          
          // Extract event data
          const title = this.extractText($element, 'h1, h2, h3, .title, .event-title');
          const description = this.extractText($element, '.description, .event-description, p');
          const dateText = this.extractText($element, '.date, .event-date, .start-date');
          const location = this.extractText($element, '.location, .venue, .address');
          
          if (title && dateText) {
            const startDate = this.parseDate(dateText);
            if (startDate) {
              events.push({
                city: this.city,
                source: this.sourceName,
                title: title.trim(),
                description: description?.trim() || '',
                start_date: startDate,
                location: location?.trim() || 'Stockton, CA',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.error(`[${this.sourceName}] Error parsing event ${index}:`, error);
        }
      });

      console.log(`[${this.sourceName}] Successfully scraped ${events.length} events`);
      return events;

    } catch (error) {
      console.error(`[${this.sourceName}] Error fetching events:`, error);
      throw new Error(`Failed to fetch events from ${this.sourceName}: ${error}`);
    }
  }

  private extractText($element: cheerio.Cheerio<any>, selector: string): string | null {
    const $found = $element.find(selector).first();
    return $found.length > 0 ? $found.text().trim() : null;
  }

  private parseDate(dateText: string): string | null {
    try {
      // Handle various date formats
      const date = new Date(dateText);
      if (isNaN(date.getTime())) {
        // Try to parse common date formats
        const formats = [
          /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
          /(\d{4})-(\d{1,2})-(\d{1,2})/,   // YYYY-MM-DD
          /(\w+)\s+(\d{1,2}),?\s+(\d{4})/,  // Month DD, YYYY
        ];

        for (const format of formats) {
          const match = dateText.match(format);
          if (match && match[0]) {
            const parsedDate = new Date(match[0]);
            if (!isNaN(parsedDate.getTime())) {
              const isoString = parsedDate.toISOString();
              return isoString.split('T')[0] || null;
            }
          }
        }
        return null;
      }
      const isoString = date.toISOString();
      return isoString.split('T')[0] || null;
    } catch (error) {
      console.error(`[${this.sourceName}] Error parsing date "${dateText}":`, error);
      return null;
    }
  }
}
