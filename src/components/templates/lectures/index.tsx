import { memo, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Home, Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import clsx from 'clsx'

// Image Imports
import banner3 from '@/assets/images/banner/3.webp'

// Types
type Course = {
  en: string
  ko: string
}

type Lecture = {
  role: string
  periods: string[]
  school: string
  courses: Course[]
}

// 필터 모달 컴포넌트
const FilterModal = ({
  filters,
  options,
  onChange,
  onReset,
  onClose,
}: {
  filters: {
    role: string[]
    school: string[]
    year: string[]
  }
  options: {
    roles: string[]
    schools: string[]
    years: string[]
  }
  onChange: (key: keyof typeof filters, value: string) => void
  onReset: () => void
  onClose: () => void
}) => {
  const sections = [
    { key: 'role' as const, label: 'Role', items: options.roles },
    { key: 'school' as const, label: 'University', items: options.schools },
    { key: 'year' as const, label: 'Year', items: options.years },
  ]

  return (
    <div className="flex flex-col gap-20 p-20">
      {sections.map((section) => (
        <div key={section.key} className="flex flex-col gap-16">
          <h4 className="text-base font-bold text-gray-900">{section.label}</h4>
          <div className="flex flex-wrap gap-8">
            {section.items.map((item) => {
              const isActive = filters[section.key].includes(item)
              return (
                <button
                  key={item}
                  onClick={() => {
                    onChange(section.key, item)
                    onClose()
                  }}
                  className={clsx(
                    'px-16 py-8 rounded-lg text-sm font-medium transition-all border',
                    isActive
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-[#7f8894] border-[#f0f0f0] hover:border-primary/30 hover:bg-gray-50'
                  )}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-16 border-t border-gray-100">
        <button onClick={onReset} className="px-16 py-8 text-sm font-medium text-gray-400 hover:text-primary transition-colors">
          Reset all filters
        </button>
      </div>
    </div>
  )
}

// 학기를 날짜로 변환
const seasonToDate = (period: string): Date => {
  const basePeriod = period.replace(/-\d+$/, '')
  const [year, season] = basePeriod.split(' ')
  const month = season === 'Winter' ? 1 : season === 'Spring' ? 3 : season === 'Summer' ? 7 : 9
  return new Date(`${year}-${String(month).padStart(2, '0')}-01`)
}

export const LecturesTemplate = () => {
  const { showModal } = useStoreModal()
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{ role: string[]; school: string[]; year: string[] }>({
    role: [],
    school: [],
    year: [],
  })
  const [expandedYear, setExpandedYear] = useState<string | null>(null)

  // 데이터 로드
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/lectures.json`)
      .then((res) => res.json())
      .then((data) => {
        setLectures(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load lectures:', err)
        setLoading(false)
      })
  }, [])

  // 필터 옵션 추출
  const filterOptions = useMemo(() => {
    const roles = [...new Set(lectures.map((l) => l.role))].sort()
    const schools = [...new Set(lectures.map((l) => l.school))].sort()
    const years = [...new Set(lectures.flatMap((l) => l.periods.map((p) => p.split(' ')[0])))].sort((a, b) => Number(b) - Number(a))
    return { roles, schools, years }
  }, [lectures])

  // 강의를 개별 항목으로 확장
  const expandedLectures = useMemo(() => {
    const items: (Lecture & { course: Course; period: string })[] = []
    lectures.forEach((lecture) => {
      lecture.courses.forEach((course) => {
        items.push({
          ...lecture,
          course,
          period: lecture.periods[0].replace(/-\d+$/, ''),
        })
      })
    })
    return items
  }, [lectures])

  // 필터링 및 검색
  const filteredLectures = useMemo(() => {
    return expandedLectures.filter((item) => {
      // 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchText = `${item.role} ${item.school} ${item.course.en} ${item.course.ko}`.toLowerCase()
        if (!searchText.includes(query)) return false
      }
      // 역할 필터
      if (filters.role.length > 0 && !filters.role.includes(item.role)) return false
      // 학교 필터
      if (filters.school.length > 0 && !filters.school.includes(item.school)) return false
      // 연도 필터
      if (filters.year.length > 0) {
        const years = item.periods.map((p) => p.split(' ')[0])
        if (!years.some((y) => filters.year.includes(y))) return false
      }
      return true
    })
  }, [expandedLectures, searchQuery, filters])

  // 연도별 그룹화
  const lecturesByYear = useMemo(() => {
    const grouped: Record<string, typeof filteredLectures> = {}
    filteredLectures.forEach((item) => {
      const year = item.period.split(' ')[0]
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(item)
    })
    // 각 연도 내에서 시즌별 정렬
    Object.keys(grouped).forEach((year) => {
      grouped[year].sort((a, b) => seasonToDate(b.period).getTime() - seasonToDate(a.period).getTime())
    })
    return grouped
  }, [filteredLectures])

  const sortedYears = useMemo(() => {
    return Object.keys(lecturesByYear).sort((a, b) => Number(b) - Number(a))
  }, [lecturesByYear])

  // 연도별 통계
  const getYearStats = (year: string) => {
    const items = lecturesByYear[year] || []
    const lecturerCount = items.filter((l) => l.role === 'Lecturer').length
    const taCount = items.filter((l) => l.role === 'Teaching Assistant').length
    return { lecturer: lecturerCount, ta: taCount, total: items.length }
  }

  // 필터 변경 핸들러
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }))
  }

  const handleFilterReset = () => {
    setFilters({ role: [], school: [], year: [] })
    setSearchQuery('')
  }

  // 첫 번째 연도 자동 확장
  useEffect(() => {
    if (sortedYears.length > 0 && expandedYear === null) {
      setExpandedYear(sortedYears[0])
    }
  }, [sortedYears, expandedYear])

  return (
    <div className="flex flex-col bg-white">
      {/* Banner - 통일된 스타일 */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner3})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B04C]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B04C]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B04C]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Teaching
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B04C]/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Lectures
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
              <Home size={16} />
            </Link>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">Lectures</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-120">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 mb-24 md:mb-32">
          <div className="relative flex-1">
            <Search className="absolute left-14 top-1/2 -translate-y-1/2 size-18 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course, university, role..."
              className="w-full pl-44 pr-16 py-14 border border-gray-200 rounded-xl text-sm md:text-base focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() =>
              showModal({
                title: 'Filter Lectures',
                maxWidth: '500px',
                children: (
                  <FilterModal
                    filters={filters}
                    options={filterOptions}
                    onChange={handleFilterChange}
                    onReset={handleFilterReset}
                    onClose={() => {}}
                  />
                ),
              })
            }
            className="flex items-center justify-center gap-8 px-20 py-14 bg-gray-50 border border-gray-200 rounded-xl text-sm md:text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          >
            <SlidersHorizontal size={18} />
            Filters
            {(filters.role.length > 0 || filters.school.length > 0 || filters.year.length > 0) && (
              <span className="w-20 h-20 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {filters.role.length + filters.school.length + filters.year.length}
              </span>
            )}
          </button>
          <div className="px-12 md:px-16 py-12 md:py-16 bg-gray-50 border border-gray-100 rounded-xl text-sm md:text-base font-medium text-gray-500 text-center shrink-0">
            {filteredLectures.length} of {expandedLectures.length}
          </div>
        </div>

        {/* Year List */}
        {loading ? (
          <div className="bg-gray-50 rounded-2xl p-60 text-center">
            <p className="text-md text-gray-500">Loading lectures...</p>
          </div>
        ) : sortedYears.length > 0 ? (
          <div className="flex flex-col gap-16">
            {sortedYears.map((year) => {
              const stats = getYearStats(year)
              const items = lecturesByYear[year] || []
              const currentYear = new Date().getFullYear()
              const isCurrentYear = year === String(currentYear)

              return (
                <div key={year} className={clsx('border rounded-2xl overflow-hidden shadow-sm', isCurrentYear ? 'border-[#D6C360]' : 'border-gray-100')}>
                  <button
                    onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                    className={clsx(
                      'w-full flex items-center justify-between px-24 py-20 transition-colors',
                      isCurrentYear ? 'bg-[#FFF3CC] hover:bg-[#FFEB99]' : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex items-center gap-12">
                        <span className={clsx('text-lg font-semibold', isCurrentYear ? 'text-[#9A7D1F]' : 'text-gray-900')}>{year}</span>
                        {isCurrentYear && <span className="px-8 py-2 bg-[#D6B04C] text-white text-[10px] md:text-xs font-semibold rounded-full">NEW</span>}
                      </div>
                      <span className={clsx('text-base', isCurrentYear ? 'text-[#B8962D]' : 'text-gray-500')}>
                        {stats.lecturer} Lecturer · {stats.ta} Teaching Assistant
                      </span>
                    </div>
                    {expandedYear === year ? <ChevronUp className="size-20 text-gray-500" /> : <ChevronDown className="size-20 text-gray-500" />}
                  </button>

                  {expandedYear === year && (
                    <div className="flex flex-col">
                      {items.length === 0 ? (
                        <div className="p-32 md:p-40 text-center bg-white border-t border-gray-100">
                          <p className="text-sm md:text-base text-gray-500">등록된 강의가 없습니다.</p>
                        </div>
                      ) : (
                        items.map((item, idx) => {
                          const isLecturer = item.role === 'Lecturer'
                          return (
                            <div key={idx} className="p-20 md:p-24 bg-white border-t border-gray-100">
                              <div className="flex flex-col md:flex-row md:items-start gap-16 md:gap-20">
                                {/* Left: Role Badge */}
                                <div className="flex flex-col items-center shrink-0 w-60 md:w-80">
                                  <div
                                    className={clsx(
                                      'w-full py-8 md:py-10 rounded-lg text-center',
                                      isLecturer ? 'bg-[#D6B04C]' : 'bg-red-500'
                                    )}
                                  >
                                    <span className="text-xs md:text-sm font-bold text-white">{isLecturer ? 'L' : 'TA'}</span>
                                  </div>
                                </div>

                                {/* Middle: Content */}
                                <div className="flex-1 min-w-0">
                                  {/* School & Role Badges */}
                                  <div className="flex flex-wrap gap-6 mb-8">
                                    <span
                                      className={clsx(
                                        'px-8 py-4 rounded-md text-[10px] md:text-xs font-bold border',
                                        isLecturer ? 'bg-white text-[#D6B04C] border-[#FFF9E6]0' : 'bg-white text-red-600 border-red-500'
                                      )}
                                    >
                                      {item.school}
                                    </span>
                                    <span
                                      className={clsx(
                                        'px-8 py-4 rounded-md text-[10px] md:text-xs font-bold',
                                        isLecturer ? 'bg-[#FFF3CC] text-[#B8962D]' : 'bg-red-100 text-red-700'
                                      )}
                                    >
                                      {item.role}
                                    </span>
                                  </div>

                                  {/* Periods */}
                                  <div className="flex flex-wrap gap-4 mb-10">
                                    {item.periods.map((period, pIdx) => (
                                      <span key={pIdx} className="px-8 py-4 bg-gray-100 border border-gray-200 rounded-md text-[10px] md:text-xs font-medium text-gray-600">
                                        {period}
                                      </span>
                                    ))}
                                  </div>

                                  {/* Course Title */}
                                  <h4 className="text-sm md:text-base font-bold text-gray-900 leading-relaxed">{item.course.en}</h4>
                                  <p className="text-xs md:text-sm text-gray-500 mt-4">{item.course.ko}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-60 text-center">
            <p className="text-md text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default memo(LecturesTemplate)
