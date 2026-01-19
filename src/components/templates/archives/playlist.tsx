import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Calendar, Home } from 'lucide-react'

// Image Imports
import banner4 from '@/assets/images/banner/4.webp'

interface PlaylistItem {
  title: string;
  date: string;
  duration: string;
  thumbnail?: string;
  youtubeUrl: string;
}

interface RawPlaylistItem {
  url: string;
}

export const ArchivesPlaylistTemplate = () => {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('/findslab-test/data/playlist/ischoi.json')
        const text = await response.text()
        const cleaned = text.replace(/,(\s*[}\]])/g, '$1')
        const data = JSON.parse(cleaned)

        // 데이터 형식 변환 (ischoi.json -> UI 형식)
        const items = data.items.map((item: RawPlaylistItem) => {
          // YouTube URL에서 비디오 ID 추출
          const videoId = item.url.split('v=')[1]?.split('&')[0]
          return {
            title: 'FINDS Lab Playlist Video', // 실제 타이틀은 API 등으로 가져와야 하지만 여기서는 기본값
            date: '2025.01.01', // 기본값
            duration: '00:00', // 기본값
            thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined,
            youtubeUrl: item.url
          }
        })

        setPlaylists(items)
      } catch (err) {
        console.error('Failed to load playlists:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-200 md:h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner4})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-2xl md:text-[36px] font-semibold text-white text-center">
            Playlist
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-20 md:py-40">
        <div className="flex items-center gap-8 md:gap-10 flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            <Home size={16} />
          </Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-gray-400">Archives</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-primary font-medium">Playlist</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
        {loading ? (
          <div className="bg-[#f9fafb] rounded-xl md:rounded-[20px] p-32 md:p-60 text-center text-sm md:text-base text-gray-500">
            Loading playlist...
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-20">
            {playlists.map((item, index) => (
              <a
                key={index}
                href={item.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#f0f0f0] rounded-xl md:rounded-[20px] overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-video bg-[#f9fafb] flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="w-48 h-48 md:w-60 md:h-60 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-24 h-24 md:w-30 md:h-30 text-white ml-4" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-16 md:p-20">
                  <h3 className="text-sm md:text-md font-semibold text-[#222222] mb-8 md:mb-12 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                      <Calendar className="w-12 h-12 md:w-14 md:h-14 text-[#7f8894]" />
                      <span className="text-[11px] md:text-[13px] text-[#7f8894]">{item.date}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-[#f9fafb] rounded-xl md:rounded-[20px] p-40 md:p-60 text-center">
            <div className="w-60 h-60 md:w-80 md:h-80 bg-white rounded-full flex items-center justify-center mx-auto mb-16 md:mb-20">
              <Play className="w-28 h-28 md:w-40 md:h-40 text-[#cdcdcd]" />
            </div>
            <p className="text-base md:text-[18px] font-medium text-[#222222] mb-6 md:mb-8">
              플레이리스트 준비 중
            </p>
            <p className="text-xs md:text-[14px] text-[#7f8894]">
              아직 등록된 영상이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesPlaylistTemplate)





