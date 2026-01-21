import {memo, useState, useEffect, useMemo, useCallback, useRef} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {
  Mail, Phone, MapPin, ExternalLink, ChevronRight, ChevronDown, ChevronUp, Home, Copy, Check,
  User, BookOpen, Users, FolderKanban, GraduationCap, Handshake, Network, ZoomIn, ZoomOut, Maximize2, X,
  Landmark, Building, BarChart3, Award
} from 'lucide-react'
import type {AcademicActivitiesData, AuthorsData, Publication} from '@/types/data'
import {useStoreModal} from '@/store/modal'

// Image Imports
import banner2 from '@/assets/images/banner/2.webp'
import directorImg from '@/assets/images/members/director.webp'

// Types
type Project = { titleEn: string; titleKo: string; period: string; fundingAgency: string; fundingAgencyKo: string; type: 'government' | 'industry' | 'institution' | 'academic'; roles: { principalInvestigator?: string; leadResearcher?: string; researchers?: string[] } }
type Lecture = { role: string; periods: string[]; school: string; courses: { en: string; ko: string }[] }
type CollabPublication = { title: string; titleKo: string; year: number; venue: string; venueKo: string; type: string }
type PublicationBreakdown = { journal: number; conference: number; book: number; report: number }
type NetworkNode = { id: string; name: string; nameKo: string; x: number; y: number; vx: number; vy: number; publications: number; isDirector: boolean; collabPubs: CollabPublication[]; breakdown: PublicationBreakdown; coworkRate: number }
type NetworkLink = { source: string; target: string; weight: number }

// Static Data - Professional Affiliations
const affiliations = [
  {organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE) 종신회원', role: 'Lifetime Member', period: '2025.06 – Present'},
  {organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA) 종신회원', role: 'Lifetime Member', period: '2023.09 – Present'},
  {organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA) 종신회원', role: 'Lifetime Member', period: '2023.06 – Present'},
  {organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS) 종신회원', role: 'Lifetime Member', period: '2022.06 – Present'},
]

// Static Data - Citation Statistics
const citationStats = [{label: 'Citations', count: 154}, {label: 'g-index', count: 11}, {label: 'h-index', count: 8}, {label: 'i10-index', count: 6}]

// Expandable Section
const ExpandableSection = ({title, icon: Icon, children, defaultExpanded = true, count}: {title: string; icon: React.ElementType; children: React.ReactNode; defaultExpanded?: boolean; count?: number}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  return (
    <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-12"><Icon size={20} className="text-primary" /><h3 className="text-lg md:text-xl font-bold text-gray-900">{title}</h3>{count !== undefined && <span className="px-8 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full">{count}</span>}</div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <div className={`border-t border-gray-100 ${isExpanded ? 'block' : 'hidden'}`}>{children}</div>
    </section>
  )
}

