import "../../assets/css/common.css";
import "../../assets/css/theme.css";
import "../../assets/css/font.css";

import {Route, Routes, useLocation, Navigate} from "react-router-dom";
import {lazy, Suspense, useEffect, memo, useRef} from "react";
import { Music, Play, Pause, X } from 'lucide-react'
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
    togglePlay, 
    toggleMinimize,
    setIsMinimized,
    setIsPlaying
  } = useMusicPlayerStore()
  
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

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
      fetch('/website/data/playlist/ischoi.json')
        .then(res => res.json())
        .then(data => {
          const videoIds = data.items.map((item: { url: string }) => {
            const match = item.url.match(/[?&]v=([^&]+)/)
            return match ? match[1] : null
          }).filter(Boolean)
          
          if (data.shuffle) {
            for (let i = videoIds.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [videoIds[i], videoIds[j]] = [videoIds[j], videoIds[i]]
            }
          }
          setPlaylist(videoIds)
          setIsLoaded(true)
        })
        .catch(err => console.error('Failed to load playlist:', err))
    }
  }, [isLoaded, setPlaylist, setIsLoaded])

  const currentVideoId = playlist[currentIndex]

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

  if (playlist.length === 0) return null

  return (
    <div className="fixed bottom-20 right-20 z-[9999]">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-8 px-16 py-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all"
        >
          <Music size={18} />
          <span className="text-sm font-medium hidden sm:inline">FINDS Playlist</span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-[320px]">
          <div className="flex items-center justify-between px-16 py-12 bg-gradient-to-r from-primary to-amber-500">
            <div className="flex items-center gap-8">
              <Music size={16} className="text-white" />
              <span className="text-sm font-bold text-white">FINDS Playlist</span>
            </div>
            <button
              onClick={toggleMinimize}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative aspect-video bg-black">
            {isPlaying && currentVideoId ? (
              <div id="yt-player" ref={playerContainerRef} className="w-full h-full" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <button
                  onClick={togglePlay}
                  className="w-60 h-60 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Play size={28} className="text-white ml-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-16 py-12">
            <span className="text-xs text-gray-500">
              Track {currentIndex + 1} / {playlist.length}
            </span>
            <div className="flex items-center gap-12">
              <button
                onClick={togglePlay}
                className="p-8 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={nextTrack}
                className="px-12 py-6 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Next
              </button>
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
          <Route path="/members/director-activities" element={<MembersDirectorActivities />} />
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
