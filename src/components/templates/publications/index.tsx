import { memo, useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  Home,
  FileText,
  MessageSquare,
  BookOpen,
  FileCheck,
  BarChart3,
  Copy,
  Check,
} from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import type { Publication, AuthorsData } from '@/types/data'

// Image Imports
import banner3 from '@/assets/images/banner/3.webp'
import pubIcon1 from '@/assets/images/icons/publications/1.png'
import pubIcon2 from '@/assets/images/icons/publications/2.png'
import pubIcon3 from '@/assets/images/icons/publications/3.png'
import pubIcon4 from '@/assets/images/icons/publications/4.png'
import pubIcon5 from '@/assets/images/icons/publications/5.png'
import pubIcon6 from '@/assets/images/icons/publications/6.png'
import pubIcon7 from '@/assets/images/icons/publications/7.png'
import pubIcon8 from '@/assets/images/icons/publications/8.png'

const pubIcons = [pubIcon1, pubIcon2, pubIcon3, pubIcon4, pubIcon5, pubIcon6, pubIcon7, pubIcon8]

// 필터 모달 컴포넌트
const FilterModal = ({
  filters,
  onChange,
  onReset,
  onClose
}: {
  filters: {
    type: string[];
    indexing: string[];
    conference: string[];
    presentation: string[];
  };
  onChange: (key: keyof typeof filters, value: string) => void;
  onReset: () => void;
  onClose: () => void;
}) => {
  const sections = [
    {
      key: 'type' as const,
      label: 'Publication Type',
      options: ['Journal', 'Conference', 'Book', 'Report']
    },
    {
      key: 'indexing' as const,
      label: 'Journal Indexing',
      options: ['SCIE', 'SSCI', 'A&HCI', 'ESCI', 'Scopus', 'Other International', 'KCI Excellent', 'KCI Accredited', 'Other Domestic', 'Preprint']
    },
    {
      key: 'conference' as const,
      label: 'Conference',
      options: ['International Conference', 'Domestic Conference']
    },
    {
      key: 'presentation' as const,
      label: 'Presentation Type',
      options: ['Oral', 'Poster']
    }
  ]

  return (
    <div className="flex flex-col gap-20 p-20">
      {sections.map((section) => (
        <div key={section.key} className="flex flex-col gap-16">
          <h4 className="text-base font-bold text-gray-900">{section.label}</h4>
          <div className="flex flex-wrap gap-8">
            {section.options.map((option) => {
              const isActive = filters[section.key].includes(option)
              return (
                <button
                  key={option}
                  onClick={() => {
                    onChange(section.key, option)
                    onClose()
                  }}
                  className={`px-16 py-8 rounded-lg text-sm font-medium transition-all border ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-[#7f8894] border-[#f0f0f0] hover:border-primary/30 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-16 border-t border-gray-100">
        <button
          onClick={onReset}
          className="px-16 py-8 text-sm font-medium text-gray-400 hover:text-primary transition-colors"
        >
          Reset all filters
        </button>
      </div>
    </div>
  )
}

// 인용 모달 컴포넌트
const CitationModal = ({ citation }: { citation: Publication['citations'] }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const formats = [
    { key: 'apa', label: 'APA' },
    { key: 'mla', label: 'MLA' },
    { key: 'chicago', label: 'Chicago' },
    { key: 'harvard', label: 'Harvard' },
    { key: 'vancouver', label: 'Vancouver' },
    { key: 'korean', label: 'Korean' },
    { key: 'bibtex', label: 'BibTeX' },
  ]

  return (
    <div className="flex flex-col gap-24 p-24">
      {formats.map((format) => {
        const text = citation[format.key as keyof typeof citation]
        if (!text) return null

        return (
          <div key={format.key} className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold uppercase tracking-wider ${format.key === 'bibtex' ? 'text-primary' : 'text-gray-900'}`}>{format.label}</span>
              <button
                onClick={() => handleCopy(text, format.key)}
                className="flex items-center gap-4 text-xs font-medium text-primary hover:underline"
              >
                {copiedKey === format.key ? (
                  <>
                    <Check size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className={`p-16 rounded-xl border text-sm leading-relaxed break-words ${
              format.key === 'bibtex' 
                ? 'bg-gray-900 font-mono text-xs border-gray-700 whitespace-pre-wrap'
                : 'bg-gray-50 text-gray-600 border-gray-100'
            }`}
              style={format.key === 'bibtex' ? {color: '#D6B04C'} : undefined}
              dangerouslySetInnerHTML={format.key !== 'bibtex' ? {__html: text} : undefined}
            >
              {format.key === 'bibtex' ? text : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 저자 역할 데이터
const authorshipRemarks = [
  { label: '연구 책임자', subLabel: 'Principal Investigator' },
  { label: '책임 연구원', subLabel: 'Leading Researcher' },
  { label: '참여 연구원', subLabel: 'Researcher' },
  { label: '지도교수', subLabel: 'Advisor' },
  { label: '제1저자', subLabel: 'First Author' },
  { label: '제2저자 / 공동저자', subLabel: 'Second / Co-author' },
  { label: '제3저자', subLabel: 'Third Author' },
  { label: '교신저자', subLabel: 'Corresponding Author' },
]

export const PublicationsTemplate = () => {
  const [searchParams] = useSearchParams()
  const [publications, setPublications] = useState<Publication[]>([])
  const [authors, setAuthors] = useState<AuthorsData>({})
  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('author') || '')
  const [filters, setFilters] = useState<{
    type: string[];
    indexing: string[];
    conference: string[];
    presentation: string[];
  }>({
    type: [],
    indexing: [],
    conference: [],
    presentation: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  const handleFilterChange = useCallback((key: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = prev[key]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }, [])

  const handleFilterReset = useCallback(() => {
    setFilters({ type: [], indexing: [], conference: [], presentation: [] })
  }, [])

  useEffect(() => {
    const safeJsonFetch = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      // Trailing commas 제거 (사람이 작성한 JSON 대응)
      const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
      return JSON.parse(cleaned)
    }

    const baseUrl = import.meta.env.BASE_URL || '/'
    Promise.all([
      safeJsonFetch(`${baseUrl}data/pubs.json`),
      safeJsonFetch(`${baseUrl}data/authors.json`),
    ])
      .then(([pubsData, authorsData]) => {
        setPublications(pubsData)
        setAuthors(authorsData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load publications data:', err)
        setLoading(false)
      })
  }, [])

  // 타입별 순번 계산 (오래된 것부터 1번, 최신일수록 높은 번호)
  const publicationNumbers = useMemo(() => {
    const numberMap: Record<string, string> = {}
    const typeCounters: Record<string, number> = {
      journal: 0,
      conference: 0,
      book: 0,
      report: 0,
    }
    const typePrefix: Record<string, string> = {
      journal: 'J',
      conference: 'C',
      book: 'B',
      report: 'R',
    }

    // 날짜순 정렬 (오래된 것부터)
    const sorted = [...publications].sort((a, b) => {
      const dateA = new Date(a.published_date).getTime()
      const dateB = new Date(b.published_date).getTime()
      return dateA - dateB
    })

    // 타입별 번호 매기기
    sorted.forEach((pub) => {
      typeCounters[pub.type] = (typeCounters[pub.type] || 0) + 1
      const prefix = typePrefix[pub.type] || pub.type.charAt(0).toUpperCase()
      const key = `${pub.year}-${pub.title}-${pub.published_date}`
      numberMap[key] = `${prefix}${typeCounters[pub.type]}`
    })

    return numberMap
  }, [publications])

  const getPublicationNumber = useCallback((pub: Publication) => {
    const key = `${pub.year}-${pub.title}-${pub.published_date}`
    return publicationNumbers[key] || pub.code_label || ''
  }, [publicationNumbers])

  const statistics = useMemo(() => {
    let journals = 0
    let conferences = 0
    let books = 0
    let reports = 0

    publications.forEach((pub) => {
      if (pub.type === 'journal') journals++
      else if (pub.type === 'conference') conferences++
      else if (pub.type === 'book') books++
      else if (pub.type === 'report') reports++
    })

    return [
      { label: journals === 1 ? 'Journal Paper' : 'Journal Papers', count: journals, icon: FileText, color: '#D6B04C' }, // Gold for journals
      { label: conferences === 1 ? 'Conference' : 'Conferences', count: conferences, icon: MessageSquare, color: '#AC0E0E' }, // Red for conferences
      { label: books === 1 ? 'Book' : 'Books', count: books, icon: BookOpen, color: '#E8D688' }, // Light yellow for books
      { label: reports === 1 ? 'Report' : 'Reports', count: reports, icon: FileCheck, color: '#FFBAC4' }, // Sakura for reports
      { label: publications.length === 1 ? 'Total Output' : 'Total Outputs', count: publications.length, icon: BarChart3, color: '#4A4A4A' }, // Dark gray for total
    ]
  }, [publications])

  const getAuthorNames = useCallback(
    (authorIds: number[], authorMarks: string[]) => {
      return authorIds.map((id, idx) => {
        const author = authors[String(id)]
        const mark = authorMarks[idx] || ''
        if (author) {
          return { name: author.ko, mark }
        }
        return { name: `Unknown (${id})`, mark }
      })
    },
    [authors]
  )

  const filteredPublications = useMemo(() => {
    let result = publications

    // 검색어 필터링
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter((pub) => {
        const titleMatch = pub.title?.toLowerCase().includes(term) || pub.title_ko?.toLowerCase().includes(term)
        const venueMatch = pub.venue?.toLowerCase().includes(term) || pub.venue_ko?.toLowerCase().includes(term)
        const authorMatch = pub.authors?.some((id) => {
          const author = authors[String(id)]
          return author && (author.en.toLowerCase().includes(term) || author.ko.toLowerCase().includes(term))
        })
        return titleMatch || venueMatch || authorMatch
      })
    }

    // 타입 필터링
    if (filters.type.length > 0) {
      result = result.filter((pub) => filters.type.some(t => t.toLowerCase() === pub.type.toLowerCase()))
    }

    // 인덱싱 필터링
    if (filters.indexing.length > 0) {
      result = result.filter((pub) => {
        if (!pub.indexing_group) return false
        return filters.indexing.includes(pub.indexing_group)
      })
    }

    // 컨퍼런스 필터링
    if (filters.conference.length > 0) {
      result = result.filter((pub) => {
        if (!pub.indexing_group) return false
        return filters.conference.includes(pub.indexing_group)
      })
    }

    // Presentation 타입 필터링
    if (filters.presentation.length > 0) {
      result = result.filter((pub) => {
        if (!pub.presentation_type) return false
        return filters.presentation.some(p => p.toLowerCase() === pub.presentation_type)
      })
    }

    return result
  }, [publications, searchTerm, authors, filters])

  const publicationsByYear = useMemo(() => {
    const grouped: { [year: number]: Publication[] } = {}
    filteredPublications.forEach((pub) => {
      if (!grouped[pub.year]) grouped[pub.year] = []
      grouped[pub.year].push(pub)
    })
    
    // Sort each year's publications by date (newest first), then by number descending for same date
    Object.keys(grouped).forEach((year) => {
      grouped[Number(year)].sort((a, b) => {
        const dateA = new Date(a.published_date).getTime()
        const dateB = new Date(b.published_date).getTime()
        if (dateB !== dateA) return dateB - dateA // Newest first
        // For same date, sort by publication number descending (higher number first)
        const keyA = `${a.year}-${a.title}-${a.published_date}`
        const keyB = `${b.year}-${b.title}-${b.published_date}`
        const numA = publicationNumbers[keyA] || ''
        const numB = publicationNumbers[keyB] || ''
        const extractNum = (s: string) => parseInt(s.replace(/[^\d]/g, '')) || 0
        return extractNum(numB) - extractNum(numA) // Higher number first
      })
    })
    
    return grouped
  }, [filteredPublications, publicationNumbers])

  const sortedYears = useMemo(() => {
    const years = Object.keys(publicationsByYear).map(Number)
    return years.sort((a, b) => b - a)
  }, [publicationsByYear])

  // 가장 최신 연도를 기본으로 펼침
  useEffect(() => {
    if (sortedYears.length > 0) {
      setExpandedYear(sortedYears[0])
    }
  }, [sortedYears])

  const getYearStats = useCallback(
    (year: number) => {
      const pubs = publicationsByYear[year] || []
      let journals = 0
      let conferences = 0
      let reports = 0
      let books = 0

      pubs.forEach((pub) => {
        if (pub.type === 'journal') journals++
        else if (pub.type === 'conference') conferences++
        else if (pub.type === 'report') reports++
        else if (pub.type === 'book') books++
      })

      return { journals, conferences, reports, books }
    },
    [publicationsByYear]
  )

  return (
    <div className="flex flex-col bg-white">
      {/* Banner - About FINDS 스타일 */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner3})` }}
        />
        
        {/* Luxurious Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B04C]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Floating Accent */}
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B04C]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B04C]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Research Output
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B04C]/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Publications
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
            <span className="text-sm text-primary font-semibold">Publications</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-40 md:py-60 pb-60 md:pb-80 px-16 md:px-20">
        <div className="max-w-1480 mx-auto flex flex-col gap-24 md:gap-40">
          {/* Statistics Section - Red Dot Style */}
          <div className="flex flex-col gap-16 md:gap-24">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
              <span className="w-8 h-8 rounded-full bg-primary" />
              Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: stat.color}}>{stat.count}</span>
                    <div className="flex items-center gap-6">
                      <stat.icon className="size-14 md:size-16" style={{color: stat.color, opacity: 0.7}} />
                      <span className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Authorship Remarks Section */}
          <div className="flex flex-col gap-12 md:gap-20">
            <div className="flex items-center gap-8">
              <h2 className="text-xl md:text-[26px] font-semibold text-gray-900">Authorship Remarks</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20">
              {authorshipRemarks.map((item, index) => {
                // FINDS Lab color palette for icons
                const colors = ['#D6B04C', '#D6B04C', '#D6C360', '#D6B04C', '#D6B04C', '#E8D688', '#726A69', '#AC0E0E']
                const bgColors = ['rgba(214,176,76,0.15)', 'rgba(214,176,76,0.15)', 'rgba(214,195,96,0.15)', 'rgba(214,176,76,0.15)', 'rgba(214,176,76,0.15)', 'rgba(232,214,136,0.15)', 'rgba(114,106,105,0.15)', 'rgba(172,14,14,0.15)']
                return (
                  <div
                    key={index}
                    className="flex items-center gap-8 md:gap-16 px-12 md:px-20 py-12 md:py-20 bg-white border border-gray-100 rounded-xl md:rounded-2xl shadow-sm hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default"
                  >
                    <div 
                      className="size-32 md:size-46 flex-shrink-0 rounded-lg flex items-center justify-center"
                      style={{backgroundColor: bgColors[index]}}
                    >
                      <img
                        src={pubIcons[index]}
                        alt={item.label}
                        className="w-[70%] h-[70%] object-contain"
                        style={{filter: `drop-shadow(0 0 0 ${colors[index]})`}}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-base font-semibold text-gray-900">{item.label}</span>
                      <span className="text-[10px] md:text-xs text-gray-500 hidden sm:block">{item.subLabel}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-12 md:gap-20 relative z-30">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-full sm:w-auto flex items-center justify-center gap-8 px-12 md:px-16 py-12 md:py-16 border rounded-xl text-sm md:text-base transition-all ${
                  isFilterOpen || filters.type.length > 0 || filters.indexing.length > 0 || filters.conference.length > 0 || filters.presentation.length > 0
                    ? 'bg-primary/5 border-primary text-primary font-medium'
                    : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                Filters
                <SlidersHorizontal className="size-16 md:size-20" />
              </button>

              {/* Filter Popup */}
              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute top-[calc(100%+12px)] left-0 w-[calc(100vw-32px)] sm:w-[600px] lg:w-[1000px] max-w-[calc(100vw-32px)] bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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
                placeholder="Search by title, author, venue..."
                className="flex-1 text-sm md:text-base text-gray-700 outline-none min-w-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                  }
                }}
              />
              <Search className="size-16 md:size-20 text-gray-500 shrink-0 ml-8" />
            </div>
            <div className="px-12 md:px-16 py-12 md:py-16 bg-gray-50 border border-gray-100 rounded-xl text-sm md:text-base font-medium text-gray-500 text-center shrink-0">
              {filteredPublications.length} of {publications.length}
            </div>
          </div>

          {/* Year List */}
          {loading ? (
            <div className="bg-gray-50 rounded-2xl p-60 text-center">
              <p className="text-md text-gray-500">Loading publications...</p>
            </div>
          ) : sortedYears.length > 0 ? (
            <div className="flex flex-col gap-16">
              {sortedYears.map((year) => {
                const stats = getYearStats(year)
                const pubs = publicationsByYear[year] || []
                const currentYear = new Date().getFullYear()
                const isCurrentYear = year === currentYear

                return (
                  <div key={year} className={`border rounded-2xl overflow-hidden shadow-sm ${isCurrentYear ? 'border-[#D6C360]' : 'border-gray-100'}`}>
                    <button
                      onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                      className={`w-full flex items-center justify-between px-24 py-20 transition-colors ${
                        isCurrentYear 
                          ? 'bg-[#FFF3CC] hover:bg-[#FFEB99]' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-12">
                          <span className={`text-lg font-semibold ${isCurrentYear ? 'text-[#9A7D1F]' : 'text-gray-900'}`}>{year}</span>
                          {isCurrentYear && (
                            <span className="px-8 py-2 bg-[#D6B04C] text-white text-[10px] md:text-xs font-semibold rounded-full">NEW</span>
                          )}
                        </div>
                        <span className={`text-base max-md:hidden ${isCurrentYear ? 'text-[#B8962D]' : 'text-gray-500'}`}>
                          {stats.journals} Journals · {stats.conferences} Conferences · {stats.books} Books · {stats.reports} Reports
                        </span>

                        <span className={`hidden text-base max-md:block text-start ${isCurrentYear ? 'text-[#B8962D]' : 'text-gray-500'}`}>
                          {stats.journals} Journals · {stats.conferences} Conferences <br/> {stats.books} Books · {stats.reports} Reports
                        </span>
                      </div>
                      {expandedYear === year ? (
                        <ChevronUp className="size-20 text-gray-500" />
                      ) : (
                        <ChevronDown className="size-20 text-gray-500" />
                      )}
                    </button>
                    {expandedYear === year && (
                      <div className="flex flex-col">
                        {pubs.length === 0 ? (
                          <div className="p-32 md:p-40 text-center bg-white border-t border-gray-100">
                            <p className="text-sm md:text-base text-gray-500">아직 등록된 논문이 없습니다.</p>
                          </div>
                        ) : pubs.map((pub, idx) => {
                          const authorList = getAuthorNames(pub.authors, pub.author_marks)
                          const typeLabel = pub.type === 'journal' ? 'Journal' : pub.type === 'conference' ? 'Conference' : pub.type === 'book' ? 'Book' : pub.type === 'report' ? 'Report' : pub.type.charAt(0).toUpperCase() + pub.type.slice(1)
                          const typeColor = pub.type === 'journal'
                            ? 'bg-[#D6B04C]'
                            : pub.type === 'conference'
                            ? 'bg-[#AC0E0E]'
                            : pub.type === 'book'
                            ? 'bg-[#E8D688]'
                            : pub.type === 'report'
                            ? 'bg-[#FFBAC4]'
                            : 'bg-gray-500'

                          return (
                            <div key={idx} className="p-20 md:p-24 bg-white border-t border-gray-100">
                              <div className="flex flex-col md:flex-row md:items-start gap-16 md:gap-20">
                                {/* Left: Type Label + Number + Presentation */}
                                <div className="flex flex-col items-center shrink-0 w-70 md:w-90">
                                  <div className={`w-full py-6 md:py-8 rounded-t-lg text-center ${typeColor}`}>
                                    <span className="text-[9px] md:text-xs font-semibold text-white uppercase tracking-wide">
                                      {typeLabel}
                                    </span>
                                  </div>
                                  <div className="w-full py-8 md:py-10 bg-gray-100 text-center border-x border-gray-200">
                                    <span className="text-sm md:text-base font-bold text-gray-700">
                                      {getPublicationNumber(pub)}
                                    </span>
                                  </div>
                                  {pub.type === 'conference' && pub.presentation_type && (
                                    <div className={`w-full py-4 md:py-6 rounded-b-lg text-center border-x border-b ${
                                      pub.presentation_type === 'oral' 
                                        ? 'border-pink-200' 
                                        : 'border-pink-100'
                                    }`}
                                      style={{
                                        backgroundColor: pub.presentation_type === 'oral' 
                                          ? 'rgba(232,135,155,0.15)' 
                                          : 'rgba(255,183,197,0.15)'
                                      }}
                                    >
                                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wide"
                                        style={{color: pub.presentation_type === 'oral' ? '#E8889C' : '#FFBAC4'}}
                                      >
                                        {pub.presentation_type === 'oral' ? 'Oral' : 'Poster'}
                                      </span>
                                    </div>
                                  )}
                                  {pub.type === 'conference' && !pub.presentation_type && (
                                    <div className="w-full py-4 md:py-6 rounded-b-lg text-center border-x border-b border-gray-200 bg-gray-50">
                                      <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                        -
                                      </span>
                                    </div>
                                  )}
                                  {/* Journal Index Badge */}
                                  {pub.type === 'journal' && pub.indexing_group && (
                                    <div 
                                      className="w-full py-4 md:py-6 rounded-b-lg text-center border-x border-b"
                                      style={{
                                        backgroundColor: 
                                          ['SCIE', 'SSCI', 'A&HCI'].includes(pub.indexing_group) ? 'rgba(234,179,8,0.15)' :
                                          pub.indexing_group === 'ESCI' ? 'rgba(234,179,8,0.10)' :
                                          pub.indexing_group === 'Scopus' ? 'rgba(214, 176, 76,0.12)' :
                                          pub.indexing_group === 'Other International' ? 'rgba(214, 176, 76,0.08)' :
                                          ['KCI Excellent', 'KCI Accredited'].includes(pub.indexing_group) ? 'rgba(100,116,139,0.10)' :
                                          'rgba(148,163,184,0.10)',
                                        borderColor: 
                                          ['SCIE', 'SSCI', 'A&HCI'].includes(pub.indexing_group) ? 'rgba(234,179,8,0.35)' :
                                          pub.indexing_group === 'ESCI' ? 'rgba(234,179,8,0.25)' :
                                          pub.indexing_group === 'Scopus' ? 'rgba(214, 176, 76,0.25)' :
                                          pub.indexing_group === 'Other International' ? 'rgba(214, 176, 76,0.18)' :
                                          ['KCI Excellent', 'KCI Accredited'].includes(pub.indexing_group) ? 'rgba(100,116,139,0.20)' :
                                          'rgba(148,163,184,0.20)'
                                      }}
                                    >
                                      <span 
                                        className="text-[8px] md:text-[9px] font-bold uppercase tracking-wide"
                                        style={{
                                          color: 
                                            ['SCIE', 'SSCI', 'A&HCI'].includes(pub.indexing_group) ? 'rgb(180,130,20)' :
                                            pub.indexing_group === 'ESCI' ? 'rgba(180,130,20,0.8)' :
                                            pub.indexing_group === 'Scopus' ? 'rgb(160,120,40)' :
                                            pub.indexing_group === 'Other International' ? 'rgba(160,120,40,0.75)' :
                                            ['KCI Excellent', 'KCI Accredited'].includes(pub.indexing_group) ? 'rgb(100,116,139)' :
                                            'rgb(148,163,184)'
                                        }}
                                      >
                                        {pub.indexing_group}
                                      </span>
                                    </div>
                                  )}
                                  {pub.type === 'journal' && !pub.indexing_group && (
                                    <div className="w-full py-4 md:py-6 rounded-b-lg text-center border-x border-b border-gray-200 bg-gray-50">
                                      <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                        -
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Middle: Content */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm md:text-md font-semibold text-gray-800 mb-6 md:mb-8 leading-relaxed">
                                    {pub.awards !== undefined && pub.awards !== null && pub.awards > 0 && (
                                      <span 
                                        className="mr-6 cursor-help" 
                                        title={`Award-winning paper (${pub.awards} award${Number(pub.awards) > 1 ? 's' : ''})`}
                                      >
                                        🏆
                                      </span>
                                    )}
                                    {pub.title}
                                  </h4>
                                  {pub.title_ko && (
                                    <p className="text-xs md:text-base text-gray-600 mb-6 md:mb-8">{pub.title_ko}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
                                    {authorList.map((author, aIdx) => (
                                      <span key={aIdx} className="text-xs md:text-sm text-gray-600">
                                        {author.name}
                                        {author.mark && (
                                          <sup className="text-primary ml-1">{author.mark}</sup>
                                        )}
                                        {aIdx < authorList.length - 1 && ', '}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-xs md:text-sm text-gray-500 italic">
                                    {(pub.indexing_group?.includes('KCI') || pub.indexing_group?.includes('Domestic') || pub.language === 'korean') && pub.venue_ko 
                                      ? pub.venue_ko 
                                      : pub.venue}
                                  </p>
                                  {pub.doi && (
                                    <a
                                      href={`https://doi.org/${pub.doi}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs md:text-sm text-primary hover:underline mt-4 inline-block"
                                    >
                                      DOI: {pub.doi}
                                    </a>
                                  )}
                                </div>

                                {/* Right: Date + Cite */}
                                <div className="flex flex-col items-start md:items-end gap-8 md:gap-12 shrink-0">
                                  <div className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                                    {pub.published_date}
                                  </div>
                                  <button
                                    onClick={() => showModal({
                                      title: 'Citation Formats',
                                      maxWidth: '600px',
                                      children: <CitationModal citation={pub.citations} />
                                    })}
                                    className="flex items-center gap-4 md:gap-6 px-10 md:px-12 py-4 md:py-6 bg-gray-50 border border-gray-100 rounded-lg text-[10px] md:text-xs font-medium text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
                                  >
                                    Cite
                                  </button>
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
          ) : (
            <div className="bg-gray-50 rounded-2xl p-60 text-center">
              <p className="text-md text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

export default memo(PublicationsTemplate)
