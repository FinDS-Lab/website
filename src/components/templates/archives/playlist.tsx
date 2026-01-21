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
      <div className="bg-gray-900 px-16 py-10">
        <p className="text-gray-400 text-[10px] mb-2">{artist}</p>
        <h2 className="text-white font-semibold text-sm truncate">{title}</h2>
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
        maxWidth: '700px',
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
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 md:gap-12">
            {playlists.map((item, index) => (
              <div
                key={index}
                onClick={() => handlePlayVideo(item)}
                className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md hover:border-primary/20 transition-all group cursor-pointer"
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
                        <div className="w-32 h-32 md:w-36 md:h-36 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-14 h-14 md:w-16 md:h-16 text-primary ml-2" fill="currentColor" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-12 h-12 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-8 md:p-10">
                  <h3 className="text-[10px] md:text-[11px] font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-gray-500 truncate">
                    {item.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-24 md:p-36 text-center">
            <div className="w-36 h-36 md:w-44 md:h-44 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-12">
              <Music2 className="w-18 h-18 md:w-20 md:h-20 text-gray-300" />
            </div>
            <p className="text-xs md:text-sm font-semibold text-gray-900 mb-4">
              플레이리스트 준비 중
            </p>
            <p className="text-[10px] md:text-xs text-gray-500">
              아직 등록된 영상이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ArchivesPlaylistTemplate)
