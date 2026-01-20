import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Home } from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import { parseMarkdown, processJekyllContent } from '@/utils/parseMarkdown'

// Image Imports
import banner4 from '@/assets/images/banner/4.webp'

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
}

// 상세 모달 컴포넌트
const NewsDetailModal = ({ id }: { id: string }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}data/news/${id}.md`)
      .then(res => res.text())
      .then(text => {
        const { data, content } = parseMarkdown(text)

        // 파일명에서 날짜 추출 (YAML에 없는 경우)
        if (!data.date && id.match(/^\d{4}-\d{2}-\d{2}/)) {
          data.date = id.slice(0, 10)
        }

        const processedContent = processJekyllContent(content, data, { basePath: baseUrl.replace(/\/$/, '') })
        setContent(processedContent)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="p-60 text-center text-gray-500">Loading...</div>

  return (
    <div className="archive-detail-content max-h-[80vh]">
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export const ArchivesNewsTemplate = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  useEffect(() => {
    const newsFiles = ['2026-03-01-1.md', '2025-09-01-1.md', '2025-06-14-1.md']
    const baseUrl = import.meta.env.BASE_URL || '/'

    const fetchAllNews = async () => {
      try {
        const results = await Promise.all(
          newsFiles.map(async (file) => {
            try {
              const response = await fetch(`${baseUrl}data/news/${file}`)
              if (!response.ok) {
                console.error(`Failed to fetch ${file}: ${response.status}`)
                return null
              }
              const text = await response.text()
              const { data } = parseMarkdown(text)
              return {
                id: file.replace('.md', ''),
                title: data.title || 'No Title',
                date: data.date || '',
                excerpt: data.excerpt || '',
                author: data.author
              }
            } catch (err) {
              console.error(`Error fetching ${file}:`, err)
              return null
            }
          })
        )
        // null 필터링 후 날짜순 정렬
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

  return (
    <div className="flex flex-col">
      {/* Banner - About FINDS 스타일 */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner4})` }}
        />
        
        {/* Luxurious Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Floating Accent */}
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-amber-400/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-amber-400/80" />
            <span className="text-amber-300/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Archives
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight">
            News
          </h1>
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
            <span className="text-sm text-gray-400 font-medium">Archives</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">News</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60 pb-60 md:pb-100">
        {loading ? (
          <div className="bg-[#f9fafb] rounded-xl md:rounded-[20px] p-32 md:p-60 text-center text-sm md:text-base text-gray-500 font-medium">
            Loading news from markdown files...
          </div>
        ) : newsItems.length > 0 ? (
          <div className="flex flex-col gap-12 md:gap-20">
            {newsItems.map((item) => (
              <div
                key={item.id}
                onClick={() => showModal({
                  maxWidth: '900px',
                  children: <NewsDetailModal id={item.id} />
                })}
                className="bg-white border border-[#f0f0f0] rounded-xl md:rounded-[20px] p-16 md:p-30 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start gap-12 md:gap-20">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-6 md:gap-8 mb-8 md:mb-12">
                      <Calendar className="size-12 md:size-14 text-gray-400" />
                      <span className="text-xs md:text-sm font-medium text-gray-500">{item.date}</span>
                      {item.author && (
                        <>
                          <span className="text-gray-300 hidden sm:block">|</span>
                          <span className="text-xs md:text-sm text-gray-500 hidden sm:block">{item.author}</span>
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-xl md:rounded-[20px] p-32 md:p-60 text-center text-sm md:text-base text-gray-500">
            No items
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesNewsTemplate)





