'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Lock, Zap, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

// Zod Schema for Form Validation
const blinkFormSchema = z.object({
  codename: z.string()
    .min(3, { message: "Codename must be at least 3 characters" })
    .max(20, { message: "Codename cannot exceed 20 characters" }),
  
  email: z.string()
    .email({ message: "Invalid email address" }),
  
  solanaKey: z.string()
    .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, { 
      message: "Invalid Solana public key" 
    }),
  
  description: z.string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
  
  image: z.instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image must be 5MB or less"
    })
})

type BlinkFormData = z.infer<typeof blinkFormSchema>

export default function GenerateBlinkForm() {
  const [generatedBlink, setGeneratedBlink] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<BlinkFormData>({
    resolver: zodResolver(blinkFormSchema),
    defaultValues: {
      codename: '',
      email: '',
      solanaKey: '',
      description: ''
    }
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSubmitError(null)
      
      if (!file.type.startsWith('image/')) {
        setSubmitError('Please upload only image files')
        e.target.value = ''
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.onerror = () => {
        setSubmitError('Failed to read image file')
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: BlinkFormData) => {
    try {
      setSubmitError(null)
      let imageUrl = null
      
      if (data.image) {
        try {
          const formData = new FormData()
          formData.append('file', data.image)
          formData.append('folder', 'blinks')

          const uploadResponse = await fetch('/api/cloudinary', {
            method: 'POST',
            body: formData,
          })

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image')
          }

          const uploadResult = await uploadResponse.json()
          imageUrl = uploadResult.url

          if (!imageUrl) {
            throw new Error('Failed to get image URL from upload')
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError)
          throw new Error('Failed to upload image. Please try again.')
        }
      }

      const uniqueBlinkId = `blink-${nanoid()}`

      const createBlinkResponse = await fetch('/api/blinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueBlinkId,
          codename: data.codename,
          email: data.email,
          solanaKey: data.solanaKey,
          description: data.description,
          imageUrl: imageUrl || undefined
        }),
      })

      if (!createBlinkResponse.ok) {
        throw new Error('Failed to create blink')
      }

      reset()
      setGeneratedBlink(uniqueBlinkId)
      setImagePreview(null)
      setSubmitError(null)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 bg-opacity-50 p-8 rounded-lg border border-green-500 shadow-lg shadow-green-500/20 max-w-2xl mx-auto backdrop-blur-sm"
    >
      {submitError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="codename" className="text-green-400 glitch" data-text="Codename">Codename</Label>
          <Controller
            name="codename"
            control={control}
            render={({ field }) => (
              <div>
                <Input 
                  {...field}
                  className="bg-black bg-opacity-50 text-green-500 border-green-500 mt-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your codename"
                />
                {errors.codename && (
                  <p className="text-red-500 mt-1">{errors.codename.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-green-400 glitch" data-text="Encrypted Channel (Email)">
            Encrypted Channel (Email)
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div>
                <Input 
                  {...field}
                  type="email"
                  className="bg-black bg-opacity-50 text-green-500 border-green-500 mt-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your secure email"
                />
                {errors.email && (
                  <p className="text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <Label htmlFor="solanaKey" className="text-green-400 glitch" data-text="Solana Public Key">
            Solana Public Key
          </Label>
          <Controller
            name="solanaKey"
            control={control}
            render={({ field }) => (
              <div>
                <Input 
                  {...field}
                  className="bg-black bg-opacity-50 text-green-500 border-green-500 mt-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your Solana public key address"
                />
                {errors.solanaKey && (
                  <p className="text-red-500 mt-1">{errors.solanaKey.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <Label htmlFor="image" className="text-green-400 glitch" data-text="Upload Stealth Image">
            Upload Stealth Image
          </Label>
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <div>
                <div className="mt-1 flex items-center space-x-4">
                  <Input 
                    {...field}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      onChange(file)
                      handleFileUpload(e)
                    }}
                    className="bg-black bg-opacity-50 text-green-500 border-green-500 file:bg-green-500 file:text-black file:border-0 file:rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  <Upload className="text-green-500" />
                </div>
                {errors.image && (
                  <p className="text-red-500 mt-1">{errors.image.message}</p>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Image Preview" 
                      className="max-w-[200px] max-h-[200px] rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-green-400 glitch" data-text="Mission Brief">
            Mission Brief
          </Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <Textarea 
                  {...field}
                  className="bg-black bg-opacity-50 text-green-500 border-green-500 mt-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe your mission (optional)"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-green-500 text-black hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Zap className="animate-pulse mr-2" />
              Encrypting...
            </>
          ) : (
            <>
              <Lock className="mr-2" />
              Generate Encrypted Blink
            </>
          )}
        </Button>
      </form>

      {generatedBlink && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-green-500 bg-opacity-20 border border-green-500 text-green-400 rounded-md"
        >
          <p className="font-bold mb-2 glitch" data-text="Your Encrypted Blink:">Your Encrypted Blink:</p>
          <code className="block p-2 bg-black bg-opacity-50 text-green-500 rounded">{generatedBlink}</code>
        </motion.div>
      )}
    </motion.div>
  )
}