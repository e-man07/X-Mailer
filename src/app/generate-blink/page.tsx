import GenerateBlinkForm from '@/components/ui/generate-blink-form'
import React from "react";


export default function GenerateBlinkPage() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      <div className="fixed inset-0 bg-[url('/grid.png')] opacity-10 z-0"></div>
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-2 glitch" data-text="EmailBlink">
            EmailBlink
          </h1>
          <h2 className="text-2xl text-green-400 glitch" data-text="Generate Blink">
            Generate Blink
          </h2>
        </div>
        <GenerateBlinkForm />
      </div>
    </div>
  )
}