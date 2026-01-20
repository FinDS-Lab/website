import {memo, useState, useEffect, useMemo} from 'react'
import {Link} from 'react-router-dom'
import {Home, GraduationCap, Building2, Users, ChevronDown, ExternalLink} from 'lucide-react'
import banner2 from '@/assets/images/banner/2.webp'
import type {AlumniData, AlumniMember} from '@/types/data'

// Degree colors matching current members
const degreeColors = {
  phd: {
    bg: 'bg-[rgb(172,14,14)]',
    bgLight: 'bg-[rgb(172,14,14)]/10',
    text: 'text-[rgb(172,14,14)]',
    border: 'border-[rgb(172,14,14)]/20',
  },
  ms: {
    bg: 'bg-[rgb(214,177,77)]',
    bgLight: 'bg-[rgb(214,177,77)]/10',
    text: 'text-[rgb(214,177,77)]',
    border: 'border-[rgb(214,177,77)]/20',
  },
  ur: {
    bg: 'bg-primary',
    bgLight: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  bs: {
    bg: 'bg-gray-500',
    bgLight: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
}

export const MembersAlumniTemplate = () => {
  const [alumniData, setAlumniData] = useState<AlumniData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/website/'
    fetch(`${baseUrl}data/alumni.json`)
      .then((res) => res.json())
      .then((data: AlumniData) => {
        setAlumniData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load alumni data:', err)
        setLoading(false)
      })
  }, [])

  // Categorize alumni
  const categorizedAlumni = useMemo(() => {
    if (!alumniData) return {phd: [], ms: [], undergrad: []}

    const phd: AlumniMember[] = []
    const ms: AlumniMember[] = []
    const undergrad: AlumniMember[] = []

    // Graduate alumni
    alumniData.graduateAlumni.forEach((alum) => {
      if (alum.degrees.includes('phd')) {
        phd.push(alum)
      }
      if (alum.degrees.includes('ms') && !alum.degrees.includes('phd')) {
        ms.push(alum)
      }
    })

    // Undergrad alumni
    alumniData.undergradAlumni.forEach((alum) => {
      undergrad.push(alum)
    })

    return {phd, ms, undergrad}
  }, [alumniData])

  // Stats
  const stats = useMemo(() => {
    if (!alumniData) return {phd: 0, ms: 0, undergrad: 0, total: 0}

    let phdCount = 0
    let msCount = 0

    alumniData.graduateAlumni.forEach((alum) => {
      if (alum.degrees.includes('phd')) phdCount++
      if (alum.degrees.includes('ms')) msCount++
    })

    const undergradCount = alumniData.undergradAlumni.length

    return {
      phd: phdCount,
      ms: msCount,
      undergrad: undergradCount,
      total: phdCount + msCount + undergradCount,
    }
  }, [alumniData])

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({...prev, [key]: !prev[key]}))
  }

  const getColors = (deg: string) => {
    return degreeColors[deg as keyof typeof degreeColors] || degreeColors.bs
  }

  const renderAlumniCard = (alum: AlumniMember, index: number, section: string) => {
    const cardKey = `${section}-${index}`
    const isExpanded = expandedCards[cardKey]
    const primaryDegree = alum.degrees[0]
    const colors = getColors(primaryDegree)

    return (
      <div
        key={cardKey}
        className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'} ${colors.border}`}
      >
        {/* Header */}
        <button
          onClick={() => toggleCard(cardKey)}
          className="w-full flex items-center justify-between p-16 md:p-20 text-left"
        >
          <div className="flex items-center gap-12 md:gap-16">
            <div className={`size-48 md:size-56 rounded-full flex items-center justify-center ${colors.bgLight}`}>
              <GraduationCap className={`size-24 md:size-28 ${colors.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-8 flex-wrap">
                <h4 className="text-base md:text-lg font-bold text-gray-900">{alum.name}</h4>
                <span className="text-sm text-gray-500">{alum.nameKo}</span>
                {alum.cohort && (
                  <span className={`px-6 py-1 rounded-full text-[10px] font-bold ${colors.bg} text-white`}>
                    {alum.cohort}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 mt-4">
                {alum.degrees.map((deg) => {
                  const c = getColors(deg)
                  return (
                    <span key={deg} className={`px-8 py-2 rounded-full text-[10px] font-bold ${c.bgLight} ${c.text}`}>
                      {deg.toUpperCase()}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`size-20 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-16 md:px-20 pb-16 md:pb-20 border-t border-gray-100">
            {/* Period */}
            <div className="pt-16">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">Period</p>
              <div className="space-y-4">
                {Object.entries(alum.periods).map(([deg, period]) => {
                  const c = getColors(deg)
                  return (
                    <div key={deg} className="flex items-center gap-8">
                      <span className={`px-6 py-1 rounded text-[10px] font-bold ${c.bg} text-white`}>
                        {deg.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{period}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Current Affiliation */}
            {alum.company && (
              <div className="pt-16">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">Current Affiliation</p>
                <div className="flex items-center gap-8">
                  <Building2 size={14} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{alum.company}</span>
                </div>
              </div>
            )}

            {/* Thesis */}
            {alum.thesis && Object.keys(alum.thesis).length > 0 && (
              <div className="pt-16">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">Thesis / Dissertation</p>
                <div className="space-y-8">
                  {Object.entries(alum.thesis).map(([deg, thesis]) => {
                    const c = getColors(deg)
                    return (
                      <div key={deg} className="flex items-start gap-8">
                        <span className={`px-6 py-1 rounded text-[10px] font-bold shrink-0 ${c.bg} text-white`}>
                          {deg.toUpperCase()}
                        </span>
                        <a
                          href={thesis.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-4"
                        >
                          {thesis.title}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Education */}
            {alum.education && alum.education.length > 0 && (
              <div className="pt-16">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">Education</p>
                <div className="space-y-6">
                  {alum.education.map((edu, idx) => {
                    const c = getColors(edu.degree)
                    return (
                      <div key={idx} className="flex items-center gap-8">
                        <span className={`px-6 py-1 rounded text-[10px] font-bold ${c.bgLight} ${c.text}`}>
                          {edu.degree.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          {edu.school}, {edu.dept} ({edu.year})
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
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

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Alumni
          </h1>
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-12 md:gap-16">
            <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-amber-300" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-amber-300" />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20">
        <div className="py-20 md:py-32 border-b border-gray-100">
          <div className="flex items-center gap-8 md:gap-12 flex-wrap">
            <Link to="/" className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110">
              <Home size={16} />
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
        ) : !alumniData ? (
          <div className="text-center py-60">
            <GraduationCap size={48} className="mx-auto text-gray-300 mb-16" />
            <p className="text-lg font-semibold text-gray-600 mb-8">No Alumni Data</p>
            <p className="text-gray-400">Alumni information will be displayed here once available.</p>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="flex flex-col gap-16 md:gap-[20px] mb-40 md:mb-[60px]">
              <div className="flex items-center gap-[8px]">
                <h2 className="text-xl md:text-[26px] font-semibold text-gray-900">Statistics</h2>
                {alumniData.sinceDate && (
                  <span className="text-xs text-gray-400 ml-8">since {alumniData.sinceDate}</span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-[20px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-16 md:px-20 py-16 md:py-[24px] bg-white border border-gray-100 rounded-xl md:rounded-[20px] shadow-sm gap-8">
                  <div className="flex items-center gap-8 md:gap-[12px]">
                    <GraduationCap className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500" />
                    <span className="text-sm md:text-md font-semibold text-gray-900">Ph.D.</span>
                  </div>
                  <span className="text-md md:text-[24px] font-semibold text-[rgb(172,14,14)]">{stats.phd}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-16 md:px-20 py-16 md:py-[24px] bg-white border border-gray-100 rounded-xl md:rounded-[20px] shadow-sm gap-8">
                  <div className="flex items-center gap-8 md:gap-[12px]">
                    <GraduationCap className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500" />
                    <span className="text-sm md:text-md font-semibold text-gray-900">M.S.</span>
                  </div>
                  <span className="text-md md:text-[24px] font-semibold text-[rgb(214,177,77)]">{stats.ms}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-16 md:px-20 py-16 md:py-[24px] bg-white border border-gray-100 rounded-xl md:rounded-[20px] shadow-sm gap-8">
                  <div className="flex items-center gap-8 md:gap-[12px]">
                    <GraduationCap className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500" />
                    <span className="text-sm md:text-md font-semibold text-gray-900">Undergrad</span>
                  </div>
                  <span className="text-md md:text-[24px] font-semibold text-primary">{stats.undergrad}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-16 md:px-20 py-16 md:py-[24px] bg-white border border-gray-100 rounded-xl md:rounded-[20px] shadow-sm gap-8">
                  <div className="flex items-center gap-8 md:gap-[12px]">
                    <Users className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500" />
                    <span className="text-sm md:text-md font-semibold text-gray-900">Total</span>
                  </div>
                  <span className="text-md md:text-[24px] font-semibold text-primary">{stats.total}</span>
                </div>
              </div>
            </div>

            {/* Alumni Lists */}
            <div className="flex flex-col gap-32 md:gap-[40px]">
              {/* Ph.D. Alumni */}
              {categorizedAlumni.phd.length > 0 && (
                <div>
                  <h3 className="text-lg md:text-[22px] font-semibold text-gray-800 mb-16 md:mb-[20px] flex items-center gap-12">
                    <span className={`size-8 rounded-full ${degreeColors.phd.bg}`} />
                    Ph.D. Alumni
                    <span className="text-sm font-normal text-gray-400">({categorizedAlumni.phd.length})</span>
                  </h3>
                  <div className="flex flex-col gap-12">
                    {categorizedAlumni.phd.map((alum, idx) => renderAlumniCard(alum, idx, 'phd'))}
                  </div>
                </div>
              )}

              {/* M.S. Alumni */}
              {categorizedAlumni.ms.length > 0 && (
                <div>
                  <h3 className="text-lg md:text-[22px] font-semibold text-gray-800 mb-16 md:mb-[20px] flex items-center gap-12">
                    <span className={`size-8 rounded-full ${degreeColors.ms.bg}`} />
                    M.S. Alumni
                    <span className="text-sm font-normal text-gray-400">({categorizedAlumni.ms.length})</span>
                  </h3>
                  <div className="flex flex-col gap-12">
                    {categorizedAlumni.ms.map((alum, idx) => renderAlumniCard(alum, idx, 'ms'))}
                  </div>
                </div>
              )}

              {/* Undergraduate Alumni - Table Format */}
              {categorizedAlumni.undergrad.length > 0 && (
                <div>
                  <h3 className="text-lg md:text-[22px] font-semibold text-gray-800 mb-16 md:mb-[20px] flex items-center gap-12">
                    <span className={`size-8 rounded-full ${degreeColors.ur.bg}`} />
                    Undergraduate Researchers
                    <span className="text-sm font-normal text-gray-400">({categorizedAlumni.undergrad.length})</span>
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-16 py-12 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-16 py-12 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Education</th>
                            <th className="px-16 py-12 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Projects</th>
                            <th className="px-16 py-12 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Post-Program Affiliation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {categorizedAlumni.undergrad.map((alum, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-16 py-12">
                                <div className="flex items-center gap-8">
                                  <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary">{alum.name.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">{alum.name}</p>
                                    <p className="text-xs text-gray-500">{alum.nameKo}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-16 py-12 hidden md:table-cell">
                                {alum.education && alum.education.length > 0 ? (
                                  <div className="space-y-2">
                                    {alum.education.map((edu, i) => (
                                      <p key={i} className="text-xs text-gray-600">
                                        {edu.degree.toUpperCase()} · {edu.school}
                                      </p>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-16 py-12 hidden lg:table-cell">
                                {alum.projects && alum.projects.length > 0 ? (
                                  <div className="flex flex-wrap gap-4">
                                    {alum.projects.slice(0, 2).map((proj, i) => (
                                      <span key={i} className="px-8 py-2 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                                        {proj.length > 20 ? proj.substring(0, 20) + '...' : proj}
                                      </span>
                                    ))}
                                    {alum.projects.length > 2 && (
                                      <span className="text-[10px] text-gray-400">+{alum.projects.length - 2}</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-16 py-12">
                                {alum.company ? (
                                  <div className="flex items-center gap-6">
                                    <Building2 size={12} className="text-gray-400" />
                                    <span className="text-xs font-medium text-gray-700">{alum.company}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {categorizedAlumni.phd.length === 0 &&
                categorizedAlumni.ms.length === 0 &&
                categorizedAlumni.undergrad.length === 0 && (
                  <div className="text-center py-60">
                    <GraduationCap size={48} className="mx-auto text-gray-300 mb-16" />
                    <p className="text-lg font-semibold text-gray-600 mb-8">No Alumni Yet</p>
                    <p className="text-gray-400">Alumni information will be displayed here once available.</p>
                  </div>
                )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default memo(MembersAlumniTemplate)
