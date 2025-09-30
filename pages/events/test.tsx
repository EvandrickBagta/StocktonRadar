import React, { useState } from 'react'
import Link from 'next/link'

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

const EventsTestPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setResults([]);
    const testResults: TestResult[] = [];

    // Test 1: Check Supabase Connection
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      
      testResults.push({
        test: 'Supabase Connection',
        success: response.ok,
        message: response.ok ? 'Successfully connected to Supabase' : 'Failed to connect to Supabase',
        data: response.ok ? { eventCount: data.events?.length || 0 } : data,
        error: response.ok ? undefined : data.message
      });
    } catch (error) {
      testResults.push({
        test: 'Supabase Connection',
        success: false,
        message: 'Failed to connect to Supabase',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Check Scraping API
    try {
      const response = await fetch('/api/scrape-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      testResults.push({
        test: 'Scraping API',
        success: response.ok,
        message: response.ok ? 'Scraping API is working' : 'Scraping API failed',
        data: response.ok ? data.summary : data,
        error: response.ok ? undefined : data.message
      });
    } catch (error) {
      testResults.push({
        test: 'Scraping API',
        success: false,
        message: 'Scraping API failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Check Environment Variables
    try {
      const response = await fetch('/api/test-env');
      const data = await response.json();
      
      testResults.push({
        test: 'Environment Variables',
        success: response.ok,
        message: response.ok ? 'Environment variables are configured' : 'Environment variables missing',
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message
      });
    } catch (error) {
      testResults.push({
        test: 'Environment Variables',
        success: false,
        message: 'Environment test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: Check Database Schema
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      
      testResults.push({
        test: 'Database Schema',
        success: response.ok,
        message: response.ok ? 'Database schema is correct' : 'Database schema issues',
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message
      });
    } catch (error) {
      testResults.push({
        test: 'Database Schema',
        success: false,
        message: 'Database schema test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setResults(testResults);
    setLoading(false);
  };

  const runIndividualScraper = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-scraper');
      const data = await response.json();
      
      setResults([{
        test: 'Individual Scraper Test',
        success: response.ok,
        message: response.ok ? 'Scraper test completed' : 'Scraper test failed',
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message
      }]);
    } catch (error) {
      setResults([{
        test: 'Individual Scraper Test',
        success: false,
        message: 'Scraper test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/events" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Events System Debug</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test and debug the event scraping system components.
          </p>
        </div>

        {/* Test Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Controls</h2>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={runTests}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <button
                onClick={runIndividualScraper}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Testing...' : 'Test Individual Scraper'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Available Tests:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Supabase Connection:</strong> Tests database connectivity</li>
                <li>• <strong>Scraping API:</strong> Tests the scraping endpoint</li>
                <li>• <strong>Environment Variables:</strong> Checks configuration</li>
                <li>• <strong>Database Schema:</strong> Validates table structure</li>
                <li>• <strong>Individual Scraper:</strong> Tests Visit Stockton scraper</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Results</h2>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className={`rounded-lg p-6 ${
                  result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          result.success ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {result.test}
                        </h3>
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>

                      {result.error && (
                        <div className="bg-red-100 rounded p-3 mb-3">
                          <p className="text-sm text-red-800 font-mono">
                            {result.error}
                          </p>
                        </div>
                      )}

                      {result.data && (
                        <div className="bg-gray-100 rounded p-3">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Data:</h4>
                          <pre className="text-xs text-gray-600 overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Information */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Debug Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Common Issues:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Supabase not configured:</strong> Check environment variables</li>
                  <li>• <strong>Database schema missing:</strong> Run the SQL schema</li>
                  <li>• <strong>Scraper timeout:</strong> Website may be blocking requests</li>
                  <li>• <strong>Network issues:</strong> Check internet connection</li>
                  <li>• <strong>Rate limiting:</strong> Too many requests to source</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Next Steps:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Check Supabase dashboard for errors</li>
                  <li>• Verify environment variables in .env.local</li>
                  <li>• Test individual scraper components</li>
                  <li>• Check browser console for errors</li>
                  <li>• Review server logs for detailed errors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsTestPage
