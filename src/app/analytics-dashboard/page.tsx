'use client'

import { useState, useEffect } from 'react'
import { ReactNode } from 'react'
import HackerLoader from '@/components/ui/HackerLoader'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


interface NavLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

function NavLink({ href, children, ...props }: NavLinkProps) {
  return (
    <a
      href={href}
      className="text-green-300 hover:text-green-500 transition-colors"
      {...props}
    >
      {children}
    </a>
  )
}


interface AnalyticsData {
  totalVisits: number
  totalMails: number
  lastVisited: string
  earnings: number
  visitorLocations: Record<string, number>
  mailTimestamps: string[]
  blinkCreator?: string
}

export default function DashboardPage() {
  const [showLoader, setShowLoader] = useState(true)
  const [analyticsId, setAnalyticsId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Load saved analytics ID on mount
  useEffect(() => {
    const savedId = localStorage.getItem('lastAnalyticsId')
    if (savedId) {
      setAnalyticsId(savedId)
      fetchAnalyticsData(savedId)
    }
  }, [])

  const fetchAnalyticsData = async (id: string) => {
    try {
      // First make a POST request to increment the visit count
      await fetch(`/api/analytics/${id}`, {
        method: 'POST',
      });

      // Then fetch the updated data
      const response = await fetch(`/api/analytics/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics data');
      }

      setAnalyticsData(data.analytics);
      setLastUpdated(new Date());
      localStorage.setItem('lastAnalyticsId', id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
      setAnalyticsData(null);
    }
  };

  const handleFetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchAnalyticsData(analyticsId);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async (id: string) => {
    try {
      const response = await fetch(`/api/analytics/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics data');
      }

      setAnalyticsData(data.analytics);
      setLastUpdated(new Date());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
      setAnalyticsData(null);
    }
  };

  // Auto-refresh analytics data every 10 seconds, but don't count as visit
  useEffect(() => {
    if (!analyticsId) return;

    const intervalId = setInterval(() => {
      refreshData(analyticsId);
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [analyticsId]);
  const handleNewSearch = () => {
    setAnalyticsData(null)
    setAnalyticsId('')
    localStorage.removeItem('lastAnalyticsId')
  }

  const handleLoaderComplete = () => {
    setShowLoader(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('lastAnalyticsId');
    setAnalyticsId('');
    setAnalyticsData(null);
    window.location.href = '/analytics-dashboard';
  };

  if (showLoader) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <HackerLoader duration={5000} onComplete={handleLoaderComplete} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-green-500 font-mono">
      <div className="fixed inset-0 bg-[url('/grid.png')] opacity-20 z-0"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-90 backdrop-blur-md border-b border-green-500">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              <div className="text-xl sm:text-2xl font-bold glitch" data-text="X-Mailer">
                <NavLink href="/">X-Mailer</NavLink>
              </div>
              {analyticsData && (
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 pt-20 sm:pt-24 pb-8 flex-grow flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-green-500 glitch text-center w-full" data-text="Analytics Dashboard">
            Analytics Dashboard
          </h1>
          
          {!analyticsData ? (
            <Card className="w-full max-w-xl bg-black border-green-500 shadow-lg shadow-green-500/20">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-green-400">
                  Fetch Blinks Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-8 p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <Input
                    type="text"
                    placeholder="Enter Analytics ID"
                    value={analyticsId}
                    onChange={(e) => setAnalyticsId(e.target.value)}
                    className="w-full bg-black border-2 border-green-500 text-green-400 placeholder-green-700 focus:ring-2 focus:ring-green-500 text-base sm:text-lg md:text-xl py-6 sm:py-8 px-4 sm:px-6 rounded-md"
                  />
                  <Button
                    onClick={handleFetchData}
                    disabled={isLoading || !analyticsId}
                    className="w-full bg-green-600 text-black hover:bg-green-500 disabled:bg-green-900 disabled:text-green-700 transition-colors duration-200 text-base sm:text-lg md:text-xl py-6 sm:py-8"
                  >
                    {isLoading ? 'Decrypting Data...' : 'Fetch Analytics Data'}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-md">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="w-full max-w-7xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Analytics ID: <span className="text-green-500">{analyticsId}</span></h2>
                  {analyticsData.blinkCreator && (
                    <p className="text-lg text-gray-400">Creator: <span className="text-white">{analyticsData.blinkCreator}</span></p>
                  )}
                  {lastUpdated && (
                    <p className="text-sm text-gray-400 mt-1">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center mt-4 md:mt-0">
                  <p className="text-sm text-gray-400">
                    Auto-refreshes every 10s
                  </p>
                  <Button
                    onClick={() => fetchAnalyticsData(analyticsId)}
                    className="bg-green-600 text-black hover:bg-green-500 px-4 w-full md:w-auto"
                  >
                    Refresh Now
                  </Button>
                  <Button
                    onClick={handleNewSearch}
                    className="bg-green-600 text-black hover:bg-green-500 px-4 w-full md:w-auto"
                  >
                    New Search
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-black border-green-500">
                  <CardContent className="p-6">
                    <p className="text-green-400 text-sm mb-2">Total Visits</p>
                    <h3 className="text-3xl font-bold text-white">{analyticsData.totalVisits}</h3>
                  </CardContent>
                </Card>
                <Card className="bg-black border-green-500">
                  <CardContent className="p-6">
                    <p className="text-green-400 text-sm mb-2">Total Mails</p>
                    <h3 className="text-3xl font-bold text-white">{analyticsData.totalMails}</h3>
                  </CardContent>
                </Card>
                <Card className="bg-black border-green-500">
                  <CardContent className="p-6">
                    <p className="text-green-400 text-sm mb-2">Total Earnings</p>
                    <h3 className="text-3xl font-bold text-white">{analyticsData.earnings} SOL</h3>
                  </CardContent>
                </Card>
                <Card className="bg-black border-green-500">
                  <CardContent className="p-6">
                    <p className="text-green-400 text-sm mb-2">Last Visit</p>
                    <h3 className="text-xl font-bold text-white">
                      {new Date(analyticsData.lastVisited).toLocaleDateString()}
                    </h3>
                  </CardContent>
                </Card>
              </div>

              {analyticsData.mailTimestamps && analyticsData.mailTimestamps.length > 0 && (
                <Card className="bg-black border-green-500 mt-6">
                  <CardHeader className="border-b border-green-500/30">
                    <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {analyticsData.mailTimestamps.slice(-5).map((timestamp, i) => (
                        <li key={i} className="text-gray-300 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          Mail received on {new Date(timestamp).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>

        <footer className="bg-black bg-opacity-90 backdrop-blur-md border-t border-green-500 py-3 sm:py-4 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              &copy; 2025 X-Mailer. All rights reserved. | Encrypted with Solana-Blinks
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}