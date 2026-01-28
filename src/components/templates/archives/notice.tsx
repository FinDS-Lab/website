import { memo, useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Calendar, Home } from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import { parseMarkdown, processJekyllContent } from '@/utils/parseMarkdown'

// Image Imports
import banner5 from '@/assets/images/banner/5.webp'

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

interface NoticeItem {
  id: string;
  title: string;
  date: string;
  description: string;
  isPinned?: boolean;
  author?: string;
}

// 상세 모달
const NoticeDetailModal = ({ id, title, date }: { id: string; title?: string; date?: string }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<{ title?: string; date?: string; author?: string }>({})

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/notice/${id}.md`)
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
            [&_img]:my-20 [&_img]:rounded-lg [&_img]:max-w-full [&_img]:shadow-sm
            [&>code]:text-[12px] [&>code]:bg-gray-100 [&>code]:px-6 [&>code]:py-2 [&>code]:rounded [&>code]:font-mono [&>code]:text-gray-700
            [&>pre]:my-20 [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:rounded-lg [&>pre]:p-16 [&>pre]:overflow-x-auto [&>pre]:text-[12px]
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export const ArchivesNoticeTemplate = () => {
  const [noticeItems, setNoticeItems] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()
  const [searchParams, setSearchParams] = useSearchParams()
  const contentAnimation = useScrollAnimation()

  // URL에서 id 파라미터가 있으면 자동으로 해당 게시글 모달 열기
  useEffect(() => {
    const id = searchParams.get('id')
    if (id && noticeItems.length > 0) {
      const item = noticeItems.find(n => n.id === id)
      if (item) {
        showModal({
          title: '',
          children: <NoticeDetailModal id={item.id} title={item.title} date={item.date} />
        })
        // URL에서 id 파라미터 제거
        setSearchParams({})
      }
    }
  }, [searchParams, noticeItems])

  useEffect(() => {
    const noticeFiles = ['2025-10-01-1.md', '2025-09-01-1.md', '2025-06-14-1.md']
    const baseUrl = import.meta.env.BASE_URL || '/'

    const fetchAllNotices = async () => {
      try {
        const results = await Promise.all(
          noticeFiles.map(async (file) => {
            try {
              const response = await fetch(`${baseUrl}data/notice/${file}`)
              if (!response.ok) return null
              const text = await response.text()
              const { data } = parseMarkdown(text)
              return {
                id: file.replace('.md', ''),
                title: data.title || 'No Title',
                date: data.date || '',
                description: data.excerpt || '',
                isPinned: data.isPinned === 'true',
                author: data.author || 'FINDS Lab'
              }
            } catch (err) {
              return null
            }
          })
        )
        const validResults = results.filter((item) => item !== null) as NoticeItem[]
        setNoticeItems(validResults.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.date.localeCompare(a.date);
        }))
      } catch (err) {
        console.error('Failed to load notices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllNotices()
  }, [])

  return (
    <div className="flex flex-col bg-white">
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
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">Notice</h1>
          
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
            <span className="text-sm text-primary font-semibold">Notice</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentAnimation.ref}
        className={`max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60 pb-60 md:pb-100 transition-all duration-700 ${contentAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        {loading ? (
          <div className="bg-[#f9fafb] rounded-xl md:rounded-[20px] p-32 md:p-60 text-center text-sm md:text-base text-gray-500 font-medium">
            Loading notices...
          </div>
        ) : noticeItems.length > 0 ? (
          <div className="flex flex-col gap-12 md:gap-20">
            {noticeItems.map((item) => (
              <div
                key={item.id}
                onClick={() => showModal({
                  maxWidth: '800px',
                  children: <NoticeDetailModal id={item.id} title={item.title} date={item.date} />
                })}
                className={`bg-white border rounded-xl md:rounded-[20px] p-16 md:p-30 hover:shadow-lg transition-shadow cursor-pointer group ${
                  item.isPinned ? 'border-primary bg-primary/5' : 'border-[#f0f0f0]'
                }`}
              >
                <div className="flex items-center gap-16 mb-8 md:mb-12 text-xs md:text-sm text-gray-500">
                  <div className="flex items-center gap-6">
                    <Calendar className="size-12 md:size-14 text-gray-400" />
                    <span className="font-medium">{item.date}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span>{item.author}</span>
                  {item.isPinned && (
                    <span className="px-6 md:px-8 py-2 bg-primary text-white text-[10px] md:text-xs font-semibold rounded-md">
                      PINNED
                    </span>
                  )}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-6 md:mb-8 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-xl md:rounded-[20px] p-40 md:p-60 text-center">
            <p className="text-xs md:text-[14px] text-[#7f8894]">No items</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesNoticeTemplate)
