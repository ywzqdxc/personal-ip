'use client'

import { motion } from 'framer-motion'

interface Props {
  photos: string[]
  accentColor: string
}

export function PhotoStrip({ photos, accentColor }: Props) {
  if (photos.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-3 mt-6 scrollbar-hide">
      {photos.map((url, i) => (
        <motion.div
          key={url + i}
          className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden cursor-zoom-in"
          whileHover={{ scale: 1.05, zIndex: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ boxShadow: `0 0 0 1px ${accentColor}33` }}
        >
          <img src={url} alt="" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  )
}
