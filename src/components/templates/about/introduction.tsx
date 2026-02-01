import { memo, useEffect, useRef, useState } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import fdsImg from '@/assets/images/icons/fds_intro.webp'
import baImg from '@/assets/images/icons/ba_intro.webp'
import dimImg from '@/assets/images/icons/dim_intro.webp'
// Core Values Images (gold-colored illustrations)
import insightImg from '@/assets/images/icons/insight.webp'
import solutionImg from '@/assets/images/icons/solution.webp'
import philosophyImg from '@/assets/images/icons/philosophy.webp'

// Focus Areas Data - 금융 데이터 사이언스, 비즈니스 애널리틱스, 데이터 기반 의사결정
const focusAreas = [
  {
    image: fdsImg,
    title: 'Financial Data Science',
    titleKo: '금융 데이터 사이언스',
    items: [
      'Portfolio Optimization and Algorithmic Trading Strategies',
      'Financial Time-Series Modeling and Forecasting',
      'Personalized Finance and Behavioral Decision Modeling'
    ],
    itemsKo: [
      '포트폴리오 최적화, 자산 배분, 알고리즘 트레이딩',
      '변동성 예측, 국면 전환 모형, 수익률 예측 등 금융 시계열 연구',
      '개인화 금융, 투자자 행동 분석, 행동재무학 기반 의사결정'
    ]
  },
  {
    image: baImg,
    title: 'Business Analytics',
    titleKo: '비즈니스 애널리틱스',
    items: [
      'Cross-Industry Data Analytics and Integration',
      'Data Visualization and Interpretive Transparency',
      'Statistical Methods for Actionable Business Insights'
    ],
    itemsKo: [
      '다양한 산업 간 융합을 위한 데이터 분석',
      '복잡한 데이터를 직관적으로 표현하는 시각화 기법',
      '통계적 방법론을 활용한 비즈니스 인사이트 도출'
    ]
  },
  {
    image: dimImg,
    title: 'Data-Informed Decision Making',
    titleKo: '데이터 기반 의사결정',
    items: [
      'Design and Optimization of Trustworthy Decision Systems',
      'Risk-Aware Decision Support Frameworks',
      'Multi-Perspective Insight Synthesis for Informed Decisions'
    ],
    itemsKo: [
      '신뢰할 수 있는 의사결정 시스템 설계와 최적화',
      '경영 환경과 산업 현장의 위험을 고려한 의사결정 지원 도구',
      '데이터 기반 의사결정을 위한 다각적 인사이트 도출과 종합'
    ]
  },
]

