import React, {memo, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Home, GraduationCap, Building2, ChevronDown, ChevronUp, FileText, ExternalLink, BookOpen, UserCheck, Users} from 'lucide-react'
import banner2 from '@/assets/images/banner/2.webp'

type Education = {
  degree: string
  school: string
  dept: string
  year: string
}

type Thesis = {
  title: string
  url?: string
}

type AlumniMember = {
  name: string
  nameKo?: string
  degrees: string[]
  cohort?: string
  cohortName?: string
  currentPosition?: string
  periods: Record<string, string>
  education: Education[]
  thesis?: Record<string, Thesis>
  project?: { title: string }
  company?: string
}

type AlumniData = {
  graduateAlumni: AlumniMember[]
  undergradAlumni: AlumniMember[]
  sinceDate: string
}

const degreeLabels: Record<string, string> = {
  phd: 'Ph.D.',
  ms: 'M.S.',
  bs: 'B.S.',
  ur: 'Undergraduate Researcher',
}

const degreeOrder: Record<string, number> = {
  phd: 1,
  ms: 2,
  bs: 3,
  ur: 4,
}

export const MembersAlumniTemplate = () => {
  const [data, setData] = useState<AlumniData | null>(null)
  const [loading, setLoading] = useState(true)
  const [phdExpanded, setPhdExpanded] = useState(true)
  const [msExpanded, setMsExpanded] = useState(true)
  const [undergradExpanded, setUndergradExpanded] = useState(true)
  const [expandedAlumni, setExpandedAlumni] = useState<Set<string>>(new Set())

  const toggleAlumniExpand = (name: string) => {
    setExpandedAlumni(prev => {
      const newSet = new Set(prev)
      if (newSet.has(name)) {
        newSet.delete(name)
      } else {
        newSet.add(name)
      }
      return newSet
    })
  }

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/alumni.json`)
      .then((res) => res.json())
      .then((json: AlumniData) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load alumni data:', err)
        setLoading(false)
      })
  }, [])

  // Sort graduate alumni by highest degree and graduation year
  const sortedGraduateAlumni = data?.graduateAlumni
    ? [...data.graduateAlumni].sort((a, b) => {
        const aMaxDegree = Math.min(...a.degrees.map(d => degreeOrder[d] || 99))
        const bMaxDegree = Math.min(...b.degrees.map(d => degreeOrder[d] || 99))
        if (aMaxDegree !== bMaxDegree) return aMaxDegree - bMaxDegree
        
        const aYear = Math.max(...a.education.map(e => parseInt(e.year) || 0))
        const bYear = Math.max(...b.education.map(e => parseInt(e.year) || 0))
        return bYear - aYear
      })
    : []

  // Separate Ph.D. and M.S. alumni
  const phdAlumni = sortedGraduateAlumni.filter(a => a.degrees.includes('phd'))
  const msAlumni = sortedGraduateAlumni.filter(a => a.degrees.includes('ms') && !a.degrees.includes('phd'))

  // Sort undergrad alumni by cohort
  const sortedUndergradAlumni = data?.undergradAlumni
    ? [...data.undergradAlumni].sort((a, b) => {
        const aCohort = parseInt(a.cohort?.replace(/[^0-9]/g, '') || '0')
        const bCohort = parseInt(b.cohort?.replace(/[^0-9]/g, '') || '0')
        return aCohort - bCohort
      })
    : []

  const totalCount = (data?.graduateAlumni?.length || 0) + (data?.undergradAlumni?.length || 0)
  const phdCount = sortedGraduateAlumni.filter(a => a.degrees.includes('phd')).length
  const msCount = sortedGraduateAlumni.filter(a => a.degrees.includes('ms') && !a.degrees.includes('phd')).length
  const undergradCount = data?.undergradAlumni?.length || 0

  // Helper for singular/plural
  const pluralize = (count: number, singular: string, plural: string) => 
    count === 1 ? singular : plural

  // Get primary affiliation - 학교(더볼드) 학과(볼드) 형식 (학부과정 표시 안함)
  const getAffiliation = (alumni: AlumniMember) => {
    const edu = alumni.education[0]
    if (!edu) return <span className="text-gray-400">-</span>
    
    return (
      <span className="text-sm">
        <span className="font-bold text-gray-900">{edu.school}</span>
        {' '}
        <span className="font-semibold text-gray-700">{edu.dept}</span>
      </span>
    )
  }

  // Render currentPosition - 학교(더볼드) 학과(볼드) 학위(일반)
  const renderCurrentPosition = (position: string | undefined) => {
    if (!position) return <span className="text-gray-400">-</span>
    
    // Check if it contains newline (multi-line format like "석사과정\n산업경영공학부\n고려대학교")
    if (position.includes('\n')) {
      const parts = position.split('\n')
      // 순서: 학위과정 / 학과 / 학교
      const degree = parts[0] || ''
      const dept = parts[1] || ''
      const school = parts[2] || ''
      return (
        <span className="text-sm">
          <span className="font-bold text-gray-900">{school}</span>
          {' '}
          <span className="font-semibold text-gray-700">{dept}</span>
          {' '}
          <span className="text-gray-600">{degree}</span>
        </span>
      )
    }
    
    // Simple position (재학생)
    return <span className="text-gray-600 text-sm">{position}</span>
  }

  // Check if alumni has position change (Pre != Post)
  const hasPositionChange = (alumni: AlumniMember): boolean => {
    if (!alumni.currentPosition) return false
    if (alumni.currentPosition === '재학생') return false
    return true
  }

  // Get graduation date only (for Ph.D./M.S.)
  const getGraduationDate = (alumni: AlumniMember, degreeType: string) => {
    const period = alumni.periods[degreeType]
    if (!period) return '-'
    // "2019.09 – 2025.02" -> "2025.02"
    const parts = period.split('–').map(s => s.trim())
    if (parts.length >= 2) {
      return parts[1] // 졸업 시점만
    }
    return period
  }

  // Get graduation period (for undergrad - full period)
  const getPeriod = (alumni: AlumniMember) => {
    const highestDegree = alumni.degrees.sort((a, b) => (degreeOrder[a] || 99) - (degreeOrder[b] || 99))[0]
    return alumni.periods[highestDegree] || Object.values(alumni.periods)[0] || '-'
  }

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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B14D]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B14D]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-16 md:mb-20">
            Members
          </span>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Alumni
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
            <span className="text-sm text-primary font-semibold">Alumni</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60 pb-60 md:pb-100">
        {loading ? (
          <div className="text-center py-40">
            <p className="text-gray-400 animate-pulse">Loading alumni...</p>
          </div>
        ) : !data || totalCount === 0 ? (
          <div className="text-center py-60">
            <GraduationCap size={48} className="mx-auto text-gray-300 mb-16"/>
            <p className="text-lg font-semibold text-gray-600 mb-8">No Alumni Yet</p>
            <p className="text-gray-400">Alumni information will be displayed here once available.</p>
          </div>
        ) : (
          <div className="space-y-48">
            {/* Stats Summary - Total on top, 3 categories below */}
            <div className="flex flex-col gap-16 md:gap-24">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
                <span className="w-8 h-8 rounded-full bg-primary" />
                Statistics
              </h2>
              
              {/* Total - Full width, centered */}
              <div className="group relative bg-[#FFF9E6] border border-[#D6B14D]/20 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-[#D6B14D]/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#D6B14D'}}>{totalCount}</span>
                  <div className="flex items-center gap-6">
                    <Users className="size-14 md:size-16" style={{color: '#D6B14D', opacity: 0.7}} />
                    <span className="text-xs md:text-sm font-medium text-gray-600">Total Alumni</span>
                  </div>
                </div>
              </div>
              
              {/* 3 Categories - 3 columns */}
              <div className="grid grid-cols-3 gap-8 md:gap-12">
                <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#D6B14D'}}>{phdCount}</span>
                    <div className="flex items-center gap-6">
                      <GraduationCap className="size-14 md:size-16" style={{color: '#D6B14D', opacity: 0.7}} />
                      <span className="text-xs md:text-sm font-medium text-gray-600">Ph.D.</span>
                    </div>
                  </div>
                </div>
                <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#E8889C'}}>{msCount}</span>
                    <div className="flex items-center gap-6">
                      <BookOpen className="size-14 md:size-16" style={{color: '#E8889C', opacity: 0.7}} />
                      <span className="text-xs md:text-sm font-medium text-gray-600">M.S.</span>
                    </div>
                  </div>
                </div>
                <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#FFBAC4'}}>{undergradCount}</span>
                    <div className="flex items-center gap-6">
                      <UserCheck className="size-14 md:size-16" style={{color: '#FFBAC4', opacity: 0.7}} />
                      <span className="text-xs md:text-sm font-medium text-gray-600">Undergraduate Researcher</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ph.D. Section */}
            {phdAlumni.length > 0 && (
              <div className="flex flex-col gap-16 md:gap-24">
                <button
                  onClick={() => setPhdExpanded(!phdExpanded)}
                  className="flex items-center justify-between w-full group"
                >
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
                    <span className="w-8 h-8 rounded-full" style={{backgroundColor: '#D6B14D'}} />
                    Ph.D. Graduates
                  </h2>
                  <div className="size-32 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    {phdExpanded ? (
                      <ChevronUp size={18} className="text-gray-400 group-hover:text-primary" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400 group-hover:text-primary" />
                    )}
                  </div>
                </button>
                
                {phdExpanded && (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
                      <table className="w-full min-w-[700px] table-fixed">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[18%]">Name</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[10%]">Degree</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[32%]">Affiliation</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[16%]">Graduated</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[24%]">Post-Graduation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {phdAlumni.map((alumni, idx) => {
                            const isExpanded = expandedAlumni.has(alumni.name)
                            const hasThesis = alumni.thesis && alumni.thesis.phd
                            const alumniNumber = phdAlumni.length - idx
                            
                            return (
                              <React.Fragment key={idx}>
                                <tr 
                                  className={`border-b border-gray-100 hover:bg-[#D6B14D]/5 transition-colors group ${hasThesis ? 'cursor-pointer' : ''}`}
                                  onClick={() => hasThesis && toggleAlumniExpand(alumni.name)}
                                >
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    <div className="flex items-center gap-10 md:gap-12">
                                      <div 
                                        className="size-36 md:size-40 rounded-full flex items-center justify-center shrink-0"
                                        style={{background: 'linear-gradient(135deg, rgba(214, 176, 76,0.15) 0%, rgba(214, 176, 76,0.08) 100%)'}}
                                      >
                                        <span className="text-xs md:text-sm font-bold" style={{color: '#D6B14D'}}>{alumniNumber}</span>
                                      </div>
                                      <div className="flex items-center gap-8">
                                        <p className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-[#D6B14D] transition-colors">
                                          {alumni.nameKo || alumni.name}
                                        </p>
                                        {hasThesis && (
                                          <ChevronDown 
                                            size={14} 
                                            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    <span className="px-8 md:px-10 py-3 md:py-4 text-[10px] md:text-xs font-bold rounded-full"
                                      style={{backgroundColor: 'rgba(214, 176, 76,0.1)', color: '#D6B14D'}}>
                                      Ph.D.
                                    </span>
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16 text-xs md:text-sm text-gray-600">
                                    {getAffiliation(alumni)}
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16 text-xs md:text-sm text-gray-600">
                                    {getGraduationDate(alumni, 'phd')}
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    {alumni.company ? (
                                      <div className="flex items-center gap-6 text-xs md:text-sm text-gray-600">
                                        <Building2 size={14} style={{color: '#D6B14D'}}/>
                                        <span>{alumni.company}</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                </tr>
                                {isExpanded && hasThesis && (
                                  <tr className="bg-gray-50/50">
                                    <td colSpan={5} className="py-16 px-16">
                                      <div className="space-y-12 ml-48">
                                        {Object.entries(alumni.thesis!)
                                          .filter(([deg]) => deg === 'phd')
                                          .map(([deg, thesis]) => (
                                            <div key={deg} className="flex items-start gap-12 p-12 rounded-xl bg-white border border-gray-100">
                                              <FileText size={16} className="shrink-0 mt-2" style={{color: '#D6B14D'}}/>
                                              <div className="flex-1 min-w-0">
                                                <p className="text-[10px] md:text-xs font-bold mb-4" style={{color: '#D6B14D'}}>
                                                  Ph.D. Dissertation
                                                </p>
                                                <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                                                  {thesis.title}
                                                </p>
                                                {thesis.url && (
                                                  <a
                                                    href={thesis.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-4 text-xs text-primary hover:underline mt-8"
                                                    onClick={(e) => e.stopPropagation()}
                                                  >
                                                    <ExternalLink size={12}/>
                                                    View Dissertation
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden flex flex-col gap-12">
                      {phdAlumni.map((alumni, idx) => {
                        const isExpanded = expandedAlumni.has(alumni.name)
                        const hasThesis = alumni.thesis && alumni.thesis.phd
                        const alumniNumber = phdAlumni.length - idx
                        
                        return (
                          <div 
                            key={idx}
                            className={`rounded-xl border border-gray-100 bg-white overflow-hidden ${hasThesis ? 'cursor-pointer' : ''}`}
                            onClick={() => hasThesis && toggleAlumniExpand(alumni.name)}
                          >
                            <div className="p-16 flex items-center gap-12 bg-gradient-to-r from-amber-50/50 to-white">
                              <div className="size-40 rounded-full flex items-center justify-center shrink-0" style={{background: 'linear-gradient(135deg, rgba(214, 176, 76,0.2) 0%, rgba(214, 176, 76,0.1) 100%)'}}>
                                <span className="text-sm font-bold" style={{color: '#D6B14D'}}>{alumniNumber}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-8">
                                  <p className="text-base font-bold text-gray-900">{alumni.nameKo || alumni.name}</p>
                                  {hasThesis && (
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
                                  )}
                                </div>
                                <span className="px-8 py-2 mt-4 text-[10px] font-bold rounded-full inline-block" style={{backgroundColor: 'rgba(214, 176, 76,0.1)', color: '#D6B14D'}}>
                                  Ph.D.
                                </span>
                              </div>
                            </div>
                            
                            <div className="px-16 py-12 space-y-8 border-t border-gray-50">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Affiliation</span>
                                <span className="text-xs text-gray-700 font-semibold text-right">{alumni.education[0]?.school || '-'}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Graduated</span>
                                <span className="text-xs text-gray-600">{getGraduationDate(alumni, 'phd')}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Post-Graduation</span>
                                <span className="text-xs text-gray-600">{alumni.company || '-'}</span>
                              </div>
                            </div>

                            {isExpanded && hasThesis && (
                              <div className="px-16 pb-16">
                                {Object.entries(alumni.thesis!)
                                  .filter(([deg]) => deg === 'phd')
                                  .map(([deg, thesis]) => (
                                    <div key={deg} className="flex items-start gap-10 p-12 rounded-lg bg-gray-50 border border-gray-100">
                                      <FileText size={14} className="shrink-0 mt-1" style={{color: '#D6B14D'}}/>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold mb-4" style={{color: '#D6B14D'}}>Ph.D. Dissertation</p>
                                        <p className="text-xs text-gray-700 leading-relaxed">{thesis.title}</p>
                                        {thesis.url && (
                                          <a href={thesis.url} target="_blank" rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-4 text-xs text-primary hover:underline mt-8"
                                            onClick={(e) => e.stopPropagation()}>
                                            <ExternalLink size={12}/> View
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* M.S. Section */}
            {msAlumni.length > 0 && (
              <div className="flex flex-col gap-16 md:gap-24">
                <button
                  onClick={() => setMsExpanded(!msExpanded)}
                  className="flex items-center justify-between w-full group"
                >
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
                    <span className="w-8 h-8 rounded-full" style={{backgroundColor: '#E8889C'}} />
                    M.S. Graduates
                  </h2>
                  <div className="size-32 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    {msExpanded ? (
                      <ChevronUp size={18} className="text-gray-400 group-hover:text-primary" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400 group-hover:text-primary" />
                    )}
                  </div>
                </button>
                
                {msExpanded && (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
                      <table className="w-full min-w-[700px] table-fixed">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[18%]">Name</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[10%]">Degree</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[32%]">Affiliation</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[16%]">Graduated</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[24%]">Post-Graduation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msAlumni.map((alumni, idx) => {
                            const isExpanded = expandedAlumni.has(alumni.name)
                            const hasThesis = alumni.thesis && alumni.thesis.ms
                            const alumniNumber = msAlumni.length - idx
                            
                            return (
                              <React.Fragment key={idx}>
                                <tr 
                                  className={`border-b border-gray-100 hover:bg-[#E8889C]/5 transition-colors group ${hasThesis ? 'cursor-pointer' : ''}`}
                                  onClick={() => hasThesis && toggleAlumniExpand(alumni.name)}
                                >
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    <div className="flex items-center gap-10 md:gap-12">
                                      <div 
                                        className="size-36 md:size-40 rounded-full flex items-center justify-center shrink-0"
                                        style={{background: 'linear-gradient(135deg, rgba(232,135,155,0.2) 0%, rgba(232,135,155,0.1) 100%)'}}
                                      >
                                        <span className="text-xs md:text-sm font-bold" style={{color: '#E8889C'}}>{alumniNumber}</span>
                                      </div>
                                      <div className="flex items-center gap-8">
                                        <p className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-[#E8889C] transition-colors">
                                          {alumni.nameKo || alumni.name}
                                        </p>
                                        {hasThesis && (
                                          <ChevronDown 
                                            size={14} 
                                            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    <span className="px-8 md:px-10 py-3 md:py-4 text-[10px] md:text-xs font-bold rounded-full"
                                      style={{backgroundColor: 'rgba(232,135,155,0.15)', color: '#E8889C'}}>
                                      M.S.
                                    </span>
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16 text-xs md:text-sm text-gray-600">
                                    {getAffiliation(alumni)}
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16 text-xs md:text-sm text-gray-600">
                                    {getGraduationDate(alumni, 'ms')}
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    {alumni.company ? (
                                      <div className="flex items-center gap-6 text-xs md:text-sm text-gray-600">
                                        <Building2 size={14} style={{color: '#E8889C'}}/>
                                        <span>{alumni.company}</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                </tr>
                                {isExpanded && hasThesis && (
                                  <tr className="bg-gray-50/50">
                                    <td colSpan={5} className="py-16 px-16">
                                      <div className="space-y-12 ml-48">
                                        {Object.entries(alumni.thesis!)
                                          .filter(([deg]) => deg === 'ms')
                                          .map(([deg, thesis]) => (
                                            <div key={deg} className="flex items-start gap-12 p-12 rounded-xl bg-white border border-gray-100">
                                              <FileText size={16} className="shrink-0 mt-2" style={{color: '#E8889C'}}/>
                                              <div className="flex-1 min-w-0">
                                                <p className="text-[10px] md:text-xs font-bold mb-4" style={{color: '#E8889C'}}>
                                                  M.S. Thesis
                                                </p>
                                                <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                                                  {thesis.title}
                                                </p>
                                                {thesis.url && (
                                                  <a
                                                    href={thesis.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-4 text-xs text-primary hover:underline mt-8"
                                                    onClick={(e) => e.stopPropagation()}
                                                  >
                                                    <ExternalLink size={12}/>
                                                    View Thesis
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden flex flex-col gap-12">
                      {msAlumni.map((alumni, idx) => {
                        const isExpanded = expandedAlumni.has(alumni.name)
                        const hasThesis = alumni.thesis && alumni.thesis.ms
                        const alumniNumber = msAlumni.length - idx
                        
                        return (
                          <div 
                            key={idx}
                            className={`rounded-xl border border-gray-100 bg-white overflow-hidden ${hasThesis ? 'cursor-pointer' : ''}`}
                            onClick={() => hasThesis && toggleAlumniExpand(alumni.name)}
                          >
                            <div className="p-16 flex items-center gap-12 bg-gradient-to-r from-pink-50/50 to-white">
                              <div className="size-40 rounded-full flex items-center justify-center shrink-0" style={{background: 'linear-gradient(135deg, rgba(232,135,155,0.25) 0%, rgba(232,135,155,0.12) 100%)'}}>
                                <span className="text-sm font-bold" style={{color: '#E8889C'}}>{alumniNumber}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-8">
                                  <p className="text-base font-bold text-gray-900">{alumni.nameKo || alumni.name}</p>
                                  {hasThesis && (
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
                                  )}
                                </div>
                                <span className="px-8 py-2 mt-4 text-[10px] font-bold rounded-full inline-block" style={{backgroundColor: 'rgba(232,135,155,0.15)', color: '#E8889C'}}>
                                  M.S.
                                </span>
                              </div>
                            </div>
                            
                            <div className="px-16 py-12 space-y-8 border-t border-gray-50">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Affiliation</span>
                                <span className="text-xs text-gray-700 font-semibold text-right">{alumni.education[0]?.school || '-'}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Graduated</span>
                                <span className="text-xs text-gray-600">{getGraduationDate(alumni, 'ms')}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Post-Graduation</span>
                                <span className="text-xs text-gray-600">{alumni.company || '-'}</span>
                              </div>
                            </div>

                            {isExpanded && hasThesis && (
                              <div className="px-16 pb-16">
                                {Object.entries(alumni.thesis!)
                                  .filter(([deg]) => deg === 'ms')
                                  .map(([deg, thesis]) => (
                                    <div key={deg} className="flex items-start gap-10 p-12 rounded-lg bg-gray-50 border border-gray-100">
                                      <FileText size={14} className="shrink-0 mt-1" style={{color: '#E8889C'}}/>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold mb-4" style={{color: '#E8889C'}}>M.S. Thesis</p>
                                        <p className="text-xs text-gray-700 leading-relaxed">{thesis.title}</p>
                                        {thesis.url && (
                                          <a href={thesis.url} target="_blank" rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-4 text-xs text-primary hover:underline mt-8"
                                            onClick={(e) => e.stopPropagation()}>
                                            <ExternalLink size={12}/> View
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Undergraduate Research Students Section - Collapsible */}
            {sortedUndergradAlumni.length > 0 && (
              <div className="flex flex-col gap-16 md:gap-24">
                <button
                  onClick={() => setUndergradExpanded(!undergradExpanded)}
                  className="flex items-center justify-between w-full group"
                >
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
                    <span className="w-8 h-8 rounded-full" style={{backgroundColor: '#FFBAC4'}} />
                    Former Undergraduate Researchers
                  </h2>
                  <div className="size-32 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    {undergradExpanded ? (
                      <ChevronUp size={18} className="text-gray-400 group-hover:text-primary" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400 group-hover:text-primary" />
                    )}
                  </div>
                </button>

                {undergradExpanded && (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
                      <table className="w-full min-w-[800px] table-fixed">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[14%]">Name</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[8%]">Cohort</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[14%]">Period</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[32%]">Affiliation (Pre-Internship)</th>
                            <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[32%]">Affiliation (Post-Internship)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedUndergradAlumni.map((alumni, idx) => {
                            const isExpanded = expandedAlumni.has(alumni.name)
                            const hasProject = alumni.project && alumni.project.title
                            const hasChange = hasPositionChange(alumni)
                            
                            return (
                              <React.Fragment key={idx}>
                                <tr 
                                  className={`border-b border-gray-100 hover:bg-[#FFBAC4]/10 transition-colors group ${hasProject ? 'cursor-pointer' : ''}`}
                                  onClick={() => hasProject && toggleAlumniExpand(alumni.name)}
                                >
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    <div className="flex items-center gap-10 md:gap-12">
                                      <div className="size-36 md:size-40 rounded-full flex items-center justify-center shrink-0" style={{background: 'linear-gradient(135deg, rgba(255,183,197,0.2) 0%, rgba(232,135,155,0.15) 100%)'}}>
                                        <GraduationCap size={16} style={{color: '#FFBAC4'}}/>
                                      </div>
                                      <div className="flex items-center gap-8">
                                        <p className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-[#FFBAC4] transition-colors">{alumni.name}</p>
                                        {hasProject && (
                                          <ChevronDown 
                                            size={14} 
                                            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    <div className="group/tooltip relative inline-block">
                                      <span className="px-10 md:px-12 py-4 md:py-5 text-[10px] md:text-xs font-bold rounded-full inline-block w-fit cursor-default transition-all duration-200 group-hover/tooltip:shadow-md" style={{backgroundColor: 'rgba(255,183,197,0.15)', color: '#E8889C'}}>
                                        {alumni.cohort || '-'}
                                      </span>
                                      {alumni.cohortName && (
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-8 px-12 py-6 bg-gray-900 text-white text-[10px] font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-10 shadow-lg">
                                          {alumni.cohortName.match(/\(([^)]+)\)/)?.[1] || alumni.cohortName}
                                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-t-gray-900" />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16 text-sm text-gray-600">
                                    {alumni.periods?.ur || '-'}
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    {getAffiliation(alumni)}
                                  </td>
                                  <td className="py-12 md:py-16 px-12 md:px-16">
                                    {hasChange ? renderCurrentPosition(alumni.currentPosition) : getAffiliation(alumni)}
                                  </td>
                                </tr>
                                {isExpanded && hasProject && (
                                  <tr className="bg-gray-50/50">
                                    <td colSpan={5} className="py-16 px-16">
                                      <div className="ml-48 flex items-start gap-12 p-12 rounded-xl bg-white border border-gray-100">
                                        <FileText size={16} className="shrink-0 mt-2" style={{color: '#FFBAC4'}}/>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[10px] md:text-xs font-bold mb-4" style={{color: '#E8889C'}}>
                                            Research Project
                                          </p>
                                          <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                                            {alumni.project!.title}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden flex flex-col gap-12">
                      {sortedUndergradAlumni.map((alumni, idx) => {
                        const isExpanded = expandedAlumni.has(alumni.name)
                        const hasProject = alumni.project && alumni.project.title
                        const hasChange = hasPositionChange(alumni)
                        
                        return (
                          <div 
                            key={idx}
                            className={`rounded-xl border border-gray-100 bg-white overflow-hidden ${hasProject ? 'cursor-pointer' : ''}`}
                            onClick={() => hasProject && toggleAlumniExpand(alumni.name)}
                          >
                            {/* Card Header */}
                            <div className="p-16 flex items-center gap-12 bg-gradient-to-r from-pink-50/50 to-white">
                              <div className="size-40 rounded-full flex items-center justify-center shrink-0" style={{background: 'linear-gradient(135deg, rgba(255,183,197,0.3) 0%, rgba(232,135,155,0.2) 100%)'}}>
                                <GraduationCap size={18} style={{color: '#FFBAC4'}}/>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-8">
                                  <p className="text-base font-bold text-gray-900">{alumni.name}</p>
                                  {hasProject && (
                                    <ChevronDown 
                                      size={14} 
                                      className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                  )}
                                </div>
                                <span className="group relative px-10 py-3 mt-4 text-[10px] font-bold rounded-full inline-block cursor-default transition-all duration-200 active:scale-95" style={{backgroundColor: 'rgba(255,183,197,0.15)', color: '#E8889C'}}>
                                  {alumni.cohort || '-'}
                                  {alumni.cohortName && (
                                    <span className="absolute left-full ml-8 top-1/2 -translate-y-1/2 px-10 py-4 bg-gray-900 text-white text-[9px] font-medium rounded-md whitespace-nowrap opacity-0 invisible group-active:opacity-100 group-active:visible transition-all duration-200 z-10 shadow-lg">
                                      {alumni.cohortName.match(/\(([^)]+)\)/)?.[1] || alumni.cohortName}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="px-16 py-12 space-y-10 border-t border-gray-50">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Period</span>
                                <span className="text-xs text-gray-600 text-right">{alumni.periods?.ur || '-'}</span>
                              </div>
                              {hasChange ? (
                                <>
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Pre</span>
                                    <div className="text-right">
                                      {getAffiliation(alumni)}
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Post</span>
                                    <div className="text-right">
                                      {renderCurrentPosition(alumni.currentPosition)}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">Affiliation</span>
                                  <div className="text-right">
                                    {getAffiliation(alumni)}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Project Section */}
                            {isExpanded && hasProject && (
                              <div className="px-16 pb-16">
                                <div className="flex items-start gap-10 p-12 rounded-lg bg-gray-50 border border-gray-100">
                                  <FileText size={14} className="shrink-0 mt-1" style={{color: '#FFBAC4'}}/>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold mb-4" style={{color: '#E8889C'}}>Research Project</p>
                                    <p className="text-xs text-gray-700 leading-relaxed">{alumni.project!.title}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default memo(MembersAlumniTemplate)
