import {memo, useState, useEffect, useMemo, useRef, useCallback} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  Building,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Home,
  Copy,
  Check,
  User,
  Activity,
  Award,
  Medal,
  Trophy,
  Landmark,
  GraduationCap,
  Calendar,
  BookOpen,
  Search,
} from 'lucide-react'
import {useStoreModal} from '@/store/modal'
import type {HonorsData} from '@/types/data'

// Format date from "Dec 5" to "MM-DD" format
const formatHonorDate = (dateStr: string): string => {
  const monthMap: Record<string, string> = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  }
  const parts = dateStr.split(' ')
  if (parts.length === 2) {
    const month = monthMap[parts[0]] || '00'
    const day = parts[1].padStart(2, '0')
    return `${month}-${day}`
  }
  return dateStr
}

// Types
type Project = {
  titleEn: string
  titleKo: string
  period: string
  fundingAgency: string
  fundingAgencyKo: string
  type: 'government' | 'industry' | 'institution' | 'academic'
  roles: {
    principalInvestigator?: string
    leadResearcher?: string
    researchers?: string[]
  }
}

type Lecture = {
  role: string
  periods: string[]
  school: string
  courses: { en: string; ko: string }[]
}

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
    period: '2025-02',
    degree: 'Doctor of Philosophy (Ph.D.) in Engineering',
    field: 'Industrial and Systems Engineering',
    advisors: [
      {name: 'Woo Chang Kim', url: 'https://scholar.google.com/citations?user=7NmBs1kAAAAJ&hl=en'}
    ],
    leadership: [
      {role: 'Member', context: 'Graduate School Central Operations Committee', period: '2021-09 - 2025-01'},
      {role: 'Graduate Student Representative', context: 'Department of Industrial and Systems Engineering', period: '2021-09 - 2025-01'},
    ],
    awards: [{title: 'Best Doctoral Dissertation Award', org: 'Korean Operations Research and Management Science Society (KORMS, 한국경영과학회)'}],
    honors: [],
    logo: logoKaist
  },
  {
    school: 'Korea Advanced Institute of Science and Technology (KAIST)',
    period: '2021-02',
    degree: 'Master of Science (M.S.)',
    field: 'Industrial and Systems Engineering',
    advisors: [
      {name: 'Woo Chang Kim', url: 'https://scholar.google.com/citations?user=7NmBs1kAAAAJ&hl=en'}
    ],
    leadership: [],
    awards: [{title: 'Best Master\'s Thesis Award', org: 'Korean Institute of Industrial Engineers (KIIE, 대한산업공학회)'}],
    honors: [],
    logo: logoKaist
  },
  {
    school: 'Kyung Hee University',
    period: '2018-02',
    degree: 'Bachelor of Engineering (B.E.)',
    field: 'Industrial and Management Systems Engineering',
    advisors: [
      {name: 'Jang Ho Kim', url: 'https://scholar.google.com/citations?user=uTiqWBMAAAAJ&hl=en'},
      {name: 'Myoung-Ju Park', url: 'https://scholar.google.com/citations?user=O8OYIzMAAAAJ&hl=en&oi=sra'}
    ],
    leadership: [
      {role: 'Head of Culture & Public Relations', context: '41st Student Council, College of Engineering', period: '2017-01 - 2017-11'},
      {role: 'President', context: '7th Student Council, Department of Industrial and Management Systems Engineering', period: '2016-01 - 2016-12'},
    ],
    awards: [{title: 'Dean\'s Award for Academic Excellence', org: 'College of Engineering, Kyung Hee University'}],
    honors: [{title: 'Valedictorian', org: '1st out of 86 students'}],
    logo: logoKyunghee
  },
]

