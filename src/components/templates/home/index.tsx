import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Slider from '@/components/atoms/slider'
import { parseMarkdown } from '@/utils/parseMarkdown'

// Image Imports
import icon8 from '@/assets/images/icons/8.png'
import icon9 from '@/assets/images/icons/9.png'
import hero1 from '@/assets/images/hero/1.webp'
import hero2 from '@/assets/images/hero/2.webp'
import hero3 from '@/assets/images/hero/3.webp'
import hero4 from '@/assets/images/hero/4.webp'
import logoFinds from '@/assets/images/brand/logo-finds.png'

// 슬라이드 데이터
const heroSlides = [
  {
    id: 1,
    badge: 'FINDS Lab',
    title: 'Towards Data-Illuminated\nFinancial Innovation',
    image: hero1,
    buttons: [
      { label: 'Introduction', path: '/about/introduction' },
      { label: 'Honors & Awards', path: '/about/honors' },
    ],
  },
  {
    id: 2,
    badge: 'FINDS Lab',
    title: 'Accomplishments',
    image: hero2,
    buttons: [
      { label: 'Publications', path: '/publications' },
      { label: 'Projects', path: '/projects' },
    ],
  },
  {
    id: 3,
    badge: 'FINDS Lab',
    title: 'Updates',
    image: hero3,
    buttons: [
      { label: 'News', path: '/archives/news' },
      { label: 'Notice', path: '/archives/notice' },
    ],
  },
]

