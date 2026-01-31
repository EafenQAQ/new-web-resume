# Design Document: Web Resume

## Context

This is a personal resume website built for job applications in the frontend development field. The target audience includes:
- HR recruiters and hiring managers
- Technical interviewers and engineering leads
- Potential collaborators and employers

The resume needs to communicate:
1. Professional identity and contact information
2. Practical experience through 3 key projects
3. Technical breadth across multiple technology areas
4. Educational background and unique value proposition (psychology + tech)

## Goals / Non-Goals

**Goals:**
- Clean, professional, scannable resume layout
- Mobile-responsive design (recruiters often view on phones)
- Fast loading and accessible
- Easy maintenance with Nuxt 3 + Vue components
- Visual hierarchy that guides the reader through content

**Non-Goals:**
- Complex animations or flashy effects (keep it professional)
- Multi-language support (single language for now)
- User authentication or admin features
- Dynamic content management (static resume data is sufficient)
- Dark mode toggle (prioritize clean, professional light theme)

## Decisions

### 1. Component Architecture

**Decision:** Use Nuxt 3 auto-imported components with composition API

**Rationale:**
- Nuxt 3 provides auto-import for components in `components/` directory
- Composition API (`<script setup>`) is more concise and modern
- Components can be reused (ProjectCard, SkillBadge) for consistency

**Alternatives considered:**
- Options API: Rejected as it's the older Vue 2 pattern
- Single-file monolithic page: Rejected due to maintainability concerns

### 2. Styling Strategy

**Decision:** Primary use of TailwindCSS utilities + Nuxt UI components for structure

**Rationale:**
- TailwindCSS provides rapid development with utility classes
- Nuxt UI offers pre-built, accessible components (UCard, UBadge, UButton)
- Consistent design tokens through Nuxt UI theming
- Project already has TailwindCSS + Nuxt UI configured

**Alternatives considered:**
- Pure custom CSS: Rejected due to slower development and inconsistency
- Additional UI libraries (Element Plus, Naive UI): Rejected to avoid bloat

### 3. Icon Strategy

**Decision:** Use `nuxt-icon` for all icon needs

**Rationale:**
- Unpkg-based, no need to install individual icon libraries
- Supports Iconify, which includes 200,000+ icons
- Simple usage: `<Icon name="mdi:github" />`
- Can use popular sets: MDI, Heroicons, Font Awesome, etc.

**Icon categories to use:**
- Contact: `mdi:phone`, `mdi:email`, `mdi:wechat`
- Links: `mdi:github`, `mdi:web`, `mdi:open-in-new`
- Tech: Brand icons for technologies (Vue, Tailwind, etc.)

### 4. Layout Structure

**Decision:** Single-page scrolling layout with sticky navigation

**Rationale:**
- Simple, fast, no page reloads
- Works well on mobile (single scroll)
- Easy to share as a single URL
- Familiar pattern for resume websites

**Structure:**
```
┌─────────────────────────────┐
│ Sticky Nav (desktop/mobile) │
├─────────────────────────────┤
│ Hero/Header Section         │
│ - Avatar, name, contact     │
├─────────────────────────────┤
│ About Section               │
│ - Brief intro               │
├─────────────────────────────┤
│ Projects Section            │
│ - 3 project cards           │
├─────────────────────────────┤
│ Skills Section              │
│ - Categorized skill tags    │
├─────────────────────────────┤
│ Education Section           │
│ - University info           │
├─────────────────────────────┤
│ Self Evaluation             │
│ - Closing statement         │
├─────────────────────────────┤
│ Footer                      │
│ - Copyright                 │
└─────────────────────────────┘
```

### 5. Responsive Design Approach

**Decision:** Mobile-first responsive design with Tailwind breakpoints

**Breakpoints:**
- Mobile: `< 768px` (default, no prefix)
- Tablet: `768px - 1023px` (`md:` prefix)
- Desktop: `>= 1024px` (`lg:` prefix)

