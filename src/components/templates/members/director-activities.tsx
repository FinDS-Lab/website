import {memo, useState, useEffect, useMemo, useCallback, useRef} from 'react'
import {Link} from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  Award,
  Building,
  ChevronRight,
  Home,
  ChevronDown,
  ChevronUp,
  Users,
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
  X,
} from 'lucide-react'
import type {ReviewerData, AuthorsData, Publication, Mentee, HonorsData} from '@/types/data'
import {useStoreModal} from '@/store/modal'

// Types for collaboration network
type CollabPublication = {
  title: string
  titleKo: string
  year: number
  venue: string
  venueKo: string
  type: string // journal, conference, book, report 등
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
  collabPubs: CollabPublication[] // 공동 논문 목록
  breakdown: PublicationBreakdown // 유형별 분류
  coworkRate: number // 공동작업 비율
}

type NetworkLink = {
  source: string
  target: string
  weight: number
}

// Image Imports
import banner2 from '@/assets/images/banner/2.webp'
import directorImg from '@/assets/images/members/director.webp'
import logoKaist from '@/assets/images/logos/kaist.png'
import logoKyunghee from '@/assets/images/logos/kyunghee.png'
import logoGcu from '@/assets/images/logos/gcu.png'
import logoDwu from '@/assets/images/logos/dwu.png'
import logoFinds from '@/assets/images/logos/finds.png'
import logoKangnam from '@/assets/images/logos/kangnam.png'
import logoKorea from '@/assets/images/logos/korea.png'
import logoWorldquant from '@/assets/images/logos/worldquant.jpg'
import logoEy from '@/assets/images/logos/ey.png'
import logoJl from '@/assets/images/logos/jl.png'
import logoCaptima from '@/assets/images/logos/captima.png'
import logoKfac from '@/assets/images/logos/kfac.png'
import logoMensa from '@/assets/images/logos/mensa.png'
import logoField from '@/assets/images/logos/field.png'
import logoFba from '@/assets/images/logos/fba.png'
import logoDading from '@/assets/images/logos/dading.png'

const education = [
  {
    school: 'Korea Advanced Institute of Science and Technology (KAIST)',
    period: '2025.02',
    degree: 'Doctor of Philosophy (Ph.D.) in Engineering',
    field: 'Industrial and Systems Engineering',
    location: 'Korea Advanced Institute of Science and Technology (KAIST)',
    krName: '한국과학기술원 (KAIST) 산업및시스템공학 공학박사',
    advisor: 'Woo Chang Kim',
    leadership: [
      {role: 'Member', context: 'Graduate School Central Operations Committee', period: '2021.09 - 2025.01'},
      {role: 'Graduate Student Representative', context: 'Department of Industrial and Systems Engineering', period: '2021.09 - 2025.01'},
    ],
    awards: [{title: 'Best Doctoral Dissertation Award', org: 'Korean Operations Research and Management Science Society (KORMS, 한국경영과학회)'}],
    logo: logoKaist
  },
  {
    school: 'Korea Advanced Institute of Science and Technology (KAIST)',
    period: '2021.02',
    degree: 'Master of Science (M.S.)',
    field: 'Industrial and Systems Engineering',
    location: 'Korea Advanced Institute of Science and Technology (KAIST)',
    krName: '한국과학기술원 (KAIST) 산업및시스템공학 공학석사',
    advisor: 'Woo Chang Kim',
    awards: [{title: "Best Master's Thesis Award", org: 'Korean Institute of Industrial Engineers (KIIE, 대한산업공학회)'}],
    logo: logoKaist
  },
  {
    school: 'Kyung Hee University',
    period: '2018.02',
    degree: 'Bachelor of Engineering (B.E.)',
    field: 'Industrial and Management Systems Engineering',
    location: 'Kyung Hee University',
    krName: '경희대학교 산업경영공학 공학사',
    advisor: 'Jang Ho Kim, Myoung-Ju Park',
    leadership: [
      {role: 'Head of Culture & Public Relations', context: '41st Student Council, College of Engineering', period: '2017.01 - 2017.11'},
      {role: 'President', context: '7th Student Council, Department of Industrial and Management Systems Engineering', period: '2016.01 - 2016.12'},
    ],
    awards: [{title: 'Valedictorian', org: '1st out of 86 students'}],
    logo: logoKyunghee
  },
]

const employment = [
  {
    position: 'Assistant Professor',
    organization: 'Gachon University',
    period: '2026.03 – Present',
    location: 'Department of Big Data Business Management, Gachon Business School',
    krOrg: '조교수 / 가천대학교 경영대학 금융·빅데이터학부',
    logo: logoGcu
  },
  {
    position: 'Assistant Professor',
    organization: "Dongduk Women's University",
    period: '2025.09 – 2026.02',
    location: 'Division of Business Administration, College of Business',
    krOrg: '조교수 / 동덕여자대학교 경영대학 경영융합학부',
    logo: logoDwu
  },
  {position: 'Director', organization: 'FINDS Lab.', period: '2025.06 – Present', location: 'FINDS Lab.', krOrg: '디렉터 / FINDS Lab.', logo: logoFinds},
  {
    position: 'Lecturer',
    organization: 'Kangnam University',
    period: '2025.03 – 2026.02',
    location: 'Department of Electronic and Semiconductor Engineering',
    krOrg: '강사 / 강남대학교 공과대학 전자반도체공학부',
    logo: logoKangnam
  },
  {
    position: 'Lecturer',
    organization: 'Korea University',
    period: '2025.03 – 2026.02',
    location: 'Digital Business Major, Division of Convergence Business',
    krOrg: '강사 / 고려대학교 글로벌비즈니스대학 융합경영학부 디지털비즈니스전공',
    logo: logoKorea
  },
  {
    position: 'Lecturer',
    organization: 'Kyung Hee University',
    period: '2024.03 – 2024.08',
    location: 'Department of Industrial and Management Systems Engineering',
    krOrg: '강사 / 경희대학교 공과대학 산업경영공학과',
    logo: logoKyunghee
  },
  {position: 'Research Consultant', organization: 'WorldQuant Brain', period: '2022.06 – Present', location: 'WorldQuant Brain', krOrg: '연구 컨설턴트 / 월드퀀트 브레인', logo: logoWorldquant},
  {position: 'Intern', organization: 'EY Consulting', period: '2020.03 – 2020.05', location: 'Performance Improvement Department', krOrg: '인턴 / EY컨설팅 성과개선팀', logo: logoEy},
  {position: 'Founder', organization: 'JL Creatives & Contents (JL C&C)', period: '2014.06 – Present', location: 'JL C&C', krOrg: '대표 / JL C&C', logo: logoJl},
]