// Static Data - Employment (sorted by start date, newest first)
const employment = [
  {position: 'Assistant Professor', positionKo: '조교수', department: 'Big Data Business Management Major, Department of Finance and Big Data, College of Business', departmentKo: '경영대학 금융·빅데이터학부 빅데이터경영전공', organization: 'Gachon University', organizationKo: '가천대학교', period: '2026-03 – Present', logo: logoGcu, isCurrent: true},
  {position: 'Assistant Professor', positionKo: '조교수', department: 'Division of Business Administration, College of Business', departmentKo: '경영대학 경영융합학부', organization: 'Dongduk Women\'s University', organizationKo: '동덕여자대학교', period: '2025-09 – 2026-02', logo: logoDwu, isCurrent: false},
  {position: 'Director', positionKo: '연구실장', department: 'Financial Data Intelligence & Solutions Laboratory (FINDS Lab)', departmentKo: '금융데이터인텔리전스연구실 (FINDS Lab)', organization: '', organizationKo: '', period: '2025-06 – Present', logo: logoFinds, isCurrent: true},
  {position: 'Postdoctoral Researcher', positionKo: '박사후연구원', department: 'Financial Technology Lab, Graduate School of Management of Technology', departmentKo: '기술경영전문대학원 금융기술연구실', organization: 'Korea University', organizationKo: '고려대학교', period: '2025-03 – 2025-08', logo: logoKorea, isCurrent: false},
  {position: 'Postdoctoral Researcher', positionKo: '박사후연구원', department: 'Financial Engineering Lab, Department of Industrial and Systems Engineering', departmentKo: '산업및시스템공학과 금융공학연구실', organization: 'Korea Advanced Institute of Science and Technology (KAIST)', organizationKo: '한국과학기술원', period: '2025-03 – 2025-08', logo: logoKaist, isCurrent: false},
  {position: 'Lecturer', positionKo: '강사', department: 'Department of Electronic and Semiconductor Engineering, College of Engineering', departmentKo: '공과대학 전자반도체공학부 (舊 인공지능융합공학부)', organization: 'Kangnam University', organizationKo: '강남대학교', period: '2025-03 – 2026-02', logo: logoKangnam, isCurrent: false},
  {position: 'Lecturer', positionKo: '강사', department: 'Digital Business Major, Division of Convergence Business, College of Global Business', departmentKo: '글로벌비즈니스대학 융합경영학부 디지털경영전공', organization: 'Korea University', organizationKo: '고려대학교', period: '2025-03 – 2026-02', logo: logoKorea, isCurrent: false},
  {position: 'Lecturer', positionKo: '강사', department: 'Department of Industrial and Management Systems Engineering', departmentKo: '산업경영공학과', organization: 'Kyung Hee University', organizationKo: '경희대학교', period: '2024-03 – 2024-08', logo: logoKyunghee, isCurrent: false},
  {position: 'Research Consultant', positionKo: '연구 컨설턴트', department: '', departmentKo: '', organization: 'WorldQuant Brain', organizationKo: '월드퀀트 브레인', period: '2022-06 – Present', logo: logoWorldquant, isCurrent: true},
  {position: 'Doctoral Technical Research Personnel', positionKo: '박사과정 전문연구요원', department: 'Department of Industrial and Systems Engineering', departmentKo: '산업및시스템공학과', organization: 'Korea Advanced Institute of Science and Technology (KAIST)', organizationKo: '한국과학기술원', period: '2022-03 – 2025-02', logo: logoKaist, isCurrent: false},
  {position: 'Intern', positionKo: '인턴', department: 'Data & Analytics Team', departmentKo: '데이터 애널리틱스 팀', organization: 'EY Consulting', organizationKo: 'EY컨설팅', period: '2020-03 – 2020-05', logo: logoEy, isCurrent: false},
  {position: 'Founder', positionKo: '대표', department: '', departmentKo: '', organization: 'JL Creatives & Contents (JL C&C)', organizationKo: 'JL크리에이티브&콘텐츠', period: '2014-06 – Present', logo: logoJl, isCurrent: true},
]

// Static Data - Professional Affiliations
const affiliations = [
  {organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE) 종신회원', role: 'Lifetime Member', period: '2025-06 – Present'},
  {organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA) 종신회원', role: 'Lifetime Member', period: '2023-09 – Present'},
  {organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA) 종신회원', role: 'Lifetime Member', period: '2023-06 – Present'},
  {organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS) 종신회원', role: 'Lifetime Member', period: '2022-06 – Present'},
]

// Static Data - Citation Statistics (manually updated)
const citationStats = [{label: 'Citations', count: 154}, {label: 'g-index', count: 11}, {label: 'h-index', count: 8}, {label: 'i10-index', count: 6}]

// Static Data - Research Interests (aligned with About > Introduction Focus Areas)
const researchInterests = [
  {
    category: 'Financial Data Science',
    categoryKo: '금융 데이터 사이언스',
    items: [
      'Portfolio Optimization & Algorithmic Trading',
      'Financial Time-Series Modeling & Forecasting',
      'Personalized Finance & Behavioral Decision Modeling'
    ]
  },
  {
    category: 'Business Analytics',
    categoryKo: '비즈니스 애널리틱스',
    items: [
      'Cross-Industry Data Analytics',
      'Data Visualization & Transparency',
      'Business Insights from Statistical Methods'
    ]
  },
  {
    category: 'Data-Informed Decision Making',
    categoryKo: '데이터 기반 의사결정',
    items: [
      'Trustworthy Decision Systems & Optimization',
      'Risk-Aware Decision Support Tools',
      'Iridescent View Extraction for Data-Informed Decision'
    ]
  },
]

