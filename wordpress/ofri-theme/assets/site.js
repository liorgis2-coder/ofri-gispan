(function(){
  'use strict';
  var root = document.documentElement;
  root.setAttribute('lang','he'); root.setAttribute('dir','rtl');
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- contact links ---------- */
  var WA_BASE = 'https://wa.me/972507681816?text=';
  var WA_MSG = 'היי עפרי, הגעתי מהאתר ואשמח לשמוע פרטים';
  document.querySelectorAll('[data-wa]').forEach(function(a){
    a.href = WA_BASE + encodeURIComponent(a.getAttribute('data-wa-text') || WA_MSG);
    a.target = '_blank'; a.rel = 'noopener';
  });
  var cf = document.getElementById('cform'), cfSend = document.getElementById('cf-send');
  if (cf && cfSend){
    var cfName = document.getElementById('cf-name'), cfPhone = document.getElementById('cf-phone'), cfMsg = document.getElementById('cf-msg');
    var composeCF = function(){
      var t = WA_MSG + '.';
      if (cfName.value.trim()) t += '\nשם: ' + cfName.value.trim();
      if (cfPhone.value.trim()) t += '\nטלפון: ' + cfPhone.value.trim();
      if (cfMsg.value.trim()) t += '\n' + cfMsg.value.trim();
      cfSend.href = WA_BASE + encodeURIComponent(t);
    };
    cf.addEventListener('input', composeCF);
    cf.addEventListener('submit', function(e){ e.preventDefault(); composeCF(); cfSend.click(); });
    composeCF();
  }

  /* ---------- images: generated plates, or real photos when given ----------
     To use real photos, put an image URL (or data: URI) here per plate, and Ofra's portrait in PHOTO. */
  var REAL = {window:'', water:'', field:'', sand:'', haze:'', linen:''};
  var PHOTO = (window.OFRI && OFRI.photo) || '';
  var ORDER = ['window','water','haze','linen','field','sand'];
  var plateURL = {};
  function applyPlate(key, url){
    plateURL[key] = url;
    document.querySelectorAll('[data-plate="' + key + '"] img').forEach(function(img){
      var slot = img.parentNode;
      if (PHOTO && slot.hasAttribute('data-photo')) return;
      if (img.getAttribute('src') === url) return;
      img.onload = function(){ img.classList.add('ok'); };
      img.src = url;
      if (img.complete && img.naturalWidth) img.classList.add('ok');
    });
  }
  if (PHOTO){
    document.querySelectorAll('[data-photo]').forEach(function(slot){
      var img = slot.querySelector('img'); slot.classList.add('has-photo');
      img.alt = 'עפרי גיספאן, פסיכותרפיסטית גוף, נפש, רוח'; img.style.setProperty('object-position', '10% 0%'); slot.style.setProperty('--zoom', '1');
      img.onload = function(){ img.classList.add('ok'); }; img.src = PHOTO;
    });
  }
  (function paintPlates(){
    var todo = ORDER.filter(function(k){ if (REAL[k]){ applyPlate(k, REAL[k]); return false; } return true; });
    if (!todo.length || typeof PlatePainter !== 'function') return;
    var S = Math.min(1200, Math.max(720, Math.round(Math.min(window.innerWidth, 900) * Math.min(window.devicePixelRatio || 1, 2) * 0.62)));
    function viaMain(){
      var painter = PlatePainter(function(w, h){ var c = document.createElement('canvas'); c.width = w; c.height = h; return c; });
      var idle = window.requestIdleCallback || function(f){ return setTimeout(function(){ f({timeRemaining:function(){ return 16; }}); }, 60); };
      (function next(){
        var k = todo.shift(); if (!k) return;
        idle(function(){
          var c = painter.plates[k](S);
          var done = function(url){ applyPlate(k, url); next(); };
          if (c.toBlob) c.toBlob(function(b){ done(b ? URL.createObjectURL(b) : c.toDataURL('image/jpeg', 0.86)); }, 'image/jpeg', 0.86);
          else done(c.toDataURL('image/jpeg', 0.86));
        }, {timeout:1200});
      })();
    }
    if (typeof OffscreenCanvas !== 'undefined' && typeof Worker !== 'undefined' && window.Blob && window.URL){
      try {
        var src = PlatePainter.toString() +
          '\nvar P = PlatePainter(function(w,h){ return new OffscreenCanvas(w,h); });' +
          '\nself.onmessage = function(e){ var d = e.data; try { var c = P.plates[d.key](d.S); c.convertToBlob({type:"image/jpeg", quality:0.86}).then(function(b){ self.postMessage({key:d.key, blob:b}); }, function(){ self.postMessage({key:d.key, fail:true}); }); } catch(err){ self.postMessage({key:d.key, fail:true}); } };';
        var wurl = URL.createObjectURL(new Blob([src], {type:'text/javascript'}));
        var worker = new Worker(wurl), failed = false;
        worker.onmessage = function(e){
          var d = e.data;
          if (d.fail){ if (!failed){ failed = true; worker.terminate(); viaMain(); } return; }
          applyPlate(d.key, URL.createObjectURL(d.blob));
        };
        worker.onerror = function(){ if (!failed){ failed = true; worker.terminate(); todo = ORDER.filter(function(k){ return !plateURL[k] && !REAL[k]; }); viaMain(); } };
        todo.forEach(function(k){ worker.postMessage({key:k, S:S}); });
        return;
      } catch(e){ /* fall through */ }
    }
    viaMain();
  })();

  /* ---------- reveal: visible at rest, rises in when scrolled to ---------- */
  var io = (!reduce && 'IntersectionObserver' in window) ? new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.remove('rv-pre'); io.unobserve(en.target); } });
  }, {rootMargin:'0px 0px -8% 0px'}) : null;
  function prepReveal(scope){
    if (!io || !scope) return;
    scope.querySelectorAll('.rv').forEach(function(el){
      if (el.dataset.rvDone) return;
      el.dataset.rvDone = '1';
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92){ el.classList.add('rv-pre'); io.observe(el); }
    });
  }

  /* ---------- menus ---------- */
  var menu = document.getElementById('mnav'), mbtn = document.getElementById('menuBtn');
  var dds = Array.prototype.slice.call(document.querySelectorAll('.nav .dd'));
  function openMenu(){ menu.hidden = false; mbtn.setAttribute('aria-expanded','true'); document.body.classList.add('locked'); document.getElementById('menuClose').focus(); }
  function closeMenu(){ if (menu.hidden) return; menu.hidden = true; mbtn.setAttribute('aria-expanded','false'); document.body.classList.remove('locked'); }
  function closeDD(keep){ dds.forEach(function(d){ if (d === keep) return; d.querySelector('.dd-panel').hidden = true; d.querySelector('.dd-btn').setAttribute('aria-expanded','false'); }); }
  mbtn.addEventListener('click', openMenu);
  document.getElementById('menuClose').addEventListener('click', closeMenu);
  dds.forEach(function(d){ var b = d.querySelector('.dd-btn'), p = d.querySelector('.dd-panel'); b.addEventListener('click', function(){ var open = p.hidden; closeDD(d); p.hidden = !open; b.setAttribute('aria-expanded', String(open)); }); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ closeMenu(); closeDD(); } });

  /* ---------- the page we are on: WordPress serves each one at its own address ---------- */
  var siteEl = document.querySelector('.site');
  var currentRoute = siteEl.getAttribute('data-route') || '';
  document.querySelectorAll('[data-nav]').forEach(function(a){ if (a.dataset.nav === currentRoute) a.setAttribute('aria-current','page'); });
  document.querySelectorAll('.dd-btn[data-cur]').forEach(function(b){ b.classList.toggle('cur', !!currentRoute && b.dataset.cur.split(',').indexOf(currentRoute) > -1); });

  /* ---------- page change: the veil closes here and lifts on the next page ---------- */
  var veil = document.getElementById('veil'), veilName = document.getElementById('veilName');
  var veilMark = document.getElementById('veilMark'), veilRing = document.getElementById('veilRing');
  var VEIL_KEY = 'ofri-veil', veilBusy = false, canVeil = !reduce && !!veil.animate;
  function keepVeil(name){ try { sessionStorage.setItem(VEIL_KEY, name); return true; } catch(e){ return false; } }
  function dropVeil(){ try { sessionStorage.removeItem(VEIL_KEY); } catch(e){} }
  function linkName(a){
    if (a.classList.contains('post-card')) return '';
    var b = a.querySelector('b'), first = a.firstChild;
    var t = (b ? b.textContent : (first && first.nodeType === 3 ? first.textContent : a.textContent)).trim();
    return t.length > 40 ? '' : t;
  }
  function transitionTo(url, name, x, y){
    if (!keepVeil(name)){ location.href = url; return; }
    veilBusy = true;
    veilName.textContent = name;
    veil.classList.add('on');
    var W = window.innerWidth, H = window.innerHeight;
    var R = Math.ceil(Math.hypot(Math.max(x, W - x), Math.max(y, H - y))) + 20;
    var ease = 'cubic-bezier(.65,0,.35,1)', soft = 'cubic-bezier(.22,.61,.24,1)';
    veil.animate([{clipPath:'circle(0px at ' + x + 'px ' + y + 'px)'}, {clipPath:'circle(' + R + 'px at ' + x + 'px ' + y + 'px)'}], {duration:620, easing:ease, fill:'forwards'});
    veilRing.animate([{opacity:0, transform:'scale(.55)'}, {opacity:1, transform:'scale(1)'}], {duration:900, delay:160, easing:soft, fill:'forwards'});
    veilMark.animate([{opacity:0, transform:'scale(.8) rotate(-20deg)'}, {opacity:1, transform:'none'}], {duration:800, delay:200, easing:soft, fill:'forwards'});
    veilName.animate([{opacity:0, transform:'translateY(10px)'}, {opacity:1, transform:'none'}], {duration:700, delay:320, easing:soft, fill:'forwards'});
    setTimeout(function(){ location.href = url; }, 820);
  }
  function liftVeil(){
    dropVeil();
    var root = document.documentElement;
    if (!root.classList.contains('veil-in')) return;
    setTimeout(function(){
      root.classList.add('veil-lift');
      setTimeout(function(){ root.classList.remove('veil-in', 'veil-lift'); }, 950);
    }, 30);
  }
  liftVeil();
  // Coming back with the browser's back button restores this page as it was left: veil closed.
  window.addEventListener('pageshow', function(e){
    if (!e.persisted) return;
    veilBusy = false; veil.classList.remove('on');
    veil.getAnimations({subtree:true}).forEach(function(an){ an.cancel(); });
    dropVeil();
  });

  function smoothTo(id){
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
  }
  document.addEventListener('click', function(e){
    if (!e.target.closest('.dd')) closeDD();
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || /\/wp-(admin|login)/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search){
      if (!url.hash) return;
      e.preventDefault(); closeMenu(); closeDD();
      smoothTo(decodeURIComponent(url.hash.slice(1)));
      history.replaceState(null, '', url.hash);
      return;
    }
    if (!canVeil || veilBusy) return;
    e.preventDefault();
    var x = e.clientX, y = e.clientY;
    if (!x && !y){ var rc = a.getBoundingClientRect(); x = rc.left + rc.width/2; y = rc.top + rc.height/2; }
    transitionTo(url.href, linkName(a), x, y);
  });

  /* ---------- the thread: one line through the whole home page, drawn as you go ---------- */
  var home = document.querySelector('.home'), thread = document.getElementById('thread');
  var tGuide = document.getElementById('tGuide'), tLine = document.getElementById('tLine');
  var T = {len:0, samples:[], anchors:[], ok:false};
  function layoutThread(){
    T.ok = false;
    if (!home || home.hidden || !tLine.getTotalLength) return;
    var hb = home.getBoundingClientRect(), W = hb.width, H = home.offsetHeight;
    thread.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var pts = [], els = Array.prototype.slice.call(home.querySelectorAll('[data-tp]'));
    els.sort(function(a, b){ return (+a.dataset.tp) - (+b.dataset.tp); });
    els.forEach(function(el){
      var d = el.querySelector('.dot') || el, r = d.getBoundingClientRect();
      if (!r.width && !r.height && d !== el) r = el.getBoundingClientRect();
      pts.push({x:r.left + r.width/2 - hb.left, y:r.top + r.height/2 - hb.top, el:el});
    });
    if (pts.length < 2) return;
    var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    function dist(a, b){ return Math.pow(Math.hypot(b.x - a.x, b.y - a.y), 0.5) || 1e-4; }
    for (var i = 0; i < pts.length - 1; i++){
      var p0 = pts[i-1] || pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2] || pts[i+1];
      var d1 = i ? dist(p0, p1) : 0, d2 = dist(p1, p2), d3 = (i + 2 < pts.length) ? dist(p2, p3) : 0;
      var b1x, b1y, b2x, b2y;
      if (d1){ b1x = (d1*d1*p2.x - d2*d2*p0.x + (2*d1*d1 + 3*d1*d2 + d2*d2)*p1.x)/(3*d1*(d1 + d2)); b1y = (d1*d1*p2.y - d2*d2*p0.y + (2*d1*d1 + 3*d1*d2 + d2*d2)*p1.y)/(3*d1*(d1 + d2)); }
      else { b1x = p1.x + (p2.x - p1.x)/3; b1y = p1.y + (p2.y - p1.y)/3; }
      if (d3){ b2x = (d3*d3*p1.x - d2*d2*p3.x + (2*d3*d3 + 3*d3*d2 + d2*d2)*p2.x)/(3*d3*(d3 + d2)); b2y = (d3*d3*p1.y - d2*d2*p3.y + (2*d3*d3 + 3*d3*d2 + d2*d2)*p2.y)/(3*d3*(d3 + d2)); }
      else { b2x = p2.x - (p2.x - p1.x)/3; b2y = p2.y - (p2.y - p1.y)/3; }
      b1x = Math.max(6, Math.min(W - 6, b1x)); b2x = Math.max(6, Math.min(W - 6, b2x));
      d += ' C' + b1x.toFixed(1) + ' ' + b1y.toFixed(1) + ' ' + b2x.toFixed(1) + ' ' + b2y.toFixed(1) + ' ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    tGuide.setAttribute('d', d); tLine.setAttribute('d', d);
    var L = tLine.getTotalLength(); T.len = L; T.samples = [];
    for (var s = 0; s <= L; s += 14){ var q = tLine.getPointAtLength(s); T.samples.push([s, q.y, q.x]); }
    T.anchors = pts.map(function(p){
      var best = 0, bd = 1e9;
      T.samples.forEach(function(sm){ var dd = Math.abs(sm[2] - p.x) + Math.abs(sm[1] - p.y); if (dd < bd){ bd = dd; best = sm[0]; } });
      return {len:best, el:p.el};
    });
    tLine.style.strokeDasharray = L + ' ' + L;
    T.ok = true;
  }
  function drawThread(){
    if (!T.ok) return;
    var hb = home.getBoundingClientRect(), target = window.innerHeight*0.66 - hb.top, reach = 0;
    if (reduce) reach = T.len;
    else for (var i = 0; i < T.samples.length; i++){ if (T.samples[i][1] <= target) reach = T.samples[i][0]; }
    tLine.style.strokeDashoffset = String(T.len - reach);
    T.anchors.forEach(function(a){ a.el.classList.toggle('lit', reach >= a.len - 6); });
  }

  /* ---------- parallax: images drift at slightly different speeds ---------- */
  var par = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
  var small = window.matchMedia('(max-width: 700px)');
  function doParallax(){
    if (reduce) return;
    var vh = window.innerHeight, f = small.matches ? 0.5 : 1;
    par.forEach(function(el){
      if (!el.offsetParent) return;
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var off = (r.top + r.height/2 - vh/2) * (+el.dataset.speed) * f;
      el.style.setProperty('--py', (-off).toFixed(1) + 'px');
    });
  }

  /* ---------- scroll loop ---------- */
  var hdr = document.getElementById('hdr'), ticking = false;
  function onScroll(){
    hdr.classList.toggle('scrolled', window.scrollY > 10);
    if (currentRoute === 'home') drawThread();
    doParallax();
  }
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(function(){ ticking = false; onScroll(); }); } }, {passive:true});
  var rsT;
  window.addEventListener('resize', function(){ clearTimeout(rsT); rsT = setTimeout(function(){ layoutThread(); layoutCollage(); onScroll(); }, 160); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ layoutThread(); layoutCollage(); onScroll(); });
  if ('ResizeObserver' in window && home){ var lastH = 0; new ResizeObserver(function(){ if (Math.abs(home.offsetHeight - lastH) > 4){ lastH = home.offsetHeight; layoutThread(); drawThread(); } }).observe(home); }

  /* ---------- breath: the four words arrive one at a time ---------- */
  var bw = document.getElementById('breathWords');
  if (bw){
    var spans = bw.querySelectorAll('span');
    var lightWords = function(){ spans.forEach(function(s, i){ setTimeout(function(){ s.classList.add('on'); }, reduce ? 0 : i*1300); }); };
    if (reduce || !('IntersectionObserver' in window)) lightWords();
    else { var bo = new IntersectionObserver(function(en){ if (en[0].isIntersecting){ lightWords(); bo.disconnect(); } }, {threshold:0.6}); bo.observe(bw); }
  }

  /* ---------- approaches: each drawing traces itself in ---------- */
  var avs = Array.prototype.slice.call(document.querySelectorAll('.appr-vis'));
  if (reduce || !('IntersectionObserver' in window)) avs.forEach(function(v){ v.classList.add('drawn'); });
  else { var avo = new IntersectionObserver(function(en){ en.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('drawn'); avo.unobserve(e.target); } }); }, {threshold:0.4}); avs.forEach(function(v){ avo.observe(v); }); }

  /* ---------- meet: body, soul, spirit circles draw in ---------- */
  var trine = document.getElementById('trine');
  if (trine){
    if (reduce || !('IntersectionObserver' in window)) trine.classList.add('drawn');
    else { var tro = new IntersectionObserver(function(en){ if (en[0].isIntersecting){ trine.classList.add('drawn'); tro.disconnect(); } }, {threshold:0.35}); tro.observe(trine); }
  }

  /* ---------- collage: thin lines between the images ---------- */
  var collage = document.getElementById('collage');
  function centerOf(el, box){ var r = el.getBoundingClientRect(); return {x:r.left - box.left + r.width/2, y:r.top - box.top + r.height/2, r:r}; }
  function layoutCollage(){
    if (!collage || !collage.offsetParent) return;
    var box = collage.getBoundingClientRect(), svg = collage.querySelector('.collage-lines');
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    function link(id, a, b, bend){
      var A = centerOf(collage.querySelector(a), box), B = centerOf(collage.querySelector(b), box);
      var mx = (A.x + B.x)/2 + bend*(B.y - A.y)*0.3, my = (A.y + B.y)/2 - bend*(B.x - A.x)*0.3;
      var p = document.getElementById(id); p.setAttribute('d', 'M' + A.x + ' ' + A.y + ' Q' + mx + ' ' + my + ' ' + B.x + ' ' + B.y);
      var L = p.getTotalLength ? p.getTotalLength() : 1400; p.style.setProperty('--len', L);
    }
    link('cl1', '.c3', '.c4', 1); link('cl2', '.c1', '.c5', -1);
  }
  if (collage){
    if (reduce || !('IntersectionObserver' in window)) collage.classList.add('drawn');
    else { var co = new IntersectionObserver(function(en){ if (en[0].isIntersecting){ collage.classList.add('drawn'); co.disconnect(); } }, {threshold:0.25}); co.observe(collage); }
  }

  /* ---------- words: one quote at a time, changing slowly ---------- */
  var qs = Array.prototype.slice.call(document.querySelectorAll('#quotes .q')), qd = Array.prototype.slice.call(document.querySelectorAll('#qDots button'));
  var qi = 0, qPaused = false, qVisible = false;
  function showQ(i){
    qi = (i + qs.length) % qs.length;
    qs.forEach(function(q, k){ var on = k === qi; q.classList.toggle('is-on', on); if (on) q.removeAttribute('inert'); else q.setAttribute('inert', ''); });
    qd.forEach(function(b, k){ b.setAttribute('aria-current', String(k === qi)); });
  }
  qd.forEach(function(b, k){ b.addEventListener('click', function(){ showQ(k); qPaused = true; }); });
  var quotesEl = document.getElementById('quotes');
  if (quotesEl){
    quotesEl.addEventListener('mouseenter', function(){ qPaused = true; });
    quotesEl.addEventListener('mouseleave', function(){ if (!quotesEl.querySelector('details[open]')) qPaused = false; });
    quotesEl.addEventListener('focusin', function(){ qPaused = true; });
    quotesEl.addEventListener('toggle', function(){ qPaused = !!quotesEl.querySelector('details[open]'); }, true);
    if ('IntersectionObserver' in window) new IntersectionObserver(function(en){ qVisible = en[0].isIntersecting; }, {threshold:0.3}).observe(quotesEl);
    if (!reduce) setInterval(function(){ if (!qPaused && qVisible && currentRoute === 'home') showQ(qi + 1); }, 9000);
  }


  /* ---------- light motes drifting up through the opening ---------- */
  var fwa = document.getElementById('floatWa'), heroActions = document.getElementById('heroActions'), heroCTAseen = false;
  var syncFloat = function(){ if (fwa) fwa.classList.toggle('tucked', heroCTAseen && currentRoute === 'home'); };
  if (fwa && heroActions && 'IntersectionObserver' in window){
    new IntersectionObserver(function(en){ heroCTAseen = en[0].isIntersecting; syncFloat(); }).observe(heroActions);
  }
  (function(){
    var cv = document.getElementById('heroMotes'); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, motes = [], running = false, raf = 0;
    var glow = document.createElement('canvas'); glow.width = glow.height = 48;
    var gx = glow.getContext('2d'), gr = gx.createRadialGradient(24, 24, 0, 24, 24, 24);
    gr.addColorStop(0, 'rgba(255,248,228,1)'); gr.addColorStop(0.3, 'rgba(255,232,190,.55)'); gr.addColorStop(1, 'rgba(255,232,190,0)');
    gx.fillStyle = gr; gx.fillRect(0, 0, 48, 48);
    function size(){ W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.max(1, Math.round(W*dpr)); cv.height = Math.max(1, Math.round(H*dpr)); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function seed(){ var n = W < 700 ? 20 : 38; motes = []; for (var i = 0; i < n; i++) motes.push({x:Math.random()*W, y:Math.random()*H, r:1.2 + Math.random()*2.8, vy:-(0.06 + Math.random()*0.18), ph:Math.random()*6.28, sw:0.3 + Math.random()*0.7, a:0.3 + Math.random()*0.55}); }
    function draw(t){
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < motes.length; i++){ var m = motes[i], tw = 0.55 + 0.45*Math.sin(t/1700 + m.ph), s = m.r*7; ctx.globalAlpha = m.a*tw; ctx.drawImage(glow, m.x - s/2 + Math.sin(t/3200 + m.ph)*m.sw*14, m.y - s/2, s, s); }
      ctx.globalAlpha = 1;
    }
    function step(t){ for (var i = 0; i < motes.length; i++){ var m = motes[i]; m.y += m.vy; if (m.y < -24){ m.y = H + 24; m.x = Math.random()*W; } } draw(t); raf = requestAnimationFrame(step); }
    function start(){ if (running || reduce) return; running = true; raf = requestAnimationFrame(step); }
    function stop(){ running = false; cancelAnimationFrame(raf); }
    size(); seed(); draw(0);
    if (!reduce && 'IntersectionObserver' in window) new IntersectionObserver(function(en){ if (en[0].isIntersecting) start(); else stop(); }).observe(cv);
    window.addEventListener('resize', function(){ size(); seed(); draw(0); });
  })();

  /* ---------- copy phone (contact page) ---------- */
  var copyBtn = document.getElementById('copyPhone');
  if (copyBtn){
    copyBtn.addEventListener('click', function(){
      var label = 'העתקת המספר';
      function done(){ copyBtn.textContent = 'המספר הועתק'; setTimeout(function(){ copyBtn.textContent = label; }, 2200); }
      function selectIt(){ var r = document.createRange(); r.selectNodeContents(document.getElementById('phoneText')); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
      if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText('050-7681816').then(done, selectIt); } else { selectIt(); }
    });
  }

  prepReveal(document.querySelector('[data-page]'));
  prepReveal(document.getElementById('closing'));
  layoutThread();
  layoutCollage();
  onScroll();
  syncFloat();
})();
