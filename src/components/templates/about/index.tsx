import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Home, Clock, MapPin } from 'lucide-react'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import locationImg from '@/assets/images/location/1.png'

export const LocationTemplate = () => {
  const handleCopyAddress = () => {
    const address = '(13120) 경기도 성남시 수정구 성남대로 1342 가천대학교 가천관'
    navigator.clipboard.writeText(address)
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B04C]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Floating Accent */}
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B04C]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B04C]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              About FINDS
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B04C]/80" />
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
        <div className="max-w-1480 mx-auto flex flex-col lg:flex-row gap-16 md:gap-20">
          {/* Map Section */}
          <div className="flex-1 h-300 md:h-520 rounded-xl md:rounded-[20px] border border-gray-100 overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=가천대학교+가천관&t=&z=17&ie=UTF8&iwloc=&output=embed"
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
          <div className="w-full lg:w-500 flex flex-col gap-16 md:gap-20">
            
            {/* FINDS Lab Card */}
            <div className="rounded-xl md:rounded-[20px] border border-gray-100 overflow-hidden">
              <div className="relative h-100 md:h-120 overflow-hidden">
                <img
                  src={locationImg}
                  alt="Gachon Hall"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-16 md:px-20 py-12 md:py-14">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm md:text-md font-semibold text-white">
                        금융인텔리전스연구실
                      </h3>
                      <p className="text-xs md:text-sm text-gray-300">
                        FINDS Lab.
                      </p>
                    </div>
                    <div className="flex items-center gap-6 px-10 py-4 bg-white/20 backdrop-blur-sm rounded-full">
                      <MapPin size={12} className="text-white" />
                      <span className="text-xs font-medium text-white">운영 중</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-16 md:p-20">
                <div className="flex items-center gap-8 mb-12">
                  <div className="w-3 h-16 md:h-18 bg-[#AC0E0E] rounded-full" />
                  <h4 className="text-base md:text-lg font-semibold text-gray-900">
                    가천대학교 가천관 705호
                  </h4>
                </div>
                <div className="bg-gray-50 rounded-xl md:rounded-[12px] p-12 md:p-16">
                  <p className="text-sm text-gray-600">
                    금융인텔리전스연구실 (FINDS Lab.)
                  </p>
                </div>
              </div>
            </div>

            {/* Professor's Office Card */}
            <div className="rounded-xl md:rounded-[20px] border border-gray-100 overflow-hidden">
              <div className="relative h-100 md:h-120 overflow-hidden">
                <img
                  src={locationImg}
                  alt="Gachon Hall"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-16 md:px-20 py-12 md:py-14">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm md:text-md font-semibold text-white">
                        최인수 연구실
                      </h3>
                      <p className="text-xs md:text-sm text-gray-300">
                        Prof. Insu Choi's Office
                      </p>
                    </div>
                    <div className="flex items-center gap-6 px-10 py-4 bg-white/20 backdrop-blur-sm rounded-full">
                      <MapPin size={12} className="text-white" />
                      <span className="text-xs font-medium text-white">운영 중</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-16 md:p-20">
                <div className="flex items-center gap-8 mb-12">
                  <div className="w-3 h-16 md:h-18 bg-primary rounded-full" />
                  <h4 className="text-base md:text-lg font-semibold text-gray-900">
                    가천관 614호
                  </h4>
                </div>
                <div className="bg-gray-50 rounded-xl md:rounded-[12px] p-12 md:p-16">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-6 md:gap-8">
                      <p className="text-sm md:text-base font-medium text-gray-900">
                        (13120) 경기도 성남시 수정구 성남대로 1342
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        Gachon Hall, Gachon University<br />
                        1342 Seongnam-daero, Sujeong-gu, Seongnam-si
                      </p>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-white border border-gray-100 rounded-lg md:rounded-[8px] hover:bg-gray-100 transition-colors shrink-0 ml-8"
                    >
                      <Copy className="w-14 h-14 md:w-16 md:h-16 text-gray-500" />
                    </button>
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
