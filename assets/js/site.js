// assets/js/site.js
(function () {
  // 모바일 메뉴 초기 숨김 처리 (FOUC 방지)
  var mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    mobileNav.style.display = 'none';
    mobileNav.classList.remove('hidden'); // hidden 클래스는 제거
  }
  
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
        var isHidden = panel.style.display === 'none' || !panel.style.display;
        
        if (isHidden) {
          // 메뉴 열기
          panel.style.display = 'block';
          btn.setAttribute('aria-expanded', 'true');
          btn.setAttribute('aria-label', 'Close menu');
          document.body.classList.add('no-scroll');
        } else {
          // 메뉴 닫기
          panel.style.display = 'none';
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
        }
      });
      
      // ESC로 닫기
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && panel.style.display === 'block'){
          panel.style.display = 'none';
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
        }
      });
      
      // 패널 내부 링크 클릭 시 자동 닫기
      panel.addEventListener('click', function(e){
        var a = e.target.closest('a');
        if (a){ 
          panel.style.display = 'none';
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
        }
      });
    }
    
    // === Mobile: accordions ===
    document.querySelectorAll('.mobile-acc-btn').forEach(function(accBtn){
      accBtn.addEventListener('click', function(){
        var panelId = accBtn.getAttribute('aria-controls');
        var accPanel = document.getElementById(panelId);
        var expanded = accBtn.getAttribute('aria-expanded') === 'true';
        accBtn.setAttribute('aria-expanded', String(!expanded));
        if (accPanel) accPanel.classList.toggle('hidden');
      });
    });
  });
})();
