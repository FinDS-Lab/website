---
layout: default
title: home
---

<style>
  :root {
    --gold: rgb(214, 177, 77);
    --gold-light: rgb(234, 207, 127);
    --red: rgb(172, 14, 14);
    --red-dark: rgb(127, 10, 10);

    /* 공통 레이아웃 기준 */
    --container-max: 1200px;
    --pad-desktop: 24px;
    --pad-tablet: 20px;
    --pad-mobile: 16px;

    /* CTA 버튼 최대 폭 */
    --cta-w-desktop: 520px;
    --cta-w-tablet: 460px;
    --cta-w-mobile: 320px;
  }

  /* 단어 단위 줄바꿈 */
  .keep-words{
    word-break: keep-all;
    overflow-wrap: anywhere;
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
  }

  /* =========================
     HERO Section
     ========================= */
  .hero-section {
    position: relative;
    width: 100%;
    max-width: var(--container-max);
    margin: 0 auto 1.5rem;
    padding: 0 var(--pad-desktop);
    height: 480px;
    display: block;
    box-sizing: border-box;
    overflow: clip;
  }
  @media (max-width: 1024px) {
    .hero-section { padding: 0 var(--pad-tablet); height: 420px; }
  }
  @media (max-width: 540px) {
    .hero-section { padding: 0 var(--pad-mobile); height: 340px; }
  }
  @media (max-width: 480px) { .hero-section { height: 320px; } }
  @media (max-width: 380px) { .hero-section { height: 300px; } }

  .carousel-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
    border-radius: 1.5rem;
    position: relative;
  }
  @media (max-width: 768px) { .carousel-container { border-radius: 1rem; } }

  .carousel-wrapper { position:relative; width:100%; height:100%; overflow:hidden; }
  .carousel-track {
    display: flex;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    will-change: transform;
  }
  .carousel-slide {
    min-width: 100%;
    width: 100%;
    height: 100%;
    position: relative;
    flex: 0 0 100%;
    flex-shrink: 0;
    background: #000;
    overflow: hidden;
  }
  .carousel-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .carousel-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
    display: flex; align-items: center; padding: 0 5%;
    height: 100%; overflow: hidden;
  }
  @media (max-width: 768px) { .carousel-overlay { padding: 0 20px; align-items: center; } }

  .carousel-content {
    max-width: 600px; color: white; animation: fadeInUp 0.8s ease-out;
    max-height: 90%; overflow: hidden;
  }
  @keyframes fadeInUp { from { opacity:0; transform: translateY(30px);} to { opacity:1; transform:translateY(0);} }

  .tag-badge{
    display:inline-block; background:linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color:#000; padding:6px 16px; border-radius:999px; font-weight:900; font-size:14px; letter-spacing:.5px; margin-bottom:16px;
  }
  @media (max-width:480px){ .tag-badge{ font-size:12px; padding:4px 12px; margin-bottom:12px; } }

  .hero-title{ font-size: clamp(22px, 5vw, 44px); font-weight: 900; line-height: 1.2; margin-bottom: 18px; }
  @media (max-width:540px){ .hero-title{ font-size:24px; margin-bottom:16px; } }
  @media (max-width:380px){ .hero-title{ font-size:22px; margin-bottom:14px; } }

  .hero-buttons{
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    width: 100%; max-width: var(--cta-w-desktop); margin: 0; justify-items: stretch;
  }
  @media (max-width:1024px){ .hero-buttons{ max-width: var(--cta-w-tablet); } }
  @media (max-width:540px){ .hero-buttons{ max-width: var(--cta-w-mobile); gap: 10px; } }
  @media (max-width:480px){ .hero-buttons{ gap: 8px; } }

  .btn-hero{
    min-height: 44px; padding: 12px 18px; border-radius: 8px; font-weight: 700; font-size: 14px;
    line-height: 1.1; text-decoration: none; transition: all .3s; display: inline-block; width: 100%;
    text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  @media (max-width:540px){ .btn-hero{ font-size: clamp(11px, 3.4vw, 13px); padding: 11px 14px; letter-spacing: .1px; } }
  @media (max-width:380px){ .btn-hero{ font-size: clamp(10.5px, 3.6vw, 12px); padding: 10px 12px; min-height: 40px; } }
  @media (max-width:340px){ .btn-hero{ font-size: clamp(10px, 3.8vw, 11.5px); } }

  .btn-hero.primary, .btn-hero.secondary{
    background: linear-gradient(135deg, var(--red) 0%, var(--red-dark) 100%);
    color:#fff; border:2px solid transparent;
  }
  .btn-hero.primary:hover, .btn-hero.secondary:hover{
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(172, 14, 14, 0.3);
  }
  @media (hover:none){
    .btn-hero.primary:active, .btn-hero.secondary:active{
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(172, 14, 14, 0.3);
    }
  }

  .carousel-dots{
    position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
    display:flex; gap:8px; z-index:10; padding:8px;
  }
  @media (max-width:480px){ .carousel-dots{ bottom:14px; } }

  .dot{ width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.4); border:none; cursor:pointer; transition:all .3s; padding:0; position:relative; }
  .dot::before{ content:''; position:absolute; top:-8px; left:-8px; right:-8px; bottom:-8px; }
  .dot.active{ width:24px; border-radius:4px; background:var(--gold); }

  /* =========================
     INTRO Section
     ========================= */
  .intro-section{
    max-width: var(--container-max);
    margin: 80px auto;
    padding: 0 var(--pad-desktop);
    display:grid; grid-template-columns:180px 1fr; gap:40px; align-items:center;
    box-sizing: border-box;
  }
  @media (max-width:768px){
    .intro-section{ grid-template-columns:1fr; margin:60px auto; text-align:center; padding:0 var(--pad-tablet); gap:30px; }
  }
  @media (max-width:480px){ .intro-section{ margin:40px auto; padding:0 var(--pad-mobile); gap:24px; } }

  .logo-box{
    width:180px; height:180px; background:#fff; border-radius:24px; display:flex; align-items:center; justify-content:center;
    box-shadow:0 20px 40px rgba(0,0,0,.08); position:relative; overflow:hidden;
  }
  @media (max-width:768px){ .logo-box{ margin:0 auto; } }
  @media (max-width:480px){ .logo-box{ width:150px; height:150px; border-radius:20px; } }
  .logo-box::before{ content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(214,177,77,.1) 0%, rgba(172,14,14,.1) 100%); opacity:0; transition:.3s; }
  .logo-box:hover::before{ opacity:1; }
  .logo-box img{ width:140px; height:140px; object-fit:contain; position:relative; z-index:1; }
  @media (max-width:480px){ .logo-box img{ width:110px; height:110px; } }

  .intro-content h2{ color:var(--red); font-size:24px; font-weight:900; margin-bottom:8px; }
  @media (max-width:480px){ .intro-content h2{ font-size:20px; } }
  .intro-content h3{ font-size:32px; margin-bottom:4px; }
  @media (max-width:480px){ .intro-content h3{ font-size:24px; } }
  .intro-content .lab-name{ color:var(--gold); font-weight:900; }
  .intro-content .lab-full{ font-size:18px; color:#000; margin-left:0; }
  @media (max-width:768px){ .intro-content .lab-full{ display:block; margin-left:0; margin-top:8px; } }
  .intro-content .description{ margin-top:16px; font-size:16px; line-height:1.8; color:#4b5563; }
  @media (max-width:480px){ .intro-content .description{ font-size:14px; line-height:1.7; } }

  /* =========================
     UPDATES Section
     ========================= */
  .updates-section{
    max-width: var(--container-max);
    margin: 0 auto 80px;
    padding: 0 var(--pad-desktop);
    display:grid; grid-template-columns:repeat(2,1fr); gap:32px;
    box-sizing: border-box;
  }
  @media (max-width:768px){
    .updates-section{ grid-template-columns:1fr; gap:24px; margin-bottom:60px; padding:0 var(--pad-tablet); }
  }
  @media (max-width:480px){ .updates-section{ padding:0 var(--pad-mobile); gap:20px; margin-bottom:40px; } }

  .update-card{ background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,.05); transition:.3s; }
  @media (max-width:480px){ .update-card{ border-radius:16px; } }
  .update-card:hover{ transform:translateY(-5px); box-shadow:0 20px 60px rgba(0,0,0,.1); }
  @media (hover:none){ .update-card:hover{ transform:none; } }

  .update-header{
    padding:24px 28px; background:linear-gradient(135deg,#f8f9fa 0%,#fff 100%);
    border-bottom:2px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;
  }
  @media (max-width:480px){ .update-header{ padding:18px 20px; } }

  .update-title{ font-size:20px; font-weight:900; color:#111827; display:flex; align-items:center; gap:10px; }
  @media (max-width:480px){ .update-title{ font-size:18px; } }

  .update-icon{
    width:32px; height:32px; background:linear-gradient(135deg,var(--gold) 0%, var(--gold-light) 100%);
    border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px;
  }
  @media (max-width:480px){ .update-icon{ width:28px; height:28px; font-size:16px; } }

  .update-more{
    color:var(--red); font-weight:700; font-size:14px; text-decoration:none; display:flex; align-items:center; gap:4px;
    transition:gap .2s; padding:4px 8px; margin:-4px -8px;
  }
  .update-more:hover{ gap:8px; }

  .update-list{ padding:8px; }
  @media (max-width:480px){ .update-list{ padding:4px; } }

  .update-item{
    padding:20px; border-radius:12px; transition:.2s; cursor:pointer; position:relative; overflow:hidden; -webkit-tap-highlight-color:transparent;
  }
  @media (max-width:480px){ .update-item{ padding:16px; border-radius:10px; } }
  .update-item::before{
    content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:0; background:var(--gold); transition:height .3s;
  }
  .update-item:hover{ background:#fef9f3; }
  .update-item:hover::before{ height:60%; }
  @media (hover:none){ .update-item:active{ background:#fef9f3; } }

  .update-date{ display:flex; align-items:baseline; gap:6px; margin-bottom:8px; }
  .date-day{ font-size:24px; font-weight:900; color:var(--red); }
  @media (max-width:480px){ .date-day{ font-size:20px; } }
  .date-month{ font-size:12px; font-weight:700; color:#9ca3af; }

  .update-item-title{
    font-size:15px; font-weight:800; color:#1f2937; line-height:1.5; display:block; cursor:pointer;
    overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
    word-break: keep-all; overflow-wrap: anywhere; hyphens: auto;
  }
  @media (max-width:480px){ .update-item-title{ font-size:14px; line-height:1.4; } }

  .update-meta{ margin-top:6px; font-size:12px; color:#9ca3af; display:flex; align-items:center; gap:12px; }
  .meta-tag{ display:inline-flex; align-items:center; gap:4px; padding:2px 8px; background:rgba(214,177,77,.1); border-radius:999px; font-weight:600; }
  @media (max-width:480px){ .meta-tag{ font-size:11px; padding:2px 6px; } }

  .empty-message{ padding:40px; text-align:center; color:#9ca3af; font-size:14px; }
  @media (max-width:480px){ .empty-message{ padding:30px 20px; font-size:13px; } }

  @media (prefers-reduced-motion: reduce){
    *{ animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="carousel-container">
    <div class="carousel-wrapper">
      <div class="carousel-track" id="carouselTrack">
        <!-- Slide 1 -->
        <div class="carousel-slide">
          <img src="{{ '/assets/img/hero/slide-1.jpg' | relative_url }}" alt="FINDS Lab Hero 1" loading="eager">
          <div class="carousel-overlay">
            <div class="carousel-content keep-words">
              <span class="tag-badge">FINDS Lab.</span>
              <h1 class="hero-title keep-words">
                Towards <span style="white-space: nowrap;">Data-Illuminated</span><br>Financial Innovation
              </h1>
              <div class="hero-buttons">
                <a href="{{ '/about-introduction.html' | relative_url }}" class="btn-hero primary">Introduction</a>
                <a href="{{ '/about-honors.html' | relative_url }}" class="btn-hero secondary">Honors</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 2 -->
        <div class="carousel-slide">
          <img src="{{ '/assets/img/hero/slide-2.jpg' | relative_url }}" alt="FINDS Lab Hero 2" loading="lazy">
          <div class="carousel-overlay">
            <div class="carousel-content keep-words">
              <span class="tag-badge">FINDS Lab.</span>
              <h1 class="hero-title keep-words">Accomplishments</h1>
              <div class="hero-buttons">
                <a href="{{ '/publications.html' | relative_url }}" class="btn-hero primary">Publications</a>
                <a href="{{ '/projects.html' | relative_url }}" class="btn-hero secondary">Projects</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 3 -->
        <div class="carousel-slide">
          <img src="{{ '/assets/img/hero/slide-3.jpg' | relative_url }}" alt="FINDS Lab Hero 3" loading="lazy">
          <div class="carousel-overlay">
            <div class="carousel-content keep-words">
              <span class="tag-badge">FINDS Lab.</span>
              <h1 class="hero-title keep-words">Updates</h1>
              <div class="hero-buttons">
                <a href="{{ '/archives-notice.html' | relative_url }}" class="btn-hero primary">Notice</a>
                <a href="{{ '/archives-news.html' | relative_url }}" class="btn-hero secondary">News</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-dots">
      <button class="dot active" data-dot="0" aria-label="Slide 1"></button>
      <button class="dot" data-dot="1" aria-label="Slide 2"></button>
      <button class="dot" data-dot="2" aria-label="Slide 3"></button>
    </div>
  </div>
</section>

<!-- Introduction Section -->
<section class="intro-section">
  <div class="logo-container">
    <div class="logo-box">
      <img src="{{ '/assets/img/brand/logo-finds.png' | relative_url }}" alt="FINDS Lab Logo">
    </div>
  </div>

  <div class="intro-content keep-words">
    <h2 class="keep-words">Dongduk Women's University</h2>
    <h3 class="keep-words">
      <span class="lab-name keep-words">FINDS Lab.</span><br>
      <span class="lab-full keep-words">
        <b>Fin</b>ancial <b>D</b>ata Intelligence & <b>S</b>olutions Laboratory
      </span>
    </h3>
    <p class="description keep-words">
      동덕여자대학교 경영대학 경영융합학부 <b>금융데이터인텔리전스 연구실</b> 홈페이지입니다.
    </p>
  </div>
</section>

<!-- News & Notice Section -->
<section class="updates-section">
  <!-- News Card -->
  <div class="update-card">
    <div class="update-header">
      <div class="update-title">
        <div class="update-icon">📰</div>
        <span>News</span>
      </div>
      <a href="{{ '/archives-news.html' | relative_url }}" class="update-more">More →</a>
    </div>
    <div class="update-list">
      {% assign all_items = site.pages | concat: site.posts %}
      {% assign news_items = "" | split: "" %}
      {% for item in all_items %}
        {% if item.url and item.url contains '/news/' and item.date %}
          {% assign news_items = news_items | push: item %}
        {% endif %}
      {% endfor %}
      {% assign news_items = news_items | sort: 'date' | reverse %}

      {% if news_items.size == 0 %}
        <div class="empty-message">게시글이 없습니다.</div>
      {% else %}
        {% for post in news_items limit:3 %}
          <div class="update-item" onclick="window.location.href='{{ post.url | relative_url }}'">
            <div class="update-date">
              <span class="date-day">{{ post.date | date: "%d" }}</span>
              <span class="date-month">{{ post.date | date: "%Y.%m" }}</span>
            </div>
            <span class="update-item-title keep-words">{{ post.title }}</span>
            {% if post.category %}
            <div class="update-meta">
              <span class="meta-tag">{{ post.category }}</span>
            </div>
            {% endif %}
          </div>
        {% endfor %}
      {% endif %}
    </div>
  </div>

  <!-- Notice Card -->
  <div class="update-card">
    <div class="update-header">
      <div class="update-title">
        <div class="update-icon">📌</div>
        <span>Notice</span>
      </div>
      <a href="{{ '/archives-notice.html' | relative_url }}" class="update-more">More →</a>
    </div>
    <div class="update-list">
      {% assign notice_items = "" | split: "" %}
      {% for item in all_items %}
        {% if item.url and item.url contains '/notice/' and item.date %}
          {% assign notice_items = notice_items | push: item %}
        {% endif %}
      {% endfor %}
      {% assign notice_items = notice_items | sort: 'date' | reverse %}

      {% if notice_items.size == 0 %}
        <div class="empty-message">게시글이 없습니다.</div>
      {% else %}
        {% for post in notice_items limit:3 %}
          <div class="update-item" onclick="window.location.href='{{ post.url | relative_url }}'">
            <div class="update-date">
              <span class="date-day">{{ post.date | date: "%d" }}</span>
              <span class="date-month">{{ post.date | date: "%Y.%m" }}</span>
            </div>
            <span class="update-item-title keep-words">{{ post.title }}</span>
            {% if post.category %}
            <div class="update-meta">
              <span class="meta-tag">{{ post.category }}</span>
            </div>
            {% endif %}
          </div>
        {% endfor %}
      {% endif %}
    </div>
  </div>
</section>

<script>
  // Carousel functionality
  (function() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    let interval;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function setSlideWidths() {
      const container = track.parentElement;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      slides.forEach(slide => {
        slide.style.width = containerWidth + 'px';
        slide.style.minWidth = containerWidth + 'px';
        slide.style.maxWidth = containerWidth + 'px';
        slide.style.height = containerHeight + 'px';
        slide.style.minHeight = containerHeight + 'px';
        slide.style.maxHeight = containerHeight + 'px';
      });
    }

    function preloadImages() {
      const images = document.querySelectorAll('.carousel-slide img');
      images.forEach((img) => {
        if (img.complete) return;
        const tempImg = new Image();
        tempImg.src = img.src;
      });
    }

    function goToSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = index;
      track.style.transform = `translateX(${-(index * 100)}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      setTimeout(() => { isTransitioning = false; }, 600);
    }

    function nextSlide() { if (!isTransitioning) goToSlide((currentIndex + 1) % slides.length); }
    function prevSlide() { if (!isTransitioning) goToSlide((currentIndex - 1 + slides.length) % slides.length); }

    function startAutoplay() { stopAutoplay(); interval = setInterval(nextSlide, 5000); }
    function stopAutoplay() { if (interval) { clearInterval(interval); interval = null; } }

    function handleTouchStart(e){ touchStartX = e.changedTouches[0].screenX; }
    function handleTouchEnd(e){ touchEndX = e.changedTouches[0].screenX; handleSwipe(); }

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        stopAutoplay();
        if (diff > 0) nextSlide(); else prevSlide();
        startAutoplay();
      }
    }

    // Initialize
    setSlideWidths();
    preloadImages();

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setSlideWidths();
        goToSlide(currentIndex);
      }, 200);
    });

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoplay();
        goToSlide(index);
        startAutoplay();
      });
    });

    // Touch events
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Initialize on load
    window.addEventListener('load', () => {
      setSlideWidths();
      goToSlide(0);
      startAutoplay();
    });

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    // Pause on hover (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
      track.addEventListener('mouseenter', stopAutoplay);
      track.addEventListener('mouseleave', startAutoplay);
    }
  })();
</script>
