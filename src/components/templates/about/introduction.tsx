import { memo } from 'react'
import {Home, Search, Zap, Lightbulb, Quote} from 'lucide-react'
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
    desc: '금융 시장의 복잡한 데이터를 수집하고 분석하여 가치 있는 패턴을 발견합니다.'
  },
  {
    image: icon11,
    title: 'Business Analytics',
    titleKo: '비즈니스 애널리틱스',
    desc: '데이터 기반의 통계적 방법론을 통해 최적의 비즈니스 전략을 제안합니다.'
  },
  {
    image: icon10,
    title: 'Data-Inspired Decisions',
    titleKo: '데이터 기반 의사결정',
    desc: '객관적인 데이터 지능을 활용하여 더 명확하고 합리적인 의사결정을 돕습니다.'
  },
]

const pillars = [
  {
    icon: Search,
    label: 'Research',
    number: '01',
    title: 'We pursue research with\nan iridescent perspective.',
    description: 'By applying systematic and diverse methodologies in financial data science and business analytics, we expand knowledge while building transparent frameworks that ensure both practical relevance and data-driven decision-making.',
  },
  {
    icon: Zap,
    label: 'Impact',
    number: '02',
    title: 'We transform theory into\nintuitive solutions.',
    description: 'Our work helps practitioners navigate uncertainty and bridge the gap between sophisticated analytics and real-world practice, across both financial markets and broader business operations.',
  },
  {
    icon: Lightbulb,
    label: 'Philosophy',
    number: '03',
    title: 'We strive toward\n"des avenirs lucides".',
    description: 'Through data science, we illuminate complexity and foster clarity, discernment, and transparency, contributing to a more equitable, innovative, and socially impactful future in finance and diverse areas of business.',
  },
]

export const AboutIntroductionTemplate = () => {
  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-200 md:h-332 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-2xl md:text-[36px] font-semibold text-white text-center">
            Introduction
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
          <span className="text-sm md:text-base text-primary font-medium">Introduction</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-120">

        {/* Introduction Section */}
        <section className="mb-60 md:mb-120">
          <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-24 md:p-48 lg:p-60">
            <p className="text-xl md:text-2xl lg:text-[32px] font-bold text-gray-900 leading-snug mb-20 md:mb-32">
              Towards <span className="text-primary">Data-Illuminated</span><br />
              Financial Innovation
            </p>

            <div className="w-50 h-0.5 bg-gray-200 mb-20 md:mb-32" />

            <div className="space-y-14 md:space-y-20">
              <p className="text-sm md:text-base text-gray-600 leading-[1.9]">
                가천대학교 경영대학 금융·빅데이터학부 연구실(FINDS Lab.)은 데이터 중심으로 급변하는 비즈니스와 금융 환경 속에서 <span className="text-gray-900 font-semibold">실질적인 가치를 창출</span>하는 혁신적인 연구를 수행합니다.
              </p>
              <p className="text-sm md:text-base text-gray-600 leading-[1.9]">
                저희는 <span className="text-primary font-semibold">금융데이터사이언스</span>와 <span className="text-primary font-semibold">비즈니스 애널리틱스</span>를 융합하여, 복잡한 데이터 속에서 새로운 <span className="text-gray-900 font-bold">발견(finds)</span>을 이끌어내고 데이터 기반의 정교한 의사결정을 돕는 인텔리전스를 구축하는 것을 목표로 합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Focus Areas Section */}
        <section className="mb-60 md:mb-140">
          <div className="text-center mb-32 md:mb-60">
            <h2 className="text-xl md:text-[28px] font-bold text-gray-900 mb-8 md:mb-12">Our Focus Areas</h2>
            <p className="text-sm md:text-base text-gray-400">FINDS Lab.이 집중적으로 탐구하고 있는 주요 연구 분야입니다.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 md:gap-40">
            {focusAreas.map((area, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-24 md:p-40 flex flex-col items-center group hover:border-primary/30 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                <div className="w-100 h-100 md:w-160 md:h-160 bg-gray-50 rounded-full flex items-center justify-center mb-20 md:mb-30 group-hover:bg-primary/5 transition-colors duration-300">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="size-60 md:size-90 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <span className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors block mb-4 md:mb-8">{area.title}</span>
                  <span className="text-sm md:text-base text-gray-400 font-medium block mb-12 md:mb-16">{area.titleKo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision Section */}
        <section className="mb-40 md:mb-60">
          <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-32 md:p-80 flex flex-col items-center text-center relative overflow-hidden">
            <Quote size={40} className="text-primary/20 absolute top-20 left-20 md:top-40 md:left-60 rotate-180 hidden sm:block" />
            <Quote size={40} className="text-primary/20 absolute bottom-20 right-20 md:bottom-40 md:right-60 hidden sm:block" />

            <div className="relative z-10">
              <span className="px-12 md:px-16 py-4 md:py-6 bg-white border border-gray-100 text-primary text-[10px] md:text-xs font-bold rounded-full mb-20 md:mb-30 inline-block uppercase tracking-widest">
                Our Vision
              </span>
              <h2 className="text-xl md:text-[36px] font-bold text-gray-900 mb-24 md:mb-40 leading-[1.4]">
                We illuminate the future of<br />
                <span className="text-primary">Better Data Intelligence</span>
              </h2>
              <div className="w-32 md:w-40 h-2 bg-primary/30 rounded-full mx-auto mb-24 md:mb-40" />
              <p className="text-sm md:text-lg text-gray-600 max-w-850 mx-auto leading-[1.9] font-medium">
                We envision a future where <span className="text-gray-900 font-bold underline decoration-primary/30 decoration-4 underline-offset-4">data intelligence</span> diminishes knowledge asymmetry,
                turning complex data streams into clear, accessible, and strategically valuable insights
                — a future built upon meaningful <span className="text-primary font-bold">finds</span> that guide decision-makers across
                finance, business, and diverse societal domains.
              </p>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="mb-60 md:mb-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 md:gap-30">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-24 md:p-40 group hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-20 md:mb-30">
                    <div className="size-40 md:size-50 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-base md:text-lg font-black text-gray-100 group-hover:text-primary/10 transition-colors">
                      {pillar.number}
                    </span>
                  </div>
                  <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 md:mb-12 block">
                    {pillar.label}
                  </span>
                  <h3 className="text-base md:text-xl font-bold text-gray-900 mb-12 md:mb-20 whitespace-pre-line leading-[1.4]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 leading-[1.8]">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

export default memo(AboutIntroductionTemplate)
