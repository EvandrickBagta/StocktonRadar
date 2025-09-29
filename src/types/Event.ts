export interface Event {
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

export interface EventScraper {
  city: string;
  sourceName: string;
  fetchEvents(): Promise<Event[]>;
}
