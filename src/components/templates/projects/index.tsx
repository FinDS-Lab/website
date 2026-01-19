import { memo, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Home, Search, SlidersHorizontal, ChevronDown, ChevronUp, Building2, Landmark, GraduationCap, Briefcase } from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import clsx from 'clsx'

// Image Imports
import banner3 from '@/assets/images/banner/3.webp'

// Types
type Project = {
  titleEn: string
  titleKo: string
  period: string
  fundingAgency: string
  fundingAgencyKo?: string
  amount: string
  type: 'government' | 'industry' | 'institution' | 'academic'
  roles: {
    principalInvestigator?: string
    leadResearcher?: string
    researchers?: string[]
  }
}

// 프로젝트 타입 설정
const projectTypes = {
  government: { label: 'Government', color: 'bg-blue-500', bgLight: 'bg-blue-50', textColor: 'text-blue-700', icon: Landmark },
  industry: { label: 'Industry', color: 'bg-emerald-500', bgLight: 'bg-emerald-50', textColor: 'text-emerald-700', icon: Building2 },
  institution: { label: 'Institution', color: 'bg-purple-500', bgLight: 'bg-purple-50', textColor: 'text-purple-700', icon: GraduationCap },
  academic: { label: 'Academic', color: 'bg-orange-500', bgLight: 'bg-orange-50', textColor: 'text-orange-700', icon: Briefcase },
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
    type: string[]
    year: string[]
  }
  options: {
    types: string[]
    years: string[]
  }
  onChange: (key: keyof typeof filters, value: string) => void
  onReset: () => void
  onClose: () => void
}) => {
  const sections = [
    { key: 'type' as const, label: 'Project Type', items: options.types },
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

// 기간에서 시작 연도 추출
const getStartYear = (period: string): string => {
  const match = period.match(/^(\d{4})/)
  return match ? match[1] : ''
}

// 기간에서 날짜로 변환 (정렬용)
const periodToDate = (period: string): Date => {
  const match = period.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return new Date(`${match[1]}-${match[2]}-${match[3]}`)
  }
  return new Date()
}

export const ProjectsTemplate = () => {
  const { showModal } = useStoreModal()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{ type: string[]; year: string[] }>({
    type: [],
    year: [],
  })
  const [expandedYear, setExpandedYear] = useState<string | null>(null)

  // 데이터 로드
  useEffect(() => {
    fetch('/website/data/projects.json')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load projects:', err)
        setLoading(false)
      })
  }, [])

  // 필터 옵션 추출
  const filterOptions = useMemo(() => {
    const types = [...new Set(projects.map((p) => projectTypes[p.type]?.label || p.type))].sort()
    const years = [...new Set(projects.map((p) => getStartYear(p.period)))].filter(Boolean).sort((a, b) => Number(b) - Number(a))
    return { types, years }
  }, [projects])

  // 필터링 및 검색
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchText = `${project.titleEn} ${project.titleKo} ${project.fundingAgency} ${project.fundingAgencyKo || ''}`.toLowerCase()
        if (!searchText.includes(query)) return false
      }
      // 타입 필터
      if (filters.type.length > 0) {
        const typeLabel = projectTypes[project.type]?.label || project.type
        if (!filters.type.includes(typeLabel)) return false
      }
      // 연도 필터
      if (filters.year.length > 0) {
        const year = getStartYear(project.period)
        if (!filters.year.includes(year)) return false
      }
      return true
    })
  }, [projects, searchQuery, filters])

  // 연도별 그룹화
  const projectsByYear = useMemo(() => {
    const grouped: Record<string, Project[]> = {}
    filteredProjects.forEach((project) => {
      const year = getStartYear(project.period)
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(project)
    })
    // 각 연도 내에서 날짜별 정렬 (최신순)
    Object.keys(grouped).forEach((year) => {
      grouped[year].sort((a, b) => periodToDate(b.period).getTime() - periodToDate(a.period).getTime())
    })
    return grouped
  }, [filteredProjects])

  const sortedYears = useMemo(() => {
    return Object.keys(projectsByYear).sort((a, b) => Number(b) - Number(a))
  }, [projectsByYear])

  // 연도별 통계
  const getYearStats = (year: string) => {
    const items = projectsByYear[year] || []
    const stats = {
      government: items.filter((p) => p.type === 'government').length,
      industry: items.filter((p) => p.type === 'industry').length,
      institution: items.filter((p) => p.type === 'institution').length,
      academic: items.filter((p) => p.type === 'academic').length,
      total: items.length,
    }
    return stats
  }

  // 필터 변경 핸들러
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }))
  }

  const handleFilterReset = () => {
    setFilters({ type: [], year: [] })
    setSearchQuery('')
  }

  // 첫 번째 연도 자동 확장
  useEffect(() => {
    if (sortedYears.length > 0 && expandedYear === null) {
      setExpandedYear(sortedYears[0])
    }
  }, [sortedYears, expandedYear])

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-200 md:h-332 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner3})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-2xl md:text-[36px] font-semibold text-white text-center">Projects</h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-20 md:py-40">
        <div className="flex items-center gap-8 md:gap-10 flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            <Home size={16} />
          </Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-primary font-medium">Projects</span>
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
              placeholder="Search by project title, funding agency..."
              className="w-full pl-44 pr-16 py-14 border border-gray-200 rounded-xl text-sm md:text-base focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() =>
              showModal({
                title: 'Filter Projects',
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
            {(filters.type.length > 0 || filters.year.length > 0) && (
              <span className="w-20 h-20 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {filters.type.length + filters.year.length}
              </span>
            )}
          </button>
          <div className="px-12 md:px-16 py-12 md:py-16 bg-gray-50 border border-gray-100 rounded-xl text-sm md:text-base font-medium text-gray-500 text-center shrink-0">
            {filteredProjects.length} of {projects.length}
          </div>
        </div>

        {/* Year List */}
        {loading ? (
          <div className="bg-gray-50 rounded-2xl p-60 text-center">
            <p className="text-md text-gray-500">Loading projects...</p>
          </div>
        ) : sortedYears.length > 0 ? (
          <div className="flex flex-col gap-16">
            {sortedYears.map((year) => {
              const stats = getYearStats(year)
              const items = projectsByYear[year] || []
              const currentYear = new Date().getFullYear()
              const isCurrentYear = year === String(currentYear)

              return (
                <div key={year} className={clsx('border rounded-2xl overflow-hidden shadow-sm', isCurrentYear ? 'border-amber-300' : 'border-gray-100')}>
                  <button
                    onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                    className={clsx(
                      'w-full flex items-center justify-between px-24 py-20 transition-colors',
                      isCurrentYear ? 'bg-amber-100 hover:bg-amber-200' : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex items-center gap-12">
                        <span className={clsx('text-lg font-semibold', isCurrentYear ? 'text-amber-800' : 'text-gray-900')}>{year}</span>
                        {isCurrentYear && <span className="px-8 py-2 bg-amber-500 text-white text-[10px] md:text-xs font-semibold rounded-full">NEW</span>}
                      </div>
                      <span className={clsx('text-sm md:text-base', isCurrentYear ? 'text-amber-700' : 'text-gray-500')}>
                        {stats.government > 0 && `${stats.government} Government`}
                        {stats.industry > 0 && ` · ${stats.industry} Industry`}
                        {stats.institution > 0 && ` · ${stats.institution} Institution`}
                        {stats.academic > 0 && ` · ${stats.academic} Academic`}
                      </span>
                    </div>
                    {expandedYear === year ? <ChevronUp className="size-20 text-gray-500" /> : <ChevronDown className="size-20 text-gray-500" />}
                  </button>

                  {expandedYear === year && (
                    <div className="flex flex-col">
                      {items.length === 0 ? (
                        <div className="p-32 md:p-40 text-center bg-white border-t border-gray-100">
                          <p className="text-sm md:text-base text-gray-500">등록된 프로젝트가 없습니다.</p>
                        </div>
                      ) : (
                        items.map((project, idx) => {
                          const typeConfig = projectTypes[project.type]
                          const TypeIcon = typeConfig?.icon || Briefcase

                          return (
                            <div key={idx} className="p-20 md:p-24 bg-white border-t border-gray-100">
                              <div className="flex flex-col md:flex-row md:items-start gap-16 md:gap-20">
                                {/* Left: Type Badge */}
                                <div className="flex flex-col items-center shrink-0 w-70 md:w-90">
                                  <div className={clsx('w-full py-6 md:py-8 rounded-t-lg text-center', typeConfig?.color || 'bg-gray-500')}>
                                    <span className="text-[9px] md:text-xs font-semibold text-white uppercase tracking-wide">{typeConfig?.label || project.type}</span>
                                  </div>
                                  <div className={clsx('w-full py-8 md:py-12 rounded-b-lg flex items-center justify-center', typeConfig?.bgLight || 'bg-gray-100')}>
                                    <TypeIcon className={clsx('size-20 md:size-24', typeConfig?.textColor || 'text-gray-600')} />
                                  </div>
                                </div>

                                {/* Middle: Content */}
                                <div className="flex-1 min-w-0">
                                  {/* Funding Agency */}
                                  <div className="flex flex-wrap gap-6 mb-8">
                                    <span className={clsx('px-8 py-4 rounded-md text-[10px] md:text-xs font-bold border', typeConfig?.bgLight, typeConfig?.textColor)}>
                                      {project.fundingAgency}
                                    </span>
                                    {project.amount && project.amount !== 'N/A' && (
                                      <span className="px-8 py-4 bg-gray-100 border border-gray-200 rounded-md text-[10px] md:text-xs font-medium text-gray-600">
                                        {project.amount}
                                      </span>
                                    )}
                                  </div>

                                  {/* Project Title */}
                                  <h4 className="text-sm md:text-base font-bold text-gray-900 leading-relaxed mb-6">{project.titleEn}</h4>
                                  <p className="text-xs md:text-sm text-gray-500 mb-10">{project.titleKo}</p>

                                  {/* Roles */}
                                  <div className="flex flex-wrap gap-4 text-[10px] md:text-xs text-gray-500">
                                    {project.roles.principalInvestigator && (
                                      <span>
                                        <strong className="text-gray-700">PI:</strong> {project.roles.principalInvestigator}
                                      </span>
                                    )}
                                    {project.roles.leadResearcher && (
                                      <span>
                                        <strong className="text-gray-700">Lead:</strong> {project.roles.leadResearcher}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Period */}
                                <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                                  <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">{project.period}</span>
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

export default memo(ProjectsTemplate)
