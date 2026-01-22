import "../../assets/css/common.css";
import "../../assets/css/theme.css";
import "../../assets/css/font.css";

import {Route, Routes, useLocation, Navigate, Link} from "react-router-dom";
import {lazy, Suspense, useEffect, memo, useRef, useState} from "react";
import { Music, Play, Pause, X, Home as HomeIcon, SkipBack, SkipForward, Minimize2, Maximize2 } from 'lucide-react'
import { useMusicPlayerStore } from '@/store/musicPlayer'

// Public Pages
const Home = lazy(() => import('../home').then((module) => ({ default: module.Home })));
const Publications = lazy(() => import('../publications').then((module) => ({ default: module.Publications })));
const Projects = lazy(() => import('../projects').then((module) => ({ default: module.Projects })));

// About FINDS
const AboutIntroduction = lazy(() => import('../about/introduction').then((module) => ({ default: module.AboutIntroduction })));
const AboutResearch = lazy(() => import('../about/research').then((module) => ({ default: module.AboutResearch })));
const AboutHonors = lazy(() => import('../about/honors').then((module) => ({ default: module.AboutHonors })));
const AboutLocation = lazy(() => import('../about/location').then((module) => ({ default: module.AboutLocation })));

// Members
const MembersDirector = lazy(() => import('../members/director').then((module) => ({ default: module.MembersDirector })));
const MembersDirectorActivities = lazy(() => import('../members/director-activities').then((module) => ({ default: module.default })));
const MembersDirectorAcademic = lazy(() => import('../members/director-academic').then((module) => ({ default: module.MembersDirectorAcademic })));
const MembersCurrent = lazy(() => import('../members/current').then((module) => ({ default: module.MembersCurrent })));
const MembersAlumni = lazy(() => import('../members/alumni').then((module) => ({ default: module.MembersAlumni })));
const MembersDetail = lazy(() => import('../members/detail').then((module) => ({ default: module.MembersDetail })));

// Archives
const ArchivesNews = lazy(() => import('../archives/news').then((module) => ({ default: module.ArchivesNews })));
const ArchivesNotice = lazy(() => import('../archives/notice').then((module) => ({ default: module.ArchivesNotice })));
const ArchivesGallery = lazy(() => import('../archives/gallery').then((module) => ({ default: module.ArchivesGallery })));
const ArchivesPlaylist = lazy(() => import('../archives/playlist').then((module) => ({ default: module.ArchivesPlaylist })));

// Declare YouTube types
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: {
        videoId: string;
        playerVars?: Record<string, number | string>;
        events?: {
          onReady?: (event: { target: YTPlayer }) => void;
          onStateChange?: (event: { data: number; target: YTPlayer }) => void;
        };
      }) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

