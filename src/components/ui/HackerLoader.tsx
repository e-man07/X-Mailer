'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface HackerLoaderProps {
  onComplete: () => void
  duration: number
}

export default function HackerLoader({ onComplete, duration }: HackerLoaderProps) {
  const [text, setText] = useState('Initializing')
  const [progress, setProgress] = useState(0)
  const [hackingMessages, setHackingMessages] = useState<string[]>([])

  useEffect(() => {
    const textInterval = setInterval(() => {
      setText(prevText => prevText.length < 20 ? prevText + '.' : 'Initializing')
    }, 500)

    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress < 100) {
          return prevProgress + 1
        } else {
          clearInterval(progressInterval)
          return 100
        }
      })
    }, duration / 100) // Ensure progress completes within the specified duration

    const messageInterval = setInterval(() => {
      setHackingMessages(prevMessages => {
        const newMessage = getRandomHackingMessage()
        return [...prevMessages, newMessage].slice(-5) // Keep only the last 5 messages
      })
    }, 600)

    const completionTimer = setTimeout(() => {
      onComplete()
    }, duration)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
      clearInterval(messageInterval)
      clearTimeout(completionTimer)
    }
  }, [duration, onComplete])

  const getRandomHackingMessage = () => {
    const messages = [
      'Bypassing firewall...',
      'Encrypting connection...',
      'Scanning for vulnerabilities...',
      'Injecting payload...',
      'Decrypting secure channels...',
      'Establishing secure tunnel...',
      'Masking IP address...',
      'Deploying stealth protocols...',
      'Initiating quantum encryption...',
      'Overriding security measures...'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="text-green-500 font-mono">
      <motion.div
        className="text-4xl mb-8"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        {text}
      </motion.div>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <div className="mb-8">{progress}%</div>
      <div className="text-sm space-y-2">
        {hackingMessages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.div>
        ))}
      </div>
    </div>
  )
}