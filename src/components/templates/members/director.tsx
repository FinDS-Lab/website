import {memo, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  Building,
  ChevronRight,
  Copy,
  Check,
  GraduationCap,
  FileText,
  BarChart3,
  BookOpen,
  Award,
} from 'lucide-react'

// Image Imports
import banner2 from '@/assets/images/banner/2.webp'
import directorImg from '@/assets/images/members/director.webp'
import logoKaist from '@/assets/images/logos/kaist.png'
import logoKyunghee from '@/assets/images/logos/kyunghee.png'
import logoGcu from '@/assets/images/logos/gcu.png'

// Static Data - Education (simplified)
const education = [
  {
    school: 'KAIST',
    degree: 'Ph.D.',
    field: 'Industrial and Systems Engineering',
    period: '2021 – 2025',
    logo: logoKaist
  },
  {
    school: 'KAIST',
    degree: 'M.S.',
    field: 'Industrial and Systems Engineering',
    period: '2018 – 2021',
    logo: logoKaist
  },
  {
    school: 'Kyung Hee University',
    degree: 'B.E.',
    field: 'Industrial and Management Systems Engineering',
    period: '2013 – 2018',
    logo: logoKyunghee
  },
]

// Static Data - Career Highlights (key positions only)
const careerHighlights = [
  {position: 'Assistant Professor', organization: 'Gachon University', period: '2026 – Present', isCurrent: true, logo: logoGcu},
  {position: 'Director', organization: 'FINDS Lab', period: '2025 – Present', isCurrent: true, logo: null},
  {position: 'Postdoctoral Researcher', organization: 'KAIST · Korea University', period: '2025', isCurrent: false, logo: logoKaist},
]

// Static Data - Citation Statistics
const citationStats = [{label: 'Citations', count: 154}, {label: 'g-index', count: 11}, {label: 'h-index', count: 8}, {label: 'i10-index', count: 6}]

// Email
const directorEmail = 'ischoi@gachon.ac.kr'

