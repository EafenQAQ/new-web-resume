export interface ContactInfo {
  phone: string
  email: string
  wechat: string
  location: string
  education: string
}

export interface ResumeContext {
  name: string
  role: string
  contact: ContactInfo
  intro: string
  projects: ProjectResume[]
  skills: string[]
  highlights: string
}

export interface ProjectResume {
  name: string
  stack: string
  details: string
}

export interface Project {
  title: string
  subtitle: string
  description: string
  icon: string
  stack: string[]
  highlights: string[]
  github?: string
  demo?: string
  preview?: string
}

export interface SkillCategory {
  title: string
  icon: string
  items: string[]
}

export interface NavItem {
  name: string
  href: string
}

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

export interface AnalysisResult {
  score: number
  content: string
}
