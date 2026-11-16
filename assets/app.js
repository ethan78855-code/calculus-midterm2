/* 微積分期中考二 衝刺講義 — 共用程式
   內容頁只要寫 <main class="page">，這支程式負責：
   目錄與進度、互動圖表、符號圖、逐步解答、小測驗、數學式排版。 */
(function () {
  'use strict';

  /* ================= 1. 站台資料 ================= */
  // 2026-11-19（月份從 0 起算）。知道開考時間後填 hh、mm，並把 timed 改成 true；
  // timed 是 false 時只知道日期，倒數到當天 0:00。
  var EXAM = { y: 2026, m: 10, d: 19, hh: 0, mm: 0, timed: false };
  var LS_KEY = 'calc-mid2-v1';

  var PAGES = [
    { id: 'index', file: 'index.html', num: '', title: '首頁 · 讀書計畫' },
    { id: 'basics', file: 'basics.html', num: '0', title: '暖身：微分從零開始', group: '暖身（沒讀過先看這裡）', study: true },
    { id: 's34', file: 's34.html', num: '3.4', title: '邊際函數與需求彈性', group: '第 3 章　微分', study: true, probs: [13, 15, 37] },
    { id: 's35', file: 's35.html', num: '3.5', title: '高階導數', study: true, probs: [28] },
    { id: 's36', file: 's36.html', num: '3.6', title: '隱函數微分與相關變率', study: true, probs: [19, 23, 44] },
    { id: 's41', file: 's41.html', num: '4.1', title: '一階導數：遞增遞減與相對極值', group: '第 4 章　導數的應用', study: true, probs: [34, 35, 71, 84, 89] },
    { id: 's42', file: 's42.html', num: '4.2', title: '二階導數：凹性與反曲點', study: true, probs: [65, 70, 88, 96, 100] },
    { id: 's43', file: 's43.html', num: '4.3', title: '曲線描繪與漸近線', study: true, probs: [55, 56, 60] },
    { id: 's44', file: 's44.html', num: '4.4', title: '最佳化 I：絕對極值', study: true },
    { id: 's45', file: 's45.html', num: '4.5', title: '最佳化 II：應用題', study: true, probs: [4, 9, 18, 20, 21, 26, 29, 30] },
    { id: 's51', file: 's51.html', num: '5.1–5.2', title: '指數函數與對數函數', group: '第 5 章　指數與對數', study: true },
    { id: 's53', file: 's53.html', num: '5.3', title: '複利', study: true },
    { id: 's54', file: 's54.html', num: '5.4–5.5', title: '指數與對數的微分', study: true },
    { id: 's56', file: 's56.html', num: '5.6', title: '指數模型：成長、衰退、學習曲線', study: true, probs: [15, 16, 19, 22, 23, 24] },
    { id: 'formulas', file: 'formulas.html', num: '', title: '公式總表與考前檢查', group: '考前' }
  ];

  var pageId = document.body.getAttribute('data-page') || 'index';
  var curIndex = Math.max(0, PAGES.findIndex(function (p) { return p.id === pageId; }));
  var cur = PAGES[curIndex];

  function loadState() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_KEY));
      if (s && typeof s === 'object') return { pages: s.pages || {}, probs: s.probs || {} };
    } catch (e) { /* 無痕模式等情況：進度只留在本次瀏覽 */ }
    return { pages: {}, probs: {} };
  }
  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* 同上 */ }
  }
  var state = loadState();

  function allProbs() {
    var out = [];
    PAGES.forEach(function (p) {
      (p.probs || []).forEach(function (n) { out.push({ id: p.num + '-' + n, sec: p.num, n: n, page: p }); });
    });
    return out;
  }

  function mk(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  /* ================= 2. 頂列、目錄、頁尾 ================= */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  // 回傳 { label, time, live }：live 表示還在倒數，需要每秒更新
  function countdownParts(now) {
    var start = new Date(EXAM.y, EXAM.m, EXAM.d, EXAM.timed ? EXAM.hh : 0, EXAM.timed ? EXAM.mm : 0, 0);
    var dayEnd = new Date(EXAM.y, EXAM.m, EXAM.d + 1);
    var ms = start - now;
    if (ms > 0) {
      var s = Math.ceil(ms / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      return {
        label: EXAM.timed ? '距離考試' : '距離考試日',
        time: (d > 0 ? d + ' 天 ' : '') + pad2(h) + ':' + pad2(m) + ':' + pad2(s),
        live: true
      };
    }
    if (now < dayEnd) return { label: '', time: EXAM.timed ? '考試已開始' : '今天考試', live: false };
    return { label: '', time: '考試已結束', live: false };
  }
  function startCountdown(el) {
    var labelEl = el.querySelector('.cd-label');
    var timeEl = el.querySelector('.cd-time');
    var timer = null;
    function tick() {
      clearTimeout(timer);
      var now = new Date();
      var p = countdownParts(now);
      if (labelEl.textContent !== p.label) labelEl.textContent = p.label;
      el.classList.toggle('is-over', !p.live);
      if (timeEl.textContent !== p.time) timeEl.textContent = p.time;
      el.setAttribute('aria-label', (p.label ? p.label + ' ' : '') + p.time);
      // 對齊到下一個整秒；倒數結束後改成每分鐘檢查一次（今天考試 → 考試已結束）
      timer = setTimeout(tick, p.live ? 1000 - (now.getTime() % 1000) + 20 : 60000);
    }
    tick();
    // 分頁切回來時立刻更新（背景分頁的計時器會被瀏覽器放慢）
    document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
  }

  function buildChrome() {
    document.body.classList.add('has-side');

    var top = mk('header', 'topbar');
    top.innerHTML =
      '<button type="button" class="menu-btn" aria-controls="sidebar" aria-expanded="false"><span class="menu-ico" aria-hidden="true"></span>目錄</button>' +
      '<a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">f′</span><span>微積分期中考二<small>衝刺講義</small></span></a>' +
      '<span class="top-spacer"></span>' +
      '<a class="top-link" href="formulas.html">公式總表</a>' +
      '<span class="countdown" role="timer"><span class="cd-label"></span><span class="cd-short">倒數</span><span class="cd-time"></span></span>';

    var side = mk('nav', 'sidebar');
    side.id = 'sidebar';
    side.setAttribute('aria-label', '章節目錄');
    var html = '<div class="side-head"><p class="side-title">章節目錄</p><p class="side-prog" id="sideProg"></p><div class="side-bar"><i id="sideBar"></i></div></div><ul class="side-list">';
    PAGES.forEach(function (p) {
      if (p.group) html += '<li class="side-group">' + esc(p.group) + '</li>';
      html += '<li><a class="side-link' + (p.id === pageId ? ' is-current' : '') + '" data-id="' + p.id + '" href="' + p.file + '"' +
        (p.id === pageId ? ' aria-current="page"' : '') + '><span class="num">' + esc(p.num) + '</span><span class="ttl">' + esc(p.title) +
        '</span><span class="tick" aria-hidden="true">✓</span></a></li>';
    });
    html += '</ul>';
    side.innerHTML = html;

    var scrim = mk('div', 'scrim');
    scrim.hidden = true;

    document.body.prepend(scrim);
    document.body.prepend(side);
    document.body.prepend(top);
    startCountdown(top.querySelector('.countdown'));

    var menuBtn = top.querySelector('.menu-btn');
    function setNav(open) {
      document.body.classList.toggle('nav-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      scrim.hidden = !open;
    }
    menuBtn.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    scrim.addEventListener('click', function () { setNav(false); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') setNav(false); });
    side.addEventListener('click', function (ev) { if (ev.target.closest('a')) setNav(false); });
  }

  function refreshProgress() {
    var studyPages = PAGES.filter(function (p) { return p.study; });
    var doneP = studyPages.filter(function (p) { return state.pages[p.id]; }).length;
    var probs = allProbs();
    var doneQ = probs.filter(function (q) { return state.probs[q.id]; }).length;

    document.querySelectorAll('.side-link').forEach(function (a) {
      a.classList.toggle('is-done', !!state.pages[a.getAttribute('data-id')]);
    });
    var sp = document.getElementById('sideProg');
    if (sp) sp.textContent = '讀完 ' + doneP + ' / ' + studyPages.length + ' 節　·　指定題 ' + doneQ + ' / ' + probs.length;
    var sb = document.getElementById('sideBar');
    if (sb) sb.style.width = Math.round(((doneP + doneQ) / (studyPages.length + probs.length)) * 100) + '%';

    document.querySelectorAll('.sec-card[data-id]').forEach(function (c) {
      var done = !!state.pages[c.getAttribute('data-id')];
      c.classList.toggle('is-done', done);
      var meta = c.querySelector('.meta');
      if (meta) meta.textContent = (done ? '✓ 已讀完' : '還沒讀') + (c.getAttribute('data-probs') ? '　·　' + c.getAttribute('data-probs') : '');
    });
    document.querySelectorAll('.chip[data-prob]').forEach(function (c) {
      var done = !!state.probs[c.getAttribute('data-prob')];
      c.classList.toggle('is-done', done);
      c.setAttribute('aria-label', '第 ' + c.getAttribute('data-prob').replace('-', ' 節第 ') + ' 題' + (done ? '（已標記會了）' : ''));
    });
    var hp = document.getElementById('homeProg');
    if (hp) hp.textContent = '目前進度：讀完 ' + doneP + ' / ' + studyPages.length + ' 節，指定題會了 ' + doneQ + ' / ' + probs.length + ' 題。';
  }

  function buildPageEnd() {
    var main = document.querySelector('main.page');
    if (!main) return;
    var end = mk('div', 'page-end');
    if (cur.study) {
      var btn = mk('button', 'btn done-btn');
      btn.type = 'button';
      var paint = function () {
        var done = !!state.pages[cur.id];
        btn.setAttribute('aria-pressed', done ? 'true' : 'false');
        btn.textContent = done ? '✓ 這一節讀完了（再按一次取消）' : '標記：這一節我讀完了';
      };
      btn.addEventListener('click', function () {
        state.pages[cur.id] = !state.pages[cur.id];
        saveState(); paint(); refreshProgress();
      });
      paint();
      end.appendChild(btn);
    }
    var pager = mk('div', 'pager');
    var prev = PAGES[curIndex - 1], next = PAGES[curIndex + 1];
    if (prev) pager.innerHTML += '<a class="prev" href="' + prev.file + '"><small>← 上一頁</small>' + esc((prev.num ? prev.num + '　' : '') + prev.title) + '</a>';
    if (next) pager.innerHTML += '<a class="next" href="' + next.file + '"><small>下一頁 →</small>' + esc((next.num ? next.num + '　' : '') + next.title) + '</a>';
    end.appendChild(pager);
    end.appendChild(mk('p', 'site-note', '自製的考前複習筆記。題號對應課本 Tan《Applied Calculus》第 10 版的習題，題目敘述已用中文重新整理；若與老師公布的範圍有出入，以老師為準。'));
    main.appendChild(end);
  }

  function buildToc() {
    var main = document.querySelector('main.page');
    if (!main) return;
    var hs = Array.prototype.slice.call(main.querySelectorAll('h2'));
    hs.forEach(function (h, i) {
      if (!h.id) h.id = 'sec-' + (i + 1);
      if (!h.querySelector('.hl')) h.innerHTML = '<span class="hl">' + h.innerHTML + '</span>';
    });
    var slot = main.querySelector('[data-toc]');
    if (!slot || hs.length < 2) return;
    var ul = mk('ul', 'toc');
    hs.forEach(function (h) {
      var li = mk('li');
      var a = mk('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      ul.appendChild(li);
    });
    slot.replaceWith(ul);
  }

  /* ================= 3. 算式解析器 =================
     支援：數字、x（或 t）、滑桿變數 a、+ - * / ^、括號、
     sqrt cbrt exp ln log abs sin cos tan min max、常數 e pi。
     注意 -x^2 會算成 -(x^2)，跟數學習慣一致。 */
  var FUNCS = {
    sqrt: Math.sqrt, cbrt: Math.cbrt, exp: Math.exp, ln: Math.log, log: Math.log10,
    abs: Math.abs, sin: Math.sin, cos: Math.cos, tan: Math.tan, min: Math.min, max: Math.max,
    floor: Math.floor, sign: Math.sign
  };
  var CONSTS = { pi: Math.PI, e: Math.E };
  var exprCache = {};

  function compile(src) {
    if (typeof src === 'number') return function () { return src; };
    var key = String(src);
    if (exprCache[key]) return exprCache[key];
    var s = key.replace(/\s+/g, '').replace(/−/g, '-');
    var i = 0;

    function fail(msg) { throw new Error(msg + '（位置 ' + i + '）'); }

    function parseExpr() {
      var l = parseTerm();
      while (s[i] === '+' || s[i] === '-') {
        var op = s[i++];
        l = (function (a, b, plus) {
          return plus ? function (v) { return a(v) + b(v); } : function (v) { return a(v) - b(v); };
        })(l, parseTerm(), op === '+');
      }
      return l;
    }
    function parseTerm() {
      var l = parseUnary();
      while (s[i] === '*' || s[i] === '/') {
        var op = s[i++];
        l = (function (a, b, mul) {
          return mul ? function (v) { return a(v) * b(v); } : function (v) { return a(v) / b(v); };
        })(l, parseUnary(), op === '*');
      }
      return l;
    }
    function parseUnary() {
      if (s[i] === '-') { i++; var u = parseUnary(); return function (v) { return -u(v); }; }
      if (s[i] === '+') { i++; return parseUnary(); }
      return parsePower();
    }
    function parsePower() {
      var base = parseAtom();
      if (s[i] === '^') {
        i++;
        var ex = parseUnary();
        return function (v) { return Math.pow(base(v), ex(v)); };
      }
      return base;
    }
    function parseAtom() {
      var m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (m) { i += m[0].length; var n = parseFloat(m[0]); return function () { return n; }; }
      if (s[i] === '(') {
        i++;
        var inner = parseExpr();
        if (s[i] !== ')') fail('少了右括號');
        i++;
        return inner;
      }
      m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(s.slice(i));
      if (!m) fail('看不懂的符號 "' + (s[i] || '結尾') + '"');
      var name = m[0];
      i += name.length;
      if (s[i] === '(') {
        var fn = FUNCS[name];
        if (!fn) fail('沒有這個函數 ' + name);
        i++;
        var args = [parseExpr()];
        while (s[i] === ',') { i++; args.push(parseExpr()); }
        if (s[i] !== ')') fail('少了右括號');
        i++;
        if (args.length === 1) { var a0 = args[0]; return function (v) { return fn(a0(v)); }; }
        return function (v) { return fn.apply(null, args.map(function (g) { return g(v); })); };
      }
      if (name === 'x' || name === 't') return function (v) { return v.x; };
      if (name === 'a') return function (v) { return v.a; };
      if (CONSTS.hasOwnProperty(name)) { var c = CONSTS[name]; return function () { return c; }; }
      fail('沒有這個變數 ' + name);
    }

    var out;
    try {
      out = parseExpr();
      if (i < s.length) fail('多出來的內容 "' + s.slice(i) + '"');
    } catch (err) {
      console.error('[算式] 無法解析「' + key + '」：' + err.message);
      out = function () { return NaN; };
    }
    exprCache[key] = out;
    return out;
  }

  /* ================= 4. 互動圖表 ================= */
  var UID = 0;

  function fmtNum(v, digits) {
    if (!isFinite(v)) return '無定義';
    if (digits === undefined) digits = 2;
    if (Math.abs(v) < 0.5 * Math.pow(10, -digits)) v = 0;
    return v.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).replace('-', '−');
  }
  function niceStep(range, count) {
    var raw = range / Math.max(1, count);
    var pow = Math.pow(10, Math.floor(Math.log10(raw)));
    var n = raw / pow;
    var step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
    return +step.toPrecision(10);
  }
  function tickList(lo, hi, step) {
    var out = [];
    var k = Math.ceil(lo / step - 1e-9);
    for (; k * step <= hi + step * 1e-9; k++) out.push(+(k * step).toPrecision(12));
    return out;
  }
  function tickText(v, step) {
    var dec = (String(+step.toPrecision(10)).split('.')[1] || '').length;
    return fmtNum(v, Math.min(dec, 6));
  }
  function r1(v) { return Math.round(v * 10) / 10; }

  function initFigure(fig) {
    var scr = fig.querySelector('script[type="application/json"]');
    if (!scr) return;
    var cfg;
    try { cfg = JSON.parse(scr.textContent); }
    catch (err) {
      console.error('[圖表] 設定不是合法的 JSON：' + err.message, scr.textContent.slice(0, 160));
      fig.insertBefore(mk('p', 'fig-error', '這張圖載入失敗。'), fig.firstChild);
      return;
    }

    var panels = cfg.panels || [cfg];
    var sl = cfg.slider || null;
    var a = sl ? Number(sl.value) : 0;
    var hidden = {};
    var vars = { x: 0, a: a };
    var cap = fig.querySelector('figcaption');
    var altText = cfg.alt || (cap ? cap.textContent : '函數圖形');

    function N(v) { vars.a = a; vars.x = 0; return compile(v)(vars); }
    function fnOf(pi, fi) {
      var p = panels[pi] || panels[0];
      var f = (p.fns || [])[fi];
      return f ? compile(f.f) : function () { return NaN; };
    }
    function fAt(c, x) { vars.a = a; vars.x = x; return c(vars); }
    function dAt(c, x) {
      var h = 1e-4 * Math.max(1, Math.abs(x));
      return (fAt(c, x + h) - fAt(c, x - h)) / (2 * h);
    }
    function d2At(c, x) {
      var h = 1e-3 * Math.max(1, Math.abs(x));
      return (fAt(c, x + h) - 2 * fAt(c, x) + fAt(c, x - h)) / (h * h);
    }
    function tpl(str) {
      return String(str).replace(/\{\{([^}|]+)(?:\|(\d+))?\}\}/g, function (_, ex, dg) {
        return fmtNum(N(ex), dg === undefined ? 0 : parseInt(dg, 10));
      });
    }

    var body = mk('div', 'fig-body');
    fig.insertBefore(body, cap);
    var stage = mk('div', 'fig-stage');
    body.appendChild(stage);

    var holders = panels.map(function (p) {
      var wrap = mk('div', 'fig-panel' + (p.narrow ? ' is-narrow' : ''));
      if (p.title) { var t = mk('p', 'fig-panel-title'); t.textContent = p.title; wrap.appendChild(t); }
      var holder = mk('div', 'fig-svg');
      wrap.appendChild(holder);
      stage.appendChild(wrap);
      return holder;
    });

    /* ---- 畫一個面板 ---- */
    function drawPanel(holder, p, pi) {
      var W = Math.floor(holder.clientWidth);
      if (W < 60) return;
      var H = Math.round(Math.min(p.h || 300, Math.max(190, W * 0.95)));
      var axes = p.axes !== false;
      var m = axes ? { l: 40, r: 14, t: 12, b: 28 } : { l: 6, r: 6, t: 6, b: 6 };
      var x0 = N(p.x[0]), x1 = N(p.x[1]), y0 = N(p.y[0]), y1 = N(p.y[1]);
      var ph = H - m.t - m.b;
      var yt = [], xt = [], ys = 1, xs = 1;

      if (axes && !p.equal) {
        ys = niceStep(y1 - y0, Math.max(3, Math.floor(ph / 42)));
        yt = tickList(y0, y1, ys);
        var maxLen = yt.reduce(function (mx, v) { return Math.max(mx, tickText(v, ys).length); }, 1);
        m.l = Math.max(30, Math.round(12 + maxLen * 7));
      }
      var pw = W - m.l - m.r;
      if (p.equal) {
        var sc = Math.min(pw / (x1 - x0), ph / (y1 - y0));
        var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        x0 = cx - pw / sc / 2; x1 = cx + pw / sc / 2;
        y0 = cy - ph / sc / 2; y1 = cy + ph / sc / 2;
        if (axes) { ys = niceStep(y1 - y0, Math.max(3, Math.floor(ph / 42))); yt = tickList(y0, y1, ys); }
      }
      if (axes) {
        var cnt = Math.max(2, Math.floor(pw / 62));
        xs = niceStep(x1 - x0, cnt);
        xt = tickList(x0, x1, xs);
        var xl = xt.reduce(function (mx, v) { return Math.max(mx, tickText(v, xs).length); }, 1);
        while (xt.length > 2 && (xl * 7 + 14) * xt.length > pw) {
          cnt = Math.max(1, cnt - 1);
          xs = niceStep(x1 - x0, cnt);
          xt = tickList(x0, x1, xs);
          if (cnt === 1) break;
        }
      }

      function X(v) { return m.l + (v - x0) / (x1 - x0) * pw; }
      function Y(v) { return m.t + (y1 - v) / (y1 - y0) * ph; }
      holder._scale = { x0: x0, x1: x1, l: m.l, pw: pw, W: W };

      var uid = 'clip' + (++UID);
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(altText) + '">';
      s += '<defs><clipPath id="' + uid + '"><rect x="' + m.l + '" y="' + m.t + '" width="' + pw + '" height="' + ph + '"/></clipPath></defs>';

      if (axes) {
        s += '<rect class="bg" x="' + m.l + '" y="' + m.t + '" width="' + pw + '" height="' + ph + '"/>';
        xt.forEach(function (v) { var px = r1(X(v)); s += '<line class="gridline" x1="' + px + '" y1="' + m.t + '" x2="' + px + '" y2="' + (m.t + ph) + '"/>'; });
        yt.forEach(function (v) { var py = r1(Y(v)); s += '<line class="gridline" x1="' + m.l + '" y1="' + py + '" x2="' + (m.l + pw) + '" y2="' + py + '"/>'; });
        s += '<rect class="frame" x="' + m.l + '" y="' + m.t + '" width="' + pw + '" height="' + ph + '"/>';
        if (y0 <= 0 && y1 >= 0) s += '<line class="axis" x1="' + m.l + '" y1="' + r1(Y(0)) + '" x2="' + (m.l + pw) + '" y2="' + r1(Y(0)) + '"/>';
        if (x0 <= 0 && x1 >= 0) s += '<line class="axis" x1="' + r1(X(0)) + '" y1="' + m.t + '" x2="' + r1(X(0)) + '" y2="' + (m.t + ph) + '"/>';
        xt.forEach(function (v) {
          var label = tickText(v, xs), px = X(v), half = label.length * 3.4;
          var anchor = px + half > W - 2 ? 'end' : px - half < 2 ? 'start' : 'middle';
          if (anchor === 'end') px = Math.min(W - 2, px + half * 0.6); else if (anchor === 'start') px = Math.max(2, px - half * 0.6);
          s += '<text class="tick" text-anchor="' + anchor + '" x="' + r1(px) + '" y="' + (m.t + ph + 17) + '">' + label + '</text>';
        });
        yt.forEach(function (v) { s += '<text class="tick" text-anchor="end" x="' + (m.l - 6) + '" y="' + r1(Y(v) + 4) + '">' + tickText(v, ys) + '</text>'; });
      }

      s += '<g clip-path="url(#' + uid + ')">';

      /* 幾何形狀 */
      (p.shapes || []).forEach(function (sh) {
        if (sh.type === 'text') return;
        var col = sh.color || 'ink';
        var sw = sh.w || 2;
        var dash = sh.dash ? ' stroke-dasharray="6 5"' : '';
        var fillCls = sh.fill ? ' f-' + col + ' soft' : ' nofill';
        if (sh.type === 'line') {
          s += '<line class="s-' + col + '" stroke-width="' + sw + '" stroke-linecap="round"' + dash + ' x1="' + r1(X(N(sh.x1))) + '" y1="' + r1(Y(N(sh.y1))) + '" x2="' + r1(X(N(sh.x2))) + '" y2="' + r1(Y(N(sh.y2))) + '"/>';
        } else if (sh.type === 'rect') {
          var rx = N(sh.x), ry = N(sh.y), rw = N(sh.w0 !== undefined ? sh.w0 : sh.width), rh = N(sh.height);
          s += '<rect class="s-' + col + fillCls + '" stroke-width="' + sw + '"' + dash + ' x="' + r1(X(rx)) + '" y="' + r1(Y(ry + rh)) + '" width="' + r1(Math.max(0, X(rx + rw) - X(rx))) + '" height="' + r1(Math.max(0, Y(ry) - Y(ry + rh))) + '"/>';
        } else if (sh.type === 'circle') {
          var rr = sh.rpx !== undefined ? sh.rpx : Math.abs(X(N(sh.r)) - X(0));
          s += '<circle class="s-' + col + fillCls + '" stroke-width="' + sw + '"' + dash + ' cx="' + r1(X(N(sh.cx))) + '" cy="' + r1(Y(N(sh.cy))) + '" r="' + r1(rr) + '"/>';
        } else if (sh.type === 'semi') {
          var scx = N(sh.cx), scy = N(sh.cy), sr = N(sh.r);
          var rpx = Math.abs(X(scx + sr) - X(scx));
          s += '<path class="s-' + col + fillCls + '" stroke-width="' + sw + '"' + dash + ' d="M' + r1(X(scx - sr)) + ' ' + r1(Y(scy)) + ' A' + r1(rpx) + ' ' + r1(rpx) + ' 0 0 1 ' + r1(X(scx + sr)) + ' ' + r1(Y(scy)) + (sh.fill ? ' Z' : '') + '"/>';
        } else if (sh.type === 'poly') {
          var d = (sh.pts || []).map(function (pt, k) { return (k ? 'L' : 'M') + r1(X(N(pt[0]))) + ' ' + r1(Y(N(pt[1]))); }).join(' ');
          s += '<path class="s-' + col + fillCls + '" stroke-width="' + sw + '" stroke-linejoin="round"' + dash + ' d="' + d + (sh.close ? ' Z' : '') + '"/>';
        }
      });

      /* 參考線 */
      (p.vlines || []).forEach(function (L) {
        var px = r1(X(N(L.x)));
        s += '<line class="s-' + (L.color || 'mute') + '" stroke-width="1.6"' + (L.dash === false ? '' : ' stroke-dasharray="6 5"') + ' x1="' + px + '" y1="' + m.t + '" x2="' + px + '" y2="' + (m.t + ph) + '"/>';
      });
      (p.hlines || []).forEach(function (L) {
        var py = r1(Y(N(L.y)));
        s += '<line class="s-' + (L.color || 'mute') + '" stroke-width="1.6"' + (L.dash === false ? '' : ' stroke-dasharray="6 5"') + ' x1="' + m.l + '" y1="' + py + '" x2="' + (m.l + pw) + '" y2="' + py + '"/>';
      });

      /* 曲線 */
      var samples = Math.max(160, Math.min(520, Math.round(pw)));
      (p.fns || []).forEach(function (fn, fi) {
        if (hidden[pi + ':' + fi]) return;
        var c = compile(fn.f);
        var lo = x0, hi = x1;
        if (fn.domain) { lo = Math.max(x0, N(fn.domain[0])); hi = Math.min(x1, N(fn.domain[1])); }
        if (!(hi > lo)) return;
        var d = '', pen = false, prev = 0;
        var top = m.t - ph, bot = m.t + 2 * ph;
        for (var k = 0; k <= samples; k++) {
          var xv = lo + (hi - lo) * k / samples;
          var yv = fAt(c, xv);
          if (!isFinite(yv)) { pen = false; continue; }
          var py = Y(yv);
          var out = py < m.t - 2 || py > m.t + ph + 2;
          if (py < top) py = top; else if (py > bot) py = bot;
          if (pen && ((prev <= m.t && py >= m.t + ph) || (prev >= m.t + ph && py <= m.t)) && out) pen = false;
          d += (pen ? 'L' : 'M') + r1(X(xv)) + ' ' + r1(py) + ' ';
          pen = true; prev = py;
        }
        s += '<path class="curve s-' + (fn.color || 'f') + '"' + (fn.dash ? ' stroke-dasharray="7 6"' : '') + (fn.w ? ' style="stroke-width:' + fn.w + '"' : '') + ' d="' + d + '"/>';
      });

      /* 切線 */
      if (p.tangent) {
        var tg = p.tangent;
        var tc = fnOf(pi, tg.fn || 0);
        var tx = N(tg.at === undefined ? 'a' : tg.at);
        var ty = fAt(tc, tx), slope = dAt(tc, tx);
        if (isFinite(ty) && isFinite(slope)) {
          s += '<line class="s-' + (tg.color || 'd1') + '" stroke-width="2.4" stroke-linecap="round" x1="' + r1(X(x0)) + '" y1="' + r1(Y(ty + slope * (x0 - tx))) + '" x2="' + r1(X(x1)) + '" y2="' + r1(Y(ty + slope * (x1 - tx))) + '"/>';
          s += '<circle class="f-' + (tg.color || 'd1') + '" stroke="#fff" stroke-width="2" cx="' + r1(X(tx)) + '" cy="' + r1(Y(ty)) + '" r="6.5"/>';
        }
      }
      s += '</g>';

      /* 參考線標籤（不裁切） */
      (p.vlines || []).forEach(function (L) {
        if (!L.label) return;
        s += '<text class="lbl f-' + (L.color || 'mute') + '" text-anchor="middle" x="' + r1(X(N(L.x))) + '" y="' + (m.t + (L.low ? ph - 8 : 15)) + '">' + esc(tpl(L.label)) + '</text>';
      });
      (p.hlines || []).forEach(function (L) {
        if (!L.label) return;
        s += '<text class="lbl f-' + (L.color || 'mute') + '" text-anchor="' + (L.left ? 'start' : 'end') + '" x="' + (L.left ? m.l + 8 : m.l + pw - 8) + '" y="' + r1(Y(N(L.y)) - 7) + '">' + esc(tpl(L.label)) + '</text>';
      });

      /* 點 */
      var POS = { tr: [9, -9, 'start'], tl: [-9, -9, 'end'], br: [9, 18, 'start'], bl: [-9, 18, 'end'], t: [0, -12, 'middle'], b: [0, 22, 'middle'], r: [11, 4, 'start'], l: [-11, 4, 'end'] };
      (p.points || []).forEach(function (pt) {
        var px = N(pt.x);
        var py = pt.y !== undefined ? N(pt.y) : fAt(fnOf(pi, pt.on || 0), px);
        if (!isFinite(px) || !isFinite(py)) return;
        var sx = X(px), sy = Y(py);
        if (sx < m.l - 1 || sx > m.l + pw + 1 || sy < m.t - 1 || sy > m.t + ph + 1) return;
        var col = pt.color || 'ink';
        s += pt.open
          ? '<circle class="s-' + col + '" fill="#fff" stroke-width="2.4" cx="' + r1(sx) + '" cy="' + r1(sy) + '" r="5"/>'
          : '<circle class="f-' + col + '" stroke="#fff" stroke-width="2" cx="' + r1(sx) + '" cy="' + r1(sy) + '" r="5.5"/>';
        if (pt.label) {
          var o = POS[pt.pos] || POS.tr;
          s += '<text class="lbl f-' + col + '" text-anchor="' + o[2] + '" x="' + r1(sx + o[0]) + '" y="' + r1(sy + o[1]) + '">' + esc(tpl(pt.label)) + '</text>';
        }
      });

      /* 線段標籤與文字 */
      (p.shapes || []).forEach(function (sh) {
        var col = sh.color || 'ink';
        if (sh.type === 'line' && sh.label) {
          var lo = sh.lo || [0, -8];
          var mx = (X(N(sh.x1)) + X(N(sh.x2))) / 2 + lo[0], my = (Y(N(sh.y1)) + Y(N(sh.y2))) / 2 + lo[1];
          s += '<text class="lbl f-' + col + '" text-anchor="' + (sh.anchor || 'middle') + '" x="' + r1(mx) + '" y="' + r1(my) + '">' + esc(tpl(sh.label)) + '</text>';
        } else if (sh.type === 'text') {
          s += '<text class="lbl f-' + col + '" text-anchor="' + (sh.anchor || 'middle') + '"' + (sh.size ? ' style="font-size:' + sh.size + 'px"' : '') + ' x="' + r1(X(N(sh.x))) + '" y="' + r1(Y(N(sh.y))) + '">' + esc(tpl(sh.t)) + '</text>';
        }
      });

      if (axes) {
        if (p.xlabel) s += '<text class="axlabel lbl" text-anchor="end" x="' + (m.l + pw - 7) + '" y="' + (m.t + ph - 8) + '">' + esc(p.xlabel) + '</text>';
        if (p.ylabel) s += '<text class="axlabel lbl" text-anchor="start" x="' + (m.l + 8) + '" y="' + (m.t + 16) + '">' + esc(p.ylabel) + '</text>';
      }
      s += '</svg>';
      holder.innerHTML = s;
    }

    /* ---- 圖例（可切換的曲線是按鈕） ---- */
    var legendItems = [];
    panels.forEach(function (p, pi) {
      (p.fns || []).forEach(function (fn, fi) {
        if (!fn.label) return;
        if (fn.show === false) hidden[pi + ':' + fi] = true;
        legendItems.push({ pi: pi, fi: fi, fn: fn });
      });
    });
    if (legendItems.length) {
      var lg = mk('div', 'fig-legend');
      legendItems.forEach(function (it) {
        var key = it.pi + ':' + it.fi;
        var node;
        if (it.fn.toggle) {
          node = mk('button', 'lg');
          node.type = 'button';
          node.setAttribute('aria-pressed', hidden[key] ? 'false' : 'true');
          node.addEventListener('click', function () {
            hidden[key] = !hidden[key];
            node.setAttribute('aria-pressed', hidden[key] ? 'false' : 'true');
            render();
          });
        } else {
          node = mk('span', 'lg');
        }
        node.innerHTML = '<span class="sw b-' + (it.fn.color || 'f') + '"></span>' + esc(it.fn.label);
        lg.appendChild(node);
      });
      body.appendChild(lg);
    }

    /* ---- 數值讀數 ---- */
    var readBox = null;
    if (cfg.readouts && cfg.readouts.length) {
      readBox = mk('div', 'fig-read');
      readBox.setAttribute('aria-live', 'off');
      body.appendChild(readBox);
    }
    function readValue(r) {
      if (r.expr !== undefined) return N(r.expr);
      var at = N(r.at === undefined ? 'a' : r.at);
      var pi = r.panel || 0;
      if (r.f !== undefined) return fAt(fnOf(pi, r.f), at);
      if (r.d !== undefined) return dAt(fnOf(pi, r.d), at);
      if (r.d2 !== undefined) return d2At(fnOf(pi, r.d2), at);
      return NaN;
    }
    function paintReadouts() {
      if (!readBox) return;
      var html = '';
      cfg.readouts.forEach(function (r) {
        var v = readValue(r);
        if (r.pos !== undefined || r.neg !== undefined) {
          var eps = r.eps === undefined ? 0.01 : r.eps;
          var kind = !isFinite(v) ? 'zero' : v > eps ? 'pos' : v < -eps ? 'neg' : 'zero';
          var txt = kind === 'pos' ? r.pos : kind === 'neg' ? r.neg : (r.zero || '');
          html += '<span class="ro is-text t-' + kind + '">' + esc(r.label) + '<b>' + esc(txt) + '</b></span>';
        } else {
          html += '<span class="ro' + (r.color ? ' t-' + r.color : '') + '">' + esc(r.label) + '<b>' + esc(r.pre || '') + fmtNum(v, r.digits) + esc(r.unit || '') + '</b></span>';
        }
      });
      readBox.innerHTML = html;
    }

    /* ---- 滑桿、播放、快速跳到 ---- */
    var input = null, output = null, playBtn = null, playing = false, rafId = 0;
    function setA(v, fromInput) {
      a = Math.min(Number(sl.max), Math.max(Number(sl.min), v));
      if (!fromInput && input) input.value = a;
      if (output) output.textContent = fmtNum(a, sl.digits === undefined ? 2 : sl.digits) + (sl.unit || '');
      render();
    }
    function stopPlay() {
      playing = false;
      cancelAnimationFrame(rafId);
      if (playBtn) { playBtn.textContent = '▶ 播放'; playBtn.setAttribute('aria-pressed', 'false'); }
    }
    if (sl) {
      var ctrl = mk('div', 'fig-ctrl');
      var id = 'sl' + (++UID);
      var lab = mk('label');
      lab.htmlFor = id;
      lab.textContent = sl.label || 'x';
      input = mk('input');
      input.type = 'range';
      input.id = id;
      input.min = sl.min; input.max = sl.max; input.step = sl.step || 'any'; input.value = sl.value;
      output = mk('output');
      output.htmlFor = id;
      ctrl.appendChild(lab); ctrl.appendChild(input); ctrl.appendChild(output);
      input.addEventListener('input', function () { stopPlay(); setA(parseFloat(input.value), true); });

      if (sl.play) {
        playBtn = mk('button', 'btn');
        playBtn.type = 'button';
        playBtn.textContent = '▶ 播放';
        playBtn.setAttribute('aria-pressed', 'false');
        playBtn.addEventListener('click', function () {
          if (playing) { stopPlay(); return; }
          playing = true;
          playBtn.textContent = '❚❚ 暫停';
          playBtn.setAttribute('aria-pressed', 'true');
          var lo = Number(sl.min), hi = Number(sl.max);
          var dur = (sl.duration || 7) * 1000;
          var from = a >= hi - (hi - lo) * 0.01 ? lo : a;
          var t0 = performance.now() - (from - lo) / (hi - lo) * dur;
          var tick = function (now) {
            if (!playing) return;
            var k = Math.min(1, (now - t0) / dur);
            setA(lo + (hi - lo) * k);
            if (k >= 1) { stopPlay(); return; }
            rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
        });
        ctrl.appendChild(playBtn);
      }
      if (sl.presets && sl.presets.length) {
        var pr = mk('div', 'fig-presets');
        sl.presets.forEach(function (ps) {
          var b = mk('button', 'btn');
          b.type = 'button';
          b.textContent = ps.label;
          b.addEventListener('click', function () { stopPlay(); setA(Number(ps.value)); });
          pr.appendChild(b);
        });
        ctrl.appendChild(pr);
      }
      body.appendChild(ctrl);

      if (sl.drag !== false) {
        var h0 = holders[sl.dragPanel || 0];
        h0.parentNode.classList.add('is-drag');
        var dragging = false;
        var move = function (ev) {
          var sc = h0._scale;
          if (!sc) return;
          var rect = h0.getBoundingClientRect();
          var px = (ev.clientX - rect.left) * (sc.W / rect.width);
          var xv = sc.x0 + (px - sc.l) / sc.pw * (sc.x1 - sc.x0);
          var st = Number(sl.step) || 0;
          if (st) xv = Math.round(xv / st) * st;
          stopPlay();
          setA(xv);
        };
        h0.addEventListener('pointerdown', function (ev) {
          if (ev.pointerType === 'mouse' && ev.button !== 0) return;
          dragging = true;
          try { h0.setPointerCapture(ev.pointerId); } catch (e) { /* 舊瀏覽器 */ }
          move(ev);
        });
        h0.addEventListener('pointermove', function (ev) { if (dragging) move(ev); });
        var end = function () { dragging = false; };
        h0.addEventListener('pointerup', end);
        h0.addEventListener('pointercancel', end);
      }
    }

    function render() {
      panels.forEach(function (p, pi) { drawPanel(holders[pi], p, pi); });
      paintReadouts();
    }

    if (output) output.textContent = fmtNum(a, sl.digits === undefined ? 2 : sl.digits) + (sl.unit || '');
    render();
    fig.addEventListener('fig:render', render);

    var pending = false;
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () { pending = false; render(); });
      }).observe(stage);
    } else {
      window.addEventListener('resize', render);
    }
  }

  /* ================= 5. 符號圖 =================
     <div class="signline" data-label="f′(x)" data-marks="-1=0, 5=0" data-signs="+ - +" data-kind="mono"></div>
     kind：mono（遞增遞減）、concave（凹向）、none（只畫正負）
     marks 的等號右邊：0 代表該點值為 0，x 代表不存在（無定義） */
  function initSignline(node) {
    var label = node.getAttribute('data-label') || '';
    var kind = node.getAttribute('data-kind') || 'mono';
    var marks = (node.getAttribute('data-marks') || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean).map(function (t) {
      var k = t.lastIndexOf('=');
      return k < 0 ? { x: t, v: '0' } : { x: t.slice(0, k).trim(), v: t.slice(k + 1).trim() };
    });
    var signs = (node.getAttribute('data-signs') || '').trim().split(/\s+/).filter(Boolean);
    var notes = node.getAttribute('data-notes') ? node.getAttribute('data-notes').split('|') : null;
    var NOTE = {
      mono: { '+': '↗ 遞增', '-': '↘ 遞減' },
      concave: { '+': '∪ 凹向上', '-': '∩ 凹向下' },
      none: { '+': '', '-': '' }
    }[kind] || { '+': '', '-': '' };

    var html = '<div class="sl-label">' + esc(label) + ' 的符號圖</div><div class="sl-row">';
    signs.forEach(function (sg, i) {
      var plus = sg === '+';
      var note = notes ? (notes[i] || '') : NOTE[plus ? '+' : '-'];
      html += '<div class="sl-run ' + (plus ? 'pos' : 'neg') + '"><span class="sl-signs">' + (plus ? '+ + +' : '− − −') + '</span><span class="sl-bar"></span><span class="sl-note">' + esc(note) + '</span></div>';
      if (i < marks.length) {
        var mkv = marks[i];
        var und = mkv.v !== '0';
        html += '<div class="sl-mark"><span class="sl-val' + (und ? ' und' : '') + '">' + (und ? '不存在' : '0') + '</span><span class="sl-tick"></span><span class="sl-x">' + esc(mkv.x.replace(/-/g, '−')) + '</span></div>';
      }
    });
    html += '</div>';
    node.innerHTML = html;
    node.setAttribute('role', 'img');
    node.setAttribute('aria-label', label + ' 的符號圖：' + signs.map(function (sg, i) { return (sg === '+' ? '正' : '負') + (marks[i] ? '，在 ' + marks[i].x + ' 變號' : ''); }).join('；'));
  }

  /* ================= 6. 逐步解答、小測驗、指定題 ================= */
  function redrawFigures(root) {
    root.querySelectorAll('figure.fig').forEach(function (f) { f.dispatchEvent(new CustomEvent('fig:render')); });
  }
  function initSolution(sol) {
    var steps = Array.prototype.filter.call(sol.children, function (c) { return c.classList.contains('step'); });
    if (!steps.length) return;
    var shown = 0;
    var bar = mk('div', 'sol-bar');
    var nextBtn = mk('button', 'btn btn-primary'); nextBtn.type = 'button';
    var allBtn = mk('button', 'btn'); allBtn.type = 'button'; allBtn.textContent = '全部顯示';
    var resetBtn = mk('button', 'btn btn-quiet'); resetBtn.type = 'button'; resetBtn.textContent = '收起解答';
    var count = mk('span', 'sol-count'); count.setAttribute('aria-live', 'polite');
    bar.appendChild(nextBtn); bar.appendChild(allBtn); bar.appendChild(resetBtn); bar.appendChild(count);
    sol.insertBefore(bar, sol.firstChild);
    steps.forEach(function (st, i) { st.setAttribute('data-n', i + 1); });

    function paint() {
      steps.forEach(function (st, i) {
        var was = st.hidden;
        st.hidden = i >= shown;
        if (was && !st.hidden) redrawFigures(st);
      });
      nextBtn.textContent = shown === 0 ? '看第 1 步' : shown < steps.length ? '看下一步（第 ' + (shown + 1) + ' 步）' : '已經是最後一步';
      nextBtn.disabled = shown >= steps.length;
      allBtn.disabled = shown >= steps.length;
      resetBtn.hidden = shown === 0;
      count.textContent = shown + ' / ' + steps.length + ' 步';
    }
    nextBtn.addEventListener('click', function () {
      if (shown < steps.length) shown++;
      paint();
      var st = steps[shown - 1];
      if (st && st.scrollIntoView) st.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    allBtn.addEventListener('click', function () { shown = steps.length; paint(); });
    resetBtn.addEventListener('click', function () {
      shown = 0; paint();
      if (bar.scrollIntoView) bar.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    paint();
  }

  function initQuiz(q) {
    var correct = parseInt(q.getAttribute('data-answer'), 10) - 1;
    var opts = Array.prototype.filter.call(q.children, function (c) { return c.tagName === 'BUTTON'; });
    var why = q.querySelector('.quiz-why');
    if (why) why.hidden = true;
    var res = mk('p', 'quiz-res');
    res.hidden = true;
    res.setAttribute('aria-live', 'polite');
    q.insertBefore(res, why || null);
    opts.forEach(function (b, i) {
      b.type = 'button';
      b.classList.add('opt');
      b.innerHTML = '<span class="opt-k" aria-hidden="true">' + 'ABCDEF'[i] + '</span><span class="opt-t">' + b.innerHTML + '</span>';
      b.addEventListener('click', function () {
        opts.forEach(function (o) { o.classList.remove('is-ok', 'is-no'); });
        var ok = i === correct;
        b.classList.add(ok ? 'is-ok' : 'is-no');
        if (!ok && opts[correct]) opts[correct].classList.add('is-ok');
        res.hidden = false;
        res.className = 'quiz-res ' + (ok ? 'ok' : 'no');
        res.textContent = ok ? '答對了。' : '還差一點，正確答案是 ' + 'ABCDEF'[correct] + '。';
        if (why) why.hidden = false;
      });
    });
  }

  function initProb(card) {
    var id = card.getAttribute('data-prob');
    var parts = id.split('-');
    card.id = 'q-' + id;
    var head = mk('div', 'prob-head');
    var stamp = mk('span', 'prob-stamp');
    stamp.textContent = (card.hasAttribute('data-extra') ? '加碼題 ' : '指定題 ') + parts[0] + ' #' + parts[1];
    var btn = mk('button', 'prob-done');
    btn.type = 'button';
    function paint() {
      var done = !!state.probs[id];
      btn.setAttribute('aria-pressed', done ? 'true' : 'false');
      btn.textContent = done ? '✓ 這題我會了' : '標記：這題我會了';
      card.classList.toggle('is-done', done);
    }
    btn.addEventListener('click', function () {
      state.probs[id] = !state.probs[id];
      saveState(); paint(); refreshProgress();
    });
    head.appendChild(stamp); head.appendChild(btn);
    card.insertBefore(head, card.firstChild);
    paint();
  }

  /* ================= 7. 首頁元件 ================= */
  function buildHome() {
    var sg = document.getElementById('secGrid');
    if (sg) {
      var html = '';
      PAGES.filter(function (p) { return p.study; }).forEach(function (p) {
        var pr = p.probs ? '指定題 ' + p.probs.length + ' 題' : '';
        html += '<a class="sec-card" data-id="' + p.id + '" data-probs="' + pr + '" href="' + p.file + '"><span class="num">' + esc(p.num === '0' ? '暖身' : p.num) + '</span><span class="ttl">' + esc(p.title) + '</span><span class="meta"></span></a>';
      });
      sg.innerHTML = html;
    }
    var pg = document.getElementById('probGrid');
    if (pg) {
      var rows = '';
      PAGES.filter(function (p) { return p.probs; }).forEach(function (p) {
        rows += '<div class="prob-row"><span class="sec">' + esc(p.num) + '</span><div class="chips">' + p.probs.map(function (n) {
          return '<a class="chip" data-prob="' + p.num + '-' + n + '" href="' + p.file + '#q-' + p.num + '-' + n + '">' + n + '</a>';
        }).join('') + '</div></div>';
      });
      pg.innerHTML = rows;
    }
    var rb = document.getElementById('resetProgress');
    if (rb) {
      rb.addEventListener('click', function () {
        if (!window.confirm('要把「已讀完」和「我會了」的標記全部清掉嗎？')) return;
        state = { pages: {}, probs: {} };
        saveState();
        refreshProgress();
      });
    }
  }

  /* ================= 8. 啟動 ================= */
  function renderMath() {
    if (typeof window.renderMathInElement !== 'function') return;
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false,
      strict: false
    });
  }

  function jumpToHash() {
    if (!location.hash || location.hash.length < 2) return;
    var target = null;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { /* 壞掉的網址片段 */ }
    if (target) target.scrollIntoView();
  }

  function start() {
    buildChrome();
    buildToc();
    buildHome();
    document.querySelectorAll('.prob[data-prob]').forEach(initProb);
    document.querySelectorAll('.solution').forEach(initSolution);
    document.querySelectorAll('.quiz').forEach(initQuiz);
    document.querySelectorAll('.signline').forEach(initSignline);
    buildPageEnd();
    renderMath();
    document.querySelectorAll('figure.fig').forEach(initFigure);
    refreshProgress();
    document.addEventListener('toggle', function (ev) {
      if (ev.target && ev.target.open && ev.target.querySelectorAll) redrawFigures(ev.target);
    }, true);
    jumpToHash();
    window.addEventListener('load', jumpToHash);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
