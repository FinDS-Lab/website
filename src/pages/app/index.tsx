import "../../assets/css/common.css";
import "../../assets/css/theme.css";
import "../../assets/css/font.css";

import {Route, Routes, useLocation, Navigate, Link} from "react-router-dom";
import {lazy, Suspense, useEffect, memo, useRef, useState} from "react";
import { Music, Play, Pause, X, Home as HomeIcon, List, SkipForward, SkipBack } from 'lucide-react'
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

// Home Button Component - Always visible except on home page
const HomeButton = memo(() => {
  const location = useLocation()
  
  // Don't show on home page
  if (location.pathname === '/' || location.pathname === '/website/' || location.pathname === '/website') {
    return null
  }
  
  return (
    <Link
      to="/"
      className="fixed bottom-[80px] md:bottom-[90px] right-16 md:right-20 z-[10000] flex items-center justify-center size-44 md:size-52 bg-white border-2 border-gray-300 rounded-full shadow-xl hover:bg-primary hover:border-primary transition-all group"
      title="홈으로"
    >
      <HomeIcon size={24} className="text-gray-700 group-hover:text-white" />
    </Link>
  )
})

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
    setIsPlaying,
    setCurrentIndex
  } = useMusicPlayerStore()
  
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const [trackInfo, setTrackInfo] = useState<{ artist: string; title: string }[]>([])
  const [showPlaylist, setShowPlaylist] = useState(false)
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

      // Create new player
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
  
  // Don't render if no playlist
  if (playlist.length === 0 || isPlaylistPage) {
    return null
  }

  // Handle track selection from playlist
  const handleTrackSelect = (index: number) => {
    setCurrentIndex(index)
    if (!isPlaying) {
      togglePlay()
    }
    setShowPlaylist(false)
  }

  return (
    <div className="fixed bottom-16 md:bottom-20 right-16 md:right-20 z-[9998]">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="group flex items-center gap-8 px-16 py-12 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full shadow-2xl hover:shadow-primary/20 transition-all duration-300 border border-gray-700"
        >
          <div className="relative">
            <Music size={18} className="text-primary" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-sm font-medium tracking-wide">Playlist</span>
        </button>
      ) : (
        <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden w-[300px] md:w-[340px] border border-gray-800">
          {/* Header */}
          <div className="relative px-16 py-14 bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
                  <Music size={18} className="text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white/90 tracking-wider uppercase">Now Playing</span>
                </div>
              </div>
              <button
                onClick={toggleMinimize}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={14} className="text-white/70" />
              </button>
            </div>
          </div>

          {/* Current Track Info */}
          {currentTrack && (
            <div className="px-16 py-12 bg-gray-850 border-b border-gray-800">
              <p className="text-primary text-xs font-bold tracking-wide mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {currentTrack.artist}
              </p>
              <p className="text-white text-sm font-medium truncate" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {currentTrack.title}
              </p>
            </div>
          )}

          {/* Video Player or Playlist View */}
          {showPlaylist ? (
            <div className="bg-gray-850 max-h-[240px] overflow-y-auto scrollbar-thin">
              {trackInfo.map((track, index) => (
                <button
                  key={index}
                  onClick={() => handleTrackSelect(index)}
                  className={`w-full px-16 py-10 flex items-center gap-12 hover:bg-gray-800 transition-colors border-b border-gray-800/50 ${
                    index === currentIndex ? 'bg-gray-800' : ''
                  }`}
                >
                  <span className={`w-6 text-xs font-mono ${index === currentIndex ? 'text-primary' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-xs truncate ${index === currentIndex ? 'text-primary font-semibold' : 'text-gray-400'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {track.artist}
                    </p>
                    <p className={`text-sm truncate ${index === currentIndex ? 'text-white font-medium' : 'text-gray-300'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {track.title}
                    </p>
                  </div>
                  {index === currentIndex && isPlaying && (
                    <div className="flex gap-1">
                      <span className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="relative aspect-video bg-black">
              {isPlaying && currentVideoId ? (
                <div id="yt-player" ref={playerContainerRef} className="w-full h-full" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-8 mx-auto">
                      <Music size={24} className="text-gray-600" />
                    </div>
                    <p className="text-gray-500 text-xs">Press play to start</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="px-16 py-14 bg-gray-900 border-t border-gray-800">
            <div className="flex items-center justify-between">
              {/* Track Counter / List Toggle */}
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`flex items-center gap-6 px-10 py-6 rounded-lg transition-all ${
                  showPlaylist 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <List size={14} />
                <span className="text-xs font-medium">{currentIndex + 1}/{playlist.length}</span>
              </button>

              {/* Main Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevTrack}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                >
                  <SkipBack size={16} />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
                >
                  {isPlaying ? (
                    <Pause size={18} className="text-white" />
                  ) : (
                    <Play size={18} className="text-white ml-0.5" />
                  )}
                </button>
                
                <button
                  onClick={nextTrack}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Spacer for balance */}
              <div className="w-[72px]" />
            </div>
          </div>
        </div>
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
      
      {/* Home Button - Always visible except on home page */}
      <HomeButton />
      
      {/* Global Music Player - persists across page navigation */}
      <GlobalMusicPlayer />
    </>
  );
}
