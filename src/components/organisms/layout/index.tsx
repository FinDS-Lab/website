import React, { memo, ReactNode, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Mail, Copy, Check } from 'lucide-react'
import clsx from 'clsx'
import logoFinds from '@/assets/images/brand/logo-finds.png'
import { useStoreModal } from '@/store/modal'

type props = {
  children?: ReactNode
}

type NavItem = {
  name: string
  path: string
  children?: { name: string; path: string }[]
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  {
    name: 'About FINDS',
    path: '/about/introduction',
    children: [
      { name: 'Introduction', path: '/about/introduction' },
      { name: 'Research Areas', path: '/about/research' },
      { name: 'Honors & Awards', path: '/about/honors' },
      { name: 'Location', path: '/about/location' },
    ]
  },
  {
    name: 'Members',
    path: '/members/director',
    children: [
      { name: 'Director', path: '/members/director' },
      { name: 'Current Members', path: '/members/current' },
      { name: 'Alumni', path: '/members/alumni' },
    ]
  },
  { name: 'Publications', path: '/publications' },
  { name: 'Projects', path: '/projects' },
  {
    name: 'Archives',
    path: '/archives/news',
    children: [
      { name: 'News', path: '/archives/news' },
      { name: 'Notice', path: '/archives/notice' },
      { name: 'Gallery', path: '/archives/gallery' },
    ]
  },
]

const footerLinks = [
  { name: '한국연구재단', url: 'https://www.nrf.re.kr' },
  { name: 'Google Scholar', url: 'https://scholar.google.com/citations?user=p9JwRLwAAAAJ&hl=en' },
  { name: 'Web of Science', url: 'https://www.webofscience.com' },
  { name: 'Scopus', url: 'https://www.scopus.com' },
]

