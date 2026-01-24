import { memo, useEffect, useRef, useState } from 'react'
import { Search, Zap, Lightbulb, Quote, Sparkles } from 'lucide-react'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import icon10 from '@/assets/images/icons/10.png'
import icon11 from '@/assets/images/icons/11.png'
import icon12 from '@/assets/images/icons/12.png'

// Focus Areas Data - with bold keywords and longer Korean descriptions
const focusAreas = [
  {
    image: icon12,
    title: 'Financial Data Science',
    titleKo: '금융 데이터 사이언스',
    desc: 'We collect and analyze <b>complex financial market data</b> to discover <b>valuable patterns</b> and <b>insights</b>.',
    descKo: '금융 시장에서 발생하는 <b>복잡하고 방대한 데이터</b>를 체계적으로 수집·정제하고, <b>고급 분석 기법</b>을 적용하여 시장의 흐름과 <b>숨겨진 패턴</b>을 발견합니다. 이를 통해 <b>투자 전략</b> 수립과 <b>리스크 관리</b>에 필요한 핵심 인사이트를 도출합니다.',
  },
  {
    image: icon11,
    title: 'Business Analytics',
    titleKo: '비즈니스 애널리틱스',
    desc: 'We propose <b>optimal business strategies</b> and <b>solutions</b> through <b>data-driven statistical methodologies</b>.',
    descKo: '<b>데이터 중심의 통계적 방법론</b>과 <b>머신러닝 기법</b>을 활용하여 비즈니스 현장의 복잡한 문제를 분석합니다. 이를 바탕으로 <b>실행 가능한 전략</b>과 <b>최적의 솔루션</b>을 제안하여 기업의 <b>경쟁력 강화</b>와 <b>성과 향상</b>에 기여합니다.',
  },
  {
    image: icon10,
    title: 'Data-Informed Decisions',
    titleKo: '데이터 기반 의사결정',
    desc: 'We help make <b>clearer</b> and <b>more rational decisions</b> by leveraging <b>objective data intelligence</b>.',
    descKo: '<b>객관적인 데이터 인텔리전스</b>를 기반으로 불확실성 속에서도 <b>명확하고 합리적인 의사결정</b>이 가능하도록 지원합니다. 직관에 의존하지 않고 <b>데이터에 근거한 판단</b>을 통해 <b>비즈니스 리스크</b>를 최소화하고 <b>성공 확률</b>을 높입니다.',
  },
]

// Pillars Data
const pillars = [
  {
    icon: Search,
    label: 'Research',
    labelKo: '연구',
    number: '01',
    title: 'We pursue research from multiple perspectives.',
    titleKo: '다양한 관점에서 연구를 추구합니다.',
    description: 'Using <b>systematic methodologies</b> in <b>financial data science</b> and <b>business analytics</b>, we advance knowledge while developing <b>clear frameworks</b> that support <b>practical applications</b> and <b>informed decision-making</b>.',
    descriptionKo: '<b>금융 데이터 사이언스</b>와 <b>비즈니스 애널리틱스</b>의 <b>체계적인 방법론</b>을 활용하여 지식을 발전시키고, <b>실용적인 적용</b>과 <b>합리적인 의사결정</b>을 지원하는 <b>명확한 프레임워크</b>를 개발합니다.',
  },
  {
    icon: Zap,
    label: 'Impact',
    labelKo: '영향력',
    number: '02',
    title: 'We turn theory into practical solutions.',
    titleKo: '이론을 실용적인 솔루션으로 전환합니다.',
    description: 'Our work helps practitioners <b>manage uncertainty</b> and <b>connect</b> <b>analytical methods</b> with <b>everyday practice</b>, in both <b>financial markets</b> and <b>business operations</b>.',
    descriptionKo: '우리의 연구는 실무자들이 <b>금융 시장</b>과 <b>비즈니스 운영</b>에서 <b>불확실성을 관리</b>하고, <b>분석적 방법론</b>을 <b>일상적인 실무</b>에 <b>연결</b>할 수 있도록 돕습니다.',
  },
  {
    icon: Lightbulb,
    label: 'Philosophy',
    labelKo: '철학',
    number: '03',
    title: 'We strive toward "des avenirs lucides".',
    titleKo: '"명징한 미래(des avenirs lucides)"를 향해 나아갑니다.',
    subtitle: '— lucid futures',
    subtitleKo: '— 명징한 미래',
    description: 'Through <b>data science</b>, we aim to bring <b>clarity</b>, <b>understanding</b>, and <b>openness</b> to complex problems, working toward a more <b>fair</b>, <b>creative</b>, and <b>meaningful</b> future in finance and business.',
    descriptionKo: '<b>데이터 사이언스</b>를 통해 복잡한 문제에 <b>명확함</b>, <b>이해</b>, 그리고 <b>개방성</b>을 가져오고, 금융과 비즈니스 분야에서 더욱 <b>공정하고</b>, <b>창의적이며</b>, <b>의미 있는</b> 미래를 향해 나아갑니다.',
  },
]

