---
layout: default
title: "FINDS Lab. Logo"
date: 2025-09-01
permalink: /gallery/2025-09-01-1/
tags: [logo]
thumb: logo-finds.png
images:
  - logo-finds.png
---

<style>
  :root {
    --primary-gold: rgb(214, 177, 77);
    --light-gold: rgb(234, 207, 127);
    --accent-red: rgb(172, 14, 14);
  }
  
  /* Hero Section (통일) */
  .hero-section {
    background: linear-gradient(135deg, #f5f3ff 0%, #fef3c7 100%);
    border: 1px solid rgba(214,177,77,0.2);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 24px;
  }
  
  .hero-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .hero-icon {
    font-size: 36px;
    flex-shrink: 0;
  }
  
  .hero-title-group {
    flex: 1;
  }
  
  .hero-category {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    color: #6b7280;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  
  .hero-title {
    font-size: 24px;
    font-weight: 900;
    color: #111827;
    line-height: 1.3;
    margin: 0;
  }
  
  .meta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .meta-pill {
    background: white;
    border: 2px solid var(--primary-gold);
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }
  
  .meta-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(214,177,77,0.2);
  }
  
  /* Content Card (통일) */
  .content-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    overflow: hidden;
  }
  
  .content-body {
    padding: 32px;
  }
  
  /* Image Grid */
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .image-item {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .image-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
    border-color: var(--primary-gold);
  }
  
  .image-wrapper {
    aspect-ratio: 16/9;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }
  
  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  .image-item:hover .image-wrapper img {
    transform: scale(1.05);
  }
  
  .image-info {
    padding: 12px 16px;
    border-top: 1px solid #f3f4f6;
    background: linear-gradient(to bottom, #ffffff, #fafafa);
  }
  
  .image-name {
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    text-align: center;
  }
  
  /* Modal/Lightbox */
  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.95);
    z-index: 10000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(10px);
  }
  
  .lightbox.show {
    display: flex;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .lightbox-image {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  
  .lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    background: rgba(255,255,255,0.1);
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }
  
  .lightbox-close:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.1);
  }
  
  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    background: rgba(255,255,255,0.1);
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }
  
  .lightbox-nav:hover {
    background: rgba(255,255,255,0.2);
  }
  
  .lightbox-prev {
    left: 20px;
  }
  
  .lightbox-next {
    right: 20px;
  }
  
  /* Footer Navigation (통일) */
  .footer-nav {
    padding: 24px 32px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 999px;
    font-weight: 700;
    font-size: 13px;
    color: #374151;
    transition: all 0.2s;
    text-decoration: none;
  }
  
  .nav-button:hover {
    border-color: var(--primary-gold);
    transform: translateX(-4px);
    background: rgba(214,177,77,0.05);
  }
  
  .logo-mark {
    height: 24px;
    width: auto;
    opacity: 0.5;
  }
  
  /* Empty State */
  .empty-state {
    padding: 60px 20px;
    text-align: center;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px dashed #e5e7eb;
  }
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .empty-title {
    font-size: 18px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 8px;
  }
  
  .empty-text {
    font-size: 14px;
    color: #6b7280;
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .hero-section {
      padding: 24px 20px;
    }
    
    .hero-title {
      font-size: 20px;
    }
    
    .content-body {
      padding: 24px 20px;
    }
    
    .image-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }
    
    .nav-button {
      padding: 8px 16px;
      font-size: 12px;
    }
    
    .nav-button .full-text {
      display: none;
    }
    
    .nav-button .short-text {
      display: inline;
    }
    
    .lightbox-nav {
      width: 36px;
      height: 36px;
      font-size: 16px;
    }
    
    .lightbox-prev {
      left: 10px;
    }
    
    .lightbox-next {
      right: 10px;
    }
  }
  
  @media (min-width: 641px) {
    .nav-button .short-text {
      display: none;
    }
  }
</style>

