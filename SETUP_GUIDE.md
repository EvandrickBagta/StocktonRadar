# StocktonRadar Setup Guide

## 🚀 Quick Start

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Get Your Supabase Credentials

1. **Go to [Supabase](https://supabase.com) and create a new project**
2. **Navigate to Settings > API**
3. **Copy the following values:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Database Setup

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the contents of `supabase-schema.sql`**
4. **Click "Run" to create the events table**

### 4. Test Your Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the debug page:**
   ```
   http://localhost:3000/events/test
   ```

3. **Run the tests to verify everything is working**

## 🔧 Troubleshooting

### Common Issues

#### ❌ "Supabase environment variables are not configured"
- **Solution:** Create `.env.local` file with your Supabase credentials
- **Check:** Make sure the file is in the project root directory

#### ❌ "Database connection failed"
- **Solution:** Run the SQL schema in your Supabase project
- **Check:** Verify your Supabase URL and key are correct

#### ❌ "JSON.parse: unexpected character"
- **Solution:** This usually means the API endpoints are returning HTML error pages
- **Check:** Verify your environment variables are set correctly

### Environment Variables Checklist

- [ ] `.env.local` file exists in project root
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set to your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set to your Supabase anon key
- [ ] No quotes around the values in `.env.local`
- [ ] Restart the development server after adding environment variables

### Database Checklist

- [ ] Supabase project is created
- [ ] Events table is created using the provided SQL schema
- [ ] Database is accessible from your project
- [ ] No RLS (Row Level Security) policies blocking access

## 📁 File Structure

```
StocktonRadar/
├── .env.local                 # Environment variables (create this)
├── supabase-schema.sql       # Database schema
├── pages/
│   ├── events/               # Events pages
│   │   └── test.tsx         # Debug page
│   └── api/                 # API endpoints
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts # Supabase configuration
│   └── scrapers/            # Event scrapers
└── SETUP_GUIDE.md           # This file
```

## 🎯 Next Steps

1. **Set up environment variables** (most important!)
2. **Create the database table** using the SQL schema
3. **Test the system** using the debug page
4. **Start scraping events** from the events page

## 🆘 Still Having Issues?

1. **Check the browser console** for detailed error messages
2. **Use the debug page** at `/events/test` to identify specific issues
3. **Verify your Supabase project** is active and accessible
4. **Restart the development server** after making changes

---

*Once you have the environment variables set up, the system should work correctly!*
