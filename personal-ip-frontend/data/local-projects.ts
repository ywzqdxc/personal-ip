export type ProjectCategory = 'ai' | 'fullstack' | 'infra'

export interface LocalProject {
  id: number; name: string; slug: string; description: string | null
  coverUrl: string | null; previewUrl: string | null; githubUrl: string | null
  demoUrl: string | null; techStack: string | null; content: string | null
  featured: boolean; createTime: string; category: ProjectCategory
}

export const CATEGORY_LABELS: Record<ProjectCategory, { label: string; emoji: string }> = {
  ai:        { label: 'AI / Machine Learning', emoji: '🤖' },
  fullstack: { label: 'Web / Full-Stack',     emoji: '💻' },
  infra:     { label: '基础设施 / 工具',       emoji: '🛠️' },
}

const L: LocalProject[] = [
  { id:1, name:'智水先知', slug:'hydra', description:'融合物联网、YOLO 视觉与大语言模型的城市内涝智能预警平台。', coverUrl:'/images/hydra_logo.png', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:'http://47.95.8.224:9001/login', techStack:'IoT,YOLO,LLM,GIS,React', content:'城市内涝智能感知预警与协同服务平台，YOLO v12 高危车辆识别率 96%+。', featured:true, createTime:'2025-06-01', category:'ai' },
  { id:2, name:'AI 对话助手', slug:'ai-chat', description:'多模型聚合 AI 对话平台，支持流式 Markdown 与 RAG 本地知识库。', coverUrl:'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'Next.js,Node.js,DeepSeek,RAG,ChromaDB', content:'多模型 AI 对话平台，聚合 DeepSeek / OpenAI / 通义千问，支持流式 Markdown 渲染与 RAG 知识库问答。', featured:true, createTime:'2025-08-15', category:'ai' },
  { id:3, name:'计算机视觉目标检测', slug:'cv-object-detection', description:'YOLOv8 自定义数据集微调，mAP@0.5 达 87.3%，Flask API 部署。', coverUrl:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'PyTorch,YOLOv8,Python,Flask', content:'基于 YOLOv8 的目标检测项目，自定义数据集标注训练与 Flask API 部署。', featured:false, createTime:'2025-04-10', category:'ai' },
  { id:4, name:'智能简历分析', slug:'ai-resume-parser', description:'spaCy + BERT 简历解析与岗位语义匹配系统。', coverUrl:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'NLP,BERT,spaCy,FastAPI', content:'NLP 简历信息抽取系统，BERT 语义匹配计算岗位契合度。', featured:false, createTime:'2025-03-22', category:'ai' },
  { id:5, name:'情感分析微服务', slug:'sentiment-microservice', description:'BERT 中文情感分类 API，Docker 部署，500+ QPS。', coverUrl:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'BERT,Docker,FastAPI,Grafana', content:'中文评论情感分析微服务，三分类 + Grafana 监控面板。', featured:false, createTime:'2025-02-14', category:'ai' },
  { id:6, name:'校园二手交易平台', slug:'campus-trade', description:'微信小程序 + Spring Boot 全栈二手交易平台。', coverUrl:'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'微信小程序,Spring Boot,Redis,WebSocket', content:'高校二手交易平台，微信 OAuth 登录、即时聊天与信用体系。', featured:true, createTime:'2025-05-20', category:'fullstack' },
  { id:7, name:'算法可视化平台', slug:'algo-viz', description:'React + D3.js 20+ 算法逐步动画演示。', coverUrl:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'React,D3.js,TypeScript,Canvas', content:'数据结构与算法交互演示平台，支持排序、树、图等算法的逐步动画与双算法对比。', featured:false, createTime:'2025-01-08', category:'fullstack' },
  { id:8, name:'实时协作白板', slug:'collab-whiteboard', description:'WebSocket + Canvas 多人实时协作绘图工具。', coverUrl:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'WebSocket,Canvas,CRDT,Node.js,Yjs', content:'多人实时协作白板，CRDT 冲突解决，支持图形绘制与便签拖拽。', featured:false, createTime:'2024-12-01', category:'fullstack' },
  { id:9, name:'微服务电商 Demo', slug:'microservice-mall', description:'Spring Cloud Alibaba 微服务架构实战。', coverUrl:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'Spring Cloud,Nacos,Sentinel,Seata,Docker', content:'Spring Cloud 微服务电商 Demo，Nacos 注册发现 + Sentinel 限流 + Seata 分布式事务。', featured:false, createTime:'2024-11-15', category:'fullstack' },
  { id:10, name:'分布式任务调度', slug:'dist-scheduler', description:'仿 XXL-JOB 的高可用定时任务调度系统。', coverUrl:'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'Java,ZooKeeper,MySQL,定时任务', content:'分布式任务调度平台，Cron 表达式、分片广播、DAG 编排与 ZooKeeper 选举。', featured:false, createTime:'2025-01-20', category:'infra' },
  { id:11, name:'API 网关', slug:'api-gateway', description:'Netty 高性能 API 网关，12,000+ QPS。', coverUrl:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'Netty,Java,限流,熔断,高性能', content:'基于 Netty 的轻量 API 网关，动态路由、多维度限流与熔断降级。', featured:false, createTime:'2025-02-28', category:'infra' },
  { id:12, name:'统一日志平台', slug:'log-platform', description:'ELK 技术栈日志采集分析流水线。', coverUrl:'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&q=80', previewUrl:null, githubUrl:'https://github.com/ywzqdxc', demoUrl:null, techStack:'ELK,Elasticsearch,Logstash,Filebeat', content:'Filebeat → Logstash → Elasticsearch → Kibana 日志采集分析流水线。', featured:false, createTime:'2025-03-10', category:'infra' },
]

export const localProjects = L
export function getLocalProjects() { return L }
export function getLocalProjectBySlug(slug: string) { return L.find(p => p.slug === slug) ?? null }
export function getProjectsByCategory(): Record<ProjectCategory, LocalProject[]> {
  const g: Record<ProjectCategory, LocalProject[]> = { ai:[], fullstack:[], infra:[] }
  for (const p of L) g[p.category].push(p)
  return g
}
