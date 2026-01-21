---
layout: default
title: "FINDS Lab. Official Color Palette"
date: 2025-01-21
permalink: /gallery/2025-01-21-color-palette/
tags: [branding, design, colors]
thumb: color-palette.svg
images:
  - color-palette.svg
---

<style>
  :root {
    --finds-primary-gold: rgb(214, 176, 76);
    --finds-primary-red: rgb(172, 14, 14);
    --finds-silver: rgb(114, 106, 105);
    --finds-honey: rgb(214, 195, 96);
    --finds-cream: rgb(232, 214, 136);
    --finds-rose: rgb(232, 136, 156);
    --finds-blossom: rgb(255, 186, 196);
  }
  
  .hero-section {
    background: linear-gradient(135deg, #fffbeb 0%, rgba(214, 176, 76, 0.15) 100%);
    border: 1px solid rgba(214, 176, 76, 0.2);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 24px;
  }
  
  .hero-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .hero-icon {
    font-size: 36px;
    flex-shrink: 0;
  }
  
  .hero-title {
    font-size: 24px;
    font-weight: 900;
    color: #111827;
    line-height: 1.4;
    margin: 0;
  }
  
  .meta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .meta-pill {
    background: white;
    border: 2px solid var(--finds-primary-gold);
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  
  .content-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    overflow: hidden;
    margin-bottom: 24px;
  }
  
  .content-body {
    padding: 32px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .section-title::before {
    content: '';
    width: 4px;
    height: 20px;
    background: var(--finds-primary-gold);
    border-radius: 2px;
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }
  
  .color-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .color-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
  
  .color-card.primary {
    border: 3px solid var(--finds-primary-gold);
    box-shadow: 0 4px 16px rgba(214, 176, 76, 0.3);
  }
  
  .color-card.primary-red {
    border: 3px solid var(--finds-primary-red);
    box-shadow: 0 4px 16px rgba(172, 14, 14, 0.3);
  }
  
  .color-swatch {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-info {
    padding: 20px;
    border-top: 2px solid #e5e7eb;
  }
  
  .color-name {
    font-size: 16px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }
  
  .primary-badge {
    display: inline-block;
    background: var(--finds-primary-gold);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: 8px;
    vertical-align: middle;
  }
  
  .primary-badge-red {
    display: inline-block;
    background: var(--finds-primary-red);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: 8px;
    vertical-align: middle;
  }
  
  .color-reference {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 12px;
  }
  
  .color-values {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .color-value {
    background: #f3f4f6;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'Consolas', 'Monaco', monospace;
    color: #374151;
  }
  
  .gradient-section {
    margin-top: 32px;
  }
  
  .gradient-bar {
    height: 80px;
    border-radius: 16px;
    margin-bottom: 16px;
    display: flex;
    overflow: hidden;
  }
  
  .gradient-bar-full {
    height: 60px;
    border-radius: 12px;
    margin-bottom: 24px;
  }
  
  .gradient-segment {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 11px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
  
  .usage-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .usage-table th,
  .usage-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .usage-table th {
    background: #f9fafb;
    font-weight: 700;
    font-size: 13px;
    color: #374151;
  }
  
  .usage-table td {
    font-size: 14px;
    color: #4b5563;
  }
  
  .usage-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }
  
  .note-box {
    background: linear-gradient(135deg, rgba(214, 176, 76, 0.08) 0%, rgba(172, 14, 14, 0.05) 100%);
    border: 1px solid rgba(214, 176, 76, 0.25);
    border-radius: 12px;
    padding: 20px;
    margin-top: 24px;
  }
  
  .note-box p {
    margin: 0;
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
  }
  
  .note-box strong {
    color: rgb(172, 14, 14);
  }
</style>

<section class="max-w-4xl mx-auto px-4 mt-8 pb-12">
  <div class="hero-section">
    <div class="hero-header">
      <span class="hero-icon">🎨</span>
      <h1 class="hero-title">FINDS Lab. Official Color Palette</h1>
    </div>
    <div class="meta-group">
      <div class="meta-pill">
        <span>📅</span>
        <span>2025.01.21</span>
      </div>
      <div class="meta-pill">
        <span>#</span>
        <span>branding</span>
      </div>
      <div class="meta-pill">
        <span>#</span>
        <span>design</span>
      </div>
      <div class="meta-pill">
        <span>#</span>
        <span>colors</span>
      </div>
    </div>
  </div>

  <article class="content-card">
    <div class="content-body">
      <h2 class="section-title">Primary Colors</h2>
      
      <div class="color-grid">
        <div class="color-card primary">
          <div class="color-swatch" style="background: rgb(214, 176, 76);">
            <span style="color: white; font-weight: 800; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">FINDS</span>
          </div>
          <div class="color-info">
            <div class="color-name">FINDS Primary Gold <span class="primary-badge">PRIMARY</span></div>
            <div class="color-reference">Based on Pantone 7406 C</div>
            <div class="color-values">
              <span class="color-value">RGB(214, 176, 76)</span>
              <span class="color-value">#D6B04C</span>
            </div>
          </div>
        </div>
        
        <div class="color-card primary-red">
          <div class="color-swatch" style="background: rgb(172, 14, 14);">
            <span style="color: white; font-weight: 800; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">FINDS</span>
          </div>
          <div class="color-info">
            <div class="color-name">FINDS Primary Red <span class="primary-badge-red">PRIMARY</span></div>
            <div class="color-reference">Based on Pantone 187 C</div>
            <div class="color-values">
              <span class="color-value">RGB(172, 14, 14)</span>
              <span class="color-value">#AC0E0E</span>
            </div>
          </div>
        </div>
      </div>
      
      <h2 class="section-title">Secondary Colors</h2>
      
      <div class="color-grid">
        <div class="color-card">
          <div class="color-swatch" style="background: rgb(214, 195, 96);">
            <span style="color: white; font-weight: 800; font-size: 24px; text-shadow: 0 1px 3px rgba(0,0,0,0.15);">Aa</span>
          </div>
          <div class="color-info">
            <div class="color-name">FINDS Honey</div>
            <div class="color-reference">Based on Pantone 7405 C</div>
            <div class="color-values">
              <span class="color-value">RGB(214, 195, 96)</span>
              <span class="color-value">#D6C360</span>
            </div>
          </div>
        </div>
        
        <div class="color-card">
          <div class="color-swatch" style="background: rgb(232, 214, 136);">
            <span style="color: #333; font-weight: 800; font-size: 24px;">Aa</span>
          </div>
          <div class="color-info">
            <div class="color-name">FINDS Cream</div>
            <div class="color-reference">Based on Pantone 7403 C</div>
            <div class="color-values">
              <span class="color-value">RGB(232, 214, 136)</span>
              <span class="color-value">#E8D688</span>
            </div>
          </div>
        </div>
        
        <div class="color-card">
          <div class="color-swatch" style="background: rgb(114, 106, 105);">
            <span style="color: white; font-weight: 800; font-size: 24px;">Aa</span>
          </div>
          <div class="color-info">
            <div class="color-name">FINDS Silver</div>
            <div class="color-reference">Based on Pantone Warm Gray 9 C</div>
            <div class="color-values">
              <span class="color-value">RGB(114, 106, 105)</span>
              <span class="color-value">#726A69</span>
            </div>
          </div>
        </div>
      </div>
      
      <h2 class="section-title">Accent Colors</h2>
      
      <div class="color-grid">
        <div class="color-card">
          <div class="color-swatch" style="background: rgb(232, 136, 156);">
            <span style="color: white; font-weight: 800; font-size: 24px;">Aa</span>
          </div>
          <div class="color-info">
            <div class="color-name">FINDS Rose</div>
            <div class="color-reference">Based on Pantone 197 C</div>
            <div class="color-values">
              <span class="color-value">RGB(232, 136, 156)</span>
              <span class="color-value">#E8889C</span>
            </div>
          </div>
        </div>
        
        <div class="color-card">
          <div class="color-swatch" style="background: rgb(255, 186, 196);">
            <span style="color: #333; font-weight: 800; font-size: 24px;">Aa</span>
          </div>
          <div class="color-info">
            <div class="color-name">FINDS Blossom</div>
            <div class="color-reference">Based on Pantone 1765 C</div>
            <div class="color-values">
              <span class="color-value">RGB(255, 186, 196)</span>
              <span class="color-value">#FFBAC4</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="gradient-section">
        <h2 class="section-title">Color Gradients</h2>
        
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Gold Spectrum (Primary → Honey → Cream)</p>
        <div class="gradient-bar">
          <div class="gradient-segment" style="background: rgb(214, 176, 76);">Gold</div>
          <div class="gradient-segment" style="background: rgb(214, 195, 96);">Honey</div>
          <div class="gradient-segment" style="background: rgb(232, 214, 136); color: #333;">Cream</div>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Red to Rose Spectrum</p>
        <div class="gradient-bar">
          <div class="gradient-segment" style="background: rgb(172, 14, 14);">Primary Red</div>
          <div class="gradient-segment" style="background: rgb(232, 136, 156);">Rose</div>
          <div class="gradient-segment" style="background: rgb(255, 186, 196); color: #333;">Blossom</div>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Full Palette Gradient</p>
        <div class="gradient-bar-full" style="background: linear-gradient(90deg, rgb(172, 14, 14), rgb(214, 176, 76), rgb(214, 195, 96), rgb(232, 214, 136), rgb(114, 106, 105), rgb(232, 136, 156), rgb(255, 186, 196));"></div>
      </div>
      
      <h2 class="section-title" style="margin-top: 32px;">Usage Guidelines</h2>
      
      <table class="usage-table">
        <thead>
          <tr>
            <th>Color</th>
            <th>Primary Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="usage-dot" style="background: rgb(214, 176, 76);"></span>Primary Gold</td>
            <td>Main branding, Total statistics, PhD elements, Journal papers, achievements</td>
          </tr>
          <tr>
            <td><span class="usage-dot" style="background: rgb(172, 14, 14);"></span>Primary Red</td>
            <td>CTAs, important highlights, links, Conference papers, hover states</td>
          </tr>
          <tr>
            <td><span class="usage-dot" style="background: rgb(214, 195, 96);"></span>Honey</td>
            <td>Secondary gold elements, current year highlights, NEW badges</td>
          </tr>
          <tr>
            <td><span class="usage-dot" style="background: rgb(232, 214, 136);"></span>Cream</td>
            <td>Book publications, light backgrounds, subtle highlights</td>
          </tr>
          <tr>
            <td><span class="usage-dot" style="background: rgb(114, 106, 105);"></span>Silver</td>
            <td>Text, borders, neutral elements, subtle backgrounds</td>
          </tr>
          <tr>
            <td><span class="usage-dot" style="background: rgb(232, 136, 156);"></span>Rose</td>
            <td>M.S. students, secondary elements</td>
          </tr>
          <tr>
            <td><span class="usage-dot" style="background: rgb(255, 186, 196);"></span>Blossom</td>
            <td>Undergrad elements, Reports, soft backgrounds</td>
          </tr>
        </tbody>
      </table>
      
      <div class="note-box">
        <p><strong>Design Note:</strong> This color palette features dual primary colors — FINDS Primary Gold and FINDS Primary Red — as the main brand identity. All RGB values incorporate the numbers 14, 6, and 5 where possible, creating a cohesive and intentional design system. The Honey sits between Primary Gold and Cream, providing a smooth gradient transition for highlighting current or featured elements.</p>
      </div>
    </div>
  </article>
</section>
