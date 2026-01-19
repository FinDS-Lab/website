import { memo, useEffect, useRef, useState } from 'react'
import { Home, Search, Zap, Lightbulb, Quote, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import icon10 from '@/assets/images/icons/10.png'
import icon11 from '@/assets/images/icons/11.png'
import icon12 from '@/assets/images/icons/12.png'

const focusAreas = [
  {
    image: icon12,
    title: 'Financial Data Science',
    titleKo: '금융 데이터 사이언스',
    desc: '금융 시장의 복잡한 데이터를 수집하고 분석하여 가치 있는 패턴과 인사이트를 발견합니다.',
    gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
  },
  {
    image: icon11,
    title: 'Business Analytics',
    titleKo: '비즈니스 애널리틱스',
    desc: '데이터 기반의 통계적 방법론을 통해 최적의 비즈니스 전략과 솔루션을 제안합니다.',
    gradient: 'from-primary/10 via-amber-500/5 to-transparent',
  },
  {
    image: icon10,
    title: 'Data-Informed Decisions',
    titleKo: '데이터 기반 의사결정',
    desc: '객관적인 데이터 인텔리전스를 활용하여 더 명확하고 합리적인 의사결정을 돕습니다.',
    gradient: 'from-yellow-600/10 via-primary/5 to-transparent',
  },
]

const pillars = [
  {
    icon: Search,
    label: 'Research',
    number: '01',
    title: 'We pursue research with an iridescent perspective.',
    description: 'By applying systematic and diverse methodologies in financial data science and business analytics, we expand knowledge while building transparent frameworks that ensure both practical relevance and data-driven decision-making.',
    accent: 'group-hover:from-amber-500 group-hover:to-yellow-600',
  },
  {
    icon: Zap,
    label: 'Impact',
    number: '02',
    title: 'We transform theory into intuitive solutions.',
    description: 'Our work helps practitioners navigate uncertainty and bridge the gap between sophisticated analytics and real-world practice, across both financial markets and broader business operations.',
    accent: 'group-hover:from-primary group-hover:to-amber-500',
  },
  {
    icon: Lightbulb,
    label: 'Philosophy',
    number: '03',
    title: 'We strive toward "des avenirs lucides".',
    subtitle: '— lucid futures',
    description: 'Through data science, we illuminate complexity and foster clarity, discernment, and transparency, contributing to a more equitable, innovative, and socially impactful future in finance and diverse areas of business.',
    accent: 'group-hover:from-yellow-500 group-hover:to-primary',
  },
]

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

export const AboutIntroductionTemplate = () => {
  const heroAnimation = useScrollAnimation()
  const focusAnimation = useScrollAnimation()
  const visionAnimation = useScrollAnimation()
  const pillarsAnimation = useScrollAnimation()

  return (
    <div className="flex flex-col bg-white">
      {/* ═══════════════════════════════════════════════════════════════
          HERO BANNER - Elegant Gold Gradient with Parallax Effect
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        
        {/* Luxurious Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Floating Accent */}
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-amber-400/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-amber-400/80" />
            <span className="text-amber-300/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              About FINDS
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight">
            Introduction
          </h1>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BREADCRUMB - Minimal & Refined
      ═══════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════
          WELCOME SECTION - Editorial Style with Strong Typography
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pt-32 md:pt-48 pb-40 md:pb-60">
        <section 
          ref={heroAnimation.ref}
          className={`transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          {/* Main Hero Content */}
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-100/30 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative text-center max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.3] mb-20 md:mb-32">
                <span className="inline-block">Towards</span>{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent">
                    Data-Illuminated
                  </span>
                  <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-amber-200/60 to-primary/20 -skew-x-6 rounded" />
                </span>
                <br className="hidden md:block" />
                <span className="inline-block mt-8 md:mt-0">Financial Innovation</span>
              </h2>

              {/* Divider */}
              <div className="flex items-center justify-center gap-16 mb-20 md:mb-32">
                <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-amber-300" />
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-amber-300" />
              </div>

              {/* Introduction Paragraphs */}
              <div className="space-y-16 md:space-y-20">
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-[1.9] font-medium">
                  <span className="text-primary font-bold">가천대학교 경영대학 금융·빅데이터학부</span>{' '}
                  <span className="relative inline-block mx-2">
                    <span className="text-amber-700 font-bold">FINDS Lab.</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-2 bg-amber-200/40 -z-10" />
                  </span>
                  은 데이터 중심으로 급변하는 비즈니스와 금융 환경 속에서{' '}
                  <span className="text-gray-900 font-bold">실질적인 가치를 창출</span>하는 혁신적인 연구를 수행합니다.
                </p>

                <p className="text-base md:text-lg text-gray-500 leading-[1.9]">
                  오늘날 비즈니스와 금융 경제 환경은 <span className="text-gray-700 font-semibold">데이터</span> 중심으로 빠르게 변화하고 있습니다.
                  이제는 데이터를 얼마나 <span className="text-gray-700 font-semibold">정교하게 분석</span>하고{' '}
                  <span className="text-gray-700 font-semibold">효과적으로 활용</span>하느냐가 경쟁력을 결정짓는 핵심 요소가 되고 있습니다.
                </p>

                <p className="text-base md:text-lg text-gray-500 leading-[1.9]">
                  저희는 <span className="text-primary font-semibold">금융데이터사이언스</span>와{' '}
                  <span className="text-primary font-semibold">비즈니스 애널리틱스</span>를 융합하여,
                  복잡한 데이터 속에서 새로운{' '}
                  <span className="relative inline-block">
                    <span className="text-amber-600 font-bold">발견(finds)</span>
                    <Sparkles size={12} className="absolute -top-2 -right-4 text-amber-400" />
                  </span>
                  을 이끌어내고 데이터 기반의 정교한 의사결정을 돕는 인텔리전스를 구축하는 것을 목표로 합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FOCUS AREAS - Premium Card Design with Hover Effects
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-60 md:py-120">
          <section
            ref={focusAnimation.ref}
            className={`transition-all duration-1000 delay-200 ${focusAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            {/* Section Header */}
            <div className="text-center mb-48 md:mb-80">
              <span className="inline-block px-16 py-6 bg-white border border-gray-200 text-primary text-[10px] md:text-xs font-bold rounded-full mb-16 md:mb-24 uppercase tracking-[0.2em] shadow-sm">
                Our Focus Areas
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 md:mb-16">
                Research <span className="text-primary">&</span> Expertise
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
                FINDS Lab.이 집중적으로 탐구하고 있는 주요 연구 분야입니다
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-24 lg:gap-32">
              {focusAreas.map((area, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 hover:border-amber-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-100/50 hover:-translate-y-4"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Card Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative p-28 md:p-40 lg:p-48">
                    {/* Icon */}
                    <div className="relative w-80 h-80 md:w-100 md:h-100 mx-auto mb-24 md:mb-32">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-primary/10 rounded-2xl md:rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-white rounded-2xl md:rounded-3xl shadow-lg flex items-center justify-center">
                        <img
                          src={area.image}
                          alt={area.title}
                          className="w-48 h-48 md:w-60 md:h-60 object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-center">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 md:mb-8 group-hover:text-primary transition-colors duration-300">
                        {area.title}
                      </h3>
                      <p className="text-sm md:text-base text-amber-700/80 font-semibold mb-16 md:mb-20">
                        {area.titleKo}
                      </p>
                      <p className="text-sm text-gray-500 leading-[1.8]">
                        {area.desc}
                      </p>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-24 right-24 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <ArrowRight size={20} className="text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VISION SECTION - Statement with Elegant Design
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-60 md:py-120">
        <section
          ref={visionAnimation.ref}
          className={`transition-all duration-1000 delay-300 ${visionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          <div className="relative bg-gradient-to-br from-amber-50 via-white to-primary/5 rounded-3xl md:rounded-[40px] p-40 md:p-80 lg:p-100 overflow-hidden border border-amber-100/50">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-amber-100/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl" />
            </div>

            {/* Floating Quotes */}
            <Quote size={60} className="absolute top-16 left-16 md:top-40 md:left-40 text-amber-200/30 rotate-180" />
            <Quote size={60} className="absolute bottom-16 right-16 md:bottom-40 md:right-40 text-amber-200/30" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-8 px-16 py-8 bg-white/80 backdrop-blur-sm border border-amber-200/50 rounded-full mb-32 md:mb-48 shadow-sm">
                <Sparkles size={14} className="text-amber-500" />
                <span className="text-amber-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                  Our Vision
                </span>
              </div>

              {/* Main Title */}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.3] mb-32 md:mb-48">
                We illuminate the future of
                <br />
                <span className="relative inline-block mt-8 md:mt-12">
                  <span className="bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent">
                    Better Data Intelligence
                  </span>
                  <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                </span>
              </h2>

              {/* Divider */}
              <div className="flex items-center justify-center gap-12 mb-32 md:mb-48">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-300" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-300" />
              </div>

              {/* Description */}
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-[2] font-medium">
                We envision a future where{' '}
                <span className="text-gray-900 font-bold border-b-2 border-amber-300 pb-1">data intelligence</span>{' '}
                diminishes knowledge asymmetry, turning complex data streams into{' '}
                <span className="text-primary font-semibold">clear, accessible, and strategically valuable insights</span>{' '}
                — a future built upon meaningful{' '}
                <span className="text-amber-600 font-bold">finds</span>{' '}
                that guide decision-makers across finance, business, and diverse societal domains.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PILLARS SECTION - Three Column Cards with Hover Effects
      ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-b from-white via-amber-50/20 to-white">
        <div className="max-w-1480 mx-auto w-full px-16 md:px-20 py-60 md:py-120">
          <section
            ref={pillarsAnimation.ref}
            className={`transition-all duration-1000 delay-400 ${pillarsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            {/* Section Header */}
            <div className="text-center mb-48 md:mb-80">
              <span className="inline-block px-16 py-6 bg-gradient-to-r from-amber-100 to-primary/10 text-amber-700 text-[10px] md:text-xs font-bold rounded-full mb-16 md:mb-24 uppercase tracking-[0.2em]">
                Our Pillars
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Research <span className="text-gray-300">·</span> Impact <span className="text-gray-300">·</span> Philosophy
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-24 lg:gap-32">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={index}
                    className={`group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-amber-100/30`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-100 ${pillar.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl md:rounded-3xl p-[2px]`}>
                      <div className="w-full h-full bg-white rounded-2xl md:rounded-[22px]" />
                    </div>

                    {/* Content */}
                    <div className="relative p-28 md:p-36 lg:p-48">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-24 md:mb-32">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-br from-amber-200 to-primary/20 rounded-xl md:rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                          <div className="relative size-48 md:size-56 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-amber-500 transition-all duration-500">
                            <Icon size={22} strokeWidth={1.5} className="text-gray-400 group-hover:text-white transition-colors duration-500" />
                          </div>
                        </div>
                        <span className="text-4xl md:text-5xl font-black text-gray-100 group-hover:text-amber-100 transition-colors duration-500 tabular-nums">
                          {pillar.number}
                        </span>
                      </div>

                      {/* Label */}
                      <span className="inline-block px-12 py-4 bg-amber-50 text-amber-700 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] rounded-full mb-12 md:mb-16 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {pillar.label}
                      </span>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-8 md:mb-12 leading-[1.4] group-hover:text-gray-900 transition-colors">
                        {pillar.title}
                      </h3>
                      
                      {/* Subtitle for Philosophy */}
                      {pillar.subtitle && (
                        <p className="text-sm text-amber-600 font-medium italic mb-12 md:mb-16">
                          {pillar.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-sm md:text-base text-gray-500 leading-[1.9] group-hover:text-gray-600 transition-colors">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM SPACER
      ═══════════════════════════════════════════════════════════════ */}
      <div className="h-40 md:h-60" />
    </div>
  )
}

export default memo(AboutIntroductionTemplate)