export const HomeTemplate = () => {
  const [newsItems, setNewsItems] = useState<{ title: string; date: string }[]>([])
  const [noticeItems, setNoticeItems] = useState<{ title: string; date: string }[]>([])

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // 최근 뉴스 2개 로드
        const newsFiles = ['2026-03-01-1.md', '2025-09-01-1.md']
        const newsResults = await Promise.all(
          newsFiles.map(async (file) => {
            try {
              const response = await fetch(`/website/data/news/${file}`)
              if (!response.ok) {
                console.error(`Failed to fetch news ${file}: ${response.status}`)
                return null
              }
              const text = await response.text()
              const { data } = parseMarkdown(text)
              return { title: data.title || 'No Title', date: data.date || '' }
            } catch (err) {
              console.error(`Error fetching news ${file}:`, err)
              return null
            }
          })
        )
        const validNews = newsResults.filter((item) => item !== null) as { title: string; date: string }[]
        setNewsItems(validNews)

        // 최근 공지 2개 로드
        const noticeFiles = ['2025-10-06-1.md', '2025-09-01-1.md']
        const noticeResults = await Promise.all(
          noticeFiles.map(async (file) => {
            try {
              const response = await fetch(`/website/data/notice/${file}`)
              if (!response.ok) {
                console.error(`Failed to fetch notice ${file}: ${response.status}`)
                return null
              }
              const text = await response.text()
              const { data } = parseMarkdown(text)
              return { title: data.title || 'No Title', date: data.date || '' }
            } catch (err) {
              console.error(`Error fetching notice ${file}:`, err)
              return null
            }
          })
        )
        const validNotice = noticeResults.filter((item) => item !== null) as { title: string; date: string }[]
        setNoticeItems(validNotice)
      } catch (err) {
        console.error('Failed to load home data:', err)
      }
    }

    fetchLatest()
  }, [])

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative px-16 md:px-20 py-24 md:py-40">
        <div className="max-w-1480 mx-auto">
          <Slider loop autoplay autoplayDelay={5000} arrows dots>
            {heroSlides.map((slide) => (
              <div key={slide.id} className="relative bg-gray-50 h-full rounded-2xl md:rounded-3xl px-20 md:px-60 lg:px-100 py-32 md:py-48 flex items-center justify-between overflow-hidden">
                <div className="flex flex-col flex-1 gap-16 md:gap-24 z-10">
                  <div className="inline-flex items-center px-12 md:px-16 py-8 md:py-12 border border-primary/30 rounded-full bg-white shadow-sm w-fit">
                    <span className="text-sm md:text-md font-bold text-primary">{slide.badge}</span>
                  </div>
                  <h1 className="text-xl md:text-2xl lg:text-[36px] font-bold text-gray-900 whitespace-pre-line">
                    {slide.title}
                  </h1>
                  <div className="flex flex-wrap gap-8 md:gap-10">
                    {slide.buttons.map((button, btnIndex) => (
                      <Link
                        key={btnIndex}
                        to={button.path}
                        className="px-16 md:px-20 py-12 md:py-16 bg-primary text-white! text-sm md:text-md font-medium rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        {button.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block flex-1 max-w-400 lg:max-w-650 absolute right-0 top-0 opacity-30 md:opacity-100">
                  <img src={slide.image} alt="Hero Illustration" className="w-full h-full object-contain rounded-r-3xl" />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative h-300 md:h-414 overflow-hidden">
        <img src={hero4} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-16">
          <img src={logoFinds} alt="FINDS Lab" className="w-80 md:w-112 h-auto mb-16 md:mb-24 brightness-0 invert" />
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-8">FINDS Lab</h2>
          <p className="text-base md:text-xl font-medium mb-12 md:mb-16">Financial Data Intelligence & Solutions Laboratory</p>
          <p className="text-sm md:text-xl font-medium max-w-500">
            가천대학교 경영대학 금융·빅데이터학부 빅데이터경영전공
            <br />
            금융데이터인텔리전스 연구실 홈페이지입니다.
          </p>
        </div>
      </section>

      {/* News & Notice Section */}
      <section className="bg-gray-50 py-40 md:py-80 px-16 md:px-20">
        <div className="max-w-1480 mx-auto">
          <div className="flex flex-col md:flex-row gap-32 md:gap-60">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-16 md:mb-24">
                <div className="flex items-center gap-8">
                  <img src={icon8} alt="" className="size-22 md:size-26" />
                  <h3 className="text-xl md:text-[26px] font-semibold text-gray-900">News</h3>
                </div>
                <Link
                  to="/archives/news"
                  className="flex items-center gap-4 md:gap-8 px-12 md:px-16 py-8 md:py-12 bg-white border border-gray-100 rounded-full text-sm md:text-base font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="hidden sm:inline">자세히 보기</span>
                  <span className="sm:hidden">더보기</span>
                  <ChevronRight size={16} className="text-primary" />
                </Link>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden">
                {newsItems.length > 0 ? (
                  newsItems.map((item, index) => (
                    <Link
                      key={index}
                      to="/archives/news"
                      className="flex items-center justify-between px-12 md:px-16 py-12 md:py-16 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm md:text-base font-medium text-gray-900 truncate flex-1 mr-12">· {item.title}</span>
                      <span className="text-xs md:text-base text-gray-500 shrink-0">{item.date}</span>
                    </Link>
                  ))
                ) : (
                  <div className="px-16 py-32 md:py-40 text-center text-sm md:text-base text-gray-500">
                    등록된 뉴스가 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-16 md:mb-24">
                <div className="flex items-center gap-8">
                  <img src={icon9} alt="" className="size-22 md:size-26" />
                  <h3 className="text-xl md:text-[26px] font-semibold text-gray-900">Notice</h3>
                </div>
                <Link
                  to="/archives/notice"
                  className="flex items-center gap-4 md:gap-8 px-12 md:px-16 py-8 md:py-12 bg-white border border-gray-100 rounded-full text-sm md:text-base font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="hidden sm:inline">자세히 보기</span>
                  <span className="sm:hidden">더보기</span>
                  <ChevronRight size={16} className="text-primary" />
                </Link>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden">
                {noticeItems.length > 0 ? (
                  noticeItems.map((item, index) => (
                    <Link
                      key={index}
                      to="/archives/notice"
                      className="flex items-center justify-between px-12 md:px-16 py-12 md:py-16 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm md:text-base font-medium text-gray-900 truncate flex-1 mr-12">· {item.title}</span>
                      <span className="text-xs md:text-base text-gray-500 shrink-0">{item.date}</span>
                    </Link>
                  ))
                ) : (
                  <div className="px-16 py-32 md:py-40 text-center text-sm md:text-base text-gray-500">
                    등록된 공지사항이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default memo(HomeTemplate)
