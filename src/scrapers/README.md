# Event Scrapers Documentation

This directory contains event scrapers for different cities and sources. Each scraper implements the `EventScraper` interface to fetch events from various sources.

## Architecture

### EventScraper Interface
```typescript
interface EventScraper {
  city: string;
  sourceName: string;
  fetchEvents(): Promise<Event[]>;
}
```

### Event Interface
```typescript
interface Event {
  id?: string;
  city: string;
  source: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}
```

## Adding a New Scraper

### Step 1: Create the Scraper Class

Create a new file in this directory following the naming convention: `{cityName}Scraper.ts`

Example: `sacramentoScraper.ts`

```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event, EventScraper } from '../types/Event';

export class SacramentoScraper implements EventScraper {
  public readonly city = 'Sacramento';
  public readonly sourceName = 'Visit Sacramento';
  private readonly baseUrl = 'https://www.visitsacramento.com';

  async fetchEvents(): Promise<Event[]> {
    try {
      console.log(`[${this.sourceName}] Starting to fetch events...`);
      
      // Fetch the events page
      const response = await axios.get(`${this.baseUrl}/events`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const events: Event[] = [];

      // Parse events based on the website's HTML structure
      $('.event-item').each((index, element) => {
        try {
          const $element = $(element);
          
          const title = this.extractText($element, '.event-title');
          const description = this.extractText($element, '.event-description');
          const dateText = this.extractText($element, '.event-date');
          const location = this.extractText($element, '.event-location');
          
          if (title && dateText) {
            const startDate = this.parseDate(dateText);
            if (startDate) {
              events.push({
                city: this.city,
                source: this.sourceName,
                title: title.trim(),
                description: description?.trim() || '',
                start_date: startDate,
                location: location?.trim() || 'Sacramento, CA',
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

  private extractText($element: cheerio.Cheerio<cheerio.Element>, selector: string): string | null {
    const $found = $element.find(selector).first();
    return $found.length > 0 ? $found.text().trim() : null;
  }

  private parseDate(dateText: string): string | null {
    try {
      const date = new Date(dateText);
      if (isNaN(date.getTime())) {
        // Handle various date formats
        const formats = [
          /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
          /(\d{4})-(\d{1,2})-(\d{1,2})/,
          /(\w+)\s+(\d{1,2}),?\s+(\d{4})/,
        ];

        for (const format of formats) {
          const match = dateText.match(format);
          if (match) {
            const parsedDate = new Date(match[0]);
            if (!isNaN(parsedDate.getTime())) {
              return parsedDate.toISOString().split('T')[0];
            }
          }
        }
        return null;
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(`[${this.sourceName}] Error parsing date "${dateText}":`, error);
      return null;
    }
  }
}
```

### Step 2: Export the Scraper

Add your new scraper to `src/scrapers/index.ts`:

```typescript
// Export all scrapers for easy importing
export { VisitStocktonScraper } from './visitStocktonScraper';
export { SacramentoScraper } from './sacramentoScraper';

// Add new scrapers here as they are created
```

### Step 3: Register the Scraper

Add your scraper to the `EventScrapingRunner` in `src/scrapeEvents.ts`:

```typescript
private scrapers = [
  new VisitStocktonScraper(),
  new SacramentoScraper(), // Add your new scraper here
  // Add new scrapers here as they are created
];
```

## Best Practices

### 1. Error Handling
- Always wrap scraping logic in try-catch blocks
- Log errors with descriptive messages
- Don't let one failed event break the entire scraping process

### 2. Rate Limiting
- Add delays between requests if needed
- Respect robots.txt files
- Use appropriate User-Agent headers

### 3. Data Validation
- Validate required fields (title, start_date)
- Handle missing or malformed data gracefully
- Normalize date formats

### 4. Selector Flexibility
- Use multiple selectors for the same data
- Handle different page layouts
- Test selectors on actual website content

### 5. Logging
- Use consistent logging format
- Include scraper name in log messages
- Log both successes and failures

## Testing Your Scraper

### 1. Manual Testing
```typescript
import { YourCityScraper } from './yourCityScraper';

const scraper = new YourCityScraper();
scraper.fetchEvents().then(events => {
  console.log('Found events:', events);
}).catch(error => {
  console.error('Scraping failed:', error);
});
```

### 2. API Testing
```bash
curl -X POST http://localhost:3000/api/scrape-events
```

## Common Issues and Solutions

### 1. CORS Issues
- Use server-side scraping (Next.js API routes)
- Consider using a proxy service if needed

### 2. Dynamic Content
- Some sites load content with JavaScript
- Consider using Puppeteer for dynamic content
- Check if the site has an API

### 3. Rate Limiting
- Add delays between requests
- Implement exponential backoff
- Use rotating User-Agent strings

### 4. Selector Changes
- Websites change their HTML structure
- Use multiple fallback selectors
- Monitor scraping success rates

## Monitoring and Maintenance

### 1. Log Analysis
- Monitor error rates
- Track scraping success
- Alert on repeated failures

### 2. Data Quality
- Check for duplicate events
- Validate date formats
- Monitor data completeness

### 3. Performance
- Track scraping duration
- Monitor memory usage
- Optimize for large datasets

## Example Scrapers

- `visitStocktonScraper.ts` - Visit Stockton events
- `sacramentoScraper.ts` - Sacramento events (example)
- `modestoScraper.ts` - Modesto events (example)

Each scraper should be self-contained and handle its own error cases while following the established patterns.