export const MembersDirectorTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const [pubStats, setPubStats] = useState({total: 0, scopus: 0, intlConf: 0})

  // Fetch publication stats
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/pubs.json`)
      .then(res => res.json())
      .then(data => {
        const allPubs = [...(data.journals || []), ...(data.conferences || [])]
        const scopusPubs = allPubs.filter((p: {scopus?: boolean}) => p.scopus === true)
        const intlConf = (data.conferences || []).filter((p: {category?: string}) => p.category === 'International Conference')
        setPubStats({
          total: allPubs.length,
          scopus: scopusPubs.length,
          intlConf: intlConf.length
        })
      })
      .catch(err => console.error('Failed to load pubs:', err))
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(directorEmail)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="relative h-200 md:h-280 overflow-hidden">
        <img src={banner2} alt="Director Banner" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"/>
        <div className="absolute inset-0 flex flex-col justify-end p-20 md:p-40">
          <div className="max-w-1480 mx-auto w-full">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-8">Director</h1>
            <div className="flex items-center gap-8 text-white/80 text-sm">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14}/>
              <Link to="/members/current" className="hover:text-white transition-colors">Members</Link>
              <ChevronRight size={14}/>
              <span className="text-white">Director</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60">
        <div className="flex flex-col lg:flex-row gap-32 md:gap-60">
          {/* Left Column: Profile Card */}
          <aside className="lg:w-340 shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-20 md:p-24 shadow-sm sticky top-100">
              <div className="flex flex-col items-center text-center mb-24 md:mb-32">
                <div className="w-120 h-155 md:w-140 md:h-180 bg-gray-100 rounded-2xl overflow-hidden mb-16 md:mb-20 shadow-inner border border-gray-50">
                  <img loading="lazy" src={directorImg} alt="Prof. Insu Choi" className="w-full h-full object-cover"/>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  Insu Choi
                  <span className="text-sm md:text-base font-medium text-gray-400 ml-4">, Ph.D.</span>
                </h2>
                <p className="text-base text-gray-500 font-medium">최인수</p>
              </div>

              <div className="flex flex-col gap-14 md:gap-16">
                <div className="flex items-start gap-12 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Briefcase size={14}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Position</p>
                    <p className="text-xs font-semibold text-gray-800">Assistant Professor</p>
                  </div>
                </div>
                <div className="flex items-start gap-12 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Building size={14}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Affiliation</p>
                    <p className="text-xs font-semibold text-gray-800">Gachon University</p>
                  </div>
                </div>
                <div className="flex items-start gap-12 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <MapPin size={14}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Office</p>
                    <p className="text-xs font-semibold text-gray-800">Room 614, Gachon Hall</p>
                  </div>
                </div>
                <div className="flex items-start gap-12 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Mail size={14}/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</p>
                    <div className="flex items-center gap-6">
                      <a href={`mailto:${directorEmail}`} className="text-xs font-semibold text-primary hover:underline break-all">
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
                <div className="flex items-start gap-12 group">
                  <div className="size-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Phone size={14}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</p>
                    <p className="text-xs font-semibold text-gray-800">031-750-0614</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-20">
                <a 
                  href="https://scholar.google.com/citations?user=p9JwRLwAAAAJ&hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 py-10 text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                  style={{backgroundColor: 'rgb(172, 14, 14)', color: '#ffffff'}}
                >
                  Scholar <ExternalLink size={12}/>
                </a>
                <a 
                  href="https://orcid.org/0000-0003-2596-7368" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 py-10 bg-[#A6CE39] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  ORCID <ExternalLink size={12}/>
                </a>
              </div>
              <Link 
                to="/members/director/portfolio/profile"
                className="flex items-center justify-center gap-6 mt-12 py-12 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Full Portfolio <ChevronRight size={14}/>
              </Link>
            </div>
          </aside>

          {/* Right Column */}
          <main className="flex-1 flex flex-col gap-24 md:gap-32 min-w-0">
            {/* Education */}
            <section className="bg-white border border-gray-100 rounded-2xl p-20 md:p-24">
              <div className="flex items-center gap-12 mb-20">
                <div className="size-40 bg-primary/10 rounded-xl flex items-center justify-center">
                  <GraduationCap size={20} className="text-primary"/>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Education</h3>
              </div>
              <div className="space-y-16">
                {education.map((edu, index) => (
                  <div key={index} className="flex items-center gap-16 p-16 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="size-44 bg-white rounded-lg p-6 flex items-center justify-center shrink-0 border border-gray-100">
                      <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{edu.degree}, {edu.field}</p>
                      <p className="text-xs text-gray-500">{edu.school}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 shrink-0">{edu.period}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Career Highlights */}
            <section className="bg-white border border-gray-100 rounded-2xl p-20 md:p-24">
              <div className="flex items-center gap-12 mb-20">
                <div className="size-40 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Briefcase size={20} className="text-primary"/>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Career Highlights</h3>
              </div>
              <div className="space-y-12">
                {careerHighlights.map((career, index) => (
                  <div key={index} className="flex items-center gap-16 p-16 bg-gray-50 rounded-xl">
                    <div className="size-44 bg-white rounded-lg p-6 flex items-center justify-center shrink-0 border border-gray-100">
                      {career.logo ? (
                        <img src={career.logo} alt={career.organization} className="w-full h-full object-contain"/>
                      ) : (
                        <Building size={20} className="text-gray-400"/>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-8 mb-2">
                        <p className="text-sm font-bold text-gray-900">{career.position}</p>
                        {career.isCurrent && (
                          <span className="px-6 py-1 bg-primary text-white text-[9px] font-bold rounded-full">Current</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{career.organization}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 shrink-0">{career.period}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Publication Statistics */}
            <section className="bg-white border border-gray-100 rounded-2xl p-20 md:p-24">
              <div className="flex items-center gap-12 mb-20">
                <div className="size-40 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BarChart3 size={20} className="text-primary"/>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Publication Statistics</h3>
              </div>
              
              {/* Publication Counts */}
              <div className="grid grid-cols-3 gap-12 mb-24">
                <div className="text-center p-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                  <p className="text-2xl md:text-3xl font-bold text-primary mb-4">{pubStats.total}</p>
                  <p className="text-xs text-gray-500">Total Publications</p>
                </div>
                <div className="text-center p-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                  <p className="text-2xl md:text-3xl font-bold text-[#E9711C] mb-4">{pubStats.scopus}</p>
                  <p className="text-xs text-gray-500">Scopus Indexed</p>
                </div>
                <div className="text-center p-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                  <p className="text-2xl md:text-3xl font-bold text-[#5E33BF] mb-4">{pubStats.intlConf}</p>
                  <p className="text-xs text-gray-500">Int'l Conferences</p>
                </div>
              </div>

              {/* Citation Stats */}
              <div className="grid grid-cols-4 gap-8">
                {citationStats.map((stat, index) => (
                  <div key={index} className="text-center p-12 bg-gray-50 rounded-lg">
                    <p className="text-lg md:text-xl font-bold text-gray-800 mb-2">{stat.count}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <Link 
                to="/publications" 
                className="group flex items-center gap-12 p-16 bg-white border border-gray-100 rounded-xl hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="size-40 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen size={18} className="text-primary"/>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Publications</p>
                  <p className="text-xs text-gray-500">View all papers</p>
                </div>
              </Link>
              <Link 
                to="/projects" 
                className="group flex items-center gap-12 p-16 bg-white border border-gray-100 rounded-xl hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="size-40 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText size={18} className="text-primary"/>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Projects</p>
                  <p className="text-xs text-gray-500">Research projects</p>
                </div>
              </Link>
              <Link 
                to="/about/honors" 
                className="group flex items-center gap-12 p-16 bg-white border border-gray-100 rounded-xl hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="size-40 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Award size={18} className="text-primary"/>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Honors</p>
                  <p className="text-xs text-gray-500">Awards & Recognition</p>
                </div>
              </Link>
            </div>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorTemplate)
