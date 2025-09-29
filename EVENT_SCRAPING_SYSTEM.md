# StocktonRadar Event Scraping System

## 🎯 Overview

A comprehensive multi-city event scraping system that automatically discovers and reports events from various sources. The system is designed to be easily extensible for new cities and sources.

## 🏗️ Architecture

### Core Components

1. **TypeScript Interfaces** (`src/types/Event.ts`)
   - `Event` interface with all required fields
   - `EventScraper` interface for consistent scraper implementation

2. **Scrapers** (`src/scrapers/`)
   - Individual scraper modules for each source
   - Implements `EventScraper` interface
   - Uses axios + cheerio for HTML parsing

3. **Runner Script** (`src/scrapeEvents.ts`)
   - Orchestrates all scrapers
   - Handles Supabase integration
   - Duplicate detection and error handling

4. **API Routes**
   - `/api/scrape-events` - Triggers on-demand scraping
   - `/api/events` - Fetches events from database

5. **Frontend Integration**
   - Updated events page with real-time data
   - Scraping controls and event display

## 📁 File Structure

```
src/
├── types/
│   └── Event.ts                 # TypeScript interfaces
├── scrapers/
│   ├── index.ts                # Exports all scrapers
│   ├── visitStocktonScraper.ts # Visit Stockton scraper
│   └── README.md               # Documentation for adding scrapers
├── lib/
│   └── supabaseClient.ts       # Supabase configuration
└── scrapeEvents.ts             # Main scraping runner

pages/
├── api/
│   ├── events.ts               # GET events API
│   └── scrape-events.ts       # POST scraping API
└── events.tsx                  # Updated events page

supabase-schema.sql             # Database schema
```

## 🚀 Features

### ✅ Implemented Features

1. **Multi-City Support**
   - Extensible architecture for any city
   - Consistent scraper interface

2. **Robust Error Handling**
   - Individual scraper error isolation
   - Comprehensive logging
   - Graceful failure handling

3. **Duplicate Prevention**
   - Source + title + start_date uniqueness
   - Automatic duplicate detection

4. **Real-time Interface**
   - Live event display
   - On-demand scraping triggers
   - Loading states and error handling

5. **Database Integration**
   - Supabase events table
   - Optimized queries with indexes
   - Row-level security ready

### 🔧 Technical Features

- **TypeScript** - Full type safety
- **Cheerio** - HTML parsing and DOM manipulation
- **Axios** - HTTP requests with timeout and headers
- **Supabase** - Database operations and real-time updates
- **Next.js API Routes** - Server-side scraping
- **Tailwind CSS** - Responsive UI components

## 📊 Database Schema

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  location VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎮 Usage

### Manual Scraping
```bash
# Trigger scraping via API
curl -X POST http://localhost:3000/api/scrape-events
```

### Programmatic Usage
```typescript
import { runEventScraping } from './src/scrapeEvents';

const results = await runEventScraping();
console.log('Scraping completed:', results);
```

### Frontend Integration
- Visit `/events` page
- Click "Refresh Events" to trigger scraping
- View real-time event data

## 🔌 Adding New Scrapers

### Step 1: Create Scraper Class
```typescript
export class NewCityScraper implements EventScraper {
  public readonly city = 'New City';
  public readonly sourceName = 'Source Name';
  
  async fetchEvents(): Promise<Event[]> {
    // Implementation
  }
}
```

### Step 2: Export Scraper
Add to `src/scrapers/index.ts`:
```typescript
export { NewCityScraper } from './newCityScraper';
```

### Step 3: Register Scraper
Add to `src/scrapeEvents.ts`:
```typescript
private scrapers = [
  new VisitStocktonScraper(),
  new NewCityScraper(), // Add here
];
```

## 🛡️ Error Handling

### Scraper-Level Errors
- Individual scraper failures don't affect others
- Detailed error logging per scraper
- Graceful degradation

### Database Errors
- Duplicate detection and handling
- Transaction safety
- Connection error handling

### API Errors
- Proper HTTP status codes
- Detailed error messages
- Client-side error display

## 📈 Performance Considerations

### Database Optimization
- Indexed columns for fast queries
- Composite indexes for duplicate detection
- Efficient pagination

### Scraping Optimization
- Request timeouts and retries
- Rate limiting considerations
- Memory-efficient parsing

### Frontend Optimization
- Lazy loading of events
- Efficient re-rendering
- Responsive design

## 🔍 Monitoring and Maintenance

### Logging
- Structured logging with scraper names
- Success/failure tracking
- Performance metrics

### Data Quality
- Duplicate detection
- Date validation
- Content sanitization

### Health Checks
- Scraper success rates
- Database connectivity
- API endpoint availability

## 🚀 Deployment

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
1. Run `supabase-schema.sql` in Supabase SQL editor
2. Configure RLS policies as needed
3. Set up environment variables

### Production Considerations
- Set up scheduled scraping (cron jobs)
- Monitor scraper success rates
- Implement rate limiting
- Add authentication for API endpoints

## 📚 Documentation

- **Scraper Development**: `src/scrapers/README.md`
- **API Documentation**: Inline comments in API routes
- **Database Schema**: `supabase-schema.sql`
- **Type Definitions**: `src/types/Event.ts`

## 🎯 Future Enhancements

### Planned Features
- Scheduled scraping (cron jobs)
- Event categorization and filtering
- Advanced search and filtering
- Event recommendation system
- Social media integration
- Email notifications for new events

### Technical Improvements
- Caching layer for better performance
- Queue system for large-scale scraping
- Machine learning for event categorization
- Real-time event updates
- Mobile app integration

## 🏆 Success Metrics

- **Scraping Success Rate**: >95% for stable sources
- **Data Quality**: <5% duplicate events
- **Performance**: <30s for full scraping cycle
- **Uptime**: >99% API availability
- **User Engagement**: Event page visits and interactions

---

*This system provides a solid foundation for multi-city event discovery and can be easily extended to support additional cities and sources as needed.*