<section class="max-w-5xl mx-auto px-4 mt-8 pb-12">
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-header">
      <span class="hero-icon">📷</span>
      <div class="hero-title-group">
        <p class="hero-category">Gallery</p>
        <h1 class="hero-title">{{ page.title }}</h1>
      </div>
    </div>
    
    <div class="meta-group">
      {% if page.date %}
        <div class="meta-pill">
          <span>📅</span>
          <span>{{ page.date | date: "%Y.%m.%d" }}</span>
        </div>
      {% endif %}
      {% if page.tags and page.tags.size > 0 %}
        {% for tag in page.tags %}
          <div class="meta-pill">
            <span>#</span>
            <span>{{ tag }}</span>
          </div>
        {% endfor %}
      {% endif %}
    </div>
  </div>

  <!-- Content Card -->
  <article class="content-card">
    <div class="content-body">
      {% assign src_dir = '/' | append: page.path | remove: page.name | replace: '//','/' %}
      
      {% if page.images and page.images.size > 0 %}
        <div class="image-grid">
          {% for img in page.images %}
            {% assign img_url = src_dir | append: img | replace: '//','/' | relative_url %}
            <div class="image-item" onclick="openLightbox('{{ img_url }}', {{ forloop.index0 }})">
              <div class="image-wrapper">
                <img src="{{ img_url }}" alt="{{ img }}" loading="lazy">
              </div>
              <div class="image-info">
                <div class="image-name">{{ img }}</div>
              </div>
            </div>
          {% endfor %}
        </div>
      {% else %}
        <!-- Fallback: site.static_files 방식 -->
        {% assign here = src_dir %}
        {% assign files = site.static_files | where_exp: "f", "f.path contains here" %}
        
        {% assign imgs = "" | split: "" %}
        {% for f in files %}
          {% assign ext = f.extname | downcase %}
          {% if ext == ".jpg" or ext == ".jpeg" or ext == ".png" or ext == ".webp" or ext == ".gif" %}
            {% assign imgs = imgs | push: f %}
          {% endif %}
        {% endfor %}
        
        {% if imgs.size > 0 %}
          <div class="image-grid">
            {% for it in imgs %}
              <div class="image-item" onclick="openLightbox('{{ it.path | relative_url }}', {{ forloop.index0 }})">
                <div class="image-wrapper">
                  <img src="{{ it.path | relative_url }}" alt="{{ it.name }}" loading="lazy">
                </div>
                <div class="image-info">
                  <div class="image-name">{{ it.name }}</div>
                </div>
              </div>
            {% endfor %}
          </div>
        {% else %}
          <div class="empty-state">
            <div class="empty-icon">🖼️</div>
            <div class="empty-title">이미지가 없습니다</div>
            <div class="empty-text">갤러리 이미지를 표시하려면 front matter의 images 배열에 파일명을 추가하세요.</div>
          </div>
        {% endif %}
      {% endif %}
    </div>
    
    <!-- Footer Navigation -->
    <div class="footer-nav">
      <a href="{{ '/archives-gallery.html' | relative_url }}" class="nav-button">
        <span>←</span>
        <span class="full-text">갤러리 목록으로</span>
        <span class="short-text">목록</span>
      </a>
      
      <img src="{{ '/assets/img/brand/logo-finds.png' | relative_url }}" 
           alt="FINDS Lab Logo" 
           class="logo-mark">
    </div>
  </article>
</section>

<!-- Lightbox Modal -->
<div class="lightbox" id="lightbox" onclick="closeLightbox(event)">
  <button class="lightbox-close" onclick="closeLightbox(event)" aria-label="닫기">✕</button>
  <button class="lightbox-nav lightbox-prev" onclick="navigateLightbox(event, -1)" aria-label="이전">‹</button>
  <button class="lightbox-nav lightbox-next" onclick="navigateLightbox(event, 1)" aria-label="다음">›</button>
  <div class="lightbox-content">
    <img class="lightbox-image" id="lightboxImage" alt="">
  </div>
</div>

<script>
// 이미지 목록 저장
let galleryImages = [];
let currentImageIndex = 0;

// 페이지 로드 시 이미지 목록 수집
document.addEventListener('DOMContentLoaded', function() {
  const imageItems = document.querySelectorAll('.image-item');
  imageItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push(img.src);
    }
  });
});

// 라이트박스 열기
function openLightbox(imageSrc, index) {
  currentImageIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  
  lightboxImage.src = imageSrc;
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // 네비게이션 버튼 표시/숨김
  updateNavButtons();
}

// 라이트박스 닫기
function closeLightbox(event) {
  // 이벤트가 버튼이나 이미지에서 발생한 경우 무시
  if (event && event.target && (
    event.target.classList.contains('lightbox-image') ||
    event.target.classList.contains('lightbox-nav')
  )) {
    return;
  }
  
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('show');
  document.body.style.overflow = '';
}

// 이미지 네비게이션
function navigateLightbox(event, direction) {
  event.stopPropagation();
  
  currentImageIndex += direction;
  
  // 인덱스 범위 체크
  if (currentImageIndex < 0) {
    currentImageIndex = galleryImages.length - 1;
  } else if (currentImageIndex >= galleryImages.length) {
    currentImageIndex = 0;
  }
  
  const lightboxImage = document.getElementById('lightboxImage');
  lightboxImage.src = galleryImages[currentImageIndex];
  
  updateNavButtons();
}

// 네비게이션 버튼 업데이트
function updateNavButtons() {
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  
  // 이미지가 1개뿐이면 네비게이션 버튼 숨김
  if (galleryImages.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
  }
}

// ESC 키로 닫기
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('show')) {
      closeLightbox(e);
    }
  }
  
  // 화살표 키로 네비게이션
  if (e.key === 'ArrowLeft') {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('show')) {
      navigateLightbox(e, -1);
    }
  }
  
  if (e.key === 'ArrowRight') {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('show')) {
      navigateLightbox(e, 1);
    }
  }
});
</script>
