(function(){
  var v=document.getElementById('hero');
  var mqTall=window.matchMedia('(max-aspect-ratio: 1/1)');
  function heroSrc(){ var k=mqTall.matches?'tall':'wide', src=v.getAttribute('data-src-'+k);
    if(v.getAttribute('src')===src) return;
    v.setAttribute('poster',v.getAttribute('data-poster-'+k)); v.setAttribute('src',src);
    var rm=false; try{ rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
    if(!rm){ try{ var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){}); }catch(e){} } }
  heroSrc();
  if(mqTall.addEventListener) mqTall.addEventListener('change',heroSrc); else if(mqTall.addListener) mqTall.addListener(heroSrc);
  try{ if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ v.removeAttribute('autoplay'); v.pause(); } }catch(e){}

  var h1=document.querySelector('.hero h1');
  function fit(){ if(innerWidth<=720){h1.style.fontSize='';return;}
    h1.style.fontSize='100px'; var w=h1.parentNode.clientWidth-parseFloat(getComputedStyle(h1.parentNode).paddingLeft)*2;
    var byW=100*w/h1.scrollWidth, byH=innerHeight*0.27; /* nie höher als ca. ein Viertel des Fensters, damit der Titel bei flachen Fenstern und Link-Vorschauen nicht abgeschnitten wird */
    h1.style.fontSize=Math.min(byW,byH)+'px'; }
  fit(); addEventListener('resize',fit); if(document.fonts){ if(document.fonts.ready) document.fonts.ready.then(fit); if(document.fonts.addEventListener) document.fonts.addEventListener('loadingdone',fit); }

  var bar=document.querySelector('.bar'), hero=document.querySelector('.hero');
  function onS(){ bar.classList.toggle('solid', window.scrollY > hero.offsetHeight-70); }
  window.addEventListener('scroll',onS,{passive:true}); onS();

  /* ---------- Sprache ---------- */
  var EN={"nav.film": "Film", "nav.contact": "Contact", "by": "by", "hero.watch": "<span class=\"tri-s\" aria-hidden=\"true\"></span>Watch the film · 1:19 min", "logline": "Three children play “The Floor Is Lava” in an overheated city. The asphalt turns dangerous, and only the few green spaces are safe.", "syn1": "Focused and nimble, the children jump from one patch of green to the next. Until one of the boys steps onto the asphalt: his sole melts and pulls into strings. The game turns serious.", "syn2": "The tone is deliberately playful, carried by music composed for the spot. The children’s lightness contrasts with the fact that they, as the next generation, will live with the consequences.", "tag": "Soon everyone will be playing.", "f.run": "Running time", "f.year": "Year", "f.country": "Country", "f.prod": "Production", "f.germany": "Germany", "play.aria": "Play film", "play": "Watch the film<small>1 min 19 s · with sound</small>", "stills.sub": "Stills<br>from the film", "bts.sub": "On set", "bts.intro": "Made in the 4th semester of Media Design at DHBW Ravensburg, in the P4 Motion Design project: Arts for Climate Action.", "c.by": "A film by", "c.cast": "Cast", "c.feat": "Featuring", "c.music": "Music", "c.sup": "Supervision", "c.uni": "University", "c.spon": "Sponsors", "fest": "Festival run<em>from 2027</em>", "contact.h": "Contact", "contact.p": "Screeners, press material or questions about the film? Get in touch.", "contact.btn": "Request screener <span aria-hidden=\"true\">→</span>", "lb.close": "Close", "film.sub": "Der Boden ist Lava<br>(The Floor Is Lava) · 1:19 min", "film.note": "The English version of the film is coming soon. Until then you are watching the German original.", "__title": "Der Boden ist Lava (The Floor Is Lava) · Spec ad for GERICS", "__desc": "Der Boden ist Lava (The Floor Is Lava), a spec ad for GERICS, Climate Service Center Germany. By Tim Kokemoor, Jahn Krieger and Moritz Schwarz, 2026.", "logline.label": "Logline", "syn3": "The heat affects everyone in the city. The mother struggling with her pram across the soft asphalt stands for this, while the children have found a way out on the strip of grass. One that is no solution in the long run.", "bg.label": "Spec ad for GERICS", "bg1": "GERICS, the Climate Service Center Germany at Helmholtz-Zentrum Hereon, supports policymakers, public administration and businesses in adapting to climate change, for example cities in climate-adapted urban development.", "bg2": "No tangible product, no well-known brand, no logo: what is being advertised is a service that only becomes noticeable when it is missing. The spot shows how scarce green spaces are and that cities need nature-based solutions.", "f.genre": "Genre", "f.brand": "Brand", "f.uni": "University", "f.unival": "DHBW Ravensburg · Media Design, 4th semester", "legal.imprint": "Legal notice", "legal.privacy": "Privacy policy", "yt.link": "Watch on YouTube"}, DE={}, lang='de';
  document.querySelectorAll('[data-i18n]').forEach(function(el){ DE[el.getAttribute('data-i18n')]=el.innerHTML; });
  document.querySelectorAll('[data-i18n-aria]').forEach(function(el){ DE[el.getAttribute('data-i18n-aria')]=el.getAttribute('aria-label'); });
  DE.__title=document.title; var md=document.querySelector('meta[name=description]'); DE.__desc=md.content;
  function setLang(l){ lang=l; var D=l==='en'?EN:DE;
    document.documentElement.lang=l;
    document.querySelectorAll('[data-i18n]').forEach(function(el){ var k=el.getAttribute('data-i18n'); if(D[k]!=null) el.innerHTML=D[k]; });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){ var k=el.getAttribute('data-i18n-aria'); if(D[k]!=null) el.setAttribute('aria-label',D[k]); });
    document.title=D.__title; md.content=D.__desc;
    document.querySelectorAll('.lang button').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-lang')===l?'true':'false'); });
    resetPlayer(); updateFilm(); updateMore(); fit();
    try{ localStorage.setItem('dbil-lang',l); }catch(e){}
  }
  document.querySelectorAll('.lang button').forEach(function(b){ b.addEventListener('click',function(){ setLang(b.getAttribute('data-lang')); }); });

  var mb=document.querySelector('.more-btn'), about=document.getElementById('about');
  function updateMore(){ if(!mb) return; var open=about.classList.contains('open');
    mb.textContent=open?(lang==='en'?'Show less':'Weniger lesen'):(lang==='en'?'Read more':'Mehr lesen'); mb.setAttribute('aria-expanded',open?'true':'false'); }
  if(mb) mb.addEventListener('click',function(){ about.classList.toggle('open'); updateMore(); });
  var pl=document.getElementById('player');
  function resetPlayer(){ var m=pl.querySelector('video'); if(m) m.remove(); pl.classList.remove('on'); }
  var playLink=pl.querySelector('.play'), ytLink=document.getElementById('yt-link'), enAvail=false;
  /* englische Fassung automatisch erkennen: liegt video/en/film.mp4 im Ordner, wird sie verwendet */
  try{ fetch(pl.getAttribute('data-film-en'),{method:'HEAD'}).then(function(r){ enAvail=r.ok; updateFilm(); }).catch(function(){}); }catch(e){}
  function filmFile(){ return (lang==='en' && enAvail) ? pl.getAttribute('data-film-en') : pl.getAttribute('data-film-de'); }
  function updateFilm(){
    playLink.href=filmFile(); probeSubs(filmFile());
    var id=(pl.getAttribute('data-youtube-'+lang)||'').trim()||(pl.getAttribute('data-youtube-de')||'').trim();
    if(ytLink){ if(id){ ytLink.href='https://www.youtube.com/watch?v='+encodeURIComponent(id); ytLink.parentNode.hidden=false; } else ytLink.parentNode.hidden=true; }
    var note=document.getElementById('film-note'); if(note) note.hidden=!(lang==='en' && !enAvail);
  }
  /* Untertitel: liegen neben der Filmdatei als untertitel-de.vtt / untertitel-en.vtt und werden automatisch erkannt */
  var SUBS=[{l:'de',label:'Deutsch',f:'untertitel-de.vtt'},{l:'en',label:'English',f:'untertitel-en.vtt'}], subFound={};
  function folderOf(file){ return file.replace(/[^/]*$/,''); }
  function probeSubs(file){ var d=folderOf(file);
    SUBS.forEach(function(s){ var u=d+s.f; if(u in subFound) return; subFound[u]=false;
      try{ fetch(u,{method:'HEAD',cache:'no-cache'}).then(function(r){ subFound[u]=r.ok; }).catch(function(){}); }catch(e){} }); }
  function addSubs(el,file){ var d=folderOf(file), any=false;
    SUBS.forEach(function(s){ var u=d+s.f; if(!subFound[u]) return;
      var t=document.createElement('track'); t.kind='subtitles'; t.srclang=s.l; t.label=s.label; t.src=u;
      if(s.l===lang && !any){ t.default=true; any=true; } el.appendChild(t); });
    /* manche Browser (v. a. Safari) schalten nachträglich eingefügte Untertitel nicht von selbst ein */
    function show(){ var tt=el.textTracks, i; for(i=0;i<tt.length;i++){ tt[i].mode=(tt[i].language===lang)?'showing':'disabled'; } }
    if(any){ el.addEventListener('loadedmetadata',show,{once:true}); setTimeout(show,300); } }
  playLink.addEventListener('click',function(ev){
    ev.preventDefault();
    var el=document.createElement('video'), file=filmFile(); el.src=file; if(thumb) el.poster=thumb.src; el.controls=true; el.playsInline=true; el.setAttribute('preload','auto');
    addSubs(el,file);
    pl.appendChild(el); pl.classList.add('on');
    try{ var pr=el.play(); if(pr&&pr.catch) pr.catch(function(){}); }catch(e){}
    try{ v.pause(); }catch(e){}
  });
  updateFilm();
  /* Vorschaubild: liegt img/thumbnail.jpg im Repo, wird es automatisch als Vorschaubild im Player genutzt */
  var thumb=document.getElementById('player-thumb');
  if(thumb){ var ti=new Image(); ti.onload=function(){ thumb.src=ti.src; }; ti.src='img/thumbnail.jpg'; }

  /* Behind the Scenes: Bilder aus img/bts/ laden.
     Gibt es img/bts/liste.txt, werden die dort eingetragenen Dateinamen in dieser Reihenfolge gezeigt (frei benennbar).
     Sonst werden 01.jpg, 02.jpg ... geladen, bis eine Nummer fehlt. */
  (function(){
    var grid=document.getElementById('bts-grid'), sec=document.getElementById('bts'), nav=document.getElementById('nav-bts'), count=0, MAX=40;
    if(!grid) return;
    function add(src,done){
      var img=new Image();
      img.onload=function(){ count++; var fig=document.createElement('figure');
        img.alt=(lang==='en'?'Behind the scenes, photo ':'Behind the Scenes, Bild ')+count; img.loading='lazy';
        fig.appendChild(img); grid.appendChild(fig); sec.hidden=false; if(nav) nav.hidden=false; done(true); };
      img.onerror=function(){ done(false); };
      img.src=src;
    }
    function fromList(names){ var i=0; (function next(){ if(i>=names.length||count>=MAX) return; add('img/bts/'+encodeURIComponent(names[i++]),function(){ next(); }); })(); }
    function numbered(){ var n=1; (function next(){ if(n>MAX) return; var num=(n<10?'0':'')+n; n++; add('img/bts/'+num+'.jpg',function(ok){ if(ok) next(); }); })(); }
    try{
      fetch('img/bts/liste.txt',{cache:'no-cache'}).then(function(r){ return r.ok ? r.text() : null; }).then(function(t){
        var names=t ? t.split(/\r?\n/).map(function(s){ return s.trim(); }).filter(function(s){ return s && s.charAt(0)!=='#'; }) : [];
        if(names.length) fromList(names); else numbered();
      }).catch(function(){ numbered(); });
    }catch(e){ numbered(); }
  })();
  var start='de';
  try{ start=localStorage.getItem('dbil-lang') || ((navigator.language||'de').toLowerCase().indexOf('de')===0?'de':'en'); }catch(e){ start=(navigator.language||'de').toLowerCase().indexOf('de')===0?'de':'en'; }
  if(start==='en') setLang('en');

})();
