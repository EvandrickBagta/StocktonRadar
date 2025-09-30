import type { NextApiRequest, NextApiResponse } from 'next';
import { VisitStocktonScraper } from '../../src/scrapers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing Visit Stockton scraper...');
    
    const scraper = new VisitStocktonScraper();
    
    // Test the scraper
    const events = await scraper.fetchEvents();
    
    console.log(`✅ Scraper test completed: Found ${events.length} events`);
    
    return res.status(200).json({
      success: true,
      message: `Scraper test completed successfully`,
      scraper: {
        city: scraper.city,
        sourceName: scraper.sourceName,
        eventsFound: events.length
      },
      events: events.slice(0, 3), // Return first 3 events as sample
      sampleEvent: events[0] || null
    });

  } catch (error) {
    console.error('❌ Scraper test failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Scraper test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: {
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      }
    });
  }
}
