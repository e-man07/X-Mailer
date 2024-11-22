'use client'

import { useState, ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Twitter, Zap, Menu, X, Lock, Shield, Globe, Divide } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HackerLoader from '@/components/ui/HackerLoader'

interface NavLinkProps {
  href: string;
  children: ReactNode;
  [key: string]: any;
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

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [glitchText, setGlitchText] = useState('EmailBlink')
  const [showLoader, setShowLoader] = useState(false)
  const router = useRouter()

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const handleInitiateSequence = () => {
    setShowLoader(true)
  }

  const handleLoaderComplete = () => {
    router.push('/generate-blink')
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      <AnimatePresence mode="wait">
        {showLoader ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <HackerLoader onComplete={handleLoaderComplete} duration={3000} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-[url('/grid.png')] opacity-20 z-0"></div>
            <div className="relative z-10">
              <header className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-90 backdrop-blur-md border-b border-green-500">
                <div className="container mx-auto px-4 py-4">
                  <nav className="flex items-center justify-between">
                    <motion.div 
                      className="text-2xl font-bold glitch"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      data-text={glitchText}
                    >
                      {glitchText}
                    </motion.div>
                    <div className="hidden md:flex space-x-4">
                      <NavLink href="#how-it-works">How It Works</NavLink>
                      <NavLink href="#features">Features</NavLink>
                      <NavLink href="#get-started">Get Started</NavLink>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/*<Button variant="outline" className="hidden md:inline-flex text-green-500 border-green-500 hover:bg-green-500 hover:text-black">
                        Sign In
                      </Button> */}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="md:hidden text-green-500"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        {isMenuOpen ? <X /> : <Menu />}
                      </Button>
                    </div>
                  </nav>
                </div>
              </header>

              <main className="container mx-auto px-4 pt-24">
                <motion.section className="text-center py-20" {...fadeIn}>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 glitch" data-text="Send Emails Directly from">
                    Send Emails Directly from{' '}
                    <TypeAnimation
                      sequence={[
                        'Twitter',
                        2000,
                        'X',
                        2000
                      ]}
                      wrapper="span"
                      speed={50}
                      repeat={Infinity}
                      className="text-blue-500"
                    />
                  </h1>
                  <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Generate an encrypted email blink, post it on Twitter, and let anyone send you a secure email with just a click.
                  </p>
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-full text-lg"
                    onClick={handleInitiateSequence}
                  >
                    Initiate Sequence
                  </Button>
                </motion.section>

                <motion.section id="how-it-works" className="py-20" {...fadeIn}>
                  <h2 className="text-3xl font-bold mb-12 text-center glitch" data-text="Protocol">Protocol</h2>
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <ol className="space-y-8 text-gray-300">
                        {[
                          "Generate your unique encrypted email blink",
                          "Deploy the blink on your Twitter profile or in a tweet",
                          "Followers activate the blink to send you a secure email"
                        ].map((step, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-center gap-4 "
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                          >
                            <div className="bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="flex-1">{step}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>
                    <motion.div 
                      className="bg-gradient-to-br from-green-500 to-blue-500 rounded-lg p-1"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="bg-black rounded-lg p-6 border border-green-500">
                        <div className="flex items-center mb-4">
                          <Twitter className="text-blue-400 mr-2" />
                          <span className="font-bold">Encrypted Transmission</span>
                        </div>
                        <p className="mb-4">Secure channel established. Send encrypted email:</p>
                        <div className="bg-green-500 text-black px-4 py-2 rounded-md inline-flex items-center">
                          <Lock className="mr-2" /> 
                          <span>email.blink/3nc0d3d</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.section>

                <motion.section id="features" className="py-20 text-center" {...fadeIn}>
                  <h2 className="text-3xl font-bold mb-12 glitch" data-text="System Capabilities">System Capabilities</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { icon: Zap, title: "Quantum Encryption", description: "State-of-the-art encryption for unbreakable communication." },
                      { icon: Shield, title: "Stealth Mode", description: "Keep your true email address hidden from prying eyes." },
                      { icon: Globe, title: "Decentralized Network", description: "Leverage the power of distributed systems for ultimate privacy." }
                    ].map((feature, index) => (
                      <motion.div 
                        key={index}
                        className="bg-black rounded-lg p-6 border border-green-500"
                        whileHover={{ y: -10, boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="text-green-400 w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                <motion.section id="get-started" className="py-20" {...fadeIn}>
                  <div className="bg-black rounded-lg p-8 text-center border border-green-500">
                    <h2 className="text-3xl font-bold mb-4 glitch" data-text="Initialize Sequence">Initialize Sequence</h2>
                    <p className="text-xl mb-6">Enter the matrix and subscribe to our EmailBlink now.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-black text-green-500 border-green-500 px-4 py-2 rounded-md max-w-xs w-full placeholder-green-700"
                      />
                      <Button className="bg-green-500 text-black px-6 py-2 rounded-md hover:bg-green-600">
                        Subscribe EmailBlink
                      </Button>
                    </div>
                  </div>
                </motion.section>
              </main>

              <footer className="container mx-auto px-4 py-8 mt-12 text-center text-gray-400 border-t border-green-500">
                <p>&copy; 2024 EmailBlink. All rights reserved. | Encrypted with 256-bit AES</p>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}