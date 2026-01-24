import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Home, Music2, User } from 'lucide-react'
import { useStoreModal } from '@/store/modal'

interface PlaylistItem {
  artist: string;
  title: string;
  date: string;
  thumbnail?: string;
  youtubeUrl: string;
  videoId: string;
}

interface RawPlaylistItem {
  url: string;
  artist?: string;
  title?: string;
  date?: string;
}

// YouTube 임베드 모달 컴포넌트
const YouTubePlayerModal = ({ videoId, artist, title }: { videoId: string; artist: string; title: string }) => {
  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-gray-900 px-16 md:px-20 py-12 md:py-14">
        <p className="text-gray-400 text-[10px] md:text-xs mb-2">{artist}</p>
        <h2 className="text-white font-semibold text-sm md:text-base truncate">{title}</h2>
      </div>
      
      {/* YouTube Embed - privacy-enhanced mode */}
      <div className="aspect-video bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export const ArchivesPlaylistTemplate = () => {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showModal } = useStoreModal()

  useEffect(() => {
    const fetchPlaylists = async () => {
      const baseUrl = import.meta.env.BASE_URL || '/'
      try {
        const response = await fetch(`${baseUrl}data/playlist/ischoi.json`)
        const text = await response.text()
        const cleaned = text.replace(/,(\s*[}\]])/g, '$1')
        const data = JSON.parse(cleaned)

        // 데이터 형식 변환
        const items = data.items.map((item: RawPlaylistItem) => {
          // YouTube URL에서 비디오 ID 추출
          const videoId = item.url.split('v=')[1]?.split('&')[0] || ''
          return {
            artist: item.artist || 'Unknown Artist',
            title: item.title || 'Unknown Title',
            date: item.date || '',
            thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined,
            youtubeUrl: item.url,
            videoId: videoId
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

  const handlePlayVideo = (item: PlaylistItem) => {
    if (item.videoId) {
      showModal({
        maxWidth: '800px',
        children: <YouTubePlayerModal videoId={item.videoId} artist={item.artist} title={item.title} />
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Minimal Compact Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-1480 mx-auto px-12 md:px-20">
          <div className="flex items-center justify-between h-40 md:h-48">
            {/* Home Button */}
            <Link 
              to="/" 
              className="flex items-center gap-6 px-10 py-6 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 rounded-lg transition-all text-[11px] font-semibold"
              title="FINDS Lab 홈으로"
            >
              <Home size={14} />
              <span className="hidden sm:inline">FINDS Lab</span>
            </Link>
            
            {/* Title - 컴팩트 */}
            <div className="flex items-center gap-4">
              <Music2 size={14} className="text-primary" />
              <span className="text-[11px] md:text-xs font-bold text-gray-900">Playlist</span>
            </div>
            
            {/* Spacer for balance */}
            <div className="w-60 sm:w-80" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-1480 mx-auto w-full px-12 md:px-16 py-16 md:py-24">
        {loading ? (
          <div className="flex items-center justify-center py-48">
            <div className="w-24 h-24 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 md:gap-16">
            {playlists.map((item, index) => (
              <div
                key={index}
                onClick={() => handlePlayVideo(item)}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src.includes('maxresdefault')) {
                          target.src = target.src.replace('maxresdefault', 'hqdefault')
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Music2 className="w-24 h-24 text-primary/30" />
                    </div>
                  )}
                </div>
                
                {/* Info - 아티스트 먼저, 제목 아래 */}
                <div className="p-12 md:p-14">
                  <p className="text-[11px] md:text-xs text-gray-500 mb-4 truncate font-bold">
                    {item.artist}
                  </p>
                  <h3 className="text-[11px] md:text-xs font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-32 md:p-48 text-center">
            <div className="w-48 h-48 md:w-56 md:h-56 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-16">
              <Music2 className="w-24 h-24 md:w-28 md:h-28 text-gray-300" />
            </div>
            <p className="text-sm md:text-base font-semibold text-gray-900 mb-6">
              플레이리스트 준비 중
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              아직 등록된 영상이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesPlaylistTemplate)
