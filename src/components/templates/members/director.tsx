import {memo, useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Home,
  Copy,
  Check,
  User,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Award,
  Trophy,
  Medal,
  Star,
  BookOpen,
  Users,
} from 'lucide-react'
import type {HonorsData} from '@/types/data'

// Image Imports
import banner2 from '@/assets/images/banner/2.webp'
import directorImg from '@/assets/images/members/director.webp'
import logoKaist from '@/assets/images/logos/kaist.png'
import logoKyunghee from '@/assets/images/logos/kyunghee.png'
import logoGcu from '@/assets/images/logos/gcu.png'
import logoDwu from '@/assets/images/logos/dwu.png'
import logoFinds from '@/assets/images/logos/finds.png'
import logoKangnam from '@/assets/images/logos/kangnam.png'
import logoKorea from '@/assets/images/logos/korea.png'
import logoWorldquant from '@/assets/images/logos/worldquant.jpg'
import logoEy from '@/assets/images/logos/ey.png'
import logoJl from '@/assets/images/logos/jl.png'

// Static Data - Education
const education = [
  {
    school: 'Korea Advanced Institute of Science and Technology (KAIST)',
    period: '2025.02',
    degree: 'Doctor of Philosophy (Ph.D.) in Engineering',
    field: 'Industrial and Systems Engineering',
    advisors: [{name: 'Woo Chang Kim', url: 'https://scholar.google.com/citations?user=7NmBs1kAAAAJ&hl=en'}],
    leadership: [
      {role: 'Member', context: 'Graduate School Central Operations Committee', period: '2021.09 - 2025.01'},
      {role: 'Graduate Student Representative', context: 'Department of Industrial and Systems Engineering', period: '2021.09 - 2025.01'},
    ],
    awards: [{title: 'Best Doctoral Dissertation Award', org: 'Korean Operations Research and Management Science Society (KORMS, 한국경영과학회)'}],
    logo: logoKaist
  },
  {
    school: 'Korea Advanced Institute of Science and Technology (KAIST)',
    period: '2021.02',
    degree: 'Master of Science (M.S.)',
    field: 'Industrial and Systems Engineering',
    advisors: [{name: 'Woo Chang Kim', url: 'https://scholar.google.com/citations?user=7NmBs1kAAAAJ&hl=en'}],
    leadership: [],
    awards: [{title: 'Best Master\'s Thesis Award', org: 'Korean Institute of Industrial Engineers (KIIE, 대한산업공학회)'}],
    logo: logoKaist
  },
  {
    school: 'Kyung Hee University',
    period: '2018.02',
    degree: 'Bachelor of Engineering (B.E.)',
    field: 'Industrial and Management Systems Engineering',
    advisors: [
      {name: 'Jang Ho Kim', url: 'https://scholar.google.com/citations?user=uTiqWBMAAAAJ&hl=en'},
      {name: 'Myoung-Ju Park', url: 'https://scholar.google.com/citations?user=O8OYIzMAAAAJ&hl=en&oi=sra'}
    ],
    leadership: [
      {role: 'Head of Culture & Public Relations', context: '41st Student Council, College of Engineering', period: '2017.01 - 2017.11'},
      {role: 'President', context: '7th Student Council, Department of Industrial and Management Systems Engineering', period: '2016.01 - 2016.12'},
    ],
    awards: [{title: 'Valedictorian', org: '1st out of 86 students'}],
    logo: logoKyunghee
  },
]

