import "../../assets/css/common.css";
import "../../assets/css/theme.css";
import "../../assets/css/font.css";

import {Route, Routes, useLocation, Navigate, Link} from "react-router-dom";
import {lazy, Suspense, useEffect, memo, useRef, useState} from "react";
import { Music, Play, Pause, X, Home as HomeIcon, SkipBack, SkipForward } from 'lucide-react'
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

  return (
    <div className="fixed bottom-16 md:bottom-20 right-16 md:right-20 z-[9999] flex flex-col items-end gap-10 md:gap-12">
      {/* Home Button - Always visible except on home page */}
      {location.pathname !== '/' && (
        <Link
          to="/"
          className="flex items-center justify-center size-48 md:size-56 bg-white border-2 border-gray-300 text-gray-600 rounded-full shadow-xl hover:bg-primary hover:text-white hover:border-primary transition-all"
          title="홈으로"
        >
          <HomeIcon size={24} className="md:w-7 md:h-7" />
        </Link>
      )}
      
      {/* Playlist Button/Player - Only show when playlist is loaded */}
      {playlist.length > 0 && !isPlaylistPage && (
        isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-6 md:gap-8 px-12 md:px-16 py-10 md:py-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all"
          >
            <Music size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-xs md:text-sm font-medium">Playlist</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-[280px] md:w-[320px]">
            {/* Header */}
            <div className="flex items-center justify-between px-12 md:px-16 py-10 md:py-12 bg-gradient-to-r from-primary to-[#D6C360]">
              <div className="flex items-center gap-6 md:gap-8">
                <Music size={14} className="text-white md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-bold text-white">FINDS Playlist</span>
              </div>
              <button
                onClick={toggleMinimize}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>

            {/* Current Track Info - Always visible when track exists */}
            {currentTrack && (
              <div className="px-12 md:px-16 py-8 md:py-10 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] md:text-xs font-bold truncate" style={{ color: '#D6B14D' }}>
                  {currentTrack.artist}
                </p>
                <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                  {currentTrack.title}
                </p>
              </div>
            )}

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              {isPlaying && currentVideoId ? (
                <div id="yt-player" ref={playerContainerRef} className="w-full h-full" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <button
                    onClick={togglePlay}
                    className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Play size={24} className="text-white ml-3 md:ml-4 md:w-7 md:h-7" />
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-12 md:px-16 py-10 md:py-12">
              <span className="text-[10px] md:text-xs text-gray-500">
                Track {currentIndex + 1} / {playlist.length}
              </span>
              <div className="flex items-center gap-6 md:gap-8">
                <button
                  onClick={prevTrack}
                  className="p-6 md:p-8 rounded-full hover:bg-gray-100 transition-colors"
                  title="Previous"
                >
                  <SkipBack size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-6 md:p-8 rounded-full hover:bg-gray-100 transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={16} className="md:w-[18px] md:h-[18px]" /> : <Play size={16} className="md:w-[18px] md:h-[18px]" />}
                </button>
                <button
                  onClick={nextTrack}
                  className="p-6 md:p-8 rounded-full hover:bg-gray-100 transition-colors"
                  title="Next"
                >
                  <SkipForward size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
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
