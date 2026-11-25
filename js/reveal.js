/* Aufbau-Animationen nach einer einzigen Regel:
   Jedes Element baut sich auf, sobald es von unten ins Bild kommt, und bleibt danach stehen.
   Was gleichzeitig ins Bild kommt, erscheint von oben nach unten kurz nacheinander. */
(function(){
  var root=document.documentElement;
  if(!root.classList.contains('rv')) return;
  window.__rvReady=true;

  function q(s,ctx){ return Array.prototype.slice.call((ctx||document).querySelectorAll(s)); }

  /* Wörter in Masken verpacken (nur Überschriften ohne Übersetzung) */
  function splitWords(el){
    var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null), nodes=[], n;
    while((n=walker.nextNode())) nodes.push(n);
    var i=0;
    nodes.forEach(function(t){
      var parts=t.nodeValue.split(/(\s+)/), frag=document.createDocumentFragment();
      parts.forEach(function(p){
        if(!p) return;
        if(/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(p)); return; }
        var w=document.createElement('span'); w.className='mw';
        var inner=document.createElement('span'); inner.className='mi'; inner.textContent=p;
        inner.style.setProperty('--w',(0.05*i++)+'s'); w.appendChild(inner); frag.appendChild(w);
      });
      t.parentNode.replaceChild(frag,t);
    });
    el.setAttribute('data-rv','words');
  }

  /* Header */
  var h1=document.querySelector('.hero h1'); if(h1) splitWords(h1);
  var heroEls=[h1].concat(q('.hero .byline > *')).filter(Boolean);
  heroEls.forEach(function(el,i){ if(!el.hasAttribute('data-rv')) el.setAttribute('data-rv','up'); el.style.setProperty('--d',(i?0.3+i*0.06:0)+'s'); });

  /* Alle Inhalte der übrigen Bereiche, nach Art: Überschriften, Bilder, Textblöcke */
  var BLOCKS='h2,h3,.label,blockquote,p,figure,.player,dl > div,.row,.lg,li,.more-btn';
  q('main > section:not(.hero), main > div').forEach(function(sec){
    q(BLOCKS,sec).forEach(function(el){
      if(el.closest('[data-rv]')) return;
      if(el.closest('footer')) return;
      if((el.tagName==='H2'||el.tagName==='H3') && el.classList.contains('display') && !el.hasAttribute('data-i18n')) splitWords(el);
      else if(el.tagName==='FIGURE'||el.classList.contains('player')) el.setAttribute('data-rv','clip');
      else el.setAttribute('data-rv','up');
    });
  });

  var hasIO='IntersectionObserver' in window;
  var io=hasIO ? new IntersectionObserver(function(entries){
    var hit=entries.filter(function(e){ return e.isIntersecting; })
      .sort(function(a,b){ return (a.boundingClientRect.top-b.boundingClientRect.top)||(a.boundingClientRect.left-b.boundingClientRect.left); });
    hit.forEach(function(e,i){
      e.target.style.setProperty('--d',Math.min(i,6)*0.06+'s');
      e.target.classList.add('in'); io.unobserve(e.target);
    });
  },{rootMargin:'0px 0px -18% 0px',threshold:0}) : null;
  function watch(el){ if(io) io.observe(el); else el.classList.add('in'); }
  q('[data-rv]').forEach(function(el){ if(el.closest('.hero')) return; watch(el); });

  requestAnimationFrame(function(){ requestAnimationFrame(function(){ heroEls.forEach(function(el){ el.classList.add('in'); }); }); });

  /* BTS-Bilder kommen später dazu */
  var grid=document.getElementById('bts-grid');
  if(grid && 'MutationObserver' in window){
    new MutationObserver(function(ms){ ms.forEach(function(m){ Array.prototype.forEach.call(m.addedNodes,function(n){
      if(n.nodeType===1 && n.tagName==='FIGURE'){ n.setAttribute('data-rv','clip'); watch(n); }
    }); }); }).observe(grid,{childList:true});
  }
})();