// Static Data - Employment
const employment = [
  {position: 'Assistant Professor', positionKo: '조교수', department: 'Big Data Business Management Major, Department of Finance and Big Data, College of Business', departmentKo: '경영대학 금융·빅데이터학부 빅데이터경영전공', organization: 'Gachon University', organizationKo: '가천대학교', period: '2026.03 – Present', logo: logoGcu, isCurrent: true},
  {position: 'Assistant Professor', positionKo: '조교수', department: 'Division of Business Administration, College of Business', departmentKo: '경영대학 경영융합학부', organization: 'Dongduk Women\'s University', organizationKo: '동덕여자대학교', period: '2025.09 – 2026.02', logo: logoDwu, isCurrent: false},
  {position: 'Director', positionKo: '연구실장', department: '', departmentKo: '', organization: 'FINDS Lab.', organizationKo: '', period: '2025.06 – Present', logo: logoFinds, isCurrent: true},
  {position: 'Postdoctoral Researcher', positionKo: '박사후연구원', department: 'Financial Technology Lab, Graduate School of Management of Technology', departmentKo: '기술경영전문대학원 금융기술연구실', organization: 'Korea University', organizationKo: '고려대학교', period: '2025.03 – 2025.08', logo: logoKorea, isCurrent: false},
  {position: 'Postdoctoral Researcher', positionKo: '박사후연구원', department: 'Financial Engineering Lab, Department of Industrial and Systems Engineering', departmentKo: '산업및시스템공학과 금융공학연구실', organization: 'Korea Advanced Institute of Science and Technology (KAIST)', organizationKo: '한국과학기술원', period: '2025.03 – 2025.08', logo: logoKaist, isCurrent: false},
  {position: 'Lecturer', positionKo: '강사', department: 'Department of Electronic and Semiconductor Engineering', departmentKo: '전자반도체공학부 (舊 인공지능융합공학부)', organization: 'Kangnam University', organizationKo: '강남대학교', period: '2025.03 – 2026.02', logo: logoKangnam, isCurrent: false},
  {position: 'Lecturer', positionKo: '강사', department: 'Digital Business Major, Division of Convergence Business, College of Global Business', departmentKo: '글로벌비즈니스대학 융합경영학부 디지털경영전공', organization: 'Korea University', organizationKo: '고려대학교', period: '2025.03 – 2026.02', logo: logoKorea, isCurrent: false},
  {position: 'Lecturer', positionKo: '강사', department: 'Department of Industrial and Management Systems Engineering', departmentKo: '산업경영공학과', organization: 'Kyung Hee University', organizationKo: '경희대학교', period: '2024.03 – 2024.08', logo: logoKyunghee, isCurrent: false},
  {position: 'Research Consultant', positionKo: '연구 컨설턴트', department: '', departmentKo: '', organization: 'WorldQuant Brain', organizationKo: '월드퀀트 브레인', period: '2022.06 – Present', logo: logoWorldquant, isCurrent: true},
  {position: 'Doctoral Technical Research Personnel', positionKo: '박사과정 전문연구요원', department: 'Department of Industrial and Systems Engineering', departmentKo: '산업및시스템공학과', organization: 'Korea Advanced Institute of Science and Technology (KAIST)', organizationKo: '한국과학기술원', period: '2022.03 – 2025.02', logo: logoKaist, isCurrent: false},
  {position: 'Intern', positionKo: '인턴', department: 'Data & Analytics Team', departmentKo: '데이터 애널리틱스 팀', organization: 'EY Consulting', organizationKo: 'EY컨설팅', period: '2020.03 – 2020.05', logo: logoEy, isCurrent: false},
  {position: 'Founder', positionKo: '대표', department: '', departmentKo: '', organization: 'JL Creatives & Contents (JL C&C)', organizationKo: 'JL크리에이티브&콘텐츠', period: '2014.06 – Present', logo: logoJl, isCurrent: true},
]

// Static Data - Research Interests
const researchInterests = [
  {
    category: 'Financial Data Science',
    items: [
      {en: 'AI in Quantitative Finance & Asset Management', ko: '인공지능을 활용한 포트폴리오 최적화, 자산 배분, 알고리즘 트레이딩'},
      {en: 'Financial Time-Series Modeling & Forecasting', ko: '변동성 예측, 국면 전환 모형, 선·후행 관계 분석, 수익률 예측 등 금융 시계열 모형 연구'},
      {en: 'Household Finance & Behavioral Decision Modeling', ko: '가계 금융과 투자자 행동 분석, 행동재무학 기반 의사결정 모형화'},
    ],
  },
  {
    category: 'Business Analytics',
    items: [
      {en: 'Data Analytics for Cross-Industry & Cross-Domain Convergences', ko: '다양한 산업과 분야 간의 결합과 융합을 위한 데이터 분석'},
      {en: 'Data Visualization & Transparency in Business Analytics', ko: '복잡한 데이터를 직관적으로 표현하고 투명성을 높이는 시각화 기법'},
      {en: 'Business Insights from Data Science Techniques', ko: '시계열 모형, 그래프 기반 모형, 자연어 처리(NLP) 등 데이터 사이언스 기법을 활용한 비즈니스 인사이트 발굴'},
    ],
  },
  {
    category: 'Data-Informed Decision Making',
    items: [
      {en: 'Trustworthy Decision Systems & Optimization', ko: '신뢰할 수 있는 의사결정 시스템 설계와 최적화 기법'},
      {en: 'Risk-Aware & User-Friendly Decision Tools', ko: '금융·경영 위험을 반영하고 사용자 친화성을 갖춘 의사결정 도구'},
      {en: 'Decision Analytics for Complex Business Problems', ko: '복잡한 경영 및 투자 의사결정 문제 해결을 위한 분석 및 최적화 방법론'},
    ],
  },
]

