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
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  destroy: () => void;
}

const GlobalMusicPlayer = memo(() => {
  const { 
    playlist, currentIndex, isPlaying, isMinimized, isLoaded,
    setPlaylist, setIsLoaded, nextTrack, prevTrack, togglePlay, toggleMinimize, setIsPlaying
  } = useMusicPlayerStore()
  
  const playerRef = useRef<YTPlayer | null>(null)
  const [trackInfo, setTrackInfo] = useState<{ artist: string; title: string }[]>([])
  const [playerReady, setPlayerReady] = useState(false)
  const lastVideoIdRef = useRef<string | null>(null)
  const [isCompact, setIsCompact] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
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
          const items = data.items.map((item: { url: string; artist?: string; title?: string }) => {
            const match = item.url.match(/[?&]v=([^&]+)/)
            return { videoId: match ? match[1] : null, artist: item.artist || 'Unknown Artist', title: item.title || 'Unknown Title' }
          }).filter((item: { videoId: string | null }) => item.videoId)
          
          if (data.shuffle) {
            for (let i = items.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [items[i], items[j]] = [items[j], items[i]]
            }
          }
          
          setTrackInfo(items.map((item: { artist: string; title: string }) => ({ artist: item.artist, title: item.title })))
          setPlaylist(items.map((item: { videoId: string }) => item.videoId))
          setIsLoaded(true)
        })
        .catch(err => console.error('Failed to load playlist:', err))
    }
  }, [isLoaded, setPlaylist, setIsLoaded])

  const currentVideoId = playlist[currentIndex]
  const currentTrack = trackInfo[currentIndex]

  // Initialize YouTube Player ONCE - never destroy
  useEffect(() => {
    if (!currentVideoId || playerRef.current) return

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100)
        return
      }

      playerRef.current = new window.YT.Player('yt-player', {
        videoId: currentVideoId,
        playerVars: { autoplay: isPlaying ? 1 : 0, controls: 1, modestbranding: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: () => { setPlayerReady(true); lastVideoIdRef.current = currentVideoId },
          onStateChange: (event) => { if (event.data === 0) nextTrack() },
        },
      })
    }

    initPlayer()
  }, [currentVideoId])

  // Handle track changes using loadVideoById
  useEffect(() => {
    if (!playerRef.current || !playerReady || !currentVideoId) return
    if (lastVideoIdRef.current === currentVideoId) return
    
    lastVideoIdRef.current = currentVideoId
    if (isPlaying) {
      playerRef.current.loadVideoById(currentVideoId)
    } else {
      playerRef.current.cueVideoById(currentVideoId)
    }
  }, [currentVideoId, playerReady, isPlaying])

  // Handle play/pause - KEEP PLAYING in compact/minimized mode
  useEffect(() => {
    if (!playerRef.current || !playerReady) return
    if (isPlaying) {
      playerRef.current.playVideo()
    } else {
      playerRef.current.pauseVideo()
    }
  }, [isPlaying, playerReady])

  const isPlaylistPage = location.pathname === '/archives/playlist'

  const handleHidePlayer = () => {
    if (playerRef.current) playerRef.current.pauseVideo()
    setIsPlaying(false)
    setIsHidden(true)
  }

  // Hidden state
  if (isHidden) {
    return (
      <div className="fixed bottom-20 right-20 z-[9999] hidden md:flex flex-col items-end gap-12">
        {location.pathname !== '/' && (
          <Link to="/" className="flex items-center justify-center w-32 h-32 bg-primary text-white rounded-full shadow-xl hover:bg-primary/90 hover:scale-105 transition-all duration-200" title="홈으로">
            <HomeIcon className="w-16 h-16" />
          </Link>
        )}
        <div className="fixed -left-[9999px] -top-[9999px] w-1 h-1 overflow-hidden"><div id="yt-player" /></div>
      </div>
    )
  }

  return (
    <>
      {/* Player div - ALWAYS in DOM */}
      <div className={(isMinimized || isCompact) ? "fixed -left-[9999px] -top-[9999px] w-1 h-1 overflow-hidden" : "hidden"}>
        <div id="yt-player" />
      </div>
      
      {/* Main UI - Hidden on mobile */}
      <div className="fixed bottom-20 right-20 z-[9999] hidden md:flex flex-col items-end gap-12">
        {location.pathname !== '/' && (
          <Link to="/" className="flex items-center justify-center w-32 h-32 bg-primary text-white rounded-full shadow-xl hover:bg-primary/90 hover:scale-105 transition-all duration-200" title="홈으로">
            <HomeIcon className="w-16 h-16" />
          </Link>
        )}
        
        {playlist.length > 0 && !isPlaylistPage && (
          isMinimized ? (
            <div className="flex items-center gap-8">
              <button onClick={handleHidePlayer} className="flex items-center justify-center w-36 h-36 bg-gray-800 text-gray-400 rounded-full shadow-lg hover:bg-gray-700 hover:text-white transition-all duration-200 border border-gray-700/50" title="플레이리스트 숨기기">
                <X className="w-16 h-16" />
              </button>
              <button onClick={() => toggleMinimize()} className="group flex items-center gap-14 px-28 py-18 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full shadow-2xl hover:shadow-[0_8px_30px_rgba(214,177,77,0.25)] transition-all duration-300 border border-gray-700/50 hover:scale-105">
                <div className="relative flex items-center justify-center w-52 h-52 rounded-full" style={{backgroundColor: 'rgba(214,177,77,0.12)', border: '2px solid rgba(214,177,77,0.25)'}}>
                  <Music className="w-22 h-22" style={{color: 'rgb(214,177,77)'}} />
                  {isPlaying && <span className="absolute -top-2 -right-2 w-14 h-14 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50 border-2 border-gray-900" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-wide" style={{color: 'rgb(214,177,77)'}}>FINDS</span>
                  <span className="text-sm font-medium text-gray-400">Playlist</span>
                </div>
              </button>
            </div>
          ) : isCompact ? (
            // Compact: Music keeps playing with mini controls
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-full shadow-2xl overflow-hidden border border-gray-700/50 flex items-center gap-6 pl-12 pr-8 py-8">
              <div className="flex items-center gap-6 flex-1 min-w-0 max-w-[220px]">
                <div className="relative shrink-0">
                  <Music size={16} style={{color: 'rgb(214,177,77)'}} />
                  {isPlaying && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold truncate" style={{color: 'rgb(214,177,77)'}}>{currentTrack?.artist}</p>
                  <p className="text-xs text-white font-medium truncate">{currentTrack?.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={prevTrack} className="w-7 h-7 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                  <SkipBack size={10} className="text-gray-400" />
                </button>
                <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors">
                  {isPlaying ? <Pause size={12} className="text-primary" /> : <Play size={12} className="text-primary ml-0.5" />}
                </button>
                <button onClick={nextTrack} className="w-7 h-7 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                  <SkipForward size={10} className="text-gray-400" />
                </button>
                <button onClick={() => setIsCompact(false)} className="w-7 h-7 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors" title="확장">
                  <Maximize2 size={10} className="text-gray-400" />
                </button>
                <button onClick={toggleMinimize} className="w-7 h-7 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors" title="닫기">
                  <X size={10} className="text-gray-400" />
                </button>
              </div>
            </div>
          ) : (
            // Full player
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl shadow-2xl overflow-hidden w-[340px] border border-gray-800/50">
              <div className="flex items-center justify-between px-20 py-16 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-b border-gray-800/50">
                <div className="flex items-center gap-14">
                  <div className="w-44 h-44 rounded-xl flex items-center justify-center shadow-lg overflow-hidden shrink-0" style={{background: 'linear-gradient(135deg, rgb(214,177,77) 0%, rgb(184,150,45) 100%)'}}>
                    <Music className="w-20 h-20 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white tracking-wider">FINDS</span>
                    <span className="text-sm font-medium" style={{color: 'rgb(214,177,77)'}}>Playlist</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <button onClick={() => setIsCompact(true)} className="w-28 h-28 rounded-full bg-gray-800/80 flex items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700/50" title="컴팩트">
                    <Minimize2 className="w-12 h-12 text-gray-400" />
                  </button>
                  <button onClick={toggleMinimize} className="w-28 h-28 rounded-full bg-gray-800/80 flex items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700/50" title="접기">
                    <X className="w-12 h-12 text-gray-400" />
                  </button>
                </div>
              </div>

              {currentTrack && (
                <div className="px-16 py-12 border-b border-gray-800/50 overflow-hidden">
                  <p className="text-[11px] font-bold tracking-wider mb-1" style={{color: 'rgb(214,177,77)'}}>{currentTrack.artist}</p>
                  <div className="overflow-hidden">
                    <p className={`text-white text-[15px] font-semibold whitespace-nowrap ${currentTrack.title.length > 20 ? 'animate-marquee' : ''}`}>
                      {currentTrack.title}{currentTrack.title.length > 20 ? `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${currentTrack.title}` : ''}
                    </p>
                  </div>
                </div>
              )}

              <div className="relative aspect-video bg-black">
                <div id="yt-player" className="w-full h-full" />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(214,177,77,0.08)_0%,_transparent_70%)]" />
                    <div className="flex flex-col items-center gap-8">
                      <Music className="w-40 h-40" style={{color: 'rgb(214,177,77)'}} />
                      <span className="text-gray-400 text-sm">Press play to start</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-20 py-16 bg-gradient-to-t from-gray-950 to-gray-900 border-t border-gray-800/50">
                <div className="flex items-center justify-center gap-20 mb-12">
                  <button onClick={prevTrack} className="w-44 h-44 rounded-full bg-gray-800/60 flex items-center justify-center hover:bg-gray-700 transition-all duration-200 border border-gray-700/30" title="Previous">
                    <SkipBack className="w-20 h-20 text-gray-300" />
                  </button>
                  <button onClick={togglePlay} className="w-56 h-56 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg" style={{background: 'linear-gradient(135deg, rgb(214,177,77) 0%, rgb(184,150,45) 100%)', boxShadow: '0 4px 20px rgba(214,177,77,0.35)'}} title={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <Pause className="w-24 h-24 text-white" /> : <Play className="w-24 h-24 text-white ml-2" />}
                  </button>
                  <button onClick={nextTrack} className="w-44 h-44 rounded-full bg-gray-800/60 flex items-center justify-center hover:bg-gray-700 transition-all duration-200 border border-gray-700/30" title="Next">
                    <SkipForward className="w-20 h-20 text-gray-300" />
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-500 font-medium tracking-wide">{currentIndex + 1} <span className="text-gray-600 mx-1">/</span> {playlist.length}</span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  )
})

export const App = () => {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <>
      <GlobalMusicPlayer />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary">Loading...</div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about/introduction" element={<AboutIntroduction />} />
          <Route path="/about/research" element={<AboutResearch />} />
          <Route path="/about/honors" element={<AboutHonors />} />
          <Route path="/about/location" element={<AboutLocation />} />
          <Route path="/members/director" element={<MembersDirector />} />
          <Route path="/members/director/activities" element={<MembersDirectorActivities />} />
          <Route path="/members/director/academic" element={<MembersDirectorAcademic />} />
          <Route path="/members/current" element={<MembersCurrent />} />
          <Route path="/members/alumni" element={<MembersAlumni />} />
          <Route path="/members/detail/:id" element={<MembersDetail />} />
          <Route path="/archives/news" element={<ArchivesNews />} />
          <Route path="/archives/notice" element={<ArchivesNotice />} />
          <Route path="/archives/gallery" element={<ArchivesGallery />} />
          <Route path="/archives/playlist" element={<ArchivesPlaylist />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};
