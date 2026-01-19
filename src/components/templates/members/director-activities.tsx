import {memo, useState, useEffect, useMemo, useCallback, useRef} from 'react'
import {Link} from 'react-router-dom'
import {
  Home,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Award,
  BookOpen,
  GraduationCap,
  Building2,
  Landmark,
  X,
} from 'lucide-react'
import type {ReviewerData, AuthorsData, Publication, Mentee} from '@/types/data'

// Image Imports
import banner2 from '@/assets/images/banner/2.webp'
import logoCaptima from '@/assets/images/logos/captima.png'
import logoKfac from '@/assets/images/logos/kfac.png'
import logoMensa from '@/assets/images/logos/mensa.png'
import logoField from '@/assets/images/logos/field.png'
import logoFba from '@/assets/images/logos/fba.png'
import logoDading from '@/assets/images/logos/dading.png'

// Types
type Lecture = {
  role: string
  periods: string[]
  school: string
  courses: { en: string; ko: string }[]
}

type DirectorProject = {
  titleEn: string
  titleKo: string
  period: string
  fundingAgency: string
  fundingAgencyKo: string
  amount?: string
  type: string
  role: string
}

type CollabPublication = {
  title: string
  titleKo: string
  year: number
  venue: string
  venueKo: string
  type: string
}

type PublicationBreakdown = {
  journal: number
  conference: number
  book: number
  report: number
}

type NetworkNode = {
  id: string
  name: string
  nameKo: string
  x: number
  y: number
  vx: number
  vy: number
  publications: number
  isDirector: boolean
  collabPubs: CollabPublication[]
  breakdown: PublicationBreakdown
  coworkRate: number
}

type NetworkLink = {
  source: string
  target: string
  weight: number
}

type MenteeWithId = Mentee & { id: string }

type MenteesByYear = { [year: string]: MenteeWithId[] }

// Activities Data
const activities = [
  {
    name: 'CAPTIMA',
    logo: logoCaptima,
    fullName: 'Computer Applications for Optima',
    generation: '',
    membership: [{role: 'Member', period: '2013.03. - 2018.02.'}, {role: 'Alumni', period: '2018.03. - Present'}],
    leadership: [{role: 'President', period: '2015.06. - 2015.12.'}, {role: 'Vice President', period: '2013.12. - 2014.08.'}],
  },
  {
    name: 'KFAC',
    logo: logoKfac,
    fullName: 'KAIST Financial Analysis Club',
    generation: '25th Generation',
    membership: [{role: 'Member', period: '2018.03. - 2019.02.'}, {role: 'Alumni', period: '2019.03. - Present'}],
    leadership: [{role: 'Acting President', period: '2021.03. - 2021.08.'}, {role: 'Session Leader', period: '2018.09. - 2019.02.'}],
  },
  {
    name: 'MENSA Korea',
    logo: logoMensa,
    fullName: 'MENSA Korea',
    generation: '',
    membership: [{role: 'Member', period: '2019.01. - Present'}],
    leadership: [],
  },
  {
    name: 'FIELD',
    logo: logoField,
    fullName: 'Future Industrial Engineering Leaders and Dreamers',
    generation: '11th - 16th Generation',
    membership: [{role: 'Member', period: '2019.03. - 2024.12.'}, {role: 'Alumni', period: '2020.01. - Present'}],
    leadership: [],
  },
  {
    name: 'FBA Quant',
    logo: logoFba,
    fullName: 'FBA Quant',
    generation: '12th Generation',
    membership: [{role: 'Member', period: '2022.01. - 2022.12.'}, {role: 'Alumni', period: '2023.01. - Present'}],
    leadership: [],
  },
  {
    name: 'DadingCoding',
    logo: logoDading,
    fullName: '다딩코딩',
    generation: '6th Generation',
    membership: [{role: 'Member', period: '2024.02. - 2024.07.'}, {role: 'Alumni', period: '2024.08. - Present'}],
    leadership: [],
  },
]

