import {memo, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Home, GraduationCap, Building2, FileText, ExternalLink} from 'lucide-react'
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

  useEffect(() => {
    fetch('/website/data/alumni.json')
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

  // Sort by highest degree and graduation year
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

  // Group graduate alumni by degree type
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
          <span className="text-amber-300/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-16 md:mb-20">
            Members
          </span>
          
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
            <div className="flex flex-wrap items-center justify-center gap-24 py-24 bg-gray-50 rounded-2xl">
              <div className="text-center px-24">
                <p className="text-3xl font-bold text-primary">{totalCount}</p>
                <p className="text-sm text-gray-500 mt-4">Total Alumni</p>
              </div>
              <div className="w-px h-40 bg-gray-200 hidden md:block" />
              <div className="text-center px-24">
                <p className="text-3xl font-bold text-gray-900">{phdAlumni.length}</p>
                <p className="text-sm text-gray-500 mt-4">Ph.D.</p>
              </div>
              <div className="w-px h-40 bg-gray-200 hidden md:block" />
              <div className="text-center px-24">
                <p className="text-3xl font-bold text-gray-900">{msAlumni.length}</p>
                <p className="text-sm text-gray-500 mt-4">M.S.</p>
              </div>
              <div className="w-px h-40 bg-gray-200 hidden md:block" />
              <div className="text-center px-24">
                <p className="text-3xl font-bold text-gray-900">{sortedUndergradAlumni.length}</p>
                <p className="text-sm text-gray-500 mt-4">Undergraduate</p>
              </div>
            </div>

            {/* Ph.D. Alumni */}
            {phdAlumni.length > 0 && (
              <div>
                <div className="flex items-center gap-12 mb-24">
                  <span className="px-16 py-8 bg-primary text-white text-sm font-bold rounded-full">
                    Ph.D.
                  </span>
                  <span className="text-sm text-gray-500">{phdAlumni.length} graduates</span>
                </div>
                <div className="space-y-16">
                  {phdAlumni.map((alumni, idx) => (
                    <AlumniCard key={idx} alumni={alumni} />
                  ))}
                </div>
              </div>
            )}

            {/* M.S. Alumni */}
            {msAlumni.length > 0 && (
              <div>
                <div className="flex items-center gap-12 mb-24">
                  <span className="px-16 py-8 text-white text-sm font-bold rounded-full" style={{backgroundColor: '#e8879b'}}>
                    M.S.
                  </span>
                  <span className="text-sm text-gray-500">{msAlumni.length} graduates</span>
                </div>
                <div className="space-y-16">
                  {msAlumni.map((alumni, idx) => (
                    <AlumniCard key={idx} alumni={alumni} />
                  ))}
                </div>
              </div>
            )}

            {/* Undergraduate Alumni */}
            {sortedUndergradAlumni.length > 0 && (
              <div>
                <div className="flex items-center gap-12 mb-24">
                  <span className="px-16 py-8 text-white text-sm font-bold rounded-full" style={{backgroundColor: '#ffb7c5'}}>
                    Undergraduate
                  </span>
                  <span className="text-sm text-gray-500">{sortedUndergradAlumni.length} graduates</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="py-12 px-16 text-left text-sm font-bold text-gray-900">Name</th>
                        <th className="py-12 px-16 text-left text-sm font-bold text-gray-900">Cohort</th>
                        <th className="py-12 px-16 text-left text-sm font-bold text-gray-900">Period</th>
                        <th className="py-12 px-16 text-left text-sm font-bold text-gray-900">Current Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUndergradAlumni.map((alumni, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-pink-50/30 transition-colors group">
                          <td className="py-12 md:py-16 px-12 md:px-16">
                            <div className="flex items-center gap-10 md:gap-12">
                              <div className="size-36 md:size-40 rounded-full flex items-center justify-center shrink-0" style={{background: 'linear-gradient(135deg, rgba(255,183,197,0.2) 0%, rgba(232,135,155,0.15) 100%)'}}>
                                <GraduationCap size={16} style={{color: '#ffb7c5'}}/>
                              </div>
                              <div>
                                <p className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">{alumni.name}</p>
                                <p className="text-[11px] md:text-xs text-gray-500">{alumni.nameKo}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-12 md:py-16 px-12 md:px-16">
                            <span className="px-8 md:px-10 py-3 md:py-4 text-[10px] md:text-xs font-bold rounded-full" style={{backgroundColor: 'rgba(255,183,197,0.15)', color: '#e8879b'}}>
                              {alumni.cohort || '-'}
                            </span>
                          </td>
                          <td className="py-12 md:py-16 px-12 md:px-16 text-xs md:text-sm text-gray-600">
                            {alumni.periods?.ur || '-'}
                          </td>
                          <td className="py-12 md:py-16 px-12 md:px-16">
                            {alumni.company ? (
                              <div className="flex items-center gap-6 text-xs md:text-sm text-gray-600">
                                <Building2 size={14} style={{color: '#ffb7c5'}}/>
                                <span>{alumni.company}</span>
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
              </div>
            )}

            {/* Since Date */}
            {data?.sinceDate && (
              <div className="text-center pt-24 border-t border-gray-100">
                <p className="text-sm text-gray-400">
                  Lab established since {data.sinceDate}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

// Alumni Card Component for Ph.D. and M.S.
const AlumniCard = memo(({alumni}: {alumni: AlumniMember}) => {
  return (
    <div className="p-20 md:p-24 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-primary/20 transition-all group">
      <div className="flex flex-col md:flex-row md:items-start gap-16 md:gap-20">
        {/* Avatar */}
        <div className="size-64 md:size-72 rounded-2xl flex items-center justify-center shrink-0" style={{background: 'linear-gradient(135deg, rgba(232,135,155,0.2) 0%, rgba(255,183,197,0.3) 100%)'}}>
          <GraduationCap size={28} style={{color: '#e8879b'}}/>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-8 md:gap-12 mb-12">
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{alumni.name}</h3>
              <p className="text-sm text-gray-500">{alumni.nameKo}</p>
            </div>
            <div className="flex flex-wrap gap-6">
              {alumni.degrees.sort((a, b) => (degreeOrder[a] || 99) - (degreeOrder[b] || 99)).map(deg => (
                <span
                  key={deg}
                  className="px-10 py-4 text-xs font-bold rounded-full"
                  style={{
                    backgroundColor: deg === 'phd' ? 'rgba(172,14,14,0.1)' : 
                                     deg === 'ms' ? 'rgba(232,135,155,0.15)' : 
                                     'rgba(255,183,197,0.15)',
                    color: deg === 'phd' ? 'rgb(172,14,14)' : 
                           deg === 'ms' ? '#e8879b' : 
                           '#ffb7c5'
                  }}
                >
                  {degreeLabels[deg] || deg.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
          
          {/* Education Timeline */}
          <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
            {alumni.education
              .sort((a, b) => (degreeOrder[a.degree] || 99) - (degreeOrder[b.degree] || 99))
              .map((edu, idx) => {
                const isFromLab = edu.school.includes('Gachon') || edu.school.includes('가천')
                return (
                  <div key={idx} className="flex items-center gap-6 md:gap-8 text-xs md:text-sm">
                    <span className="w-40 md:w-48 font-medium shrink-0" style={{color: isFromLab ? 'rgb(172,14,14)' : '#e8879b'}}>
                      {degreeLabels[edu.degree] || edu.degree.toUpperCase()}
                    </span>
                    <span className={`${isFromLab ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {edu.school}, {edu.dept} ({edu.year})
                      {isFromLab && (
                        <span className="ml-6 px-6 py-2 text-[10px] font-bold rounded text-white" style={{backgroundColor: 'rgb(172,14,14)'}}>
                          FINDS
                        </span>
                      )}
                    </span>
                  </div>
                )
              })}
          </div>
          
          {/* Thesis */}
          {alumni.thesis && Object.keys(alumni.thesis).length > 0 && (
            <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
              {Object.entries(alumni.thesis)
                .sort(([a], [b]) => (degreeOrder[a] || 99) - (degreeOrder[b] || 99))
                .map(([deg, thesis]) => (
                  <div key={deg} className="flex items-start gap-8 p-10 md:p-12 rounded-xl" style={{backgroundColor: 'rgba(255,183,197,0.08)'}}>
                    <FileText size={16} className="shrink-0 mt-2" style={{color: '#ffb7c5'}}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-bold mb-2" style={{color: '#e8879b'}}>
                        {degreeLabels[deg] || deg.toUpperCase()} Thesis
                      </p>
                      <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                        {thesis.title}
                      </p>
                      {thesis.url && (
                        <a
                          href={thesis.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-4 text-xs text-primary hover:underline mt-6 md:mt-8"
                        >
                          <ExternalLink size={12}/>
                          View Thesis
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          {/* Current Position */}
          {alumni.company && (
            <div className="flex items-center gap-8 pt-10 md:pt-12 border-t border-gray-100">
              <Building2 size={16} style={{color: '#e8879b'}}/>
              <span className="text-xs md:text-sm text-gray-600">
                Currently at <span className="font-semibold text-gray-900">{alumni.company}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

AlumniCard.displayName = 'AlumniCard'

export default memo(MembersAlumniTemplate)
