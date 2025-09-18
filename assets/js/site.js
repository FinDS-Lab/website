// assets/js/site.js
(function () {
  function ready(fn){ 
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  
  ready(function(){
    // === Desktop hover intent (약간 늦게 열리고/닫히게) ===
    document.querySelectorAll('[data-menu]').forEach(function(g){
      var enterTO, leaveTO;
      function open(){ clearTimeout(leaveTO); enterTO = setTimeout(function(){ g.setAttribute('data-open','true'); }, 80); }
      function close(){ clearTimeout(enterTO); leaveTO = setTimeout(function(){ g.removeAttribute('data-open'); }, 120); }
      g.addEventListener('mouseenter', open);
      g.addEventListener('mouseleave', close);
      g.addEventListener('focusin', open);
      g.addEventListener('focusout', close);
    });
    
    // === Mobile: hamburger toggle ===
    var btn = document.getElementById('btnMobile');
    var panel = document.getElementById('mobileNav');
    
    if (btn && panel){
      btn.addEventListener('click', function(){
        var isShown = panel.classList.contains('show');
        
        if (isShown) {
          // 메뉴 닫기
          panel.classList.remove('show');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
        } else {
          // 메뉴 열기
          panel.classList.add('show');
          btn.setAttribute('aria-expanded', 'true');
          btn.setAttribute('aria-label', 'Close menu');
          document.body.classList.add('no-scroll');
        }
      });
      
      // ESC로 닫기
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && panel.classList.contains('show')){
          panel.classList.remove('show');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
        }
      });
      
      // 패널 내부 링크 클릭 시 자동 닫기
      panel.addEventListener('click', function(e){
        var a = e.target.closest('a');
        if (a){ 
          panel.classList.remove('show');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
        }
      });
    }
    
    // === Mobile: accordions ===
    // 두 가지 셀렉터 모두 지원 (기존 HTML과 새 HTML 구조 모두)
    var accordionButtons = document.querySelectorAll('.mobile-acc-btn, .mobile-accordion-header button');
    
    accordionButtons.forEach(function(accBtn){
      accBtn.addEventListener('click', function(e){
        e.preventDefault(); // 기본 동작 방지
        e.stopPropagation(); // 이벤트 전파 중지
        
        // aria-controls로 패널 찾기
        var panelId = accBtn.getAttribute('aria-controls');
        var accPanel = null;
        
        if (panelId) {
          // aria-controls가 있으면 ID로 찾기
          accPanel = document.getElementById(panelId);
        } else {
          // aria-controls가 없으면 DOM 구조로 찾기
          var wrapper = accBtn.closest('.mobile-accordion-wrapper');
          if (!wrapper) {
            // 기존 구조 (px-3 py-2 div)
            wrapper = accBtn.closest('div');
          }
          if (wrapper) {
            accPanel = wrapper.querySelector('.mobile-acc-panel');
          }
        }
        
        if (accPanel) {
          var expanded = accBtn.getAttribute('aria-expanded') === 'true';
          
          // 상태 토글
          accBtn.setAttribute('aria-expanded', String(!expanded));
          
          // 화살표 방향 변경 (텍스트가 화살표인 경우만)
          if (accBtn.textContent.trim() === '▾' || accBtn.textContent.trim() === '▴') {
            accBtn.textContent = expanded ? '▾' : '▴';
          }
          
          // 패널 토글
          if (expanded) {
            accPanel.classList.add('hidden');
          } else {
            accPanel.classList.remove('hidden');
          }
        }
      });
    });
    
    // === Smooth scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          var target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            var headerHeight = 80; // 헤더 높이 고려
            var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    // === Back to top button ===
    var btnTop = document.getElementById('btnTop');
    if (btnTop) {
      // 스크롤 시 버튼 표시/숨김
      var scrollThreshold = 300;
      
      function toggleTopButton() {
        if (window.scrollY > scrollThreshold) {
          btnTop.classList.add('is-visible');
        } else {
          btnTop.classList.remove('is-visible');
        }
      }
      
      // 스크롤 이벤트 최적화 (throttle)
      var ticking = false;
      function scrollHandler() {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            toggleTopButton();
            ticking = false;
          });
          ticking = true;
        }
      }
      
      window.addEventListener('scroll', scrollHandler);
      
      // 클릭 시 맨 위로 스크롤
      btnTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // === Lazy loading for images ===
    if ('IntersectionObserver' in window) {
      var lazyImages = document.querySelectorAll('img[data-src]');
      
      var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    }
    
    // === External links open in new tab ===
    document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').forEach(function(link) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
    
    // === Form validation helper ===
    var forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        var isValid = form.checkValidity();
        if (!isValid) {
          e.preventDefault();
          e.stopPropagation();
        }
        form.classList.add('was-validated');
      });
    });
    
    // === Copy code button (for code blocks) ===
    document.querySelectorAll('pre code').forEach(function(codeBlock) {
      var button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code to clipboard');
      
      button.addEventListener('click', function() {
        var code = codeBlock.textContent;
        
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(code).then(function() {
            button.textContent = 'Copied!';
            setTimeout(function() {
              button.textContent = 'Copy';
            }, 2000);
          });
        } else {
          // Fallback for older browsers
          var textarea = document.createElement('textarea');
          textarea.value = code;
          textarea.style.position = 'absolute';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          
          try {
            document.execCommand('copy');
            button.textContent = 'Copied!';
            setTimeout(function() {
              button.textContent = 'Copy';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
          
          document.body.removeChild(textarea);
        }
      });
      
      var wrapper = codeBlock.parentNode;
      if (wrapper.tagName === 'PRE') {
        wrapper.style.position = 'relative';
        wrapper.appendChild(button);
      }
    });
  });
})();
