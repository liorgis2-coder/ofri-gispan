/* Generated "photographs": warm light, water, field, sand, haze, linen.
   One painter, run in a worker when OffscreenCanvas exists, otherwise on the main thread at idle.
   Every plate shares the same grade (warm soft-light, vignette, lifted blacks, grain) so they read as one set. */
function PlatePainter(mk){
  'use strict';
  var TAU = Math.PI*2;
  function rng(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
  function gauss(r){ var u = 1 - r(), v = r(); return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v); }
  function X(c){ return c.getContext('2d'); }

  var hasFilter = false && (function(){
    try {
      var t = mk(9, 9), x = X(t); x.filter = 'blur(2px)';
      if (x.filter !== 'blur(2px)') return false;
      x.fillStyle = '#000'; x.fillRect(4, 4, 1, 1);
      return x.getImageData(1, 4, 1, 1).data[3] > 0;
    } catch(e){ return false; }
  })();

  function blur(src, px){
    var w = src.width, h = src.height;
    if (px < 0.6) return src;
    if (hasFilter){ var o = mk(w, h), ox = X(o); ox.filter = 'blur(' + px + 'px)'; ox.drawImage(src, 0, 0); ox.filter = 'none'; return o; }
    var f = Math.max(1.2, px/1.1), sw = Math.max(2, Math.round(w/f)), sh = Math.max(2, Math.round(h/f)), cur = src, cw = w, ch = h, t, tx;
    while (cw/2 >= sw){ t = mk(Math.max(2, Math.round(cw/2)), Math.max(2, Math.round(ch/2))); tx = X(t); tx.imageSmoothingQuality = 'high'; tx.drawImage(cur, 0, 0, t.width, t.height); cur = t; cw = t.width; ch = t.height; }
    t = mk(sw, sh); tx = X(t); tx.imageSmoothingQuality = 'high'; tx.drawImage(cur, 0, 0, sw, sh); cur = t; cw = sw; ch = sh;
    while (cw*2 < w){ t = mk(cw*2, ch*2); tx = X(t); tx.imageSmoothingQuality = 'high'; tx.drawImage(cur, 0, 0, t.width, t.height); cur = t; cw = t.width; ch = t.height; }
    var out = mk(w, h), o2 = X(out); o2.imageSmoothingQuality = 'high'; o2.drawImage(cur, 0, 0, w, h); return out;
  }
  var grainC = null;
  function grainTile(){
    if (grainC) return grainC;
    grainC = mk(180, 180); var x = X(grainC), d = x.createImageData(180, 180), r = rng(5);
    for (var i = 0; i < d.data.length; i += 4){ var v = 128 + (r() - 0.5)*120; d.data[i] = d.data[i+1] = d.data[i+2] = v; d.data[i+3] = 255; }
    x.putImageData(d, 0, 0); return grainC;
  }
  function grade(c, o){
    o = o || {}; var x = X(c), W = c.width, H = c.height;
    x.globalCompositeOperation = 'soft-light'; x.fillStyle = 'rgba(206,150,84,' + (o.warm == null ? 0.34 : o.warm) + ')'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'multiply';
    var g = x.createRadialGradient(W*0.5, H*0.45, Math.min(W,H)*0.3, W*0.5, H*0.5, Math.max(W,H)*0.78);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(126,96,66,' + (o.vig == null ? 0.3 : o.vig) + ')');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'screen'; x.fillStyle = 'rgba(64,48,32,0.07)'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'overlay'; x.globalAlpha = o.grain == null ? 0.12 : o.grain;
    x.fillStyle = x.createPattern(grainTile(), 'repeat'); x.fillRect(0, 0, W, H);
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    return c;
  }
  function lens(x, x0, y0, ang, L, Wd, bend){
    var c = Math.cos(ang), s = Math.sin(ang), n = 10, i, t, px, py, pts = [];
    for (i = 0; i <= n; i++){ t = i/n; px = t*L; py = -Wd*Math.pow(Math.sin(Math.PI*t), 0.8) + bend*L*Math.sin(Math.PI*t); pts.push([px, py]); }
    for (i = n - 1; i > 0; i--){ t = i/n; px = t*L; py = Wd*Math.pow(Math.sin(Math.PI*t), 0.8) + bend*L*Math.sin(Math.PI*t); pts.push([px, py]); }
    x.beginPath();
    pts.forEach(function(p, k){ var X1 = x0 + p[0]*c - p[1]*s, Y1 = y0 + p[0]*s + p[1]*c; if (k) x.lineTo(X1, Y1); else x.moveTo(X1, Y1); });
    x.closePath(); x.fill();
  }
  function palm(x, bx, by, ang, L, r){
    var bend = 0.35, pts = [], i, n = 60;
    for (i = 0; i <= n; i++){ var t = i/n, a = ang + bend*t*t; pts.push([bx + Math.cos(ang)*L*t + Math.cos(a)*0, by + Math.sin(ang)*L*t + L*0.18*t*t]); }
    x.lineWidth = L*0.012; x.lineCap = 'round'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); pts.forEach(function(p){ x.lineTo(p[0], p[1]); }); x.stroke();
    for (i = 3; i < n; i++){
      var p = pts[i], q = pts[i-1], ta = Math.atan2(p[1]-q[1], p[0]-q[0]), tt = i/n, len = L*0.3*(1 - 0.55*tt)*(0.85 + r()*0.3);
      for (var sd = -1; sd <= 1; sd += 2){ lens(x, p[0], p[1], ta + sd*(0.95 - 0.35*tt) + 0.25*tt, len, len*0.045, sd*0.05); }
    }
  }
  function olive(x, bx, by, ang, L, r){
    var i, n = 16;
    x.lineWidth = L*0.01; x.lineCap = 'round';
    x.beginPath(); x.moveTo(bx, by);
    var ex = bx + Math.cos(ang)*L, ey = by + Math.sin(ang)*L, mx = (bx + ex)/2 + Math.sin(ang)*L*0.12, my = (by + ey)/2 - Math.cos(ang)*L*0.12;
    x.quadraticCurveTo(mx, my, ex, ey); x.stroke();
    for (i = 1; i <= n; i++){
      var t = i/(n + 1), px = (1-t)*(1-t)*bx + 2*(1-t)*t*mx + t*t*ex, py = (1-t)*(1-t)*by + 2*(1-t)*t*my + t*t*ey;
      var side = i % 2 ? 1 : -1, la = ang + side*(0.7 + r()*0.3), ll = L*0.2*(1 - 0.3*t)*(0.85 + r()*0.3);
      lens(x, px, py, la, ll, ll*0.16, side*0.04);
    }
  }
  function blade(x, x0, y0, h, lean, w){
    x.beginPath(); x.moveTo(x0 - w, y0);
    x.quadraticCurveTo(x0 - w*0.4 + lean*0.4, y0 - h*0.55, x0 + lean, y0 - h);
    x.quadraticCurveTo(x0 + w*0.4 + lean*0.4, y0 - h*0.55, x0 + w, y0);
    x.closePath(); x.fill();
  }

  var P = {};

  /* sun through a window onto a plaster wall, palm and olive shadows */
  P.window = function(S, seed){
    var r = rng(seed || 11), W = S, H = S, c = mk(W, H), x = X(c), i;
    var g = x.createLinearGradient(0, 0, W*0.5, H); g.addColorStop(0, '#D6BF9E'); g.addColorStop(1, '#BA9E78');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    var m = mk(W, H), mx = X(m);
    for (i = 0; i < 70; i++){ mx.fillStyle = r() < 0.5 ? 'rgba(255,246,228,0.12)' : 'rgba(110,82,54,0.09)'; mx.beginPath(); mx.ellipse(r()*W, r()*H, W*(0.04 + r()*0.12), H*(0.03 + r()*0.1), r()*TAU, 0, TAU); mx.fill(); }
    x.drawImage(blur(m, W/28), 0, 0);
    var L = mk(W, H), lx = X(L);
    lx.fillStyle = '#fff'; lx.beginPath();
    lx.moveTo(W*0.16, -H*0.06); lx.lineTo(W*1.08, H*0.1); lx.lineTo(W*0.94, H*1.08); lx.lineTo(-W*0.04, H*0.88); lx.closePath(); lx.fill();
    lx.globalCompositeOperation = 'destination-out'; lx.strokeStyle = '#000'; lx.fillStyle = '#000';
    lx.lineWidth = W*0.034; lx.beginPath(); lx.moveTo(W*0.62, -H*0.06); lx.lineTo(W*0.5, H*1.08); lx.stroke();
    lx.lineWidth = W*0.028; lx.beginPath(); lx.moveTo(-W*0.04, H*0.44); lx.lineTo(W*1.08, H*0.6); lx.stroke();
    palm(lx, W*1.05, H*0.02, 2.35, W*0.95, r);
    olive(lx, -W*0.02, H*0.78, -0.55, W*0.55, r);
    x.globalCompositeOperation = 'source-over';
    var Lb = blur(L, W/120);
    var C = mk(W, H), cx = X(C); cx.fillStyle = '#FFE8C0'; cx.fillRect(0, 0, W, H); cx.globalCompositeOperation = 'destination-in'; cx.drawImage(Lb, 0, 0);
    x.globalCompositeOperation = 'screen'; x.globalAlpha = 0.86; x.drawImage(C, 0, 0);
    x.globalAlpha = 0.4; x.drawImage(blur(C, W/28), 0, 0);
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    return grade(c, {warm:0.3, vig:0.32});
  };

  /* late sun on water: glints, ripples, haze */
  P.water = function(S, seed){
    var r = rng(seed || 23), W = S, H = S, c = mk(W, H), x = X(c), i;
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#B3A27E'); g.addColorStop(0.45, '#877C62'); g.addColorStop(1, '#5B5646');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    var R = mk(W, H), rx = X(R);
    for (i = 0; i < 170; i++){ var y = r()*H; rx.fillStyle = r() < 0.5 ? 'rgba(40,34,26,0.14)' : 'rgba(255,236,200,0.08)'; rx.beginPath(); rx.ellipse(r()*W, y, W*(0.1 + r()*0.4), 1.5 + r()*5*(0.4 + y/H), 0, 0, TAU); rx.fill(); }
    x.drawImage(blur(R, W/300), 0, 0);
    var G = mk(W, H), gx = X(G), sx = W*0.62;
    gx.fillStyle = '#FFF2D4';
    for (i = 0; i < 1500; i++){
      var yy = H*(0.04 + 0.96*Math.pow(r(), 1.25)), spread = W*(0.08 + 0.3*yy/H), px = sx + gauss(r)*spread;
      var near = Math.exp(-Math.pow((px - sx)/(W*0.32), 2));
      gx.globalAlpha = Math.min(1, (0.15 + 0.7*r())*near);
      gx.beginPath(); gx.ellipse(px, yy, W*(0.004 + 0.03*r())*(0.4 + yy/H), 0.6 + 2.6*r()*(0.3 + yy/H), 0, 0, TAU); gx.fill();
    }
    gx.globalAlpha = 1;
    x.globalCompositeOperation = 'screen'; x.drawImage(blur(G, 0.8), 0, 0);
    x.globalAlpha = 0.65; x.drawImage(blur(G, W/70), 0, 0); x.globalAlpha = 1;
    var hz = x.createRadialGradient(sx, -H*0.1, 0, sx, -H*0.1, H*0.8); hz.addColorStop(0, 'rgba(255,236,200,0.55)'); hz.addColorStop(1, 'rgba(255,236,200,0)');
    x.fillStyle = hz; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'source-over';
    return grade(c, {warm:0.36, vig:0.34});
  };

  /* golden hour meadow, backlit grasses and bokeh */
  P.field = function(S, seed){
    var r = rng(seed || 37), W = S, H = S, c = mk(W, H), x = X(c), i, L;
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E7D2B0'); g.addColorStop(0.55, '#F1DDBA'); g.addColorStop(1, '#D9BE92');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'screen';
    var sg = x.createRadialGradient(W*0.68, H*0.36, 0, W*0.68, H*0.36, W*0.55); sg.addColorStop(0, 'rgba(255,248,226,1)'); sg.addColorStop(0.2, 'rgba(255,238,200,0.7)'); sg.addColorStop(1, 'rgba(255,230,190,0)');
    x.fillStyle = sg; x.fillRect(0, 0, W, H);
    var B = mk(W, H), bx = X(B);
    for (i = 0; i < 40; i++){ var br = W*(0.012 + r()*0.045); bx.fillStyle = 'rgba(255,242,214,' + (0.12 + r()*0.18) + ')'; bx.beginPath(); bx.arc(r()*W, H*(0.15 + r()*0.6), br, 0, TAU); bx.fill(); }
    x.drawImage(blur(B, 2.5), 0, 0);
    x.globalCompositeOperation = 'source-over';
    var layers = [
      {n:260, col:'rgba(150,136,98,0.42)', h:[0.12, 0.3], w:[1.5, 3], b:W/110},
      {n:200, col:'rgba(106,96,66,0.72)', h:[0.2, 0.46], w:[2, 4.5], b:W/320},
      {n:95,  col:'rgba(58,51,36,0.93)', h:[0.3, 0.64], w:[2.5, 6], b:1.1}
    ];
    layers.forEach(function(ly, k){
      L = mk(W, H); var lx = X(L); lx.fillStyle = ly.col;
      for (var j = 0; j < ly.n; j++){
        var x0 = r()*W*1.1 - W*0.05, h = H*(ly.h[0] + r()*(ly.h[1] - ly.h[0])), lean = (r() - 0.35)*h*0.35, w = (ly.w[0] + r()*(ly.w[1] - ly.w[0]))*S/1000;
        blade(lx, x0, H + 6, h, lean, w);
        if (k > 0 && r() < 0.12){ lx.save(); lx.fillStyle = k === 2 ? 'rgba(92,80,56,0.85)' : 'rgba(150,132,96,0.7)'; lx.beginPath(); lx.ellipse(x0 + lean, H + 6 - h - w*3, w*1.1, w*4.2, Math.atan2(lean, h)*0.9, 0, TAU); lx.fill(); lx.restore(); }
        if (k === 1 && r() < 0.1){ lx.save(); lx.fillStyle = 'rgba(240,226,196,0.85)'; lx.beginPath(); lx.arc(x0 + lean*0.9, H + 6 - h*0.92, w*2.4, 0, TAU); lx.fill(); lx.restore(); }
      }
      x.drawImage(blur(L, ly.b), 0, 0);
    });
    x.globalCompositeOperation = 'screen'; x.globalAlpha = 0.35;
    var rim = x.createRadialGradient(W*0.68, H*0.6, 0, W*0.68, H*0.6, W*0.45); rim.addColorStop(0, 'rgba(255,230,180,0.9)'); rim.addColorStop(1, 'rgba(255,230,180,0)');
    x.fillStyle = rim; x.fillRect(0, 0, W, H); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    return grade(c, {warm:0.34, vig:0.3});
  };

  /* wind ripples in sand, raking light */
  P.sand = function(S, seed){
    var r = rng(seed || 41), W = S, H = S, c = mk(W, H), x = X(c), k;
    var g = x.createLinearGradient(0, 0, W*0.6, H); g.addColorStop(0, '#E6D0AA'); g.addColorStop(1, '#C6A579');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    function ripples(near){
      var R = mk(W, H), rx = X(R), y = -H*0.02, k2 = 0;
      rx.lineCap = 'round';
      while (y < H*1.05){
        var depth = Math.max(0.15, y/H), A = H*0.012*depth*(0.6 + r()*0.9), f = TAU/W*(0.9 + r()*0.9), ph = r()*TAU, ph2 = r()*TAU;
        var x0 = -20 + (r() < 0.35 ? r()*W*0.5 : 0), x1 = W + 20 - (r() < 0.35 ? r()*W*0.5 : 0), pts = [];
        for (var xx = x0; xx <= x1; xx += 8) pts.push([xx, y + A*Math.sin(xx*f + ph) + A*0.45*Math.sin(xx*f*2.2 + ph2) + (xx/W)*H*0.06]);
        var lw = H*0.011*depth;
        rx.strokeStyle = 'rgba(110,80,48,' + (0.2 + 0.18*depth) + ')'; rx.lineWidth = lw; rx.beginPath(); pts.forEach(function(p, i){ if (i) rx.lineTo(p[0], p[1] + lw*0.5); else rx.moveTo(p[0], p[1] + lw*0.5); }); rx.stroke();
        rx.strokeStyle = 'rgba(255,242,216,' + (0.3 + 0.25*depth) + ')'; rx.lineWidth = lw*0.45; rx.beginPath(); pts.forEach(function(p, i){ if (i) rx.lineTo(p[0], p[1]); else rx.moveTo(p[0], p[1]); }); rx.stroke();
        y += H*(0.012 + 0.05*depth)*(0.75 + r()*0.5); k2++;
      }
      return R;
    }
    var R = ripples();
    var far = blur(R, W/90), near = blur(R, W/500);
    var M = mk(W, H), mx = X(M), mg = mx.createLinearGradient(0, 0, 0, H); mg.addColorStop(0, 'rgba(0,0,0,0)'); mg.addColorStop(0.55, 'rgba(0,0,0,1)'); mx.fillStyle = mg; mx.fillRect(0, 0, W, H);
    mx.globalCompositeOperation = 'source-in'; mx.drawImage(near, 0, 0);
    x.drawImage(far, 0, 0); x.drawImage(M, 0, 0);
    x.globalCompositeOperation = 'multiply';
    var sh = x.createLinearGradient(0, 0, W, H); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(150,115,80,0.32)');
    x.fillStyle = sh; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'screen';
    var lt = x.createRadialGradient(W*0.2, 0, 0, W*0.2, 0, W*0.9); lt.addColorStop(0, 'rgba(255,238,205,0.45)'); lt.addColorStop(1, 'rgba(255,238,205,0)');
    x.fillStyle = lt; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over';
    return grade(c, {warm:0.3, vig:0.3, grain:0.14});
  };

  /* soft sun haze */
  P.haze = function(S, seed){
    var r = rng(seed || 53), W = S, H = S, c = mk(W, H), x = X(c), i;
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#EFDCBC'); g.addColorStop(0.6, '#E6CBA0'); g.addColorStop(1, '#D8B98C');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'screen';
    for (i = 0; i < 6; i++){ var cx = W*(0.2 + r()*0.6), cy = H*(0.15 + r()*0.6), rr = W*(0.25 + r()*0.35), gg = x.createRadialGradient(cx, cy, 0, cx, cy, rr); gg.addColorStop(0, 'rgba(255,244,222,' + (0.35 + r()*0.3) + ')'); gg.addColorStop(1, 'rgba(255,244,222,0)'); x.fillStyle = gg; x.fillRect(0, 0, W, H); }
    var lk = x.createLinearGradient(0, H*0.1, W, H*0.7); lk.addColorStop(0.3, 'rgba(255,214,160,0)'); lk.addColorStop(0.5, 'rgba(255,214,160,0.3)'); lk.addColorStop(0.7, 'rgba(255,214,160,0)');
    x.fillStyle = lk; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'source-over';
    var B = mk(W, H), bx = X(B);
    for (i = 0; i < 8; i++){ bx.fillStyle = 'rgba(170,130,90,0.08)'; bx.beginPath(); bx.ellipse(W*r(), H*(0.55 + r()*0.45), W*(0.3 + r()*0.4), H*(0.03 + r()*0.05), 0, 0, TAU); bx.fill(); }
    x.drawImage(blur(B, W/40), 0, 0);
    return grade(c, {warm:0.26, vig:0.22, grain:0.1});
  };

  /* linen folds in window light */
  P.linen = function(S, seed){
    var r = rng(seed || 67), W = S, H = S, c = mk(W, H), x = X(c), i;
    x.fillStyle = '#E6DAC5'; x.fillRect(0, 0, W, H);
    var F = mk(W, H), fx = X(F);
    fx.translate(W/2, H/2); fx.rotate(-0.42);
    for (i = 0; i < 16; i++){ var y = -H*0.9 + i*H*0.12 + gauss(r)*H*0.02, hh = H*(0.03 + r()*0.08); fx.fillStyle = i % 2 ? 'rgba(255,250,240,0.55)' : 'rgba(140,112,82,0.32)'; fx.fillRect(-W, y, W*2, hh); }
    fx.setTransform(1, 0, 0, 1, 0, 0);
    x.drawImage(blur(F, W/34), 0, 0);
    var T = mk(W, H), tx = X(T), step = Math.max(2, Math.round(S/340));
    tx.strokeStyle = 'rgba(90,70,50,0.07)'; tx.lineWidth = 1;
    for (i = 0; i < H; i += step){ tx.beginPath(); tx.moveTo(0, i + r()); tx.lineTo(W, i + r()); tx.stroke(); }
    tx.strokeStyle = 'rgba(255,250,240,0.08)';
    for (i = 0; i < W; i += step){ tx.beginPath(); tx.moveTo(i + r(), 0); tx.lineTo(i + r(), H); tx.stroke(); }
    x.drawImage(T, 0, 0);
    x.globalCompositeOperation = 'screen';
    var lg = x.createRadialGradient(W*0.25, H*0.2, 0, W*0.25, H*0.2, W*0.8); lg.addColorStop(0, 'rgba(255,238,205,0.5)'); lg.addColorStop(1, 'rgba(255,238,205,0)');
    x.fillStyle = lg; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over';
    return grade(c, {warm:0.28, vig:0.3, grain:0.1});
  };

  return {plates:P, hasFilter:hasFilter};
}
