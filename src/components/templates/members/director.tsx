import {memo, useState} from 'react'
import {Link} from 'react-router-dom'
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
  {category: 'Data-Inspired Decision Making', items: [{en: 'Risk-Aware Decision Tools'}, {en: 'Decision Analytics for Business Problems'}]},
]

export const MembersDirectorTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const {showModal} = useStoreModal()
  const directorEmail = 'ischoi@gachon.ac.kr'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directorEmail)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

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
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Insu Choi<span className="text-sm md:text-base font-medium text-gray-400 ml-4">, Ph.D.</span></h2>
                <p className="text-base md:text-lg text-gray-500 font-medium">최인수</p>
              </div>

              <div className="flex flex-col gap-16 md:gap-20">
                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0"><Briefcase size={16}/></div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Position</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Director, FINDS Lab.</p>
                  </div>
                </div>
                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0"><Building size={16}/></div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Affiliation</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Assistant Professor</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Gachon University</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Dept. of Big Data Business Management</p>
                  </div>
                </div>
                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0"><MapPin size={16}/></div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Office</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Room 706, Humanities Hall</p>
                    <p className="text-[10px] md:text-xs text-gray-500">인문관 706호</p>
                  </div>
                </div>
                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0"><Mail size={16}/></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</p>
                    <div className="flex items-center gap-8">
                      <a href={`mailto:${directorEmail}`} className="text-xs md:text-sm font-semibold text-primary hover:underline">{directorEmail}</a>
                      <button onClick={handleCopyEmail} className="size-24 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors shrink-0" title="Copy email">
                        {emailCopied ? <Check size={12} className="text-green-500"/> : <Copy size={12} className="text-gray-400"/>}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-10 md:gap-12 group">
                  <div className="size-32 md:size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0"><Phone size={16}/></div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">02-940-4424</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 md:gap-12 mt-24 md:mt-32">
                <button onClick={() => showModal({title: 'Curriculum Vitae', maxWidth: '1000px', children: <div className="p-40 text-center text-gray-500">CV content goes here...</div>})} className="flex items-center justify-center gap-8 py-12 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all">View CV <ExternalLink size={14}/></button>
                <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-6 py-12 bg-gray-900 text-sm font-bold rounded-xl hover:bg-gray-800 transition-all" style={{color: 'white'}}>Google Scholar <ExternalLink size={14}/></a>
              </div>

              <div className="mt-16 pt-16 border-t border-gray-100">
                <Link to="/members/director-activities" className="flex items-center justify-between p-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl hover:from-primary/10 hover:to-primary/15 transition-all group">
                  <div><p className="text-xs font-bold text-gray-900">More Activities</p><p className="text-[10px] text-gray-500">Awards, Teaching, Projects, Services...</p></div>
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
                <p className="text-gray-600 leading-relaxed text-sm md:text-[15px] mb-20">I am an Assistant Professor at Gachon University and the Director of FINDS Lab, working across <span className="font-bold text-primary">Financial Data Science</span>, <span className="font-bold text-primary">Business Analytics</span>, and <span className="font-bold text-primary">Data-Driven Decision Making</span>.</p>
                <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">The goal is simple: bridge academic rigor and real-world application, and share ideas that are both sound and genuinely useful.</p>
              </div>
            </section>

            {/* Research Interests */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Research Interests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                {researchInterests.map((area, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-xl p-16 md:p-24 hover:shadow-md hover:border-primary/20 transition-all">
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 mb-12 pb-8 border-b border-gray-100">{area.category}</h4>
                    <ul className="space-y-8">{area.items.map((item, idx) => (<li key={idx} className="flex items-center gap-8"><span className="size-5 bg-primary rounded-full shrink-0"/><span className="text-xs md:text-sm text-gray-600">{item.en}</span></li>))}</ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Education</h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-primary/20">
                {education.map((edu, index) => (
                  <div key={index} className="relative pb-24 last:pb-0 group">
                    <div className="absolute -left-[30px] md:-left-40 top-0 size-12 md:size-16 bg-primary rounded-full border-3 border-white shadow-md"/>
                    <div className="flex items-start gap-12 bg-white border border-gray-100 rounded-lg p-12 md:p-16 hover:shadow-md transition-all">
                      <div className="size-40 md:size-56 bg-gray-50 rounded-lg p-6 flex items-center justify-center shrink-0"><img src={edu.logo} alt={edu.school} className="w-full h-full object-contain"/></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-6 mb-6"><span className="px-8 py-2 text-[9px] font-bold rounded-full bg-primary text-white">{edu.period}</span><span className="px-6 py-2 bg-gray-800 text-white text-[9px] font-bold rounded">{edu.degree}</span></div>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900 mb-4">{edu.school}</h4>
                        <p className="text-[10px] md:text-xs text-gray-600">{edu.field}</p>
                        {edu.advisor && <p className="text-[10px] text-gray-500 mt-4">Advisor: {edu.advisor}</p>}
                        {edu.awards?.length > 0 && <div className="mt-8 pt-8 border-t border-gray-100">{edu.awards.map((a, i) => (<span key={i} className="inline-flex items-center gap-4 px-8 py-4 bg-amber-50 text-amber-700 text-[9px] font-bold rounded-full border border-amber-100">🏆 {a.title}</span>))}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Employment */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Employment</h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-gray-200">
                {employment.map((emp, index) => (
                  <div key={index} className="relative pb-16 last:pb-0 group">
                    <div className={`absolute -left-[30px] md:-left-40 top-0 size-12 md:size-16 rounded-full border-3 border-white shadow-md ${emp.isCurrent ? 'bg-primary' : 'bg-gray-300'}`}/>
                    <div className="flex items-start gap-12 bg-white border border-gray-100 rounded-lg p-12 md:p-16 hover:shadow-md transition-all">
                      <div className="size-40 md:size-56 bg-gray-50 rounded-lg p-6 flex items-center justify-center shrink-0"><img src={emp.logo} alt={emp.organization} className="w-full h-full object-contain"/></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-6 mb-4"><span className={`px-8 py-2 text-[9px] font-bold rounded-full ${emp.isCurrent ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>{emp.period}</span><span className="px-6 py-2 bg-gray-800 text-white text-[9px] font-bold rounded">{emp.position}</span></div>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900">{emp.organization}</h4>
                        {emp.department && <p className="text-[10px] text-gray-500 mt-2">{emp.department}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Membership */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Membership</h3>
              <div className="relative pl-24 md:pl-32 border-l-2 border-primary/20">
                {affiliations.map((aff, index) => (
                  <div key={index} className="relative pb-16 last:pb-0 group">
                    <div className="absolute -left-[30px] md:-left-40 top-0 size-12 md:size-16 bg-primary rounded-full border-3 border-white shadow-md"/>
                    <div className="flex items-center gap-12 bg-white border border-gray-100 rounded-lg p-12 md:p-16 hover:shadow-md transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-6 mb-4"><span className="px-8 py-2 text-[9px] font-bold rounded-full bg-primary text-white">{aff.period}</span><span className="px-6 py-2 bg-gray-800 text-white text-[9px] font-bold rounded">{aff.role}</span></div>
                        <h4 className="text-xs md:text-sm font-bold text-gray-900">{aff.organization}</h4>
                        <p className="text-[10px] text-gray-500 mt-2">{aff.krOrg}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Publication Statistics */}
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-16 md:mb-24">Publication Statistics</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-8 md:gap-12 mb-16 md:mb-24">
                {publicationStats.map((stat, index) => (<div key={index} className="text-center p-8 md:p-12 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors"><div className="text-lg md:text-xl font-bold text-primary">{stat.count}</div><div className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase mt-2">{stat.label}</div></div>))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 border-t border-gray-100">
                {citationStats.map((stat, index) => (<div key={index} className="text-center p-12 md:p-20 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"><div className="text-xl md:text-2xl font-bold text-primary">{stat.count}</div><div className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase mt-2">{stat.label}</div></div>))}
              </div>
              <div className="mt-16 text-center"><Link to="/publications" className="text-sm text-primary font-medium hover:underline flex items-center justify-center gap-4">View All Publications <ChevronRight size={14}/></Link></div>
            </section>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorTemplate)
