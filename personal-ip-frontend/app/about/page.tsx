import { getTeamMembers } from '@/lib/api/team'

export const revalidate = 3600

export default async function AboutPage() {
  let members: Awaited<ReturnType<typeof getTeamMembers>> = []
  try { members = await getTeamMembers() } catch (e) { console.error(e) }

  return (
    <main className="min-h-screen bg-[#FDF6EE] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-[#2E1A0E] mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          ABOUT
        </h1>
        <p className="text-[#B07050] mb-16" style={{ fontFamily: "'Caveat', cursive" }}>
          About me and the team.
        </p>

        {/* 个人介绍 */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-[#2E1A0E] mb-4">Who I am</h2>
          <p className="text-[#2E1A0E] leading-relaxed">
            A developer, traveler, and lifelong learner. Passionate about building beautiful,
            functional web experiences. Based somewhere between code and the open road.
          </p>
        </section>

        {/* 团队成员 */}
        {members.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#2E1A0E] mb-8">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {members.map(m => (
                <div key={m.id} className="flex items-start gap-4 p-6 rounded-2xl border border-[#E8C9B0]/60 bg-[#2E1A0E]/[0.03]">
                  {m.avatarUrl && (
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-[#2E1A0E]">{m.name}</h3>
                    {m.role && <p className="text-sm text-[#E8855A] font-mono">{m.role}</p>}
                    {m.bio && <p className="text-sm text-[#B07050] mt-1">{m.bio}</p>}
                    <div className="flex gap-3 mt-2">
                      {m.githubUrl && (
                        <a href={m.githubUrl} target="_blank" className="text-xs text-[#B07050] hover:text-[#C45A30]">GitHub</a>
                      )}
                      {m.linkedinUrl && (
                        <a href={m.linkedinUrl} target="_blank" className="text-xs text-[#B07050] hover:text-[#C45A30]">LinkedIn</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
