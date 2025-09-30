import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV,
    };

    const missingVars = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    const success = missingVars.length === 0;

    return res.status(200).json({
      success,
      message: success 
        ? 'All required environment variables are set' 
        : `Missing environment variables: ${missingVars.join(', ')}`,
      environment: envCheck,
      missing: missingVars
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to check environment variables',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
