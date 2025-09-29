-- Supabase Events Table Schema
-- Run this SQL in your Supabase SQL editor to create the events table

CREATE TABLE IF NOT EXISTS events (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Create a composite index for duplicate detection
CREATE INDEX IF NOT EXISTS idx_events_duplicate_check ON events(source, title, start_date);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (adjust as needed)
-- CREATE POLICY "Allow public read access" ON events FOR SELECT USING (true);

-- Create a policy to allow authenticated users to insert (adjust as needed)
-- CREATE POLICY "Allow authenticated insert" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
