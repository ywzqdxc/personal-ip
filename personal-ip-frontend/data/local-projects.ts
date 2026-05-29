export type ProjectCategory = 'agriculture' | 'web-dev' | 'creative'

export interface LocalProject {
  id: number
  name: string
  slug: string
  description: string | null
  coverUrl: string | null
  previewUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  techStack: string | null
  content: string | null
  featured: boolean
  createTime: string
  category: ProjectCategory
}

export const CATEGORY_LABELS: Record<ProjectCategory, { label: string; emoji: string }> = {
  agriculture: { label: 'Agriculture & Sustainability', emoji: '🌾' },
  'web-dev': { label: 'Web Development', emoji: '💻' },
  creative: { label: 'Creative & More', emoji: '🎨' },
}

export const localProjects: LocalProject[] = [
  // ===== Featured: Agriculture =====
  {
    id: 1,
    name: '3D Vertical Farm Model',
    slug: '3d-vertical-farm-model',
    description:
      'Designed and modeled a comprehensive 3D vertical farm using Google SketchUp, showcasing sustainable agriculture practices and innovative farming techniques for urban environments.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: '3D Modeling,SketchUp,Agriculture,Sustainability',
    content:
      '## About the Project\n\nA detailed 3D vertical farm model designed to demonstrate sustainable urban agriculture. The model includes:\n\n- Multi-level growing platforms\n- Automated irrigation systems\n- LED lighting arrays\n- Climate control infrastructure\n\n## Tools Used\n\n- Google SketchUp for 3D modeling\n- Photorealistic rendering techniques\n- Scale modeling for architectural precision',
    featured: true,
    createTime: '2024-01-15',
    category: 'agriculture',
  },
  {
    id: 2,
    name: 'Food Processing & Supply Chain',
    slug: 'food-processing-supply-chain',
    description:
      'Led complete farm-to-market supply chain for apple industry. Produced jams, jellies, and squashes from pulp extraction to bottling. Successfully sold ₹40,000 worth of products in a single day.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'Supply Chain,Food Processing,Marketing,Agriculture',
    content:
      '## Project Overview\n\nEnd-to-end management of an apple processing supply chain:\n\n### Production\n- Pulp extraction and processing\n- Jam, jelly, and squash manufacturing\n- Quality control and bottling\n\n### Sales\n- Direct marketing to consumers\n- Strategic pricing and distribution\n- ₹40,000 in single-day sales\n\n### Impact\n- Reduced post-harvest waste\n- Created local employment\n- Established repeat customer base',
    featured: true,
    createTime: '2024-02-20',
    category: 'agriculture',
  },
  {
    id: 3,
    name: 'Horticulture Farm Development',
    slug: 'horticulture-farm-development',
    description:
      'Built and maintained large-scale farms from scratch. Grafted and planted 2000 apple seedlings, 1200 apricot seedlings, and 200 guava seedlings. Prepared organic fertilizers and managed complete crop lifecycle.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'Horticulture,Organic Farming,Grafting,Sustainability',
    content:
      '## Farm Development\n\nLarge-scale horticulture project:\n\n### Plantation\n- 2000 apple seedlings grafted\n- 1200 apricot seedlings\n- 200 guava seedlings\n\n### Organic Practices\n- JEEVAMRIT preparation and application\n- GHANJIVAMRIT organic fertilizer\n- Natural pest management\n\n### Crop Management\n- Full lifecycle monitoring\n- Irrigation scheduling\n- Harvest optimization',
    featured: true,
    createTime: '2024-03-10',
    category: 'agriculture',
  },

  // ===== Web Dev =====
  {
    id: 4,
    name: 'E-Commerce for Local Businesses',
    slug: 'ecommerce-local-businesses',
    description:
      'Built professional websites for local shop owners to establish their online presence. Developed Shopify and WordPress-based e-commerce solutions with custom designs, payment integration, and inventory management.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'WordPress,Shopify,E-Commerce,Web Development',
    content:
      '## Project Summary\n\nCustom e-commerce solutions for local businesses:\n\n### Platforms\n- Shopify store development\n- WordPress WooCommerce sites\n- Custom theme design\n\n### Features\n- Payment gateway integration\n- Inventory management systems\n- Responsive mobile-first design\n- SEO optimization\n\n### Clients\n- Multiple local retailers\n- Restaurants and cafes\n- Service-based businesses',
    featured: false,
    createTime: '2024-04-05',
    category: 'web-dev',
  },
  {
    id: 5,
    name: 'Grammarly Clone',
    slug: 'grammarly-clone',
    description:
      'Developed a functional Grammarly clone with real-time text analysis, grammar checking capabilities, and an intuitive user interface for content editing.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: 'https://stackblitz.com/edit/web-platform-tww2qc?file=index.html',
    techStack: 'HTML,CSS,JavaScript,Text Analysis',
    content:
      '## Text Editor & Grammar Checker\n\nA browser-based text editor with:\n\n- Real-time grammar checking\n- Spelling suggestions\n- Character and word count\n- Clean, minimal interface\n\n### Tech Stack\n- Pure HTML/CSS/JavaScript\n- Custom text analysis algorithms\n- Responsive design',
    featured: false,
    createTime: '2024-05-12',
    category: 'web-dev',
  },
  {
    id: 6,
    name: 'React Logo with Speed Control',
    slug: 'react-logo-speed-control',
    description:
      'Created an animated React logo using pure HTML, CSS, and JavaScript featuring dynamic speed controls and engaging hover effects for interactive user experience.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'JavaScript,CSS Animations,Interactive',
    content:
      '## Interactive Animation\n\nA dynamic React logo animation:\n\n- Smooth CSS-based rotation\n- Adjustable speed slider\n- Hover-based interaction effects\n- Pure frontend implementation\n\n### Learning Outcome\n- CSS animation keyframes\n- JavaScript DOM manipulation\n- Event-driven UI updates',
    featured: false,
    createTime: '2024-06-18',
    category: 'creative',
  },
  {
    id: 7,
    name: 'Facebook Login Clone',
    slug: 'facebook-login-clone',
    description:
      "Recreated Facebook's login page using Tailwind CSS with pixel-perfect design accuracy. Converted frontend into fully functional backend with authentication system.",
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'Tailwind CSS,UI Design,Authentication,Frontend',
    content:
      '## UI Clone & Full-Stack Conversion\n\n### Frontend\n- Pixel-perfect Facebook login UI\n- Tailwind CSS for styling\n- Responsive mobile layout\n\n### Backend Integration\n- User registration and login\n- Session management\n- Password hashing and security',
    featured: false,
    createTime: '2024-07-22',
    category: 'web-dev',
  },
  {
    id: 8,
    name: 'Interactive Game Suite',
    slug: 'interactive-game-suite',
    description:
      'Built collection of interactive games including Tic Tac Toe, Dinosaur Game, Calculator, and To-Do List using HTML, CSS, and JavaScript with responsive design and smooth gameplay.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'JavaScript,Game Development,Interactive,CSS',
    content:
      '## Game Collection\n\nA suite of browser-based games and tools:\n\n### Games\n- Tic Tac Toe (2-player)\n- Dinosaur Runner (endless runner)\n\n### Tools\n- Calculator\n- To-Do List application\n\n### Features\n- Responsive design\n- Touch-friendly controls\n- Score tracking\n- Local storage persistence',
    featured: false,
    createTime: '2024-08-14',
    category: 'creative',
  },
  {
    id: 9,
    name: 'Client Blogging Platform',
    slug: 'client-blogging-platform',
    description:
      'Developed and managed a custom WordPress blogging website for client with SEO optimization, content management system, custom themes, and responsive design for optimal user experience.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'WordPress,Blogging,CMS,SEO',
    content:
      '## WordPress Blog Development\n\n### Services Provided\n- Custom WordPress theme development\n- SEO optimization and meta management\n- Content strategy and migration\n- Performance optimization\n\n### Results\n- Improved search engine ranking\n- 40% faster page load times\n- Mobile-optimized reading experience',
    featured: false,
    createTime: '2024-09-01',
    category: 'web-dev',
  },
  {
    id: 10,
    name: 'Social Media Marketing Campaigns',
    slug: 'social-media-marketing-campaigns',
    description:
      'Led social media marketing and fundraising campaigns for Inamigos Foundation. Created engaging content, managed multiple platforms, and drove successful awareness and donation campaigns.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'Social Media,Content Marketing,Fundraising,Digital Strategy',
    content:
      '## Digital Marketing & Fundraising\n\n### Campaign Management\n- Multi-platform social media strategy\n- Content creation and scheduling\n- Community engagement\n\n### Fundraising\n- Donation campaign design\n- Donor outreach and communication\n- Impact reporting\n\n### Platforms\n- Instagram & Facebook\n- Twitter/X\n- LinkedIn',
    featured: false,
    createTime: '2024-10-05',
    category: 'creative',
  },
  {
    id: 11,
    name: 'Horror Comedy Story',
    slug: 'horror-comedy-story',
    description:
      'Authored an engaging horror comedy story that won district-level story writing competition, blending suspenseful horror elements with comedic timing for unique narrative experience.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'Creative Writing,Storytelling,Award Winning',
    content:
      '## Award-Winning Creative Writing\n\n### Story Overview\nA unique blend of horror and comedy:\n\n- Suspenseful narrative structure\n- Comedic relief and timing\n- Character-driven plot\n\n### Achievement\n- District-level competition winner\n- Recognized for originality\n- Published in local literary magazine',
    featured: false,
    createTime: '2024-11-10',
    category: 'creative',
  },
  {
    id: 12,
    name: 'BharatPe Field Sales Initiative',
    slug: 'bharatpe-field-sales',
    description:
      'Managed field sales operations for BharatPe, focusing on QR code applications and sound box distribution to retail and manufacturing workers. Executed brand management and marketing strategies.',
    coverUrl: null,
    previewUrl: '/placeholder.svg?height=400&width=600',
    githubUrl: null,
    demoUrl: null,
    techStack: 'Sales,Brand Management,Fintech,Marketing',
    content:
      '## Field Sales & Brand Management\n\n### Role & Responsibilities\n- Field sales operations management\n- QR code application onboarding\n- Sound box device distribution\n\n### Target Audience\n- Retail shop owners\n- Manufacturing workers\n- Small business operators\n\n### Impact\n- Increased merchant onboarding\n- Brand awareness in target markets\n- Direct user feedback collection',
    featured: false,
    createTime: '2024-12-01',
    category: 'agriculture',
  },
]

export function getLocalProjects(): LocalProject[] {
  return localProjects
}

export function getLocalProjectBySlug(slug: string): LocalProject | null {
  return localProjects.find((p) => p.slug === slug) ?? null
}

export function getProjectsByCategory(): Record<ProjectCategory, LocalProject[]> {
  const grouped: Record<ProjectCategory, LocalProject[]> = {
    agriculture: [],
    'web-dev': [],
    creative: [],
  }
  for (const p of localProjects) {
    grouped[p.category].push(p)
  }
  return grouped
}
