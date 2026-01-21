import {memo, useState, useEffect, useMemo} from 'react'
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
  Home,
  Copy,
  Check,
  User,
  Activity,
  Award,
  Landmark,
  GraduationCap,
  Calendar,
  BookOpen,
  Search,
} from 'lucide-react'
import {useStoreModal} from '@/store/modal'
import type {AcademicActivitiesData} from '@/types/data'
import {CollaborationNetwork} from '@/components/organisms/collaboration-network'

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
    period: '2025.02',
    degree: 'Doctor of Philosophy (Ph.D.) in Engineering',
    field: 'Industrial and Systems Engineering',
    advisors: [
      {name: 'Woo Chang Kim', url: 'https://scholar.google.com/citations?user=7NmBs1kAAAAJ&hl=en'}
    ],
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
    advisors: [
      {name: 'Woo Chang Kim', url: 'https://scholar.google.com/citations?user=7NmBs1kAAAAJ&hl=en'}
    ],
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

// Static Data - Employment (sorted by start date, newest first)
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

// Static Data - Professional Affiliations
const affiliations = [
  {organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE) 종신회원', role: 'Lifetime Member', period: '2025.06 – Present'},
  {organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA) 종신회원', role: 'Lifetime Member', period: '2023.09 – Present'},
  {organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA) 종신회원', role: 'Lifetime Member', period: '2023.06 – Present'},
  {organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS) 종신회원', role: 'Lifetime Member', period: '2022.06 – Present'},
]

// Static Data - Citation Statistics (manually updated)
const citationStats = [{label: 'Citations', count: 154}, {label: 'g-index', count: 11}, {label: 'h-index', count: 8}, {label: 'i10-index', count: 6}]

// Static Data - Research Interests
const researchInterests = [
  {
    category: 'Financial Data Science',
    items: [
      'AI in Quantitative Finance & Asset Management',
      'Financial Time-Series Modeling & Forecasting',
      'Household Finance & Behavioral Decision Modeling'
    ]
  },
  {
    category: 'Business Analytics',
    items: [
      'Data Analytics for Cross-Industry & Cross-Domain Convergences',
      'Data Visualization & Transparency in Business Analytics',
      'Business Insights from Data Science Techniques'
    ]
  },
  {
    category: 'Data-Informed Decision Making',
    items: [
      'Trustworthy Decision Systems & Optimization',
      'Risk-Aware & User-Friendly Decision Tools',
      'Decision Analytics for Complex Business Problems'
    ]
  },
]

