import { memo, useState, useEffect, useRef, useCallback } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Home, Music2, X, Minimize2, Maximize2, Play, Pause } from 'lucide-react'

// 화면 크기 체크 hook
const useIsPC = () => {
  const [isPC, setIsPC] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)
  
  useEffect(() => {
    const handleResize = () => setIsPC(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return isPC
}

// YouTube Player State Constants
const YT_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
}

// YouTube Player 인터페이스 (로컬)
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
  loadVideoById?: (videoId: string) => void;
  cueVideoById?: (videoId: string) => void;
}

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

export const ArchivesPlaylistTemplate = () => {
  const isPC = useIsPC()
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentVideo, setCurrentVideo] = useState<PlaylistItem | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isApiReady, setIsApiReady] = useState(false)
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  // PC가 아니면 홈으로 리다이렉트
  if (!isPC) {
    return <Navigate to="/" replace />
  }

  // YouTube IFrame API 로드
  useEffect(() => {
    if (window.YT) {
      setIsApiReady(true)
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true)
    }

    return () => {
      window.onYouTubeIframeAPIReady = () => {}
    }
  }, [])

  // YouTube Player 초기화
  useEffect(() => {
    if (!isApiReady || !currentVideo || !playerContainerRef.current) return

    // 기존 플레이어 정리
    if (playerRef.current) {
      playerRef.current.destroy()
      playerRef.current = null
    }

    // 플레이어 컨테이너 초기화
    const container = playerContainerRef.current
    container.innerHTML = '<div id="youtube-player"></div>'

    // 새 플레이어 생성
    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: currentVideo.videoId,
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event) => {
          event.target.playVideo()
          setIsPlaying(true)
        },
        onStateChange: (event) => {
          if (event.data === YT_STATE.PLAYING) {
            setIsPlaying(true)
          } else if (event.data === YT_STATE.PAUSED) {
            setIsPlaying(false)
          } else if (event.data === YT_STATE.ENDED) {
            setIsPlaying(false)
          }
        },
      },
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [isApiReady, currentVideo?.videoId])

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return
    
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying])

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
      setCurrentVideo(item)
      setIsMinimized(false)
      setIsPlaying(true)
    }
  }

  const handleClosePlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy()
      playerRef.current = null
    }
    setCurrentVideo(null)
    setIsMinimized(false)
    setIsPlaying(false)
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
      <div className={`flex-1 max-w-1480 mx-auto w-full px-12 md:px-16 py-16 md:py-24 ${currentVideo ? 'pb-[200px] md:pb-[240px]' : ''}`}>
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
                className={`bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer ${
                  currentVideo?.videoId === item.videoId 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-gray-100 hover:border-primary/20'
                }`}
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
                  {/* Now Playing indicator */}
                  {currentVideo?.videoId === item.videoId && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isPlaying ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          <div className="w-2 h-10 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                        </div>
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
                          <Pause size={20} className="text-white" />
                        </div>
                      )}
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

      {/* Fixed Bottom Player */}
      {currentVideo && (
        <div 
          className={`fixed bottom-0 left-0 right-0 bg-gray-900 shadow-2xl z-50 transition-all duration-300 ${
            isMinimized ? 'h-[60px]' : 'h-auto'
          }`}
        >
          {/* Player Header - Always visible */}
          <div className="flex items-center justify-between px-12 md:px-20 py-8 border-b border-gray-700/50">
            <div className="flex items-center gap-12 flex-1 min-w-0">
              {/* Thumbnail - only in minimized mode */}
              {isMinimized && (
                <img 
                  src={currentVideo.thumbnail?.replace('maxresdefault', 'default')} 
                  alt={currentVideo.title}
                  className="w-40 h-40 object-cover rounded-md"
                />
              )}
              <div className="min-w-0">
                <p className="text-gray-400 text-[10px] md:text-xs truncate">{currentVideo.artist}</p>
                <h2 className="text-white font-semibold text-xs md:text-sm truncate">{currentVideo.title}</h2>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-8">
              {/* Play/Pause button - especially important in minimized mode */}
              <button
                onClick={togglePlayPause}
                className="p-8 text-gray-400 hover:text-white transition-colors"
                title={isPlaying ? "일시정지" : "재생"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-8 text-gray-400 hover:text-white transition-colors"
                title={isMinimized ? "확대" : "최소화"}
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button
                onClick={handleClosePlayer}
                className="p-8 text-gray-400 hover:text-red-400 transition-colors"
                title="닫기"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* YouTube Player Container */}
          <div 
            ref={playerContainerRef}
            className={`${isMinimized ? 'h-0 overflow-hidden' : 'aspect-video max-h-[50vh]'} [&>div]:w-full [&>div]:h-full [&_iframe]:w-full [&_iframe]:h-full`}
          />
        </div>
      )}
    </div>
  )
}

export default memo(ArchivesPlaylistTemplate)
