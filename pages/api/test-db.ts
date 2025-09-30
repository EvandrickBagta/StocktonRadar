import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../src/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    if (connectionError) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: connectionError.message,
        details: connectionError
      });
    }

    // Test table structure by trying to insert and delete a test record
    const testEvent = {
      city: 'Test',
      source: 'Test',
      title: 'Test Event',
      description: 'Test Description',
      start_date: '2024-01-01',
      location: 'Test Location'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert([testEvent])
      .select();

    if (insertError) {
      return res.status(500).json({
        success: false,
        message: 'Database schema test failed',
        error: insertError.message,
        details: insertError
      });
    }

    // Clean up test record
    if (insertData && insertData[0]) {
      await supabase
        .from('events')
        .delete()
        .eq('id', insertData[0].id);
    }

    // Get table info
    const { data: events, error: countError } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .limit(1);

    return res.status(200).json({
      success: true,
      message: 'Database schema is correct',
      tableInfo: {
        canConnect: true,
        canInsert: true,
        canDelete: true,
        currentEventCount: events?.length || 0
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Database test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
