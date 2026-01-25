import {memo, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Home, Calendar, Building2, Landmark, GraduationCap, Briefcase, ChevronDown, ChevronUp, Folder, TrendingUp, SlidersHorizontal, X, Search, CheckCircle, Factory} from 'lucide-react'
import banner4 from '@/assets/images/banner/4.webp'

type Project = {
  titleEn: string
  titleKo: string
  period: string
  fundingAgency: string
  fundingAgencyKo: string
  amount?: string
  type: 'government' | 'industry' | 'institution' | 'academic'
  roles: {
    principalInvestigator?: string
    leadResearcher?: string
    researchers?: string[]
  }
}

const typeConfig = {
  government: {
    icon: Landmark,
    label: 'Government',
    labelShort: 'Gov.',
    labelPlural: 'Government Projects',
    labelKo: '정부과제',
    color: 'bg-[rgb(172,14,14)]',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-[rgb(172,14,14)]',
  },
  industry: {
    icon: Building2,
    label: 'Industry',
    labelShort: 'Ind.',
    labelPlural: 'Industry Projects',
    labelKo: '산업체과제',
    color: 'bg-[rgb(214, 176, 76)]',
    bgColor: 'bg-[#FFF9E6]',
    borderColor: 'border-[#FFEB99]',
    textColor: 'text-[rgb(214, 176, 76)]',
  },
  institution: {
    icon: GraduationCap,
    label: 'Institution',
    labelShort: 'Inst.',
    labelPlural: 'Institution Projects',
    labelKo: '기관과제',
    color: 'bg-[#FFBAC4]',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-500',
  },
  academic: {
    icon: Briefcase,
    label: 'Research',
    labelShort: 'Res.',
    labelPlural: 'Research Projects',
    labelKo: '연구과제',
    color: 'bg-[#D6B14D]',
    bgColor: 'bg-[#FFF9E6]',
    borderColor: 'border-[#FFEB99]',
    textColor: 'text-[#B8962D]',
  },
}

