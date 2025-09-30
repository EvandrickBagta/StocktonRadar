import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const envCheck = {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
      nodeEnv: process.env.NODE_ENV,
      hasEnvFile: true, // We'll assume it exists if we can read env vars
    };

    const missingVars = [];
    const invalidVars = [];

    if (!supabaseUrl) {
      missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    } else if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseUrl === 'your_supabase_project_url_here') {
      invalidVars.push('NEXT_PUBLIC_SUPABASE_URL (placeholder value)');
    }

    if (!supabaseAnonKey) {
      missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    } else if (supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY' || supabaseAnonKey === 'your_supabase_anon_key_here') {
      invalidVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY (placeholder value)');
    }

    const success = missingVars.length === 0 && invalidVars.length === 0;

    let message = '';
    if (success) {
      message = 'All required environment variables are set and valid';
    } else if (missingVars.length > 0) {
      message = `Missing environment variables: ${missingVars.join(', ')}. Please create a .env.local file.`;
    } else if (invalidVars.length > 0) {
      message = `Invalid environment variables: ${invalidVars.join(', ')}. Please replace placeholder values with actual Supabase credentials.`;
    }

    return res.status(200).json({
      success,
      message,
      environment: envCheck,
      missing: missingVars,
      invalid: invalidVars,
      setupInstructions: {
        createEnvFile: missingVars.length > 0,
        replacePlaceholders: invalidVars.length > 0,
        envFileContent: `NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here`
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to check environment variables',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
