import type { NextApiRequest, NextApiResponse } from 'next';
import { runEventScraping } from '../../src/scrapeEvents';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are allowed for this endpoint'
    });
  }

  try {
    console.log('🚀 API: Starting event scraping...');
    
    // Run the scraping process
    const results = await runEventScraping();
    
    // Calculate summary statistics
    const summary = {
      totalScrapers: results.length,
      successfulScrapers: results.filter(r => r.success).length,
      totalEventsFound: results.reduce((sum, r) => sum + r.eventsFound, 0),
      totalEventsInserted: results.reduce((sum, r) => sum + r.eventsInserted, 0),
      scrapers: results.map(r => ({
        name: r.scraper,
        success: r.success,
        eventsFound: r.eventsFound,
        eventsInserted: r.eventsInserted,
        errors: r.errors
      }))
    };

    console.log('✅ API: Event scraping completed successfully');
    
    return res.status(200).json({
      success: true,
      message: 'Event scraping completed successfully',
      summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ API: Error during event scraping:', error);
    
    // Provide more detailed error information
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      type: error instanceof Error ? error.constructor.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: errorDetails.message,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
}
