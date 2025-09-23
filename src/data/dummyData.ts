import { v4 as uuidv4 } from 'uuid';
import { Board, List, Card, Label } from '@/types/kanban';

// Predefined labels for consistent theming
export const LABELS: Label[] = [
  { id: 'high-priority', title: 'High Priority', color: 'red' },
  { id: 'medium-priority', title: 'Medium Priority', color: 'yellow' },
  { id: 'low-priority', title: 'Low Priority', color: 'green' },
  { id: 'frontend', title: 'Frontend', color: 'blue' },
  { id: 'backend', title: 'Backend', color: 'purple' },
  { id: 'design', title: 'Design', color: 'purple' },
  { id: 'marketing', title: 'Marketing', color: 'blue' },
  { id: 'bug', title: 'Bug', color: 'red' },
  { id: 'feature', title: 'Feature', color: 'green' },
  { id: 'blocked', title: 'Blocked', color: 'red' },
  { id: 'urgent', title: 'Urgent', color: 'red' },
  { id: 'review', title: 'Review Needed', color: 'yellow' },
  { id: 'research', title: 'Research', color: 'gray' },
  { id: 'content', title: 'Content', color: 'blue' },
  { id: 'testing', title: 'Testing', color: 'purple' }
];

export function generateDummyBoards(userId: string): Board[] {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return [
    // Product Launch Board
    {
      id: uuidv4(),
      title: '🚀 Product Launch 2024',
      createdAt: oneMonthAgo,
      updatedAt: new Date(),
      userId,
      lists: [
        {
          id: uuidv4(),
          title: 'Planning & Research',
          position: 0,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Market Research Analysis',
              description: '## Market Research Analysis\n\n📊 **Objectives:**\n- Analyze competitor landscape\n- Identify target demographics\n- Research pricing strategies\n\n**Key Questions:**\n- Who are our main competitors?\n- What features do users value most?\n- What\'s our unique selling proposition?\n\n**Deliverables:**\n- [ ] Competitor analysis report\n- [ ] User persona documentation\n- [ ] Pricing strategy recommendations',
              position: 0,
              listId: '',
              labels: [LABELS[12], LABELS[1]], // Research, Medium Priority
              dueDate: tomorrow
            },
            {
              id: uuidv4(),
              title: 'Define Product Requirements',
              description: 'Create comprehensive PRD including:\n- Core features and functionality\n- Technical requirements\n- Success metrics and KPIs\n- Go-to-market strategy',
              position: 1,
              listId: '',
              labels: [LABELS[0], LABELS[8]], // High Priority, Feature
              dueDate: nextWeek
            },
            {
              id: uuidv4(),
              title: 'Budget Approval & Resource Allocation',
              description: 'Secure budget and assign team members:\n- Development team (3 engineers)\n- Design team (2 designers)\n- Marketing team (2 marketers)\n- QA engineer (1 tester)',
              position: 2,
              listId: '',
              labels: [LABELS[1]], // Medium Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Development',
          position: 1,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Authentication System',
              description: '🔐 **Authentication Features:**\n\n**Login Methods:**\n- Email/Password authentication\n- Google OAuth integration\n- Apple Sign-In support\n- Two-factor authentication (2FA)\n\n**Security Requirements:**\n- JWT token management\n- Password strength validation\n- Account lockout protection\n- Session management\n\n**Technical Stack:**\n- Supabase Auth\n- React Hook Form\n- Zod validation',
              position: 0,
              listId: '',
              labels: [LABELS[0], LABELS[4]], // High Priority, Backend
              dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
            },
            {
              id: uuidv4(),
              title: 'User Dashboard UI Components',
              description: 'Design and implement responsive dashboard:\n- Navigation sidebar\n- Data visualization widgets\n- User profile management\n- Settings panel\n- Responsive mobile design',
              position: 1,
              listId: '',
              labels: [LABELS[3], LABELS[5]], // Frontend, Design
              dueDate: nextWeek
            },
            {
              id: uuidv4(),
              title: 'API Integration Layer',
              description: 'Build robust API integration:\n- REST API endpoints\n- GraphQL queries\n- Error handling and retry logic\n- Caching strategy\n- Rate limiting',
              position: 2,
              listId: '',
              labels: [LABELS[4], LABELS[1]], // Backend, Medium Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Testing & QA',
          position: 2,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Automated Test Suite',
              description: '🧪 **Testing Strategy:**\n\n**Unit Tests:**\n- Component testing with Jest\n- Utility function testing\n- Store/state management testing\n\n**Integration Tests:**\n- API endpoint testing\n- Database interaction testing\n- Authentication flow testing\n\n**E2E Tests:**\n- User journey testing with Playwright\n- Cross-browser compatibility\n- Mobile responsiveness testing\n\n**Performance Tests:**\n- Load testing\n- Memory leak detection\n- Bundle size optimization',
              position: 0,
              listId: '',
              labels: [LABELS[14], LABELS[0]], // Testing, High Priority
              dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
            },
            {
              id: uuidv4(),
              title: 'Security Penetration Testing',
              description: 'Comprehensive security audit:\n- SQL injection testing\n- XSS vulnerability assessment\n- CSRF protection validation\n- Authentication bypass attempts\n- Data encryption verification',
              position: 1,
              listId: '',
              labels: [LABELS[0], LABELS[14]], // High Priority, Testing
              dueDate: nextWeek
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Launch Ready',
          position: 3,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Marketing Campaign Launch',
              description: '📢 **Launch Campaign:**\n\n**Social Media:**\n- Twitter announcement thread\n- LinkedIn product showcase\n- Instagram stories and posts\n- YouTube product demo video\n\n**Content Marketing:**\n- Blog post series (3 articles)\n- Case study documentation\n- User testimonials\n- Press release\n\n**Paid Advertising:**\n- Google Ads campaign\n- Facebook/Instagram ads\n- LinkedIn sponsored content\n\n**Influencer Outreach:**\n- Tech blogger partnerships\n- Industry expert reviews\n- Podcast appearances',
              position: 0,
              listId: '',
              labels: [LABELS[6], LABELS[0]], // Marketing, High Priority
            }
          ]
        }
      ]
    },

    // Website Redesign Project
    {
      id: uuidv4(),
      title: '🎨 Website Redesign Project',
      createdAt: oneWeekAgo,
      updatedAt: new Date(),
      userId,
      lists: [
        {
          id: uuidv4(),
          title: 'Design Phase',
          position: 0,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'User Experience Audit',
              description: '🔍 **UX Audit Objectives:**\n\n**Current Site Analysis:**\n- Heuristic evaluation\n- User flow mapping\n- Accessibility audit (WCAG 2.1)\n- Performance analysis\n- Mobile usability review\n\n**User Research:**\n- User interview sessions (10 users)\n- Survey deployment (target: 100+ responses)\n- Analytics review (Google Analytics)\n- Heat map analysis (Hotjar)\n\n**Deliverables:**\n- [ ] UX audit report\n- [ ] User journey maps\n- [ ] Pain point analysis\n- [ ] Improvement recommendations',
              position: 0,
              listId: '',
              labels: [LABELS[5], LABELS[12]], // Design, Research
              dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
            },
            {
              id: uuidv4(),
              title: 'Wireframe Creation',
              description: 'Create detailed wireframes for all pages:\n- Homepage redesign\n- Product pages\n- About us page\n- Contact page\n- Blog layout\n- User dashboard (if applicable)',
              position: 1,
              listId: '',
              labels: [LABELS[5], LABELS[1]], // Design, Medium Priority
            },
            {
              id: uuidv4(),
              title: 'Visual Design System',
              description: '🎨 **Design System Components:**\n\n**Color Palette:**\n- Primary colors (3 variations)\n- Secondary colors (2 variations)\n- Neutral grays (5 shades)\n- Success/Warning/Error states\n\n**Typography:**\n- Heading hierarchy (H1-H6)\n- Body text styles\n- Font pairings and sizes\n- Line height and spacing\n\n**UI Components:**\n- Buttons (primary, secondary, tertiary)\n- Form elements\n- Navigation components\n- Cards and containers\n- Icons and imagery style',
              position: 2,
              listId: '',
              labels: [LABELS[5], LABELS[0]], // Design, High Priority
              dueDate: nextWeek
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Development',
          position: 1,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Homepage Redesign Implementation',
              description: '🏠 **Homepage Features:**\n\n**Hero Section:**\n- Animated background or video\n- Clear value proposition\n- Primary CTA button\n- Trust indicators\n\n**Content Sections:**\n- Feature highlights (3-4 key features)\n- Customer testimonials carousel\n- Stats/achievements showcase\n- Blog post previews\n- Newsletter signup\n\n**Technical Requirements:**\n- Responsive design (mobile-first)\n- Page speed optimization\n- SEO optimization\n- Accessibility compliance',
              position: 0,
              listId: '',
              labels: [LABELS[3], LABELS[0]], // Frontend, High Priority
              dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000)
            },
            {
              id: uuidv4(),
              title: 'Mobile Responsiveness',
              description: 'Ensure perfect mobile experience:\n- Touch-friendly navigation\n- Optimized images and assets\n- Fast loading times\n- Readable typography on small screens\n- Intuitive mobile interactions',
              position: 1,
              listId: '',
              labels: [LABELS[3], LABELS[1]], // Frontend, Medium Priority
            },
            {
              id: uuidv4(),
              title: 'Performance Optimization',
              description: '⚡ **Performance Targets:**\n\n**Core Web Vitals:**\n- Largest Contentful Paint (LCP): < 2.5s\n- First Input Delay (FID): < 100ms\n- Cumulative Layout Shift (CLS): < 0.1\n\n**Optimization Strategies:**\n- Image optimization and lazy loading\n- CSS and JavaScript minification\n- CDN implementation\n- Caching strategy\n- Bundle splitting and code optimization',
              position: 2,
              listId: '',
              labels: [LABELS[3], LABELS[0]], // Frontend, High Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Content & SEO',
          position: 2,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'SEO Optimization',
              description: '🔍 **SEO Strategy:**\n\n**On-Page SEO:**\n- Meta titles and descriptions\n- Header tag optimization (H1, H2, H3)\n- Internal linking structure\n- Schema markup implementation\n- Image alt text optimization\n\n**Technical SEO:**\n- XML sitemap generation\n- Robots.txt optimization\n- URL structure improvement\n- Page speed optimization\n- Mobile-first indexing\n\n**Content SEO:**\n- Keyword research and integration\n- Content gap analysis\n- Blog post optimization\n- Landing page optimization',
              position: 0,
              listId: '',
              labels: [LABELS[13], LABELS[1]], // Content, Medium Priority
              dueDate: nextWeek
            },
            {
              id: uuidv4(),
              title: 'Content Migration & Updates',
              description: 'Update and migrate existing content:\n- Rewrite homepage copy\n- Update product descriptions\n- Refresh about us page\n- Create new blog posts\n- Update legal pages (privacy, terms)',
              position: 1,
              listId: '',
              labels: [LABELS[13], LABELS[2]], // Content, Low Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Launch & Monitor',
          position: 3,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'A/B Testing Setup',
              description: '🧪 **Testing Strategy:**\n\n**Test Scenarios:**\n- Homepage hero section variations\n- CTA button colors and text\n- Navigation menu styles\n- Contact form placement\n\n**Testing Tools:**\n- Google Optimize setup\n- Conversion tracking\n- User behavior analysis\n- Performance monitoring\n\n**Success Metrics:**\n- Conversion rate improvement\n- Bounce rate reduction\n- Time on page increase\n- User engagement metrics',
              position: 0,
              listId: '',
              labels: [LABELS[14], LABELS[6]], // Testing, Marketing
            }
          ]
        }
      ]
    },

    // Content Calendar Board
    {
      id: uuidv4(),
      title: '📅 Content Calendar Q1 2024',
      createdAt: oneWeekAgo,
      updatedAt: new Date(),
      userId,
      lists: [
        {
          id: uuidv4(),
          title: 'Ideas & Planning',
          position: 0,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Q1 Content Strategy Planning',
              description: '📋 **Content Strategy Overview:**\n\n**Content Pillars:**\n1. **Educational Content** (40%)\n   - How-to guides and tutorials\n   - Industry insights and analysis\n   - Best practices and tips\n\n2. **Product Content** (30%)\n   - Feature spotlights\n   - Use case studies\n   - Customer success stories\n\n3. **Company Culture** (20%)\n   - Behind-the-scenes content\n   - Team spotlights\n   - Company values and mission\n\n4. **Industry News** (10%)\n   - Trend analysis\n   - News commentary\n   - Expert opinions\n\n**Content Calendar Goals:**\n- 3 blog posts per week\n- 5 social media posts per day\n- 1 video content per week\n- 2 newsletters per month',
              position: 0,
              listId: '',
              labels: [LABELS[13], LABELS[12]], // Content, Research
              dueDate: tomorrow
            },
            {
              id: uuidv4(),
              title: 'Keyword Research for Blog Topics',
              description: 'Research high-impact keywords:\n- Primary keywords (5-10)\n- Long-tail keywords (20-30)\n- Competitor keyword analysis\n- Search volume and difficulty assessment\n- Content gap identification',
              position: 1,
              listId: '',
              labels: [LABELS[12], LABELS[13]], // Research, Content
            },
            {
              id: uuidv4(),
              title: 'Influencer Collaboration Ideas',
              description: '🤝 **Influencer Partnership Strategy:**\n\n**Potential Collaborations:**\n- Guest blog posts\n- Podcast appearances\n- Social media takeovers\n- Product reviews\n- Co-created content\n\n**Target Influencers:**\n- Micro-influencers (10K-100K followers)\n- Industry experts and thought leaders\n- Complementary brand partnerships\n\n**Collaboration Metrics:**\n- Reach and engagement\n- Lead generation\n- Brand awareness\n- Conversion tracking',
              position: 2,
              listId: '',
              labels: [LABELS[6], LABELS[1]], // Marketing, Medium Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'In Production',
          position: 1,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: '"10 Web Design Trends for 2024" Blog Post',
              description: '📝 **Blog Post Outline:**\n\n**Introduction:**\n- Hook: Current state of web design\n- Preview of trends to discuss\n\n**10 Trends to Cover:**\n1. Dark mode sophistication\n2. Micro-interactions and animations\n3. 3D elements and immersive experiences\n4. Sustainable web design\n5. AI-powered personalization\n6. Voice user interfaces\n7. Augmented reality integration\n8. Minimalist maximalism\n9. Advanced typography\n10. Inclusive design principles\n\n**Each Trend Section:**\n- Definition and explanation\n- Real-world examples (2-3)\n- Implementation tips\n- Tools and resources\n\n**Conclusion:**\n- Summary of key takeaways\n- Call-to-action for readers\n\n**SEO Requirements:**\n- Target keyword: "web design trends 2024"\n- Meta description\n- Internal linking to related posts\n- Featured image and alt text',
              position: 0,
              listId: '',
              labels: [LABELS[13], LABELS[0]], // Content, High Priority
              dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
            },
            {
              id: uuidv4(),
              title: 'Social Media Graphics for New Product Launch',
              description: '🎨 **Social Media Asset Creation:**\n\n**Platforms & Specifications:**\n- Instagram: Square posts (1080x1080), Stories (1080x1920)\n- Twitter: Landscape (1200x675), Profile banner\n- LinkedIn: Company page posts (1200x627)\n- Facebook: Feed posts (1200x630)\n\n**Content Types:**\n- Product announcement graphics\n- Feature highlight carousels\n- Behind-the-scenes content\n- Customer testimonial quotes\n- Countdown graphics\n\n**Design Requirements:**\n- Brand consistency\n- Mobile-optimized text\n- Call-to-action elements\n- Accessibility considerations',
              position: 1,
              listId: '',
              labels: [LABELS[5], LABELS[6]], // Design, Marketing
              dueDate: nextWeek
            },
            {
              id: uuidv4(),
              title: 'Customer Success Story Video',
              description: '🎥 **Video Production Plan:**\n\n**Pre-Production:**\n- Customer interview scheduling\n- Question preparation\n- Location scouting\n- Equipment checklist\n\n**Production:**\n- Customer interview (30-45 min)\n- B-roll footage collection\n- Screen recordings (if applicable)\n- Additional testimonials\n\n**Post-Production:**\n- Video editing (3-5 min final length)\n- Color correction and audio enhancement\n- Graphics and title additions\n- Subtitle generation\n\n**Distribution:**\n- YouTube upload and optimization\n- Social media teasers\n- Website integration\n- Email newsletter inclusion',
              position: 2,
              listId: '',
              labels: [LABELS[13], LABELS[1]], // Content, Medium Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Review & Editing',
          position: 2,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: '"Complete Guide to API Integration" Article',
              description: '📖 **Technical Article Review:**\n\n**Content Review Checklist:**\n- [ ] Technical accuracy verification\n- [ ] Code examples testing\n- [ ] SEO optimization review\n- [ ] Readability assessment\n- [ ] Image and diagram quality\n\n**Article Sections:**\n1. Introduction to APIs\n2. Types of API integrations\n3. Authentication methods\n4. Best practices and security\n5. Common pitfalls to avoid\n6. Tools and resources\n7. Real-world implementation examples\n\n**Review Notes:**\n- Add more code examples in JavaScript\n- Include Postman collection\n- Enhance error handling section\n- Update resource links',
              position: 0,
              listId: '',
              labels: [LABELS[11], LABELS[13]], // Review, Content
              dueDate: tomorrow
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Published',
          position: 3,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: '"React Best Practices 2024" Blog Series',
              description: '✅ **Published Series Overview:**\n\n**Series Structure (5 Parts):**\n1. ✅ Component Architecture Patterns\n2. ✅ State Management Strategies\n3. ✅ Performance Optimization Techniques\n4. ✅ Testing Methodologies\n5. ✅ Deployment and DevOps Integration\n\n**Performance Metrics:**\n- 15,000+ total page views\n- 4.2 average time on page\n- 450+ social shares\n- 85 new email subscribers\n- 12 lead conversions\n\n**Engagement:**\n- 120+ comments across all posts\n- Featured in 3 industry newsletters\n- Referenced by 8 other blogs\n\n**SEO Results:**\n- Ranking #3 for "React best practices"\n- Ranking #5 for "React performance optimization"\n- 25% increase in organic search traffic',
              position: 0,
              listId: '',
              labels: [LABELS[8], LABELS[13]], // Feature, Content
            }
          ]
        }
      ]
    },

    // Bug Tracker Board
    {
      id: uuidv4(),
      title: '🐛 Bug Tracker & Issues',
      createdAt: oneWeekAgo,
      updatedAt: new Date(),
      userId,
      lists: [
        {
          id: uuidv4(),
          title: 'Reported',
          position: 0,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Login Form Validation Error',
              description: '🚨 **Bug Report:**\n\n**Description:**\nUsers report that email validation is not working correctly on the login form. Valid email addresses are being rejected as invalid.\n\n**Steps to Reproduce:**\n1. Navigate to login page\n2. Enter valid email (e.g., user@company.co.uk)\n3. Enter password\n4. Click "Sign In" button\n5. Error message appears: "Please enter a valid email address"\n\n**Expected Behavior:**\nValid email addresses should pass validation and allow login\n\n**Actual Behavior:**\nValid emails with country-specific TLDs are rejected\n\n**Environment:**\n- Browser: Chrome 118.0.5993.88\n- OS: Windows 11\n- Device: Desktop\n- User Agent: Mozilla/5.0...\n\n**Additional Information:**\n- Affects approximately 15% of users\n- Started occurring after v2.3.1 deployment\n- Workaround: Users can use forgot password flow\n\n**Priority:** High\n**Severity:** Major\n**Reporter:** Sarah Johnson (QA)\n**Assigned to:** [Unassigned]',
              position: 0,
              listId: '',
              labels: [LABELS[7], LABELS[0], LABELS[9]], // Bug, High Priority, Blocked
              dueDate: tomorrow
            },
            {
              id: uuidv4(),
              title: 'Mobile Navigation Menu Not Closing',
              description: '📱 **Mobile Bug Report:**\n\n**Issue:** Mobile hamburger menu remains open after navigation\n\n**Impact:** Poor user experience on mobile devices\n\n**Affected Pages:** All pages with navigation\n\n**User Reports:** 23 support tickets in last week\n\n**Device Testing:**\n- iPhone 14 Pro (iOS 17.1): ❌ Confirmed\n- Samsung Galaxy S23 (Android 13): ❌ Confirmed\n- iPad Pro (iPadOS 17.1): ❌ Confirmed\n\n**Technical Notes:**\n- Event listener not being removed properly\n- Z-index conflicts with overlay\n- Touch events not registering correctly',
              position: 1,
              listId: '',
              labels: [LABELS[7], LABELS[1]], // Bug, Medium Priority
            },
            {
              id: uuidv4(),
              title: 'Search Results Pagination Broken',
              description: '🔍 **Search Feature Bug:**\n\n**Problem:** Pagination controls not working on search results page\n\n**Symptoms:**\n- "Next" button disabled on pages with results\n- Page numbers show incorrect values\n- URL parameters not updating correctly\n\n**API Response Analysis:**\n- Total count: Correct ✅\n- Current page: Incorrect ❌\n- Has next page: Always false ❌\n\n**Database Query Review Needed:**\n- OFFSET calculation may be incorrect\n- COUNT query might not match LIMIT query',
              position: 2,
              listId: '',
              labels: [LABELS[7], LABELS[4]], // Bug, Backend
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'In Progress',
          position: 1,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Dashboard Loading Performance Issue',
              description: '⚡ **Performance Bug Investigation:**\n\n**Current Status:** Investigating root cause\n\n**Performance Metrics:**\n- Current load time: 8.5 seconds (target: <3s)\n- API calls: 15 simultaneous requests\n- Bundle size: 2.8MB (target: <1MB)\n\n**Investigation Progress:**\n- ✅ Identified heavy dependencies\n- ✅ Analyzed network waterfall\n- 🔄 Implementing code splitting\n- ⏳ Testing lazy loading approach\n\n**Optimization Strategies:**\n1. Bundle splitting by route\n2. Lazy loading of charts/widgets\n3. API request batching\n4. Image optimization\n5. Caching improvements\n\n**Timeline:**\n- Investigation: 2 days (completed)\n- Implementation: 3 days (in progress)\n- Testing: 2 days (pending)\n- Deployment: 1 day (pending)',
              position: 0,
              listId: '',
              labels: [LABELS[7], LABELS[0]], // Bug, High Priority
              dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Testing',
          position: 2,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'File Upload Size Limit Fix',
              description: '📁 **Upload Bug Fix Testing:**\n\n**Issue:** Files larger than 10MB causing server errors\n**Fix:** Implemented client-side validation and chunked upload\n\n**Test Cases:**\n- ✅ Files under 10MB upload successfully\n- ✅ Files 10-50MB upload with progress indicator\n- ✅ Files over 50MB show appropriate error message\n- ✅ Invalid file types rejected properly\n- ✅ Network interruption recovery works\n\n**Browser Testing:**\n- ✅ Chrome 118 (Windows/Mac/Linux)\n- ✅ Firefox 119 (Windows/Mac/Linux)\n- ✅ Safari 17 (Mac/iOS)\n- ✅ Edge 118 (Windows)\n\n**Performance Testing:**\n- ✅ Memory usage remains stable\n- ✅ UI remains responsive during upload\n- ✅ Multiple concurrent uploads work\n\n**Ready for Production:** ✅',
              position: 0,
              listId: '',
              labels: [LABELS[14], LABELS[8]], // Testing, Feature
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Resolved',
          position: 3,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Email Notification Delays Fixed',
              description: '✅ **Resolution Summary:**\n\n**Original Issue:**\nEmail notifications were delayed by 15-30 minutes, causing user confusion and support tickets.\n\n**Root Cause:**\nQueue processing was bottlenecked due to synchronous email sending and insufficient worker processes.\n\n**Solution Implemented:**\n1. **Asynchronous Email Processing:**\n   - Moved to background job queue\n   - Implemented Redis-based job management\n   - Added retry logic for failed sends\n\n2. **Infrastructure Scaling:**\n   - Increased worker process count from 2 to 8\n   - Added dedicated email service worker\n   - Implemented horizontal scaling for high volume\n\n3. **Monitoring & Alerting:**\n   - Added queue length monitoring\n   - Set up alerts for processing delays\n   - Created email delivery dashboard\n\n**Results:**\n- ✅ Email delivery time: <30 seconds (was 15-30 minutes)\n- ✅ Queue processing rate: 1000+ emails/minute\n- ✅ Failed delivery rate: <0.1% (was 2.3%)\n- ✅ Zero support tickets related to email delays\n\n**Deployed:** March 15, 2024\n**Verified:** March 18, 2024\n**Status:** Closed ✅',
              position: 0,
              listId: '',
              labels: [LABELS[8], LABELS[4]], // Feature, Backend
            }
          ]
        }
      ]
    },

    // Personal Goals Board
    {
      id: uuidv4(),
      title: '🎯 Personal Development Goals',
      createdAt: oneMonthAgo,
      updatedAt: new Date(),
      userId,
      lists: [
        {
          id: uuidv4(),
          title: 'Learning Goals',
          position: 0,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Master Advanced TypeScript',
              description: '🎓 **Learning Path:**\n\n**Current Level:** Intermediate\n**Target Level:** Advanced\n\n**Study Plan:**\n\n**Week 1-2: Advanced Types**\n- [ ] Conditional types and type inference\n- [ ] Mapped types and template literals\n- [ ] Utility types deep dive\n- [ ] Generic constraints and variance\n\n**Week 3-4: Design Patterns**\n- [ ] Factory and Builder patterns\n- [ ] Observer and Strategy patterns\n- [ ] Decorator pattern implementation\n- [ ] Type-safe dependency injection\n\n**Week 5-6: Real-world Application**\n- [ ] Refactor existing project to use advanced types\n- [ ] Build type-safe API client\n- [ ] Implement custom utility types\n- [ ] Code review and optimization\n\n**Resources:**\n- 📖 "Effective TypeScript" by Dan Vanderkam\n- 🎥 Matt Pocock\'s TypeScript tutorials\n- 📚 Official TypeScript documentation\n- 🏗️ Hands-on projects and exercises\n\n**Success Metrics:**\n- Complete 100% of exercises\n- Pass advanced TypeScript certification\n- Apply learnings to work projects\n- Share knowledge through blog post',
              position: 0,
              listId: '',
              labels: [LABELS[8], LABELS[0]], // Feature, High Priority
              dueDate: nextMonth
            },
            {
              id: uuidv4(),
              title: 'Learn System Design Fundamentals',
              description: '🏗️ **System Design Curriculum:**\n\n**Learning Objectives:**\n- Understand scalability principles\n- Learn database design patterns\n- Master distributed systems concepts\n- Practice system design interviews\n\n**Study Schedule (8 weeks):**\n\n**Weeks 1-2: Fundamentals**\n- Scalability basics\n- Load balancing strategies\n- Caching mechanisms\n- Database concepts (SQL vs NoSQL)\n\n**Weeks 3-4: Distributed Systems**\n- Microservices architecture\n- API design principles\n- Message queues and event streaming\n- Consistency and availability trade-offs\n\n**Weeks 5-6: Practice Problems**\n- Design Twitter/X\n- Design URL shortener\n- Design chat application\n- Design video streaming service\n\n**Weeks 7-8: Advanced Topics**\n- Security considerations\n- Monitoring and observability\n- Performance optimization\n- Disaster recovery planning',
              position: 1,
              listId: '',
              labels: [LABELS[12], LABELS[1]], // Research, Medium Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Health & Fitness',
          position: 1,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Establish Consistent Exercise Routine',
              description: '💪 **Fitness Goal Plan:**\n\n**Current Status:** Sedentary lifestyle, 2-3 gym visits per month\n**Target:** 4-5 workouts per week, improved overall fitness\n\n**Weekly Schedule:**\n\n**Monday - Upper Body Strength**\n- Warm-up: 10 minutes cardio\n- Push-ups, pull-ups, bench press\n- Shoulder and arm exercises\n- Cool-down and stretching\n\n**Tuesday - Cardio & Core**\n- 30-minute cardio (running/cycling)\n- Core strengthening exercises\n- Flexibility and mobility work\n\n**Wednesday - Rest or Light Activity**\n- Walking or gentle yoga\n- Recovery and rest day\n\n**Thursday - Lower Body Strength**\n- Squats, deadlifts, lunges\n- Leg and glute exercises\n- Balance and stability work\n\n**Friday - Full Body or Cardio**\n- Circuit training or HIIT\n- Full-body functional movements\n\n**Weekend - Active Recovery**\n- Outdoor activities (hiking, sports)\n- Yoga or stretching sessions\n\n**Tracking Metrics:**\n- Workout consistency (target: 85%)\n- Weight and body composition\n- Energy levels and sleep quality\n- Strength progression',
              position: 0,
              listId: '',
              labels: [LABELS[0], LABELS[8]], // High Priority, Feature
              dueDate: nextWeek
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'In Progress',
          position: 2,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Read 24 Books This Year',
              description: '📚 **Reading Challenge Progress:**\n\n**Goal:** 24 books (2 books per month)\n**Current Progress:** 8/24 books completed\n**On Track:** Yes! 📈\n\n**Reading List Categories:**\n\n**Technical Books (8 books):**\n- ✅ "Clean Code" by Robert Martin\n- ✅ "System Design Interview" by Alex Xu\n- 📖 "Designing Data-Intensive Applications" (Currently Reading)\n- ⏳ "Staff Engineer" by Will Larson\n- ⏳ "Building Microservices" by Sam Newman\n\n**Professional Development (6 books):**\n- ✅ "The Manager\'s Path" by Camille Fournier\n- ✅ "Atomic Habits" by James Clear\n- ⏳ "Deep Work" by Cal Newport\n\n**Personal Growth (6 books):**\n- ✅ "Mindset" by Carol Dweck\n- ✅ "The 7 Habits" by Stephen Covey\n- ⏳ "Range" by David Epstein\n\n**Fiction/Entertainment (4 books):**\n- ✅ "Project Hail Mary" by Andy Weir\n- ✅ "Klara and the Sun" by Kazuo Ishiguro\n- ⏳ "The Seven Husbands of Evelyn Hugo"\n\n**Reading Habits:**\n- 📱 Daily: 30 minutes during commute\n- 🌙 Evening: 45 minutes before bed\n- 📅 Weekend: 2-3 hours focused reading\n- 🎧 Audiobooks during exercise/walks',
              position: 0,
              listId: '',
              labels: [LABELS[1], LABELS[8]], // Medium Priority, Feature
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Completed',
          position: 3,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Complete Online React Course',
              description: '🎓 **Course Completion Summary:**\n\n**Course:** "The Complete React Developer Course" by Andrew Mead\n**Platform:** Udemy\n**Duration:** 40 hours of content\n**Completed:** February 28, 2024 ✅\n\n**Skills Acquired:**\n\n**Core React Concepts:**\n- ✅ Components and JSX\n- ✅ Props and state management\n- ✅ Event handling and forms\n- ✅ Lifecycle methods and hooks\n- ✅ Context API and state management\n\n**Advanced Topics:**\n- ✅ React Router for navigation\n- ✅ Redux and Redux Toolkit\n- ✅ API integration and async operations\n- ✅ Testing with Jest and React Testing Library\n- ✅ Performance optimization techniques\n\n**Projects Built:**\n1. **Todo App** - State management and CRUD operations\n2. **Weather App** - API integration and error handling\n3. **Budget Tracker** - Complex state and data visualization\n4. **E-commerce Store** - Full-stack integration with backend\n\n**Certificate:** Earned with 98% completion rate\n**Applied at Work:** Successfully refactored 3 legacy components\n**Next Steps:** Advanced patterns and performance optimization\n\n**Key Takeaways:**\n- Hooks revolutionize component logic\n- Testing is crucial for maintainable code\n- Performance optimization requires measurement\n- Community and ecosystem are incredibly strong',
              position: 0,
              listId: '',
              labels: [LABELS[8]], // Feature
            }
          ]
        }
      ]
    },

    // Event Planning Board
    {
      id: uuidv4(),
      title: '🎉 Tech Conference 2024 Planning',
      createdAt: oneWeekAgo,
      updatedAt: new Date(),
      userId,
      lists: [
        {
          id: uuidv4(),
          title: 'Early Planning',
          position: 0,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Define Conference Theme & Objectives',
              description: '🎯 **Conference Vision & Goals:**\n\n**Theme:** "Building the Future: AI, Web3, and Sustainable Tech"\n\n**Primary Objectives:**\n1. **Knowledge Sharing**\n   - Showcase cutting-edge technologies\n   - Share best practices and lessons learned\n   - Foster learning and skill development\n\n2. **Community Building**\n   - Connect industry professionals\n   - Facilitate networking opportunities\n   - Strengthen local tech ecosystem\n\n3. **Innovation Showcase**\n   - Highlight emerging startups\n   - Demo innovative solutions\n   - Inspire future developments\n\n**Target Audience:**\n- Software developers and engineers\n- Product managers and designers\n- Tech entrepreneurs and founders\n- Students and early-career professionals\n\n**Expected Outcomes:**\n- 500+ attendees\n- 20+ speakers and presentations\n- 50+ companies represented\n- 90%+ satisfaction rating\n\n**Success Metrics:**\n- Attendance and engagement rates\n- Speaker and content quality scores\n- Networking connections made\n- Post-event community growth\n- Sponsor satisfaction and ROI',
              position: 0,
              listId: '',
              labels: [LABELS[12], LABELS[0]], // Research, High Priority
              dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
            },
            {
              id: uuidv4(),
              title: 'Venue Research & Booking',
              description: '🏢 **Venue Selection Criteria:**\n\n**Requirements:**\n- Capacity: 600 people (500 attendees + staff/speakers)\n- Main auditorium with A/V capabilities\n- 2-3 breakout rooms for workshops\n- Networking/exhibition space\n- Catering facilities or approved vendors\n- Parking and public transportation access\n- Accessibility compliance (ADA)\n\n**Shortlisted Venues:**\n\n**1. Downtown Convention Center**\n- Capacity: 800 people ✅\n- Cost: $15,000/day\n- Pros: Central location, full A/V setup, parking\n- Cons: Higher cost, limited catering options\n\n**2. University Tech Campus**\n- Capacity: 500 people ✅\n- Cost: $8,000/day\n- Pros: Tech-focused atmosphere, student accessibility\n- Cons: Limited parking, older A/V equipment\n\n**3. Modern Business Hotel**\n- Capacity: 600 people ✅\n- Cost: $12,000/day (includes basic catering)\n- Pros: Full-service, professional setup, easy access\n- Cons: Corporate feel, limited customization\n\n**Decision Factors:**\n- Budget alignment\n- Speaker/attendee accessibility\n- Technical capabilities\n- Atmosphere and brand fit',
              position: 1,
              listId: '',
              labels: [LABELS[12], LABELS[1]], // Research, Medium Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Speakers & Content',
          position: 1,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Keynote Speaker Outreach',
              description: '🎤 **Keynote Speaker Strategy:**\n\n**Target Profile:**\n- Industry thought leaders with 10+ years experience\n- Strong public speaking track record\n- Relevant expertise in AI, Web3, or sustainable tech\n- Diverse representation (gender, ethnicity, geography)\n\n**Outreach List (Priority Order):**\n\n**Tier 1 - Dream Speakers:**\n1. **Dr. Sarah Chen** - AI Ethics Researcher at Stanford\n   - Topic: "Responsible AI Development"\n   - Status: Initial contact sent\n   - Fee: $25,000 + travel\n\n2. **Marcus Rodriguez** - CTO at GreenTech Solutions\n   - Topic: "Sustainable Software Architecture"\n   - Status: Waiting for response\n   - Fee: $15,000 + travel\n\n**Tier 2 - Strong Candidates:**\n3. **Dr. Amara Okafor** - Blockchain Researcher\n   - Topic: "Web3 Beyond Cryptocurrency"\n   - Status: Confirmed interest, negotiating terms\n   - Fee: $18,000 + travel\n\n4. **John Kim** - Former VP Engineering at Meta\n   - Topic: "Scaling Engineering Teams"\n   - Status: Scheduled call next week\n   - Fee: $20,000 + travel\n\n**Backup Options:**\n- Local university professors\n- Successful startup founders\n- Open source maintainers\n\n**Outreach Timeline:**\n- Week 1-2: Tier 1 speakers\n- Week 3-4: Follow up and Tier 2\n- Week 5-6: Backup options and confirmations',
              position: 0,
              listId: '',
              labels: [LABELS[0], LABELS[6]], // High Priority, Marketing
              dueDate: nextWeek
            },
            {
              id: uuidv4(),
              title: 'Workshop & Breakout Session Planning',
              description: '🛠️ **Workshop Sessions:**\n\n**Technical Workshops (90 minutes each):**\n\n**1. "Hands-on Machine Learning with Python"**\n- Level: Beginner to Intermediate\n- Capacity: 50 people\n- Requirements: Laptop, Python installed\n- Instructor: Dr. Lisa Wong (Data Scientist)\n\n**2. "Building Smart Contracts on Ethereum"**\n- Level: Intermediate\n- Capacity: 30 people\n- Requirements: MetaMask wallet, basic Solidity knowledge\n- Instructor: Alex Thompson (Blockchain Developer)\n\n**3. "Sustainable Software Development Practices"**\n- Level: All levels\n- Capacity: 60 people\n- Requirements: None\n- Instructor: Green Software Foundation Team\n\n**Panel Discussions (45 minutes each):**\n\n**1. "The Future of Remote Work in Tech"**\n- Panelists: 4 industry leaders\n- Format: Moderated discussion + Q&A\n- Topics: Culture, productivity, innovation\n\n**2. "Diversity and Inclusion in Tech Leadership"**\n- Panelists: 5 diverse tech leaders\n- Format: Personal stories + actionable advice\n- Focus: Career progression, mentorship\n\n**Lightning Talks (15 minutes each):**\n- 8-10 short presentations\n- Startup pitches and project demos\n- Open application process',
              position: 1,
              listId: '',
              labels: [LABELS[13], LABELS[1]], // Content, Medium Priority
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Logistics & Operations',
          position: 2,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Registration System Setup',
              description: '📝 **Registration Platform Requirements:**\n\n**Core Features:**\n- Online ticket purchasing (multiple tiers)\n- Attendee information collection\n- Payment processing (credit cards, PayPal)\n- Email confirmations and reminders\n- QR code tickets for easy check-in\n- Refund and transfer capabilities\n\n**Ticket Tiers:**\n\n**Early Bird (Limited - 100 tickets)**\n- Price: $199\n- Includes: All sessions, lunch, networking reception\n- Available until: March 1st or sold out\n\n**Regular Admission**\n- Price: $299\n- Includes: Same as early bird\n- Available: March 2nd - May 15th\n\n**Student Discount (50% off)**\n- Price: $149\n- Verification: Valid student ID required\n- Includes: All sessions, lunch (no networking reception)\n\n**VIP Experience (Limited - 50 tickets)**\n- Price: $499\n- Includes: Priority seating, speaker meet & greet, VIP lunch, swag bag\n\n**Platform Options:**\n1. **Eventbrite** - Easy setup, good integration\n2. **Ti.to** - Developer-friendly, customizable\n3. **Custom Solution** - Full control, higher development cost\n\n**Integration Requirements:**\n- Website embedding\n- Email marketing platform sync\n- Badge printing system\n- Analytics and reporting',
              position: 0,
              listId: '',
              labels: [LABELS[1], LABELS[6]], // Medium Priority, Marketing
            }
          ]
        },
        {
          id: uuidv4(),
          title: 'Completed',
          position: 3,
          boardId: '',
          cards: [
            {
              id: uuidv4(),
              title: 'Sponsorship Package Creation',
              description: '💼 **Sponsorship Tiers & Packages:**\n\n**PLATINUM SPONSOR - $25,000**\n✅ **Benefits Delivered:**\n- Logo prominently displayed on all materials\n- 10-minute speaking slot during main session\n- Premium booth space (10x10 ft)\n- 8 complimentary tickets\n- Branded swag in attendee welcome bags\n- Logo on conference t-shirts\n- Social media promotion (20+ posts)\n- Email newsletter mentions (3 editions)\n- Access to attendee contact list (opt-in)\n\n**GOLD SPONSOR - $15,000**\n✅ **Benefits Delivered:**\n- Logo on conference materials and website\n- 5-minute lightning talk opportunity\n- Standard booth space (8x8 ft)\n- 6 complimentary tickets\n- Social media promotion (10+ posts)\n- Email newsletter mention (1 edition)\n\n**SILVER SPONSOR - $8,000**\n✅ **Benefits Delivered:**\n- Logo on website and program\n- Tabletop display space\n- 4 complimentary tickets\n- Social media mentions (5+ posts)\n\n**BRONZE SPONSOR - $3,000**\n✅ **Benefits Delivered:**\n- Logo on website\n- 2 complimentary tickets\n- Social media mentions (2+ posts)\n\n**Confirmed Sponsors:**\n- ✅ TechCorp Industries (Platinum)\n- ✅ CloudServe Solutions (Gold)\n- ✅ DevTools Pro (Silver)\n- ✅ StartupHub (Bronze)\n- ✅ LocalBank (Bronze)\n\n**Total Sponsorship Revenue:** $54,000\n**Target:** $50,000 ✅ Exceeded by 8%',
              position: 0,
              listId: '',
              labels: [LABELS[8], LABELS[6]], // Feature, Marketing
            }
          ]
        }
      ]
    }
  ];
}

// Helper function to set correct boardId and listId for cards and lists
export function linkBoardData(boards: Board[]): Board[] {
  return boards.map(board => ({
    ...board,
    lists: board.lists.map((list, listIndex) => ({
      ...list,
      boardId: board.id,
      position: listIndex,
      cards: list.cards.map((card, cardIndex) => ({
        ...card,
        listId: list.id,
        position: cardIndex
      }))
    }))
  }));
}

// Initialize store with dummy data
export function initializeDummyData(userId: string) {
  const dummyBoards = linkBoardData(generateDummyBoards(userId));
  return {
    boards: dummyBoards,
    currentBoard: dummyBoards[0] || null,
    viewMode: 'kanban' as const
  };
}