// Collaboration Network Component with Yellow Theme
const CollaborationNetwork = memo(() => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [links, setLinks] = useState<NetworkLink[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const getDefaultZoom = () => typeof window !== 'undefined' && window.innerWidth < 768 ? 1.6 : 1.3
  const [zoom, setZoom] = useState(getDefaultZoom)
  const [pan, setPan] = useState({x: 0, y: 0})
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({x: 0, y: 0})
  const animationRef = useRef<number | null>(null)
  const nodesRef = useRef<NetworkNode[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pubsRes, authorsRes] = await Promise.all([
          fetch('/website/data/pubs.json'),
          fetch('/website/data/authors.json'),
        ])
        const pubs: Publication[] = await pubsRes.json()
        const authors: AuthorsData = await authorsRes.json()

        const collaborationMap = new Map<string, Map<string, number>>()
        const authorPubCount = new Map<string, number>()
        const authorCollabPubs = new Map<string, CollabPublication[]>()
        const totalPubsCount = pubs.length

        pubs.forEach((pub) => {
          if (pub.authors.includes(1)) {
            pub.authors.forEach((authorId) => {
              const idStr = String(authorId)
              authorPubCount.set(idStr, (authorPubCount.get(idStr) || 0) + 1)
              if (!authorCollabPubs.has(idStr)) authorCollabPubs.set(idStr, [])
              authorCollabPubs.get(idStr)!.push({
                title: pub.title,
                titleKo: pub.title_ko,
                year: pub.year,
                venue: pub.venue,
                venueKo: pub.venue_ko,
                type: pub.type || 'other',
              })
            })

            for (let i = 0; i < pub.authors.length; i++) {
              for (let j = i + 1; j < pub.authors.length; j++) {
                const a = String(pub.authors[i])
                const b = String(pub.authors[j])
                if (!collaborationMap.has(a)) collaborationMap.set(a, new Map())
                if (!collaborationMap.has(b)) collaborationMap.set(b, new Map())
                collaborationMap.get(a)!.set(b, (collaborationMap.get(a)!.get(b) || 0) + 1)
                collaborationMap.get(b)!.set(a, (collaborationMap.get(b)!.get(a) || 0) + 1)
              }
            }
          }
        })

        const directorCollabs = collaborationMap.get('1') || new Map()
        const topCollaborators = Array.from(directorCollabs.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 25)
          .map(([id]) => id)

        const nodesToShow = ['1', ...topCollaborators]
        const width = 800
        const height = 500
        const centerX = width / 2
        const centerY = height / 2

        const initialNodes: NetworkNode[] = nodesToShow.map((id, idx) => {
          const author = authors[id]
          const isDirector = id === '1'
          const angle = (2 * Math.PI * idx) / nodesToShow.length
          const radius = isDirector ? 0 : 150 + Math.random() * 100
          const collabPubsList = authorCollabPubs.get(id) || []
          const pubCount = authorPubCount.get(id) || 0
          const breakdown: PublicationBreakdown = {
            journal: collabPubsList.filter(p => p.type === 'journal').length,
            conference: collabPubsList.filter(p => p.type === 'conference').length,
            book: collabPubsList.filter(p => p.type === 'book').length,
            report: collabPubsList.filter(p => p.type === 'report' || p.type === 'other').length,
          }
          const coworkRate = totalPubsCount > 0 ? Math.round((pubCount / totalPubsCount) * 100) : 0

          return {
            id,
            name: author?.en || `Author ${id}`,
            nameKo: author?.ko || '',
            x: centerX + (isDirector ? 0 : Math.cos(angle) * radius),
            y: centerY + (isDirector ? 0 : Math.sin(angle) * radius),
            vx: 0,
            vy: 0,
            publications: pubCount,
            isDirector,
            collabPubs: collabPubsList,
            breakdown,
            coworkRate,
          }
        })

        const networkLinks: NetworkLink[] = []
        nodesToShow.forEach((sourceId) => {
          const collabs = collaborationMap.get(sourceId)
          if (collabs) {
            collabs.forEach((weight, targetId) => {
              if (nodesToShow.includes(targetId) && sourceId < targetId) {
                networkLinks.push({source: sourceId, target: targetId, weight})
              }
            })
          }
        })

        setNodes(initialNodes)
        nodesRef.current = initialNodes
        setLinks(networkLinks)
        setLoading(false)
      } catch (err) {
        console.error('Failed to load collaboration data:', err)
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (nodes.length === 0) return

    const simulate = () => {
      const newNodes = [...nodesRef.current]
      const centerX = 400
      const centerY = 250

      newNodes.forEach((node) => {
        if (node.isDirector) {
          node.vx += (centerX - node.x) * 0.1
          node.vy += (centerY - node.y) * 0.1
        } else {
          node.vx += (centerX - node.x) * 0.001
          node.vy += (centerY - node.y) * 0.001
        }

        newNodes.forEach((other) => {
          if (node.id !== other.id) {
            const dx = node.x - other.x
            const dy = node.y - other.y
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const minDist = 70
            if (dist < minDist) {
              const force = ((minDist - dist) / dist) * 0.5
              node.vx += dx * force
              node.vy += dy * force
            }
          }
        })
      })

      links.forEach((link) => {
        const source = newNodes.find((n) => n.id === link.source)
        const target = newNodes.find((n) => n.id === link.target)
        if (source && target) {
          const dx = target.x - source.x
          const dy = target.y - source.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const idealDist = 80 - link.weight * 3
          const force = (dist - idealDist) * 0.01

          if (!source.isDirector) {
            source.vx += (dx / dist) * force
            source.vy += (dy / dist) * force
          }
          if (!target.isDirector) {
            target.vx -= (dx / dist) * force
            target.vy -= (dy / dist) * force
          }
        }
      })

      newNodes.forEach((node) => {
        node.vx *= 0.9
        node.vy *= 0.9
        node.x += node.vx
        node.y += node.vy
        node.x = Math.max(50, Math.min(750, node.x))
        node.y = Math.max(50, Math.min(450, node.y))
      })

      nodesRef.current = newNodes
      setNodes([...newNodes])
      animationRef.current = requestAnimationFrame(simulate)
    }

    animationRef.current = requestAnimationFrame(simulate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [nodes.length, links])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsPanning(true)
    setPanStart({x: e.clientX - pan.x, y: e.clientY - pan.y})
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({x: e.clientX - panStart.x, y: e.clientY - panStart.y})
    }
  }, [isPanning, panStart])

  const handleMouseUp = useCallback(() => setIsPanning(false), [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)))
  }, [])

  const resetView = useCallback(() => {
    setZoom(getDefaultZoom())
    setPan({x: 0, y: 0})
    setSelectedNode(null)
  }, [])

  const selectedNodeData = useMemo(() => nodes.find(n => n.id === selectedNode), [nodes, selectedNode])

  if (loading) {
    return (
      <div className="h-400 flex items-center justify-center">
        <div className="text-center">
          <div className="size-40 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-12"/>
          <p className="text-sm text-gray-500">Loading network data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute top-16 right-16 z-10 flex gap-8">
        <button onClick={() => setZoom(z => Math.min(3, z * 1.2))} className="size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <ZoomIn size={16} className="text-gray-600"/>
        </button>
        <button onClick={() => setZoom(z => Math.max(0.5, z * 0.8))} className="size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <ZoomOut size={16} className="text-gray-600"/>
        </button>
        <button onClick={resetView} className="size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <Maximize2 size={16} className="text-gray-600"/>
        </button>
      </div>

      <div ref={containerRef} className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-white rounded-xl border border-amber-100" style={{height: '400px'}}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}>
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 500" style={{transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: 'center', cursor: isPanning ? 'grabbing' : 'grab'}}>
          <defs>
            <radialGradient id="yellowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFC107" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#FFC107" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {links.map((link, idx) => {
            const source = nodes.find(n => n.id === link.source)
            const target = nodes.find(n => n.id === link.target)
            if (!source || !target) return null
            const isHighlighted = hoveredNode === link.source || hoveredNode === link.target || selectedNode === link.source || selectedNode === link.target
            return (
              <line key={idx} x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                stroke={isHighlighted ? '#F59E0B' : '#FDE68A'}
                strokeWidth={Math.max(1, link.weight * 0.5) * (isHighlighted ? 2 : 1)}
                strokeOpacity={isHighlighted ? 0.8 : 0.4}/>
            )
          })}

          {nodes.map((node) => {
            const isHighlighted = hoveredNode === node.id || selectedNode === node.id
            const nodeSize = node.isDirector ? 24 : 10 + Math.min(node.publications * 2, 12)
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                style={{cursor: 'pointer'}}>
                {isHighlighted && <circle r={nodeSize + 8} fill="url(#yellowGlow)"/>}
                <circle r={nodeSize} fill={node.isDirector ? '#F59E0B' : isHighlighted ? '#FBBF24' : '#FCD34D'}
                  stroke={isHighlighted ? '#D97706' : '#F59E0B'} strokeWidth={isHighlighted ? 3 : 1.5}/>
                {node.isDirector && <text textAnchor="middle" dy={nodeSize + 16} className="text-[11px] font-bold fill-amber-800">Director</text>}
                {!node.isDirector && (
                  <text textAnchor="middle" dy={nodeSize + 12} className={`text-[9px] ${isHighlighted ? 'font-bold fill-amber-900' : 'fill-amber-700'}`}>
                    {node.name.split(' ').slice(-1)[0]}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {selectedNodeData && (
        <div className="mt-16 p-16 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-sm font-bold text-amber-900">{selectedNodeData.name}</p>
              {selectedNodeData.nameKo && <p className="text-xs text-amber-700">{selectedNodeData.nameKo}</p>}
            </div>
            <button onClick={() => setSelectedNode(null)} className="size-24 flex items-center justify-center rounded-full hover:bg-amber-100">
              <X size={14} className="text-amber-600"/>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-lg">
              <p className="text-lg font-bold text-amber-600">{selectedNodeData.publications}</p>
              <p className="text-[9px] text-gray-500 uppercase">Papers</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg">
              <p className="text-lg font-bold text-amber-600">{selectedNodeData.breakdown.journal}</p>
              <p className="text-[9px] text-gray-500 uppercase">Journal</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg">
              <p className="text-lg font-bold text-amber-600">{selectedNodeData.breakdown.conference}</p>
              <p className="text-[9px] text-gray-500 uppercase">Conference</p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg">
              <p className="text-lg font-bold text-amber-600">{selectedNodeData.coworkRate}%</p>
              <p className="text-[9px] text-gray-500 uppercase">Co-work</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

CollaborationNetwork.displayName = 'CollaborationNetwork'

// Main Component
export const MembersDirectorActivitiesTemplate = () => {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [projects, setProjects] = useState<DirectorProject[]>([])
  const [reviewerData, setReviewerData] = useState<ReviewerData | null>(null)
  const [mentees, setMentees] = useState<MenteeWithId[]>([])
  const [showAllJournals, setShowAllJournals] = useState(false)
  const [teachingTab, setTeachingTab] = useState<'lecturer' | 'ta'>('lecturer')
  const [selectedMentoringYear, setSelectedMentoringYear] = useState<string>('all')
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    awardsHonors: true,
    teaching: true,
    projects: true,
    academicService: false,
    activities: false,
    collaborationNetwork: true,
    mentoringProgram: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}))
  }

  useEffect(() => {
    Promise.all([
      fetch('/website/data/lectures.json').then(r => r.json()),
      fetch('/website/data/director-projects.json').then(r => r.json()),
      fetch('/website/data/reviewer.json').then(r => r.json()),
      fetch('/website/data/mentees.json').then(r => r.json()),
    ]).then(([lecturesData, projectsData, reviewerData, menteesData]) => {
      setLectures(lecturesData)
      setProjects(projectsData)
      setReviewerData(reviewerData)
      const menteesList = Object.entries(menteesData).map(([id, mentee]) => ({id, ...(mentee as Mentee)}))
      setMentees(menteesList)
    }).catch(err => {
      console.error('Failed to load data:', err)
    })
  }, [])

  // Filter lectures by role
  const lecturerCourses = useMemo(() => lectures.filter(l => l.role === 'Lecturer'), [lectures])
  const taCourses = useMemo(() => lectures.filter(l => l.role === 'Teaching Assistant'), [lectures])

  // Mentees by year
  const menteesByYear = useMemo(() => {
    const grouped: MenteesByYear = {}
    mentees.forEach((mentee) => {
      mentee.participationYears.forEach((year) => {
        if (!grouped[year]) grouped[year] = []
        grouped[year].push(mentee)
      })
    })
    return grouped
  }, [mentees])

  const mentoringYears = useMemo(() => Object.keys(menteesByYear).sort((a, b) => Number(b) - Number(a)), [menteesByYear])

  const filteredMentees = useMemo(() => {
    if (selectedMentoringYear === 'all') {
      return [...mentees].sort((a, b) => Math.max(...b.participationYears.map(Number)) - Math.max(...a.participationYears.map(Number)))
    }
    return menteesByYear[selectedMentoringYear] || []
  }, [selectedMentoringYear, mentees, menteesByYear])

  const displayedJournals = useMemo(() => {
    if (!reviewerData) return []
    return showAllJournals ? reviewerData.journals : reviewerData.journals.slice(0, 10)
  }, [reviewerData, showAllJournals])

  // Project type config
  const projectTypeConfig: {[key: string]: {icon: typeof Landmark; color: string; bg: string}} = {
    government: {icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50'},
    industry: {icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50'},
    institution: {icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50'},
    academic: {icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50'},
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-200 md:h-332 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(${banner2})`}}/>
        <div className="absolute inset-0 bg-black/40"/>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-2xl md:text-[36px] font-semibold text-white text-center">Director Activities</h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-20 md:py-40">
        <div className="flex items-center gap-8 md:gap-10 flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors"><Home size={16}/></Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-gray-400">Members</span>
          <span className="text-[#cdcdcd]">›</span>
          <Link to="/members/director" className="text-sm md:text-base text-gray-400 hover:text-primary">Director</Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-primary font-medium">Activities</span>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
        <div className="flex flex-col gap-32 md:gap-48">

          {/* Back to Director Link */}
          <Link to="/members/director" className="inline-flex items-center gap-8 text-sm text-primary hover:underline w-fit">
            <ChevronRight size={16} className="rotate-180"/> Back to Director Profile
          </Link>

          {/* Awards & Honors */}
          <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => toggleSection('awardsHonors')} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Awards & Honors</h3>
              <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.awardsHonors ? 'rotate-180' : ''}`}/>
            </button>
            {expandedSections.awardsHonors && (
              <div className="border-t border-gray-100 p-20 md:p-24">
                <div className="space-y-16">
                  <div className="flex items-start gap-12 p-16 bg-amber-50 border border-amber-100 rounded-xl">
                    <Award size={20} className="text-amber-600 shrink-0 mt-4"/>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Best Doctoral Dissertation Award</p>
                      <p className="text-xs text-gray-600 mt-4">Korean Operations Research and Management Science Society (KORMS)</p>
                      <p className="text-[10px] text-gray-500 mt-2">2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-12 p-16 bg-amber-50 border border-amber-100 rounded-xl">
                    <Award size={20} className="text-amber-600 shrink-0 mt-4"/>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Best Master's Thesis Award</p>
                      <p className="text-xs text-gray-600 mt-4">Korean Institute of Industrial Engineers (KIIE)</p>
                      <p className="text-[10px] text-gray-500 mt-2">2021</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-12 p-16 bg-amber-50 border border-amber-100 rounded-xl">
                    <Award size={20} className="text-amber-600 shrink-0 mt-4"/>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Valedictorian</p>
                      <p className="text-xs text-gray-600 mt-4">Kyung Hee University - 1st out of 86 students</p>
                      <p className="text-[10px] text-gray-500 mt-2">2018</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Teaching */}
          <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => toggleSection('teaching')} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Teaching</h3>
              <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.teaching ? 'rotate-180' : ''}`}/>
            </button>
            {expandedSections.teaching && (
              <div className="border-t border-gray-100">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                  <button onClick={() => setTeachingTab('lecturer')}
                    className={`flex-1 py-12 text-sm font-bold transition-colors ${teachingTab === 'lecturer' ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
                    Lecturer ({lecturerCourses.length})
                  </button>
                  <button onClick={() => setTeachingTab('ta')}
                    className={`flex-1 py-12 text-sm font-bold transition-colors ${teachingTab === 'ta' ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
                    Teaching Assistant ({taCourses.length})
                  </button>
                </div>
                {/* Content */}
                <div className="p-20 md:p-24 space-y-12">
                  {(teachingTab === 'lecturer' ? lecturerCourses : taCourses).map((lecture, idx) => (
                    <div key={idx} className={`p-16 rounded-xl border ${teachingTab === 'lecturer' ? 'bg-amber-50/30 border-amber-100' : 'bg-rose-50/30 border-rose-100'}`}>
                      <div className="flex flex-wrap items-center gap-8 mb-8">
                        <span className={`px-10 py-3 text-[10px] font-bold rounded-full ${teachingTab === 'lecturer' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {lecture.periods.join(', ')}
                        </span>
                        <span className="text-xs text-gray-500">{lecture.school}</span>
                      </div>
                      {lecture.courses.map((course, cIdx) => (
                        <p key={cIdx} className="text-sm text-gray-800 font-medium">{course.en}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Research Projects */}
          <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => toggleSection('projects')} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Research Projects (Participated)</h3>
              <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.projects ? 'rotate-180' : ''}`}/>
            </button>
            {expandedSections.projects && (
              <div className="border-t border-gray-100 p-20 md:p-24 space-y-12">
                {projects.map((project, idx) => {
                  const config = projectTypeConfig[project.type] || projectTypeConfig.academic
                  const Icon = config.icon
                  return (
                    <div key={idx} className={`p-16 rounded-xl border ${config.bg} border-gray-100`}>
                      <div className="flex items-start gap-12">
                        <div className={`size-36 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
                          <Icon size={18} className={config.color}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-8 mb-4">
                            <span className={`px-8 py-2 text-[9px] font-bold rounded ${config.color} ${config.bg}`}>{project.type.toUpperCase()}</span>
                            <span className="text-[10px] text-gray-500">{project.period}</span>
                          </div>
                          <p className="text-sm font-bold text-gray-900 mb-4">{project.titleEn}</p>
                          <p className="text-xs text-gray-600">{project.fundingAgency}</p>
                          <p className="text-[10px] text-gray-500 mt-4">Role: {project.role}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Academic Service */}
          <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => toggleSection('academicService')} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Academic Service</h3>
              <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.academicService ? 'rotate-180' : ''}`}/>
            </button>
            {expandedSections.academicService && reviewerData && (
              <div className="border-t border-gray-100">
                <div className="p-24">
                  <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-8">
                      <p className="text-sm font-bold text-gray-900">Journal Reviewer</p>
                      <span className="px-8 py-2 bg-primary text-white text-[10px] font-bold rounded-full">{reviewerData.journals.length}</span>
                    </div>
                    {reviewerData.journals.length > 10 && (
                      <button onClick={() => setShowAllJournals(!showAllJournals)} className="text-xs text-primary font-medium flex items-center gap-4 hover:underline">
                        {showAllJournals ? 'Show Less' : 'Show All'}
                        {showAllJournals ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                      </button>
                    )}
                  </div>
                  <div className="space-y-8">
                    {displayedJournals.map((journal) => (
                      <div key={journal.id} className="flex items-center justify-between py-12 px-16 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <a href={journal.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-primary truncate flex-1 min-w-0 pr-16 font-medium">
                          {journal.name}
                        </a>
                        <div className="flex items-center gap-12 shrink-0">
                          <span className={`px-10 py-3 rounded-full text-[10px] font-bold ${journal.type === 'SCIE' || journal.type === 'SSCI' ? 'bg-primary text-white' : 'bg-amber-100 text-amber-700'}`}>
                            {journal.type}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{journal.since}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-24 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex items-center gap-8 mb-16">
                    <p className="text-sm font-bold text-gray-900">Conference Reviewer</p>
                    <span className="px-8 py-2 bg-primary text-white text-[10px] font-bold rounded-full">{reviewerData.conferences.length}</span>
                  </div>
                  <div className="space-y-8">
                    {reviewerData.conferences.map((conf) => (
                      <div key={conf.id} className="flex items-center justify-between py-12 px-16 bg-white rounded-lg hover:shadow-sm transition-all">
                        <a href={conf.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-primary truncate flex-1 min-w-0 pr-16 font-medium">
                          {conf.name}
                        </a>
                        <span className="text-[10px] text-gray-400 font-medium shrink-0">{conf.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Activities */}
          <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => toggleSection('activities')} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Activities</h3>
              <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.activities ? 'rotate-180' : ''}`}/>
            </button>
            {expandedSections.activities && (
              <div className="border-t border-gray-100 p-20 md:p-24">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                  {activities.map((activity, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-16 hover:shadow-md transition-all">
                      <div className="flex items-center gap-12 mb-12">
                        <div className="size-40 bg-white rounded-lg p-6 flex items-center justify-center">
                          <img src={activity.logo} alt={activity.name} className="w-full h-full object-contain"/>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{activity.name}</p>
                          {activity.generation && <p className="text-[10px] text-gray-500">{activity.generation}</p>}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{activity.fullName}</p>
                      {activity.leadership.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                          {activity.leadership.map((role, rIdx) => (
                            <p key={rIdx} className="text-[10px] text-primary font-medium">{role.role}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Collaboration Network */}
          <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => toggleSection('collaborationNetwork')} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Collaboration Network</h3>
              <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.collaborationNetwork ? 'rotate-180' : ''}`}/>
            </button>
            {expandedSections.collaborationNetwork && (
              <div className="border-t border-gray-100 p-20 md:p-24">
                <CollaborationNetwork/>
              </div>
            )}
          </section>

          {/* Mentoring Program */}
          <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => toggleSection('mentoringProgram')} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Mentoring Program</h3>
              <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.mentoringProgram ? 'rotate-180' : ''}`}/>
            </button>
            {expandedSections.mentoringProgram && (
              <div className="border-t border-gray-100">
                {/* Stats */}
                <div className="p-24 bg-gradient-to-r from-rose-50/50 to-amber-50/50">
                  <div className="grid grid-cols-4 gap-12">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{mentees.length}</p>
                      <p className="text-[10px] text-gray-500 uppercase mt-4">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rose-500">{menteesByYear['2025']?.length || 0}</p>
                      <p className="text-[10px] text-gray-500 uppercase mt-4">2025</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-500">{mentoringYears.length}</p>
                      <p className="text-[10px] text-gray-500 uppercase mt-4">Years</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-500">{new Set(mentees.map(m => m.university)).size}</p>
                      <p className="text-[10px] text-gray-500 uppercase mt-4">Universities</p>
                    </div>
                  </div>
                </div>
                {/* Year Filter */}
                <div className="px-24 py-16 border-t border-gray-100 flex items-center gap-8 overflow-x-auto">
                  <button onClick={() => setSelectedMentoringYear('all')}
                    className={`px-12 py-6 rounded-full text-xs font-bold transition-all shrink-0 ${selectedMentoringYear === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    All
                  </button>
                  {mentoringYears.map((year) => (
                    <button key={year} onClick={() => setSelectedMentoringYear(year)}
                      className={`px-12 py-6 rounded-full text-xs font-bold transition-all shrink-0 ${selectedMentoringYear === year ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {year}
                    </button>
                  ))}
                </div>
                {/* Mentee List */}
                <div className="max-h-400 overflow-y-auto">
                  {filteredMentees.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {filteredMentees.map((mentee) => (
                        <div key={mentee.id} className="px-24 py-16 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center gap-12">
                            <div className="size-36 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold">
                              {mentee.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{mentee.name}</p>
                              <p className="text-xs text-gray-500">{mentee.university}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            {mentee.participationYears.map((year) => (
                              <span key={year} className={`px-8 py-2 rounded text-[10px] font-bold ${year === '2025' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-500'}`}>
                                {year}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-40 text-center text-gray-400">
                      <Users size={40} className="mx-auto mb-12 opacity-30"/>
                      <p className="text-sm">No mentees found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorActivitiesTemplate)
