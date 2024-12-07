'use client'

import GenerateBlinkForm from '@/components/ui/generate-blink-form'
import { motion } from 'framer-motion'
import React from "react";
import { ReactNode } from 'react'


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



export default function GenerateBlinkPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-green-500 font-mono">
      <div className="fixed inset-0 opacity-20 z-0"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-90 backdrop-blur-md border-b border-green-500">
          <div className="container mx-auto px-4 py-4">
            <div className="text-2xl font-bold glitch" data-text="X-Mailer">
              <NavLink href="/">X-Mailer</NavLink>
            </div>
          </div>

        </header>

        <main className="container mx-auto px-4 pt-24 pb-12 flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center h-full"
          > 
            <h1 className="text-4xl md:text-6xl font-bold mb-6 glitch" data-text="Generate Blink">
              Generate Blink
            </h1>


          </motion.div> 

          <div>
            <GenerateBlinkForm />
          </div>
        </main>

        <footer className="bg-black bg-opacity-90 backdrop-blur-md border-t border-green-500 py-4 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2024 X-Mailer. All rights reserved. | Encrypted with Solana-Blinks
            </p>
          </div>
        </footer>



      </div>

    </div>
  )

}