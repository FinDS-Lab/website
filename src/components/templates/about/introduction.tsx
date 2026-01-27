import { memo, useEffect, useRef, useState } from 'react'
import { Search, Zap, Lightbulb, Quote, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import fdsImg from '@/assets/images/icons/10.png'
import baImg from '@/assets/images/icons/11.png'
import dimImg from '@/assets/images/icons/12.png'

// Focus Areas Data - 금융 데이터 사이언스, 비즈니스 애널리틱스, 데이터 기반 의사결정
const focusAreas = [
  {
    image: fdsImg,
    title: 'Financial Data Science',
    titleKo: '금융 데이터 사이언스',
    desc: 'We collect and analyze <b>financial market data</b> to uncover hidden <b>patterns</b> and generate actionable <b>insights</b>. Our work supports better <b>investment strategies</b> and more robust <b>risk management</b> practices.',
    descKo: '금융 시장의 <b>복잡한 데이터</b>를 수집·정제하고, <b>통계적 분석</b>을 통해 시장 흐름과 <b>숨겨진 패턴</b>을 발견합니다.<br/>이를 바탕으로 <b>투자 전략</b>과 <b>위험 관리</b>에 필요한 인사이트를 도출합니다.',
  },
  {
    image: baImg,
    title: 'Business Analytics',
    titleKo: '비즈니스 애널리틱스',
    desc: 'We tackle complex business challenges using <b>statistical methods</b> and <b>analytics techniques</b>. By transforming raw data into meaningful patterns, we deliver <b>actionable strategies</b> that drive competitive advantage.',
    descKo: '<b>통계적 방법론</b>과 <b>비즈니스 애널리틱스 기법</b>으로 경영 및 산업 환경의 복잡한 문제를 분석합니다.<br/><b>실행 가능한 전략</b>과 <b>솔루션</b>을 제안하여 기업의 <b>경쟁력 강화</b>에 기여합니다.',
  },
  {
    image: dimImg,
    title: 'Data-Informed Decisions',
    titleKo: '데이터 기반 의사결정',
    desc: 'We support <b>clearer</b> and <b>more rational decisions</b> through <b>objective</b> analysis combined with <b>iridescent view extraction</b> — multi-perspective interpretation and synthesis for informed decisions.',
    descKo: '<b>객관적</b>이면서도 <b>다양한 관점에서의 해석과 종합</b>을 바탕으로 <b>명확하고 합리적인 의사결정</b>을 지원합니다.<br/><b>데이터 기반 판단</b>으로 <b>경영 및 산업 환경의 불확실성</b>을 줄이고 <b>성공 가능성</b>을 높입니다.',
  },
]

// Core Values Data - 통찰, 솔루션, 철학
const coreValues = [
  {
    icon: Search,
    label: 'Insight',
    labelKo: '통찰',
    number: '01',
    title: 'Multiple perspectives, practical frameworks.',
    titleKo: '다양한 관점에서 연구하고, 실용적인 프레임워크를 만듭니다.',
    description: 'We draw on <b>data science</b> and <b>business analytics</b> to develop <b>frameworks</b> that support <b>real-world applications</b> and <b>sound decision-making</b>.',
    descriptionKo: '<b>데이터 사이언스</b>와 <b>비즈니스 애널리틱스</b>의 방법론으로 인사이트를 도출하고,<br/><b>실용적 적용</b>과 <b>합리적 의사결정</b>을 지원하는 프레임워크를 개발합니다.',
  },
  {
    icon: Zap,
    label: 'Solution',
    labelKo: '솔루션',
    number: '02',
    title: 'From theory to practice.',
    titleKo: '이론을 실용적인 솔루션으로 연결합니다.',
    description: 'Our work helps practitioners <b>navigate uncertainty</b> in <b>financial markets</b> and <b>business operations</b>.',
    descriptionKo: '저희 FINDS Lab의 연구가 실무자들이 <b>경영 환경 및 금융 시장을 비롯한 다양한 산업 환경</b>에서<br/><b>불확실성을 관리</b>하는 데 도움이 되기를 바랍니다.',
  },
  {
    icon: Lightbulb,
    label: 'Philosophy',
    labelKo: '철학',
    number: '03',
    title: 'des avenirs lucides — lucid futures',
    titleKo: '기술로 더 윤택한 경영 및 산업 환경을 향해 나아갑니다.',
    subtitle: '',
    subtitleKo: '',
    description: 'Through <b>data science</b>, we strive to bring <b>clarity</b> to complex problems and contribute to a more <b>fair</b>, <b>creative</b>, and <b>meaningful</b> future.',
    descriptionKo: '<b>데이터 사이언스</b>로 복잡한 현실 문제에 <b>명확한 해답</b>을 제시하고,<br/>더욱 <b>공정하고</b>, <b>창의적이며</b>, <b>의미 있는</b> 미래에 기여하고자 합니다.',
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
      className={`px-10 py-5 text-[10px] md:text-xs font-bold rounded-full transition-all duration-300 ${
        lang === 'ko' 
          ? variant === 'dark' ? 'bg-[#D6B14D] text-gray-900' : 'bg-gray-900 text-white'
          : variant === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      KOR
    </button>
    <button
      onClick={() => setLang('en')}
      className={`px-10 py-5 text-[10px] md:text-xs font-bold rounded-full transition-all duration-300 ${
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
  const valuesAnimation = useScrollAnimation()
  const { ref: visionRef, brightness } = useScrollBrightness()
  
  // Separate language states for each section
  const [missionLang, setMissionLang] = useState<'ko' | 'en'>('ko')
  const [focusLang, setFocusLang] = useState<'ko' | 'en'>('ko')
  const [visionLang, setVisionLang] = useState<'ko' | 'en'>('ko')
  const [valuesLang, setValuesLang] = useState<'ko' | 'en'>('ko')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carousel2Index, setCarousel2Index] = useState(0)
  
  // Mouse tracking for light effect
  const [mousePos1, setMousePos1] = useState({ x: 50, y: 50 })
  const [mousePos2, setMousePos2] = useState({ x: 50, y: 50 })
  const [mousePosLight1, setMousePosLight1] = useState({ x: 50, y: 50 })
  const [mousePosLight2, setMousePosLight2] = useState({ x: 50, y: 50 })
  
  const handleMouseMove1 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos1({ x, y })
  }
  
  const handleMouseMove2 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos2({ x, y })
  }
  
  const handleMouseMoveLight1 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosLight1({ x, y })
  }
  
  const handleMouseMoveLight2 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosLight2({ x, y })
  }

  return (
    <div className="flex flex-col bg-white">
      {/* ═══════════════════════════════════════════════════════════════
          HERO BANNER
      ═══════════════════════════════════════════════════════════════ */}
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
            Introduction
          </h1>
          
          {/* Divider - < . > style */}
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#D6C360]/50 to-[#D6C360]" />
            <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent via-[#D6C360]/50 to-[#D6C360]" />
          </div>
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
                  {/* Slide 1: Goal (Light Theme with mouse-following light) */}
                  <div className="w-full flex-shrink-0">
                    <div 
                      className="bg-white border border-gray-100 shadow-sm overflow-hidden relative"
                      onMouseMove={handleMouseMoveLight1}
                    >
                      {/* Mouse-following light effect for light background */}
                      <div 
                        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(600px circle at ${mousePosLight1.x}% ${mousePosLight1.y}%, rgba(214, 177, 77, 0.08), transparent 40%)`
                        }}
                      />
                      {/* Card Header */}
                      <div className="relative flex items-center justify-between px-20 md:px-32 py-14 md:py-18 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-8">
                          <Sparkles size={14} className="text-[#D6B14D]" />
                          <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">
                            {missionLang === 'ko' ? 'FINDS Lab의 목표' : 'FINDS Lab Goal'}
                          </span>
                        </div>
                        <LangToggle lang={missionLang} setLang={setMissionLang} />
                      </div>

                      {/* Card Content */}
                      <div className="relative p-24 md:p-40 lg:p-56 min-h-[450px] md:min-h-[500px] flex flex-col justify-center">
                        {/* Title with Quote Icon */}
                        <div className="text-center mb-32 md:mb-40">
                          <div className="flex items-center justify-center gap-16 mb-16">
                            <Quote size={32} className="text-[#D6B14D]/50 rotate-180 hidden md:block" />
                            <Quote size={24} className="text-[#D6B14D]/50 rotate-180 md:hidden" />
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                              {missionLang === 'ko' ? (
                                <><span className="text-[#D6B14D]">데이터로 밝히는</span><br className="md:hidden" /> 금융 혁신의 미래</>
                              ) : (
                                <>Towards <span className="text-[#D6B14D]">Data-Driven</span> Financial Innovation</>
                              )}
                            </h2>
                            <Quote size={32} className="text-[#D6B14D]/50 hidden md:block" />
                            <Quote size={24} className="text-[#D6B14D]/50 md:hidden" />
                          </div>
                          <div className="flex items-center justify-center gap-8">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D6C360]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D6B14D]" />
                            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D6C360]" />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="max-w-3xl mx-auto space-y-20 text-center">
                          {missionLang === 'ko' ? (
                            <>
                              <p className="text-sm md:text-base text-gray-600 leading-[2]">
                                가천대학교 경영대학 금융·빅데이터학부 <span className="font-bold" style={{color: '#AC0E0E'}}>금융데이터인텔리전스</span> 연구실 (<span className="font-bold" style={{color: '#AC0E0E'}}>FINDS</span> Lab)은 데이터 중심으로 급변하는 <span className="font-bold" style={{color: '#D6B14D'}}>경영 및 산업환경</span>을 위하여 <span className="font-bold">실질적인 가치 창출</span>을 추구하는 연구를 수행하고자 합니다.
                              </p>
                              <p className="text-sm md:text-base text-gray-500 leading-[2]">
                                저희 FINDS Lab은 <span className="font-bold" style={{color: '#D6B14D'}}>데이터 사이언스</span>와 <span className="font-bold" style={{color: '#D6B14D'}}>비즈니스 애널리틱스</span> 기법을 융합하여, 복잡한 데이터 속에서 새로운 <span className="font-bold" style={{color: '#AC0E0E'}}>발견(finds)</span>을 이끌어내고 데이터를 바탕으로 보다 <span className="font-bold">정교한 의사결정</span>을 돕는 것을 목표로 합니다.
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm md:text-base text-gray-600 leading-[2]">
                                <span className="font-semibold italic" style={{color: '#D6B14D'}}>Towards Data-Illuminated Financial Innovation</span> — <span className="font-bold" style={{color: '#AC0E0E'}}>FINDS</span> (<span className="font-bold" style={{color: '#AC0E0E'}}>FInancial Data Intelligence & Solutions</span>) at Gachon University conducts research that creates <span className="font-bold" style={{color: '#D6B14D'}}>tangible value</span> in the fast-changing, data-driven business and financial landscape.
                              </p>
                              <p className="text-sm md:text-base text-gray-500 leading-[2]">
                                Our lab combines <span className="font-bold" style={{color: '#D6B14D'}}>Data Science</span> and <span className="font-bold" style={{color: '#D6B14D'}}>Business Analytics</span> to uncover new <span className="font-bold" style={{color: '#AC0E0E'}}>finds</span> in complex data and support sharper, data-grounded decision-making.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2: Vision (Dark Theme with mouse-following light) */}
                  <div className="w-full flex-shrink-0">
                    <div 
                      className="overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%)',
                      }}
                      onMouseMove={handleMouseMove1}
                    >
                      {/* Card Header */}
                      <div 
                        className="flex items-center justify-between px-20 md:px-32 py-14 md:py-18 border-b"
                        style={{ borderColor: 'rgba(214, 177, 77, 0.2)', background: 'rgba(17, 24, 39, 0.7)' }}
                      >
                        <div className="flex items-center gap-8">
                          <Sparkles size={14} style={{ color: '#D6B14D' }} />
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                            {visionLang === 'ko' ? 'FINDS Lab의 비전' : 'FINDS Lab Vision'}
                          </span>
                        </div>
                        <LangToggle lang={visionLang} setLang={setVisionLang} variant="dark" />
                      </div>

                      {/* Card Content with mouse-following light */}
                      <div className="relative p-24 md:p-40 lg:p-56 min-h-[450px] md:min-h-[500px] flex flex-col justify-center overflow-hidden">
                        {/* Mouse-following light effect */}
                        <div 
                          className="absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none transition-all duration-500 ease-out"
                          style={{ 
                            left: `${mousePos1.x}%`,
                            top: `${mousePos1.y}%`,
                            transform: 'translate(-50%, -50%)',
                            background: 'radial-gradient(circle, rgba(214, 177, 77, 0.18) 0%, rgba(214, 177, 77, 0.08) 30%, transparent 60%)'
                          }}
                        />
                        {/* Static ambient lighting */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-40 h-80 bg-[#D6B14D] rounded-full blur-3xl opacity-[0.08]" />
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-40 h-80 bg-[#D6B14D] rounded-full blur-3xl opacity-[0.08]" />
                        </div>

                        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(214, 177, 77, 0.6), transparent)', boxShadow: '0 0 20px rgba(214, 177, 77, 0.4)' }} />

                        <div className="relative z-10">
                          {/* Title with Quote Icon */}
                          <div className="text-center mb-32 md:mb-40">
                            <div className="flex items-center justify-center gap-16 mb-16">
                              <Quote size={32} className="text-[#D6B14D]/50 rotate-180 hidden md:block" />
                              <Quote size={24} className="text-[#D6B14D]/50 rotate-180 md:hidden" />
                              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white" style={{ textShadow: '0 0 40px rgba(255, 255, 255, 0.15)' }}>
                                {visionLang === 'ko' ? (
                                  <>더 나은 <span className="font-bold" style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}>경영 및 산업 환경</span>의 미래를 위하여</>
                                ) : (
                                  <>Toward a Better Future for <span className="font-bold" style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}>Business & Industry</span></>
                                )}
                              </h2>
                              <Quote size={32} className="text-[#D6B14D]/50 hidden md:block" />
                              <Quote size={24} className="text-[#D6B14D]/50 md:hidden" />
                            </div>
                            <div className="flex items-center justify-center gap-8">
                              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D6B14D]/60" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#D6B14D]" />
                              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/60" />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="max-w-3xl mx-auto text-center">
                            <p className="text-sm md:text-base leading-[2] text-gray-400">
                              {visionLang === 'ko' ? (
                                <>저희 FINDS Lab은 <span className="font-semibold text-gray-300">데이터를 바탕으로 한 다양한 연구</span>를 통해 <span className="font-semibold text-gray-300">지식과 정보의 비대칭</span>으로 인한 경영 및 산업 환경의 비효율을 줄이고, 복잡한 데이터를 <span className="font-bold" style={{ color: '#D6B14D' }}>명확하고 전략적으로 가치 있는 인사이트</span>로 전환하고자 합니다.</>
                              ) : (
                                <>Through <span className="font-semibold text-gray-300">data-driven research</span>, our lab aims to reduce inefficiencies in business and industry caused by <span className="font-semibold text-gray-300">information asymmetry</span>, and turn complex data into <span className="font-bold" style={{ color: '#D6B14D' }}>clear, strategically valuable insights</span>.</>
                              )}
                            </p>
                            <p className="text-sm md:text-base leading-[2] text-gray-400 mt-0">
                              {visionLang === 'ko' 
                                ? <>더 나은 <span className="font-semibold text-gray-300">데이터 기반의 경영 및 산업 환경</span>의 미래를 밝혀나가는 데 기여하고자 합니다.</>
                                : <>We strive to illuminate a better future for <span className="font-semibold text-gray-300">data-driven business and industry</span>.</>}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Navigation - Modern Arrow Style */}
              {/* Carousel Navigation - Modern Arrow Style */}
              <div className="flex items-center justify-center gap-16 mt-24 md:mt-28">
                <button 
                  onClick={() => setCarouselIndex(0)} 
                  className={`group flex items-center justify-center gap-8 px-16 py-10 rounded-full border transition-all duration-300 ${
                    carouselIndex === 0 
                      ? 'bg-[#D6B14D] border-[#D6B14D] text-white' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#D6B14D] hover:text-[#D6B14D]'
                  }`}
                  aria-label="Goal slide"
                >
                  <ChevronLeft size={16} className={carouselIndex === 0 ? 'text-white' : 'text-gray-400 group-hover:text-[#D6B14D]'} />
                  <span className="text-xs font-semibold tracking-wide leading-none">Goal</span>
                </button>
                <div className="w-px h-16 bg-gray-200" />
                <button 
                  onClick={() => setCarouselIndex(1)} 
                  className={`group flex items-center justify-center gap-8 px-16 py-10 rounded-full border transition-all duration-300 ${
                    carouselIndex === 1 
                      ? 'bg-[#D6B14D] border-[#D6B14D] text-white' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#D6B14D] hover:text-[#D6B14D]'
                  }`}
                  aria-label="Vision slide"
                >
                  <span className="text-xs font-semibold tracking-wide leading-none">Vision</span>
                  <ChevronRight size={16} className={carouselIndex === 1 ? 'text-white' : 'text-gray-400 group-hover:text-[#D6B14D]'} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FOCUS AREAS & PILLARS CAROUSEL
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-32 md:py-60">
          <section
            ref={focusAnimation.ref}
            className={`transition-all duration-1000 ${focusAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            {/* Carousel Container */}
            <div className="relative">
              {/* Carousel Content */}
              <div className="overflow-hidden rounded-2xl md:rounded-3xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${carousel2Index * 100}%)` }}
                >
                  {/* Slide 1: Focus Areas (Light Theme with mouse-following light) */}
                  <div className="w-full flex-shrink-0">
                    <div 
                      className="bg-white border border-gray-100 shadow-sm overflow-hidden relative"
                      onMouseMove={handleMouseMoveLight2}
                    >
                      {/* Mouse-following light effect for light background */}
                      <div 
                        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(600px circle at ${mousePosLight2.x}% ${mousePosLight2.y}%, rgba(214, 177, 77, 0.08), transparent 40%)`
                        }}
                      />
                      {/* Card Header */}
                      <div className="relative flex items-center justify-between px-20 md:px-32 py-14 md:py-18 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-8">
                          <Sparkles size={14} className="text-[#D6B14D]" />
                          <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">
                            <span className="md:hidden">FINDS Lab Focus Areas</span>
                            <span className="hidden md:inline">{focusLang === 'ko' ? 'FINDS Lab의 연구 분야' : 'FINDS Lab Focus Areas'}</span>
                          </span>
                        </div>
                        <div className="hidden md:block">
                          <LangToggle lang={focusLang} setLang={setFocusLang} />
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="relative p-24 md:p-40 lg:p-48 min-h-[550px] md:min-h-[600px] flex flex-col justify-center">
                        {/* Title */}
                        <div className="text-center mb-28 md:mb-36">
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-16">
                            <span className="md:hidden text-[#D6B14D]">Core Research Areas</span>
                            <span className="hidden md:inline">
                              {focusLang === 'ko' ? (
                                <><span className="text-[#D6B14D]">핵심 연구 분야</span></>
                              ) : (
                                <><span className="text-[#D6B14D]">Core Research Areas</span></>
                              )}
                            </span>
                          </h2>
                          <div className="flex items-center justify-center gap-8">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D6C360]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D6B14D]" />
                            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D6C360]" />
                          </div>
                        </div>

                        {/* 3 Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
                          {focusAreas.map((area, index) => (
                            <div
                              key={index}
                              className="group bg-gradient-to-br from-gray-50/80 to-white rounded-xl p-16 md:p-24 border border-gray-100 hover:border-[#D6B14D]/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                              {/* Icon */}
                              <div className="relative w-120 h-120 md:w-160 md:h-160 mx-auto mb-16 shrink-0">
                                <div className="absolute inset-0 bg-[#FFF9E6] rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                                  <img loading="lazy" src={area.image} alt={area.title} className="w-100 h-100 md:w-140 md:h-140 object-contain" />
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
                  </div>

                  {/* Slide 2: Pillars (Dark Theme with mouse-following light) */}
                  <div className="w-full flex-shrink-0">
                    <div 
                      className="overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%)',
                      }}
                      onMouseMove={handleMouseMove2}
                    >
                      {/* Card Header */}
                      <div 
                        className="flex items-center justify-between px-20 md:px-32 py-14 md:py-18 border-b"
                        style={{ borderColor: 'rgba(214, 177, 77, 0.2)', background: 'rgba(17, 24, 39, 0.7)' }}
                      >
                        <div className="flex items-center gap-8">
                          <Sparkles size={14} style={{ color: '#D6B14D' }} />
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                            {valuesLang === 'ko' ? 'FINDS Lab의 핵심 가치' : 'FINDS Lab Core Values'}
                          </span>
                        </div>
                        <LangToggle lang={valuesLang} setLang={setValuesLang} variant="dark" />
                      </div>

                      {/* Card Content with mouse-following light */}
                      <div className="relative p-24 md:p-40 lg:p-48 min-h-[550px] md:min-h-[600px] flex flex-col justify-center overflow-hidden">
                        {/* Mouse-following light effect */}
                        <div 
                          className="absolute w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none transition-all duration-500 ease-out"
                          style={{ 
                            left: `${mousePos2.x}%`,
                            top: `${mousePos2.y}%`,
                            transform: 'translate(-50%, -50%)',
                            background: 'radial-gradient(circle, rgba(214, 177, 77, 0.15) 0%, rgba(214, 177, 77, 0.06) 30%, transparent 60%)'
                          }}
                        />
                        {/* Static ambient lighting */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-40 h-80 bg-[#D6B14D] rounded-full blur-3xl opacity-[0.06]" />
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-40 h-80 bg-[#D6B14D] rounded-full blur-3xl opacity-[0.06]" />
                        </div>

                        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(214, 177, 77, 0.6), transparent)', boxShadow: '0 0 20px rgba(214, 177, 77, 0.4)' }} />

                        <div className="relative z-10">
                          {/* Title */}
                          <div className="text-center mb-28 md:mb-36">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-16" style={{ textShadow: '0 0 40px rgba(255, 255, 255, 0.15)' }}>
                              {valuesLang === 'ko' ? (
                                <><span style={{ color: '#D6B14D', textShadow: '0 0 30px rgba(214, 177, 77, 0.5)' }}>핵심 가치</span></>
                              ) : (
                                <><span style={{ color: '#D6B14D', textShadow: '0 0 30px rgba(214, 177, 77, 0.5)' }}>Core Values</span></>
                              )}
                            </h2>
                            <div className="flex items-center justify-center gap-8">
                              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D6B14D]/60" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#D6B14D]" />
                              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/60" />
                            </div>
                          </div>

                          {/* 3 Cards Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
                            {coreValues.map((value, index) => {
                              const Icon = value.icon
                              return (
                                <div 
                                  key={index} 
                                  className="group rounded-xl p-16 md:p-24 border transition-all duration-300 flex flex-col"
                                  style={{ 
                                    background: 'rgba(255, 255, 255, 0.03)', 
                                    borderColor: 'rgba(214, 177, 77, 0.15)',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(214, 177, 77, 0.08)'
                                    e.currentTarget.style.borderColor = 'rgba(214, 177, 77, 0.3)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                                    e.currentTarget.style.borderColor = 'rgba(214, 177, 77, 0.15)'
                                  }}
                                >
                                  {/* Icon & Number */}
                                  <div className="flex items-center justify-between mb-12">
                                    <div className="size-44 md:size-48 rounded-xl flex items-center justify-center" style={{ background: 'rgba(214, 177, 77, 0.15)' }}>
                                      <Icon size={22} style={{ color: '#D6B14D' }} />
                                    </div>
                                    <span className="text-2xl md:text-3xl font-black" style={{ color: 'rgba(214, 177, 77, 0.2)' }}>
                                      {value.number}
                                    </span>
                                  </div>

                                  {/* Label */}
                                  <h3 className="text-base md:text-lg font-bold mb-6" style={{ color: '#D6B14D' }}>
                                    {valuesLang === 'ko' ? value.labelKo : value.label}
                                  </h3>

                                  {/* Title */}
                                  <h4 
                                    className="text-sm font-semibold text-white mb-6 leading-[1.5] [&>b]:font-semibold"
                                    dangerouslySetInnerHTML={{ __html: valuesLang === 'ko' ? value.titleKo : value.title }}
                                  />
                                  
                                  {/* Subtitle */}
                                  {value.subtitle && (
                                    <p className="text-xs font-medium italic mb-8" style={{ color: 'rgba(214, 177, 77, 0.7)' }}>
                                      {valuesLang === 'ko' ? value.subtitleKo : value.subtitle}
                                    </p>
                                  )}

                                  {/* Description */}
                                  <p 
                                    className="text-xs md:text-sm text-gray-400 leading-[1.8] [&>b]:text-gray-300 [&>b]:font-semibold"
                                    dangerouslySetInnerHTML={{ __html: valuesLang === 'ko' ? value.descriptionKo : value.description }}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Navigation - Modern Arrow Style */}
              <div className="flex items-center justify-center gap-16 mt-24 md:mt-28">
                <button 
                  onClick={() => setCarousel2Index(0)} 
                  className={`group flex items-center gap-8 px-16 py-10 rounded-full border transition-all duration-300 ${
                    carousel2Index === 0 
                      ? 'bg-[#D6B14D] border-[#D6B14D] text-white' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#D6B14D] hover:text-[#D6B14D]'
                  }`}
                  aria-label="Focus Areas slide"
                >
                  <ChevronLeft size={16} className={carousel2Index === 0 ? 'text-white' : 'text-gray-400 group-hover:text-[#D6B14D]'} />
                  <span className="text-xs font-semibold tracking-wide">Focus</span>
                </button>
                <div className="w-px h-16 bg-gray-200" />
                <button 
                  onClick={() => setCarousel2Index(1)} 
                  className={`group flex items-center gap-8 px-16 py-10 rounded-full border transition-all duration-300 ${
                    carousel2Index === 1 
                      ? 'bg-[#D6B14D] border-[#D6B14D] text-white' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#D6B14D] hover:text-[#D6B14D]'
                  }`}
                  aria-label="Values slide"
                >
                  <span className="text-xs font-semibold tracking-wide">Values</span>
                  <ChevronRight size={16} className={carousel2Index === 1 ? 'text-white' : 'text-gray-400 group-hover:text-[#D6B14D]'} />
                </button>
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