const affiliations = [
  {organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE) 종신회원', period: '2025.06 – Present', role: 'Lifetime Member'},
  {organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA) 종신회원', period: '2023.09 – Present', role: 'Lifetime Member'},
  {organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA) 종신회원', period: '2023.06 – Present', role: 'Lifetime Member'},
  {organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS) 종신회원', period: '2022.06 – Present', role: 'Lifetime Member'},
]

const activities = [
  {
    name: 'CAPTIMA',
    logo: logoCaptima,
    fullName: 'Computer Applications for Optima',
    generation: '',
    membership: [
      {role: 'Member', period: '2013.03. - 2018.02.'},
      {role: 'Alumni', period: '2018.03. - Present'},
    ],
    leadership: [
      {role: 'President', period: '2015.06. - 2015.12.'},
      {role: 'Vice President', period: '2013.12. - 2014.08.'},
    ],
    url: '#'
  },
  {
    name: 'KFAC',
    logo: logoKfac,
    fullName: 'KAIST Financial Analysis Club',
    generation: '25th Generation',
    membership: [
      {role: 'Member', period: '2018.03. - 2019.02.'},
      {role: 'Alumni', period: '2019.03. - Present'},
    ],
    leadership: [
      {role: 'Acting President', period: '2021.03. - 2021.08.'},
      {role: 'Session Leader', period: '2018.09. - 2019.02.'},
    ],
    url: '#'
  },
  {
    name: 'MENSA Korea',
    logo: logoMensa,
    fullName: 'MENSA Korea',
    generation: '',
    membership: [
      {role: 'Member', period: '2019.01. - Present'},
    ],
    leadership: [],
    url: '#'
  },
  {
    name: 'FIELD',
    logo: logoField,
    fullName: '전국대학생산업공학도모임 (Future Industrial Engineering Leaders and Dreamers)',
    generation: '11th - 16th Generation',
    membership: [
      {role: 'Member', period: '2019.03. - 2024.12.'},
      {role: 'Alumni', period: '2020.01. - Present'},
    ],
    leadership: [],
    url: '#'
  },
  {
    name: 'FBA Quant',
    logo: logoFba,
    fullName: 'FBA Quant',
    generation: '12th Generation',
    membership: [
      {role: 'Member', period: '2022.01. - 2022.12.'},
      {role: 'Alumni', period: '2023.01. - Present'},
    ],
    leadership: [],
    url: '#'
  },
  {
    name: 'DadingCoding',
    logo: logoDading,
    fullName: '대딩코딩',
    generation: '6th Generation',
    membership: [
      {role: 'Member', period: '2024.02. - 2024.07.'},
      {role: 'Alumni', period: '2024.08. - Present'},
    ],
    leadership: [],
    url: '#'
  },
]

const researchInterests = [
  {
    category: 'Financial Data Science',
    items: [
      {en: 'AI in Quantitative Finance & Asset Management', ko: '인공지능을 활용한 포트폴리오 최적화, 자산 배분, 알고리즘 트레이딩'},
      {en: 'Financial Time-Series Modeling & Forecasting', ko: '변동성 예측, 국면 전환 모형, 선·후행 관계 분석, 수익률 예측 등 금융 시계열 모형 연구'},
      {en: 'Household Finance & Behavioral Decision Modeling', ko: '가계 금융과 투자자 행동 분석, 행동재무학 기반 의사결정 모형화'},
    ],
  },
  {
    category: 'Business Analytics',
    items: [
      {en: 'Data Analytics for Cross-Industry & Cross-Domain Convergences', ko: '다양한 산업과 분야 간의 결합과 융합을 위한 데이터 분석'},
      {en: 'Data Visualization & Transparency in Business Analytics', ko: '복잡한 데이터를 직관적으로 표현하고 투명성을 높이는 시각화 기법'},
      {en: 'Business Insights from Data Science Techniques', ko: '시계열 모형, 그래프 기반 모형, 자연어 처리(NLP) 등 데이터 사이언스 기법을 활용한 비즈니스 인사이트 발굴'},
    ],
  },
  {
    category: 'Data-Informed Decision Making',
    items: [
      {en: 'Trustworthy Decision Systems & Optimization', ko: '신뢰할 수 있는 의사결정 시스템 설계와 최적화 기법'},
      {en: 'Risk-Aware & User-Friendly Decision Tools', ko: '금융·경영 위험을 반영하고 사용자 친화성을 갖춘 의사결정 도구'},
      {en: 'Decision Analytics for Complex Business Problems', ko: '복잡한 경영 및 투자 의사결정 문제 해결을 위한 분석 및 최적화 방법론'},
    ],
  },
]

