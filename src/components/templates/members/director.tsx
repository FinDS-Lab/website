import {memo, useMemo} from 'react'
import {Link} from 'react-router-dom'
import {
  Mail,
  MapPin,
  Briefcase,
  Award,
  Building,
  ChevronRight,
  Home,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react'
import {useState} from 'react'

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

const education = [
  {
    school: 'Korea Advanced Institute of Science and Technology (KAIST)',
    period: '2025.02',
    degree: 'Doctor of Philosophy (Ph.D.) in Engineering',
    field: 'Industrial and Systems Engineering',
    location: 'Korea Advanced Institute of Science and Technology (KAIST)',
    krName: '한국과학기술원 (KAIST) 산업및시스템공학 공학박사',
    advisor: 'Woo Chang Kim',
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
    location: 'Korea Advanced Institute of Science and Technology (KAIST)',
    krName: '한국과학기술원 (KAIST) 산업및시스템공학 공학석사',
    advisor: 'Woo Chang Kim',
    awards: [{title: "Best Master's Thesis Award", org: 'Korean Institute of Industrial Engineers (KIIE, 대한산업공학회)'}],
    logo: logoKaist
  },
  {
    school: 'Kyung Hee University',
    period: '2018.02',
    degree: 'Bachelor of Engineering (B.E.)',
    field: 'Industrial and Management Systems Engineering',
    location: 'Kyung Hee University',
    krName: '경희대학교 산업경영공학 공학사',
    advisor: 'Jang Ho Kim, Myoung-Ju Park',
    leadership: [
      {role: 'Head of Culture & Public Relations', context: '41st Student Council, College of Engineering', period: '2017.01 - 2017.11'},
      {role: 'President', context: '7th Student Council, Department of Industrial and Management Systems Engineering', period: '2016.01 - 2016.12'},
    ],
    awards: [{title: 'Valedictorian', org: '1st out of 86 students'}],
    logo: logoKyunghee
  },
]

const employment = [
  {position: 'Assistant Professor', organization: 'Gachon University', period: '2026.03 – Present', location: 'Department of Big Data Business Management, Gachon Business School', krOrg: '조교수 / 가천대학교 경영대학 금융·빅데이터학부', logo: logoGcu},
  {position: 'Assistant Professor', organization: "Dongduk Women's University", period: '2025.09 – 2026.02', location: 'Division of Business Administration, College of Business', krOrg: '조교수 / 동덕여자대학교 경영대학 경영융합학부', logo: logoDwu},
  {position: 'Director', organization: 'FINDS Lab.', period: '2025.06 – Present', location: 'FINDS Lab.', krOrg: '디렉터 / FINDS Lab.', logo: logoFinds},
  {position: 'Lecturer', organization: 'Kangnam University', period: '2025.03 – 2026.02', location: 'Department of Electronic and Semiconductor Engineering', krOrg: '강사 / 강남대학교 공과대학 전자반도체공학부', logo: logoKangnam},
  {position: 'Lecturer', organization: 'Korea University', period: '2025.03 – 2026.02', location: 'Digital Business Major, Division of Convergence Business', krOrg: '강사 / 고려대학교 글로벌비즈니스대학 융합경영학부 디지털비즈니스전공', logo: logoKorea},
  {position: 'Lecturer', organization: 'Kyung Hee University', period: '2024.03 – 2024.08', location: 'Department of Industrial and Management Systems Engineering', krOrg: '강사 / 경희대학교 공과대학 산업경영공학과', logo: logoKyunghee},
  {position: 'Research Consultant', organization: 'WorldQuant Brain', period: '2022.06 – Present', location: 'WorldQuant Brain', krOrg: '연구 컨설턴트 / 월드퀀트 브레인', logo: logoWorldquant},
  {position: 'Intern', organization: 'EY Consulting', period: '2020.03 – 2020.05', location: 'Performance Improvement Department', krOrg: '인턴 / EY컨설팅 성과개선팀', logo: logoEy},
  {position: 'Founder', organization: 'JL Creatives & Contents (JL C&C)', period: '2014.06 – Present', location: 'JL C&C', krOrg: '대표 / JL C&C', logo: logoJl},
]

const affiliations = [
  {organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE) 종신회원', period: '2025.06 – Present', role: 'Lifetime Member'},
  {organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA) 종신회원', period: '2023.09 – Present', role: 'Lifetime Member'},
  {organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA) 종신회원', period: '2023.06 – Present', role: 'Lifetime Member'},
  {organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS) 종신회원', period: '2022.06 – Present', role: 'Lifetime Member'},
]

const researchInterests = [
  {
    category: 'Financial Data Science',
    items: [
      {en: 'AI in Quantitative Finance & Asset Management'},
      {en: 'Financial Time-Series Modeling & Forecasting'},
      {en: 'Household Finance & Behavioral Decision Modeling'},
    ],
  },
  {
    category: 'Business Analytics',
    items: [
      {en: 'Data Analytics for Cross-Industry & Cross-Domain Convergences'},
      {en: 'Data Visualization & Transparency in Business Analytics'},
      {en: 'Business Insights from Data Science Techniques'},
    ],
  },
  {
    category: 'Data-Inspired Decision Making',
    items: [
      {en: 'Trustworthy Decision Systems & Optimization'},
      {en: 'Risk-Aware & User-Friendly Decision Tools'},
      {en: 'Decision Analytics for Complex Business Problems'},
    ],
  },
]

export const MembersDirectorTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const directorEmail = 'ischoi@gachon.ac.kr'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directorEmail)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const publicationStats = useMemo(() => [
    {label: 'SCIE', count: 0},
    {label: 'SSCI', count: 0},
    {label: 'A&HCI', count: 0},
    {label: 'ESCI', count: 0},
    {label: 'Scopus', count: 0},
    {label: 'Other Int\'l', count: 0},
    {label: 'Int\'l Conf', count: 0},
    {label: 'KCI', count: 0},
    {label: 'Dom. Conf', count: 0},
  ], [])

  const citationStats = [
    {label: 'Citations', count: 127},
    {label: 'g-index', count: 10},
    {label: 'h-index', count: 7},
    {label: 'i10-index', count: 5},
  ]

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-200 md:h-332 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(${banner2})`}}/>
        <div className="absolute inset-0 bg-black/40"/>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-2xl md:text-[36px] font-semibold text-white text-center">Director</h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-20 md:py-40">
        <div className="flex items-center gap-8 md:gap-10 flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors"><Home size={16}/></Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-gray-400">Members</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-primary font-medium">Director</span>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
        <div className="flex flex-col lg:flex-row gap-32 md:gap-60">
          {/* Left Column: Profile Card */}
          <aside className="lg:w-380 flex flex-col gap-24 md:gap-40">
            <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-16 md:p-20 shadow-sm lg:sticky lg:top-40">
              <div className="flex flex-col items-center text-center mb-24 md:mb-32">
                <div className="size-150 md:size-200 bg-gray-100 rounded-2xl overflow-hidden mb-16 md:mb-24 shadow-inner border border-gray-50">
                  <img src={directorImg} alt="Prof. Insu Choi" className="w-full h-full object-cover"/>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Insu Choi<span className="text-sm md:text-base font-medium text-gray-400 ml-4">, Ph.D.</span>
                </h2>
                <p className="text-base md:text-lg text-gray-500 font-medium">최인수</p>
              </div>

              <div className="flex flex-col gap-16 md:gap-20">
                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg md:rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Briefcase size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Position</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">Director</p>
                    <p className="text-[10px] md:text-xs text-gray-500">FINDS Lab.</p>
                  </div>
                </div>

                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg md:rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Building size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Affiliation</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">Assistant Professor</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Gachon University</p>
                  </div>
                </div>

                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg md:rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <MapPin size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Office</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">Room 706, Humanities Hall</p>
                  </div>
                </div>

                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg md:rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Mail size={16}/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</p>
                    <div className="flex items-center gap-8">
                      <a href={`mailto:${directorEmail}`} className="text-xs md:text-sm font-semibold text-primary hover:underline truncate">{directorEmail}</a>
                      <button onClick={handleCopyEmail} className="size-24 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors shrink-0" title="Copy email">
                        {emailCopied ? <Check size={12} className="text-green-500"/> : <Copy size={12} className="text-gray-400"/>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Link to Activities */}
              <div className="mt-24 pt-20 border-t border-gray-100">
                <Link to="/members/director-activities" className="flex items-center justify-between p-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl hover:from-primary/10 hover:to-primary/15 transition-all group">
                  <div>
                    <p className="text-xs font-bold text-gray-900">More Activities</p>
                    <p className="text-[10px] text-gray-500">Awards, Teaching, Projects, Services...</p>
                  </div>
                  <ChevronRight size={16} className="text-primary group-hover:translate-x-4 transition-transform"/>
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Column */}
          <main className="flex-1 flex flex-col gap-32 md:gap-56">
            {/* Introduction */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Introduction</h3>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-20 md:p-32 border border-gray-100">
                <p className="text-gray-600 leading-relaxed text-sm md:text-[15px] mb-20">
                  I am an Assistant Professor at Gachon University and the Director of FINDS Lab, working across{' '}
                  <span className="font-bold text-primary">Financial Data Science</span>,{' '}
                  <span className="font-bold text-primary">Business Analytics</span>, and{' '}
                  <span className="font-bold text-primary">Data-Driven Decision Making</span>.
                </p>
                <div className="space-y-12 mb-20">
                  <div className="flex gap-12">
                    <span className="size-24 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center shrink-0">1</span>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">
                      <span className="font-semibold text-gray-700">AI-driven solutions for quantitative finance</span> — portfolio optimization, algorithmic trading, and financial time-series forecasting.
                    </p>
                  </div>
                  <div className="flex gap-12">
                    <span className="size-24 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center shrink-0">2</span>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">
                      <span className="font-semibold text-gray-700">Advanced analytics across business domains</span> — time-series models, graph-based analytics, and actionable insights.
                    </p>
                  </div>
                  <div className="flex gap-12">
                    <span className="size-24 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center shrink-0">3</span>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">
                      <span className="font-semibold text-gray-700">Intelligent decision support systems</span> — optimization techniques with user-friendly interfaces for complex business problems.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Research Interests */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Research Interests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                {researchInterests.map((area, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-16 md:p-24 hover:shadow-md hover:border-primary/20 transition-all">
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 mb-12 md:mb-16 pb-8 md:pb-12 border-b border-gray-100">{area.category}</h4>
                    <ul className="space-y-8 md:space-y-12">
                      {area.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-8">
                          <span className="size-5 md:size-6 bg-primary rounded-full shrink-0"/>
                          <span className="text-xs md:text-sm text-gray-600 leading-tight flex-1">{item.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Publication Statistics */}
            <section>
              <div className="flex items-center justify-between mb-16 md:mb-24">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Publication Statistics</h3>
                <Link to="/publications" className="text-xs text-primary font-medium flex items-center gap-4 hover:underline">
                  View All <ExternalLink size={12}/>
                </Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-8 md:gap-12 mb-16 md:mb-24">
                {publicationStats.map((stat, index) => (
                  <div key={index} className="text-center p-8 md:p-12 bg-gray-50 rounded-lg md:rounded-xl hover:bg-primary/5 transition-colors">
                    <div className="text-lg md:text-xl font-bold text-primary">{stat.count}</div>
                    <div className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase mt-2 md:mt-4">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 md:pt-20 border-t border-gray-100">
                {citationStats.map((stat, index) => (
                  <div key={index} className="text-center p-12 md:p-20 bg-gray-900 rounded-lg md:rounded-xl hover:bg-gray-800 transition-colors">
                    <div className="text-xl md:text-2xl font-bold text-primary">{stat.count}</div>
                    <div className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase mt-2 md:mt-4">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Education</h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-primary/20">
                {education.map((edu, index) => (
                  <div key={index} className="relative pb-24 md:pb-40 last:pb-0 group">
                    <div className="absolute -left-[30px] md:-left-40 top-4 size-12 md:size-16 bg-primary rounded-full border-3 md:border-4 border-white shadow-md"/>
                    <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-16 md:p-24 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-12 md:gap-20">
                        <div className="size-40 md:size-56 bg-gray-50 rounded-lg md:rounded-xl p-6 md:p-8 flex items-center justify-center shrink-0">
                          <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-8 md:gap-12 mb-6 md:mb-8">
                            <span className="px-8 md:px-12 py-3 md:py-4 bg-primary text-white text-[10px] md:text-xs font-bold rounded-full">{edu.period}</span>
                            {edu.awards && edu.awards.length > 0 && (
                              <span className="flex items-center gap-4 text-[9px] md:text-[10px] font-bold text-amber-700 bg-amber-50 px-8 md:px-10 py-3 md:py-4 rounded-full border border-amber-200">
                                <Award size={10}/> Award
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm md:text-base font-bold text-gray-900 mb-4">{edu.degree}</h4>
                          <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8">{edu.field}</p>
                          <p className="text-[10px] md:text-xs text-gray-500">{edu.location}</p>
                          <div className="mt-12 md:mt-16 pt-12 md:pt-16 border-t border-gray-100 space-y-12">
                            <div>
                              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Advisor</p>
                              <p className="text-xs md:text-sm text-gray-700">{edu.advisor}</p>
                            </div>
                            {edu.awards && edu.awards.length > 0 && (
                              <div>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Awards</p>
                                {edu.awards.map((award, awardIdx) => (
                                  <div key={awardIdx} className="flex items-start gap-8 bg-amber-50 border border-amber-100 rounded-lg px-12 py-8">
                                    <Award size={14} className="text-amber-600 shrink-0 mt-2"/>
                                    <span className="text-xs md:text-sm text-gray-700">
                                      <span className="font-bold">{award.title}</span>
                                      {award.org && <span>, {award.org}</span>}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Employment */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Employment</h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-primary/20">
                {employment.map((job, index) => (
                  <div key={index} className="relative pb-16 md:pb-24 last:pb-0 group">
                    <div className={`absolute -left-[30px] md:-left-40 top-0 size-12 md:size-16 rounded-full border-3 md:border-4 border-white shadow-md ${job.period.includes('Present') ? 'bg-primary' : 'bg-gray-300'}`}/>
                    <div className="flex items-center gap-12 md:gap-16 bg-white border border-gray-100 rounded-lg md:rounded-xl p-12 md:p-16 hover:shadow-lg transition-all">
                      <div className="size-36 md:size-44 bg-gray-50 rounded-lg p-4 md:p-6 flex items-center justify-center shrink-0">
                        <img src={job.logo} alt={job.organization} className="w-full h-full object-contain"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`px-8 md:px-10 py-2 text-[9px] md:text-[10px] font-bold rounded-full ${job.period.includes('Present') ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>{job.period}</span>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900 mt-4">{job.position}</h4>
                        <p className="text-[10px] md:text-xs text-gray-600 truncate">{job.organization}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Professional Affiliations */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Professional Affiliations</h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-primary/20">
                {affiliations.map((aff, index) => (
                  <div key={index} className="relative pb-16 md:pb-24 last:pb-0 group">
                    <div className="absolute -left-[30px] md:-left-40 top-0 size-12 md:size-16 bg-primary rounded-full border-3 md:border-4 border-white shadow-md"/>
                    <div className="flex items-center gap-12 md:gap-16 bg-white border border-gray-100 rounded-lg md:rounded-xl p-12 md:p-16 hover:shadow-md transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-6 md:gap-8 mb-4">
                          <span className="px-8 md:px-10 py-2 text-[9px] md:text-[10px] font-bold rounded-full bg-primary text-white">{aff.period}</span>
                          <span className="px-6 md:px-8 py-2 bg-gray-800 text-white text-[9px] md:text-[10px] font-bold rounded">{aff.role}</span>
                        </div>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900">{aff.organization}</h4>
                        <p className="text-[10px] md:text-xs text-gray-500 mt-2 truncate">{aff.krOrg}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorTemplate)
