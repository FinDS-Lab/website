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

const GalleryDetailModal = ({ id }: { id: string }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/website/data/gallery/${id}/index.md`)
      .then(res => res.text())
      .then(text => {
        const { data, content } = parseMarkdown(text)

        if (!data.date && id.match(/^\d{4}-\d{2}-\d{2}/)) {
          data.date = id.slice(0, 10)
        }

        const processedContent = processJekyllContent(content, data, { basePath: '/website' })
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

export const ArchivesGalleryTemplate = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  useEffect(() => {
    // 갤러리 폴더 목록 (브라우저에서는 목록을 알 수 없어 현재 존재하는 데이터를 기반으로 합니다)
    const galleryFolders = ['2025-09-01-1']

    const fetchAllGalleries = async () => {
      try {
        const results = await Promise.all(
          galleryFolders.map(async (folder) => {
            const response = await fetch(`/website/data/gallery/${folder}/index.md`)
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
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Gallery
          </h1>
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-12 md:gap-16">
            <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-amber-300" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-amber-300" />
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
                  children: <GalleryDetailModal id={item.id} />
                })}
                className="bg-white border border-[#f0f0f0] rounded-xl md:rounded-[20px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="aspect-[4/3] bg-[#f9fafb] flex items-center justify-center overflow-hidden">
                  {item.thumb ? (
                    <img
                      src={`/website/data/gallery/${item.id}/${item.thumb}`}
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





