import { memo, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Home, ChevronDown, ChevronRight, ExternalLink, Users } from 'lucide-react'
import clsx from 'clsx'

// Image Imports
import banner2 from '@/assets/images/banner/2.webp'

// Types
type Education = {
  degree: string
  school: string
  dept: string
  year: string
}

type Thesis = {
  title: string
  url: string
}

type AlumniMember = {
  name: string
  nameKo: string
  degrees: string[]
  cohort?: string
  periods: Record<string, string>
  education: Education[]
  thesis: Record<string, Thesis>
  company: string
}

type AlumniData = {
  graduateAlumni: AlumniMember[]
  undergradAlumni: AlumniMember[]
  sinceDate: string
}

// Degree badge 색상
const degreeColors: Record<string, string> = {
  phd: 'bg-amber-500 text-white',
  ms: 'bg-orange-400 text-white',
  ur: 'bg-red-600 text-white',
  bs: 'bg-gray-200 text-gray-700 border border-gray-300',
}

// 섹션 헤더 색상
const sectionColors: Record<string, string> = {
  phd: 'from-amber-500 to-amber-600',
  ms: 'from-orange-400 to-orange-500',
  undergrad: 'from-red-600 to-red-700',
}

// Alumni Row Component
const AlumniRow = ({
  alumni,
  degreeType,
  isExpanded,
  onToggle,
}: {
  alumni: AlumniMember
  degreeType: 'phd' | 'ms' | 'ur'
  isExpanded: boolean
  onToggle: () => void
}) => {
  const thesis = alumni.thesis[degreeType]
  const period = alumni.periods[degreeType]

  return (
    <>
      {/* Main Row */}
      <tr
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <td className="px-16 md:px-20 py-16 md:py-20">
          <div className="flex items-center gap-8">
            <ChevronRight
              size={14}
              className={clsx(
                'text-gray-400 transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
            />
            <div>
              <span className="font-bold text-gray-900 text-sm md:text-base">
                {alumni.name} {alumni.nameKo}
              </span>
              {alumni.cohort && (
                <span className="ml-6 px-6 py-2 bg-red-100 text-red-700 text-[10px] md:text-xs font-bold rounded-full">
                  {alumni.cohort}
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="px-16 md:px-20 py-16 md:py-20">
          <div className="flex items-center gap-6">
            <span className={clsx('px-8 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase', degreeColors[degreeType])}>
              {degreeType === 'ur' ? 'UR' : degreeType.toUpperCase()}
            </span>
            <span className="text-xs md:text-sm text-gray-600 font-medium">{period}</span>
          </div>
        </td>
        <td className="px-16 md:px-20 py-16 md:py-20 hidden md:table-cell">
          {thesis && (
            <a
              href={thesis.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline line-clamp-2"
            >
              {thesis.title}
            </a>
          )}
        </td>
        <td className="px-16 md:px-20 py-16 md:py-20 hidden lg:table-cell">
          <span className="text-sm text-gray-700 font-medium">{alumni.company}</span>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={4} className="px-16 md:px-20 py-16 md:py-20">
            <div className="bg-white rounded-xl border border-gray-200 p-16 md:p-20 space-y-16">
              {/* Mobile: Thesis */}
              {thesis && (
                <div className="md:hidden">
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
                    {degreeType === 'phd' ? 'Dissertation' : degreeType === 'ms' ? 'Thesis' : 'Capstone/Project'}
                  </p>
                  <a
                    href={thesis.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-4"
                  >
                    {thesis.title}
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Mobile: Company */}
              <div className="lg:hidden">
                <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Current Affiliation</p>
                <p className="text-sm text-gray-900 font-semibold">{alumni.company}</p>
              </div>

              {/* Education */}
              <div>
                <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-8">Education</p>
                <div className="space-y-6">
                  {alumni.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center gap-8">
                      <span className={clsx('px-6 py-2 rounded-full text-[10px] font-bold uppercase', degreeColors[edu.degree] || degreeColors.bs)}>
                        {edu.degree.toUpperCase()}
                      </span>
                      <span className="text-xs md:text-sm text-gray-700">
                        {edu.school}, {edu.dept} ({edu.year})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Degree Thesis (if applicable) */}
              {alumni.degrees.length > 1 && (
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-8">All Thesis/Dissertations</p>
                  <div className="space-y-8">
                    {alumni.degrees.map((d) => {
                      const t = alumni.thesis[d]
                      if (!t) return null
                      return (
                        <div key={d}>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{d === 'phd' ? 'Ph.D.' : 'M.S.'}</span>
                          <a
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:underline mt-2"
                          >
                            {t.title}
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// Mobile Card Component
const AlumniCard = ({
  alumni,
  degreeType,
  isExpanded,
  onToggle,
  accentColor,
}: {
  alumni: AlumniMember
  degreeType: 'phd' | 'ms' | 'ur'
  isExpanded: boolean
  onToggle: () => void
  accentColor: string
}) => {
  const thesis = alumni.thesis[degreeType]
  const period = alumni.periods[degreeType]

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-16 py-14 bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">
              {alumni.name} {alumni.nameKo}
            </span>
            {alumni.cohort && (
              <span className="px-6 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                {alumni.cohort}
              </span>
            )}
          </div>
          <div className="flex items-center gap-6 mt-4">
            <span className={clsx('px-6 py-1 rounded-full text-[9px] font-bold uppercase', degreeColors[degreeType])}>
              {degreeType === 'ur' ? 'UR' : degreeType.toUpperCase()}
            </span>
          </div>
        </div>
        <div
          className={clsx(
            'w-24 h-24 rounded-full flex items-center justify-center transition-colors',
            accentColor
          )}
        >
          <ChevronDown
            size={12}
            className={clsx('text-white transition-transform', isExpanded && 'rotate-180')}
          />
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="px-16 py-14 space-y-12 border-t border-gray-100">
          {/* Period */}
          <div>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-4">Period</p>
            <p className="text-xs text-gray-700 font-semibold">{period}</p>
          </div>

          {/* Company */}
          <div>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-4">Current Affiliation</p>
            <p className="text-xs text-gray-900 font-semibold">{alumni.company}</p>
          </div>

          {/* Thesis */}
          {thesis && (
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                {degreeType === 'phd' ? 'Dissertation' : degreeType === 'ms' ? 'Thesis' : 'Capstone/Project'}
              </p>
              <a
                href={thesis.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                {thesis.title}
              </a>
            </div>
          )}

          {/* Education */}
          <div>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-6">Education</p>
            <div className="space-y-4">
              {alumni.education.map((edu, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <span className={clsx('px-4 py-1 rounded-full text-[8px] font-bold uppercase', degreeColors[edu.degree] || degreeColors.bs)}>
                    {edu.degree.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-gray-600">{edu.school} ({edu.year})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Section Component
const AlumniSection = ({
  title,
  emoji,
  colorClass,
  alumni,
  degreeType,
  accentColor,
}: {
  title: string
  emoji: string
  colorClass: string
  alumni: AlumniMember[]
  degreeType: 'phd' | 'ms' | 'ur'
  accentColor: string
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (alumni.length === 0) return null

  return (
    <div className="mb-32 md:mb-40">
      {/* Section Header */}
      <div className={clsx('bg-gradient-to-r rounded-xl px-16 md:px-20 py-14 md:py-16 mb-16 md:mb-20', colorClass)}>
        <div className="flex items-center gap-10">
          <span className="text-xl md:text-2xl">{emoji}</span>
          <h3 className="text-base md:text-lg font-bold text-white">{title}</h3>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-20 py-14 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%]">Name</th>
              <th className="px-20 py-14 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[20%]">Period</th>
              <th className="px-20 py-14 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%]">
                {degreeType === 'phd' ? 'Dissertation' : degreeType === 'ms' ? 'Thesis' : 'Capstone/Project'}
              </th>
              <th className="px-20 py-14 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[20%] hidden lg:table-cell">Current Affiliation</th>
            </tr>
          </thead>
          <tbody>
            {alumni.map((alum, index) => (
              <AlumniRow
                key={index}
                alumni={alum}
                degreeType={degreeType}
                isExpanded={expandedIndex === index}
                onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-12">
        {alumni.map((alum, index) => (
          <AlumniCard
            key={index}
            alumni={alum}
            degreeType={degreeType}
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  )
}

export const MembersAlumniTemplate = () => {
  const [alumniData, setAlumniData] = useState<AlumniData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/website/data/alumni.json')
      .then((res) => res.json())
      .then((data) => {
        setAlumniData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load alumni data:', err)
        setLoading(false)
      })
  }, [])

  // 데이터 분류
  const { phdAlumni, msAlumni, undergradAlumni, stats } = useMemo(() => {
    if (!alumniData) {
      return { phdAlumni: [], msAlumni: [], undergradAlumni: [], stats: { phd: 0, ms: 0, undergrad: 0 } }
    }

    const graduate = alumniData.graduateAlumni || []
    const undergrad = alumniData.undergradAlumni || []

    // PhD를 가진 사람 (MS+PhD 포함)
    const phd = graduate.filter((a) => a.degrees.includes('phd'))
    // MS만 가진 사람
    const ms = graduate.filter((a) => a.degrees.includes('ms') && !a.degrees.includes('phd'))

    // 통계: PhD 포함하면 PhD 카운트, MS 포함하면 MS 카운트 (둘 다 있으면 둘 다)
    let phdCount = 0
    let msCount = 0
    graduate.forEach((a) => {
      if (a.degrees.includes('phd')) phdCount++
      if (a.degrees.includes('ms')) msCount++
    })

    return {
      phdAlumni: phd,
      msAlumni: ms,
      undergradAlumni: undergrad,
      stats: {
        phd: phdCount,
        ms: msCount,
        undergrad: undergrad.length,
      },
    }
  }, [alumniData])

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-200 md:h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner2})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-2xl md:text-[36px] font-semibold text-white text-center">Alumni</h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-20 md:py-40">
        <div className="flex items-center gap-8 md:gap-10 flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            <Home size={16} />
          </Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-gray-400">Members</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-primary font-medium">Alumni</span>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-80">
        {loading ? (
          <div className="bg-gray-50 rounded-xl p-40 md:p-60 text-center">
            <p className="text-sm md:text-base text-gray-500">Loading alumni data...</p>
          </div>
        ) : (
          <>
            {/* Alumni Since */}
            <div className="mb-20 md:mb-24">
              <div className="bg-white border border-gray-200 rounded-xl px-16 md:px-20 py-14 md:py-16 border-t-4 border-t-gray-500 text-center">
                <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">Alumni Since</span>
                <span className="text-base md:text-xl font-black text-gray-900 ml-8 md:ml-12">
                  {alumniData?.sinceDate || '2019.09.01'}
                </span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-10 md:gap-16 mb-32 md:mb-40">
              <div className="bg-white border border-gray-200 rounded-xl p-14 md:p-20 text-center border-t-4 border-t-amber-500 hover:shadow-lg transition-shadow">
                <div className="text-xl md:text-3xl font-black text-gray-900">{stats.phd}</div>
                <div className="text-[9px] md:text-xs text-gray-500 font-bold uppercase mt-4 leading-tight">
                  Ph.D.<br />Alumni
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-14 md:p-20 text-center border-t-4 border-t-orange-400 hover:shadow-lg transition-shadow">
                <div className="text-xl md:text-3xl font-black text-gray-900">{stats.ms}</div>
                <div className="text-[9px] md:text-xs text-gray-500 font-bold uppercase mt-4 leading-tight">
                  M.S.<br />Alumni
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-14 md:p-20 text-center border-t-4 border-t-red-600 hover:shadow-lg transition-shadow">
                <div className="text-xl md:text-3xl font-black text-gray-900">{stats.undergrad}</div>
                <div className="text-[9px] md:text-xs text-gray-500 font-bold uppercase mt-4 leading-tight">
                  Undergraduate<br />Research Alumni
                </div>
              </div>
            </div>

            {/* PhD Section */}
            <AlumniSection
              title="Ph.D. Alumni"
              emoji="🎓"
              colorClass={sectionColors.phd}
              alumni={phdAlumni}
              degreeType="phd"
              accentColor="bg-amber-500"
            />

            {/* MS Section */}
            <AlumniSection
              title="M.S. Alumni"
              emoji="📖"
              colorClass={sectionColors.ms}
              alumni={msAlumni}
              degreeType="ms"
              accentColor="bg-orange-400"
            />

            {/* Undergrad Section */}
            <AlumniSection
              title="Undergraduate Research Alumni"
              emoji="📚"
              colorClass={sectionColors.undergrad}
              alumni={undergradAlumni}
              degreeType="ur"
              accentColor="bg-red-600"
            />

            {/* Empty State */}
            {phdAlumni.length === 0 && msAlumni.length === 0 && undergradAlumni.length === 0 && (
              <div className="bg-gray-50 rounded-xl p-40 md:p-60 text-center">
                <div className="w-60 h-60 md:w-80 md:h-80 bg-white rounded-full flex items-center justify-center mx-auto mb-16 md:mb-20">
                  <Users className="w-28 h-28 md:w-40 md:h-40 text-gray-300" />
                </div>
                <p className="text-base md:text-lg font-medium text-gray-800 mb-8">No alumni found</p>
                <p className="text-xs md:text-sm text-gray-500">등록된 졸업생이 없습니다.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default memo(MembersAlumniTemplate)
