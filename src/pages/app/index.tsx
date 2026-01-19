import "../../assets/css/common.css";
import "../../assets/css/theme.css";
import "../../assets/css/font.css";

import {Route, Routes, useLocation, Navigate} from "react-router-dom";
import {lazy, Suspense, useEffect, useState, memo} from "react";
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
    setIsMinimized
  } = useMusicPlayerStore()

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
              <iframe
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&loop=0&enablejsapi=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              />
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
      <Suspense>
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
