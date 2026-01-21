import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Calendar, Home } from 'lucide-react'
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
}

const GalleryDetailModal = ({ id, title, date }: { id: string; title?: string; date?: string }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<{ title?: string; date?: string; tags?: string[] }>({})

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
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
          tags: (Array.isArray(data.tags) ? data.tags : []) as string[]
        })
        const processedContent = processJekyllContent(content, data, { basePath: baseUrl.replace(/\/$/, '') })
        setContent(processedContent)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-80">
        <div className="flex flex-col items-center gap-16">
          <div className="w-40 h-40 border-3 border-[#FFBAC4] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <article className="relative">
      {/* Premium Header */}
      <header className="relative mb-32 md:mb-48 pb-32 md:pb-40 border-b border-gray-100">
        {/* Category Badge & Tags */}
        <div className="flex items-center gap-12 mb-20 md:mb-24 flex-wrap">
          <span className="px-12 py-4 bg-gradient-to-r from-[#FFBAC4] to-[#E8889C] text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full">
            Gallery
          </span>
          {metadata.tags && metadata.tags.length > 0 && (
            <>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex flex-wrap gap-6">
                {metadata.tags.map((tag, idx) => (
                  <span key={idx} className="px-10 py-4 bg-gray-100 text-gray-500 text-[10px] md:text-xs font-medium rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-16 md:mb-20">
          {metadata.title}
        </h1>
        
        {/* Meta Info */}
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-8">
            <Calendar className="size-16 text-[#E8889C]" />
            <time className="text-sm md:text-base font-medium text-gray-500">{metadata.date}</time>
          </div>
        </div>
        
        {/* Decorative Line */}
        <div className="absolute bottom-0 left-0 w-80 h-[3px] bg-gradient-to-r from-[#FFBAC4] to-transparent rounded-full" />
      </header>

      {/* Content - Premium Typography with Image Styling */}
      <div 
        className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-40 prose-h2:mb-20
          prose-h3:text-lg prose-h3:md:text-xl prose-h3:mt-32 prose-h3:mb-16
          prose-p:text-gray-600 prose-p:leading-[1.9] prose-p:text-sm prose-p:md:text-base prose-p:mb-20
          prose-a:text-[#E8889C] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-800 prose-strong:font-semibold
          prose-ul:my-20 prose-li:text-gray-600 prose-li:text-sm prose-li:md:text-base
          prose-blockquote:border-l-4 prose-blockquote:border-[#FFBAC4] prose-blockquote:bg-[#FFF5F7] prose-blockquote:py-16 prose-blockquote:px-20 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-code:bg-gray-100 prose-code:px-6 prose-code:py-2 prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-24"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {/* Footer */}
      <footer className="mt-40 md:mt-60 pt-24 md:pt-32 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFBAC4] to-[#E8889C]" />
            <span className="text-xs md:text-sm font-medium text-gray-400">FINDS Lab. Gallery</span>
          </div>
          <span className="text-[10px] md:text-xs text-gray-300">{metadata.date}</span>
        </div>
      </footer>
    </article>
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
              tags: (Array.isArray(data.tags) ? data.tags : []) as string[]
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
      {/* Banner - About FINDS 스타일 */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner4})` }}
        />
        
        {/* Luxurious Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
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
            Loading galleries from markdown files...
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => showModal({
                  maxWidth: '900px',
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
                  <div className="flex items-center gap-6 md:gap-8 mb-6 md:mb-8">
                    <Calendar className="size-12 md:size-14 text-gray-500" />
                    <span className="text-xs md:text-sm font-medium text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-8 md:mb-12">{item.title}</h3>
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-8 md:px-10 py-3 md:py-4 bg-gray-50 text-gray-500 text-[10px] md:text-xs rounded-full border border-gray-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-[20px] p-60 text-center text-gray-500">
            No gallery items found in markdown folder.
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesGalleryTemplate)





