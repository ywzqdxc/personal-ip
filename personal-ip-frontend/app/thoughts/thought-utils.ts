import type { Thought } from '@/lib/api/thoughts'

/* ── Mock Data (32 条文字/图片 + 2 条视频) ── */

export const MOCK_THOUGHTS: Thought[] = [
  /* ── 视频帖子（我们的原有内容，置顶） ── */
  {
    id: 0,
    content: '果然深情的人喝不醉',
    mood: '微醺',
    tags: '深夜,情绪',
    imageUrl: null,
    videoUrl: '/videos/thoughts/1.mp4',
    createTime: '2026-05-29T01:30:00',
  },
  {
    id: -1,
    content: '雏菊的花语是：纯洁与深藏的爱',
    mood: '温柔',
    tags: '花语,深夜',
    imageUrl: null,
    videoUrl: '/videos/thoughts/2.mp4',
    createTime: '2026-05-28T02:15:00',
  },
  /* ── 图文帖子（32 条） ── */
  {
    id: 1,
    content: '今天的光线很好，随手拍了几张。相机永远是最好的记忆装置。',
    mood: '平静',
    tags: 'Photography,Life',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    createTime: '2026-05-28T15:30:00',
  },
  {
    id: 2,
    content: '花了整个下午把工作台重新整理了一遍。Less is more — 这句话适用于代码，也适用于桌面。',
    mood: '平静',
    tags: 'Life,Minimalism',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
    createTime: '2026-05-27T17:00:00',
  },
  {
    id: 3,
    content:
      "一直在找 Tailwind 暖色系配置，终于整理出来了：\n```js\n// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        'warm': {\n          50:  '#FDF6EE',\n          100: '#F5E6D3',\n          500: '#C45A30',\n          900: '#2E1A0E',\n        },\n      },\n    },\n  },\n}\n```",
    mood: '调试中',
    tags: 'Tailwind,CSS,Frontend',
    imageUrl: null,
    createTime: '2026-05-27T21:00:00',
  },
  {
    id: 4,
    content: '深夜的咖啡总是特别香。不是因为咖啡变了，是因为世界安静下来了。',
    mood: '思考',
    tags: 'Life,深夜',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    createTime: '2026-05-26T02:30:00',
  },
  {
    id: 5,
    content:
      '旅行的意义，不在于终点的风景，而在于路上的心境。\n\n每次出发，都是一次轻微的告别。告别熟悉的街道，告别习惯的节奏，告别那个被日常定义的自己。\n\n然后在陌生的城市里，重新认识自己。',
    mood: '思考',
    tags: '旅行,随想',
    imageUrl: null,
    createTime: '2026-05-24T09:15:00',
  },
  {
    id: 6,
    content: '极简主义设计研究。',
    mood: '灵感',
    tags: 'Minimalism,Design,WebDev',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    createTime: '2026-05-23T14:00:00',
  },
  {
    id: 7,
    content:
      '写代码三小时，bug 修了两小时，剩下一小时在看文档。这大概就是编程的真相。',
    mood: '调试中',
    tags: 'Dev,Life',
    imageUrl: null,
    createTime: '2026-05-22T23:00:00',
  },
  {
    id: 8,
    content: 'Morning in Bali.',
    mood: '平静',
    tags: 'Travel,Bali,Morning',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    createTime: '2026-05-21T07:00:00',
  },
  {
    id: 9,
    content:
      'The best code is the code you never have to write.\n\n最好的代码是你永远不需要写的代码。这句话不是鼓励懒惰，而是提醒我们：真正的工程能力，在于找到不必要的复杂度并消除它。\n\n每次重构，都是一次对过去自己的谅解。',
    mood: '思考',
    tags: 'Engineering,Philosophy',
    imageUrl: null,
    createTime: '2026-05-19T16:30:00',
  },
  {
    id: 10,
    content:
      '今天收到了新键盘，机械轴的声音真的很治愈。工作效率直接提升了 0%，但快乐提升了 100%。',
    mood: '开心',
    tags: 'Life,Keyboard',
    imageUrl: null,
    createTime: '2026-05-17T18:00:00',
  },
  {
    id: 11,
    content:
      "CSS Grid 做瀑布流最简单的方法：\n```css\n.masonry {\n  columns: 3;\n  column-gap: 16px;\n}\n.card {\n  break-inside: avoid;\n  margin-bottom: 16px;\n  display: inline-block;\n  width: 100%;\n}\n```\n真的不需要 JS！",
    mood: '灵感',
    tags: 'CSS,Layout,Tips',
    imageUrl: null,
    createTime: '2026-05-15T11:00:00',
  },
  {
    id: 12,
    content: "傍晚跑了 10 公里，配速 4'55\"。耳机里放着坂本龙一的 Merry Christmas Mr. Lawrence，每一步都踩在钢琴键上。",
    mood: '兴奋',
    tags: 'Running,Music',
    imageUrl: null,
    createTime: '2026-05-12T19:00:00',
  },
  {
    id: 13,
    content:
      "Rust 的所有权模型，学了三遍才真正理解：\n```rust\nfn main() {\n    let s1 = String::from(\"hello\");\n    let s2 = s1; // s1 被移动，不再有效\n    println!(\"{}\", s2); // OK\n    // println!(\"{}\", s1); // 编译错误！\n}\n```\n所有权不是限制，是自由——它让你不用再担心内存泄漏。",
    mood: '灵感',
    tags: 'Rust,Programming,Learning',
    imageUrl: null,
    createTime: '2026-05-10T22:00:00',
  },
  {
    id: 14,
    content: '逛了一下午书店，抱回来三本：一本关于日本庭园设计，一本村上春树的新散文集，还有一本 TypeScript 类型编程。收银员看我的眼神很有趣。',
    mood: '开心',
    tags: 'Reading,Books',
    imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&q=80',
    createTime: '2026-05-08T16:00:00',
  },
  {
    id: 15,
    content: '不要害怕写出烂代码。烂代码是可以重构的，但从未写下的代码永远不会变好。',
    mood: '思考',
    tags: 'Engineering,Motivation',
    imageUrl: null,
    createTime: '2026-05-05T11:30:00',
  },
  {
    id: 16,
    content: '周末早晨，阳光穿过百叶窗在桌上画出条纹。手冲咖啡，巴赫大提琴组曲，一个没有 IDE 的上午。偶尔需要这样的空白。',
    mood: '平静',
    tags: 'Life,Weekend,Music',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    createTime: '2026-05-03T09:00:00',
  },
  {
    id: 17,
    content: '调试了两天的问题，最后发现是少了一个 await。异步编程教会我最多的是：顺序很重要，但有时候你需要学会等待。',
    mood: '调试中',
    tags: 'Dev,JavaScript,Async',
    imageUrl: null,
    createTime: '2026-04-28T20:00:00',
  },
  {
    id: 18,
    content:
      "关于 React 19 的 Server Components：\n```tsx\n// 这是一个 Server Component\nasync function PostList() {\n  const posts = await db.post.findMany()\n  return <ul>{posts.map(p => <Post key={p.id} data={p} />)}</ul>\n}\n```\n直接在组件里写 await，不需要 useEffect 和 useState，这才是正确的方向。",
    mood: '灵感',
    tags: 'React,Next.js,SSR',
    imageUrl: null,
    createTime: '2026-04-25T14:00:00',
  },
  {
    id: 19,
    content: '乒乓球训练，今天终于学会了正手拉球的正确发力链：脚→腰→肩→臂→腕。不是手臂在打球，是整个身体在打球。教练说进步很明显。',
    mood: '开心',
    tags: 'TableTennis,Sports',
    imageUrl: null,
    createTime: '2026-04-22T20:30:00',
  },
  {
    id: 20,
    content: '设计系统的核心不是组件库，而是一套关于「什么是对的」的共同语言。当设计师和工程师用同一个词指代同一个东西的时候，沟通成本趋近于零。',
    mood: '思考',
    tags: 'Design,System,Engineering',
    imageUrl: null,
    createTime: '2026-04-18T15:00:00',
  },
  {
    id: 21,
    content: 'Cherry blossoms in full bloom.',
    mood: '平静',
    tags: 'Spring,Sakura,Photography',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&q=80',
    createTime: '2026-04-10T08:00:00',
  },
  {
    id: 22,
    content:
      "Linux 命令行效率技巧：\n```bash\n# 用 fzf 模糊搜索并 cd\ncd $(find . -type d | fzf)\n\n# 用 rg 和 fzf 搜索文件内容\nrg -l \"pattern\" | fzf --preview 'rg -p {}'\n\n# 批量重命名（用 rename）\nrename 's/old/new/' *.txt\n```\n终端就是第二双手。",
    mood: '灵感',
    tags: 'Linux,CLI,Productivity',
    imageUrl: null,
    createTime: '2026-04-05T21:00:00',
  },
  {
    id: 23,
    content:
      '三月的尾巴，下了一场温柔的雨。\n\n窗外梧桐树的嫩芽被洗得发亮。突然想起小时候，下雨天总是搬个小板凳坐在门口看雨，一看就是一个下午。\n\n那时候时间很慢，慢到可以数清每一滴雨。',
    mood: '平静',
    tags: 'Life,Spring,回忆',
    imageUrl: null,
    createTime: '2026-03-28T16:00:00',
  },
  {
    id: 24,
    content: '熬夜部署到凌晨三点，结果发现生产环境少了一个环境变量。lesson learned：永远不要在生产环境上做"最后一分钟"的修改。',
    mood: '疲惫',
    tags: 'Dev,DevOps,Lesson',
    imageUrl: null,
    createTime: '2026-03-20T03:30:00',
  },
  {
    id: 25,
    content: '读了 Clean Code 的第三章，函数应该只做一件事，做好这件事，并且只做这件事。好的函数名本身就是最好的注释。',
    mood: '思考',
    tags: 'Reading,CleanCode,Engineering',
    imageUrl: null,
    createTime: '2026-03-15T12:00:00',
  },
  {
    id: 26,
    content: 'Sunset over the city.',
    mood: '平静',
    tags: 'Photography,City,Sunset',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
    createTime: '2026-03-08T18:30:00',
  },
  {
    id: 27,
    content: '连续加班两周，终于把新版本推上线了。团队四个人挤在屏幕前看着监控曲线从红色变成绿色，那一刻的成就感无法言喻。',
    mood: '兴奋',
    tags: 'Dev,Team,Launch',
    imageUrl: null,
    createTime: '2026-02-28T22:00:00',
  },
  {
    id: 28,
    content:
      "数据库索引优化笔记：\n```sql\n-- 复合索引列顺序很重要！\n-- 把选择性高的列放在前面\nCREATE INDEX idx_user_status ON orders(user_id, status);\n```\n一个索引顺序的改变，查询时间从 2.3s 降到 12ms。",
    mood: '灵感',
    tags: 'Database,SQL,Performance',
    imageUrl: null,
    createTime: '2026-02-20T14:00:00',
  },
  {
    id: 29,
    content: '新年读到的最打动我的一段话：技术会过时，框架会换代，但你对问题的理解、对用户的共情、对优雅解决方案的追求——这些永远不会贬值。',
    mood: '思考',
    tags: 'Philosophy,Career,Growth',
    imageUrl: null,
    createTime: '2026-02-10T10:00:00',
  },
  {
    id: 30,
    content: 'Winter morning calm.',
    mood: '平静',
    tags: 'Winter,Morning,Photography',
    imageUrl: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=600&q=80',
    createTime: '2026-01-25T08:00:00',
  },
  {
    id: 31,
    content: '开始学习 Go 语言。从 Java 转过来最大的感受：没有继承、没有注解、没有泛型（好吧现在有了），但写起来异常清爽。少即是多又一次被验证。',
    mood: '思考',
    tags: 'Go,Programming,Learning',
    imageUrl: null,
    createTime: '2026-01-18T20:00:00',
  },
  {
    id: 32,
    content: '新的一年，新的笔记本。第一页写着："今年要写更多的代码，读更多的书，去更多的地方。"合上本子的时候，窗外的雪正好停了。',
    mood: '开心',
    tags: 'NewYear,Life,Goals',
    imageUrl: null,
    createTime: '2026-01-02T12:00:00',
  },
]

