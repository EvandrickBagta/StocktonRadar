import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../src/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { city, limit = 50, offset = 0 } = req.query;
      
      let query = supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      // Filter by city if provided
      if (city && typeof city === 'string') {
        query = query.eq('city', city);
      }

      const { data: events, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({
          error: 'Failed to fetch events',
          message: error.message
        });
      }

      return res.status(200).json({
        events: events || [],
        total: events?.length || 0,
        limit: Number(limit),
        offset: Number(offset)
      });

    } catch (error) {
      console.error('Error in events API:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
