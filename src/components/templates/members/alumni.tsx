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
  nameKo: string
  degrees: string[]
  cohort?: string
  cohortName?: string
  currentPosition?: string
  periods: Record<string, string>
  education: Education[]
  thesis?: Record<string, Thesis>
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
  ur: 'Undergraduate',
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

  // Get primary affiliation (the school where they got their degree from lab)
  const getAffiliation = (alumni: AlumniMember) => {
    const labDegree = alumni.education.find(e => 
      e.school.includes('Dongduk') || e.school.includes('Gachon') || e.school.includes('동덕') || e.school.includes('가천')
    )
    if (labDegree) {
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{labDegree.dept}</span>
          <span className="text-gray-500 text-[11px] md:text-xs">{labDegree.school}</span>
        </div>
      )
    }
    return alumni.education[0]?.school || '-'
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
            {/* Stats Summary */}
            <div className="flex flex-col gap-16 md:gap-24">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
                <span className="w-8 h-8 rounded-full bg-primary" />
                Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#D6B14D'}}>{phdCount}</span>
                    <div className="flex items-center gap-6">
                      <GraduationCap className="size-14 md:size-16" style={{color: '#D6B14D', opacity: 0.7}} />
                      <span className="text-xs md:text-sm font-medium text-gray-600">
                        Ph.D. {pluralize(phdCount, 'Graduate', 'Graduates')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#E8889C'}}>{msCount}</span>
                    <div className="flex items-center gap-6">
                      <BookOpen className="size-14 md:size-16" style={{color: '#E8889C', opacity: 0.7}} />
                      <span className="text-xs md:text-sm font-medium text-gray-600">
                        M.S. {pluralize(msCount, 'Graduate', 'Graduates')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#FFBAC4'}}>{undergradCount}</span>
                    <div className="flex items-center gap-6">
                      <UserCheck className="size-14 md:size-16" style={{color: '#FFBAC4', opacity: 0.7}} />
                      <span className="text-xs md:text-sm font-medium text-gray-600">
                        Undergraduate Research {pluralize(undergradCount, 'Alumnus', 'Alumni')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="group relative bg-[#FFF9E6] border border-[#D6B14D]/20 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-[#D6B14D]/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#D6B14D'}}>{totalCount}</span>
                    <div className="flex items-center gap-6">
                      <Users className="size-14 md:size-16" style={{color: '#4A4A4A', opacity: 0.7}} />
                      <span className="text-xs md:text-sm font-medium text-gray-600">
                        Total {pluralize(totalCount, 'Alumnus', 'Alumni')}
                      </span>
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
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full min-w-[700px] table-fixed">
                      <thead>
                        <tr className="bg-gray-50/80">
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[22%]">Name</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[12%]">Degree</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[26%]">Affiliation</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[18%]">Graduated</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[22%]">Current Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phdAlumni.map((alumni, idx) => {
                          const isExpanded = expandedAlumni.has(alumni.name)
                          const hasThesis = alumni.thesis && alumni.thesis.phd
                          const alumniNumber = phdAlumni.length - idx // Count from bottom
                          
                          return (
                            <React.Fragment key={idx}>
                              <tr 
                                className={`border-b border-gray-100 hover:bg-[#FFF9E6]/30 transition-colors group ${hasThesis ? 'cursor-pointer' : ''}`}
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
                                      <div>
                                        <p className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                          {alumni.name}
                                        </p>
                                        <p className="text-[11px] md:text-xs text-gray-500">{alumni.nameKo}</p>
                                      </div>
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
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full min-w-[700px] table-fixed">
                      <thead>
                        <tr className="bg-gray-50/80">
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[22%]">Name</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[12%]">Degree</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[26%]">Affiliation</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[18%]">Graduated</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[22%]">Current Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {msAlumni.map((alumni, idx) => {
                          const isExpanded = expandedAlumni.has(alumni.name)
                          const hasThesis = alumni.thesis && alumni.thesis.ms
                          const alumniNumber = msAlumni.length - idx // Count from bottom
                          
                          return (
                            <React.Fragment key={idx}>
                              <tr 
                                className={`border-b border-gray-100 hover:bg-pink-50/30 transition-colors group ${hasThesis ? 'cursor-pointer' : ''}`}
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
                                      <div>
                                        <p className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                          {alumni.name}
                                        </p>
                                        <p className="text-[11px] md:text-xs text-gray-500">{alumni.nameKo}</p>
                                      </div>
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
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full min-w-[700px] table-fixed">
                      <thead>
                        <tr className="bg-gray-50/80">
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[20%]">Name</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[22%]">Cohort</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[22%]">Affiliation (at time of internship)</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[16%]">Period</th>
                          <th className="py-12 px-16 text-left text-sm font-bold text-gray-900 w-[20%]">Current Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedUndergradAlumni.map((alumni, idx) => (
                          <tr key={idx} className="border-b border-gray-100 hover:bg-pink-50/30 transition-colors group">
                            <td className="py-12 md:py-16 px-12 md:px-16">
                              <div className="flex items-center gap-10 md:gap-12">
                                <div className="size-36 md:size-40 rounded-full flex items-center justify-center shrink-0" style={{background: 'linear-gradient(135deg, rgba(255,183,197,0.2) 0%, rgba(232,135,155,0.15) 100%)'}}>
                                  <GraduationCap size={16} style={{color: '#FFBAC4'}}/>
                                </div>
                                <div>
                                  <p className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">{alumni.name}</p>
                                  <p className="text-[11px] md:text-xs text-gray-500">{alumni.nameKo}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-12 md:py-16 px-12 md:px-16">
                              <div className="flex flex-col gap-4">
                                <span className="px-8 md:px-10 py-3 md:py-4 text-[10px] md:text-xs font-bold rounded-full inline-block w-fit" style={{backgroundColor: 'rgba(255,183,197,0.15)', color: '#E8889C'}}>
                                  {alumni.cohort || '-'}
                                </span>
                                {alumni.cohortName && (
                                  <span className="text-[10px] text-gray-500">{alumni.cohortName}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-12 md:py-16 px-12 md:px-16 text-xs md:text-sm text-gray-600">
                              {getAffiliation(alumni)}
                            </td>
                            <td className="py-12 md:py-16 px-12 md:px-16 text-xs md:text-sm text-gray-600">
                              {alumni.periods?.ur || '-'}
                            </td>
                            <td className="py-12 md:py-16 px-12 md:px-16">
                              {(alumni.currentPosition || alumni.company) ? (
                                <div className="flex items-center gap-6 text-xs md:text-sm text-gray-600">
                                  <Building2 size={14} style={{color: '#FFBAC4'}}/>
                                  <span>{alumni.currentPosition || alumni.company}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
