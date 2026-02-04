import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Quote, Home } from 'lucide-react'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import fdsImg from '@/assets/images/icons/fds.webp'
import baImg from '@/assets/images/icons/ba.webp'
import dimImg from '@/assets/images/icons/dim.webp'

// 연구 분야 데이터
const researchAreas = [
  {
    id: 'fds',
    badge: { ko: '핀테크 혁신의 핵심 동력', en: 'Core Driver of Fintech Innovation' },
    titleEn: 'Financial Data Science',
    titleKo: '금융 데이터 사이언스',
    image: fdsImg,
    items: [
      {
        en: 'Portfolio Optimization and Algorithmic Trading Strategies',
        ko: '포트폴리오 최적화, 자산 배분, 알고리즘 트레이딩',
      },
      {
        en: 'Financial Time-Series Modeling and Forecasting',
        ko: '변동성 예측, 국면 전환 모형, 수익률 예측 등 금융 시계열 연구',
      },
      {
        en: 'Personalized Finance and Behavioral Decision Modeling',
        ko: '개인화 금융, 투자자 행동 분석, 행동재무학 기반 의사결정',
      },
    ],
  },
  {
    id: 'ba',
    badge: { ko: '디지털 전환 시대의 경쟁력', en: 'Competitive Edge in the Digital Era' },
    titleEn: 'Business Analytics',
    titleKo: '비즈니스 애널리틱스',
    image: baImg,
    items: [
      {
        en: 'Cross-Industry Data Analytics and Integration',
        ko: '다양한 산업 간 융합을 위한 데이터 분석',
      },
      {
        en: 'Data Visualization and Interpretive Transparency',
        ko: '복잡한 데이터를 직관적으로 표현하는 시각화 기법',
      },
      {
        en: 'Statistical Methods for Actionable Business Insights',
        ko: '통계적 방법론을 활용한 비즈니스 인사이트 도출',
      },
    ],
  },
  {
    id: 'dim',
    badge: { ko: '전략을 완성하는 설득력', en: 'Persuasive Power to Complete Strategy' },
    titleEn: 'Data-Informed Decision Making',
    titleKo: '데이터 기반 의사결정',
    image: dimImg,
    items: [
      {
        en: 'Design and Optimization of Trustworthy Decision Systems',
        ko: '신뢰할 수 있는 의사결정 시스템 설계와 최적화',
      },
      {
        en: 'Risk-Aware Decision Support Frameworks',
        ko: '경영 환경과 산업 현장의 위험을 고려한 의사결정 지원 도구',
      },
      {
        en: 'Multi-Perspective Insight Extraction for Decision Making',
        ko: '데이터 기반 의사결정을 위한 다각적 인사이트 도출과 종합',
      },
    ],
  },
]

