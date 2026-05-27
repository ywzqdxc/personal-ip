import { getPublishedThoughts } from '@/lib/api/thoughts'

export const revalidate = 3600

export default async function ThoughtsPage() {
  let thoughts: Awaited<ReturnType<typeof getPublishedThoughts>> = []
  try {
    thoughts = await getPublishedThoughts()
  } catch (e) {
    console.error('Failed to fetch thoughts:', e)
  }

  const moods: Record<string, string> = {
    '开心': '😊', '调试中': '🔧', '思考': '🤔', '疲惫': '😮‍💨',
    '灵感': '💡', '平静': '🌿', '兴奋': '🎉', '困惑': '❓',
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          THOUGHTS
        </h1>
        <p className="text-gray-400 mb-12" style={{ fontFamily: "'Caveat', cursive" }}>
          Fragmentos de la mente. 思绪的碎片。
        </p>

        {thoughts.length === 0 ? (
          <p className="text-gray-500">暂无随想，请在管理后台添加。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {thoughts.map((thought) => (
              <div
                key={thought.id}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#AFFF00]/20 transition-all"
              >
                <p className="text-gray-200 text-sm leading-relaxed mb-3"
                   style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
                  {thought.content}
                </p>
                <div className="flex items-center justify-between">
                  {thought.mood && (
                    <span className="text-xs text-gray-500">
                      {moods[thought.mood] || ''} {thought.mood}
                    </span>
                  )}
                  {thought.tags && (
                    <div className="flex gap-1">
                      {thought.tags.split(',').map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {thought.imageUrl && (
                  <img src={thought.imageUrl} alt="" className="mt-3 w-full h-40 object-cover rounded-lg" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
