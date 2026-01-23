import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Home, MapPin, Phone, Building2, Navigation, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import locationImg from '@/assets/images/location/1.webp'

export const LocationTemplate = () => {
  const [copied, setCopied] = useState(false)
  
  const handleCopyAddress = () => {
    const address = '(13120) 경기도 성남시 수정구 성남대로 1342 가천대학교 가천관 614호'
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Banner - Introduction과 동일한 스타일 */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        
        {/* Luxurious Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B14D]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Floating Accent */}
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B14D]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B14D]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              About FINDS
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight">
            Location
          </h1>
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
      <section className="pb-60 md:pb-80 px-16 md:px-20">
        <div className="max-w-1480 mx-auto flex flex-col lg:flex-row gap-20 md:gap-32">
          {/* Map Section - Height matches info cards combined */}
          <div className="flex-1 min-h-[300px] lg:min-h-[580px] rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden shadow-lg shadow-gray-100/50">
            <iframe
              src="https://maps.google.com/maps?q=가천대학교+가천관&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '100%' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gachon University - Gachon Hall"
            />
          </div>

          {/* Info Section - Two Cards */}
          <div className="w-full lg:w-420 flex flex-col gap-16 md:gap-20">
            
            {/* FINDS Lab Card - Top Card with Name Format */}
            <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex-1">
              {/* Decorative gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#D6C360] to-primary" />
              
              {/* Content with Large Icon */}
              <div className="p-24 md:p-32 h-full flex flex-col">
                {/* Header with Icon */}
                <div className="flex items-center gap-16 mb-20">
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                    <Building2 size={28} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">FINDS Lab</h3>
                    <p className="text-sm text-gray-400">금융인텔리전스연구실</p>
                  </div>
                </div>
                
                {/* Address Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-start gap-12">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-2">
                      <MapPin size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-semibold text-white mb-6">
                        가천대학교 가천관 614호
                      </p>
                      <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                        (13120) 경기도 성남시 수정구 성남대로 1342
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Director's Office Card - Bottom Card with Address Format */}
            <div className="relative bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex-1">
              {/* Decorative accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#AC0E0E] via-primary to-[#AC0E0E]" />
              
              {/* Content */}
              <div className="p-24 md:p-32 h-full flex flex-col">
                {/* Header */}
                <div className="mb-20">
                  <p className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-[0.15em] mb-6">Location</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Director's Office</h3>
                  <p className="text-sm text-gray-500 mt-4">최인수 교수 연구실</p>
                </div>
                
                {/* Address Cards */}
                <div className="flex-1 flex flex-col gap-12">
                  {/* Korean Address */}
                  <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-16 border border-gray-100 hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-start gap-12">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                        <MapPin size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-6 mb-6">
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">KR</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                          가천대학교 가천관 614호
                        </p>
                        <p className="text-xs text-gray-500 mt-4">
                          (13120) 경기도 성남시 수정구 성남대로 1342
                        </p>
                      </div>
                      <button
                        onClick={handleCopyAddress}
                        className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 shrink-0 shadow-sm"
                        title="주소 복사"
                      >
                        {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={12} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  {/* English Address */}
                  <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-16 border border-gray-100 hover:border-gray-200 transition-all duration-300">
                    <div className="flex items-start gap-12">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-md shadow-gray-300/30 shrink-0">
                        <Building2 size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-6 mb-6">
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">EN</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                          Room 614, Gachon Hall, Gachon University
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed mt-4">
                          1342 Seongnam-daero, Sujeong-gu, Seongnam-si, Gyeonggi-do 13120, Korea
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group relative bg-gradient-to-r from-primary/5 via-amber-50/50 to-primary/5 rounded-xl p-16 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center gap-12">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                        <Phone size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Tel</span>
                        <p className="text-base md:text-lg font-bold text-gray-900 tracking-wide mt-2">031-750-0614</p>
                      </div>
                      <a
                        href="tel:031-750-0614"
                        className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-lg hover:bg-primary hover:text-white transition-all duration-200 shrink-0"
                        title="전화 걸기"
                      >
                        <Phone size={14} className="text-primary group-hover:text-white" />
                      </a>
                    </div>
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
