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
  
  /* Hero Section (상세 페이지 통일 디자인) */
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
  
  /* Content Card (상세 페이지 통일 디자인) */
  .content-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    overflow: hidden;
  }
  
  .content-body {
    padding: 32px;
  }
  
  /* Image Grid (갤러리 페이지 적정 크기) */
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    justify-items: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  /* 이미지가 1개일 때 가운데 정렬 */
  .image-grid:has(.image-item:only-child) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .image-grid:has(.image-item:only-child) .image-item {
    max-width: 300px;
    width: 100%;
  }
  
  .image-item {
    background: white;
    border: 2px solid #e5e7eb;
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
    padding: 8px;
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
  
  /* Footer Navigation (상세 페이지 통일 디자인) */
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
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }
    
    .image-grid:has(.image-item:only-child) {
      grid-template-columns: 1fr;
      max-width: 250px;
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

<section class="max-w-3xl mx-auto px-4 mt-8 pb-12">
  <!-- Hero Section (상세 페이지 통일 디자인) -->
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

  <!-- Content Card (상세 페이지 통일 디자인) -->
  <article class="content-card">
    <div class="content-body">
      {% comment %}
      이미지 경로 설정: 파일의 실제 경로 기준 (archives-gallery.html과 동일한 방식)
      page.path = gallery/2025-09-01-1/index.md
      src_dir = /gallery/2025-09-01-1/
      {% endcomment %}
      {% assign src_dir = '/' | append: page.path | remove: page.name | replace: '//','/' %}
      {% assign last_char = src_dir | slice: -1, 1 %}
      {% unless src_dir contains '/' and last_char == '/' %}
        {% assign src_dir = src_dir | append: '/' %}
      {% endunless %}
      
      {% if page.images and page.images.size > 0 %}
        <div class="image-grid">
          {% for img in page.images %}
            {% comment %}
            이미지 URL 생성: 현재 디렉토리 + 이미지 파일명
            {% endcomment %}
            {% assign img_url = src_dir | append: img | replace: '//', '/' | relative_url %}
            <div class="image-item" onclick="openLightbox('{{ img_url }}', {{ forloop.index0 }})">
              <div class="image-wrapper">
                <img src="{{ img_url }}" alt="{{ img }}" loading="lazy">
              </div>
            </div>
          {% endfor %}
        </div>
      {% else %}
        <!-- Fallback: site.static_files 방식 (archives-gallery.html과 동일) -->
        {% assign gallery_files = site.static_files | where_exp: "f", "f.path contains src_dir" %}
        {% assign image_files = "" | split: "" %}
        {% for f in gallery_files %}
          {% assign ext = f.extname | downcase %}
          {% if ext == '.jpg' or ext == '.jpeg' or ext == '.png' or ext == '.webp' or ext == '.gif' %}
            {% assign image_files = image_files | push: f %}
          {% endif %}
        {% endfor %}
        
        {% if image_files.size > 0 %}
          <div class="image-grid">
            {% for img_file in image_files %}
              <div class="image-item" onclick="openLightbox('{{ img_file.path | relative_url }}', {{ forloop.index0 }})">
                <div class="image-wrapper">
                  <img src="{{ img_file.path | relative_url }}" alt="{{ img_file.name }}" loading="lazy">
                </div>
              </div>
            {% endfor %}
          </div>
        {% else %}
          <div class="empty-state">
            <div class="empty-icon">🖼️</div>
            <div class="empty-title">이미지가 없습니다</div>
            <div class="empty-text">갤러리 이미지를 표시하려면 front matter의 images 배열에 파일명을 추가하거나,<br>현재 디렉토리에 이미지 파일을 업로드하세요.</div>
          </div>
        {% endif %}
      {% endif %}
    </div>
    
    <!-- Footer Navigation (상세 페이지 통일 디자인) -->
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
  
  console.log('Gallery images loaded:', galleryImages.length);
});

// 라이트박스 열기
function openLightbox(imageSrc, index) {
  currentImageIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  
  lightboxImage.src = imageSrc;
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  updateNavButtons();
}

// 라이트박스 닫기
function closeLightbox(event) {
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
  
  if (galleryImages.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
  }
}

// 키보드 네비게이션
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('show')) {
      closeLightbox(e);
    }
  }
  
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
