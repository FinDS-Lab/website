import { memo, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Home, MapPin } from 'lucide-react'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import locationImg from '@/assets/images/location/1.webp'

// Scroll animation hook
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

export const LocationTemplate = () => {
  const contentAnimation = useScrollAnimation()

  return (
    <div className="flex flex-col bg-white scroll-mt-[80px]">
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center md:scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B14D]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B14D]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B14D]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              About FINDS
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Location
          </h1>
          
          {/* Divider - < . > style */}
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#D6C360]/50 to-[#D6C360]" />
            <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent via-[#D6C360]/50 to-[#D6C360]" />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20">
        <div className="py-20 md:py-32 border-b border-gray-100">
          <div className="flex items-center gap-8 md:gap-12 flex-wrap">
            <Link to="/" className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110">
              <Home size={16} />
            </Link>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-gray-400 font-medium">About FINDS</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">Location</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section 
        ref={contentAnimation.ref}
        className={`pb-60 md:pb-80 px-16 md:px-20 transition-all duration-700 ${contentAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        <div className="max-w-1480 mx-auto flex flex-col lg:flex-row lg:items-stretch gap-20 md:gap-32">
          {/* Map Section */}
          <div className="h-[280px] md:h-[400px] lg:h-auto lg:flex-1 rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden shadow-lg shadow-gray-100/50 relative">
            <iframe
              src="https://maps.google.com/maps?q=가천대학교+가천관&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gachon University - Gachon Hall"
            />
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-400 flex flex-col gap-16 md:gap-20">
            
            {/* FINDS Lab Card - Dark Theme with Image */}
            <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#D6C360] to-primary" />
              
              {/* Background Image */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: `url(${locationImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              
              <div className="relative p-20 md:p-28 h-full flex flex-col">
                {/* Title */}
                <div className="mb-16 md:mb-20">
                  <h3 className="text-lg md:text-xl font-bold text-white">FINDS Lab</h3>
                  <p className="text-xs text-gray-400 mt-2">금융인텔리전스연구실</p>
                </div>
                
                {/* Address - KOR */}
                <div className="flex-1 flex flex-col gap-12">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-14 border border-white/10">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider">KOR</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                    </div>
                    <p className="text-sm font-medium text-white leading-relaxed">
                      가천대학교 가천관 614호
                    </p>
                    <p className="text-xs text-gray-400 mt-4">
                      (13120) 경기도 성남시 수정구 성남대로 1342
                    </p>
                  </div>

                  {/* Address - ENG */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-14 border border-white/10">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">ENG</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent" />
                    </div>
                    <p className="text-sm font-medium text-white leading-relaxed">
                      Room 614, Gachon Hall, Gachon University
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed mt-4">
                      1342 Seongnam-daero, Sujeong-gu,
                      <br />
                      Seongnam-si, Gyeonggi-do 13120, Korea
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Director's Office Card - Light Theme with Image */}
            <div className="relative bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#AC0E0E] via-primary to-[#AC0E0E]" />
              
              {/* Background Image */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{ backgroundImage: `url(${locationImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              
              <div className="relative p-20 md:p-28 h-full flex flex-col">
                {/* Title */}
                <div className="mb-16 md:mb-20">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Director's Office</h3>
                  <p className="text-xs text-gray-500 mt-2">최인수 교수 연구실</p>
                </div>
                
                {/* Address - KOR */}
                <div className="flex-1 flex flex-col gap-12">
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-14 border border-gray-100">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider">KOR</span>
                      <div className="w-16 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      가천대학교 가천관 614호
                    </p>
                    <p className="text-xs text-gray-500 mt-4">
                      (13120) 경기도 성남시 수정구 성남대로 1342
                    </p>
                  </div>

                  {/* Address - ENG */}
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-14 border border-gray-100">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">ENG</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      Room 614, Gachon Hall, Gachon University
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-4">
                      1342 Seongnam-daero, Sujeong-gu,
                      <br />
                      Seongnam-si, Gyeonggi-do 13120, Korea
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default memo(LocationTemplate)
