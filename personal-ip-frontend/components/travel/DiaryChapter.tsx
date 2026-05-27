'use client'

import { motion } from 'framer-motion'
import { PhotoStrip } from './PhotoStrip'
import { parsePhotos, type TravelDiary } from '@/lib/api/travel'

interface Props {
  diary: TravelDiary
  index: number
}

export function DiaryChapter({ diary, index }: Props) {
  const photos = parsePhotos(diary.photos)

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="mb-24 scroll-mt-24"
      id={`chapter-${diary.id}`}
    >
      {/* 彩色章节线 */}
      <div
        className="w-12 h-1 mb-6 rounded-full"
        style={{ backgroundColor: diary.accentColor }}
      />

      {/* 封面 */}
      {diary.coverUrl && (
        <div className="w-full h-72 rounded-2xl overflow-hidden mb-8">
          <img
            src={diary.coverUrl}
            alt={diary.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 标题 & 元信息 */}
      <div className="mb-6">
        <h2
          className="text-4xl font-bold mb-2"
          style={{ color: diary.accentColor, fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {diary.title}
        </h2>
        <div className="flex gap-4 text-sm text-gray-400 font-mono">
          {diary.destination && <span>📍 {diary.destination}</span>}
          {diary.tripDate && <span>📅 {diary.tripDate}</span>}
        </div>
      </div>

      {/* 正文 */}
      {diary.content && (
        <div
          className="text-gray-300 leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
        >
          {diary.content}
        </div>
      )}

      {/* 胶卷相册 */}
      <PhotoStrip photos={photos} accentColor={diary.accentColor} />
    </motion.section>
  )
}
