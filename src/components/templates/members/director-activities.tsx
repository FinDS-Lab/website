import {memo, useState, useEffect, useMemo} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {
  Mail, Phone, MapPin, ExternalLink, ChevronRight, ChevronDown, Home, Copy, Check,
  User, BookOpen, Users, Building2, Activity, UserCheck, X
} from 'lucide-react'
import type {Mentee} from '@/types/data'
import {useStoreModal} from '@/store/modal'

// Image Imports
import banner2 from '@/assets/images/banner/2.webp'
import directorImg from '@/assets/images/members/director.webp'
import logoCaptima from '@/assets/images/logos/captima.png'
import logoKfac from '@/assets/images/logos/kfac.png'
import logoMensa from '@/assets/images/logos/mensa.png'
import logoField from '@/assets/images/logos/field.png'
import logoFba from '@/assets/images/logos/fba.png'
import logoDading from '@/assets/images/logos/dading.png'

// Static Data
const affiliations = [
  {organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE) 종신회원', period: '2025.06 – Present', role: 'Lifetime Member'},
  {organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA) 종신회원', period: '2023.09 – Present', role: 'Lifetime Member'},
  {organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA) 종신회원', period: '2023.06 – Present', role: 'Lifetime Member'},
  {organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS) 종신회원', period: '2022.06 – Present', role: 'Lifetime Member'},
]

const activities = [
  {name: 'CAPTIMA', logo: logoCaptima, fullName: 'Computer Applications for Optima', fullNameKo: '경희대학교 산업경영공학과 컴퓨터학술동아리', generation: '', membership: [{role: 'Member', period: '2013.03. - 2018.02.'}, {role: 'Alumni', period: '2018.03. - Present'}], leadership: [{role: 'President', period: '2015.06. - 2015.12.'}, {role: 'Vice President', period: '2013.12. - 2014.08.'}]},
  {name: 'KFAC', logo: logoKfac, fullName: 'KAIST Financial Analysis Club', fullNameKo: 'KAIST 금융 분석 동아리', generation: '25th Generation', membership: [{role: 'Member', period: '2018.03. - 2019.02.'}, {role: 'Alumni', period: '2019.03. - Present'}], leadership: [{role: 'Acting President', period: '2021.03. - 2021.08.'}, {role: 'Session Leader', period: '2018.09. - 2019.02.'}]},
  {name: 'Mensa Korea', logo: logoMensa, fullName: '', fullNameKo: '멘사코리아', generation: '', membership: [{role: 'Member', period: '2019.01. - Present'}], leadership: []},
  {name: 'FIELD', logo: logoField, fullName: 'Future Industrial Engineering Leaders and Dreamers', fullNameKo: '전국대학생산업공학도 모임', generation: '11th - 16th Generation', membership: [{role: 'Member', period: '2019.03. - 2024.12.'}, {role: 'Alumni', period: '2020.01. - Present'}], leadership: []},
  {name: 'FBA Quant', logo: logoFba, fullName: 'FBA Quant', fullNameKo: '', generation: '12th Generation', membership: [{role: 'Member', period: '2022.01. - 2022.12.'}, {role: 'Alumni', period: '2023.01. - Present'}], leadership: []},
  {name: 'DadingCoding', logo: logoDading, fullName: '', fullNameKo: '대딩코딩', generation: '6th Generation', membership: [{role: 'Member', period: '2024.02. - 2024.07.'}, {role: 'Alumni', period: '2024.08. - Present'}], leadership: []},
]

// Expandable Section
const ExpandableSection = ({title, icon: Icon, children, defaultExpanded = true, count}: {title: string; icon: React.ElementType; children: React.ReactNode; defaultExpanded?: boolean; count?: number}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  return (
    <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-12"><Icon size={20} className="text-primary" /><h3 className="text-lg md:text-xl font-bold text-gray-900">{title}</h3>{count !== undefined && <span className="px-8 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full">{count}</span>}</div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <div className={`border-t border-gray-100 ${isExpanded ? 'block' : 'hidden'}`}>{children}</div>
    </section>
  )
}

export const MembersDirectorActivitiesTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [selectedMentoringYear, setSelectedMentoringYear] = useState<string>('all')
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all')
  const {showModal} = useStoreModal()
  const location = useLocation()
  const directorEmail = 'ischoi@gachon.ac.kr'

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/mentees.json`).then(res => res.json()).then((data: Record<string, Omit<Mentee, 'id'>>) => {
      const menteesArray: Mentee[] = Object.entries(data).map(([id, mentee]) => ({ id, ...mentee }))
      setMentees(menteesArray)
    }).catch(console.error)
  }, [])

  const handleCopyEmail = () => { navigator.clipboard.writeText(directorEmail); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 2000) }

  const navItems = [{label: 'Profile', path: '/members/director', icon: User}, {label: 'Scholarly', path: '/members/director/academic', icon: BookOpen}, {label: 'Activities', path: '/members/director/activities', icon: Users}]

  const menteesByYear = useMemo(() => {
    const grouped: Record<string, Mentee[]> = {}
    mentees.forEach(m => m.participationYears.forEach(y => { if (!grouped[y]) grouped[y] = []; if (!grouped[y].find(x => x.id === m.id)) grouped[y].push(m) }))
    return grouped
  }, [mentees])

  const mentoringYears = useMemo(() => Object.keys(menteesByYear).sort((a, b) => parseInt(b) - parseInt(a)), [menteesByYear])
  const getMenteeCountByYear = (year: string) => menteesByYear[year]?.length || 0

  const filteredMentees = useMemo(() => {
    let result = mentees
    if (selectedMentoringYear !== 'all') result = result.filter(m => m.participationYears.includes(selectedMentoringYear))
    if (selectedUniversity !== 'all') result = result.filter(m => m.university === selectedUniversity)
    return result.sort((a, b) => b.participationYears.length - a.participationYears.length)
  }, [mentees, selectedMentoringYear, selectedUniversity])

  const universityStats = useMemo(() => {
    const counts = new Map<string, number>()
    filteredMentees.forEach(m => counts.set(m.university, (counts.get(m.university) || 0) + 1))
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [filteredMentees])

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
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">Activities</h1>
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
            <span className="text-gray-200">—</span><span className="text-sm text-gray-400 font-medium">Members</span>
            <span className="text-gray-200">—</span><span className="text-sm text-gray-400 font-medium">Director</span>
            <span className="text-gray-200">—</span><span className="text-sm text-primary font-semibold">Activities</span>
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
                  <div className="w-140 h-180 rounded-xl overflow-hidden mb-20 ring-4 ring-gray-100"><img src={directorImg} alt="Director" className="w-full h-full object-cover" /></div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">In Seok Choi</h2>
                  <p className="text-sm text-gray-500 mb-4">최인수</p>
                  <p className="text-sm text-primary font-medium mb-16">Assistant Professor</p>
                  <div className="w-full space-y-12">
                    <div className="flex items-center gap-12"><Mail size={16} className="text-gray-400 shrink-0" /><button onClick={handleCopyEmail} className="text-sm text-gray-600 hover:text-primary flex items-center gap-8 group">{directorEmail}{emailCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-300 group-hover:text-primary" />}</button></div>
                    <div className="flex items-center gap-12"><Phone size={16} className="text-gray-400 shrink-0" /><span className="text-sm text-gray-600">+82-31-750-xxxx</span></div>
                    <div className="flex items-start gap-12"><MapPin size={16} className="text-gray-400 shrink-0 mt-2" /><div><p className="text-sm font-semibold text-gray-800">Room 614, Gachon Hall</p><p className="text-xs text-gray-500">가천관 614호</p></div></div>
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
            {/* Professional Memberships */}
            <ExpandableSection title="Professional Memberships" icon={Building2} defaultExpanded={true} count={affiliations.length}>
              <div className="divide-y divide-gray-100">
                {affiliations.map((aff, idx) => (
                  <div key={idx} className="p-20 md:p-24 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-16">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm md:text-base font-bold text-gray-900 mb-4">{aff.organization}</h4>
                        <p className="text-xs text-gray-500">{aff.krOrg}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-10 py-4 bg-primary/10 text-primary text-xs font-bold rounded-lg">{aff.role}</span>
                        <p className="text-xs text-gray-400 mt-8">{aff.period}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableSection>

            {/* External Activities */}
            <ExpandableSection title="External Activities" icon={Activity} defaultExpanded={true} count={activities.length}>
              <div className="p-20 md:p-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {activities.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => showModal({
                        maxWidth: '500px',
                        children: (
                          <div className="p-24">
                            <div className="flex items-center gap-16 mb-24">
                              <div className="size-64 bg-gray-50 rounded-xl p-12 flex items-center justify-center shrink-0">
                                <img src={act.logo} alt={act.name} className="w-full h-full object-contain"/>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{act.name}</h3>
                                {act.fullName && <p className="text-sm text-gray-600 mt-4">{act.fullName}</p>}
                                {act.fullNameKo && <p className="text-sm text-gray-500">{act.fullNameKo}</p>}
                              </div>
                            </div>
                            {act.generation && <p className="text-primary font-bold text-sm mb-24">{act.generation}</p>}
                            {act.membership.length > 0 && (
                              <div className="border-t border-gray-100 pt-20 space-y-8">
                                {act.membership.map((r, rIdx) => (
                                  <div key={rIdx} className="flex items-center justify-between px-16 py-12 bg-gray-50 rounded-xl">
                                    <span className="font-bold text-gray-700">{r.role}</span>
                                    <span className="text-sm text-gray-500">{r.period}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {act.leadership.length > 0 && (
                              <div className="mt-20 pt-20 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-12">Leadership</h4>
                                <div className="space-y-8">
                                  {act.leadership.map((r, rIdx) => (
                                    <div key={rIdx} className="flex items-center justify-between px-16 py-12 bg-primary/5 rounded-xl border border-primary/10">
                                      <span className="font-bold text-primary">{r.role}</span>
                                      <span className="text-sm text-gray-500">{r.period}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                      className="flex items-center gap-16 bg-white border border-gray-100 rounded-xl p-20 hover:shadow-lg hover:border-primary/30 transition-all group text-left"
                    >
                      <div className="size-56 bg-gray-50 rounded-xl p-8 flex items-center justify-center group-hover:bg-primary/5 transition-colors shrink-0">
                        <img src={act.logo} alt={act.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{act.name}</h4>
                        {act.fullName && <p className="text-xs text-gray-500 mt-2 truncate">{act.fullName}</p>}
                        {act.fullNameKo && <p className="text-xs text-gray-400 truncate">{act.fullNameKo}</p>}
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors shrink-0"/>
                    </button>
                  ))}
                </div>
              </div>
            </ExpandableSection>

            {/* Mentoring Program */}
            <ExpandableSection title="Mentoring & Tutoring Program" icon={UserCheck} defaultExpanded={true} count={mentees.length}>
              <div>
                {/* Stats */}
                <div className="bg-gray-50/50 px-20 md:px-32 py-24 border-b border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
                    <div className="text-center"><p className="text-2xl md:text-3xl font-bold text-primary">{mentees.length}</p><p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-4">Total Mentees</p></div>
                    <div className="text-center"><p className="text-2xl md:text-3xl font-bold text-gray-700">13</p><p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-4">Years Active</p></div>
                    <div className="text-center"><p className="text-2xl md:text-3xl font-bold" style={{color: '#FFBAC4'}}>{menteesByYear['2026']?.length || 0}</p><p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-4">Current (2026)</p></div>
                    <div className="text-center"><p className="text-2xl md:text-3xl font-bold text-primary">{new Set(mentees.map(m => m.university)).size}</p><p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-4">Universities</p></div>
                  </div>
                </div>

                {/* Year Filter */}
                <div className="px-20 md:px-32 py-16 border-b border-gray-100 flex items-center gap-8 md:gap-12 overflow-x-auto">
                  <button onClick={() => setSelectedMentoringYear('all')} className={`px-12 md:px-16 py-6 md:py-8 rounded-full text-[11px] md:text-xs font-bold transition-all shrink-0 ${selectedMentoringYear === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All ({mentees.length})</button>
                  {mentoringYears.map((year) => (<button key={year} onClick={() => setSelectedMentoringYear(year)} className={`px-12 md:px-16 py-6 md:py-8 rounded-full text-[11px] md:text-xs font-bold transition-all shrink-0 ${selectedMentoringYear === year ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{year} ({getMenteeCountByYear(year)})</button>))}
                </div>

                {/* University Filter */}
                {universityStats.length > 0 && (
                  <div className="px-20 md:px-32 py-16 border-b border-gray-100 bg-gray-50/30">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-12">University Distribution</p>
                    <div className="flex flex-wrap gap-6 md:gap-8">
                      {universityStats.map(([univ, count]) => (
                        <button key={univ} onClick={() => setSelectedUniversity(selectedUniversity === univ ? 'all' : univ)} className={`px-10 md:px-12 py-4 md:py-6 rounded-full text-[11px] md:text-xs font-medium transition-all flex items-center gap-4 ${selectedUniversity === univ ? 'text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5'}`} style={selectedUniversity === univ ? {backgroundColor: '#E8889C'} : {}}>
                          {univ} <span className="font-bold" style={{color: selectedUniversity === univ ? 'white' : '#E8889C'}}>({count})</span>
                          {selectedUniversity === univ && <X size={12}/>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentee List */}
                <div className="max-h-400 overflow-y-auto">
                  {filteredMentees.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {filteredMentees.map((mentee) => (
                        <div key={mentee.id} className="px-20 md:px-32 py-12 md:py-16 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center justify-between md:flex-row">
                            <div className="flex items-center gap-12 md:gap-16">
                              <div className="size-36 md:size-40 rounded-full flex items-center justify-center shrink-0" style={{backgroundColor: 'rgba(255,183,197,0.2)'}}>
                                <span className="text-sm md:text-base font-bold" style={{color: 'rgb(172,14,14)'}}>{mentee.participationYears.length}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900">{mentee.name}</p>
                                <p className="text-[11px] md:text-xs text-gray-500 truncate">{mentee.university} · {mentee.department} · {mentee.entryYear}학번</p>
                              </div>
                            </div>
                            <div className="hidden md:flex items-center gap-8 md:gap-12 shrink-0">
                              <div className="flex gap-4 flex-wrap justify-end">
                                {mentee.participationYears.map((year) => (<span key={year} className={`px-6 md:px-8 py-2 rounded text-[10px] font-bold ${year === '2026' ? '' : 'bg-gray-100 text-gray-500'}`} style={year === '2026' ? {backgroundColor: 'rgba(255,183,197,0.3)', color: 'rgb(172,14,14)'} : {}}>{year}</span>))}
                              </div>
                            </div>
                          </div>
                          <div className="flex md:hidden gap-4 flex-wrap mt-8 ml-48">
                            {mentee.participationYears.map((year) => (<span key={year} className={`px-6 py-2 rounded text-[10px] font-bold ${year === '2026' ? '' : 'bg-gray-100 text-gray-500'}`} style={year === '2026' ? {backgroundColor: 'rgba(255,183,197,0.3)', color: 'rgb(172,14,14)'} : {}}>{year}</span>))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-40 text-center text-gray-400"><Users size={40} className="mx-auto mb-12 opacity-30"/><p className="text-sm">No mentees found</p></div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-20 md:px-32 py-12 md:py-16 bg-gray-50/50 border-t border-gray-100">
                  <p className="text-[11px] md:text-xs text-gray-500">
                    Showing <span className="font-bold text-gray-700">{filteredMentees.length}</span> mentee{filteredMentees.length !== 1 ? 's' : ''}
                    {selectedMentoringYear !== 'all' && <span className="text-primary"> in {selectedMentoringYear}</span>}
                    {selectedUniversity !== 'all' && <span className="text-primary"> from {selectedUniversity}</span>}
                  </p>
                </div>
              </div>
            </ExpandableSection>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorActivitiesTemplate)
