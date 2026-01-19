import {memo, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  Building,
  ChevronRight,
  Home,
  Copy,
  Check,
  User,
  Activity,
} from 'lucide-react'
import {useStoreModal} from '@/store/modal'

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

// Static Data
const education = [
  {
    school: 'Korea Advanced Institute of Science and Technology (KAIST)',
    period: '2025.02',
    degree: 'Doctor of Philosophy (Ph.D.) in Engineering',
    field: 'Industrial and Systems Engineering',
    krName: '한국과학기술원 (KAIST) 산업및시스템공학 공학박사',
    advisor: 'Woo Chang Kim',
    awards: [{title: 'Best Doctoral Dissertation Award', org: 'KORMS'}],
    logo: logoKaist
  },
  {
    school: 'Korea Advanced Institute of Science and Technology (KAIST)',
    period: '2021.02',
    degree: 'Master of Science (M.S.) in Engineering',
    field: 'Industrial and Systems Engineering',
    krName: '한국과학기술원 (KAIST) 산업및시스템공학 공학석사',
    advisor: 'Woo Chang Kim',
    awards: [{title: 'Best Master\'s Thesis Award', org: 'KIIE'}],
    logo: logoKaist
  },
  {
    school: 'Kyung Hee University',
    period: '2019.02',
    degree: 'Bachelor of Science (B.S.) in Engineering',
    field: 'Industrial and Management Engineering',
    krName: '경희대학교 산업경영공학 공학사',
    awards: [{title: 'Valedictorian', org: '1st out of 86'}],
    logo: logoKyunghee
  },
]

const employment = [
  {position: 'Assistant Professor', organization: 'Gachon University', department: 'Dept. of Big Data Business Management', period: '2026.03 – Present', krOrg: '가천대학교 빅데이터경영학과', logo: logoGcu, isCurrent: true},
  {position: 'Assistant Professor', organization: 'Dongduk Women\'s University', department: 'Dept. of Business Administration', period: '2025.09 – 2026.02', krOrg: '동덕여자대학교 경영학과', logo: logoDwu, isCurrent: false},
  {position: 'Director', organization: 'FINDS Lab.', department: 'Financial Insights and Data Science Lab', period: '2025.09 – Present', krOrg: 'FINDS Lab. 디렉터', logo: logoFinds, isCurrent: true},
  {position: 'Lecturer', organization: 'Kangnam University', department: 'School of Global Business', period: '2025.03 – Present', krOrg: '강남대학교 글로벌경영학부', logo: logoKangnam, isCurrent: true},
  {position: 'Lecturer', organization: 'Korea University Sejong Campus', department: 'Division of Digital Studies', period: '2025.03 – 2025.06', krOrg: '고려대학교 세종 디지털학부', logo: logoKorea, isCurrent: false},
  {position: 'Lecturer', organization: 'Kyung Hee University', department: 'Dept. of Industrial and Management Engineering', period: '2024.03 – 2024.06', krOrg: '경희대학교 산업경영공학과', logo: logoKyunghee, isCurrent: false},
  {position: 'Research Consultant', organization: 'WorldQuant, LLC', department: '', period: '2020.09 – Present', krOrg: '월드퀀트', logo: logoWorldquant, isCurrent: true},
  {position: 'Senior Consultant', organization: 'Ernst & Young Advisory', department: 'Quantitative Advisory Services', period: '2019.01 – 2019.07', krOrg: 'EY 한영', logo: logoEy, isCurrent: false},
  {position: 'Intern', organization: 'JL C&C', department: 'AI Lab. R&D', period: '2017.12 – 2018.02', krOrg: 'JL씨앤씨', logo: logoJl, isCurrent: false},
]

