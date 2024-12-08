'use client'

import { useState, ReactNode } from 'react'
import { motion } from 'framer-motion'
import HackerLoader from '@/components/ui/HackerLoader'

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
  

export default function AnalyticsDashboard() {
    const [showLoader, setShowLoader] = useState(true)

    const handleLoaderComplete = () => {
        setShowLoader(false)
    }

    if (showLoader) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <HackerLoader duration={5000} onComplete={handleLoaderComplete} />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-green-500 font-mono">
            <div className="fixed inset-0 opacity-20 z-0"></div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-90 backdrop-blur-md border-b border-green-500">
                    <div className="container mx-auto px-4 py-4">
                        <div className="text-2xl font-bold glitch text-center sm:text-left" data-text="X-Mailer">
                            <NavLink href="/">X-Mailer</NavLink>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 pt-24 flex-grow">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center justify-center h-full text-center"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 glitch whitespace-nowrap overflow-hidden text-ellipsis" data-text="Analytics Dashboard">
                            Analytics Dashboard
                        </h1>

                        <div className="text-xl sm:text-2xl md:text-4xl font-bold mb-6 glitch whitespace-nowrap" data-text="Coming Soon">
                            Coming Soon...
                        </div>
                        <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 max-w-2xl px-4">
                            The Blink Creator Analytics Dashboard is under development. Stay tuned for powerful insights and features!
                        </p>
                    </motion.div>
                </main>

                <footer className="bg-black bg-opacity-90 backdrop-blur-md border-t border-green-500 py-4 mt-auto">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-xs sm:text-sm text-gray-500">
                            &copy; 2024 X-Mailer. All rights reserved. | Encrypted with Solana-Blinks
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    )
}