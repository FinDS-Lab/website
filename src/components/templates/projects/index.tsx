import {memo, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Home, Calendar, Building2, Landmark, GraduationCap, Briefcase, ChevronDown, ChevronUp, Folder, TrendingUp} from 'lucide-react'
import banner2 from '@/assets/images/banner/2.webp'

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
    labelKo: '정부',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  industry: {
    icon: Building2,
    label: 'Industry',
    labelKo: '산업체',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  institution: {
    icon: GraduationCap,
    label: 'Institution',
    labelKo: '기관',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
  },
  academic: {
    icon: Briefcase,
    label: 'Academic',
    labelKo: '학술',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
}

export const ProjectsTemplate = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [expandedYear, setExpandedYear] = useState<string | null>(null)

  useEffect(() => {
    fetch('/website/data/projects.json')
      .then((res) => res.json())
      .then((data: Project[]) => {
        const cutoffDate = new Date('2025-06-14')
        
        const piProjects = data.filter((p) => {
          if (p.roles.principalInvestigator !== '최인수') return false
          const periodParts = p.period.split('–')
          const endDateStr = periodParts[1]?.trim() || periodParts[0].trim()
          const endDate = new Date(endDateStr)
          return endDate >= cutoffDate
        })
        setProjects(piProjects)
        setLoading(false)
        
        // Auto-expand the most recent year
        if (piProjects.length > 0) {
          const years = [...new Set(piProjects.map(p => p.period.split('–')[0].trim().slice(0, 4)))]
          years.sort((a, b) => parseInt(b) - parseInt(a))
          setExpandedYear(years[0])
        }
      })
      .catch((err) => {
        console.error('Failed to load projects:', err)
        setLoading(false)
      })
  }, [])

  const filteredProjects = selectedType === 'all' 
    ? projects 
    : projects.filter(p => p.type === selectedType)

  // Group projects by year
  const projectsByYear = filteredProjects.reduce((acc, project) => {
    const year = project.period.split('–')[0].trim().slice(0, 4)
    if (!acc[year]) acc[year] = []
    acc[year].push(project)
    return acc
  }, {} as Record<string, Project[]>)

  const years = Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a))
  const currentYear = new Date().getFullYear().toString()

  // Statistics
  const stats = {
    total: projects.length,
    government: projects.filter(p => p.type === 'government').length,
    industry: projects.filter(p => p.type === 'industry').length,
    institution: projects.filter(p => p.type === 'institution').length,
    academic: projects.filter(p => p.type === 'academic').length,
  }

  const statisticsItems = [
    { icon: Folder, label: 'Total', count: stats.total },
    { icon: Landmark, label: 'Government', count: stats.government },
    { icon: Building2, label: 'Industry', count: stats.industry },
    { icon: GraduationCap, label: 'Institution', count: stats.institution },
    { icon: Briefcase, label: 'Academic', count: stats.academic },
  ]

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
              Research Projects
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight">
            Projects
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
            <span className="text-sm text-primary font-semibold">Projects</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-40 md:py-60 pb-60 md:pb-80 px-16 md:px-20">
        <div className="max-w-1480 mx-auto flex flex-col gap-24 md:gap-40">
          
          {/* Statistics Section */}
          <div className="flex flex-col gap-12 md:gap-20">
            <div className="flex items-center gap-8">
              <TrendingUp size={20} className="text-primary" />
              <h2 className="text-xl md:text-[26px] font-semibold text-gray-900">Statistics</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-20">
              {statisticsItems.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-12 md:px-20 py-16 md:py-24 bg-white border border-gray-100 rounded-xl md:rounded-2xl shadow-sm gap-8 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-8 md:gap-12">
                    <stat.icon className="size-16 md:size-20 text-gray-500" />
                    <span className="text-sm md:text-md font-semibold text-gray-900">{stat.label}</span>
                  </div>
                  <span className="text-xl md:text-[24px] font-semibold text-primary">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex flex-col gap-12 md:gap-20">
            <div className="flex items-center gap-8">
              <h2 className="text-xl md:text-[26px] font-semibold text-gray-900">Filter by Type</h2>
            </div>
            <div className="flex flex-wrap gap-8 md:gap-12">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-16 md:px-20 py-10 md:py-12 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  selectedType === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Projects
              </button>
              {Object.entries(typeConfig).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedType(key)}
                    className={`flex items-center gap-8 px-16 md:px-20 py-10 md:py-12 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                      selectedType === key
                        ? `${config.color} text-white shadow-md`
                        : `${config.bgColor} ${config.textColor} hover:opacity-80`
                    }`}
                  >
                    <Icon size={16} />
                    {config.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Projects List by Year */}
          <div className="flex flex-col gap-12 md:gap-20">
            <div className="flex items-center gap-8">
              <Folder size={20} className="text-primary" />
              <h2 className="text-xl md:text-[26px] font-semibold text-gray-900">
                Projects List
                <span className="ml-8 text-base text-gray-400 font-normal">({filteredProjects.length})</span>
              </h2>
            </div>

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
                            ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-100/70'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex flex-col items-start gap-4">
                          <div className="flex items-center gap-12">
                            <span className={`text-lg md:text-xl font-bold ${isCurrentYear ? 'text-amber-800' : 'text-gray-900'}`}>
                              {year}
                            </span>
                            {isCurrentYear && (
                              <span className="px-8 py-2 bg-amber-500 text-white text-[10px] md:text-xs font-semibold rounded-full">
                                NEW
                              </span>
                            )}
                            <span className={`text-sm font-medium ${isCurrentYear ? 'text-amber-600' : 'text-gray-500'}`}>
                              ({yearProjects.length} projects)
                            </span>
                          </div>
                          <span className={`text-xs md:text-sm ${isCurrentYear ? 'text-amber-700' : 'text-gray-500'}`}>
                            Gov: {yearStats.government} · Ind: {yearStats.industry} · Inst: {yearStats.institution} · Acad: {yearStats.academic}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="size-20 text-gray-500" />
                        ) : (
                          <ChevronDown className="size-20 text-gray-500" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="flex flex-col">
                          {yearProjects.map((project, idx) => {
                            const config = typeConfig[project.type]
                            const Icon = config?.icon || Briefcase
                            
                            return (
                              <div key={idx} className="p-20 md:p-32 bg-white border-t border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-start gap-16 md:gap-24">
                                  {/* Left: Type Badge */}
                                  <div className="flex flex-col items-center shrink-0 w-80 md:w-100">
                                    <div className={`w-full py-8 md:py-10 rounded-t-lg text-center ${config?.color || 'bg-gray-500'}`}>
                                      <Icon size={16} className="inline text-white mb-2" />
                                      <span className="block text-[10px] md:text-xs font-semibold text-white uppercase tracking-wide">
                                        {config?.label || project.type}
                                      </span>
                                    </div>
                                    <div className={`w-full py-6 md:py-8 rounded-b-lg text-center border-x border-b ${config?.borderColor || 'border-gray-200'} ${config?.bgColor || 'bg-gray-50'}`}>
                                      <span className={`text-[10px] md:text-xs font-medium ${config?.textColor || 'text-gray-600'}`}>
                                        {config?.labelKo || '기타'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Middle: Content */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-base md:text-lg font-bold text-gray-900 mb-8 leading-relaxed">
                                      {project.titleEn}
                                    </h4>
                                    <p className="text-sm md:text-base text-gray-600 mb-12">{project.titleKo}</p>
                                    
                                    <div className="flex flex-wrap gap-8 md:gap-12">
                                      <span className="inline-flex items-center gap-6 px-12 py-6 bg-gray-100 rounded-full text-xs md:text-sm text-gray-600">
                                        <Calendar size={12} />
                                        {project.period}
                                      </span>
                                      <span className="inline-flex items-center gap-6 px-12 py-6 bg-gray-100 rounded-full text-xs md:text-sm text-gray-600">
                                        <Building2 size={12} />
                                        {project.fundingAgency}
                                      </span>
                                      {project.amount && project.amount !== 'N/A' && (
                                        <span className="inline-flex items-center gap-6 px-12 py-6 bg-primary/10 rounded-full text-xs md:text-sm text-primary font-medium">
                                          {project.amount}
                                        </span>
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