// Resume Modal Component
const ResumeModal = () => (
  <div className="p-16 md:p-24 max-h-[70vh] overflow-y-auto">
    {/* Header */}
    <div className="text-center mb-24 pb-20 border-b border-gray-200">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Insu Choi</h2>
      <p className="text-sm text-gray-600">Assistant Professor, Gachon University</p>
      <p className="text-sm text-gray-600">Director, FINDS Lab</p>
    </div>

    {/* Current Position */}
    <section className="mb-20">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-12">Current Position</h3>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Assistant Professor, Gachon University</p>
            <p className="text-xs text-gray-500">Big Data Business Management Major, Department of Finance and Big Data</p>
          </div>
          <span className="text-xs text-gray-400 shrink-0">Mar 2026 – Present</span>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Assistant Professor, Dongduk Women's University</p>
            <p className="text-xs text-gray-500">Division of Business Administration, College of Business</p>
          </div>
          <span className="text-xs text-gray-400 shrink-0">Sep 2025 – Feb 2026</span>
        </div>
      </div>
    </section>

    {/* Research Interests */}
    <section className="mb-20">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-12">Research Interests</h3>
      <ul className="text-sm text-gray-700 space-y-4 ml-12">
        <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Financial Data Science</li>
        <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Business Analytics</li>
        <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Data-Informed Decision Making</li>
      </ul>
    </section>

    {/* Education */}
    <section className="mb-20">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-12">Education</h3>
      <div className="space-y-12">
        <div>
          <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-4">
            <p className="text-sm font-semibold text-gray-900">Ph.D., Industrial and Systems Engineering, KAIST</p>
            <span className="text-xs text-gray-400 shrink-0">Mar 2021 – Feb 2025</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-3 ml-12">
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Dissertation Award: 11th Best Doctoral Dissertation, Korean Operations Research and Management Science Society</li>
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Advisor: Prof. Woo Chang Kim</li>
          </ul>
        </div>
        <div>
          <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-4">
            <p className="text-sm font-semibold text-gray-900">M.S., Industrial and Systems Engineering, KAIST</p>
            <span className="text-xs text-gray-400 shrink-0">Feb 2018 – Feb 2021</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-3 ml-12">
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Thesis Award: 17th Best Master Thesis, Korea Institute of Industrial Engineers</li>
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Advisor: Prof. Woo Chang Kim</li>
          </ul>
        </div>
        <div>
          <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-4">
            <p className="text-sm font-semibold text-gray-900">B.E., Industrial and Management Systems Engineering, Kyung Hee University</p>
            <span className="text-xs text-gray-400 shrink-0">Mar 2013 – Feb 2018</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-3 ml-12">
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Valedictorian, College of Engineering (GPA: 4.42/4.5)</li>
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Advisors: Prof. Jangho Kim (Korea University), Prof. Myungjoo Park (Seoul National University)</li>
          </ul>
        </div>
      </div>
    </section>

    {/* Selected Publications */}
    <section className="mb-20">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-12">Selected Publications</h3>
      <p className="text-sm text-gray-600 mb-8">20+ peer-reviewed journal articles published in SSCI/SCIE indexed journals. Representative journals include:</p>
      <ul className="text-sm text-gray-600 space-y-6 ml-12">
        <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" /><span><strong>International Review of Financial Analysis</strong> <span className="text-gray-400">[SSCI, Top 2.4% as of 2024]</span></span></li>
        <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" /><span><strong>Engineering Applications of Artificial Intelligence</strong> <span className="text-gray-400">[SCIE, Top 2.5% as of 2024]</span></span></li>
        <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" /><span><strong>Research in International Business and Finance</strong> <span className="text-gray-400">[SSCI, Top 4.5% as of 2023]</span></span></li>
        <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" /><span><strong>International Review of Economics & Finance</strong> <span className="text-gray-400">[SSCI, Top 9.6% as of 2024]</span></span></li>
        <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" /><span><strong>Knowledge-Based Systems</strong> <span className="text-gray-400">[SCIE, Top 13.5% as of 2024]</span></span></li>
      </ul>
    </section>

    {/* Selected Research Projects */}
    <section className="mb-20">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-12">Selected Research Projects</h3>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Principal Investigator – Portfolio Risk Assessment with Explainable AI</p>
            <p className="text-xs text-gray-500">Korea Institute of Public Finance</p>
          </div>
          <span className="text-xs text-gray-400 shrink-0">May 2025 – Sep 2025</span>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Project Leader – Foreign Currency Asset Management Impact Analysis</p>
            <p className="text-xs text-gray-500">Bank of Korea</p>
          </div>
          <span className="text-xs text-gray-400 shrink-0">Nov 2023 – Jul 2024</span>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Project Leader – Financial Data-Driven Market Valuation Model</p>
            <p className="text-xs text-gray-500">Shinhan Bank</p>
          </div>
          <span className="text-xs text-gray-400 shrink-0">Aug 2021 – Dec 2023</span>
        </div>
      </div>
    </section>

    {/* Professional Service */}
    <section className="mb-20">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-12">Professional Service</h3>
      <p className="text-sm text-gray-600">
        <strong>Reviewer:</strong> International Review of Financial Analysis, Finance Research Letters, Knowledge-Based Systems, Machine Learning with Applications, Annals of Operations Research, and 40+ journals
      </p>
    </section>

    {/* Teaching Experience */}
    <section>
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-12">Teaching Experience</h3>
      <div className="space-y-12">
        <div>
          <p className="text-sm font-bold text-gray-900 mb-6">Korea University Sejong Campus</p>
          <ul className="text-sm text-gray-600 space-y-3 ml-12">
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Algorithmic Trading (DIGB441), 2025–2026</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 mb-6">Kyung Hee University</p>
          <ul className="text-sm text-gray-600 space-y-3 ml-12">
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Financial Engineering (IE329), 2024</li>
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Engineering Economics (IE201), 2024</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 mb-6">Kangnam University</p>
          <ul className="text-sm text-gray-600 space-y-3 ml-12">
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Introduction to Financial Engineering, 2025–2026</li>
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Applied Statistics, 2025–2026</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 mb-6">KAIST <span className="font-normal text-gray-500">(Teaching Assistant)</span></p>
          <ul className="text-sm text-gray-600 space-y-3 ml-12">
            <li className="flex items-start gap-6"><span className="w-3 h-3 rounded-full bg-primary/30 shrink-0 mt-5" />Financial Artificial Intelligence (IE471), 2022–2024</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
)

