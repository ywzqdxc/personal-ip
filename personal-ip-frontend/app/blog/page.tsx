import Link from 'next/link'
import { getPublishedArticles, type Article } from '@/lib/api/articles'

export const revalidate = 3600

const MOCK_ARTICLE_LIST: Article[] = [
  {
    id: 1, title: 'Exploring Warm Aesthetics in Modern UI Design',
    slug: 'exploring-warm-aesthetics',
    coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
    summary: '暖色系不是一种风格，而是一种态度——让像素拥有温度，让界面成为归宿。',
    content: null, tags: 'Design,UI,CSS', category: 'Tech',
    pinned: false, viewCount: 312, createTime: '2026-05-20T10:00:00',
  },
  {
    id: 2, title: '旅行的意义，不在于终点',
    slug: 'the-meaning-of-travel',
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
    summary: '旅行改变的不是脚下的土地，而是你看待世界的方式。',
    content: null, tags: '旅行,随想', category: 'Life',
    pinned: false, viewCount: 189, createTime: '2026-04-15T08:30:00',
  },
  {
    id: 3, title: 'Building with Next.js 16 App Router',
    slug: 'nextjs-16-app-router',
    coverUrl: null,
    summary: 'Server Components, ISR, and everything in between.',
    content: null, tags: 'Next.js,React', category: 'Tech',
    pinned: true, viewCount: 540, createTime: '2026-03-01T14:00:00',
  },
]

const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@300;400;500&family=Caveat:wght@600&display=swap');",
  '.blog-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }',
  '.blog-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(46,26,14,0.09); }',
  '.blog-card:hover .blog-card-arrow { color: #C45A30 !important; }',
]
const pageCss = CSS_LINES.join('\n')

export default async function BlogPage() {
  let articles: Article[] = []
  try {
    articles = await getPublishedArticles().catch(() => [])
    if (articles.length === 0) articles = MOCK_ARTICLE_LIST
  } catch (e) {
    console.error('Failed to fetch articles:', e)
    articles = MOCK_ARTICLE_LIST
  }

  return (
    <main className="min-h-screen bg-[#FDF6EE] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-[#2E1A0E] mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          BLOG
        </h1>
        <p className="text-[#B07050] mb-12">Writing about tech, life, and everything in between.</p>

        {articles.length === 0 ? (
          <p className="text-[#B07050]">暂无文章，请在管理后台添加。</p>
        ) : (
          <div>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="blog-card block border-b border-[#E8C9B0]/60 py-6 group -mx-4 px-4 rounded-lg"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-start gap-6">
                  {article.coverUrl && (
                    <div className="flex-shrink-0 w-24 h-16" style={{ borderRadius: 10, overflow: 'hidden' }}>
                      <img src={article.coverUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {article.pinned && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#E8855A]/20 text-[#E8855A] font-mono">PINNED</span>
                      )}
                      {article.category && (
                        <span className="text-xs text-[#B07050] font-mono">{article.category}</span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-[#2E1A0E] group-hover:text-[#C45A30] transition-colors">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-[#B07050] text-sm mt-1 line-clamp-2">{article.summary}</p>
                    )}
                    {article.tags && (
                      <div className="flex gap-1 mt-2">
                        {article.tags.split(',').slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-[#B07050]">#{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="blog-card-arrow text-[#B07050] mt-1 transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style>{pageCss}</style>
    </main>
  )
}