const citationStats = [{label: 'Citations', count: 154}, {label: 'g-index', count: 11}, {label: 'h-index', count: 8}, {label: 'i10-index', count: 6}]

// Expandable Section Component
const ExpandableSection = ({title, icon: Icon, children, defaultExpanded = true, count}: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultExpanded?: boolean; count?: number
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  return (
    <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-12">
          <Icon size={20} className="text-primary" />
          <h3 className="text-lg md:text-xl font-bold text-gray-900">{title}</h3>
          {count !== undefined && <span className="px-8 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full">{count}</span>}
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <div className={`border-t border-gray-100 ${isExpanded ? 'block' : 'hidden'}`}>{children}</div>
    </section>
  )
}

export const MembersDirectorTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const [honorsData, setHonorsData] = useState<HonorsData | null>(null)
  const [pubStats, setPubStats] = useState<{label: string; count: number}[]>([
    {label: 'SCIE', count: 0}, {label: 'SSCI', count: 0}, {label: 'A&HCI', count: 0},
    {label: 'ESCI', count: 0}, {label: 'Scopus', count: 0}, {label: 'Other Int\'l', count: 0},
    {label: 'Int\'l Conf', count: 0}, {label: 'KCI', count: 0}, {label: 'Dom. Conf', count: 0}
  ])
  const location = useLocation()
  const directorEmail = 'ischoi@gachon.ac.kr'

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/pubs.json`).then(res => res.json()).then((pubs: any[]) => {
      const stats = {scie: 0, ssci: 0, ahci: 0, esci: 0, scopus: 0, otherIntl: 0, intlConf: 0, kci: 0, domConf: 0}
      pubs.forEach(pub => {
        const indexing = pub.indexing_group || '', type = pub.type || ''
        if (type === 'journal') {
          if (indexing === 'SCIE') stats.scie++
          else if (indexing === 'SSCI') stats.ssci++
          else if (indexing === 'A&HCI') stats.ahci++
          else if (indexing === 'ESCI') stats.esci++
          else if (indexing === 'Scopus') stats.scopus++
          else if (indexing === 'Other International') stats.otherIntl++
          else if (indexing.includes('KCI')) stats.kci++
        } else if (type === 'conference') {
          if (indexing === 'International Conference' || indexing === 'Scopus') stats.intlConf++
          else if (indexing === 'Domestic Conference') stats.domConf++
        }
      })
      setPubStats([{label: 'SCIE', count: stats.scie}, {label: 'SSCI', count: stats.ssci}, {label: 'A&HCI', count: stats.ahci}, {label: 'ESCI', count: stats.esci}, {label: 'Scopus', count: stats.scopus}, {label: 'Other Int\'l', count: stats.otherIntl}, {label: 'Int\'l Conf', count: stats.intlConf}, {label: 'KCI', count: stats.kci}, {label: 'Dom. Conf', count: stats.domConf}])
    }).catch(console.error)
    fetch(`${baseUrl}data/honors.json`).then(res => res.json()).then((data: HonorsData) => setHonorsData(data)).catch(console.error)
  }, [])

  const handleCopyEmail = () => { navigator.clipboard.writeText(directorEmail); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 2000) }

  const navItems = [
    {label: 'Profile', path: '/members/director', icon: User},
    {label: 'Scholarly', path: '/members/director/academic', icon: BookOpen},
    {label: 'Activities', path: '/members/director/activities', icon: Users},
  ]

  const getAwardIcon = (type: string) => type === 'grand' || type === 'best' ? Trophy : type === 'excellence' ? Medal : Star
  const getAwardColor = (type: string) => type === 'grand' || type === 'best' ? {bg: 'bg-[#FFF9E6]', text: 'text-[#D6B04C]', border: 'border-[#D6B04C]/20'} : type === 'excellence' ? {bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200'} : {bg: 'bg-[#FFF5F7]', text: 'text-[#E8889C]', border: 'border-[#E8889C]/20'}

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{backgroundImage: `url(${banner2})`}} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B04C]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B04C]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B04C]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">Director</span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B04C]/80" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">Profile</h1>
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#D6C360]/50 to-[#D6C360]" />
            <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent via-[#D6C360]/50 to-[#D6C360]" />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20">
        <div className="py-20 md:py-32 border-b border-gray-100">
          <div className="flex items-center gap-8 md:gap-12 flex-wrap">
            <Link to="/" className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110"><Home size={16} /></Link>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-gray-400 font-medium">Members</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-gray-400 font-medium">Director</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">Profile</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60">
        <div className="flex flex-col lg:flex-row gap-32 md:gap-48">
          {/* Sidebar */}
          <aside className="lg:w-[320px] shrink-0">
            <div className="sticky top-100 space-y-24">
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-24">
                <div className="flex flex-col items-center">
                  <div className="w-140 h-180 rounded-xl overflow-hidden mb-20 ring-4 ring-gray-100">
                    <img src={directorImg} alt="Director" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">In Seok Choi</h2>
                  <p className="text-sm text-gray-500 mb-4">최인석</p>
                  <p className="text-sm text-primary font-medium mb-16">Assistant Professor</p>
                  <div className="w-full space-y-12">
                    <div className="flex items-center gap-12">
                      <Mail size={16} className="text-gray-400 shrink-0" />
                      <button onClick={handleCopyEmail} className="text-sm text-gray-600 hover:text-primary flex items-center gap-8 group">
                        {directorEmail}
                        {emailCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-300 group-hover:text-primary" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-12"><Phone size={16} className="text-gray-400 shrink-0" /><span className="text-sm text-gray-600">+82-31-750-xxxx</span></div>
                    <div className="flex items-start gap-12">
                      <MapPin size={16} className="text-gray-400 shrink-0 mt-2" />
                      <div><p className="text-sm font-semibold text-gray-800">Room 614, Gachon Hall</p><p className="text-xs text-gray-500">가천관 614호</p></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-16 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Navigation</h3></div>
                <div className="p-8">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon
                    return (<Link key={item.path} to={item.path} className={`flex items-center gap-12 px-16 py-14 rounded-xl transition-all ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}><Icon size={18} /><span className="font-medium">{item.label}</span><ChevronRight size={16} className="ml-auto opacity-50" /></Link>)
                  })}
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-20">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-16">External Links</h3>
                <div className="space-y-8">
                  <a href="https://scholar.google.com/citations?user=_9R3M4IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="flex items-center gap-12 text-sm text-gray-600 hover:text-primary transition-colors"><ExternalLink size={14} />Google Scholar</a>
                  <a href="https://orcid.org/0000-0002-9556-2687" target="_blank" rel="noopener noreferrer" className="flex items-center gap-12 text-sm text-gray-600 hover:text-primary transition-colors"><ExternalLink size={14} />ORCID</a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-24">
            <ExpandableSection title="Introduction" icon={User} defaultExpanded={true}>
              <div className="p-20 md:p-32">
                <p className="text-gray-600 leading-relaxed mb-24">I am an Assistant Professor in the Department of Finance and Big Data at Gachon University and Director of FINDS Lab. My research focuses on financial data science, business analytics, and data-informed decision making. I received my Ph.D. in Industrial and Systems Engineering from KAIST, where I was advised by Prof. Woo Chang Kim.</p>
                <div className="bg-gray-50 rounded-xl p-20 mb-24">
                  <h4 className="text-sm font-bold text-gray-700 mb-16">Publication Statistics</h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-12">
                    {pubStats.filter(s => s.count > 0).map((stat) => (<div key={stat.label} className="text-center"><p className="text-xl md:text-2xl font-bold text-primary">{stat.count}</p><p className="text-[10px] md:text-xs text-gray-500 font-medium">{stat.label}</p></div>))}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-12">
                  {citationStats.map((stat) => (<div key={stat.label} className="text-center p-12 bg-[#FFF9E6] rounded-xl"><p className="text-xl md:text-2xl font-bold text-[#D6B04C]">{stat.count}</p><p className="text-[10px] md:text-xs text-gray-500 font-medium">{stat.label}</p></div>))}
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Education" icon={GraduationCap} defaultExpanded={true} count={education.length}>
              <div className="divide-y divide-gray-100">
                {education.map((edu, index) => (
                  <div key={index} className="p-20 md:p-32 hover:bg-gray-50/50 transition-colors">
                    <div className="flex gap-16 md:gap-24">
                      <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-xl border border-gray-100 p-8 flex items-center justify-center shrink-0"><img src={edu.logo} alt={edu.school} className="w-full h-full object-contain" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-12 mb-8"><h4 className="text-base md:text-lg font-bold text-gray-900 leading-tight">{edu.school}</h4><span className="text-xs md:text-sm text-primary font-semibold shrink-0">{edu.period}</span></div>
                        <p className="text-sm md:text-base text-gray-700 font-medium mb-4">{edu.degree}</p>
                        <p className="text-xs md:text-sm text-gray-500 mb-12">{edu.field}</p>
                        {edu.advisors && edu.advisors.length > 0 && (<div className="flex items-center gap-8 mb-12"><span className="text-xs text-gray-400">Advisor:</span><div className="flex flex-wrap gap-6">{edu.advisors.map((advisor, aIdx) => (<a key={aIdx} href={advisor.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D6B04C] font-medium hover:underline flex items-center gap-4">{advisor.name}<ExternalLink size={10} /></a>))}</div></div>)}
                        {edu.awards && edu.awards.length > 0 && (<div className="flex flex-wrap gap-8">{edu.awards.map((award, aIdx) => (<div key={aIdx} className="flex items-center gap-6 px-10 py-4 bg-[#FFF9E6] rounded-lg"><Trophy size={12} className="text-[#D6B04C]" /><span className="text-xs font-medium text-[#B8962D]">{award.title}</span></div>))}</div>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableSection>

            <ExpandableSection title="Employment" icon={Briefcase} defaultExpanded={true} count={employment.length}>
              <div className="divide-y divide-gray-100">
                {employment.map((emp, index) => (
                  <div key={index} className="p-20 md:p-24 hover:bg-gray-50/50 transition-colors">
                    <div className="flex gap-16">
                      <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-center shrink-0"><img src={emp.logo} alt={emp.organization} className="w-full h-full object-contain" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-8">
                          <div><h4 className="text-sm md:text-base font-bold text-gray-900">{emp.position}</h4><p className="text-xs md:text-sm text-gray-600 font-medium">{emp.organization}</p>{emp.department && <p className="text-xs text-gray-400 mt-2">{emp.department}</p>}</div>
                          <div className="text-right shrink-0"><span className="text-xs md:text-sm text-gray-500">{emp.period}</span>{emp.isCurrent && <span className="block mt-4 px-8 py-2 bg-primary/10 text-primary text-[10px] font-bold rounded-full">Current</span>}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableSection>

            <ExpandableSection title="Research Interests" icon={Lightbulb} defaultExpanded={true}>
              <div className="p-20 md:p-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                  {researchInterests.map((category, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-20">
                      <h4 className="text-sm font-bold text-primary mb-16">{category.category}</h4>
                      <ul className="space-y-12">{category.items.map((item, iIdx) => (<li key={iIdx}><p className="text-sm text-gray-800 font-medium leading-relaxed">{item.en}</p><p className="text-xs text-gray-500 mt-4">{item.ko}</p></li>))}</ul>
                    </div>
                  ))}
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Honors & Awards" icon={Award} defaultExpanded={true}>
              <div className="p-20 md:p-32">
                {honorsData && Object.keys(honorsData).length > 0 ? (
                  <div className="space-y-24">
                    {Object.keys(honorsData).sort((a, b) => parseInt(b) - parseInt(a)).slice(0, 5).map((year) => (
                      <div key={year}>
                        <h4 className="text-sm font-bold text-gray-700 mb-12">{year}</h4>
                        <div className="space-y-12">
                          {honorsData[year].map((item, idx) => {
                            const IconComponent = getAwardIcon(item.type)
                            const colors = getAwardColor(item.type)
                            return (
                              <div key={idx} className={`flex gap-16 p-16 md:p-20 ${colors.bg} rounded-xl border ${colors.border}`}>
                                <div className={`w-40 h-40 md:w-48 md:h-48 rounded-xl flex items-center justify-center shrink-0 bg-white ${colors.text}`}><IconComponent size={20} /></div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-12 mb-4"><h4 className="text-sm md:text-base font-bold text-gray-900">{item.title}</h4><span className="text-xs md:text-sm text-gray-500 shrink-0">{item.date}</span></div>
                                  <p className="text-xs md:text-sm text-gray-600">{item.event}</p>
                                  <p className="text-xs text-gray-400 mt-4">{item.organization}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (<div className="text-center py-40 text-gray-400">No awards data available</div>)}
              </div>
            </ExpandableSection>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorTemplate)
