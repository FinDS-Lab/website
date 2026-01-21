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
      <div className="bg-gray-900 px-20 py-14">
        <p className="text-gray-400 text-xs mb-2">{artist}</p>
        <h2 className="text-white font-semibold text-base truncate">{title}</h2>
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
          <div className="flex items-center justify-between h-44 md:h-52">
            {/* Home Button - 작고 직관적 */}
            <Link 
              to="/" 
              className="flex items-center justify-center w-36 h-36 bg-gray-100 hover:bg-primary hover:text-white rounded-full transition-all"
              title="Home"
            >
              <Home size={18} />
            </Link>
            
            {/* Title - 컴팩트 */}
            <div className="flex items-center gap-6">
              <Music2 size={18} className="text-primary" />
              <span className="text-sm md:text-base font-bold text-gray-900">Playlist</span>
            </div>
            
            {/* Spacer for balance */}
            <div className="w-36" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-1480 mx-auto w-full px-12 md:px-20 py-20 md:py-32">
        {loading ? (
          <div className="flex items-center justify-center py-60">
            <div className="w-28 h-28 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
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
                    <>
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
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="w-44 h-44 md:w-52 md:h-52 bg-white/95 rounded-full flex items-center justify-center shadow-xl">
                          <Play className="w-20 h-20 md:w-24 md:h-24 text-primary ml-4" fill="currentColor" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-18 h-18 text-white ml-2" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-12 md:p-14">
                  <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-gray-500 truncate">
                    {item.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-32 md:p-48 text-center">
            <div className="w-48 h-48 md:w-60 md:h-60 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-16">
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
