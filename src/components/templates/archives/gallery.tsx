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
  author?: string;
}

// 상세 모달
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
        // Gallery 이미지 경로를 위해 basePath를 gallery 폴더까지 확장
        const galleryBasePath = `${baseUrl.replace(/\/$/, '')}/data/gallery/${id}`
        const processedContent = processJekyllContent(content, data, { basePath: galleryBasePath })
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
      {/* Header - Minimal Red-dot style */}
      <div className="px-28 md:px-40 pt-32 md:pt-40 pb-20 md:pb-24">
        <h1 className="text-lg md:text-xl font-medium text-gray-900 leading-snug tracking-[-0.02em] mb-16 md:mb-20">
          {metadata.title}
        </h1>
        <div className="flex items-center gap-12 text-[11px] text-gray-400 tracking-wide">
          <span>{metadata.date}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-gray-300" />
          <span>{metadata.author}</span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mx-28 md:mx-40 h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />
      
      {/* Content - Red-dot inspired typography */}
      <div className="px-28 md:px-40 py-28 md:py-36">
        <article 
          className="
            [&>p]:text-[14px] [&>p]:leading-[1.9] [&>p]:text-gray-600 [&>p]:mb-24 [&>p]:tracking-[-0.01em]
            [&>h2]:text-[13px] [&>h2]:font-semibold [&>h2]:text-gray-800 [&>h2]:uppercase [&>h2]:tracking-[0.05em] [&>h2]:mt-40 [&>h2]:mb-20
            [&>h3]:text-[13px] [&>h3]:font-medium [&>h3]:text-gray-700 [&>h3]:mt-32 [&>h3]:mb-16
            [&>ul]:my-24 [&>ul]:space-y-12
            [&>ul>li]:relative [&>ul>li]:pl-20 [&>ul>li]:text-[14px] [&>ul>li]:leading-[1.8] [&>ul>li]:text-gray-600
            [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[10px] [&>ul>li]:before:w-[5px] [&>ul>li]:before:h-[5px] [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-primary
            [&>ol]:my-24 [&>ol]:space-y-12 [&>ol]:list-none [&>ol]:counter-reset-[item]
            [&>ol>li]:relative [&>ol>li]:pl-24 [&>ol>li]:text-[14px] [&>ol>li]:leading-[1.8] [&>ol>li]:text-gray-600 [&>ol>li]:counter-increment-[item]
            [&>ol>li]:before:content-[counter(item)] [&>ol>li]:before:absolute [&>ol>li]:before:left-0 [&>ol>li]:before:text-[12px] [&>ol>li]:before:font-medium [&>ol>li]:before:text-primary
            [&>blockquote]:my-28 [&>blockquote]:pl-24 [&>blockquote]:border-l-2 [&>blockquote]:border-primary/30 [&>blockquote]:text-[13px] [&>blockquote]:text-gray-500 [&>blockquote]:italic [&>blockquote]:leading-[1.8]
            [&>hr]:my-36 [&>hr]:border-0 [&>hr]:h-px [&>hr]:bg-gradient-to-r [&>hr]:from-gray-200 [&>hr]:via-gray-100 [&>hr]:to-transparent
            [&_strong]:font-semibold [&_strong]:text-gray-800
            [&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-primary/30 hover:[&_a]:border-primary
            [&_img]:my-28 [&_img]:rounded-lg [&_img]:max-w-full
            [&>code]:text-[12px] [&>code]:bg-gray-50 [&>code]:px-6 [&>code]:py-2 [&>code]:rounded [&>code]:font-mono [&>code]:text-gray-600
            [&>pre]:my-28 [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:rounded-lg [&>pre]:p-20 [&>pre]:overflow-x-auto [&>pre]:text-[12px]
          "
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
        const indexResponse = await fetch(`${baseUrl}data/gallery/index.json`)
        const indexData = await indexResponse.json()
        const galleryFolders: string[] = indexData.folders || []

        const results = await Promise.all(
          galleryFolders.map(async (folder) => {
            const response = await fetch(`${baseUrl}data/gallery/${folder}/index.md`)
            const text = await response.text()
            const { data } = parseMarkdown(text)
            // date를 문자열로 확실히 변환
            const dateStr = data.date ? String(data.date).slice(0, 10) : ''
            return {
              id: folder,
              title: (data.title as string) || 'No Title',
              date: dateStr,
              thumb: (data.thumb as string) || '',
              author: (data.author as string) || 'FINDS Lab.'
            }
          })
        )
        // 최신 날짜가 먼저 오도록 정렬 (내림차순) - 왼쪽 첫 번째에 최신 글
        setGalleryItems(results.sort((a, b) => {
          const dateA = new Date(a.date).getTime() || 0
          const dateB = new Date(b.date).getTime() || 0
          return dateB - dateA  // 최신이 먼저 (내림차순)
        }))
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
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${banner4})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B14D]/50 to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B14D]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">Archives</span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/80" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight">Gallery</h1>
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
                  <div className="flex items-center gap-6 mb-8 text-xs text-gray-500">
                    <Calendar className="size-12 text-gray-400" />
                    <span className="font-medium">{item.date}</span>
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
