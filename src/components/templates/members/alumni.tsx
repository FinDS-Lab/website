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
    fetch('/website/data/alumni.json')
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
      {/* Banner */}
      <div className="relative w-full h-200 md:h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: `url(${banner2})`}}
        />
        <div className="absolute inset-0 bg-black/40"/>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-2xl md:text-[36px] font-semibold text-white text-center">
            Alumni
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-20 md:py-40">
        <div className="flex items-center gap-8 md:gap-10 flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            <Home size={16}/>
          </Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-gray-400">Members</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-primary font-medium">Alumni</span>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
        {loading ? (
          <div className="text-center py-40">
            <p className="text-gray-400 animate-pulse">Loading alumni...</p>
          </div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-40">
            <GraduationCap size={48} className="mx-auto text-gray-300 mb-16"/>
            <p className="text-gray-400">No alumni data available yet.</p>
          </div>
        ) : (
          <div className="space-y-32">
            {years.map((year) => (
              <div key={year}>
                <div className="flex items-center gap-12 mb-16">
                  <span className="px-16 py-6 bg-primary text-white text-sm font-bold rounded-full">
                    {year}
                  </span>
                  <span className="text-sm text-gray-500">{alumniByYear[year].length} graduates</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                  {alumniByYear[year].map((a, idx) => (
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