// Collaboration Network Component
const CollaborationNetwork = memo(() => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [links, setLinks] = useState<NetworkLink[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [coworkRateThreshold, setCoworkRateThreshold] = useState(2)
  const [totalPubsCount, setTotalPubsCount] = useState(0)
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
        const baseUrl = import.meta.env.BASE_URL || '/'
        const [pubsRes, authorsRes] = await Promise.all([fetch(`${baseUrl}data/pubs.json`), fetch(`${baseUrl}data/authors.json`)])
        const pubs: Publication[] = await pubsRes.json()
        const authors: AuthorsData = await authorsRes.json()
        const collaborationMap = new Map<string, Map<string, number>>()
        const authorPubCount = new Map<string, number>()
        const authorCollabPubs = new Map<string, CollabPublication[]>()
        const totalPubs = pubs.filter(pub => pub.authors.includes(1)).length
        setTotalPubsCount(totalPubs)
        pubs.forEach((pub) => {
          if (pub.authors.includes(1)) {
            pub.authors.forEach((authorId) => {
              const idStr = String(authorId)
              authorPubCount.set(idStr, (authorPubCount.get(idStr) || 0) + 1)
              if (!authorCollabPubs.has(idStr)) authorCollabPubs.set(idStr, [])
              authorCollabPubs.get(idStr)!.push({title: pub.title, titleKo: pub.title_ko, year: pub.year, venue: pub.venue, venueKo: pub.venue_ko, type: pub.type || 'other'})
            })
            for (let i = 0; i < pub.authors.length; i++) {
              for (let j = i + 1; j < pub.authors.length; j++) {
                const a = String(pub.authors[i]), b = String(pub.authors[j])
                if (!collaborationMap.has(a)) collaborationMap.set(a, new Map())
                if (!collaborationMap.has(b)) collaborationMap.set(b, new Map())
                collaborationMap.get(a)!.set(b, (collaborationMap.get(a)!.get(b) || 0) + 1)
                collaborationMap.get(b)!.set(a, (collaborationMap.get(b)!.get(a) || 0) + 1)
              }
            }
          }
        })
        const directorCollabs = collaborationMap.get('1') || new Map()
        const minPubCount = Math.max(1, Math.ceil(totalPubs * coworkRateThreshold / 100))
        const topCollaborators = Array.from(directorCollabs.entries()).filter(([, count]) => count >= minPubCount).sort((a, b) => b[1] - a[1]).map(([id]) => id)
        const nodesToShow = ['1', ...topCollaborators]
        const width = 800, height = 500, centerX = width / 2, centerY = height / 2
        const sortedCollabs = topCollaborators.sort((a, b) => (authorPubCount.get(b) || 0) - (authorPubCount.get(a) || 0))
        const initialNodes: NetworkNode[] = nodesToShow.map((id) => {
          const author = authors[id]
          const isDirector = id === '1'
          const collabPubsList = authorCollabPubs.get(id) || []
          const pubCount = authorPubCount.get(id) || 0
          let x = centerX, y = centerY
          if (!isDirector) {
            const sortedIdx = sortedCollabs.indexOf(id)
            const total = sortedCollabs.length
            const innerRingCount = Math.min(6, Math.ceil(total / 2))
            const isInnerRing = sortedIdx < innerRingCount
            if (isInnerRing && innerRingCount > 0) {
              const angle = (2 * Math.PI * sortedIdx) / innerRingCount - Math.PI / 2
              x = centerX + Math.cos(angle) * 120
              y = centerY + Math.sin(angle) * 120
            } else {
              const outerIdx = sortedIdx - innerRingCount
              const outerCount = total - innerRingCount
              if (outerCount > 0) {
                const angle = (2 * Math.PI * outerIdx) / outerCount - Math.PI / 2 + Math.PI / outerCount
                x = centerX + Math.cos(angle) * 200
                y = centerY + Math.sin(angle) * 200
              }
            }
          }
          const breakdown: PublicationBreakdown = {
            journal: collabPubsList.filter(p => p.type === 'journal').length,
            conference: collabPubsList.filter(p => p.type === 'conference').length,
            book: collabPubsList.filter(p => p.type === 'book').length,
            report: collabPubsList.filter(p => p.type === 'report' || p.type === 'other').length,
          }
          const coworkRate = totalPubs > 0 ? Math.round((pubCount / totalPubs) * 100) : 0
          return {id, name: author?.en || `Author ${id}`, nameKo: author?.ko || '', x, y, vx: 0, vy: 0, publications: pubCount, isDirector, collabPubs: collabPubsList, breakdown, coworkRate}
        })
        const networkLinks: NetworkLink[] = []
        nodesToShow.forEach((sourceId) => {
          const collabs = collaborationMap.get(sourceId)
          if (collabs) collabs.forEach((weight, targetId) => { if (nodesToShow.includes(targetId) && sourceId < targetId) networkLinks.push({source: sourceId, target: targetId, weight}) })
        })
        setNodes(initialNodes); nodesRef.current = initialNodes; setLinks(networkLinks); setLoading(false)
      } catch (err) { console.error('Failed to load collaboration data:', err); setLoading(false) }
    }
    loadData()
  }, [coworkRateThreshold])

  useEffect(() => {
    if (nodes.length === 0) return
    let iterationCount = 0
    const maxIterations = 150
    const simulate = () => {
      const newNodes = [...nodesRef.current]
      const centerX = 400, centerY = 250
      newNodes.forEach((node) => {
        if (node.isDirector) { node.vx += (centerX - node.x) * 0.1; node.vy += (centerY - node.y) * 0.1 }
        else { node.vx += (centerX - node.x) * 0.002; node.vy += (centerY - node.y) * 0.002 }
        newNodes.forEach((other) => {
          if (node.id !== other.id) {
            const dx = node.x - other.x, dy = node.y - other.y, dist = Math.sqrt(dx * dx + dy * dy) || 1, minDist = 70
            if (dist < minDist) { const force = ((minDist - dist) / dist) * 0.3; node.vx += dx * force; node.vy += dy * force }
          }
        })
      })
      links.forEach((link) => {
        const source = newNodes.find((n) => n.id === link.source), target = newNodes.find((n) => n.id === link.target)
        if (source && target) {
          const dx = target.x - source.x, dy = target.y - source.y, dist = Math.sqrt(dx * dx + dy * dy) || 1, idealDist = 80 - link.weight * 3, force = (dist - idealDist) * 0.005
          if (!source.isDirector) { source.vx += (dx / dist) * force; source.vy += (dy / dist) * force }
          if (!target.isDirector) { target.vx -= (dx / dist) * force; target.vy -= (dy / dist) * force }
        }
      })
      let totalVelocity = 0
      newNodes.forEach((node) => {
        if (!node.isDirector) {
          node.vx *= 0.7; node.vy *= 0.7; node.x += node.vx; node.y += node.vy; totalVelocity += Math.abs(node.vx) + Math.abs(node.vy)
          if (isNaN(node.x) || isNaN(node.y)) { node.x = centerX + (Math.random() - 0.5) * 200; node.y = centerY + (Math.random() - 0.5) * 200; node.vx = 0; node.vy = 0 }
          node.x = Math.max(50, Math.min(750, node.x)); node.y = Math.max(50, Math.min(450, node.y))
        } else { node.x = centerX; node.y = centerY; node.vx = 0; node.vy = 0 }
      })
      nodesRef.current = newNodes; setNodes([...newNodes]); iterationCount++
      if (totalVelocity >= 0.5 && iterationCount < maxIterations) animationRef.current = requestAnimationFrame(simulate)
    }
    animationRef.current = requestAnimationFrame(simulate)
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [links, nodes.length])

  const handleMouseDown = useCallback((e: React.MouseEvent) => { setIsPanning(true); setPanStart({x: e.clientX - pan.x, y: e.clientY - pan.y}) }, [pan])
  const handleMouseMove = useCallback((e: React.MouseEvent) => { if (isPanning) setPan({x: e.clientX - panStart.x, y: e.clientY - panStart.y}) }, [isPanning, panStart])
  const handleMouseUp = useCallback(() => { setIsPanning(false) }, [])
  const handleZoomIn = useCallback(() => { setZoom((z) => Math.min(z * 1.2, 3)) }, [])
  const handleZoomOut = useCallback(() => { setZoom((z) => Math.max(z / 1.2, 0.5)) }, [])
  const handleReset = useCallback(() => { setZoom(getDefaultZoom()); setPan({x: 0, y: 0}); setSelectedNode(null) }, [])
  const getNodeSize = useCallback((node: NetworkNode) => node.isDirector ? 20 : Math.max(6, Math.min(14, 5 + node.publications * 0.8)), [])
  const getLinkOpacity = useCallback((link: NetworkLink) => { if (selectedNode) return (link.source === selectedNode || link.target === selectedNode) ? 0.8 : 0.1; if (hoveredNode) return (link.source === hoveredNode || link.target === hoveredNode) ? 0.8 : 0.2; return 0.4 }, [hoveredNode, selectedNode])
  const getNodeOpacity = useCallback((node: NetworkNode) => { if (selectedNode) { if (node.id === selectedNode) return 1; const connectedLinks = links.filter((l) => l.source === selectedNode || l.target === selectedNode); const connectedNodeIds = connectedLinks.flatMap((l) => [l.source, l.target]); return connectedNodeIds.includes(node.id) ? 1 : 0.2 }; if (hoveredNode) { if (node.id === hoveredNode) return 1; const connectedLinks = links.filter((l) => l.source === hoveredNode || l.target === hoveredNode); const connectedNodeIds = connectedLinks.flatMap((l) => [l.source, l.target]); return connectedNodeIds.includes(node.id) ? 1 : 0.3 }; return 1 }, [hoveredNode, selectedNode, links])

  if (loading) return (<div className="bg-gray-50 rounded-3xl p-60 text-center border border-gray-100"><div className="size-64 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-16 mx-auto animate-pulse"><Network size={32}/></div><p className="text-lg font-bold text-gray-900 mb-8">Loading Network Data...</p></div>)

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gray-50/50 px-16 md:px-32 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 gap-12 md:gap-0">
        <div className="flex items-center gap-8 md:gap-12 w-full md:w-auto">
          <span className="text-[10px] md:text-xs text-gray-500 font-medium whitespace-nowrap">Co-work Rate ≥</span>
          <input type="range" min="1" max="100" value={coworkRateThreshold} onChange={(e) => setCoworkRateThreshold(Number(e.target.value))} className="w-80 md:w-100 h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
          <span className="text-[10px] md:text-xs font-bold text-primary w-28">{coworkRateThreshold}%</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-[10px] md:text-xs text-gray-400 font-medium mr-8 md:mr-12">{nodes.length} Collaborators · {links.length} Connections</span>
          <button onClick={handleZoomIn} className="size-28 md:size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all" title="Zoom In"><ZoomIn size={14}/></button>
          <button onClick={handleZoomOut} className="size-28 md:size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all" title="Zoom Out"><ZoomOut size={14}/></button>
          <button onClick={handleReset} className="size-28 md:size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all" title="Reset View"><Maximize2 size={14}/></button>
        </div>
      </div>
      <div ref={containerRef} className="relative h-500 bg-gradient-to-br from-gray-50 via-white to-gray-50 cursor-grab active:cursor-grabbing overflow-hidden" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 500" style={{transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center'}}>
          <defs>
            <radialGradient id="directorGradient" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#E8C86A"/><stop offset="100%" stopColor="#D6B04C"/></radialGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/></filter>
          </defs>
          <g>
            {links.map((link, idx) => {
              const source = nodes.find((n) => n.id === link.source), target = nodes.find((n) => n.id === link.target)
              if (!source || !target) return null
              return (<line key={idx} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#FFBAC4" strokeWidth={Math.max(1, link.weight * 0.8)} opacity={getLinkOpacity(link)} className="transition-opacity duration-200"/>)
            })}
            {nodes.map((node) => {
              const size = getNodeSize(node), isHighlighted = node.id === hoveredNode || node.id === selectedNode
              const getNodeFillColor = () => { if (node.isDirector) return 'url(#directorGradient)'; const rate = Math.min(100, node.coworkRate); return `rgb(${Math.round(255 - (rate / 100) * 23)}, ${Math.round(214 - (rate / 100) * 79)}, ${Math.round(221 - (rate / 100) * 66)})` }
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`} opacity={getNodeOpacity(node)} className="cursor-pointer transition-opacity duration-200" onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)} onClick={(e) => { e.stopPropagation(); setSelectedNode(selectedNode === node.id ? null : node.id) }}>
                  <circle r={size} fill={getNodeFillColor()} stroke={node.isDirector ? 'rgb(172,14,14)' : (isHighlighted ? 'rgb(172,14,14)' : 'white')} strokeWidth={node.isDirector ? 3 : (isHighlighted ? 3 : 2)} filter={isHighlighted ? 'url(#glow)' : 'url(#shadow)'} className="transition-all duration-200"/>
                  {node.isDirector && <text textAnchor="middle" dy="0.35em" fill="#FFFFFF" fontSize="12" fontWeight="bold">IC</text>}
                  <text y={size + 14} textAnchor="middle" fill={node.isDirector ? '#D6B04C' : '#374151'} fontSize={node.isDirector ? 12 : 7} fontWeight={node.isDirector ? 700 : 600} className="pointer-events-none select-none">{node.name}</text>
                </g>
              )
            })}
          </g>
        </svg>
        {(hoveredNode || selectedNode) && (
          <div className={`absolute bg-white/98 max-md:w-[calc(100%-40px)] backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden ${selectedNode ? 'bottom-20 left-20 w-340 max-h-500 overflow-y-auto pointer-events-auto' : 'bottom-20 left-20 w-300 pointer-events-none'}`}>
            {(() => {
              const node = nodes.find((n) => n.id === (selectedNode || hoveredNode))
              if (!node) return null
              return (
                <>
                  <div className="bg-gray-50 px-20 py-16 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-12">
                      <div className="min-w-0"><p className="text-sm font-bold text-gray-900 truncate">{node.name}</p>{node.nameKo && <p className="text-xs text-gray-500">{node.nameKo}</p>}</div>
                      {selectedNode && <button type="button" onClick={() => setSelectedNode(null)} className="size-24 rounded-md border border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center shrink-0" title="Close"><X size={12}/></button>}
                    </div>
                  </div>
                  <div className="p-16 space-y-12">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-primary/5 rounded-lg p-12 text-center border border-primary/10"><p className="text-[10px] font-bold text-gray-500 uppercase mb-4">Total Works</p><p className="text-2xl font-bold text-primary">{node.publications}</p></div>
                      <div className="bg-pink-50 rounded-lg p-12 text-center" style={{borderColor: '#FFBAC4', borderWidth: '1px'}}><p className="text-[10px] font-bold text-gray-500 uppercase mb-4">Co-work Rate</p><p className="text-2xl font-bold" style={{color: '#E8889C'}}>{node.coworkRate}%</p></div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-12 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-10">Breakdown</p>
                      <div className="space-y-6">
                        <div className="flex items-center gap-8"><span className="size-4 rounded-full bg-blue-500"/><span className="text-xs text-gray-600 flex-1">journal papers</span><span className="text-xs font-bold text-gray-800">{node.breakdown.journal}</span></div>
                        <div className="flex items-center gap-8"><span className="size-4 rounded-full bg-purple-500"/><span className="text-xs text-gray-600 flex-1">conference proceedings</span><span className="text-xs font-bold text-gray-800">{node.breakdown.conference}</span></div>
                      </div>
                    </div>
                  </div>
                  {!selectedNode && <div className="px-16 pb-12"><p className="text-[10px] text-gray-400 text-center">Click to see details</p></div>}
                </>
              )
            })()}
          </div>
        )}
        <div className="absolute top-16 right-16 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg p-12 text-[10px]">
          <div className="flex items-center gap-6 mb-6"><div className="size-10 rounded-full bg-white flex items-center justify-center text-[6px] font-bold" style={{border: '2px solid rgb(172,14,14)', color: '#D6B04C'}}>IC</div><span className="text-gray-600 font-medium">Director</span></div>
          <div className="flex items-center gap-6"><div className="size-10 rounded-full" style={{backgroundColor: '#FFBAC4'}}/><span className="text-gray-600 font-medium">Collaborator</span></div>
        </div>
      </div>
    </div>
  )
})

export const MembersDirectorAcademicTemplate = () => {
  const [emailCopied, setEmailCopied] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [academicActivities, setAcademicActivities] = useState<AcademicActivitiesData | null>(null)
  const [expandedProjectYears, setExpandedProjectYears] = useState<string[]>([])
  const [pubStats, setPubStats] = useState<{label: string; count: number}[]>([
    {label: 'SCIE', count: 0}, {label: 'SSCI', count: 0}, {label: 'A&HCI', count: 0},
    {label: 'ESCI', count: 0}, {label: 'Scopus', count: 0}, {label: 'Other Int\'l', count: 0},
    {label: 'Int\'l Conf', count: 0}, {label: 'KCI', count: 0}, {label: 'Dom. Conf', count: 0}
  ])
  const {showModal} = useStoreModal()
  const location = useLocation()
  const directorEmail = 'ischoi@gachon.ac.kr'

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/projects.json`).then(res => res.json()).then((data: Project[]) => {
      const sorted = [...data].sort((a, b) => new Date(b.period.split('–')[0].trim()).getTime() - new Date(a.period.split('–')[0].trim()).getTime())
      setProjects(sorted)
      setExpandedProjectYears([...new Set(sorted.map(p => p.period.split('–')[0].trim().slice(0, 4)))])
    }).catch(console.error)
    fetch(`${baseUrl}data/lectures.json`).then(res => res.json()).then((data: Lecture[]) => setLectures(data)).catch(console.error)
    fetch(`${baseUrl}data/academicactivities.json`).then(res => res.json()).then((data: AcademicActivitiesData) => setAcademicActivities(data)).catch(console.error)
    fetch(`${baseUrl}data/pubs.json`).then(res => res.json()).then((pubs: any[]) => {
      const stats = {scie: 0, ssci: 0, ahci: 0, esci: 0, scopus: 0, otherIntl: 0, intlConf: 0, kci: 0, domConf: 0}
      pubs.forEach(pub => {
        const indexing = pub.indexing_group || '', type = pub.type || ''
        if (type === 'journal') {
          if (indexing === 'SCIE') stats.scie++
          else if (indexing === 'SSCI') stats.ssci++
          else if (indexing === 'A&HCI') stats.ahci++
          else if (indexing === 'ESCI') stats.esci++
          else if (indexing === 'Scopus') stats.scopus++
          else if (indexing === 'Other International') stats.otherIntl++
          else if (indexing.includes('KCI')) stats.kci++
        } else if (type === 'conference') {
          if (indexing === 'International Conference' || indexing === 'Scopus') stats.intlConf++
          else if (indexing === 'Domestic Conference') stats.domConf++
        }
      })
      setPubStats([{label: 'SCIE', count: stats.scie}, {label: 'SSCI', count: stats.ssci}, {label: 'A&HCI', count: stats.ahci}, {label: 'ESCI', count: stats.esci}, {label: 'Scopus', count: stats.scopus}, {label: 'Other Int\'l', count: stats.otherIntl}, {label: 'Int\'l Conf', count: stats.intlConf}, {label: 'KCI', count: stats.kci}, {label: 'Dom. Conf', count: stats.domConf}])
    }).catch(console.error)
  }, [])

  const handleCopyEmail = () => { navigator.clipboard.writeText(directorEmail); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 2000) }

  const navItems = [{label: 'Profile', path: '/members/director', icon: User}, {label: 'Scholarly', path: '/members/director/academic', icon: BookOpen}, {label: 'Activities', path: '/members/director/activities', icon: Users}]

  const projectsByYear = useMemo(() => {
    const grouped: Record<string, Project[]> = {}
    projects.forEach(p => { const year = p.period.split('–')[0].trim().slice(0, 4); if (!grouped[year]) grouped[year] = []; grouped[year].push(p) })
    return grouped
  }, [projects])
  const projectYears = useMemo(() => Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a)), [projectsByYear])
  const toggleProjectYear = (year: string) => setExpandedProjectYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year])

  const groupedLectures = useMemo(() => {
    const courseMap = new Map<string, {course: {en: string; ko: string}; schools: Set<string>; roles: Set<string>; semesters: Set<string>}>()
    lectures.forEach(l => {
      l.courses.forEach(c => {
        const key = c.en
        if (!courseMap.has(key)) courseMap.set(key, {course: c, schools: new Set(), roles: new Set(), semesters: new Set()})
        const entry = courseMap.get(key)!
        entry.schools.add(l.school); entry.roles.add(l.role)
        l.periods.forEach(p => entry.semesters.add(p))
      })
    })
    return Array.from(courseMap.values()).map(entry => ({...entry, schools: Array.from(entry.schools), roles: Array.from(entry.roles), semesters: Array.from(entry.semesters).sort((a, b) => b.localeCompare(a))}))
  }, [lectures])

  const getProjectTypeStyle = (type: string) => {
    switch (type) {
      case 'government': return {bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: Landmark}
      case 'industry': return {bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', icon: Building}
      default: return {bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: FolderKanban}
    }
  }

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{backgroundImage: `url(${banner2})`}} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B04C]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B04C]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B04C]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">Director</span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B04C]/80" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">Scholarly</h1>
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
            <Link to="/" className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110"><Home size={16} /></Link>
            <span className="text-gray-200">—</span><span className="text-sm text-gray-400 font-medium">Members</span>
            <span className="text-gray-200">—</span><span className="text-sm text-gray-400 font-medium">Director</span>
            <span className="text-gray-200">—</span><span className="text-sm text-primary font-semibold">Scholarly</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60">
        <div className="flex flex-col lg:flex-row gap-32 md:gap-48">
          {/* Sidebar */}
          <aside className="lg:w-[320px] shrink-0">
            <div className="sticky top-100 space-y-24">
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-24">
                <div className="flex flex-col items-center">
                  <div className="w-140 h-180 rounded-xl overflow-hidden mb-20 ring-4 ring-gray-100"><img src={directorImg} alt="Director" className="w-full h-full object-cover" /></div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">In Seok Choi</h2>
                  <p className="text-sm text-gray-500 mb-4">최인석</p>
                  <p className="text-sm text-primary font-medium mb-16">Assistant Professor</p>
                  <div className="w-full space-y-12">
                    <div className="flex items-center gap-12"><Mail size={16} className="text-gray-400 shrink-0" /><button onClick={handleCopyEmail} className="text-sm text-gray-600 hover:text-primary flex items-center gap-8 group">{directorEmail}{emailCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-300 group-hover:text-primary" />}</button></div>
                    <div className="flex items-center gap-12"><Phone size={16} className="text-gray-400 shrink-0" /><span className="text-sm text-gray-600">+82-31-750-xxxx</span></div>
                    <div className="flex items-start gap-12"><MapPin size={16} className="text-gray-400 shrink-0 mt-2" /><div><p className="text-sm font-semibold text-gray-800">Room 614, Gachon Hall</p><p className="text-xs text-gray-500">가천관 614호</p></div></div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-16 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Navigation</h3></div>
                <div className="p-8">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon
                    return (<Link key={item.path} to={item.path} className={`flex items-center gap-12 px-16 py-14 rounded-xl transition-all ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}><Icon size={18} /><span className="font-medium">{item.label}</span><ChevronRight size={16} className="ml-auto opacity-50" /></Link>)
                  })}
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-20">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-16">External Links</h3>
                <div className="space-y-8">
                  <a href="https://scholar.google.com/citations?user=_9R3M4IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="flex items-center gap-12 text-sm text-gray-600 hover:text-primary transition-colors"><ExternalLink size={14} />Google Scholar</a>
                  <a href="https://orcid.org/0000-0002-9556-2687" target="_blank" rel="noopener noreferrer" className="flex items-center gap-12 text-sm text-gray-600 hover:text-primary transition-colors"><ExternalLink size={14} />ORCID</a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-24">
            {/* Publication Statistics */}
            <ExpandableSection title="Publication Statistics" icon={BarChart3} defaultExpanded={true}>
              <div className="p-20 md:p-32">
                <div className="bg-gray-50 rounded-xl p-20 mb-24">
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-12">
                    {pubStats.filter(s => s.count > 0).map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-xl md:text-2xl font-bold text-primary">{stat.count}</p>
                        <p className="text-[10px] md:text-xs text-gray-500 font-medium">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-12">
                  {citationStats.map((stat) => (
                    <div key={stat.label} className="text-center p-12 bg-gray-900 rounded-xl">
                      <p className="text-xl md:text-2xl font-bold text-white">{stat.count}</p>
                      <p className="text-[10px] md:text-xs text-gray-400 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-20 text-center">
                  <Link to="/publications" className="inline-flex items-center gap-8 px-20 py-10 bg-primary/10 text-primary text-sm font-semibold rounded-xl hover:bg-primary/20 transition-colors">
                    View All Publications <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </ExpandableSection>

            {/* Professional Affiliations */}
            <ExpandableSection title="Professional Affiliations" icon={Award} defaultExpanded={true} count={affiliations.length}>
              <div className="divide-y divide-gray-100">
                {affiliations.map((aff, idx) => (
                  <div key={idx} className="p-20 md:p-24 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-16">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm md:text-base font-bold text-gray-900 mb-4">{aff.organization}</h4>
                        <p className="text-xs text-gray-500">{aff.krOrg}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-10 py-4 bg-primary/10 text-primary text-xs font-bold rounded-lg">{aff.role}</span>
                        <p className="text-xs text-gray-400 mt-8">{aff.period}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableSection>

            {/* Projects */}
            <ExpandableSection title="Projects" icon={FolderKanban} defaultExpanded={true} count={projects.length}>
              <div className="divide-y divide-gray-100">
                {projectYears.map((year) => (
                  <div key={year}>
                    <button onClick={() => toggleProjectYear(year)} className="w-full flex items-center justify-between px-20 md:px-32 py-16 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-12"><span className="text-lg font-bold text-gray-900">{year}</span><span className="px-8 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{projectsByYear[year].length}</span></div>
                      {expandedProjectYears.includes(year) ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
                    </button>
                    {expandedProjectYears.includes(year) && (
                      <div className="px-20 md:px-32 pb-20 space-y-12">
                        {projectsByYear[year].map((project, idx) => {
                          const style = getProjectTypeStyle(project.type)
                          const TypeIcon = style.icon
                          return (
                            <div key={idx} className={`p-16 md:p-20 rounded-xl border ${style.border} ${style.bg}`}>
                              <div className="flex items-start gap-12">
                                <div className={`w-40 h-40 rounded-xl flex items-center justify-center shrink-0 bg-white ${style.text}`}><TypeIcon size={18}/></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm md:text-base font-bold text-gray-900 mb-4">{project.titleEn}</p>
                                  <p className="text-xs text-gray-500 mb-8">{project.titleKo}</p>
                                  <div className="flex flex-wrap items-center gap-8">
                                    <span className="text-xs text-gray-500">{project.period}</span>
                                    <span className="text-gray-300">·</span>
                                    <span className="text-xs font-medium text-gray-600">{project.fundingAgency}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ExpandableSection>

            {/* Teaching */}
            <ExpandableSection title="Teaching" icon={GraduationCap} defaultExpanded={true} count={groupedLectures.length}>
              <div className="divide-y divide-gray-100">
                {groupedLectures.map((item, idx) => (
                  <div key={idx} className="p-20 md:p-24 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-16">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm md:text-base font-bold text-gray-900 mb-4">{item.course.en}</h4>
                        <p className="text-xs text-gray-500 mb-12">{item.course.ko}</p>
                        <div className="flex flex-wrap gap-6">
                          {item.schools.map((school, sIdx) => (<span key={sIdx} className="px-8 py-4 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-lg">{school}</span>))}
                          {item.roles.map((role, rIdx) => (<span key={rIdx} className="px-8 py-4 bg-primary/10 text-primary text-[10px] font-medium rounded-lg">{role}</span>))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-8">{item.semesters.length} Semesters</p>
                        <div className="flex flex-wrap gap-4 justify-end max-w-200">
                          {item.semesters.slice(0, 4).map((sem, sIdx) => (<span key={sIdx} className="text-[10px] text-gray-500">{sem}</span>))}
                          {item.semesters.length > 4 && <span className="text-[10px] text-gray-400">+{item.semesters.length - 4} more</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableSection>

            {/* Academic Service */}
            <ExpandableSection title="Academic Service" icon={Handshake} defaultExpanded={true}>
              <div className="p-20 md:p-32">
                {academicActivities && academicActivities.activities && academicActivities.activities.length > 0 ? (
                  <div className="space-y-24">
                    {/* Journal Reviewer */}
                    {academicActivities.activities.filter(a => a.category === 'journal').length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-16">Journal Reviewer ({academicActivities.activities.filter(a => a.category === 'journal').length})</h4>
                        <div className="flex flex-wrap gap-8">
                          {academicActivities.activities.filter(a => a.category === 'journal').map((item) => (
                            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="px-12 py-6 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Conference Reviewer */}
                    {academicActivities.activities.filter(a => a.category === 'conference').length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-16">Conference Reviewer ({academicActivities.activities.filter(a => a.category === 'conference').length})</h4>
                        <div className="space-y-12">
                          {academicActivities.activities.filter(a => a.category === 'conference').map((item) => (
                            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-12 p-16 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors">
                              <div className="flex-1"><p className="text-sm font-medium text-gray-900">{item.name}</p><p className="text-xs text-gray-500 mt-4">{item.publisher} · {item.period}</p></div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Session Chair */}
                    {academicActivities.activities.filter(a => a.category === 'chair').length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-16">Session Chair ({academicActivities.activities.filter(a => a.category === 'chair').length})</h4>
                        <div className="space-y-12">
                          {academicActivities.activities.filter(a => a.category === 'chair').map((item) => (
                            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-12 p-16 bg-[#FFF9E6] rounded-xl border border-[#D6B04C]/20 hover:bg-[#FFF5DC] transition-colors">
                              <div className="flex-1"><p className="text-sm font-medium text-gray-900">{item.name}</p>{item.name_ko && <p className="text-xs text-gray-500 mt-2">{item.name_ko}</p>}<p className="text-xs text-gray-500 mt-4">{item.type} · {item.period}</p></div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Committee */}
                    {academicActivities.activities.filter(a => a.category === 'committee').length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-16">Committee ({academicActivities.activities.filter(a => a.category === 'committee').length})</h4>
                        <div className="space-y-12">
                          {academicActivities.activities.filter(a => a.category === 'committee').map((item) => (
                            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-12 p-16 bg-[#FFF5F7] rounded-xl border border-[#FFBAC4]/30 hover:bg-[#FFECF0] transition-colors">
                              <div className="flex-1"><p className="text-sm font-medium text-gray-900">{item.name}</p>{item.name_ko && <p className="text-xs text-gray-500 mt-2">{item.name_ko}</p>}<p className="text-xs text-gray-500 mt-4">{item.type} · {item.period}</p></div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (<div className="text-center py-40 text-gray-400">No academic service data available</div>)}
              </div>
            </ExpandableSection>

            {/* Collaboration Network */}
            <ExpandableSection title="Collaboration Network" icon={Network} defaultExpanded={true}>
              <div className="p-20 md:p-24"><CollaborationNetwork/></div>
            </ExpandableSection>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorAcademicTemplate)
