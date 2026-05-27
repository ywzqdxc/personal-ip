import { getArticleBySlug, getPublishedArticles } from '@/lib/api/articles'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try { const articles = await getPublishedArticles(); return articles.map(a => ({ slug: a.slug })) }
  catch { return [] }
}

export const revalidate = 3600

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let article = null
  try { article = await getArticleBySlug(slug) } catch (e) { console.error(e) }
  if (!article) notFound()

  return (
    <main className="min-h-screen bg-[#FDF6EE] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {article.coverUrl && (
          <div className="w-full h-64 rounded-xl overflow-hidden mb-8">
            <img src={article.coverUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-5xl font-bold text-[#2E1A0E] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {article.title}
        </h1>
        {article.category && <span className="text-xs text-[#B07050] font-mono">{article.category}</span>}
        {article.summary && <p className="text-[#2E1A0E] text-lg mt-4 mb-6">{article.summary}</p>}
        {article.tags && (
          <div className="flex gap-2 mb-8">
            {article.tags.split(',').map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded bg-[#2E1A0E]/10 text-[#B07050]">{t.trim()}</span>
            ))}
          </div>
        )}
        {article.content && (
          <pre className="whitespace-pre-wrap text-[#2E1A0E] text-sm leading-relaxed">{article.content}</pre>
        )}
      </div>
    </main>
  )
}