const affiliations = [
  {organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회', role: 'Lifelong Member', period: '2025 – Present'},
  {organization: 'Korean Statistical Society (KSA)', krOrg: '한국통계학회', role: 'Lifelong Member', period: '2024 – Present'},
  {organization: 'Korea Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회', role: 'Lifelong Member', period: '2024 – Present'},
  {organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회', role: 'Lifelong Member', period: '2024 – Present'},
]

const publicationStats = [{label: 'Journal', count: 20}, {label: 'Conference', count: 10}, {label: 'Book', count: 4}, {label: 'Report', count: 1}, {label: 'Thesis', count: 2}, {label: 'SCI(E)', count: 11}, {label: 'SSCI', count: 1}, {label: 'Scopus', count: 2}, {label: 'KCI', count: 6}]
const citationStats = [{label: 'Citations', count: 127}, {label: 'g-index', count: 10}, {label: 'h-index', count: 7}, {label: 'i10-index', count: 5}]

const researchInterests = [
  {category: 'Financial Data Science', items: [{en: 'Explainable AI in Finance'}, {en: 'Portfolio Optimization & Algorithmic Trading'}, {en: 'Financial Time-Series Analysis'}, {en: 'Credit & Market Risk Modeling'}]},
  {category: 'Business Analytics', items: [{en: 'Advanced Time-Series Forecasting'}, {en: 'Network & Graph Analytics'}, {en: 'Optimization under Uncertainty'}, {en: 'Process Optimization & Efficiency'}]},
  {category: 'Data-Informed Decision Making', items: [{en: 'Risk-Aware Decision Tools'}, {en: 'Decision Analytics for Business Problems'}]},
]

export const MembersDirectorTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const {showModal} = useStoreModal()
  const location = useLocation()
  const directorEmail = 'ischoi@gachon.ac.kr'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directorEmail)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const isProfilePage = location.pathname === '/members/director'

  return (
    <div className="flex flex-col bg-white">
      {/* Banner - 통일된 스타일 */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{backgroundImage: `url(${banner2})`}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-amber-400/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-amber-400/80" />
            <span className="text-amber-300/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Members
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight">
            Director
          </h1>
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

      {/* Tab Navigation */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20">
        <div className="flex items-center gap-4 md:gap-8 py-16 md:py-24">
          <Link
            to="/members/director"
            className={`flex items-center gap-8 px-16 md:px-24 py-12 md:py-14 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
              isProfilePage
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <User size={16} />
            Profile
          </Link>
          <Link
            to="/members/director-activities"
            className={`flex items-center gap-8 px-16 md:px-24 py-12 md:py-14 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
              !isProfilePage
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Activity size={16} />
            Activities
          </Link>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
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
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Director, FINDS Lab.</p>
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
                    <p className="text-[10px] md:text-xs text-gray-500">Dept. of Big Data Business Management</p>
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
                  className="flex items-center justify-center gap-6 py-12 bg-gray-900 text-white text-xs md:text-sm font-bold rounded-xl hover:bg-gray-800 transition-all"
                >
                  Scholar <ExternalLink size={14}/>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column */}
          <main className="flex-1 flex flex-col gap-40 md:gap-56 min-w-0">
            {/* Introduction */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24 flex items-center gap-8">
                <span className="w-1 h-20 bg-primary rounded-full" />
                Introduction
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-20 md:p-32 border border-gray-100">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-16">
                  I am an Assistant Professor at Gachon University and the Director of FINDS Lab, working across{' '}
                  <span className="font-bold text-primary">Financial Data Science</span>,{' '}
                  <span className="font-bold text-primary">Business Analytics</span>, and{' '}
                  <span className="font-bold text-primary">Data-Driven Decision Making</span>.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  The goal is simple: bridge academic rigor and real-world application, and share ideas that are both sound and genuinely useful.
                </p>
              </div>
            </section>

            {/* Research Interests */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24 flex items-center gap-8">
                <span className="w-1 h-20 bg-primary rounded-full" />
                Research Interests
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                {researchInterests.map((area, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-xl p-16 md:p-24 hover:shadow-md hover:border-primary/20 transition-all">
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 mb-12 pb-8 border-b border-gray-100">{area.category}</h4>
                    <ul className="space-y-8">
                      {area.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-8">
                          <span className="size-5 bg-primary rounded-full shrink-0 mt-6"/>
                          <span className="text-xs md:text-sm text-gray-600">{item.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24 flex items-center gap-8">
                <span className="w-1 h-20 bg-primary rounded-full" />
                Education
              </h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-primary/20">
                {education.map((edu, index) => (
                  <div key={index} className="relative pb-24 last:pb-0 group">
                    <div className="absolute -left-[25px] md:-left-[33px] top-0 size-12 md:size-14 bg-primary rounded-full border-3 border-white shadow-md"/>
                    <div className="flex items-start gap-12 md:gap-16 bg-white border border-gray-100 rounded-xl p-16 md:p-20 hover:shadow-md transition-all">
                      <div className="size-48 md:size-60 bg-gray-50 rounded-lg p-8 flex items-center justify-center shrink-0">
                        <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-6 mb-8">
                          <span className="px-10 py-3 text-[10px] font-bold rounded-full bg-primary text-white">{edu.period}</span>
                          <span className="px-8 py-3 bg-gray-800 text-white text-[10px] font-bold rounded">{edu.degree}</span>
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-gray-900 mb-4">{edu.school}</h4>
                        <p className="text-xs md:text-sm text-gray-600">{edu.field}</p>
                        {edu.advisor && <p className="text-xs text-gray-500 mt-4">Advisor: {edu.advisor}</p>}
                        {edu.awards?.length > 0 && (
                          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-6">
                            {edu.awards.map((a, i) => (
                              <span key={i} className="inline-flex items-center gap-4 px-8 py-4 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">
                                🏆 {a.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Employment */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24 flex items-center gap-8">
                <span className="w-1 h-20 bg-primary rounded-full" />
                Employment
              </h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-gray-200">
                {employment.map((emp, index) => (
                  <div key={index} className="relative pb-20 last:pb-0 group">
                    <div className={`absolute -left-[25px] md:-left-[33px] top-0 size-12 md:size-14 rounded-full border-3 border-white shadow-md ${emp.isCurrent ? 'bg-primary' : 'bg-gray-300'}`}/>
                    <div className="flex items-start gap-12 md:gap-16 bg-white border border-gray-100 rounded-xl p-16 md:p-20 hover:shadow-md transition-all">
                      <div className="size-48 md:size-60 bg-gray-50 rounded-lg p-8 flex items-center justify-center shrink-0">
                        <img src={emp.logo} alt={emp.organization} className="w-full h-full object-contain"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-6 mb-6">
                          <span className={`px-10 py-3 text-[10px] font-bold rounded-full ${emp.isCurrent ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {emp.period}
                          </span>
                          <span className="px-8 py-3 bg-gray-800 text-white text-[10px] font-bold rounded">{emp.position}</span>
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-gray-900">{emp.organization}</h4>
                        {emp.department && <p className="text-xs text-gray-500 mt-2">{emp.department}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Membership */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24 flex items-center gap-8">
                <span className="w-1 h-20 bg-primary rounded-full" />
                Membership
              </h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-primary/20">
                {affiliations.map((aff, index) => (
                  <div key={index} className="relative pb-16 last:pb-0 group">
                    <div className="absolute -left-[25px] md:-left-[33px] top-0 size-12 md:size-14 bg-primary rounded-full border-3 border-white shadow-md"/>
                    <div className="flex items-center gap-12 bg-white border border-gray-100 rounded-xl p-16 md:p-20 hover:shadow-md transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-6 mb-6">
                          <span className="px-10 py-3 text-[10px] font-bold rounded-full bg-primary text-white">{aff.period}</span>
                          <span className="px-8 py-3 bg-gray-800 text-white text-[10px] font-bold rounded">{aff.role}</span>
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-gray-900">{aff.organization}</h4>
                        <p className="text-xs text-gray-500 mt-2">{aff.krOrg}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Publication Statistics */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24 flex items-center gap-8">
                <span className="w-1 h-20 bg-primary rounded-full" />
                Publication Statistics
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-8 md:gap-12 mb-16 md:mb-24">
                {publicationStats.map((stat, index) => (
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
                <Link to="/publications" className="inline-flex items-center gap-4 text-sm text-primary font-medium hover:underline">
                  View All Publications <ChevronRight size={14}/>
                </Link>
              </div>
            </section>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorTemplate)
