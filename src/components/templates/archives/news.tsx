import { memo, useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Calendar, Home, User, Loader2 } from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import { parseMarkdown, processJekyllContent } from '@/utils/parseMarkdown'

// Scroll animation hook
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Image Imports
import banner5 from '@/assets/images/banner/5.webp'

// Tag types and colors based on FINDS Lab Color Palette
type NewsTag = 'Honors & Awards' | 'Events' | 'General';

const tagColors: Record<NewsTag, { bg: string; text: string; border: string }> = {
  'Honors & Awards': { bg: 'bg-[#D6B14D]/10', text: 'text-[#9A7D1F]', border: 'border-[#D6B14D]/30' },
  'Events': { bg: 'bg-[#AC0E0E]/10', text: 'text-[#AC0E0E]', border: 'border-[#AC0E0E]/30' },
  'General': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
};

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tag?: NewsTag;
}

// 상세 모달
const NewsDetailModal = ({ id, title, date }: { id: string; title?: string; date?: string }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<{ title?: string; date?: string; author?: string }>({})

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/news/${id}.md`)
      .then(res => res.text())
      .then(text => {
        const { data, content } = parseMarkdown(text)

        if (!data.date && id.match(/^\d{4}-\d{2}-\d{2}/)) {
          data.date = id.slice(0, 10)
        }

        setMetadata({ 
          title: data.title as string || title, 
          date: data.date as string || date,
          author: data.author as string || 'FINDS Lab'
        })
        const processedContent = processJekyllContent(content, data, { basePath: baseUrl.replace(/\/$/, '') })
        setContent(processedContent)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center py-80">
      <div className="w-32 h-32 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="relative bg-white">
      {/* Header - Clean minimal style */}
      <div className="px-24 md:px-32 pt-28 md:pt-36 pb-20 md:pb-24">
        <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug tracking-[-0.02em] mb-12 md:mb-16">
          {metadata.title}
        </h1>
        <div className="flex items-center gap-8 text-[12px] text-gray-500">
          <span className="font-medium">{metadata.author}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-gray-300" />
          <span>{metadata.date}</span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mx-24 md:mx-32 h-px bg-gray-200" />
      
      {/* Content - Clean typography with subtle styling */}
      <div className="px-24 md:px-32 py-24 md:py-32">
        <article 
          className="
            [&>p]:text-[14px] [&>p]:leading-[1.85] [&>p]:text-gray-600 [&>p]:mb-20 [&>p]:tracking-[-0.01em]
            [&>h2]:text-[15px] [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-32 [&>h2]:mb-16 [&>h2]:pb-8 [&>h2]:border-b [&>h2]:border-primary/30
            [&>h3]:text-[14px] [&>h3]:font-semibold [&>h3]:text-gray-800 [&>h3]:mt-24 [&>h3]:mb-12 [&>h3]:pl-12 [&>h3]:border-l-2 [&>h3]:border-primary
            [&>ul]:my-16 [&>ul]:space-y-8
            [&>ul>li]:relative [&>ul>li]:pl-16 [&>ul>li]:text-[14px] [&>ul>li]:leading-[1.75] [&>ul>li]:text-gray-600
            [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[9px] [&>ul>li]:before:w-[5px] [&>ul>li]:before:h-[5px] [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-primary/60
            [&>ol]:my-16 [&>ol]:space-y-8 [&>ol]:list-decimal [&>ol]:pl-20
            [&>ol>li]:text-[14px] [&>ol>li]:leading-[1.75] [&>ol>li]:text-gray-600 [&>ol>li]:pl-4
            [&>blockquote]:my-20 [&>blockquote]:px-16 [&>blockquote]:py-12 [&>blockquote]:bg-amber-50/50 [&>blockquote]:border-l-3 [&>blockquote]:border-primary/40 [&>blockquote]:rounded-r-lg [&>blockquote]:text-[13px] [&>blockquote]:text-gray-600 [&>blockquote]:leading-[1.7]
            [&>hr]:my-28 [&>hr]:border-0 [&>hr]:h-px [&>hr]:bg-gray-200
            [&_strong]:font-semibold [&_strong]:text-gray-800
            [&_a]:text-primary [&_a]:font-medium [&_a]:no-underline hover:[&_a]:underline
            [&_img]:my-16 [&_img]:rounded-lg [&_img]:max-w-full [&_img]:shadow-sm [&_img]:mx-auto [&_img]:block
            [&>p>img]:my-12
            [&>p>img+img]:mt-8
            [&>p:has(img)+p:has(img)]:mt-8
            [&>code]:text-[12px] [&>code]:bg-gray-100 [&>code]:px-6 [&>code]:py-2 [&>code]:rounded [&>code]:font-mono [&>code]:text-gray-700
            [&>pre]:my-20 [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:rounded-lg [&>pre]:p-16 [&>pre]:overflow-x-auto [&>pre]:text-[12px]
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export const ArchivesNewsTemplate = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<NewsTag | 'All'>('All')
  const { showModal } = useStoreModal()
  const [searchParams, setSearchParams] = useSearchParams()
  const contentAnimation = useScrollAnimation()

  const allTags: (NewsTag | 'All')[] = ['All', 'Honors & Awards', 'Events', 'General']

  // URL에서 id 파라미터가 있으면 자동으로 해당 게시글 모달 열기
  useEffect(() => {
    const id = searchParams.get('id')
    if (id && newsItems.length > 0) {
      const item = newsItems.find(n => n.id === id)
      if (item) {
        showModal({
          title: '',
          children: <NewsDetailModal id={item.id} title={item.title} date={item.date} />
        })
        // URL에서 id 파라미터 제거
        setSearchParams({})
      }
    }
  }, [searchParams, newsItems])

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'

    const fetchAllNews = async () => {
      try {
        // Fetch index.json to get the list of news files
        const indexResponse = await fetch(`${baseUrl}data/news/index.json`)
        if (!indexResponse.ok) {
          console.error('Failed to load news index')
          setLoading(false)
          return
        }
        const indexData = await indexResponse.json()
        const newsFiles: string[] = indexData.files || []

        const results = await Promise.all(
          newsFiles.map(async (file) => {
            try {
              const response = await fetch(`${baseUrl}data/news/${file}`)
              if (!response.ok) return null
              const text = await response.text()
              const { data } = parseMarkdown(text)
              return {
                id: file.replace('.md', ''),
                title: data.title || 'No Title',
                date: data.date || '',
                excerpt: data.excerpt || '',
                author: data.author || 'FINDS Lab',
                tag: (data.tag as NewsTag) || 'General'
              }
            } catch (err) {
              return null
            }
          })
        )
        const validResults = results.filter((item) => item !== null) as NewsItem[]
        setNewsItems(validResults.sort((a, b) => b.date.localeCompare(a.date)))
      } catch (err) {
        console.error('Failed to load news:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllNews()
  }, [])

  const filteredItems = selectedTag === 'All' 
    ? newsItems 
    : newsItems.filter(item => item.tag === selectedTag)

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[420px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center md:scale-105 transition-transform duration-[2000ms]" style={{ backgroundImage: `url(${banner5})` }} />
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
              Archives
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">News</h1>
          
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
            <Link to="/" className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110"><Home size={16} /></Link>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-gray-400 font-medium">Archives</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">News</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        
        className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60 pb-60 md:pb-100"
      >
        {/* Tag Filter - Refined Design */}
        <div className="mb-32 md:mb-40">
          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto pb-4 scrollbar-hide">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`
                  px-14 md:px-20 py-8 md:py-10 rounded-full text-xs md:text-sm font-semibold
                  transition-all duration-200 border whitespace-nowrap
                  ${selectedTag === tag 
                    ? tag === 'All'
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20'
                      : `${tagColors[tag as NewsTag].bg} ${tagColors[tag as NewsTag].text} ${tagColors[tag as NewsTag].border} shadow-sm`
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-12 md:gap-20">
            {/* Loading Header with Spinner */}
            <div className="flex items-center justify-center gap-8 py-8">
              <Loader2 className="size-16 text-[#D6B14D] animate-spin" />
              <span className="text-sm text-gray-400 font-medium">Loading news...</span>
            </div>
            {/* Skeleton Loading - 3 news cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[#f0f0f0] rounded-xl md:rounded-[20px] p-16 md:p-30 min-h-[120px] md:min-h-[140px] animate-pulse">
                <div className="flex items-center gap-8 md:gap-16 mb-8 md:mb-12">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded hidden md:block" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="h-5 md:h-6 w-3/4 bg-gray-200 rounded mb-8" />
                <div className="h-4 w-full bg-gray-100 rounded mb-4" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="flex flex-col gap-12 md:gap-20">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => showModal({
                  maxWidth: '800px',
                  children: <NewsDetailModal id={item.id} title={item.title} date={item.date} />
                })}
                className="bg-white border border-[#f0f0f0] rounded-xl md:rounded-[20px] p-16 md:p-30 hover:shadow-lg transition-shadow cursor-pointer group min-h-[120px] md:min-h-[140px]"
              >
                <div className="flex items-center gap-8 md:gap-16 mb-8 md:mb-12 text-xs md:text-sm text-gray-500 flex-wrap">
                  <div className="flex items-center gap-6">
                    <Calendar className="size-12 md:size-14 text-gray-400" />
                    <span className="font-medium">{item.date}</span>
                  </div>
                  <span className="text-gray-300 hidden md:inline">|</span>
                  <span>{item.author}</span>
                  {item.tag && (
                    <>
                      <span className="text-gray-300 hidden md:inline">|</span>
                      <span className={`px-8 py-2 rounded-full text-[10px] md:text-xs font-medium border ${tagColors[item.tag].bg} ${tagColors[item.tag].text} ${tagColors[item.tag].border}`}>
                        {item.tag}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-6 md:mb-8 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-xl md:rounded-[20px] p-32 md:p-60 text-center text-sm md:text-base text-gray-500">
            No items found for selected filter
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesNewsTemplate)