export const MembersDirectorAcademicTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [projectSearchTerm, setProjectSearchTerm] = useState('')
  const [teachingSearchTerm, setTeachingSearchTerm] = useState('')
  const [expandedProjectYears, setExpandedProjectYears] = useState<string[]>([])
  const [activitiesData, setActivitiesData] = useState<AcademicActivitiesData | null>(null)
  const [showAllJournals, setShowAllJournals] = useState(false)
  const [showAllConferences, setShowAllConferences] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    collaborationNetwork: true,
    publicationStats: true,
    academicService: true,
    projects: true,
    teaching: true
  })
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section as keyof typeof prev]}))
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
    
    // Fetch Academic Activities
    fetch(`${baseUrl}data/academic-activities.json`)
      .then(res => res.json())
      .then((data: AcademicActivitiesData) => setActivitiesData(data))
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

  const journals = useMemo(() => {
    if (!activitiesData) return []
    return activitiesData.activities.filter(a => a.category === 'journal')
  }, [activitiesData])

  const committees = useMemo(() => {
    if (!activitiesData) return []
    return activitiesData.activities.filter(a => a.category === 'committee')
  }, [activitiesData])

  const sessionChairs = useMemo(() => {
    if (!activitiesData) return []
    return activitiesData.activities.filter(a => a.category === 'chair')
  }, [activitiesData])

  const conferenceReviewers = useMemo(() => {
    if (!activitiesData) return []
    return activitiesData.activities.filter(a => a.category === 'conference')
  }, [activitiesData])

  const displayedJournals = useMemo(() => {
    return showAllJournals ? journals : journals.slice(0, 15)
  }, [journals, showAllJournals])

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{backgroundImage: `url(${banner2})`}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B04C]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B04C]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B04C]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Members
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B04C]/80" />
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

      {/* Tab Navigation - Sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20">
          <div className="flex items-center gap-4 md:gap-8 py-12 md:py-16 lg:w-340 xl:w-380">
            <Link
              to="/members/director"
              className="flex-1 flex items-center justify-center gap-6 px-12 md:px-16 py-10 md:py-12 rounded-full text-sm md:text-base font-semibold transition-all duration-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <User size={16} />
              Profile
            </Link>
            <Link
              to="/members/director/academic"
              className="flex-1 flex items-center justify-center gap-6 px-12 md:px-16 py-10 md:py-12 rounded-full text-sm md:text-base font-semibold transition-all duration-300 bg-primary text-white shadow-lg shadow-primary/30"
            >
              <BookOpen size={16} />
              Scholarly
            </Link>
            <Link
              to="/members/director/activities"
              className="flex-1 flex items-center justify-center gap-6 px-12 md:px-16 py-10 md:py-12 rounded-full text-sm md:text-base font-semibold transition-all duration-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Activity size={16} />
              Activities
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100 pt-24 md:pt-32">
        <div className="flex flex-col lg:flex-row gap-32 md:gap-60">
          {/* Left Column: Profile Card */}
          <aside className="lg:w-340 xl:w-380 flex flex-col gap-24 md:gap-40 shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-20 md:p-24 shadow-sm lg:sticky lg:top-100">
              <div className="flex flex-col items-center text-center mb-24 md:mb-32">
                <div className="size-140 md:size-180 bg-gray-100 rounded-2xl overflow-hidden mb-16 md:mb-24 shadow-inner border border-gray-50">
                  <img src={directorImg} alt="Prof. Insu Choi" className="w-full h-full object-cover"/>
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
                  Insu Choi
                  <span className="text-sm md:text-base font-medium text-gray-400 ml-4">, Ph.D.</span>
                </h2>
                <p className="text-base md:text-lg text-gray-500 font-medium">최인수</p>
              </div>

              <div className="flex flex-col gap-16 md:gap-20">
                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Briefcase size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Position</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Director</p>
                    <p className="text-[10px] md:text-xs text-gray-500">FINDS Lab.</p>
                  </div>
                </div>
                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Building size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Affiliation</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Assistant Professor</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Gachon University</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Department of Big Data Business Management</p>
                  </div>
                </div>
                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <MapPin size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Office</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Room 706, Humanities Hall</p>
                    <p className="text-[10px] md:text-xs text-gray-500">인문관 706호</p>
                  </div>
                </div>
                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Mail size={16}/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</p>
                    <div className="flex items-center gap-8">
                      <a href={`mailto:${directorEmail}`} className="text-xs md:text-sm font-semibold text-primary hover:underline break-all">
                        {directorEmail}
                      </a>
                      <button 
                        onClick={handleCopyEmail} 
                        className="size-24 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors shrink-0" 
                        title="Copy email"
                      >
                        {emailCopied ? <Check size={12} className="text-green-500"/> : <Copy size={12} className="text-gray-400"/>}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Phone size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">02-940-4424</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 md:gap-12 mt-24 md:mt-32">
                <button 
                  onClick={() => showModal({
                    title: 'Curriculum Vitae', 
                    maxWidth: '1000px', 
                    children: <div className="p-40 text-center text-gray-500">CV content goes here...</div>
                  })} 
                  className="flex items-center justify-center gap-6 py-12 bg-primary text-white text-xs md:text-sm font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  View CV <ExternalLink size={14}/>
                </button>
                <a 
                  href="https://scholar.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-6 py-12 bg-gray-900 text-xs md:text-sm font-bold rounded-xl hover:bg-gray-800 transition-all"
                  style={{color: '#ffffff'}}
                >
                  Scholar <ExternalLink size={14} color="#ffffff"/>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column */}
          <main className="flex-1 flex flex-col gap-40 md:gap-56 min-w-0">
            {/* Collaboration Network */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('collaborationNetwork')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Collaboration Network</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.collaborationNetwork ? 'rotate-180' : ''}`}/>
              </button>
              {expandedSections.collaborationNetwork && (
                <div className="border-t border-gray-100 p-20 md:p-24">
                  <CollaborationNetwork />
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
                  <div className="mt-20 text-center">
                    <Link to="/publications?author=Insu Choi" className="inline-flex items-center gap-4 text-sm text-primary font-medium hover:underline">
                      View All Publications <ChevronRight size={14}/>
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* Academic Service */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('academicService')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Academic Service</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.academicService ? 'rotate-180' : ''}`}/>
              </button>
              {expandedSections.academicService && (
                <div className="border-t border-gray-100">
                  {/* Editorial Board Memberships */}
                  <div className="p-24">
                    <div className="flex items-center gap-8 mb-16">
                      <p className="text-sm font-bold text-gray-900">Editorial Board Memberships</p>
                      <span className="px-8 py-2 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-full">0</span>
                    </div>
                    <div className="py-16 text-center text-sm text-gray-400">Coming soon...</div>
                  </div>

                  {/* Academic Memberships */}
                  <div className="p-24 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex items-center gap-8 mb-16">
                      <p className="text-sm font-bold text-gray-900">Academic Memberships</p>
                      <span className="px-8 py-2 bg-primary text-white text-[10px] font-bold rounded-full">4</span>
                    </div>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between p-12 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-gray-900">Korean Institute of Industrial Engineers (KIIE)</p>
                          <p className="text-[10px] text-gray-500 mt-2">대한산업공학회 (KIIE) 종신회원</p>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <span className="px-6 py-2 bg-gray-800 text-white text-[9px] font-bold rounded">Lifetime Member</span>
                          <span className="px-8 py-2 text-[9px] font-bold rounded-full bg-primary text-white">2025.06 – Present</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-12 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-gray-900">Korean Securities Association (KSA)</p>
                          <p className="text-[10px] text-gray-500 mt-2">한국증권학회 (KSA) 종신회원</p>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <span className="px-6 py-2 bg-gray-800 text-white text-[9px] font-bold rounded">Lifetime Member</span>
                          <span className="px-8 py-2 text-[9px] font-bold rounded-full bg-primary text-white">2023.09 – Present</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-12 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-gray-900">Korean Academic Society of Business Administration (KASBA)</p>
                          <p className="text-[10px] text-gray-500 mt-2">한국경영학회 (KASBA) 종신회원</p>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <span className="px-6 py-2 bg-gray-800 text-white text-[9px] font-bold rounded">Lifetime Member</span>
                          <span className="px-8 py-2 text-[9px] font-bold rounded-full bg-primary text-white">2023.06 – Present</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-12 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-gray-900">Korea Intelligent Information Systems Society (KIISS)</p>
                          <p className="text-[10px] text-gray-500 mt-2">한국지능정보시스템학회 (KIISS) 종신회원</p>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <span className="px-6 py-2 bg-gray-800 text-white text-[9px] font-bold rounded">Lifetime Member</span>
                          <span className="px-8 py-2 text-[9px] font-bold rounded-full bg-primary text-white">2022.06 – Present</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Program Committee */}
                  <div className="p-24 border-t border-gray-100">
                    <div className="flex items-center gap-8 mb-16">
                      <p className="text-sm font-bold text-gray-900">Program Committee</p>
                      <span className="px-8 py-2 bg-[#D6B04C] text-white text-[10px] font-bold rounded-full">{committees.length}</span>
                    </div>
                    {committees.length > 0 ? (
                      <div className="flex flex-col gap-6">
                        {committees.map((comm) => (
                          <a key={comm.id} href={comm.url || '#'} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between px-16 py-10 rounded-lg text-sm font-medium transition-all hover:shadow-md bg-white border border-gray-100 hover:border-[#D6B04C]/30">
                            <span className="text-gray-700">{comm.name}</span>
                            <span className="px-8 py-2 rounded text-[10px] font-bold shrink-0 bg-[#D6B04C] text-white">{comm.period || comm.since}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-sm text-gray-400">Coming soon...</div>
                    )}
                  </div>

                  {/* Session Chair */}
                  <div className="p-24 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex items-center gap-8 mb-16">
                      <p className="text-sm font-bold text-gray-900">Session Chair</p>
                      <span className="px-8 py-2 text-white text-[10px] font-bold rounded-full" style={{backgroundColor: '#E8889C'}}>{sessionChairs.length}</span>
                    </div>
                    {sessionChairs.length > 0 ? (
                      <div className="flex flex-col gap-6">
                        {sessionChairs.map((chair) => (
                          <a key={chair.id} href={chair.url || '#'} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between px-16 py-10 rounded-lg text-sm font-medium transition-all hover:shadow-md bg-white border border-gray-100 hover:border-[#E8889C]/30">
                            <span className="text-gray-700">{chair.name}</span>
                            <span className="px-8 py-2 rounded text-[10px] font-bold shrink-0" style={{backgroundColor: '#E8889C', color: 'white'}}>{chair.period || chair.since}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-sm text-gray-400">Coming soon...</div>
                    )}
                  </div>

                  {/* Journal Reviewer */}
                  <div className="p-24 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-16">
                      <div className="flex items-center gap-8">
                        <p className="text-sm font-bold text-gray-900">Journal Reviewer</p>
                        <span className="px-8 py-2 bg-primary text-white text-[10px] font-bold rounded-full">{journals.length}</span>
                      </div>
                      {journals.length > 15 && (
                        <button onClick={() => setShowAllJournals(!showAllJournals)} className="text-xs text-primary font-medium hover:underline">
                          {showAllJournals ? 'Show Less' : 'Show All'}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-6">
                      {displayedJournals.map((journal) => (
                        <a key={journal.id} href={journal.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between px-16 py-10 rounded-lg text-sm font-medium transition-all hover:shadow-md bg-white border border-gray-100 hover:border-primary/30">
                          <span className="text-gray-700">{journal.name}</span>
                          <span className={`px-8 py-2 rounded text-[10px] font-bold shrink-0 ${
                            journal.type === 'SCIE' ? 'bg-[#D6B04C] text-white' :
                            journal.type === 'SSCI' ? 'bg-[#AC0E0E] text-white' :
                            journal.type === 'ESCI' ? 'bg-[#D6C360] text-white' :
                            journal.type === 'SCOPUS' ? 'bg-[#E8D688] text-gray-700' :
                            'bg-[#FFBAC4] text-gray-700'
                          }`}>{journal.type}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Conference Reviewer */}
                  <div className="p-24 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-16">
                      <div className="flex items-center gap-8">
                        <p className="text-sm font-bold text-gray-900">Conference Reviewer</p>
                        <span className="px-8 py-2 text-white text-[10px] font-bold rounded-full" style={{backgroundColor: '#FFBAC4'}}>{conferenceReviewers.length}</span>
                      </div>
                      {conferenceReviewers.length > 20 && (
                        <button onClick={() => setShowAllConferences(!showAllConferences)} className="text-xs text-primary font-medium hover:underline">
                          {showAllConferences ? 'Show Less' : 'Show All'}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-6">
                      {(showAllConferences ? conferenceReviewers : conferenceReviewers.slice(0, 20)).map((conf) => (
                        <a key={conf.id} href={conf.url || '#'} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between px-16 py-10 rounded-lg text-sm font-medium transition-all hover:shadow-md bg-white border border-gray-100 hover:border-[#FFBAC4]/30">
                          <span className="text-gray-700">{conf.name}</span>
                          <span className="px-8 py-2 rounded text-[10px] font-bold shrink-0" style={{backgroundColor: '#FFBAC4', color: 'white'}}>{conf.period || conf.since}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Projects */}
            {projects.length > 0 && (
              <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleSection('projects')}
                  className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Projects</h3>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.projects ? 'rotate-180' : ''}`}/>
                </button>
                {expandedSections.projects && (
                <div className="p-20 md:p-24 border-t border-gray-100">
                {/* Search */}
                <div className="relative mb-16">
                  <Search size={16} className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearchTerm}
                    onChange={(e) => setProjectSearchTerm(e.target.value)}
                    className="w-full pl-36 pr-12 py-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                {/* Year-grouped projects */}
                <div className="space-y-12">
                  {projectYears.map(year => (
                    <div key={year} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleProjectYear(year)}
                        className="w-full flex items-center justify-between p-16 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-8">
                          <span className="text-sm md:text-base font-bold text-gray-900">{year}</span>
                          <span className="px-8 py-2 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                            {projectsByYear[year].length} {projectsByYear[year].length === 1 ? 'Project' : 'Projects'}
                          </span>
                        </div>
                        {expandedProjectYears.includes(year) ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                      </button>
                      {expandedProjectYears.includes(year) && (
                        <div className="border-t border-gray-100 divide-y divide-gray-50">
                          {projectsByYear[year].map((project, index) => {
                            const typeIcons = {
                              government: Landmark,
                              industry: Building,
                              institution: GraduationCap,
                              academic: Briefcase,
                            }
                            const typeColors = {
                              government: 'bg-primary text-white',
                              industry: 'bg-[#D6B04C] text-white',
                              institution: 'bg-[#FFBAC4] text-white',
                              academic: 'bg-gray-700 text-white',
                            }
                            const Icon = typeIcons[project.type]
                            // Determine director's role
                            const getDirectorRole = () => {
                              // Check if 최인수 is the principalInvestigator
                              if (project.roles.principalInvestigator === '최인수') return 'Principal Investigator'
                              if (project.roles.leadResearcher === '최인수') return 'Lead Researcher'
                              if (project.roles.researchers?.includes('최인수')) return 'Researcher'
                              return 'Researcher'
                            }
                            const roleColor: Record<string, string> = {
                              'Principal Investigator': 'bg-gray-900 text-white',
                              'Lead Researcher': 'bg-gray-600 text-white',
                              'Researcher': 'bg-gray-400 text-white'
                            }
                            const directorRole = getDirectorRole()
                            const journals = useMemo(() => {
    if (!activitiesData) return []
    return activitiesData.activities.filter(a => a.category === 'journal')
  }, [activitiesData])

  const committees = useMemo(() => {
    if (!activitiesData) return []
    return activitiesData.activities.filter(a => a.category === 'committee')
  }, [activitiesData])

  const sessionChairs = useMemo(() => {
    if (!activitiesData) return []
    return activitiesData.activities.filter(a => a.category === 'chair')
  }, [activitiesData])

  const conferenceReviewers = useMemo(() => {
    if (!activitiesData) return []
    return activitiesData.activities.filter(a => a.category === 'conference')
  }, [activitiesData])

  const displayedJournals = useMemo(() => {
    return showAllJournals ? journals : journals.slice(0, 15)
  }, [journals, showAllJournals])

  return (
                              <div key={index} className="p-16 hover:bg-gray-50/50 transition-all">
                                <div className="flex items-start gap-12 md:gap-16">
                                  <div className={`size-36 md:size-40 rounded-xl flex items-center justify-center shrink-0 ${typeColors[project.type]}`}>
                                    <Icon size={18} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-6 mb-8">
                                      <span className="px-8 py-2 bg-gray-100 text-gray-600 text-[9px] md:text-[10px] font-bold rounded-full flex items-center gap-4">
                                        <Calendar size={10} />
                                        {project.period}
                                      </span>
                                      <span className={`px-8 py-2 text-[9px] md:text-[10px] font-bold rounded-full ${roleColor[directorRole] || 'bg-gray-500 text-white'}`}>
                                        {directorRole}
                                      </span>
                                    </div>
                                    <p className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2">{project.titleKo}</p>
                                    <p className="text-[10px] md:text-xs text-gray-600 mt-4 line-clamp-2">{project.titleEn}</p>
                                    <p className="text-[10px] md:text-xs text-gray-500 mt-4">{project.fundingAgency}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
                )}
              </section>
            )}

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

                {/* Search */}
                <div className="relative mb-16">
                  <Search size={16} className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={teachingSearchTerm}
                    onChange={(e) => setTeachingSearchTerm(e.target.value)}
                    className="w-full pl-36 pr-12 py-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                {/* Lecturer Section */}
                {lecturerCourses.length > 0 && (
                  <div className="mb-24">
                    <div className="flex items-center gap-8 mb-12">
                      <p className="text-sm font-bold text-gray-900">Lecturer</p>
                      <span className="px-8 py-2 bg-[#D6B04C] text-gray-900 text-[10px] font-bold rounded-full">{lecturerSemesters}</span>
                    </div>
                    <div className="space-y-12">
                      {lecturerCourses.map((course, index) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-xl p-16 md:p-20 hover:shadow-md hover:border-primary/30 transition-all">
                          <div className="flex items-start gap-12 md:gap-16">
                            <div className="size-36 md:size-40 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor: 'rgba(214, 176, 76,0.15)'}}>
                              <BookOpen size={18} style={{color: '#D6B04C'}} />
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
                      ))}
                    </div>
                  </div>
                )}

                {/* Teaching Assistant Section */}
                {taCourses.length > 0 && (
                  <div>
                    <div className="flex items-center gap-8 mb-12">
                      <p className="text-sm font-bold text-gray-900">Teaching Assistant</p>
                      <span className="px-8 py-2 text-white text-[10px] font-bold rounded-full" style={{backgroundColor: '#E8889C'}}>{taSemesters}</span>
                    </div>
                    <div className="space-y-12">
                      {taCourses.map((course, index) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-xl p-16 md:p-20 hover:shadow-md hover:border-primary/30 transition-all">
                          <div className="flex items-start gap-12 md:gap-16">
                            <div className="size-36 md:size-40 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor: 'rgba(232,135,155,0.15)'}}>
                              <BookOpen size={18} style={{color: '#E8889C'}} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-6 mb-8">
                                {course.periods.map((period, i) => (
                                  <span key={i} className="px-8 py-2 text-[9px] md:text-[10px] font-bold rounded-full" style={{backgroundColor: 'rgba(232,135,155,0.15)', color: '#E8889C'}}>
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
                      ))}
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

export default memo(MembersDirectorAcademicTemplate)
