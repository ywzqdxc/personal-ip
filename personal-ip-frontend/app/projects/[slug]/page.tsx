import { getProjectBySlug, getProjectList } from '@/lib/api/projects'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const projects = await getProjectList()
    return projects.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  let project: Awaited<ReturnType<typeof getProjectBySlug>> = null
  try {
    project = await getProjectBySlug(slug)
  } catch (e) {
    console.error(e)
  }

  if (!project) notFound()

  const techList = project.techStack ? project.techStack.split(',') : []

  return (
    <main className="min-h-screen bg-[#FDF6EE] pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* 封面图 */}
        {project.coverUrl && (
          <div className="w-full h-64 rounded-xl overflow-hidden mb-8">
            <img src={project.coverUrl} alt={project.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 标题 */}
        <h1 className="text-5xl font-bold text-[#2E1A0E] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {project.name}
        </h1>

        {/* 描述 */}
        {project.description && (
          <p className="text-[#2E1A0E] text-lg mb-6">{project.description}</p>
        )}

        {/* 技术栈徽章 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {techList.map((tech) => (
            <span
              key={tech}
              className="text-sm px-3 py-1 rounded-full bg-[#2E1A0E]/10 text-[#E8855A] font-mono border border-[#E8855A]/30"
            >
              {tech.trim()}
            </span>
          ))}
        </div>

        {/* 外链 */}
        <div className="flex gap-4 mb-10">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
               className="px-4 py-2 rounded border border-[#E8C9B0] text-[#2E1A0E] hover:border-[#E8855A] transition-colors text-sm">
              GitHub →
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
               className="px-4 py-2 rounded bg-[#E8855A] text-[#FDF6EE] font-bold text-sm hover:bg-[#C45A30] transition-colors">
              Live Demo →
            </a>
          )}
        </div>

        {/* Markdown 正文 */}
        {project.content && (
          <div className="max-w-none">
            <pre className="whitespace-pre-wrap text-[#2E1A0E] text-sm leading-relaxed">
              {project.content}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}