// Scroll animation hook with brightness tracking
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

// Scroll-based brightness hook for Vision section
const useScrollBrightness = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [brightness, setBrightness] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowHeight / 2
      
      // Calculate how close element center is to viewport center
      const distanceFromCenter = Math.abs(elementCenter - viewportCenter)
      const maxDistance = windowHeight / 2 + rect.height / 2
      
      // Normalize to 0-1 (1 when centered, 0 when far)
      const normalizedBrightness = Math.max(0, 1 - (distanceFromCenter / maxDistance))
      setBrightness(normalizedBrightness)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { ref, brightness }
}

// Elegant Language Toggle - Pill style, minimal
const LangToggle = ({ lang, setLang, variant = 'light' }: { lang: 'ko' | 'en', setLang: (l: 'ko' | 'en') => void, variant?: 'light' | 'dark' }) => (
  <div className={`inline-flex items-center rounded-full p-1 ${variant === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
    <button
      onClick={() => setLang('ko')}
      className={`px-10 py-5 text-[10px] md:text-[11px] font-bold rounded-full transition-all duration-300 ${
        lang === 'ko' 
          ? variant === 'dark' ? 'bg-[#D6B14D] text-gray-900' : 'bg-gray-900 text-white'
          : variant === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      KOR
    </button>
    <button
      onClick={() => setLang('en')}
      className={`px-10 py-5 text-[10px] md:text-[11px] font-bold rounded-full transition-all duration-300 ${
        lang === 'en' 
          ? variant === 'dark' ? 'bg-[#D6B14D] text-gray-900' : 'bg-gray-900 text-white'
          : variant === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      ENG
    </button>
  </div>
)

export const AboutIntroductionTemplate = () => {
  const heroAnimation = useScrollAnimation()
  const focusAnimation = useScrollAnimation()
  const pillarsAnimation = useScrollAnimation()
  const { ref: visionRef, brightness } = useScrollBrightness()
  
  // Separate language states for each section
  const [missionLang, setMissionLang] = useState<'ko' | 'en'>('ko')
  const [focusLang, setFocusLang] = useState<'ko' | 'en'>('ko')
  const [visionLang, setVisionLang] = useState<'ko' | 'en'>('ko')
  const [pillarsLang, setPillarsLang] = useState<'ko' | 'en'>('ko')
  const [carouselIndex, setCarouselIndex] = useState(0)

  return (
    <div className="flex flex-col bg-white">
      {/* ═══════════════════════════════════════════════════════════════
          HERO BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase mb-12">
            About FINDS
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center tracking-tight">
            Introduction
          </h1>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MISSION & VISION CAROUSEL
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-b from-[#FFFDF5] to-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-32 md:py-60">
          <section
            ref={heroAnimation.ref}
            className={`transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            {/* Carousel Container */}
            <div className="relative">
              {/* Carousel Content */}
              <div className="overflow-hidden rounded-2xl md:rounded-3xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {/* Slide 1: Mission (Light Theme) */}
                  <div className="w-full flex-shrink-0">
                    <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                      {/* Card Header */}
                      <div className="flex items-center justify-between px-20 md:px-32 py-14 md:py-18 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-8">
                          <Sparkles size={14} className="text-[#D6B14D]" />
                          <span className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em]">
                            {missionLang === 'ko' ? 'FINDS Lab의 사명' : 'FINDS Lab Mission'}
                          </span>
                        </div>
                        <LangToggle lang={missionLang} setLang={setMissionLang} />
                      </div>

                      {/* Card Content */}
                      <div className="p-24 md:p-40 lg:p-56 min-h-[400px] md:min-h-[450px] flex flex-col justify-center">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.4] mb-20 md:mb-32 text-center">
                          {missionLang === 'ko' ? (
                            <>
                              <span className="bg-gradient-to-r from-[#D6B14D] via-primary to-[#D6B14D] bg-clip-text text-transparent">데이터로 밝히는</span>
                              <br className="md:hidden" />{' '}
                              금융 혁신의 미래
                            </>
                          ) : (
                            <>
                              Towards{' '}
                              <span className="bg-gradient-to-r from-[#D6B14D] via-primary to-[#D6B14D] bg-clip-text text-transparent">Data-Illuminated</span>
                              <br className="md:hidden" />{' '}
                              Financial Innovation
                            </>
                          )}
                        </h2>

                        <div className="flex items-center justify-center gap-8 mb-20 md:mb-32">
                          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D6C360]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D6B14D]" />
                          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D6C360]" />
                        </div>

                        <div className="max-w-3xl mx-auto space-y-16 text-center">
                          {missionLang === 'ko' ? (
                            <>
                              <p className="text-sm md:text-base text-gray-600 leading-[2]">
                                <span className="text-primary font-bold">가천대학교 경영대학 금융·빅데이터학부 금융데이터인텔리전스 연구실 (FINDS Lab)</span>은 
                                데이터 중심으로 급변하는 비즈니스와 금융 환경 속에서 <span className="text-gray-900 font-semibold">실질적인 가치를 창출</span>하는 혁신적인 연구를 수행합니다.
                              </p>
                              <p className="text-sm md:text-base text-gray-500 leading-[2]">
                                저희는 <span className="text-primary font-semibold">금융데이터사이언스</span>와 <span className="text-primary font-semibold">비즈니스 애널리틱스</span>를 융합하여,
                                복잡한 데이터 속에서 새로운 <span className="font-semibold" style={{color: '#AC0E0E'}}>발견(finds)</span>을 이끌어내고 
                                데이터 기반의 정교한 의사결정을 돕는 인텔리전스를 구축하는 것을 목표로 합니다.
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm md:text-base text-gray-600 leading-[2]">
                                <span className="text-primary font-bold">FINDS Lab (Financial Data Intelligence & Solutions Laboratory)</span> at Gachon University 
                                conducts innovative research that creates <span className="text-gray-900 font-semibold">real value</span> in the rapidly evolving data-driven business and financial landscape.
                              </p>
                              <p className="text-sm md:text-base text-gray-500 leading-[2]">
                                We combine <span className="text-primary font-semibold">Financial Data Science</span> and <span className="text-primary font-semibold">Business Analytics</span> to 
                                extract new <span className="font-semibold" style={{color: '#AC0E0E'}}>finds</span> from complex data and build intelligence that supports sophisticated data-driven decision-making.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2: Vision (Dark Theme with symmetric lighting) */}
                  <div className="w-full flex-shrink-0">
                    <div 
                      className="overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%)',
                      }}
                    >
                      {/* Card Header */}
                      <div 
                        className="flex items-center justify-between px-20 md:px-32 py-14 md:py-18 border-b"
                        style={{ borderColor: 'rgba(214, 177, 77, 0.2)', background: 'rgba(17, 24, 39, 0.7)' }}
                      >
                        <div className="flex items-center gap-8">
                          <Sparkles size={14} style={{ color: '#D6B14D' }} />
                          <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-gray-400">
                            {visionLang === 'ko' ? 'FINDS Lab의 비전' : 'FINDS Lab Vision'}
                          </span>
                        </div>
                        <LangToggle lang={visionLang} setLang={setVisionLang} variant="dark" />
                      </div>

                      {/* Card Content with symmetric lighting */}
                      <div className="relative p-24 md:p-40 lg:p-56 min-h-[400px] md:min-h-[450px] flex flex-col justify-center overflow-hidden">
                        {/* Symmetric lighting effects */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(214, 177, 77, 0.2) 0%, transparent 70%)' }} />
                          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-80 bg-[#D6B14D] rounded-full blur-3xl opacity-15" />
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-80 bg-[#D6B14D] rounded-full blur-3xl opacity-15" />
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#D6B14D] rounded-full blur-3xl opacity-10" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#D6B14D] rounded-full blur-3xl opacity-10" />
                        </div>

                        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(214, 177, 77, 0.6), transparent)', boxShadow: '0 0 15px rgba(214, 177, 77, 0.4)' }} />

                        <div className="relative z-10">
                          <Quote size={32} className="mb-12" style={{ color: 'rgba(214, 177, 77, 0.4)' }} />
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.5] mb-20 md:mb-28 text-white" style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.2)' }}>
                            {visionLang === 'ko' ? (
                              <>더 나은 <span style={{ color: '#D6B14D', textShadow: '0 0 20px rgba(214, 177, 77, 0.5)' }}>데이터 인텔리전스</span>의 미래를 밝혀갑니다</>
                            ) : (
                              <>We illuminate the future of <span style={{ color: '#D6B14D', textShadow: '0 0 20px rgba(214, 177, 77, 0.5)' }}>Better Data Intelligence</span></>
                            )}
                          </h2>
                          <p className="text-sm md:text-base leading-[2] max-w-2xl text-gray-400">
                            {visionLang === 'ko' ? (
                              <>우리는 <span className="font-semibold text-white">데이터 인텔리전스</span>가 정보 비대칭을 줄이고, 복잡한 데이터 흐름을 <span style={{ color: '#D6B14D' }}>명확하고, 접근 가능하며, 전략적으로 가치 있는 인사이트</span>로 전환하는 미래를 꿈꿉니다.</>
                            ) : (
                              <>We envision a future where <span className="font-semibold text-white">data intelligence</span> diminishes knowledge asymmetry, turning complex data streams into <span style={{ color: '#D6B14D' }}>clear, accessible, and strategically valuable insights</span>.</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="flex items-center justify-center gap-8 mt-20 md:mt-24">
                <button onClick={() => setCarouselIndex(0)} className={`w-8 h-8 rounded-full transition-all duration-300 ${carouselIndex === 0 ? 'bg-[#D6B14D] scale-125' : 'bg-gray-300 hover:bg-gray-400'}`} aria-label="Mission slide" />
                <button onClick={() => setCarouselIndex(1)} className={`w-8 h-8 rounded-full transition-all duration-300 ${carouselIndex === 1 ? 'bg-[#D6B14D] scale-125' : 'bg-gray-300 hover:bg-gray-400'}`} aria-label="Vision slide" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FOCUS AREAS - Uniform Card Style
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-32 md:py-60">
          <section
            ref={focusAnimation.ref}
            className={`transition-all duration-1000 ${focusAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            {/* Uniform Card Container */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Card Header - Fixed height, matching other sections */}
              <div className="flex items-center justify-between px-20 md:px-32 py-14 md:py-18 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-8">
                  <Sparkles size={14} className="text-[#D6B14D]" />
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em]">
                    {focusLang === 'ko' ? '연구 분야' : 'Our Focus Areas'}
                  </span>
                </div>
                <LangToggle lang={focusLang} setLang={setFocusLang} />
              </div>

              {/* Card Content - Fixed min-height with 3 cards inside */}
              <div className="p-20 md:p-32 min-h-[400px] md:min-h-[450px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 h-full">
                  {focusAreas.map((area, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-gray-50/80 to-white rounded-xl p-16 md:p-24 border border-gray-100 hover:border-[#D6B14D]/30 hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                      {/* Icon */}
                      <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-16 shrink-0">
                        <div className="absolute inset-0 bg-[#FFF9E6] rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          <img src={area.image} alt={area.title} className="w-28 h-28 md:w-36 md:h-36 object-contain" />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="text-center flex-1 flex flex-col">
                        <h3 className="text-base md:text-lg font-bold mb-10 shrink-0" style={{ color: '#D6B14D' }}>
                          {focusLang === 'ko' ? area.titleKo : area.title}
                        </h3>
                        <p 
                          className="text-xs md:text-sm text-gray-500 leading-[1.8] [&>b]:text-gray-700 [&>b]:font-semibold"
                          dangerouslySetInnerHTML={{ __html: focusLang === 'ko' ? area.descKo : area.desc }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PILLARS SECTION - Uniform Card Style
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-32 md:py-60">
          <section
            ref={pillarsAnimation.ref}
            className={`transition-all duration-1000 ${pillarsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            {/* Uniform Card Container */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Card Header - Fixed height, matching other sections */}
              <div className="flex items-center justify-between px-20 md:px-32 py-14 md:py-18 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-8">
                  <Sparkles size={14} className="text-[#D6B14D]" />
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em]">
                    {pillarsLang === 'ko' ? 'FINDS Lab의 핵심 가치' : 'FINDS Lab Core Values'}
                  </span>
                </div>
                <LangToggle lang={pillarsLang} setLang={setPillarsLang} />
              </div>

              {/* Card Content - Fixed min-height with 3 cards inside */}
              <div className="p-20 md:p-32 min-h-[400px] md:min-h-[450px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
                  {pillars.map((pillar, index) => {
                    const Icon = pillar.icon
                    return (
                      <div key={index} className="flex flex-col">
                        {/* Label */}
                        <div className="text-center mb-12">
                          <h3 className="text-lg md:text-xl font-bold text-primary">
                            {pillarsLang === 'ko' ? pillar.labelKo : pillar.label}
                          </h3>
                          <div className="w-20 h-0.5 bg-primary/30 rounded-full mx-auto mt-6" />
                        </div>
                        
                        {/* Inner Card */}
                        <div className="group bg-gradient-to-br from-gray-50/80 to-white rounded-xl border border-gray-100 hover:border-[#D6B14D]/30 hover:shadow-md transition-all duration-300 flex-1 p-16 md:p-24">
                          {/* Number & Icon */}
                          <div className="flex items-center justify-between mb-12">
                            <div className="size-36 md:size-40 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-[#D6C360] transition-all duration-300">
                              <Icon size={18} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <span className="text-2xl md:text-3xl font-black text-gray-100 group-hover:text-[#FFF3CC] transition-colors">
                              {pillar.number}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-sm md:text-base font-bold text-gray-900 mb-6 leading-[1.5]">
                            {pillarsLang === 'ko' ? pillar.titleKo : pillar.title}
                          </h4>
                          
                          {/* Subtitle */}
                          {pillar.subtitle && (
                            <p className="text-[11px] md:text-xs font-medium italic mb-8 text-[#D6B14D]">
                              {pillarsLang === 'ko' ? pillar.subtitleKo : pillar.subtitle}
                            </p>
                          )}

                          {/* Description */}
                          <p 
                            className="text-xs md:text-sm text-gray-500 leading-[1.8] [&>b]:text-gray-700 [&>b]:font-semibold"
                            dangerouslySetInnerHTML={{ __html: pillarsLang === 'ko' ? pillar.descriptionKo : pillar.description }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-24 md:h-40" />
    </div>
  )
}

export default memo(AboutIntroductionTemplate)