export const MembersDirectorTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [projectSearchTerm, setProjectSearchTerm] = useState('')
  const [teachingSearchTerm, setTeachingSearchTerm] = useState('')
  const [expandedProjectYears, setExpandedProjectYears] = useState<string[]>([])
  const [honorsData, setHonorsData] = useState<HonorsData | null>(null)
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  const [expandedEduAwards, setExpandedEduAwards] = useState<Set<number>>(new Set()) // For education awards/honors
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    researchInterests: true,
    education: true,
    employment: true,
    honorsAwards: true,
    publicationStats: true,
    teaching: true
  })
  
  // Sticky profile card refs and state
  const profileCardRef = useRef<HTMLDivElement>(null)
  const contentSectionRef = useRef<HTMLElement>(null)
  const [profileTop, setProfileTop] = useState(0)
  
  // Sticky profile card effect
  useEffect(() => {
    const handleScroll = () => {
      if (!profileCardRef.current || !contentSectionRef.current) return
      if (window.innerWidth < 1024) return // Only on desktop
      
      const section = contentSectionRef.current
      const card = profileCardRef.current
      const sectionRect = section.getBoundingClientRect()
      const cardHeight = card.offsetHeight
      const topOffset = 32 // Top padding from viewport top
      const bottomPadding = 32
      
      // Section의 시작이 topOffset 위로 올라가면 sticky 시작
      if (sectionRect.top <= topOffset) {
        // Section의 끝이 card + topOffset + padding 보다 작으면 bottom에 고정
        if (sectionRect.bottom <= cardHeight + topOffset + bottomPadding) {
          setProfileTop(sectionRect.bottom - cardHeight - bottomPadding - sectionRect.top)
        } else {
          // 위쪽에 고정
          setProfileTop(topOffset - sectionRect.top)
        }
      } else {
        setProfileTop(0)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section as keyof typeof prev]}))
  }
  
  const toggleEduAwards = (idx: number) => {
    setExpandedEduAwards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(idx)) {
        newSet.delete(idx)
      } else {
        newSet.add(idx)
      }
      return newSet
    })
  }
  
  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev)
      if (newSet.has(year)) {
        newSet.delete(year)
      } else {
        newSet.add(year)
      }
      return newSet
    })
  }
  const [pubStats, setPubStats] = useState<{label: string, count: number}[]>([
    {label: 'SCIE', count: 0}, {label: 'SSCI', count: 0}, {label: 'A&HCI', count: 0}, 
    {label: 'ESCI', count: 0}, {label: 'Scopus', count: 0}, {label: 'Other Int\'l', count: 0},
    {label: 'Int\'l Conf', count: 0}, {label: 'KCI', count: 0}, {label: 'Dom. Conf', count: 0}
  ])
  const {showModal} = useStoreModal()
  const location = useLocation()
  const directorEmail = 'ischoi@gachon.ac.kr'

  // Fetch Projects, Lectures, and Publications data
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    
    // Fetch Publications and calculate stats
    fetch(`${baseUrl}data/pubs.json`)
      .then(res => res.json())
      .then((pubs: any[]) => {
        const stats = {
          scie: 0, ssci: 0, ahci: 0, esci: 0, scopus: 0, otherIntl: 0,
          intlConf: 0, kci: 0, domConf: 0
        }
        
        pubs.forEach(pub => {
          const indexing = pub.indexing_group || ''
          const type = pub.type || ''
          
          if (type === 'journal') {
            if (indexing === 'SCIE') stats.scie++
            else if (indexing === 'SSCI') stats.ssci++
            else if (indexing === 'A&HCI') stats.ahci++
            else if (indexing === 'ESCI') stats.esci++
            else if (indexing === 'Scopus') stats.scopus++
            else if (indexing === 'Other International') stats.otherIntl++
            else if (indexing.includes('KCI')) stats.kci++
          } else if (type === 'conference') {
            // International conferences include both "International Conference" and "Scopus" indexed ones
            if (indexing === 'International Conference' || indexing === 'Scopus') stats.intlConf++
            else if (indexing === 'Domestic Conference') stats.domConf++
          }
        })
        
        setPubStats([
          {label: 'SCIE', count: stats.scie},
          {label: 'SSCI', count: stats.ssci},
          {label: 'A&HCI', count: stats.ahci},
          {label: 'ESCI', count: stats.esci},
          {label: 'Scopus', count: stats.scopus},
          {label: 'Other Int\'l', count: stats.otherIntl},
          {label: 'Int\'l Conf', count: stats.intlConf},
          {label: 'KCI', count: stats.kci},
          {label: 'Dom. Conf', count: stats.domConf}
        ])
      })
      .catch(console.error)
    
    // Fetch Projects - all projects where director is involved
    fetch(`${baseUrl}data/projects.json`)
      .then(res => res.json())
      .then((data: Project[]) => {
        // Show all projects (no date filter) - most recent first
        const sortedProjects = [...data].sort((a, b) => {
          const dateA = new Date(a.period.split('–')[0].trim())
          const dateB = new Date(b.period.split('–')[0].trim())
          return dateB.getTime() - dateA.getTime()
        })
        setProjects(sortedProjects)
        // Expand all years by default
        const years = [...new Set(sortedProjects.map(p => p.period.split('–')[0].trim().slice(0, 4)))]
        setExpandedProjectYears(years)
      })
      .catch(console.error)

    // Fetch Lectures - current semester
    fetch(`${baseUrl}data/lectures.json`)
      .then(res => res.json())
      .then((data: Lecture[]) => {
        setLectures(data)
      })
      .catch(console.error)
    
    // Fetch Honors data
    fetch(`${baseUrl}data/honors.json`)
      .then(res => res.json())
      .then((data: HonorsData) => {
        setHonorsData(data)
        // PC only: Auto-expand recent years (2018 and later)
        if (window.innerWidth >= 768) {
          const years = Object.keys(data).sort((a, b) => Number(b) - Number(a))
          const recentYears = years.filter(year => Number(year) >= 2018)
          setExpandedYears(new Set(recentYears))
        }
        // Mobile: All collapsed by default (empty Set)
      })
      .catch(console.error)
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directorEmail)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  // Group projects by year
  const projectsByYear = useMemo(() => {
    const filtered = projectSearchTerm.trim()
      ? projects.filter(p => 
          p.titleEn.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
          p.titleKo.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
          p.fundingAgency.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
          p.fundingAgencyKo.toLowerCase().includes(projectSearchTerm.toLowerCase())
        )
      : projects

    const grouped: Record<string, Project[]> = {}
    filtered.forEach(p => {
      const year = p.period.split('–')[0].trim().slice(0, 4)
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(p)
    })
    return grouped
  }, [projects, projectSearchTerm])

  const projectYears = useMemo(() => {
    return Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a))
  }, [projectsByYear])

  const toggleProjectYear = (year: string) => {
    setExpandedProjectYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    )
  }

  // Group lectures by course name and aggregate semesters, with role information
  const groupedLectures = useMemo(() => {
    const filtered = teachingSearchTerm.trim()
      ? lectures.filter(l =>
          l.courses.some(c => 
            c.en.toLowerCase().includes(teachingSearchTerm.toLowerCase()) ||
            c.ko.toLowerCase().includes(teachingSearchTerm.toLowerCase())
          ) ||
          l.school.toLowerCase().includes(teachingSearchTerm.toLowerCase())
        )
      : lectures

    // Group by course name (en) to aggregate semesters
    const courseMap: Record<string, {
      school: string
      courseName: string
      courseNameKo: string
      periods: string[]
      role: string
    }> = {}

    filtered.forEach(lecture => {
      lecture.courses.forEach(course => {
        const key = `${lecture.school}-${course.en}-${lecture.role}`
        if (!courseMap[key]) {
          courseMap[key] = {
            school: lecture.school,
            courseName: course.en,
            courseNameKo: course.ko,
            periods: [...lecture.periods],
            role: lecture.role
          }
        } else {
          // Add new periods that are not already in the list
          lecture.periods.forEach(p => {
            if (!courseMap[key].periods.includes(p)) {
              courseMap[key].periods.push(p)
            }
          })
        }
      })
    })

    // Sort periods in each course (most recent first)
    Object.values(courseMap).forEach(course => {
      course.periods.sort((a, b) => {
        const [yearA, semA] = a.split(' ')
        const [yearB, semB] = b.split(' ')
        if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA)
        return semB.localeCompare(semA)
      })
    })

    return Object.values(courseMap)
  }, [lectures, teachingSearchTerm])

  // Separate Lecturer and TA courses
  const lecturerCourses = useMemo(() => 
    groupedLectures.filter(c => c.role === 'Lecturer'), [groupedLectures])
  
  const taCourses = useMemo(() => 
    groupedLectures.filter(c => c.role === 'Teaching Assistant'), [groupedLectures])

  // Count total semesters (sum of all periods across all courses)
  const totalSemesters = useMemo(() => 
    groupedLectures.reduce((sum, course) => sum + course.periods.length, 0), [groupedLectures])
  
  const lecturerSemesters = useMemo(() => 
    lecturerCourses.reduce((sum, course) => sum + course.periods.length, 0), [lecturerCourses])
  
  const taSemesters = useMemo(() => 
    taCourses.reduce((sum, course) => sum + course.periods.length, 0), [taCourses])

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center md:scale-105 transition-transform duration-[2000ms]"
          style={{backgroundImage: `url(${banner2})`}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B14D]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B14D]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B14D]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Members
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Director
          </h1>
          
          {/* Divider - < . > style */}
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
            <Link to="/" className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110">
              <Home size={16}/>
            </Link>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-gray-400 font-medium">Members</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">Director</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section ref={contentSectionRef} className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100 pt-24 md:pt-32">
        <div className="flex flex-col lg:flex-row gap-32 md:gap-60">
          {/* Left Column: Profile Card */}
          <aside className="lg:w-340 shrink-0">
            <div 
              ref={profileCardRef}
              className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-16 md:p-20 shadow-sm transition-transform duration-100"
              style={{ transform: `translateY(${profileTop}px)` }}
            >
              <div className="flex flex-col items-center text-center mb-20 md:mb-24">
                <div className="w-100 h-130 md:w-120 md:h-155 bg-gray-100 rounded-2xl overflow-hidden mb-12 md:mb-16 shadow-inner border border-gray-50">
                  <img loading="lazy" src={directorImg} alt="Prof. Insu Choi" className="w-full h-full object-cover"/>
                </div>
                <h2 className="text-base md:text-lg font-bold text-gray-900">Insu Choi</h2>
              </div>

              <div className="flex flex-col gap-12 md:gap-16">
                <div className="flex items-start gap-10 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Briefcase size={14}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Position</p>
                    <p className="text-xs font-semibold text-gray-800">Director</p>
                    <p className="text-[10px] text-gray-500">FINDS Lab</p>
                  </div>
                </div>
                <div className="flex items-start gap-10 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Building size={14}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Affiliation</p>
                    <p className="text-xs font-semibold text-gray-800">Assistant Professor</p>
                    <p className="text-[10px] text-gray-500">Gachon University</p>
                  </div>
                </div>
                <div className="flex items-start gap-10 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <MapPin size={14}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Office</p>
                    <p className="text-xs font-semibold text-gray-800">Room 614, Gachon Hall</p>
                  </div>
                </div>
                <div className="flex items-start gap-10 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Mail size={14}/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">E-mail</p>
                    <div className="flex items-center gap-6">
                      <a href={`mailto:${directorEmail}`} className="select-text text-xs font-semibold text-primary hover:underline break-all">
                        {directorEmail}
                      </a>
                      <button 
                        onClick={handleCopyEmail} 
                        className="size-20 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors shrink-0" 
                        title="Copy email"
                      >
                        {emailCopied ? <Check size={10} className="text-green-500"/> : <Copy size={10} className="text-gray-400"/>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 md:gap-8 mt-16 md:mt-20">
                <button 
                  onClick={() => showModal({
                    title: 'Resume',
                    maxWidth: '800px',
                    children: <ResumeModal />
                  })}
                  className="flex items-center justify-center gap-4 py-10 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  Resume <ExternalLink size={12}/>
                </button>
                <a 
                  href="https://scholar.google.com/citations?user=p9JwRLwAAAAJ&hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 py-10 text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                  style={{backgroundColor: 'rgb(172, 14, 14)', color: '#ffffff'}}
                >
                  Scholar <ExternalLink size={12} color="#ffffff"/>
                </a>
              </div>
              <Link 
                to="/members/director/portfolio/profile"
                className="flex items-center justify-center gap-4 mt-12 text-gray-400 text-xs hover:text-gray-600 transition-colors"
              >
                View Full Portfolio <ChevronRight size={12}/>
              </Link>
            </div>
          </aside>

          {/* Right Column */}
          <main className="flex-1 flex flex-col gap-40 md:gap-56 min-w-0">
            {/* Introduction */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('introduction')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Introduction</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.introduction ? 'rotate-180' : ''}`}/>
              </button>
              {expandedSections.introduction && (
              <div className="bg-gradient-to-br from-gray-50 to-white p-20 md:p-32 border-t border-gray-100">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-20">
                  I am an <span className="font-bold text-gray-900">assistant professor</span> at <span className="font-bold text-gray-900">Gachon University</span> and the <span className="font-bold text-gray-900">director</span> of <span className="font-bold text-gray-900">FINDS Lab</span>, with research interests spanning{' '}
                  <span className="font-bold text-primary">Financial Data Science</span>,{' '}
                  <span className="font-bold text-primary">Business Analytics</span>, and{' '}
                  <span className="font-bold text-primary">Data-Informed Decision Making</span>. My work combines data science with financial engineering to address practical challenges in finance and business.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base font-semibold mb-16">
                  My research focuses on three main areas:
                </p>
                <div className="space-y-16 mb-24">
                  <div className="flex gap-16">
                    <span className="size-28 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center shrink-0">1</span>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      <span className="font-semibold" style={{color: '#D6B14D'}}>Financial Data Science</span> — including <span className="font-semibold text-gray-700">AI applications</span> in quantitative finance, <span className="font-semibold text-gray-700">portfolio optimization</span>, <span className="font-semibold text-gray-700">algorithmic trading</span>, and financial time-series forecasting.
                    </p>
                  </div>
                  <div className="flex gap-16">
                    <span className="size-28 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center shrink-0">2</span>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      <span className="font-semibold" style={{color: '#D6B14D'}}>Business Analytics</span> — using various <span className="font-semibold text-gray-700">analytical methods</span> from time-series models to graph-based approaches to uncover <span className="font-semibold text-gray-700">meaningful insights</span>.
                    </p>
                  </div>
                  <div className="flex gap-16">
                    <span className="size-28 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center shrink-0">3</span>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      <span className="font-semibold" style={{color: '#D6B14D'}}>Data-Informed Decision Making</span> — extracting <span className="font-semibold text-gray-700">iridescent views</span> for <span className="font-semibold text-gray-700">multi-perspective interpretation</span> and synthesis to support decisions in business and industry.
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base pt-20 border-t border-gray-200">
                  My goal is to <span className="font-semibold text-gray-800">connect academic research with practical applications</span>, developing ideas that are both <span className="font-semibold text-primary">well-grounded</span> and <span className="font-semibold text-primary">useful</span>.
                </p>
              </div>
              )}
            </section>

            {/* Research Interests */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('researchInterests')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Research Interests</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.researchInterests ? 'rotate-180' : ''}`}/>
              </button>
              {expandedSections.researchInterests && (
              <div className="p-20 md:p-24 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {researchInterests.map((area, index) => (
                  <div key={index} className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 rounded-xl p-20 md:p-24 hover:shadow-lg hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-10 mb-16 pb-12 border-b border-gray-100">
                      <div className="size-8 rounded-full bg-primary/40"/>
                      <h4 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-primary transition-colors">{area.category}</h4>
                    </div>
                    <ul className="space-y-10">
                      {area.items.map((item, idx) => {
                        // Special handling for Iridescent View Extraction - gold on both mobile and PC
                        if (item.includes('Iridescent View Extraction')) {
                          const highlightedItem = item.replace(
                            'Iridescent View Extraction',
                            '<span class="text-primary font-semibold">Iridescent View Extraction</span>'
                          )
                          return (
                            <li key={idx} className="flex items-start gap-10">
                              <span className="size-5 rounded-full shrink-0 mt-7 bg-primary/40"/>
                              <span 
                                className="text-xs md:text-sm text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{__html: highlightedItem}}
                              />
                            </li>
                          )
                        }
                        // Extract key terms for highlighting
                        const highlightTerms = item.match(/[A-Z][a-zA-Z-]+(?:\s+[&]\s+[A-Z][a-zA-Z-]+)?|AI|Decision|Data|Business|Financial|Risk/g) || []
                        let highlightedItem = item
                        highlightTerms.slice(0, 2).forEach(term => {
                          highlightedItem = highlightedItem.replace(term, `<mark>${term}</mark>`)
                        })
                        return (
                          <li key={idx} className="flex items-start gap-10">
                            <span className="size-5 rounded-full shrink-0 mt-7 bg-primary/40"/>
                            <span 
                              className="text-xs md:text-sm text-gray-600 leading-relaxed [&>mark]:bg-transparent [&>mark]:text-primary [&>mark]:font-semibold"
                              dangerouslySetInnerHTML={{__html: highlightedItem}}
                            />
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
              )}
            </section>


            {/* Education */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('education')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Education</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.education ? 'rotate-180' : ''}`}/>
              </button>
              {expandedSections.education && (
              <div className="p-20 md:p-24 border-t border-gray-100">
              <div className="relative border-l-2 border-primary/20 ml-6 md:ml-8">
                {education.map((edu, index) => (
                  <div key={index} className="relative pb-32 last:pb-0 group pl-24 md:pl-32">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-0 bottom-0 flex items-center -translate-x-1/2" style={{left: '-1px'}}>
                      <div className="size-12 md:size-16 bg-primary rounded-full border-3 md:border-4 border-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30"/>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-16 md:p-24 hover:shadow-md transition-all">
                      {/* Main Content */}
                      <div className="flex gap-12 md:gap-16">
                        {/* Logo */}
                        <div className="size-48 md:size-56 bg-gray-50 rounded-xl p-6 md:p-8 flex items-center justify-center shrink-0">
                          <img loading="lazy" src={edu.logo} alt={edu.school} className="w-full h-full object-contain"/>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {/* Period Badge */}
                          <span className="inline-block px-10 py-3 text-[10px] md:text-xs font-bold rounded-full bg-primary text-white mb-10">{edu.period}</span>
                          
                          {/* Degree - Largest */}
                          <p className="text-base md:text-lg font-bold text-gray-900 leading-tight">{edu.degree}</p>
                          
                          {/* School - Medium */}
                          <p className="text-sm md:text-base font-semibold text-gray-700 mt-6">{edu.school}</p>
                          
                          {/* Field - Smallest */}
                          <p className="text-xs md:text-sm text-gray-500 mt-3">{edu.field}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
              )}
            </section>

            {/* Employment */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('employment')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Employment</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.employment ? 'rotate-180' : ''}`}/>
              </button>
              {expandedSections.employment && (
              <div className="p-20 md:p-24 border-t border-gray-100">
              <div className="relative border-l-2 border-primary/20 ml-6 md:ml-8">
                {employment.filter((emp) => 
                  emp.organization === 'Gachon University' ||
                  emp.organization === 'Dongduk Women\'s University' ||
                  emp.position === 'Director' ||
                  (emp.position === 'Lecturer' && (emp.organization === 'Kangnam University' || emp.organization === 'Korea University')) ||
                  emp.organization === 'EY Consulting'
                ).map((emp, index) => (
                  <div key={index} className="relative pb-16 md:pb-24 last:pb-0 group pl-24 md:pl-32">
                    {/* Timeline dot - vertically centered */}
                    <div className="absolute left-0 top-0 bottom-0 flex items-center -translate-x-1/2" style={{left: '-1px'}}>
                      <div className={`size-12 md:size-16 rounded-full border-3 md:border-4 border-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                        emp.isCurrent ? 'bg-primary group-hover:shadow-primary/30' : 'bg-gray-300 group-hover:shadow-gray-300/50'
                      }`}/>
                    </div>
                    <div className="flex items-center gap-12 md:gap-16 bg-white border border-gray-100 rounded-lg md:rounded-xl p-12 md:p-16 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:bg-gradient-to-r hover:from-white hover:to-primary/[0.02] transition-all duration-300">
                      <div className="size-36 md:size-44 bg-gray-50 rounded-lg p-4 md:p-6 flex items-center justify-center shrink-0">
                        <img loading="lazy" src={emp.logo} alt={emp.organization} className="w-full h-full object-contain"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-6 md:gap-8 mb-4">
                          <span className={`px-8 md:px-10 py-2 text-[9px] md:text-[10px] font-bold rounded-full ${
                            emp.isCurrent
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>{emp.period}</span>
                        </div>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900">{emp.position}</h4>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold break-words">{emp.organization}</p>
                        {emp.department && emp.department.includes(',') ? (
                          <>
                            <p className="text-[10px] md:text-xs font-medium text-gray-600 break-words">{emp.department.split(',')[0].trim()}</p>
                            <p className="text-[10px] md:text-xs text-gray-500 break-words">{emp.department.split(',').slice(1).join(',').trim()}</p>
                          </>
                        ) : emp.department && (
                          <p className="text-[10px] md:text-xs font-medium text-gray-600 break-words">{emp.department}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
              )}
            </section>

            {/* Honors & Awards */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('honorsAwards')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Honors & Awards</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.honorsAwards ? 'rotate-180' : ''}`}/>
              </button>

              {expandedSections.honorsAwards && (
                <div className="border-t border-gray-100 p-20 md:p-24">
                  {!honorsData || Object.keys(honorsData).length === 0 ? (
                    <div className="py-16 text-center text-sm text-gray-400">
                      No awards data available
                    </div>
                  ) : (
                    <>
                      {/* Statistics Section */}
                      {(() => {
                        const allItems = Object.values(honorsData).flat()
                        const totalAwards = allItems.filter(item => item.type === 'award').length
                        const totalHonors = allItems.filter(item => item.type === 'honor').length
                        const totalItems = totalAwards + totalHonors
                        return (
                          <div className="flex flex-col gap-16 md:gap-24 mb-20">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
                              <span className="w-8 h-8 rounded-full bg-primary" />
                              Statistics
                            </h3>
                            
                            {/* Total - Full Width */}
                            <div className="group relative bg-[#FFF9E6] border border-[#D6B14D]/20 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                              <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-[#D6B14D]/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#D6B14D'}}>{totalItems}</span>
                                <div className="flex items-center gap-6">
                                  <Award className="size-14 md:size-16" style={{color: '#D6B14D', opacity: 0.7}} />
                                  <span className="text-xs md:text-sm font-medium text-gray-600">Total</span>
                                </div>
                              </div>
                            </div>

                            {/* Honors & Awards - 2 columns */}
                            <div className="grid grid-cols-2 gap-8 md:gap-12">
                              <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col">
                                  <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#D6B14D'}}>{totalHonors}</span>
                                  <div className="flex items-center gap-6">
                                    <Medal className="size-14 md:size-16" style={{color: '#D6B14D', opacity: 0.7}} />
                                    <span className="text-xs md:text-sm font-medium text-gray-600">Honors</span>
                                  </div>
                                </div>
                              </div>
                              <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col">
                                  <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#AC0E0E'}}>{totalAwards}</span>
                                  <div className="flex items-center gap-6">
                                    <Trophy className="size-14 md:size-16" style={{color: '#AC0E0E', opacity: 0.7}} />
                                    <span className="text-xs md:text-sm font-medium text-gray-600">Awards</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })()}

                    </>
                  )}
                </div>
              )}
            </section>

            {/* Publication Statistics */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('publicationStats')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Publication Statistics</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.publicationStats ? 'rotate-180' : ''}`}/>
              </button>
              {expandedSections.publicationStats && (
                <div className="p-20 md:p-24 border-t border-gray-100">
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-8 md:gap-12 mb-16 md:mb-24">
                    {pubStats.map((stat, index) => (
                      <div key={index} className="text-center p-12 md:p-16 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors">
                        <div className="text-lg md:text-xl font-bold text-primary">{stat.count}</div>
                        <div className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase mt-4">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 border-t border-gray-100">
                    {citationStats.map((stat, index) => (
                      <div key={index} className="text-center p-16 md:p-24 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors">
                        <div className="text-xl md:text-2xl font-bold text-primary">{stat.count}</div>
                        <div className="text-[9px] md:text-[11px] font-bold text-gray-500 uppercase mt-4">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Teaching */}
            {lectures.length > 0 && (
              <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleSection('teaching')}
                  className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Teaching</h3>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.teaching ? 'rotate-180' : ''}`}/>
                </button>
                {expandedSections.teaching && (
                  <div className="p-20 md:p-24 border-t border-gray-100">
                    {/* Lecturer Section */}
                    {lecturerCourses.length > 0 && (
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-16 py-12 bg-gray-50">
                          <div className="flex items-center gap-8">
                            <p className="text-sm font-bold text-gray-900">Lecturer</p>
                            <span className="px-8 py-2 bg-[#D6B14D] text-gray-900 text-[10px] font-bold rounded-full">{lecturerSemesters}</span>
                          </div>
                        </div>
                        <div className="space-y-12 p-16">
                          {lecturerCourses.map((course, index) => {
                            const getSchoolLogo = (school: string) => {
                              if (school.includes('KAIST') || school.includes('Korea Advanced')) return logoKaist
                              if (school.includes('Kyung Hee')) return logoKyunghee
                              if (school.includes('Gachon')) return logoGcu
                              if (school.includes('Dongduk')) return logoDwu
                              if (school.includes('Kangnam')) return logoKangnam
                              if (school.includes('Korea University') || school === 'Korea University') return logoKorea
                              return null
                            }
                            const schoolLogo = getSchoolLogo(course.school)
                            
                            return (
                              <div key={index} className="bg-white border border-gray-100 rounded-xl p-16 md:p-20 hover:shadow-md hover:border-primary/30 transition-all">
                                <div className="flex items-start gap-12 md:gap-16">
                                  <div className="size-36 md:size-40 rounded-xl flex items-center justify-center shrink-0 border-2 border-[#D6B14D]/30 bg-white overflow-hidden">
                                    {schoolLogo ? (
                                      <img loading="lazy" src={schoolLogo} alt={course.school} className="w-[70%] h-[70%] object-contain" />
                                    ) : (
                                      <BookOpen size={18} style={{color: '#D6B14D'}} />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-6 mb-8">
                                      {course.periods.map((period, i) => (
                                        <span key={i} className="px-8 py-2 bg-primary/10 text-primary text-[9px] md:text-[10px] font-bold rounded-full">
                                          {period}
                                        </span>
                                      ))}
                                    </div>
                                    <p className="text-xs md:text-sm font-bold text-gray-900">{course.courseNameKo || course.courseName}</p>
                                    {course.courseNameKo && course.courseName !== course.courseNameKo && (
                                      <p className="text-[10px] md:text-xs text-gray-500 mt-2">{course.courseName}</p>
                                    )}
                                    <p className="text-[10px] md:text-xs text-gray-400 mt-4">{course.school}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorTemplate)
