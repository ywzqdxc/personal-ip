import Link from 'next/link'
import { getPublishedArticles } from '@/lib/api/articles'

export const revalidate = 3600

export default async function BlogPage() {
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = []
  try {
    articles = await getPublishedArticles()
  } catch (e) {
    console.error('Failed to fetch articles:', e)
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          BLOG
        </h1>
        <p className="text-gray-400 mb-12">Writing about tech, life, and everything in between.</p>

        {articles.length === 0 ? (
          <p className="text-gray-500">暂无文章，请在管理后台添加。</p>
        ) : (
          <div>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="block border-b border-white/10 py-6 group hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
              >
                <div className="flex items-start gap-6">
                  {article.coverUrl && (
                    <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden">
                      <img src={article.coverUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {article.pinned && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#AFFF00]/20 text-[#AFFF00] font-mono">PINNED</span>
                      )}
                      {article.category && (
                        <span className="text-xs text-gray-500 font-mono">{article.category}</span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-white group-hover:text-[#AFFF00] transition-colors">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{article.summary}</p>
                    )}
                    {article.tags && (
                      <div className="flex gap-1 mt-2">
                        {article.tags.split(',').slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-gray-600">#{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-600 group-hover:text-white transition-colors mt-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