// Core Values Data - 관점, 방향성, 철학
const coreValues = [
  {
    image: insightImg,
    label: 'Perspective',
    labelKo: '관점',
    title: 'See the essence through data.',
    titleKo: '데이터를 통해 문제의 본질을 바라봅니다.',
    items: [
      'Identifying Core Problems Through Data-Driven Analysis',
      'Integrating Finance and Diverse Business Domains with Data Analytics',
      'Interdisciplinary Approaches to Illuminate Complex Phenomena'
    ],
    itemsKo: [
      '데이터를 기반으로 한 문제의 본질 파악',
      '금융을 비롯한 다양한 사업 영역과 데이터 분석 기법의 융합',
      '복잡한 현상을 다양한 관점에서 조명하는 다학제적 접근'
    ],
  },
  {
    image: philosophyImg,
    label: 'Direction',
    labelKo: '방향성',
    title: 'Balance rigor with real-world impact.',
    titleKo: '학술적 엄밀함과 현장 적용의 균형을 추구합니다.',
    items: [
      'Bridging Academic Rigor and Practical Applicability',
      'Collaborative Human–Machine Decision Frameworks',
      'Continuously Evolving and Refining Research Outcomes'
    ],
    itemsKo: [
      '학술적 엄밀함과 실무 활용성의 균형',
      '사람과 AI가 협력하는 의사결정 체계 구축',
      '꾸준한 업데이트와 개선이 가능한 연구 성과 추구'
    ],
  },
  {
    image: solutionImg,
    label: 'Philosophy',
    labelKo: '철학',
    title: 'des avenirs lucides — lucid futures',
    titleKo: '데이터로 밝히는 더 나은 미래를 설계합니다.',
    items: [
      'Rational and Transparent Decision-Making Through Data',
      'Addressing Inefficiencies Arising from Information and Knowledge Asymmetry',
      'Generating Sustainable Intangible and Tangible Value'
    ],
    itemsKo: [
      '데이터를 통한 합리적이고 투명한 의사결정',
      '정보 및 지식의 비대칭으로 인한 비효율 해소',
      '지속 가능한 무형적·유형적 가치 창출'
    ],
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
          <section>
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
                      <div className="relative flex items-center justify-between px-20 md:px-32 py-16 md:py-20 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-10">
                          <span className="text-base md:text-lg" style={{color: '#D6B14D'}}>🎯</span>
                          <span className="text-sm md:text-base font-bold text-gray-800 tracking-tight">
                            {missionLang === 'ko' ? <>FINDS Lab의 <span style={{color: '#D6B14D'}}>목표</span></> : <>FINDS Lab's <span style={{color: '#D6B14D'}}>Goal</span></>}
                          </span>
                        </div>
                        <LangToggle lang={missionLang} setLang={setMissionLang} />
                      </div>

                      {/* Card Content */}
                      <div className="relative p-24 md:p-40 lg:p-56 min-h-[450px] md:min-h-[500px] flex flex-col justify-center overflow-hidden">
                        {/* Title with Quote Icon */}
                        <div className="text-center mb-32 md:mb-40 min-h-[80px] md:min-h-[100px] flex flex-col justify-center">
                          <div className="flex items-center justify-center gap-8 md:gap-16 mb-16">
                            <Quote size={32} className="text-[#D6B14D]/50 rotate-180 hidden md:block" />
                            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                              {missionLang === 'ko' ? (
                                <><span className="text-[#D6B14D]">데이터로 밝히는</span><br className="md:hidden" /> 경영 환경과 산업 현장의 개선</>
                              ) : (
                                <>Towards <span className="text-[#D6B14D]">Data-Illuminated<br className="md:hidden" /> Innovation</span> in Business and Industry</>
                              )}
                            </h2>
                            <Quote size={32} className="text-[#D6B14D]/50 hidden md:block" />
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
                                저희 가천대학교 경영대학 금융·빅데이터학부 빅데이터경영전공 <span className="font-bold" style={{color: '#AC0E0E'}}>금융데이터인텔리전스</span> 연구실 (<span className="font-bold" style={{color: '#AC0E0E'}}>FINDS</span> Lab)은 데이터 중심으로 급변하는 <span className="font-bold" style={{color: '#D6B14D'}}>경영 환경과 금융 시장을 비롯한 다양한 산업 현장</span>에서 <span className="font-bold">실질적인 가치 창출</span>을 추구하는 연구를 수행하고자 합니다.
                              </p>
                              <p className="text-sm md:text-base text-gray-500 leading-[2]">
                                저희 FINDS Lab은 <span className="font-bold" style={{color: '#D6B14D'}}>데이터 사이언스</span>와 <span className="font-bold" style={{color: '#D6B14D'}}>비즈니스 애널리틱스</span> 기법을 융합하여, 복잡한 데이터 속에서 새로운 <span className="font-bold" style={{color: '#AC0E0E'}}>발견(finds)</span>을 이끌어내고 <span className="font-bold">경영 환경과 산업 현장을 다양한 측면에서 개선하는 데 기여하는 것</span>을 목표로 합니다.
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm md:text-base text-gray-600 leading-[2]">
                                The <span className="font-bold" style={{color: '#AC0E0E'}}>Financial Data Intelligence & Solutions</span> Laboratory (<span className="font-bold" style={{color: '#AC0E0E'}}>FINDS</span> Lab) at Gachon University conducts research that creates <span className="font-bold" style={{color: '#D6B14D'}}>tangible value</span> in the fast-changing, data-driven business and financial landscape.
                              </p>
                              <p className="text-sm md:text-base text-gray-500 leading-[2]">
                                Our lab combines <span className="font-bold" style={{color: '#D6B14D'}}>Data Science</span> and <span className="font-bold" style={{color: '#D6B14D'}}>Business Analytics</span> to uncover new <span className="font-bold" style={{color: '#AC0E0E'}}>finds</span> in complex data and aims to <span className="font-bold">contribute to improving business and industry environments from multiple perspectives</span>.
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
                        className="flex items-center justify-between px-20 md:px-32 py-16 md:py-20 border-b"
                        style={{ borderColor: 'rgba(214, 177, 77, 0.2)', background: 'rgba(17, 24, 39, 0.7)' }}
                      >
                        <div className="flex items-center gap-10">
                          <span className="text-base md:text-lg" style={{color: '#D6B14D'}}>🔭</span>
                          <span className="text-sm md:text-base font-bold text-gray-300 tracking-tight">
                            {visionLang === 'ko' ? <>FINDS Lab의 <span style={{color: '#D6B14D'}}>비전</span></> : <>FINDS Lab's <span style={{color: '#D6B14D'}}>Vision</span></>}
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
                          <div className="text-center mb-32 md:mb-40 min-h-[80px] md:min-h-[100px] flex flex-col justify-center">
                            <div className="flex items-center justify-center gap-8 md:gap-16 mb-16">
                              <Quote size={32} className="text-[#D6B14D]/50 rotate-180 hidden md:block" />
                              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white" style={{ textShadow: '0 0 40px rgba(255, 255, 255, 0.15)' }}>
                                {visionLang === 'ko' ? (
                                  <>더 나은 내일을 위한<br className="md:hidden" /> 경영 환경과 산업 현장의 <span className="font-bold text-[#E8D688]" style={{ textShadow: '0 0 30px rgba(232, 214, 136, 0.4)' }}>효율성 제고</span></>
                                ) : (
                                  <>For a Better Tomorrow —<br className="md:hidden" /> Enhancing <span className="font-bold text-[#E8D688]" style={{ textShadow: '0 0 30px rgba(232, 214, 136, 0.4)' }}>Business and Industry</span> Efficiency</>
                                )}
                              </h2>
                              <Quote size={32} className="text-[#D6B14D]/50 hidden md:block" />
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
                                <>저희 FINDS Lab은 <span className="font-semibold text-gray-300">데이터를 바탕으로 한 다양한 연구</span>를 통해 <span className="font-semibold text-gray-300">지식과 정보의 비대칭</span>으로 인한 경영 환경과 산업 현장의 비효율을 줄이고, 복잡한 데이터를 <span className="font-bold" style={{ color: '#D6B14D' }}>명확하고 전략적으로 가치 있는 인사이트</span>로 전환하고자 합니다.</>
                              ) : (
                                <>Through <span className="font-semibold text-gray-300">data-driven research</span>, our lab aims to reduce inefficiencies in business and industry caused by <span className="font-semibold text-gray-300">information asymmetry</span>, and turn complex data into <span className="font-bold" style={{ color: '#D6B14D' }}>clear, strategically valuable insights</span>.</>
                              )}
                            </p>
                            <p className="text-sm md:text-base leading-[2] text-gray-400 mt-0">
                              {visionLang === 'ko' 
                                ? <>이러한 노력을 바탕으로 더 나은 내일을 위한 <span className="font-semibold text-gray-300">경영 환경과 산업 현장의 효율성 제고</span>에 기여하고자 합니다.</>
                                : <>Through these efforts, we aim to <span className="font-semibold text-gray-300">enhance business and industry efficiency</span> for a better tomorrow.</>}
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
          <section>
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
                      <div className="relative flex items-center justify-between px-20 md:px-32 py-16 md:py-20 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-10">
                          <span className="text-base md:text-lg" style={{color: '#D6B14D'}}>🔬</span>
                          <span className="text-sm md:text-base font-bold text-gray-800 tracking-tight">
                            {focusLang === 'ko' ? <>FINDS Lab의 <span style={{color: '#D6B14D'}}>연구 분야</span></> : <>FINDS Lab's <span style={{color: '#D6B14D'}}>Research Areas</span></>}
                          </span>
                        </div>
                        <LangToggle lang={focusLang} setLang={setFocusLang} />
                      </div>

                      {/* Card Content */}
                      <div className="relative p-24 md:p-40 lg:p-48 min-h-[480px] md:min-h-[520px] flex flex-col justify-center overflow-hidden">
                        {/* 3 Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
                          {focusAreas.map((area, index) => (
                            <div
                              key={index}
                              className="group bg-gradient-to-br from-gray-50/80 to-white rounded-xl p-16 md:p-24 border border-gray-100 hover:border-[#D6B14D]/30 hover:shadow-lg transition-all duration-300 flex flex-col h-[300px] md:h-[340px] overflow-hidden"
                            >
                              {/* Icon */}
                              <div className="relative w-100 h-100 md:w-140 md:h-140 mx-auto mb-16 shrink-0">
                                <div className="absolute inset-0 bg-[#FFF9E6] rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                                  <img loading="lazy" src={area.image} alt={area.title} className="w-80 h-80 md:w-120 md:h-120 object-contain" />
                                </div>
                              </div>

                              {/* Text */}
                              <div className="text-center flex-1 flex flex-col">
                                <h3 className="text-base md:text-lg font-bold mb-12 shrink-0" style={{ color: '#D6B14D' }}>
                                  {focusLang === 'ko' ? area.titleKo : area.title}
                                </h3>
                                <ul className="space-y-8 text-left">
                                  {(focusLang === 'ko' ? area.itemsKo : area.items).map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-8">
                                      <span className="size-5 rounded-full shrink-0 mt-[6px] bg-[#D6B14D]/40"/>
                                      <span className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                                        {item}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
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
                        className="flex items-center justify-between px-20 md:px-32 py-16 md:py-20 border-b"
                        style={{ borderColor: 'rgba(214, 177, 77, 0.2)', background: 'rgba(17, 24, 39, 0.7)' }}
                      >
                        <div className="flex items-center gap-10">
                          <span className="text-base md:text-lg" style={{color: '#D6B14D'}}>💎</span>
                          <span className="text-sm md:text-base font-bold text-gray-300 tracking-tight">
                            {valuesLang === 'ko' ? <>FINDS Lab의 <span style={{color: '#D6B14D'}}>핵심 가치</span></> : <>FINDS Lab's <span style={{color: '#D6B14D'}}>Core Values</span></>}
                          </span>
                        </div>
                        <LangToggle lang={valuesLang} setLang={setValuesLang} variant="dark" />
                      </div>

                      {/* Card Content with mouse-following light */}
                      <div className="relative p-24 md:p-40 lg:p-48 min-h-[480px] md:min-h-[520px] flex flex-col justify-center overflow-hidden">
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
                          {/* 3 Cards Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
                            {coreValues.map((value, index) => (
                              <div 
                                key={index} 
                                className="group rounded-xl p-16 md:p-24 border transition-all duration-300 flex flex-col h-[300px] md:h-[340px] overflow-hidden"
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
                                {/* Icon - Matching Research Areas Layout */}
                                <div className="relative w-100 h-100 md:w-140 md:h-140 mx-auto mb-16 shrink-0">
                                  <div className="absolute inset-0 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" style={{ background: 'rgba(214, 177, 77, 0.2)' }} />
                                  <div className="absolute inset-0 rounded-xl shadow-sm flex items-center justify-center overflow-hidden" style={{ background: '#FFF9E6' }}>
                                    <img loading="lazy" src={value.image} alt={value.label} className="w-80 h-80 md:w-120 md:h-120 object-contain" />
                                  </div>
                                </div>

                                {/* Text - Matching Research Areas Layout */}
                                <div className="text-center flex-1 flex flex-col">
                                  <h3 className="text-base md:text-lg font-bold mb-12 shrink-0" style={{ color: '#D6B14D' }}>
                                    {valuesLang === 'ko' ? value.labelKo : value.label}
                                  </h3>
                                  <ul className="space-y-8 text-left">
                                    {(valuesLang === 'ko' ? value.itemsKo : value.items).map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-8">
                                        <span className="size-5 rounded-full shrink-0 mt-[6px]" style={{ background: 'rgba(214, 177, 77, 0.5)' }}/>
                                        <span className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                                          {item}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
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
                  <span className="text-xs font-semibold tracking-wide">Domains</span>
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