// Filter Modal Component
const FilterModal = ({
  filters,
  onChange,
  onReset,
  onClose,
}: {
  filters: { type: string[]; status: string[] }
  onChange: (key: 'type' | 'status', value: string) => void
  onReset: () => void
  onClose: () => void
}) => {
  const typeOptions = ['government', 'industry', 'institution', 'academic']
  const statusOptions = ['ongoing', 'completed']

  return (
    <div className="flex flex-col gap-20 p-20">
      {/* Type Filter */}
      <div className="flex flex-col gap-12">
        <h4 className="text-base font-bold text-gray-900">Type</h4>
        <div className="flex flex-wrap gap-8">
          {typeOptions.map((type) => {
            const config = typeConfig[type as keyof typeof typeConfig]
            const isActive = filters.type.includes(type)
            return (
              <button
                key={type}
                onClick={() => onChange('type', type)}
                className={`flex items-center gap-6 px-12 py-8 rounded-lg text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-[#7f8894] border-[#f0f0f0] hover:border-primary/30 hover:bg-gray-50'
                }`}
              >
                <config.icon size={14} />
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-12">
        <h4 className="text-base font-bold text-gray-900">Status</h4>
        <div className="flex flex-wrap gap-8">
          {statusOptions.map((status) => {
            const isActive = filters.status.includes(status)
            return (
              <button
                key={status}
                onClick={() => onChange('status', status)}
                className={`px-12 py-8 rounded-lg text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-[#7f8894] border-[#f0f0f0] hover:border-primary/30 hover:bg-gray-50'
                }`}
              >
                {status === 'ongoing' ? 'Ongoing' : 'Completed'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-16 border-t border-gray-100">
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Reset All
        </button>
        <button
          onClick={onClose}
          className="px-16 py-8 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export const ProjectsTemplate = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedYear, setExpandedYear] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{ type: string[]; status: string[] }>({
    type: [],
    status: [],
  })

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/projects.json`)
      .then((res) => res.json())
      .then((data: Project[]) => {
        // 2025년 6월 14일 이후 시작된 프로젝트만 표시
        const cutoffDate = new Date('2025-06-14')
        
        const filteredProjects = data.filter((p) => {
          const periodParts = p.period.split('–')
          const startDateStr = periodParts[0].trim()
          const startDate = new Date(startDateStr)
          return startDate >= cutoffDate
        })
        setProjects(filteredProjects)
        setLoading(false)
        
        if (filteredProjects.length > 0) {
          const years = [...new Set(filteredProjects.map(p => p.period.split('–')[0].trim().slice(0, 4)))]
          years.sort((a, b) => parseInt(b) - parseInt(a))
          setExpandedYear(years[0])
        }
      })
      .catch((err) => {
        console.error('Failed to load projects:', err)
        setLoading(false)
      })
  }, [])

  const handleFilterChange = (key: 'type' | 'status', value: string) => {
    setFilters((prev) => {
      const current = prev[key]
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: updated }
    })
  }

  const handleFilterReset = () => {
    setFilters({ type: [], status: [] })
  }

  const getProjectStatus = (period: string): 'ongoing' | 'completed' => {
    const periodParts = period.split('–')
    const endDateStr = periodParts[1]?.trim() || periodParts[0].trim()
    const endDate = new Date(endDateStr)
    const today = new Date()
    return endDate >= today ? 'ongoing' : 'completed'
  }

  const filteredProjects = projects.filter((p) => {
    if (filters.type.length > 0 && !filters.type.includes(p.type)) return false
    if (filters.status.length > 0) {
      const status = getProjectStatus(p.period)
      if (!filters.status.includes(status)) return false
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = p.titleEn.toLowerCase().includes(query) || p.titleKo.toLowerCase().includes(query)
      const matchesFunding = p.fundingAgency.toLowerCase().includes(query) || p.fundingAgencyKo.toLowerCase().includes(query)
      const matchesPeriod = p.period.includes(query)
      if (!matchesTitle && !matchesFunding && !matchesPeriod) return false
    }
    return true
  })

  const projectsByYear = filteredProjects.reduce((acc, project) => {
    const year = project.period.split('–')[0].trim().slice(0, 4)
    if (!acc[year]) acc[year] = []
    acc[year].push(project)
    return acc
  }, {} as Record<string, Project[]>)

  const years = Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a))
  const currentYear = new Date().getFullYear().toString()

  const stats = {
    total: projects.length,
    ongoing: projects.filter(p => getProjectStatus(p.period) === 'ongoing').length,
    completed: projects.filter(p => getProjectStatus(p.period) === 'completed').length,
    government: projects.filter(p => p.type === 'government').length,
    industry: projects.filter(p => p.type === 'industry').length,
    institution: projects.filter(p => p.type === 'institution').length,
    academic: projects.filter(p => p.type === 'academic').length,
  }

  const hasActiveFilters = filters.type.length > 0 || filters.status.length > 0 || searchQuery.trim() !== ''

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{backgroundImage: `url(${banner4})`}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B14D]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B14D]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B14D]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Research
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Projects
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
            <span className="text-sm text-gray-400 font-medium">Research</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">Projects</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-40 md:py-60 pb-60 md:pb-80 px-16 md:px-20">
        <div className="max-w-1480 mx-auto flex flex-col gap-24 md:gap-40">
          
          {/* Statistics Section - Publications Style */}
          <div className="flex flex-col gap-16 md:gap-24">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
              <span className="w-8 h-8 rounded-full bg-primary" />
              Statistics
            </h3>
            
            {/* Total - Full Width */}
            <div className="group relative bg-[#FFF9E6] border border-[#D6B14D]/20 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#D6B14D'}}>{stats.total}</span>
                <div className="flex items-center gap-6">
                  <Folder className="size-14 md:size-16" style={{color: '#D6B14D', opacity: 0.7}} />
                  <span className="text-xs md:text-sm font-medium text-gray-600">Total</span>
                </div>
              </div>
            </div>

            {/* Type Stats - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#D6B14D'}}>{stats.government}</span>
                  <div className="flex items-center gap-6">
                    <Landmark className="size-14 md:size-16 text-gray-400" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">
                      <span className="hidden sm:inline">{stats.government === 1 ? 'Government' : 'Government'}</span>
                      <span className="sm:hidden">Gov.</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold mb-4 text-primary">{stats.industry}</span>
                  <div className="flex items-center gap-6">
                    <Factory className="size-14 md:size-16 text-gray-400" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">
                      <span className="hidden sm:inline">{stats.industry === 1 ? 'Industry' : 'Industry'}</span>
                      <span className="sm:hidden">Ind.</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#E8D688'}}>{stats.institution}</span>
                  <div className="flex items-center gap-6">
                    <Building2 className="size-14 md:size-16 text-gray-400" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">
                      <span className="hidden sm:inline">{stats.institution === 1 ? 'Institution' : 'Institution'}</span>
                      <span className="sm:hidden">Inst.</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: '#FFBAC4'}}>{stats.academic}</span>
                  <div className="flex items-center gap-6">
                    <GraduationCap className="size-14 md:size-16 text-gray-400" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">
                      <span className="hidden sm:inline">{stats.academic === 1 ? 'Research' : 'Research'}</span>
                      <span className="sm:hidden">Res.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Stats - 2 columns (ON/OFF style) */}
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{stats.ongoing}</span>
                  <div className="flex items-center gap-6">
                    <TrendingUp className="size-14 md:size-16 text-gray-600" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">Ongoing</span>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold mb-4 text-gray-500">{stats.completed}</span>
                  <div className="flex items-center gap-6">
                    <CheckCircle className="size-14 md:size-16 text-gray-500" />
                    <span className="text-xs md:text-sm font-medium text-gray-500">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter & Search - Matching Publications Style Exactly */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-12 md:gap-20 relative z-30">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-full sm:w-auto flex items-center justify-center gap-8 px-12 md:px-16 py-12 md:py-16 border rounded-xl text-sm md:text-base transition-all ${
                  isFilterOpen || filters.type.length > 0 || filters.status.length > 0
                    ? 'bg-primary/5 border-primary text-primary font-medium'
                    : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                Filters
                <SlidersHorizontal className="size-16 md:size-20" />
              </button>

              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute top-[calc(100%+12px)] left-0 w-[calc(100vw-32px)] sm:w-[400px] max-w-[calc(100vw-32px)] bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <FilterModal
                      filters={filters}
                      onChange={handleFilterChange}
                      onReset={handleFilterReset}
                      onClose={() => setIsFilterOpen(false)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 flex items-center px-12 md:px-16 py-12 md:py-16 bg-white border border-gray-100 rounded-xl focus-within:border-primary transition-colors">
              <input
                type="text"
                placeholder="Search by title, funding agency..."
                className="flex-1 text-sm md:text-base text-gray-700 outline-none min-w-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                  }
                }}
              />
              <Search className="size-16 md:size-20 text-gray-500 shrink-0 ml-8" />
            </div>
            <div className="px-12 md:px-16 py-12 md:py-16 bg-gray-50 border border-gray-100 rounded-xl text-sm md:text-base font-medium text-gray-500 text-center shrink-0">
              {filteredProjects.length} of {projects.length}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-8 -mt-8">
              {filters.type.map((type) => {
                const config = typeConfig[type as keyof typeof typeConfig]
                return (
                  <span
                    key={type}
                    className={`flex items-center gap-6 px-12 py-6 ${config.bgColor} ${config.textColor} text-sm font-medium rounded-full`}
                  >
                    {config.label}
                    <button onClick={() => handleFilterChange('type', type)} className="hover:opacity-70">
                      <X size={14} />
                    </button>
                  </span>
                )
              })}
              {filters.status.map((status) => (
                <span
                  key={status}
                  className={`flex items-center gap-6 px-12 py-6 text-sm font-medium rounded-full ${
                    status === 'ongoing' ? 'bg-[#FFF3CC] text-[#B8962D]' : 'bg-pink-100 text-[#E8889C]'
                  }`}
                >
                  {status === 'ongoing' ? 'Ongoing' : 'Completed'}
                  <button onClick={() => handleFilterChange('status', status)} className="hover:opacity-70">
                    <X size={14} />
                  </button>
                </span>
              ))}
              <button
                onClick={handleFilterReset}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Projects by Year */}
          <div className="flex flex-col gap-12 md:gap-20">
            {loading ? (
              <div className="text-center py-40">
                <p className="text-gray-400 animate-pulse">Loading projects...</p>
              </div>
            ) : years.length === 0 ? (
              <div className="text-center py-40 bg-gray-50 rounded-2xl">
                <p className="text-gray-400">No projects found.</p>
              </div>
            ) : (
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                {years.map((year) => {
                  const yearProjects = projectsByYear[year]
                  const isCurrentYear = year === currentYear
                  const isExpanded = expandedYear === year
                  
                  // Type별 개수 계산
                  const yearStats = {
                    government: yearProjects.filter(p => p.type === 'government').length,
                    industry: yearProjects.filter(p => p.type === 'industry').length,
                    institution: yearProjects.filter(p => p.type === 'institution').length,
                    academic: yearProjects.filter(p => p.type === 'academic').length,
                  }

                  return (
                    <div key={year}>
                      <button
                        onClick={() => setExpandedYear(isExpanded ? null : year)}
                        className={`w-full flex items-center justify-between px-20 md:px-32 py-16 md:py-24 border-b border-gray-100 last:border-b-0 transition-colors ${
                          isCurrentYear
                            ? 'bg-gradient-to-r from-[#FFF9E6] to-[#FFF3CC]/50 hover:from-[#FFF3CC] hover:to-[#FFF3CC]/70'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-12 md:gap-[16px] flex-wrap">
                          <span className={`text-lg md:text-[20px] font-bold ${isCurrentYear ? 'text-[#9A7D1F]' : 'text-gray-800'}`}>{year}</span>
                          {isCurrentYear && (
                            <span className="px-8 py-2 bg-[#D6B14D] text-white text-[10px] md:text-xs font-semibold rounded-full">NEW</span>
                          )}
                          {/* White badge with counts - PC: Full name with "Project" */}
                          <span className="hidden sm:inline-flex px-10 md:px-12 py-4 md:py-5 bg-white rounded-full text-[10px] md:text-xs font-medium shadow-sm">
                            <span className="font-bold" style={{color: '#D6B14D'}}>{yearStats.government}</span>
                            <span className="text-gray-500">&nbsp;Government {yearStats.government === 1 ? 'Project' : 'Projects'}</span>
                            <span className="text-gray-300">&nbsp;·&nbsp;</span>
                            <span className="font-bold text-primary">{yearStats.industry}</span>
                            <span className="text-gray-500">&nbsp;Industry {yearStats.industry === 1 ? 'Project' : 'Projects'}</span>
                            <span className="text-gray-300">&nbsp;·&nbsp;</span>
                            <span className="font-bold" style={{color: '#E8D688'}}>{yearStats.institution}</span>
                            <span className="text-gray-500">&nbsp;Institution {yearStats.institution === 1 ? 'Project' : 'Projects'}</span>
                            <span className="text-gray-300">&nbsp;·&nbsp;</span>
                            <span className="font-bold" style={{color: '#FFBAC4'}}>{yearStats.academic}</span>
                            <span className="text-gray-500">&nbsp;Research {yearStats.academic === 1 ? 'Project' : 'Projects'}</span>
                          </span>
                          {/* Mobile: 1-line format with abbreviations */}
                          <span className="sm:hidden inline-flex px-8 py-4 bg-white rounded-full text-[9px] font-medium shadow-sm">
                            <span className="font-bold" style={{color: '#D6B14D'}}>{yearStats.government}</span>
                            <span className="text-gray-500">&nbsp;Gov.</span>
                            <span className="text-gray-300">&nbsp;·&nbsp;</span>
                            <span className="font-bold text-primary">{yearStats.industry}</span>
                            <span className="text-gray-500">&nbsp;Ind.</span>
                            <span className="text-gray-300">&nbsp;·&nbsp;</span>
                            <span className="font-bold" style={{color: '#E8D688'}}>{yearStats.institution}</span>
                            <span className="text-gray-500">&nbsp;Inst.</span>
                            <span className="text-gray-300">&nbsp;·&nbsp;</span>
                            <span className="font-bold" style={{color: '#FFBAC4'}}>{yearStats.academic}</span>
                            <span className="text-gray-500">&nbsp;Res.</span>
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-100 divide-y divide-gray-50">
                          {yearProjects.map((project, idx) => {
                            const config = typeConfig[project.type]
                            const Icon = config?.icon || Briefcase
                            const status = getProjectStatus(project.period)
                            
                            const typeColors: Record<string, string> = {
                              government: 'bg-[#D6B14D]',
                              industry: 'bg-primary',
                              institution: 'bg-[#E8D688]',
                              academic: 'bg-[#FFBAC4]',
                            }
                            
                            const typeTextColors: Record<string, string> = {
                              government: 'text-white',
                              industry: 'text-white',
                              institution: 'text-gray-800',
                              academic: 'text-gray-800',
                            }
                            
                            // Filter out empty researchers
                            const filteredResearchers = project.roles.researchers?.filter(
                              r => r && r !== project.roles.principalInvestigator && r !== project.roles.leadResearcher
                            ) || []
                            
                            return (
                              <div key={idx} className="relative hover:bg-gray-50/50 transition-all overflow-hidden">
                                {/* Mobile: Full-width top bar */}
                                <div className="md:hidden flex items-center justify-between px-12 py-8 border-b border-gray-50" style={{
                                  background: project.type === 'government' ? 'linear-gradient(135deg, #D6B14D 0%, #E8D688 100%)' :
                                    project.type === 'industry' ? 'linear-gradient(135deg, #AC0E0E 0%, #D6A076 100%)' :
                                    project.type === 'institution' ? 'linear-gradient(135deg, #E8D688 0%, #F5EBC7 100%)' :
                                    project.type === 'academic' ? 'linear-gradient(135deg, #FFBAC4 0%, #FFE4E8 100%)' :
                                    'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'
                                }}>
                                  <div className="flex items-center gap-8">
                                    {/* Type Label */}
                                    <span className={`text-[11px] font-bold tracking-wide ${
                                      project.type === 'institution' || project.type === 'academic' ? 'text-gray-800' : 'text-white'
                                    }`}>
                                      {config?.labelShort || project.type}
                                    </span>
                                  </div>
                                  {/* Right side: Status badge */}
                                  <span className={`px-8 py-3 rounded text-[9px] font-bold ${
                                    status === 'ongoing' ? 'bg-white/90 text-[#D6B14D]' : 'bg-white/70 text-gray-500'
                                  }`}>
                                    {status === 'ongoing' ? 'Ongoing' : 'Completed'}
                                  </span>
                                </div>
                                
                                <div className="p-16 md:p-24">
                                <div className="flex flex-row items-start gap-12 md:gap-20">
                                  {/* Left: Type Badge - White background style matching Honors */}
                                  <div className="hidden md:flex flex-col items-center shrink-0 w-72">
                                    <div className={`w-full py-8 rounded-lg text-center bg-white border-2 shadow-sm ${
                                      project.type === 'government' ? 'border-[#D6B14D]' :
                                      project.type === 'industry' ? 'border-primary' :
                                      project.type === 'institution' ? 'border-[#E8D688]' :
                                      project.type === 'academic' ? 'border-[#FFBAC4]' : 'border-gray-300'
                                    }`}>
                                      <Icon size={18} className={`inline mb-2 ${
                                        project.type === 'government' ? 'text-[#D6B14D]' :
                                        project.type === 'industry' ? 'text-primary' :
                                        project.type === 'institution' ? 'text-[#B8962D]' :
                                        project.type === 'academic' ? 'text-[#E8889C]' : 'text-gray-500'
                                      }`} />
                                      <span className={`block text-[10px] font-bold tracking-wide ${
                                        project.type === 'government' ? 'text-[#D6B14D]' :
                                        project.type === 'industry' ? 'text-primary' :
                                        project.type === 'institution' ? 'text-[#B8962D]' :
                                        project.type === 'academic' ? 'text-[#E8889C]' : 'text-gray-500'
                                      }`}>
                                        {config?.label || project.type} Project
                                      </span>
                                    </div>
                                    <div className={`w-full mt-4 py-4 text-center rounded-md ${
                                      status === 'ongoing' ? 'bg-[#FFF9E6] border border-[#FFEB99]' : 'bg-gray-50 border border-gray-200'
                                    }`}>
                                      <span className={`text-[9px] font-bold ${
                                        status === 'ongoing' ? 'text-[#D6B14D]' : 'text-gray-400'
                                      }`}>
                                        {status === 'ongoing' ? 'Ongoing' : 'Completed'}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    {/* Title + Period (Desktop: Period on right) */}
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-16">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm md:text-md font-bold text-gray-900 leading-relaxed">{project.titleKo}</p>
                                        <p className="text-xs md:text-sm text-gray-600 mt-4 leading-relaxed">{project.titleEn}</p>
                                      </div>
                                      {/* Period Badge - white background, right aligned */}
                                      <span className="hidden md:inline-flex items-center px-10 py-4 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 shadow-sm shrink-0 whitespace-nowrap">
                                        {project.period}
                                      </span>
                                    </div>
                                    
                                    {/* Funding Agency */}
                                    <div className="flex flex-wrap items-center gap-8 mt-8">
                                      <p className="text-xs md:text-sm text-gray-700 font-bold">
                                        {project.fundingAgency}
                                      </p>
                                    </div>
                                    
                                    {/* Mobile: Date below FundingAgency - same as Publications */}
                                    <p className="md:hidden text-[11px] text-gray-400 font-medium mt-4">
                                      {project.period}
                                    </p>
                                    
                                    {/* Roles - only show non-empty roles */}
                                    {(project.roles.principalInvestigator || project.roles.leadResearcher || filteredResearchers.length > 0) && (
                                      <div className="mt-12 pt-12 border-t border-gray-100">
                                        <div className="flex flex-col gap-6">
                                          {/* Principal Investigator - only show if exists */}
                                          {project.roles.principalInvestigator && (
                                            <div className="flex items-center gap-8">
                                              <span className="shrink-0 w-auto min-w-[100px] md:min-w-[140px] px-8 py-3 bg-gray-900 text-white text-[9px] md:text-[10px] font-bold rounded-md text-center">
                                                Principal Investigator
                                              </span>
                                              <span className="text-[10px] md:text-xs text-gray-700 font-medium">
                                                {project.roles.principalInvestigator}
                                              </span>
                                            </div>
                                          )}
                                          
                                          {/* Lead Researcher - only show if exists and different from PI */}
                                          {project.roles.leadResearcher && project.roles.leadResearcher !== project.roles.principalInvestigator && (
                                            <div className="flex items-center gap-8">
                                              <span className="shrink-0 w-auto min-w-[100px] md:min-w-[140px] px-8 py-3 bg-gray-600 text-white text-[9px] md:text-[10px] font-bold rounded-md text-center">
                                                Lead Researcher
                                              </span>
                                              <span className="text-[10px] md:text-xs text-gray-700 font-medium">
                                                {project.roles.leadResearcher}
                                              </span>
                                            </div>
                                          )}
                                          
                                          {/* Researchers - only show if non-empty filtered list */}
                                          {filteredResearchers.length > 0 && (
                                            <div className="flex items-center gap-8">
                                              <span className="shrink-0 w-auto min-w-[100px] md:min-w-[140px] px-8 py-3 bg-gray-400 text-white text-[9px] md:text-[10px] font-bold rounded-md text-center">
                                                Researcher
                                              </span>
                                              <span className="text-[10px] md:text-xs text-gray-700 font-medium">
                                                {filteredResearchers.join(', ')}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default memo(ProjectsTemplate)
