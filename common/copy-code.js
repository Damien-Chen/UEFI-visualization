/**
 * Copy-to-clipboard buttons — auto-injected on all <pre> code blocks.
 * Adds a small "Copy" button in the top-right corner of each code block.
 */
(function () {
    'use strict';

    var style = document.createElement('style');
    style.textContent = [
        '.code-block-wrapper{position:relative}',
        '.copy-btn{position:absolute;top:8px;right:8px;padding:4px 10px;',
        'border-radius:6px;border:1px solid rgba(255,255,255,0.12);',
        'background:rgba(15,15,35,0.8);color:#9e9e9e;font-size:0.75rem;',
        'font-family:inherit;cursor:pointer;transition:all .2s;z-index:2;',
        'opacity:0;pointer-events:none}',
        '.code-block-wrapper:hover .copy-btn,.copy-btn:focus{opacity:1;pointer-events:auto}',
        '.copy-btn:hover{color:#4fc3f7;border-color:rgba(79,195,247,0.4)}',
        '.copy-btn.copied{color:#22c55e;border-color:rgba(34,197,94,0.4)}',
        '.copy-btn:focus-visible{outline:2px solid #4fc3f7;outline-offset:2px}'
    ].join('');
    document.head.appendChild(style);

    function wrapAndAddButton(pre) {
        if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrapper')) return;

        var wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        var btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy code to clipboard');
        wrapper.appendChild(btn);

        btn.addEventListener('click', function () {
            var text = pre.textContent;
            navigator.clipboard.writeText(text).then(function () {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(function () {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(function () {
                /* Fallback for older browsers */
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(function () {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    }

    /* Run after DOM is ready */
    function init() {
        document.querySelectorAll('pre').forEach(wrapAndAddButton);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
