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
      {/* Banner Section */}
      <div className="relative w-full h-200 md:h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-2xl md:text-[36px] font-semibold text-white text-center">
            Location
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-20 md:py-40">
        <div className="flex items-center gap-8 md:gap-10 flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            <Home size={16} />
          </Link>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-gray-400">About FINDS</span>
          <span className="text-[#cdcdcd]">›</span>
          <span className="text-sm md:text-base text-primary font-medium">Location</span>
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
                        금융데이터인텔리전스 연구실
                      </h3>
                      <p className="text-xs md:text-sm text-gray-300">
                        FINDS Lab.
                      </p>
                    </div>
                    <div className="flex items-center gap-6 px-10 py-4 bg-primary/20 backdrop-blur-sm rounded-full">
                      <Clock size={12} className="text-primary" />
                      <span className="text-xs font-medium text-primary">준비 중</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-16 md:p-20">
                <div className="flex items-center gap-8 mb-12">
                  <div className="w-3 h-16 md:h-18 bg-gray-300 rounded-full" />
                  <h4 className="text-base md:text-lg font-semibold text-gray-400">
                    위치 미정
                  </h4>
                </div>
                <div className="bg-gray-50 rounded-xl md:rounded-[12px] p-12 md:p-16">
                  <p className="text-sm text-gray-500">
                    연구실은 현재 개설 준비 중입니다.<br />
                    오픈 시 정확한 위치가 업데이트됩니다.
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
                        최인수 교수 연구실
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
                    가천대학교 가천관
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
