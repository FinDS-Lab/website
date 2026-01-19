import "../../assets/css/common.css";
import "../../assets/css/theme.css";
import "../../assets/css/font.css";

import {Route, Routes, useLocation, Navigate} from "react-router-dom";
import {lazy, Suspense, useEffect} from "react";

// Public Pages
const Home = lazy(() => import('../home').then((module) => ({ default: module.Home })));
const Publications = lazy(() => import('../publications').then((module) => ({ default: module.Publications })));
const Projects = lazy(() => import('../projects').then((module) => ({ default: module.Projects })));

// About FINDS
const AboutIntroduction = lazy(() => import('../about/introduction').then((module) => ({ default: module.AboutIntroduction })));
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

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense>
      <Routes>
        {/* Public Routes - Main Website */}
        <Route path="/" element={<Home />} />

        {/* About FINDS */}
        <Route path="/about" element={<Navigate to="/about/introduction" replace />} />
        <Route path="/about/introduction" element={<AboutIntroduction />} />
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
  );
}
