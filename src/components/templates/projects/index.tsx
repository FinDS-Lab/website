import {memo, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Home, Calendar, Building2, Users, Landmark, GraduationCap, Briefcase} from 'lucide-react'
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
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  industry: {
    icon: Building2,
    label: 'Industry',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  institution: {
    icon: GraduationCap,
    label: 'Institution',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  academic: {
    icon: Briefcase,
    label: 'Academic',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
}

export const ProjectsTemplate = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    fetch('/website/data/projects.json')
      .then((res) => res.json())
      .then((data: Project[]) => {
        const cutoffDate = new Date('2025-06-14')
        
        // Filter projects where PI is 최인수 AND started after 2025-06-14
        const piProjects = data.filter((p) => {
          if (p.roles.principalInvestigator !== '최인수') return false
          
          // Parse start date from period (e.g., "2025-10-16 – 2025-12-31")
          const startDateStr = p.period.split('–')[0].trim()
          const startDate = new Date(startDateStr)
          return startDate >= cutoffDate
        })
        setProjects(piProjects)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load projects:', err)
        setLoading(false)
      })
  }, [])

  const filteredProjects = selectedType === 'all' 
    ? projects 
    : projects.filter(p => p.type === selectedType)

  const projectTypes = ['all', ...Array.from(new Set(projects.map(p => p.type)))]

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
            Projects
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
          <span className="text-sm md:text-base text-primary font-medium">Projects</span>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
        {/* Filter */}
        <div className="flex flex-wrap gap-8 mb-32">
          {projectTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-16 py-8 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All' : typeConfig[type as keyof typeof typeConfig]?.label || type}
            </button>
          ))}
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-40">
            <p className="text-gray-400 animate-pulse">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-40">
            <p className="text-gray-400">No projects found.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredProjects.map((project, idx) => {
              const config = typeConfig[project.type]
              const Icon = config?.icon || Briefcase
              
              return (
                <div
                  key={idx}
                  className={`p-24 rounded-2xl border ${config?.bgColor || 'bg-gray-50'} ${config?.borderColor || 'border-gray-100'} hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-wrap items-center gap-12 mb-12">
                    <span className={`px-12 py-4 text-xs font-bold rounded-full ${config?.badgeColor || 'bg-gray-100 text-gray-700'}`}>
                      <Icon size={12} className="inline mr-4"/>
                      {config?.label || project.type}
                    </span>
                    <span className="flex items-center gap-6 text-xs text-gray-500">
                      <Calendar size={12}/>
                      {project.period}
                    </span>
                    {project.amount && project.amount !== 'N/A' && (
                      <span className="text-xs text-gray-500">{project.amount}</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-8">{project.titleEn}</h3>
                  <p className="text-sm text-gray-600 mb-12">{project.titleKo}</p>
                  
                  <div className="flex flex-wrap items-center gap-16 pt-12 border-t border-gray-200/50">
                    <div className="flex items-center gap-8">
                      <Building2 size={14} className="text-gray-400"/>
                      <span className="text-sm text-gray-600">{project.fundingAgency}</span>
                    </div>
                    {project.roles.principalInvestigator && (
                      <div className="flex items-center gap-8">
                        <Users size={14} className="text-gray-400"/>
                        <span className="text-sm text-gray-600">PI: {project.roles.principalInvestigator}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Note */}
        <div className="mt-40 p-20 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-primary">Note:</span> This page shows projects where Prof. Insu Choi served as the Principal Investigator (PI). 
            For all projects including collaborative research, please visit the{' '}
            <Link to="/members/director-activities" className="text-primary hover:underline">
              Director Activities
            </Link> page.
          </p>
        </div>
      </section>
    </div>
  )
}

export default memo(ProjectsTemplate)