// Language Toggle Component
const LangToggle = ({ lang, setLang, variant = 'dark' }: { lang: 'ko' | 'en'; setLang: (lang: 'ko' | 'en') => void; variant?: 'light' | 'dark' }) => {
  const isDark = variant === 'dark'
  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
      <button
        onClick={() => setLang('ko')}
        className={`px-10 py-4 rounded-full text-xs font-bold transition-all ${
          lang === 'ko'
            ? isDark ? 'bg-[#D6B14D] text-white' : 'bg-[#D6B14D] text-white'
            : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        KOR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-10 py-4 rounded-full text-xs font-bold transition-all ${
          lang === 'en'
            ? isDark ? 'bg-[#D6B14D] text-white' : 'bg-[#D6B14D] text-white'
            : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        ENG
      </button>
    </div>
  )
}

export const AboutIntroductionTemplate = () => {
  const [goalLang, setGoalLang] = useState<'ko' | 'en'>('ko')
  const [researchLang, setResearchLang] = useState<'ko' | 'en'>('ko')
  
  // Mouse tracking for light effect
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [mousePos2, setMousePos2] = useState({ x: 50, y: 50 })
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }
  
  const handleMouseMove2 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos2({ x, y })
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
        <div className="absolute inset-0" style={{backgroundColor: 'rgba(214, 177, 77, 0.08)'}} />
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
          WELCOME MESSAGE
      ═══════════════════════════════════════════════════════════════ */}
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
            <span className="text-sm text-primary font-semibold">Introduction</span>
          </div>
        </div>
      </div>

      {/* Hero Section - Welcome message */}
      <div className="bg-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pt-32 md:pt-48 pb-20 md:pb-32">
          <div className="relative text-center max-w-4xl mx-auto">
            <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-3xl mx-auto">
              가천대학교 경영대학 금융·빅데이터학부 빅데이터경영전공<br className="md:hidden" /> <span className="font-bold" style={{color: 'rgb(214, 177, 77)'}}>금융데이터인텔리전스 연구실</span>(<span className="font-bold" style={{color: 'rgb(214, 177, 77)'}}>FINDS Lab</span>)에<br className="md:hidden" /> 오신 것을 환영합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          GOAL SECTION (Dark Theme)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-48 md:pb-80">
          <div 
            className="rounded-2xl md:rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 50%, rgba(17, 24, 39, 0.98) 100%)',
            }}
            onMouseMove={handleMouseMove}
          >
            {/* Card Header */}
            <div 
              className="flex items-center justify-between px-20 md:px-32 py-16 md:py-20 border-b"
              style={{ borderColor: 'rgba(214, 177, 77, 0.2)', background: 'rgba(17, 24, 39, 0.7)' }}
            >
              <div className="flex items-center gap-10">
                <span className="text-base md:text-lg" style={{color: '#D6B14D'}}>🎯</span>
                <span className="text-sm md:text-base font-bold text-gray-300 tracking-tight">
                  {goalLang === 'ko' ? <>FINDS Lab의 <span style={{color: '#D6B14D'}}>목표</span></> : <>FINDS Lab's <span style={{color: '#D6B14D'}}>Goal</span></>}
                </span>
              </div>
              <LangToggle lang={goalLang} setLang={setGoalLang} variant="dark" />
            </div>

            {/* Card Content with mouse-following light */}
            <div className="relative p-24 md:p-40 lg:p-56 min-h-[500px] md:min-h-[580px] flex flex-col justify-center overflow-hidden">
              {/* Mouse-following light effect */}
              <div 
                className="absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none transition-all duration-500 ease-out"
                style={{ 
                  left: `${mousePos.x}%`,
                  top: `${mousePos.y}%`,
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
                      {goalLang === 'ko' ? (
                        <><span className="font-bold" style={{ color: '#D6B14D', textShadow: '0 0 30px rgba(214, 177, 77, 0.4)' }}>데이터로 밝히는</span><br className="md:hidden" /> 더 나은 내일</>
                      ) : (
                        <>Towards <span className="font-bold" style={{ color: '#D6B14D', textShadow: '0 0 30px rgba(214, 177, 77, 0.4)' }}>Data-Illuminated</span><br className="md:hidden" /> Better Tomorrow</>
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
                <div className="max-w-3xl mx-auto space-y-24 text-center">
                  {goalLang === 'ko' ? (
                    <>
                      <p className="text-sm md:text-base leading-[2] text-gray-400">
                        저희 가천대학교 경영대학 금융·빅데이터학부 빅데이터경영전공 <span className="font-bold" style={{color: '#D6B14D'}}>금융데이터인텔리전스</span> 연구실 (<span className="font-bold" style={{color: '#D6B14D'}}>FINDS</span> Lab)은 데이터 중심으로 급변하는 <span className="font-semibold text-gray-300">경영 환경과 금융 시장을 비롯한 다양한 산업 현장</span>에서 <span className="font-semibold text-gray-300">실질적인 가치 창출</span>을 추구하는 연구를 수행하고자 합니다.
                      </p>
                      <p className="text-sm md:text-base leading-[2] text-gray-400">
                        저희 FINDS Lab은 <span className="font-bold" style={{ color: '#D6B14D', textShadow: '0 0 20px rgba(214, 177, 77, 0.3)' }}>데이터 사이언스</span>와 <span className="font-bold" style={{ color: '#D6B14D', textShadow: '0 0 20px rgba(214, 177, 77, 0.3)' }}>비즈니스 애널리틱스</span> 기법을 융합하여, 복잡한 데이터 속에서 새로운 <span className="font-bold" style={{color: '#D6B14D'}}>발견(finds)</span>을 이끌어내고 <span className="font-semibold text-gray-300">경영 환경과 산업 현장을 다양한 측면에서 개선하는 데 기여하는 것</span>을 목표로 합니다.
                      </p>
                      <p className="text-sm md:text-base leading-[2] text-gray-400">
                        이러한 목표 하에서 <span className="font-bold" style={{ color: 'rgb(214, 177, 77)', textShadow: '0 0 20px rgba(214, 177, 77, 0.3)' }}>지식과 정보의 비대칭</span>으로 인해 발생하는 사회적 비효율을 감소시키고, 데이터를 <span className="font-bold" style={{ color: 'rgb(214, 177, 77)', textShadow: '0 0 20px rgba(214, 177, 77, 0.3)' }}>명확하고 전략적으로 가치 있는 인사이트</span>로 전환하여 더 나은 내일을 위한 <span className="font-semibold text-gray-300">경영 환경과 산업 현장의 효율성 제고</span>에 기여하고자 합니다.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm md:text-base leading-[2] text-gray-400">
                        The <span className="font-bold" style={{color: '#D6B14D'}}>Financial Data Intelligence & Solutions</span> Laboratory (<span className="font-bold" style={{color: '#D6B14D'}}>FINDS</span> Lab) at Gachon University conducts research that creates <span className="font-semibold text-gray-300">tangible value</span> in the fast-changing, data-driven <span className="font-semibold text-gray-300">business and financial landscape</span>.
                      </p>
                      <p className="text-sm md:text-base leading-[2] text-gray-400">
                        Our lab combines <span className="font-bold" style={{ color: '#D6B14D', textShadow: '0 0 20px rgba(214, 177, 77, 0.3)' }}>Data Science</span> and <span className="font-bold" style={{ color: '#D6B14D', textShadow: '0 0 20px rgba(214, 177, 77, 0.3)' }}>Business Analytics</span> to uncover new <span className="font-bold" style={{color: '#D6B14D'}}>finds</span> in complex data and aims to <span className="font-semibold text-gray-300">contribute to improving business and industry environments from multiple perspectives</span>.
                      </p>
                      <p className="text-sm md:text-base leading-[2] text-gray-400">
                        Under this goal, we aim to reduce social inefficiencies caused by <span className="font-bold" style={{ color: '#D6B14D', textShadow: '0 0 20px rgba(214, 177, 77, 0.3)' }}>information asymmetry</span>, and turn data into <span className="font-bold" style={{ color: '#D6B14D', textShadow: '0 0 20px rgba(214, 177, 77, 0.3)' }}>clear, strategically valuable insights</span> to <span className="font-semibold text-gray-300">enhance business and industry efficiency</span> for a better tomorrow.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RESEARCH AREAS INTRO MESSAGE (Same style as Welcome)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pt-32 md:pt-48 pb-20 md:pb-32">
          <div className="relative text-center max-w-4xl mx-auto">
            <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-3xl mx-auto">
              <span className="font-bold" style={{color: 'rgb(214, 177, 77)'}}>FINDS Lab</span>은 상기한 목표를 바탕으로<br className="md:hidden" /> 데이터를 바탕으로 하는 <span className="font-bold" style={{color: 'rgb(214, 177, 77)'}}>세 가지 핵심 연구 분야</span>를 통해<br className="md:hidden" /> 경영 환경과 산업 현장에서<br className="md:hidden" /> <span className="font-bold" style={{color: 'rgb(214, 177, 77)'}}>실질적인 가치</span>를 창출하는 연구를 지향합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RESEARCH AREAS SECTION (Dark Theme Banner)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
          <div 
            className="rounded-2xl md:rounded-3xl overflow-hidden"
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
                <span className="text-base md:text-lg" style={{color: '#D6B14D'}}>🔬</span>
                <span className="text-sm md:text-base font-bold text-gray-300 tracking-tight">
                  {researchLang === 'ko' ? <>FINDS Lab의 <span style={{color: '#D6B14D'}}>연구 분야</span></> : <>FINDS Lab's <span style={{color: '#D6B14D'}}>Research Areas</span></>}
                </span>
              </div>
              <LangToggle lang={researchLang} setLang={setResearchLang} variant="dark" />
            </div>

            {/* Card Content with mouse-following light */}
            <div className="relative p-24 md:p-40 lg:p-56 overflow-hidden">
              {/* Mouse-following light effect */}
              <div 
                className="absolute w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none transition-all duration-500 ease-out"
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
                {/* Research Areas Grid */}
                <div className="flex flex-col gap-24 md:gap-32">
                  {researchAreas.map((area, index) => (
                    <div
                      key={area.id}
                      className={`
                        relative rounded-xl md:rounded-2xl p-20 md:p-32 
                        border transition-all duration-300
                        ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                      `}
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        borderColor: 'rgba(214, 177, 77, 0.15)',
                      }}
                    >
                      <div className={`grid gap-20 md:gap-32 md:grid-cols-2 items-center`}>
                        {/* Text Content */}
                        <div className={`flex flex-col ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                          {/* Badge */}
                          <div className="inline-flex items-center gap-8 px-12 md:px-14 py-6 md:py-8 rounded-full mb-12 md:mb-16 w-fit" style={{ background: 'rgba(214, 177, 77, 0.15)', border: '1px solid rgba(214, 177, 77, 0.3)' }}>
                            <span className="text-[10px] md:text-xs font-bold tracking-wide" style={{ color: '#D6B14D' }}>
                              {researchLang === 'ko' ? area.badge.ko : area.badge.en}
                            </span>
                          </div>
                          
                          {/* Title - 선택한 언어만 표시 */}
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-20" style={{ color: '#D6B14D' }}>
                            {researchLang === 'ko' ? area.titleKo : area.titleEn}
                          </h3>

                          {/* Items - 선택한 언어만 표시 */}
                          <ul className="flex flex-col gap-12 md:gap-16">
                            {area.items.map((item, idx) => (
                              <li key={idx} className="relative pl-20 md:pl-24">
                                <span className="absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(214, 177, 77, 0.2)' }}>
                                  <span className="w-2 h-2 rounded-full" style={{ background: '#D6B14D' }} />
                                </span>
                                <span className="block text-sm md:text-base font-semibold text-gray-300 leading-snug">
                                  {researchLang === 'ko' ? item.ko : item.en}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Image */}
                        <div
                          className={`
                            flex items-center justify-center 
                            rounded-xl md:rounded-2xl p-16 md:p-24
                            ${index % 2 === 1 ? 'md:order-1' : ''}
                          `}
                          style={{ background: 'rgba(255, 249, 230, 0.05)', border: '1px solid rgba(214, 177, 77, 0.1)' }}
                        >
                          <img
                            src={area.image}
                            alt={area.titleEn}
                            className="w-full h-auto max-w-[200px] md:max-w-[300px] object-contain"
                          />
                        </div>
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
  )
}

export default memo(AboutIntroductionTemplate)
