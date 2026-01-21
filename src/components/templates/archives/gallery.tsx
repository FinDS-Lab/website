import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Calendar, Home, User } from 'lucide-react'
import { useStoreModal } from '@/store/modal'
import { parseMarkdown, processJekyllContent } from '@/utils/parseMarkdown'

// Image Imports
import banner4 from '@/assets/images/banner/4.webp'

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  thumb: string;
  tags: string[];
  author?: string;
}

// Red-dot Design Style 상세 모달
const GalleryDetailModal = ({ id, title, date }: { id: string; title?: string; date?: string }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<{ title?: string; date?: string; author?: string }>({})
  const baseUrl = import.meta.env.BASE_URL || '/'

  useEffect(() => {
    fetch(`${baseUrl}data/gallery/${id}/index.md`)
      .then(res => res.text())
      .then(text => {
        const { data, content } = parseMarkdown(text)

        if (!data.date && id.match(/^\d{4}-\d{2}-\d{2}/)) {
          data.date = id.slice(0, 10)
        }

        setMetadata({ 
          title: data.title as string || title, 
          date: data.date as string || date,
          author: data.author as string || 'FINDS Lab.'
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
    <div className="relative">
      {/* Header */}
      <div className="border-b border-gray-100 px-24 md:px-32 py-20 md:py-24">
        {/* Meta Info */}
        <div className="flex items-center gap-16 mb-12 text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <Calendar className="size-14 text-gray-400" />
            <span className="font-medium">{metadata.date}</span>
          </div>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-6">
            <User className="size-14 text-gray-400" />
            <span className="font-medium">{metadata.author}</span>
          </div>
        </div>
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
          {metadata.title}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-24 md:px-32 py-24 md:py-32">
        <article 
          className="prose prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-xl prose-h1:border-b prose-h1:border-gray-100 prose-h1:pb-12 prose-h1:mb-20
            prose-h2:text-lg prose-h2:mt-32 prose-h2:mb-16
            prose-h3:text-base prose-h3:mt-24 prose-h3:mb-12
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-[15px] prose-p:mb-16
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:my-16 prose-ul:pl-20
            prose-ol:my-16 prose-ol:pl-20
            prose-li:text-gray-600 prose-li:text-[15px] prose-li:mb-8
            prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:bg-gray-50 prose-blockquote:py-12 prose-blockquote:px-20 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-500
            prose-img:rounded-xl prose-img:shadow-sm prose-img:my-24
            prose-code:bg-gray-100 prose-code:px-6 prose-code:py-2 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-20"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export const ArchivesGalleryTemplate = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()
  const baseUrl = import.meta.env.BASE_URL || '/'

  useEffect(() => {
    const fetchAllGalleries = async () => {
      try {
        // index.json에서 폴더 목록을 동적으로 가져옴
        const indexResponse = await fetch(`${baseUrl}data/gallery/index.json`)
        const indexData = await indexResponse.json()
        const galleryFolders: string[] = indexData.folders || []

        const results = await Promise.all(
          galleryFolders.map(async (folder) => {
            const response = await fetch(`${baseUrl}data/gallery/${folder}/index.md`)
            const text = await response.text()
            const { data } = parseMarkdown(text)
            return {
              id: folder,
              title: (data.title as string) || 'No Title',
              date: (data.date as string) || '',
              thumb: (data.thumb as string) || '',
              tags: (Array.isArray(data.tags) ? data.tags : []) as string[],
              author: (data.author as string) || 'FINDS Lab.'
            }
          })
        )
        setGalleryItems(results.sort((a, b) => b.date.localeCompare(a.date)))
      } catch (err) {
        console.error('Failed to load galleries:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllGalleries()
  }, [])

  return (
    <div className="flex flex-col bg-white">
      {/* Banner */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner4})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B04C]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B04C]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B04C]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Archives
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B04C]/80" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight">
            Gallery
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
            <span className="text-sm text-primary font-semibold">Gallery</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60 pb-60 md:pb-100">
        {loading ? (
          <div className="bg-[#f9fafb] rounded-xl md:rounded-[20px] p-32 md:p-60 text-center text-sm md:text-base text-gray-500 font-medium">
            Loading galleries...
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => showModal({
                  maxWidth: '800px',
                  children: <GalleryDetailModal id={item.id} title={item.title} date={item.date} />
                })}
                className="bg-white border border-[#f0f0f0] rounded-xl md:rounded-[20px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="aspect-[4/3] bg-[#f9fafb] flex items-center justify-center overflow-hidden">
                  {item.thumb ? (
                    <img
                      src={`${baseUrl}data/gallery/${item.id}/${item.thumb}`}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageIcon className="size-32 md:size-40 text-[#cdcdcd]" />
                  )}
                </div>
                <div className="p-16 md:p-20">
                  <div className="flex items-center gap-16 mb-8 text-xs text-gray-500">
                    <div className="flex items-center gap-6">
                      <Calendar className="size-12 text-gray-400" />
                      <span className="font-medium">{item.date}</span>
                    </div>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center text-gray-500">
            No gallery items found.
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesGalleryTemplate)
