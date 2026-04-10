/**
 * Back-to-top button — auto-injected into any page that loads this script.
 * Shows after scrolling down 400px; smooth-scrolls back to the top on click.
 */
(function () {
    'use strict';

    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(btn);

    var style = document.createElement('style');
    style.textContent = [
        '.back-to-top{position:fixed;bottom:32px;right:32px;width:44px;height:44px;',
        'border-radius:12px;border:1px solid rgba(255,255,255,0.1);',
        'background:rgba(15,15,35,0.85);color:#4fc3f7;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'opacity:0;pointer-events:none;transition:opacity .3s,transform .3s;',
        'transform:translateY(8px);z-index:1000;backdrop-filter:blur(8px)}',
        '.back-to-top.visible{opacity:1;pointer-events:auto;transform:translateY(0)}',
        '.back-to-top:hover{background:rgba(79,195,247,0.15);border-color:rgba(79,195,247,0.4)}',
        '.back-to-top:focus-visible{outline:2px solid #4fc3f7;outline-offset:2px}'
    ].join('');
    document.head.appendChild(style);

    function onScroll() {
        btn.classList.toggle('visible', window.scrollY > 400);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
