import { getTravelDiaryList } from '@/lib/api/travel'
import { DiaryChapter } from '@/components/travel/DiaryChapter'

export const revalidate = 3600

export default async function TravelPage() {
  let diaries: Awaited<ReturnType<typeof getTravelDiaryList>> = []
  try {
    diaries = await getTravelDiaryList()
  } catch {
    // 后端未启动或无数据时静默降级
  }

  // 没有已发布内容时，直接展示 bali2026 原始模板（全屏 iframe）
  if (diaries.length === 0) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <iframe
          src="/bali2026.html"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Travel Journal"
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* 页面标题 */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-white mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            TRAVEL
          </h1>
          <p className="text-gray-400"
             style={{ fontFamily: "'Caveat', cursive" }}>
            每一次出发，都是一次重新认识自己。
          </p>
        </div>

        {/* 左侧导航 + 正文两栏（大屏） */}
        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
          {/* 章节导航（桌面端固定侧栏） */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-mono">
                Chapters
              </p>
              <nav className="space-y-2">
                {diaries.map((diary) => (
                  <a
                    key={diary.id}
                    href={`#chapter-${diary.id}`}
                    className="block text-sm text-gray-400 hover:text-white transition-colors py-1 border-l-2 border-transparent hover:border-white pl-3"
                  >
                    {diary.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* 章节内容 */}
          <div>
            {diaries.map((diary, index) => (
              <DiaryChapter key={diary.id} diary={diary} index={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