// Collaboration Network Component
const CollaborationNetwork = memo(() => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [links, setLinks] = useState<NetworkLink[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  
  // 모바일/데스크탑에 따른 기본 zoom 값
  const getDefaultZoom = () => typeof window !== 'undefined' && window.innerWidth < 768 ? 1.6 : 1.3
  const [zoom, setZoom] = useState(getDefaultZoom)
  
  const [pan, setPan] = useState({x: 0, y: 0})
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({x: 0, y: 0})
  const animationRef = useRef<number | null>(null)
  const nodesRef = useRef<NetworkNode[]>([])

  // Load and process collaboration data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [pubsRes, authorsRes] = await Promise.all([
          fetch('/website/data/pubs.json'),
          fetch('/website/data/authors.json'),
        ])
        const pubs: Publication[] = await pubsRes.json()
        const authors: AuthorsData = await authorsRes.json()

        // Build collaboration map
        const collaborationMap = new Map<string, Map<string, number>>()
        const authorPubCount = new Map<string, number>()
        // 각 저자별 공동 논문 목록
        const authorCollabPubs = new Map<string, CollabPublication[]>()

        // 전체 논문 수 (co-work rate 계산용)
        const totalPubsCount = pubs.length

        pubs.forEach((pub) => {
          if (pub.authors.includes(1)) {
            // Only publications with director
            pub.authors.forEach((authorId) => {
              const idStr = String(authorId)
              authorPubCount.set(idStr, (authorPubCount.get(idStr) || 0) + 1)

              // 공동 논문 저장 (type 포함)
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

            // Create links between all co-authors
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

        // Get top collaborators (by number of co-authored papers with director)
        const directorCollabs = collaborationMap.get('1') || new Map()
        const topCollaborators = Array.from(directorCollabs.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 25)
          .map(([id]) => id)

        const nodesToShow = ['1', ...topCollaborators]

        // Initialize nodes with random positions
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

          // 논문 유형별 분류
          const breakdown: PublicationBreakdown = {
            journal: collabPubsList.filter(p => p.type === 'journal').length,
            conference: collabPubsList.filter(p => p.type === 'conference').length,
            book: collabPubsList.filter(p => p.type === 'book').length,
            report: collabPubsList.filter(p => p.type === 'report' || p.type === 'other').length,
          }

          // Co-work rate 계산 (Director 전체 논문 대비 공동 작업 비율)
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

        // Create links
        const networkLinks: NetworkLink[] = []
        nodesToShow.forEach((sourceId) => {
          const collabs = collaborationMap.get(sourceId)
          if (collabs) {
            collabs.forEach((weight, targetId) => {
              if (
                nodesToShow.includes(targetId) &&
                sourceId < targetId // Avoid duplicates
              ) {
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

  // Force simulation
  useEffect(() => {
    if (nodes.length === 0) return

    const simulate = () => {
      const newNodes = [...nodesRef.current]
      const centerX = 400
      const centerY = 250

      // Apply forces
      newNodes.forEach((node) => {
        // Center gravity for director
        if (node.isDirector) {
          node.vx += (centerX - node.x) * 0.1
          node.vy += (centerY - node.y) * 0.1
        } else {
          // Weak center gravity
          node.vx += (centerX - node.x) * 0.001
          node.vy += (centerY - node.y) * 0.001
        }

        // Repulsion from other nodes
        newNodes.forEach((other) => {
          if (node.id !== other.id) {
            const dx = node.x - other.x
            const dy = node.y - other.y
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const minDist = 70 // 풀네임 표시를 위해 거리 확보
            if (dist < minDist) {
              const force = ((minDist - dist) / dist) * 0.5
              node.vx += dx * force
              node.vy += dy * force
            }
          }
        })
      })

      // Apply link forces (attraction)
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

      // Update positions with velocity and damping
      newNodes.forEach((node) => {
        if (!node.isDirector) {
          node.vx *= 0.9
          node.vy *= 0.9
          node.x += node.vx
          node.y += node.vy
          // Boundary constraints
          node.x = Math.max(50, Math.min(750, node.x))
          node.y = Math.max(50, Math.min(450, node.y))
        } else {
          node.x = centerX
          node.y = centerY
          node.vx = 0
          node.vy = 0
        }
      })

      nodesRef.current = newNodes
      setNodes([...newNodes])
      animationRef.current = requestAnimationFrame(simulate)
    }

    animationRef.current = requestAnimationFrame(simulate)

    // Stop after 3 seconds
    const timeout = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }, 3000)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      clearTimeout(timeout)
    }
  }, [links, nodes.length])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsPanning(true)
    setPanStart({x: e.clientX - pan.x, y: e.clientY - pan.y})
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({x: e.clientX - panStart.x, y: e.clientY - panStart.y})
    }
  }, [isPanning, panStart])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z * 1.2, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z / 1.2, 0.5))
  }, [])

  const handleReset = useCallback(() => {
    setZoom(getDefaultZoom())
    setPan({x: 0, y: 0})
    setSelectedNode(null)
  }, [])

  const getNodeSize = useCallback((node: NetworkNode) => {
    if (node.isDirector) return 20
    return Math.max(6, Math.min(14, 5 + node.publications * 0.8))
  }, [])

  const getLinkOpacity = useCallback(
    (link: NetworkLink) => {
      if (selectedNode) {
        if (link.source === selectedNode || link.target === selectedNode) {
          return 0.8
        }
        return 0.1
      }
      if (hoveredNode) {
        if (link.source === hoveredNode || link.target === hoveredNode) {
          return 0.8
        }
        return 0.2
      }
      return 0.4
    },
    [hoveredNode, selectedNode]
  )

  const getNodeOpacity = useCallback(
    (node: NetworkNode) => {
      if (selectedNode) {
        if (node.id === selectedNode) return 1
        const connectedLinks = links.filter(
          (l) => l.source === selectedNode || l.target === selectedNode
        )
        const connectedNodeIds = connectedLinks.flatMap((l) => [l.source, l.target])
        if (connectedNodeIds.includes(node.id)) return 1
        return 0.2
      }
      if (hoveredNode) {
        if (node.id === hoveredNode) return 1
        const connectedLinks = links.filter(
          (l) => l.source === hoveredNode || l.target === hoveredNode
        )
        const connectedNodeIds = connectedLinks.flatMap((l) => [l.source, l.target])
        if (connectedNodeIds.includes(node.id)) return 1
        return 0.3
      }
      return 1
    },
    [hoveredNode, selectedNode, links]
  )

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-3xl p-60 text-center border border-gray-100">
        <div className="size-64 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-16 mx-auto animate-pulse">
          <Network size={32}/>
        </div>
        <p className="text-lg font-bold text-gray-900 mb-8">Loading Network Data...</p>
        <p className="text-sm text-gray-500">Analyzing collaboration patterns</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gray-50/50 px-32 py-20 flex items-center justify-between border-b border-gray-100">
        <div></div>
        <div className="flex items-center gap-8">
          <span className="text-xs text-gray-400 font-medium mr-12">
            {nodes.length} Collaborators · {links.length} Connections
          </span>
          <button
            onClick={handleZoomIn}
            className="size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all"
            title="Zoom In"
          >
            <ZoomIn size={16}/>
          </button>
          <button
            onClick={handleZoomOut}
            className="size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={16}/>
          </button>
          <button
            onClick={handleReset}
            className="size-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all"
            title="Reset View"
          >
            <Maximize2 size={16}/>
          </button>
        </div>
      </div>

      {/* Network Graph */}
      <div
        ref={containerRef}
        className="relative h-500 bg-gradient-to-br from-gray-50 via-white to-gray-50 cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 500"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            <radialGradient id="directorGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="100%" stopColor="#f8f8f8"/>
            </radialGradient>
            <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd6dd"/>
              <stop offset="100%" stopColor="#ffb7c5"/>
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
            </filter>
          </defs>

          {/* Links */}
          <g className="links">
            {links.map((link) => {
              const source = nodes.find((n) => n.id === link.source)
              const target = nodes.find((n) => n.id === link.target)
              if (!source || !target) return null
              return (
                <line
                  key={`${link.source}-${link.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    source.isDirector || target.isDirector
                      ? 'rgb(172,14,14)'
                      : '#ffb7c5'
                  }
                  strokeWidth={Math.max(0.5, Math.min(2.5, link.weight * 0.6))}
                  opacity={getLinkOpacity(link)}
                  className="transition-opacity duration-200"
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const size = getNodeSize(node)
              const isHighlighted =
                node.id === hoveredNode || node.id === selectedNode
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  opacity={getNodeOpacity(node)}
                  className="cursor-pointer transition-opacity duration-200"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedNode(selectedNode === node.id ? null : node.id)
                  }}
                >
                  {/* Node circle */}
                  <circle
                    r={size}
                    fill={node.isDirector ? 'url(#directorGradient)' : 'url(#nodeGradient)'}
                    stroke={node.isDirector ? 'rgb(172,14,14)' : (isHighlighted ? 'rgb(172,14,14)' : 'white')}
                    strokeWidth={node.isDirector ? 3 : (isHighlighted ? 3 : 2)}
                    filter={isHighlighted ? 'url(#glow)' : 'url(#shadow)'}
                    className="transition-all duration-200"
                  />

                  {/* Director icon */}
                  {node.isDirector && (
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fill="#d6b14d"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      IC
                    </text>
                  )}

                  {/* Label - Full Name */}
                  <text
                    y={size + 12}
                    textAnchor="middle"
                    fill={node.isDirector ? '#1e40af' : '#374151'}
                    fontSize={node.isDirector ? 9 : 7}
                    fontWeight={node.isDirector ? 700 : 600}
                    className="pointer-events-none select-none"
                  >
                    {node.name}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Tooltip / Popup */}
        {(hoveredNode || selectedNode) && (
          <div
            className={`absolute bg-white/98 max-md:w-[calc(100%-40px)] backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden ${
              selectedNode
                ? 'bottom-20 left-20 w-340 max-h-500 overflow-y-auto pointer-events-auto'
                : 'bottom-20 left-20 w-300 pointer-events-none'
            }`}
          >
            {(() => {
              const node = nodes.find(
                (n) => n.id === (selectedNode || hoveredNode)
              )
              if (!node) return null

              return (
                <>
                  {/* Header */}
                  <div className="bg-gray-50 px-20 py-16 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-12">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {node.name}
                        </p>
                        {node.nameKo && (
                          <p className="text-xs text-gray-500">{node.nameKo}</p>
                        )}
                      </div>
                      {selectedNode && (
                        <button
                          type="button"
                          onClick={() => setSelectedNode(null)}
                          className="size-24 rounded-md border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-white transition-colors flex items-center justify-center shrink-0"
                          title="Close"
                        >
                          <X size={12}/>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-16 space-y-12">
                    {/* Total Works & Co-work Rate */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-primary/5 rounded-lg p-12 text-center border border-primary/10">
                        <div className="flex items-center justify-center gap-6 mb-4">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Total Works</p>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {node.publications}
                        </p>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-12 text-center" style={{borderColor: '#ffb7c5', borderWidth: '1px'}}>
                        <div className="flex items-center justify-center gap-6 mb-4">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Co-work Rate</p>
                        </div>
                        <p className="text-2xl font-bold" style={{color: '#e8879b'}}>
                          {node.coworkRate}%
                        </p>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-lg p-12 border border-gray-100">
                      <div className="flex items-center gap-6 mb-10">
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Breakdown</p>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-8">
                          <span className="size-4 rounded-full bg-blue-500"/>
                          <span className="text-xs text-gray-600 flex-1">journal paper{node.breakdown.journal !== 1 ? 's' : ''}</span>
                          <span className="text-xs font-bold text-gray-800">{node.breakdown.journal}</span>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="size-4 rounded-full bg-purple-500"/>
                          <span className="text-xs text-gray-600 flex-1">conference proceeding{node.breakdown.conference !== 1 ? 's' : ''}</span>
                          <span className="text-xs font-bold text-gray-800">{node.breakdown.conference}</span>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="size-4 rounded-full bg-orange-500"/>
                          <span className="text-xs text-gray-600 flex-1">book{node.breakdown.book !== 1 ? 's' : ''}</span>
                          <span className="text-xs font-bold text-gray-800">{node.breakdown.book}</span>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="size-4 rounded-full bg-gray-400"/>
                          <span className="text-xs text-gray-600 flex-1">report{node.breakdown.report !== 1 ? 's' : ''}</span>
                          <span className="text-xs font-bold text-gray-800">{node.breakdown.report}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hint for hover */}
                  {!selectedNode && (
                    <div className="px-16 pb-12">
                      <p className="text-[10px] text-gray-400 text-center">
                        Click to see publications
                      </p>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-16 right-16 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg p-12 text-[10px]">
          <div className="flex items-center gap-6 mb-6">
            <div className="size-10 rounded-full bg-white flex items-center justify-center text-[6px] font-bold" style={{border: '2px solid rgb(172,14,14)', color: '#d6b14d'}}>IC</div>
            <span className="text-gray-600 font-medium">Director</span>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <div className="size-8 rounded-full" style={{background: 'linear-gradient(135deg, #ffd6dd 0%, #ffb7c5 100%)'}}/>
            <span className="text-gray-600 font-medium">Collaborator</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-1 rounded" style={{backgroundColor: 'rgb(172,14,14)'}}/>
            <span className="text-gray-600 font-medium">Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
})

CollaborationNetwork.displayName = 'CollaborationNetwork'

// Mentee 타입 with id
type MenteeWithId = Mentee & { id: string }

// 연도별 멘티 그룹
type MenteesByYear = {
  [year: string]: MenteeWithId[]
}

export const MembersDirectorActivitiesTemplate = () => {
  const [reviewerData, setReviewerData] = useState<ReviewerData | null>(null)
  const [showAllJournals, setShowAllJournals] = useState(false)
  const [showAllConferences, setShowAllConferences] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mentees, setMentees] = useState<MenteeWithId[]>([])
  const [selectedMentoringYear, setSelectedMentoringYear] = useState<string>('all')
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all')
  const [emailCopied, setEmailCopied] = useState(false)
  const [honorsData, setHonorsData] = useState<HonorsData | null>(null)
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set(['2025']))
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    awardsHonors: false,
    academicService: false,
    activities: false,
    collaborationNetwork: false,
    mentoringProgram: false,
  })
  const {showModal} = useStoreModal()

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}))
  }

  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev)
      if (newSet.has(year)) {
        newSet.delete(year)
      } else {
        newSet.add(year)
      }
      return newSet
    })
  }

  const directorEmail = 'ischoi@gachon.ac.kr'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directorEmail)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  useEffect(() => {
    // Load reviewer data
    fetch('/website/data/reviewer.json')
      .then((res) => res.json())
      .then((data: ReviewerData) => {
        setReviewerData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load reviewer data:', err)
        setLoading(false)
      })

    // Load mentees data
    fetch('/website/data/mentees.json')
      .then((res) => res.json())
      .then((data: { [id: string]: Mentee }) => {
        const menteesList = Object.entries(data).map(([id, mentee]) => ({
          id,
          ...mentee,
        }))
        setMentees(menteesList)
      })
      .catch((err) => {
        console.error('Failed to load mentees data:', err)
      })

    // Load honors data
    fetch('/website/data/honors.json')
      .then((res) => res.json())
      .then((data: HonorsData) => {
        // Filter to show only items where director is a winner
        const filteredData: HonorsData = {}
        Object.keys(data).forEach((year) => {
          const items = data[year].filter((item) => 
            item.winners?.some((w: {name: string}) => w.name.includes('최인수') || w.name.toLowerCase().includes('insu'))
          )
          if (items.length > 0) {
            filteredData[year] = items
          }
        })
        setHonorsData(filteredData)
      })
      .catch((err) => {
        console.error('Failed to load honors data:', err)
      })
  }, [])

  // 연도별 멘티 그룹화
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

  // 연도 목록 (최신순)
  const mentoringYears = useMemo(() => {
    return Object.keys(menteesByYear).sort((a, b) => Number(b) - Number(a))
  }, [menteesByYear])

  // 필터링된 멘티
  const filteredMentees = useMemo(() => {
    let result: MenteeWithId[] = []
    if (selectedMentoringYear === 'all') {
      // 중복 제거하여 전체 멘티 반환
      const uniqueMentees = new Map<string, MenteeWithId>()
      mentees.forEach((m) => uniqueMentees.set(m.id, m))
      result = Array.from(uniqueMentees.values())
    } else {
      result = menteesByYear[selectedMentoringYear] || []
    }
    
    // 대학 필터 적용
    if (selectedUniversity !== 'all') {
      result = result.filter(m => m.university === selectedUniversity)
    }
    
    // 정렬: 참여연차 많은 순 → 이름 가나다순
    result.sort((a, b) => {
      const aYears = a.participationYears.length
      const bYears = b.participationYears.length
      if (aYears !== bYears) return bYears - aYears
      return a.name.localeCompare(b.name, 'ko')
    })
    
    return result
  }, [selectedMentoringYear, selectedUniversity, mentees, menteesByYear])

  // 대학별 통계
  const universityStats = useMemo(() => {
    const stats = new Map<string, number>()
    filteredMentees.forEach((m) => {
      stats.set(m.university, (stats.get(m.university) || 0) + 1)
    })
    return Array.from(stats.entries())
      .sort((a, b) => b[1] - a[1])
  }, [filteredMentees])

  const publicationStats = useMemo(() => {
    return [
      {label: 'SCIE', count: 0},
      {label: 'SSCI', count: 0},
      {label: 'A&HCI', count: 0},
      {label: 'ESCI', count: 0},
      {label: 'Scopus', count: 0},
      {label: 'Other Int\'l', count: 0},
      {label: 'Int\'l Conf', count: 0},
      {label: 'KCI', count: 0},
      {label: 'Dom. Conf', count: 0},
    ]
  }, [])

  const citationStats = [
    {label: 'Citations', count: 127},
    {label: 'g-index', count: 10},
    {label: 'h-index', count: 7},
    {label: 'i10-index', count: 5},
  ]

  const displayedJournals = useMemo(() => {
    if (!reviewerData) return []
    return showAllJournals ? reviewerData.journals : reviewerData.journals.slice(0, 20)
  }, [reviewerData, showAllJournals])

  const displayedConferences = useMemo(() => {
    if (!reviewerData) return []
    return showAllConferences ? reviewerData.conferences : reviewerData.conferences.slice(0, 20)
  }, [reviewerData, showAllConferences])

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
            Director
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
            <span className="text-sm text-primary font-semibold">Director</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20">
        <div className="flex items-center gap-4 md:gap-8 py-16 md:py-24">
          <Link
            to="/members/director"
            className="flex items-center gap-8 px-16 md:px-24 py-12 md:py-14 rounded-full text-sm md:text-base font-semibold transition-all duration-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Users size={16} />
            Profile
          </Link>
          <Link
            to="/members/director-activities"
            className="flex items-center gap-8 px-16 md:px-24 py-12 md:py-14 rounded-full text-sm md:text-base font-semibold transition-all duration-300 bg-primary text-white shadow-lg shadow-primary/30"
          >
            <Award size={16} />
            Activities
          </Link>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
        <div className="flex flex-col lg:flex-row gap-32 md:gap-60">
          {/* Left Column: Profile Card & Quick Info */}
          <aside className="lg:w-340 xl:w-380 flex flex-col gap-24 md:gap-40 shrink-0">
        {/* Profile Card */}
            <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-20 md:p-24 shadow-sm lg:sticky lg:top-100">
              <div className="flex flex-col items-center text-center mb-24 md:mb-32">
                <div className="size-140 md:size-180 bg-gray-100 rounded-2xl overflow-hidden mb-16 md:mb-24 shadow-inner border border-gray-50">
                  <img
                    src={directorImg}
                alt="Prof. Insu Choi"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-64">👨‍🏫</div>'
                }}
              />
            </div>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
                  Insu Choi<span className="text-sm md:text-base font-medium text-gray-400 ml-4">, Ph.D.</span>
                </h2>
                <p className="text-base md:text-lg text-gray-500 font-medium">최인수</p>
              </div>

              <div className="flex flex-col gap-16 md:gap-20">
                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Briefcase size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Position</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Director</p>
                    <p className="text-[10px] md:text-xs text-gray-500">FINDS Lab.</p>
                  </div>
                </div>

                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Building size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Affiliation</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Assistant Professor</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Gachon University</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Department of Big Data Business Management</p>
                  </div>
                </div>

                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <MapPin size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Office</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">Room 706, Humanities Hall</p>
                    <p className="text-[10px] md:text-xs text-gray-500">인문관 706호</p>
                  </div>
                </div>

                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Mail size={16}/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</p>
                    <div className="flex items-center gap-8">
                      <a href={`mailto:${directorEmail}`} className="text-xs md:text-sm font-semibold text-primary hover:underline break-all">
                        {directorEmail}
                      </a>
                      <button
                        onClick={handleCopyEmail}
                        className="size-24 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors shrink-0"
                        title="Copy email"
                      >
                        {emailCopied ? (
                          <Check size={12} className="text-green-500"/>
                        ) : (
                          <Copy size={12} className="text-gray-400"/>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-12 group">
                  <div className="size-36 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Phone size={16}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800">02-940-4424</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 md:gap-12 mt-24 md:mt-32">
                <button
                  onClick={() => showModal({
                    title: 'Curriculum Vitae',
                    maxWidth: '1000px',
                    children: <div className="p-40 text-center text-gray-500">CV content goes here...</div>
                  })}
                  className="flex items-center justify-center gap-6 py-12 bg-primary text-white text-xs md:text-sm font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  View CV <ExternalLink size={14}/>
                </button>
                <a
                  href="https://scholar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-6 py-12 bg-gray-900 text-white text-xs md:text-sm font-bold rounded-xl hover:bg-gray-800 transition-all"
                >
                  Scholar <ExternalLink size={14}/>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Activities Only */}
          <main className="flex-1 flex flex-col gap-40 md:gap-56 min-w-0">
            {/* Awards & Honors */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('awardsHonors')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Awards & Honors</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.awardsHonors ? 'rotate-180' : ''}`}/>
              </button>

              {expandedSections.awardsHonors && (
                <div className="border-t border-gray-100 p-20 md:p-24">
                  {!honorsData || Object.keys(honorsData).length === 0 ? (
                    <div className="py-16 text-center text-sm text-gray-400">
                      No awards data available
                    </div>
                  ) : (
                    <>
                      {/* Summary Stats */}
                      <div className="flex items-center gap-16 mb-20">
                        <div className="flex items-center gap-8">
                          <Award size={18} className="text-primary" />
                          <span className="text-sm font-bold text-gray-900">
                            Total: {Object.values(honorsData).reduce((acc, items) => acc + items.length, 0)}
                          </span>
                        </div>
                      </div>

                      {/* Timeline by Year */}
                      <div className="space-y-12">
                        {Object.keys(honorsData).sort((a, b) => Number(b) - Number(a)).map((year) => {
                          const items = honorsData[year]
                          const awards = items.filter((item) => item.type === 'award')
                          const honors = items.filter((item) => item.type === 'honor')
                          const isExpanded = expandedYears.has(year)

                          return (
                            <div key={year} className="border border-gray-100 rounded-xl overflow-hidden">
                              {/* Year Header - Clickable */}
                              <button
                                onClick={() => toggleYear(year)}
                                className="w-full flex items-center justify-between px-16 py-12 bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-12">
                                  <span className="text-base font-bold text-gray-900">{year}</span>
                                  <div className="flex items-center gap-6">
                                    {awards.length > 0 && (
                                      <span className="px-8 py-2 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                                        🏆 {awards.length}
                                      </span>
                                    )}
                                    {honors.length > 0 && (
                                      <span className="px-8 py-2 text-[10px] font-bold rounded-full" style={{backgroundColor: 'rgba(172,14,14,0.1)', color: 'rgb(172,14,14)'}}>
                                        🎓 {honors.length}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={18} 
                                  className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                              </button>

                              {/* Items - Collapsible */}
                              {isExpanded && (
                                <div className="divide-y divide-gray-50">
                                  {items.map((item, idx) => (
                                    <div key={idx} className="px-16 py-12 hover:bg-gray-50/50 transition-colors">
                                      <div className="flex items-start gap-12">
                                        <span className="text-lg shrink-0">{item.icon}</span>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-8">
                                            <div className="min-w-0">
                                              <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                              <p className="text-xs text-gray-600 mt-2">{item.event}</p>
                                              <p className="text-[10px] text-gray-400 mt-2">{item.organization}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium shrink-0 whitespace-nowrap">{item.date}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>

            {/* Academic Service */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('academicService')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Academic Service</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.academicService ? 'rotate-180' : ''}`}/>
              </button>

              {expandedSections.academicService && (
                <>
                  {loading ? (
                    <div className="p-40 text-center border-t border-gray-100">
                      <p className="text-sm text-gray-400 animate-pulse">Loading reviewer data...</p>
                    </div>
                  ) : reviewerData ? (
                    <div className="border-t border-gray-100">
                      {/* Editorial Board Memberships */}
                      <div className="p-24">
                        <div className="flex items-center gap-8 mb-16">
                          <p className="text-sm font-bold text-gray-900">Editorial Board Memberships</p>
                          <span className="px-8 py-2 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-full">0</span>
                        </div>
                        <div className="py-16 text-center text-sm text-gray-400">
                          Coming soon...
                        </div>
                      </div>

                      {/* Conference & Workshop Organizing Committee */}
                      <div className="p-24 bg-gray-50/50 border-t border-gray-100">
                        <div className="flex items-center gap-8 mb-16">
                          <p className="text-sm font-bold text-gray-900">Conference & Workshop Organizing Committee</p>
                          <span className="px-8 py-2 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-full">0</span>
                        </div>
                        <div className="py-16 text-center text-sm text-gray-400">
                          Coming soon...
                        </div>
                      </div>

                      {/* Advisory Board & External Committee Memberships */}
                      <div className="p-24 border-t border-gray-100">
                        <div className="flex items-center gap-8 mb-16">
                          <p className="text-sm font-bold text-gray-900">Advisory Board & External Committee Memberships</p>
                          <span className="px-8 py-2 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-full">0</span>
                        </div>
                        <div className="py-16 text-center text-sm text-gray-400">
                          Coming soon...
                        </div>
                      </div>

                      {/* Journal Reviewer */}
                      <div className="p-24 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-16">
                          <div className="flex items-center gap-8">
                            <p className="text-sm font-bold text-gray-900">Journal Reviewer</p>
                            <span className="px-8 py-2 bg-primary text-white text-[10px] font-bold rounded-full">{reviewerData.journals.length}</span>
                          </div>
                          {reviewerData.journals.length > 20 && (
                            <button
                              onClick={() => setShowAllJournals(!showAllJournals)}
                              className="text-xs text-primary font-medium flex items-center gap-4 hover:underline"
                            >
                              {showAllJournals ? 'Show Less' : 'Show All'}
                              {showAllJournals ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                          {displayedJournals.map((journal) => (
                            <a
                              key={journal.id}
                              href={journal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex flex-col items-center justify-center px-8 py-10 rounded-xl text-center transition-all hover:shadow-md ${
                                journal.type === 'SCIE' || journal.type === 'SSCI' ? 'bg-primary/10 hover:bg-primary/20' :
                                  journal.type === 'ESCI' || journal.type === 'SCOPUS' ? 'bg-amber-50 hover:bg-amber-100' :
                                    'bg-gray-100 hover:bg-gray-200'
                              }`}
                              title={`${journal.name} (${journal.type}, since ${journal.since})`}
                            >
                              <span className={`text-[10px] md:text-[11px] font-medium leading-tight line-clamp-2 mb-6 ${
                                journal.type === 'SCIE' || journal.type === 'SSCI' ? 'text-primary' :
                                  journal.type === 'ESCI' || journal.type === 'SCOPUS' ? 'text-amber-700' :
                                    'text-gray-600'
                              }`}>{journal.name}</span>
                              <span className={`px-6 py-1 rounded text-[9px] font-bold ${
                                journal.type === 'SCIE' || journal.type === 'SSCI' ? 'bg-primary text-white' :
                                  journal.type === 'ESCI' || journal.type === 'SCOPUS' ? 'bg-amber-500 text-white' :
                                    'bg-gray-400 text-white'
                              }`}>
                                {journal.type}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Conference Reviewer */}
                      <div className="p-24 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-16">
                          <div className="flex items-center gap-8">
                            <p className="text-sm font-bold text-gray-900">Conference Reviewer</p>
                            <span className="px-8 py-2 bg-primary text-white text-[10px] font-bold rounded-full">{reviewerData.conferences.length}</span>
                          </div>
                          {reviewerData.conferences.length > 20 && (
                            <button
                              onClick={() => setShowAllConferences(!showAllConferences)}
                              className="text-xs text-primary font-medium flex items-center gap-4 hover:underline"
                            >
                              {showAllConferences ? 'Show Less' : 'Show All'}
                              {showAllConferences ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                          {displayedConferences.map((conf) => (
                            <a
                              key={conf.id}
                              href={conf.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center px-8 py-10 rounded-xl text-center transition-all hover:shadow-md bg-gray-50 hover:bg-gray-100"
                              title={conf.period}
                            >
                              <span className="text-[10px] md:text-[11px] font-medium leading-tight line-clamp-2 mb-6 text-gray-700">{conf.name}</span>
                              <span className="px-6 py-1 rounded text-[9px] font-bold bg-gray-400 text-white">
                                CONF
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </section>

            {/* Activities */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('activities')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Activities</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.activities ? 'rotate-180' : ''}`}/>
              </button>

              {expandedSections.activities && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 p-20 md:p-24 border-t border-gray-100">
                {activities.map((act) => (
                  <button
                    key={act.name}
                    onClick={() => showModal({
                      maxWidth: '400px',
                      children: (
                        <div className="text-center">
                          {/* Logo */}
                          <div className="size-100 bg-gray-50 rounded-2xl p-16 flex items-center justify-center mx-auto mb-20">
                            <img src={act.logo} alt={act.name} className="w-full h-full object-contain"/>
                          </div>

                          {/* Name */}
                          <h3 className="text-2xl font-bold text-gray-900 mb-8">{act.name}</h3>
                          <p className="text-sm text-gray-500 mb-8">{act.fullName}</p>

                          {/* Generation */}
                          {act.generation && (
                            <p className="text-primary font-bold text-sm mb-24">{act.generation}</p>
                          )}

                          {/* Membership */}
                          {act.membership.length > 0 && (
                            <div className="border-t border-gray-100 pt-20 space-y-8">
                              {act.membership.map((r, idx) => (
                                <div key={idx} className="flex items-center justify-between px-16 py-12 bg-gray-50 rounded-xl">
                                  <span className="font-bold text-gray-700">{r.role}</span>
                                  <span className="text-sm text-gray-500">{r.period}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Leadership */}
                          {act.leadership.length > 0 && (
                            <div className="mt-20 pt-20 border-t border-gray-100">
                              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-12">Leadership</h4>
                              <div className="space-y-8">
                                {act.leadership.map((r, idx) => (
                                  <div key={idx} className="flex items-center justify-between px-16 py-12 bg-primary/5 rounded-xl border border-primary/10">
                                    <span className="font-bold text-primary">{r.role}</span>
                                    <span className="text-sm text-gray-500">{r.period}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    className="flex items-center gap-16 bg-white border border-gray-100 rounded-xl p-20 hover:shadow-lg hover:border-primary/30 transition-all group text-left"
                  >
                    <div className="size-56 bg-gray-50 rounded-xl p-8 flex items-center justify-center group-hover:bg-primary/5 transition-colors shrink-0">
                      <img src={act.logo} alt={act.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{act.name}</h4>
                      <p className="text-xs text-gray-400 mt-2 truncate">{act.fullName}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors shrink-0"/>
                  </button>
                ))}
                </div>
              )}
            </section>

            {/* Collaboration Network */}
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('collaborationNetwork')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
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
              <button
                onClick={() => toggleSection('mentoringProgram')}
                className="w-full flex items-center justify-between p-20 md:p-24 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Mentoring Program</h3>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSections.mentoringProgram ? 'rotate-180' : ''}`}/>
              </button>

              {expandedSections.mentoringProgram && (
                <div className="border-t border-gray-100">
                {/* Header with Stats */}
                <div className="bg-gray-50/50 px-20 md:px-32 py-24 border-b border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-primary">{mentees.length}</p>
                      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-4">Total Mentees</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-gray-700">{mentoringYears.length}</p>
                      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-4">Years Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold" style={{color: '#ffb7c5'}}>
                        {menteesByYear['2025']?.length || 0}
                      </p>
                      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-4">Current (2025)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-primary">
                        {new Set(mentees.map(m => m.university)).size}
                      </p>
                      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-4">Universities</p>
                    </div>
                  </div>
                </div>

                {/* Year Filter */}
                <div className="px-20 md:px-32 py-16 border-b border-gray-100 flex items-center gap-8 md:gap-12 overflow-x-auto">
                  <button
                    onClick={() => setSelectedMentoringYear('all')}
                    className={`px-12 md:px-16 py-6 md:py-8 rounded-full text-[11px] md:text-xs font-bold transition-all shrink-0 ${
                      selectedMentoringYear === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({mentees.length})
                  </button>
                  {mentoringYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedMentoringYear(year)}
                      className={`px-12 md:px-16 py-6 md:py-8 rounded-full text-[11px] md:text-xs font-bold transition-all shrink-0 ${
                        selectedMentoringYear === year
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {year} ({menteesByYear[year]?.length || 0})
                    </button>
                  ))}
                </div>

                {/* University Distribution - Clickable Filter */}
                {universityStats.length > 0 && (
                  <div className="px-20 md:px-32 py-16 border-b border-gray-100 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-12">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">University Distribution</p>
                      {selectedUniversity !== 'all' && (
                        <button
                          onClick={() => setSelectedUniversity('all')}
                          className="text-[10px] text-primary font-medium hover:underline"
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-6 md:gap-8">
                      {universityStats.map(([univ, count]) => (
                        <button
                          key={univ}
                          onClick={() => setSelectedUniversity(selectedUniversity === univ ? 'all' : univ)}
                          className={`px-10 md:px-12 py-4 md:py-6 rounded-full text-[11px] md:text-xs font-medium transition-all ${
                            selectedUniversity === univ
                              ? 'bg-primary text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          {univ} <span className={selectedUniversity === univ ? 'font-bold' : 'text-primary font-bold'}>({count})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentee List */}
                <div className="max-h-400 overflow-y-auto">
                  {filteredMentees.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {filteredMentees.map((mentee) => (
                        <div
                          key={mentee.id}
                          className="px-20 md:px-32 py-12 md:py-16 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-12 md:gap-16">
                            <div className="size-36 md:size-40 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shrink-0" style={{backgroundColor: 'rgba(255,183,197,0.2)', color: 'rgb(172,14,14)'}}>
                              {mentee.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900">{mentee.name}</p>
                              <p className="text-[11px] md:text-xs text-gray-500 truncate">
                                {mentee.university} · {mentee.department}
                              </p>
                            </div>
                          </div>
                          <div className="flex max-md:flex-col max-md:items-end items-center gap-8 md:gap-12 shrink-0">
                            <span className="text-[10px] font-bold text-gray-400">
                              {mentee.entryYear}학번
                            </span>
                            <div className="flex gap-4 flex-wrap justify-end">
                              {mentee.participationYears.map((year) => (
                                <span
                                  key={year}
                                  className={`px-6 md:px-8 py-2 rounded text-[10px] font-bold ${
                                    year === '2025'
                                      ? ''
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                  style={year === '2025' ? {backgroundColor: 'rgba(255,183,197,0.3)', color: 'rgb(172,14,14)'} : {}}
                                >
                                  {year}
                                </span>
                              ))}
                            </div>
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

                {/* Footer */}
                <div className="px-20 md:px-32 py-12 md:py-16 bg-gray-50/50 border-t border-gray-100">
                  <p className="text-[11px] md:text-xs text-gray-500">
                    Showing <span className="font-bold text-gray-700">{filteredMentees.length}</span> mentee{filteredMentees.length !== 1 ? 's' : ''}
                    {selectedMentoringYear !== 'all' && <span className="text-primary"> in {selectedMentoringYear}</span>}
                    {selectedUniversity !== 'all' && <span className="text-primary"> from {selectedUniversity}</span>}
                  </p>
                </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </section>
    </div>
  )
}

export default memo(MembersDirectorActivitiesTemplate)