// Header logo text animation hook with random direction
const useLogoTextAnimation = () => {
  const [showAlt, setShowAlt] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right' | 'rotate'>('up')
  
  useEffect(() => {
    const directions: ('up' | 'down' | 'left' | 'right' | 'rotate')[] = ['up', 'down', 'left', 'right', 'rotate']
    const interval = setInterval(() => {
      setDirection(directions[Math.floor(Math.random() * directions.length)])
      setShowAlt(prev => !prev)
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  
  return { showAlt, direction }
}

// Contact Us Modal Content
const ContactModalContent = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const contacts = [
    { role: 'Director', email: 'ischoi@gachon.ac.kr', description: 'Research Inquiries & Collaborations' },
    { role: 'Webmaster', email: 'ischoi@gachon.ac.kr', description: 'Website Issues & Suggestions' },
    { role: 'Lab Administrator', email: 'ischoi@gachon.ac.kr', description: 'General Inquiries & Lab Operations' },
  ]

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  return (
    <div className="">
      <div className="flex flex-col items-center text-center mb-24">
        <div className="size-80 bg-primary/10 rounded-full flex items-center justify-center mb-20">
          <Mail size={36} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 max-md:text-xl">Contact Us</h2>
        <p className="text-base text-gray-500 max-md:text-sm">Feel free to reach out to us!</p>
      </div>

      <div className="flex flex-col gap-12">
        {contacts.map((contact, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-16 max-md:p-12">
            <div className="flex flex-col gap-4 mb-8">
              <span className="text-base font-bold text-primary">{contact.role}</span>
              <span className="text-xs text-gray-400">{contact.description}</span>
            </div>
            <div className="flex items-center justify-between gap-12">
              <a
                href={`mailto:${contact.email}`}
                className="text-base font-semibold text-gray-700 hover:text-primary hover:underline transition-colors"
              >
                {contact.email}
              </a>
              <button
                onClick={() => handleCopyEmail(contact.email)}
                className="flex items-center gap-4 px-10 py-6 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {copiedEmail === contact.email ? (
                  <>
                    <Check size={12} className="text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const LayoutOrganisms = ({ children }: props) => {
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null)
  const { showModal } = useStoreModal()
  const { showAlt: showAltText, direction: animDirection } = useLogoTextAnimation()
  const isHomePage = location.pathname === '/'

  const handleContactClick = () => {
    showModal({
      title: '',
      maxWidth: '450px',
      children: <ContactModalContent />
    })
  }

  const isActive = (item: NavItem) => {
    if (item.path === '/') {
      return location.pathname === '/'
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.path)
    }
    return location.pathname === item.path
  }

  const handleMouseEnter = (name: string) => {
    setOpenMenu(name)
  }

  const handleMouseLeave = () => {
    setOpenMenu(null)
  }

  const toggleMobileSubMenu = (name: string) => {
    setMobileSubMenu(mobileSubMenu === name ? null : name)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Header - sticky on home page only */}
      <header className={`w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-[9999] ${isHomePage ? 'sticky top-0' : ''}`}>
        <div className="max-w-1480 mx-auto flex items-center justify-between px-16 md:px-20 py-10">
          {/* Logo with animated text - PC only animation, mobile static */}
          <Link to="/" className="flex items-center gap-12 md:gap-16">
            <img src={logoFinds} alt="FINDS Lab" className="h-40 md:max-h-59" />
            
            {/* Mobile: Static FINDS Lab */}
            <span className="md:hidden text-lg font-bold">
              <span style={{ color: '#D6B14D' }}>FINDS </span>
              <span className="text-gray-900">Lab</span>
            </span>
            
            {/* PC: Animated text with random direction */}
            <div className="hidden md:flex relative h-[44px] items-center overflow-hidden min-w-[200px]">
              {/* FINDS Lab */}
              <span 
                className={`font-bold transition-all duration-700 ease-in-out text-xl ${
                  showAltText 
                    ? animDirection === 'up' ? 'opacity-0 -translate-y-full'
                    : animDirection === 'down' ? 'opacity-0 translate-y-full'
                    : animDirection === 'left' ? 'opacity-0 -translate-x-full'
                    : animDirection === 'right' ? 'opacity-0 translate-x-full'
                    : 'opacity-0 rotate-180 scale-50'
                    : 'opacity-100 translate-y-0 translate-x-0 rotate-0 scale-100'
                }`}
              >
                <span style={{ color: '#D6B14D' }}>FINDS </span>
                <span className="text-gray-900">Lab</span>
              </span>
              {/* Financial Data Intelligence & Solutions Laboratory */}
              <span 
                className={`absolute left-0 flex flex-col leading-tight transition-all duration-700 ease-in-out ${
                  showAltText 
                    ? 'opacity-100 translate-y-0 translate-x-0 rotate-0 scale-100'
                    : animDirection === 'up' ? 'opacity-0 translate-y-full'
                    : animDirection === 'down' ? 'opacity-0 -translate-y-full'
                    : animDirection === 'left' ? 'opacity-0 translate-x-full'
                    : animDirection === 'right' ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 -rotate-180 scale-50'
                }`}
              >
                <span className="text-[10px] font-semibold tracking-wide">
                  <span style={{ color: '#D6B14D' }}>Fin</span>
                  <span style={{ color: '#E8D688' }}>ancial </span>
                  <span style={{ color: '#D6B14D' }}>D</span>
                  <span style={{ color: '#E8D688' }}>ata Intelligence</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide">
                  <span style={{ color: '#E8D688' }}>&amp; </span>
                  <span style={{ color: '#D6B14D' }}>S</span>
                  <span style={{ color: '#E8D688' }}>olutions </span>
                  <span className="text-gray-900">Laboratory</span>
                </span>
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-8 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-40 xl:gap-60">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.path}
                    className={clsx(
                      'relative flex items-center gap-4 text-md transition-all duration-300 pt-8 pb-4',
                      isActive(item)
                        ? 'font-semibold text-primary'
                        : 'font-medium text-gray-900 hover:text-primary'
                    )}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown
                        size={16}
                        className={clsx(
                          'transition-transform duration-300',
                          openMenu === item.name && 'rotate-180'
                        )}
                      />
                    )}
                    {/* Underline animation */}
                    <span className={clsx(
                      'absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300',
                      isActive(item) ? 'w-full' : 'w-0 group-hover:w-full'
                    )} />
                  </Link>

                  {/* Dropdown Menu */}
                  {item.children && openMenu === item.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-12 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-white rounded-xl border border-gray-100 shadow-lg py-8 min-w-160">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={clsx(
                              'block px-20 py-12 text-base transition-all duration-200 hover:bg-gray-50 hover:pl-24 whitespace-nowrap',
                              location.pathname === child.path
                                ? 'text-primary font-medium bg-primary/5'
                                : 'text-gray-700'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Us Button - Desktop */}
          <button
            onClick={handleContactClick}
            className="hidden lg:flex items-center gap-8 px-20 py-12 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
          >
            <Mail size={16} />
            Contact Us
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <nav className="px-16 py-16">
              <ul className="flex flex-col gap-8">
                {navItems.map((item) => (
                  <li key={item.name}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleMobileSubMenu(item.name)}
                          className={clsx(
                            'w-full flex items-center justify-between py-12 text-base transition-colors',
                            isActive(item)
                              ? 'font-medium text-primary'
                              : 'font-normal text-gray-900'
                          )}
                        >
                          {item.name}
                          <ChevronDown
                            size={16}
                            className={clsx(
                              'transition-transform',
                              mobileSubMenu === item.name && 'rotate-180'
                            )}
                          />
                        </button>
                        {mobileSubMenu === item.name && (
                          <div className="pl-16 pb-8 flex flex-col gap-4">
                            {item.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={clsx(
                                  'py-8 text-sm transition-colors',
                                  location.pathname === child.path
                                    ? 'text-primary font-medium'
                                    : 'text-gray-600'
                                )}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={clsx(
                          'block py-12 text-base transition-colors',
                          isActive(item)
                            ? 'font-medium text-primary'
                            : 'font-normal text-gray-900'
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}

                {/* Contact Us Button - Mobile */}
                <li className="pt-16 mt-8 border-t border-gray-100">
                  <button
                    onClick={() => {
                      handleContactClick()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-8 px-20 py-12 bg-primary text-white text-sm font-bold rounded-xl"
                  >
                    <Mail size={16} />
                    Contact Us
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="overflow-x-hidden">{children}</main>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-b from-white to-gray-50/80 border-t border-gray-100">
        <div className="max-w-1480 mx-auto px-16 md:px-20 py-28 md:py-36">
          {/* Links Row - Redesigned with gold hover */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-20 md:mb-24">
            {footerLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-12 py-6 text-[10px] md:text-[11px] text-gray-500 transition-all duration-300 font-medium tracking-wide"
                style={{ color: undefined }}
              >
                <span className="relative z-10 group-hover:text-[#D6B14D] transition-colors duration-300">{link.name}</span>
                <span className="absolute inset-0 bg-transparent group-hover:bg-[#FFF9E6] rounded-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16 md:mb-20" />

          {/* Copyright - simplified */}
          <p className="text-[10px] md:text-[11px] text-gray-300 text-center tracking-widest uppercase">
            © 2026 <span style={{ color: '#D6B14D' }}>FINDS Lab</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default memo(LayoutOrganisms)