/* ── Constants ── */

export const MOOD_EMOJI: Record<string, string> = {
  '开心': '😊',
  '调试中': '🔧',
  '思考': '🤔',
  '疲惫': '😮‍💨',
  '灵感': '💡',
  '平静': '🌿',
  '兴奋': '🎉',
  '困惑': '❓',
  '微醺': '🍷',
  '温柔': '🌸',
}

/* ── Helpers ── */

export function fakeLikes(id: number): number {
  return (Math.abs(id) * 37 + 13) % 200 + 8
}

export function fakeComments(id: number): number {
  return (Math.abs(id) * 17 + 5) % 30 + 1
}

export function getCardType(thought: Thought): 'video' | 'photo' | 'code' | 'essay' | 'standard' {
  if (thought.videoUrl) return 'video'
  if (thought.imageUrl) return 'photo'
  if (thought.content.includes('```')) return 'code'
  if (thought.content.length > 120) return 'essay'
  return 'standard'
}

export function parseCodeContent(
  content: string,
): Array<{ type: 'text' | 'code'; text: string; lang?: string }> {
  const parts = content.split(/(```[\s\S]*?```)/g)
  return parts
    .map((part) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n?([\s\S]*?)```/)
        return {
          type: 'code' as const,
          text: match?.[2] || '',
          lang: match?.[1] || '',
        }
      }
      return { type: 'text' as const, text: part.trim() }
    })
    .filter((p) => p.text.length > 0)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${day} ${h}:${min}`
}