// Global Music Player Component - Outside Routes for persistence
const GlobalMusicPlayer = memo(() => {
  const { 
    playlist, 
    currentIndex, 
    isPlaying, 
    isMinimized,
    isLoaded,
    setPlaylist, 
    setIsLoaded,
    nextTrack,
    prevTrack,
    togglePlay, 
    toggleMinimize,
    setIsMinimized,
    setIsPlaying
  } = useMusicPlayerStore()
  
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const [trackInfo, setTrackInfo] = useState<{ artist: string; title: string }[]>([])
  const [isCompact, setIsCompact] = useState(false)
  const location = useLocation()

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }
  }, [])

  // Load playlist data
  useEffect(() => {
    if (!isLoaded) {
      const baseUrl = import.meta.env.BASE_URL || '/'
      fetch(`${baseUrl}data/playlist/ischoi.json`)
        .then(res => res.json())
        .then(data => {
          // Build combined array to shuffle together
          const items = data.items.map((item: { url: string; artist?: string; title?: string }) => {
            const match = item.url.match(/[?&]v=([^&]+)/)
            return {
              videoId: match ? match[1] : null,
              artist: item.artist || 'Unknown Artist',
              title: item.title || 'Unknown Title'
            }
          }).filter((item: { videoId: string | null }) => item.videoId)
          
          // Shuffle if needed (shuffle both videoId and track info together)
          if (data.shuffle) {
            for (let i = items.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [items[i], items[j]] = [items[j], items[i]]
            }
          }
          
          // Extract videoIds and trackInfo from shuffled array
          const videoIds = items.map((item: { videoId: string }) => item.videoId)
          const info = items.map((item: { artist: string; title: string }) => ({
            artist: item.artist,
            title: item.title
          }))
          
          setTrackInfo(info)
          setPlaylist(videoIds)
          setIsLoaded(true)
        })
        .catch(err => console.error('Failed to load playlist:', err))
    }
  }, [isLoaded, setPlaylist, setIsLoaded])

  const currentVideoId = playlist[currentIndex]
  const currentTrack = trackInfo[currentIndex]

  // Initialize/Update YouTube Player
  useEffect(() => {
    if (!isPlaying || !currentVideoId || isMinimized) return

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100)
        return
      }

      // Destroy existing player
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }

      // Create new player (even in compact mode, we need audio)
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: currentVideoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event) => {
            // When video ends (state = 0), go to next track
            if (event.data === 0) {
              nextTrack()
            }
          },
        },
      })
    }

    initPlayer()

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [isPlaying, currentVideoId, isMinimized, nextTrack])

  // Hide on playlist page
  const isPlaylistPage = location.pathname === '/archives/playlist'

  return (
    <div className="fixed bottom-16 md:bottom-20 right-16 md:right-20 z-[9999] flex flex-col items-end gap-10 md:gap-12">
      {/* Home Button - Always visible except on home page */}
      {location.pathname !== '/' && (
        <Link
          to="/"
          className="flex items-center justify-center w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-primary text-white rounded-full shadow-xl hover:bg-primary/90 hover:scale-105 transition-all duration-200"
          title="홈으로"
        >
          <HomeIcon className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16" />
        </Link>
      )}
      
      {/* Playlist Button/Player - Only show when playlist is loaded */}
      {playlist.length > 0 && !isPlaylistPage && (
        isMinimized ? (
          // Minimized: Floating button with proper design proportions
          <button
            onClick={() => setIsMinimized(false)}
            className="group flex items-center gap-12 md:gap-14 px-20 md:px-28 py-14 md:py-18 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full shadow-2xl hover:shadow-[0_8px_30px_rgba(214,177,77,0.25)] transition-all duration-300 border border-gray-700/50 hover:scale-105"
          >
            <div className="relative flex items-center justify-center w-44 h-44 md:w-52 md:h-52 rounded-full" style={{backgroundColor: 'rgba(214,177,77,0.12)', border: '2px solid rgba(214,177,77,0.25)'}}>
              <Music className="w-18 h-18 md:w-22 md:h-22" style={{color: 'rgb(214,177,77)'}} />
              {isPlaying && (
                <span className="absolute -top-2 -right-2 w-12 h-12 md:w-14 md:h-14 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50 border-2 border-gray-900" />
              )}
            </div>
            <span className="text-base md:text-lg font-semibold tracking-wide" style={{color: 'rgb(214,177,77)'}}>Playlist</span>
          </button>
        ) : isCompact ? (
          // Compact: Just artist + title with controls (music keeps playing)
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-full shadow-2xl overflow-hidden border border-gray-700/50 flex items-center gap-6 pl-12 pr-8 py-8">
            {/* Track Info */}
            <div className="flex items-center gap-6 flex-1 min-w-0 max-w-[160px] md:max-w-[220px]">
              <div className="relative shrink-0">
                <Music size={16} className="text-primary" />
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-[10px] text-primary font-semibold truncate">{currentTrack?.artist}</p>
                <p className="text-[11px] md:text-xs text-white font-medium truncate">{currentTrack?.title}</p>
              </div>
            </div>
            {/* Mini Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevTrack}
                className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors"
              >
                <SkipBack size={12} className="md:w-[10px] md:h-[10px] text-gray-400" />
              </button>
              <button
                onClick={togglePlay}
                className="w-9 h-9 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause size={14} className="md:w-[12px] md:h-[12px] text-primary" />
                ) : (
                  <Play size={14} className="md:w-[12px] md:h-[12px] text-primary ml-0.5" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors"
              >
                <SkipForward size={12} className="md:w-[10px] md:h-[10px] text-gray-400" />
              </button>
              <button
                onClick={() => setIsCompact(false)}
                className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                title="확장"
              >
                <Maximize2 size={12} className="md:w-[10px] md:h-[10px] text-gray-400" />
              </button>
              <button
                onClick={toggleMinimize}
                className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                title="닫기"
              >
                <X size={12} className="md:w-[10px] md:h-[10px] text-gray-400" />
              </button>
            </div>
            {/* Hidden player for audio */}
            {isPlaying && currentVideoId && (
              <div className="absolute -left-[9999px]">
                <div id="yt-player" ref={playerContainerRef} className="w-1 h-1" />
              </div>
            )}
          </div>
        ) : (
          // Full: Complete player view (smaller on mobile)
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl shadow-2xl overflow-hidden w-[200px] md:w-[340px] border border-gray-800/50">
            {/* Header */}
            <div className="flex items-center justify-between px-14 md:px-20 py-12 md:py-16 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-b border-gray-800/50">
              <div className="flex items-center gap-10 md:gap-14">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{background: 'linear-gradient(135deg, rgb(214,177,77) 0%, rgb(184,150,45) 100%)'}}>
                  <Music className="w-16 h-16 md:w-20 md:h-20 text-white" />
                </div>
                <div>
                  <span className="text-xs md:text-sm font-bold text-white tracking-wider">FINDS</span>
                  <span className="text-xs md:text-sm font-medium ml-1" style={{color: 'rgb(214,177,77)'}}>Playlist</span>
                </div>
              </div>
              <div className="flex items-center gap-6 md:gap-8">
                <button
                  onClick={() => setIsCompact(true)}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-800/80 flex items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700/50"
                  title="최소화"
                >
                  <Minimize2 className="w-12 h-12 md:w-14 md:h-14 text-gray-400" />
                </button>
                <button
                  onClick={toggleMinimize}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-800/80 flex items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700/50"
                  title="닫기"
                >
                  <X className="w-12 h-12 md:w-14 md:h-14 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Current Track Info with Marquee */}
            {currentTrack && (
              <div className="px-12 md:px-16 py-10 md:py-12 border-b border-gray-800/50 overflow-hidden">
                <p className="text-primary text-[10px] md:text-[11px] font-bold tracking-wider uppercase mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {currentTrack.artist}
                </p>
                <div className="overflow-hidden">
                  <p 
                    className={`text-white text-[13px] md:text-[15px] font-semibold whitespace-nowrap ${currentTrack.title.length > 20 ? 'animate-marquee' : ''}`}
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {currentTrack.title}{currentTrack.title.length > 20 ? `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${currentTrack.title}` : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              {isPlaying && currentVideoId ? (
                <div id="yt-player" ref={playerContainerRef} className="w-full h-full" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(214,177,77,0.08)_0%,_transparent_70%)]" />
                  <button
                    onClick={togglePlay}
                    className="relative w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-xl"
                    style={{background: 'linear-gradient(135deg, rgb(214,177,77) 0%, rgb(184,150,45) 100%)', boxShadow: '0 8px 32px rgba(214,177,77,0.4)'}}
                  >
                    <Play className="w-24 h-24 md:w-28 md:h-28 text-white ml-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="px-14 md:px-20 py-12 md:py-16 bg-gradient-to-t from-gray-950 to-gray-900 border-t border-gray-800/50">
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-16 md:gap-20 mb-10 md:mb-12">
                <button
                  onClick={prevTrack}
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gray-800/60 flex items-center justify-center hover:bg-gray-700 transition-all duration-200 border border-gray-700/30"
                  title="Previous"
                >
                  <SkipBack className="w-16 h-16 md:w-20 md:h-20 text-gray-300" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg"
                  style={{background: 'linear-gradient(135deg, rgb(214,177,77) 0%, rgb(184,150,45) 100%)', boxShadow: '0 4px 20px rgba(214,177,77,0.35)'}}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-20 h-20 md:w-24 md:h-24 text-white" />
                  ) : (
                    <Play className="w-20 h-20 md:w-24 md:h-24 text-white ml-2" />
                  )}
                </button>
                <button
                  onClick={nextTrack}
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gray-800/60 flex items-center justify-center hover:bg-gray-700 transition-all duration-200 border border-gray-700/30"
                  title="Next"
                >
                  <SkipForward className="w-16 h-16 md:w-20 md:h-20 text-gray-300" />
                </button>
              </div>
              
              {/* Track counter */}
              <div className="flex items-center justify-center">
                <span className="text-xs md:text-sm text-gray-500 font-medium tracking-wide">
                  {currentIndex + 1} <span className="text-gray-600 mx-1">/</span> {playlist.length}
                </span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
})

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-16">
            <div className="size-40 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          {/* Public Routes - Main Website */}
          <Route path="/" element={<Home />} />

          {/* About FINDS */}
          <Route path="/about" element={<Navigate to="/about/introduction" replace />} />
          <Route path="/about/introduction" element={<AboutIntroduction />} />
          <Route path="/about/research" element={<AboutResearch />} />
          <Route path="/about/honors" element={<AboutHonors />} />
          <Route path="/about/location" element={<AboutLocation />} />

          {/* Members */}
          <Route path="/members" element={<Navigate to="/members/director" replace />} />
          <Route path="/members/director" element={<MembersDirector />} />
          <Route path="/members/director/academic" element={<MembersDirectorAcademic />} />
          <Route path="/members/director/activities" element={<MembersDirectorActivities />} />
          <Route path="/members/current" element={<MembersCurrent />} />
          <Route path="/members/alumni" element={<MembersAlumni />} />
          <Route path="/members/:id" element={<MembersDetail />} />

          {/* Publications */}
          <Route path="/publications" element={<Publications />} />

          {/* Projects */}
          <Route path="/projects" element={<Projects />} />

          {/* Archives */}
          <Route path="/archives" element={<Navigate to="/archives/news" replace />} />
          <Route path="/archives/news" element={<ArchivesNews />} />
          <Route path="/archives/notice" element={<ArchivesNotice />} />
          <Route path="/archives/gallery" element={<ArchivesGallery />} />
          <Route path="/archives/playlist" element={<ArchivesPlaylist />} />

        </Routes>
      </Suspense>
      
      {/* Global Music Player - persists across page navigation */}
      <GlobalMusicPlayer />
    </>
  );
}