**Key adaptations:**
- Desktop: Multi-column layouts, horizontal nav
- Mobile: Single-column stacks, hamburger menu, larger touch targets

### 6. Color Scheme

**Decision:** Professional, clean palette using Nuxt UI default theme

**Primary colors:**
- Background: White/light grays for readability
- Text: Dark grays for contrast (not pure black)
- Accents: Subtle blue/teal for links and highlights
- Cards: Light gray backgrounds with subtle borders

**Rationale:** Professional appearance suitable for job applications, doesn't distract from content

### 7. Typography

**Decision:** System font stack via Tailwind default

**Font hierarchy:**
- Headings (h1, h2, h3): Bold, larger sizes
- Body text: Regular, readable line-height (1.6-1.8)
- Contact info: Small/medium with icon pairing

**Rationale:** Fast loading, native feel, no additional font files needed

### 8. Content Organization

**Decision:** Component-based data structure

**Approach:**
- Create components that accept props for data
- Resume content lives in component props, not external data files
- Makes updates straightforward (edit component props)

**Alternative considered:** JSON/data file with `asyncData`
- Rejected as overkill for static resume content

## Risks / Trade-offs

### Risk 1: Image asset availability

**Risk:** Profile photo referenced as `./assets/zhaopian.jpg` in resume.md may not exist in web project

**Mitigation:**
- Check if image exists in project
- If not, use placeholder avatar from Nuxt UI or remove until provided
- Document this in tasks

### Risk 2: nuxt-icon compatibility

**Risk:** nuxt-icon may have version compatibility issues with Nuxt 4

**Mitigation:**
- Test early in implementation
- Fallback to Nuxt UI's built-in icons if needed
- Alternative: Use SVG strings inline

### Trade-off 1: Single page vs multi-page

**Decision:** Single-page scrolling resume

**Trade-off:** Less flexibility for future content expansion

**Justification:** Simpler, faster, meets current needs; can refactor later if needed

### Trade-off 2: Static vs dynamic content

**Decision:** Hard-code resume data in components

**Trade-off:** Requires code changes to update resume

**Justification:** Simpler architecture, no CMS overhead; resume updates infrequently

## Migration Plan

Not applicable - this is new functionality, not a migration.

## Open Questions

### Q1: Profile photo availability

Does the profile photo (`zhaopian.jpg`) exist in the project? If not, should we:
- Use a placeholder?
- Skip the avatar for now?
- Use a generic icon/initials?

**Status:** Pending user input

### Q2: External link behavior

Should external links (GitHub, demos) open in:
- New tab (`target="_blank"`) - Better UX, keeps resume open
- Same tab - Simpler, no new tabs

**Recommendation:** New tab with `rel="noopener noreferrer"` for security

### Q3: Print/PDF export

Is PDF export functionality needed now, or can it be deferred?
- Native browser print (Ctrl+P) works with CSS print media queries
- Dedicated PDF generation adds complexity

**Status:** Defer to future unless requested

## Component Specifications

### ResumeHeader.vue
```typescript
interface ContactInfo {
  phone: string
  wechat: string
  email: string
  webUrl: string
  location: string
  education: string
}
```

### ProjectCard.vue
```typescript
interface Project {
  name: string
  role: string
  techStack: string[]
  description: string
  highlights: string[]
  githubUrl?: string
  demoUrl?: string
}
```

### SkillSection.vue
```typescript
interface SkillCategory {
  category: string
  skills: string[]
  icon?: string // optional icon for category
}
```

## Validation Checklist

After implementation, verify:
- [ ] All external links work
- [ ] Mobile menu toggles correctly
- [ ] No console errors
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Accessibility: semantic HTML, alt text, readable contrast
- [ ] Performance: Lighthouse score > 90
- [ ] Cross-browser: Chrome, Firefox, Safari
