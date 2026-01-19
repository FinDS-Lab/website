import {memo, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Home, GraduationCap, Building2} from 'lucide-react'
import banner2 from '@/assets/images/banner/2.webp'

type Alumni = {
  name: string
  nameKo: string
  degree: string
  graduationYear: number
  currentPosition?: string
  currentAffiliation?: string
  thesisTitle?: string
}

export const MembersAlumniTemplate = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/website/'
    fetch(`${baseUrl}data/alumni.json`)
      .then((res) => res.json())
      .then((data: Alumni[]) => {
        setAlumni(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load alumni data:', err)
        setLoading(false)
      })
  }, [])

  // Group by graduation year
  const alumniByYear = alumni.reduce((acc, a) => {
    const year = a.graduationYear
    if (!acc[year]) acc[year] = []
    acc[year].push(a)
    return acc
  }, {} as Record<number, Alumni[]>)

  const years = Object.keys(alumniByYear).map(Number).sort((a, b) => b - a)

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
            Alumni
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
        ) : years.length === 0 ? (
          <div className="text-center py-60">
            <GraduationCap size={48} className="mx-auto text-gray-300 mb-16"/>
            <p className="text-lg font-semibold text-gray-600 mb-8">No Alumni Yet</p>
            <p className="text-gray-400">Alumni information will be displayed here once available.</p>
          </div>
        ) : (
          <div className="space-y-32">
            {years.map((year) => (
              <div key={year}>
                <div className="flex items-center gap-12 mb-16">
                  <span className="px-16 py-6 bg-primary text-white text-sm font-bold rounded-full">
                    {year}
                  </span>
                  <span className="text-sm text-gray-500">{alumniByYear[year]?.length || 0} graduates</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                  {(alumniByYear[year] || []).map((a, idx) => (
                    <div
                      key={idx}
                      className="p-20 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-start gap-16">
                        <div className="size-56 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                          <GraduationCap size={24}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900">{a.name}</h3>
                          <p className="text-sm text-gray-500">{a.nameKo}</p>
                          <div className="flex flex-wrap items-center gap-8 mt-8">
                            <span className="px-8 py-2 bg-primary/10 text-primary text-xs font-bold rounded">
                              {a.degree}
                            </span>
                          </div>
                          {a.currentPosition && (
                            <div className="flex items-center gap-6 mt-12 text-xs text-gray-500">
                              <Building2 size={12}/>
                              <span>{a.currentPosition}{a.currentAffiliation ? ` @ ${a.currentAffiliation}` : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default memo(MembersAlumniTemplate)
