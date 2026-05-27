import { getProjectList } from '@/lib/api/projects'
import { ProjectCard } from '@/components/projects/ProjectCard'

export const revalidate = 3600

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjectList>> = []
  try {
    projects = await getProjectList()
  } catch (e) {
    console.error('Failed to fetch projects:', e)
  }

  return (
    <main className="min-h-screen bg-[#FDF6EE] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-[#2E1A0E] mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          PROJECTS
        </h1>
        <p className="text-[#B07050] mb-12">Things I've built.</p>

        {projects.length === 0 ? (
          <p className="text-[#B07050]">暂无项目，请先在管理后台添加。</p>
        ) : (
          <div>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
