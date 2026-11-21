/* THE LIGHT EATERS WIKI: app code. Content is in data.js. */
(function () {
  'use strict';
  var W = window.WIKI;
  var STATUS = { canon: 'Canon', 'in-development': 'In development', theory: 'Theory', unknown: 'Unknown' };
  var VIS = { normal: 'Normal', spoiler: 'Spoiler', restricted: 'Restricted' };

  var all = W.articles.filter(function (a) { return a.visibility !== 'restricted'; });
  var real = all.filter(function (a) { return !a.placeholder; });
  var byId = {}; all.forEach(function (a) { byId[a.id] = a; });
  var catBy = {}; W.categories.forEach(function (c) { catBy[c.slug] = c; });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Escapes text, then applies the small markup: [[id|text]], **bold**, *italic*.
  function fmt(s) {
    return esc(s)
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, function (m, id, t) {
        return byId[id] ? '<a href="#/a/' + id + '">' + t + '</a>' : '<span class="missing" title="Article not created yet">' + t + '</span>';
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }
  function chip(label, cls) { return '<span class="chip' + (cls ? ' ' + cls : '') + '">' + esc(label) + '</span>'; }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function searchForm(id, ph) {
    return '<form data-search role="search"><label for="' + id + '" class="sr">Search the archive</label><input id="' + id + '" name="q" placeholder="' + esc(ph) + '" autocomplete="off"></form>';
  }

  /* ---------- Sidebar ---------- */
  function sidebar(kind, rest) {
    var cur = kind === 'c' ? rest[0] : kind === 'a' ? (rest[0] || '') : '';
    var open = window.matchMedia && window.matchMedia('(min-width: 861px)').matches ? ' open' : '';
    var nav = '<a href="#/" class="' + (!kind ? 'on' : '') + '"><i>&bull;</i>Home</a>';
    W.categories.forEach(function (c) {
      nav += '<a href="#/c/' + c.slug + '" class="' + (cur === c.slug ? 'on' : '') + '"><i>' + c.roman + '</i>' + esc(c.name) + '</a>';
    });
    nav += '<div class="hr"></div><a href="#/world-bible" class="' + (kind === 'world-bible' ? 'on' : '') + '"><i>&sect;</i>World Bible</a>' +
      '<span class="priv" title="Private workspace, not part of this site"><i>&#9632;</i>Development Archive</span>';
    return '<a class="logo" href="#/">THE LIGHT EATERS</a><div class="tag">Official Wiki</div>' +
      '<div class="sb">' + searchForm('q', 'Search the archive') + '</div>' +
      '<details class="navwrap"' + open + '><summary>Menu</summary><nav class="nav" aria-label="Main">' + nav + '</nav></details>' +
      '<div class="lang"><button class="on" type="button">EN</button><button type="button" disabled title="Portuguese version coming soon">PT</button></div>';
  }

  /* ---------- Pages (each returns { title, html }) ---------- */
  function home() {
    var cards = W.categories.map(function (c) {
      var n = real.filter(function (a) { return a.category === c.slug; }).length;
      return '<a class="card" href="#/c/' + c.slug + '"><div class="art" style="height:110px">Artwork</div><div class="cb"><div class="rn">' + c.roman +
        '</div><div class="cn">' + esc(c.name) + '</div><div class="cd">' + esc(c.description) + '</div><div class="cc">' + plural(n, 'article') + '</div></div></a>';
    }).join('');
    return {
      title: 'Home',
      html: '<section class="hero"><div class="eyebrow">Private encyclopedia</div><h1>THE LIGHT EATERS</h1><p>An archive of a world consumed by darkness.</p>' +
        searchForm('qh', 'Search Void, animals, plants, kingdoms, regions') + '</section>' +
        '<section class="wrap"><h2 class="h2">Explore the archive</h2><p class="muted">' + plural(real.length, 'article') + ' in ' + W.categories.length + ' categories.</p>' +
        '<div class="cards">' + cards + '</div>' +
        '<h2 class="h2" style="margin-top:44px">Information status</h2><p class="muted">Every article carries a development status and, separately, a narrative visibility.</p>' +
        '<div class="chips">' + chip('Canon', 'g') + chip('In development') + chip('Theory') + chip('Unknown') + '</div>' +
        '<div class="chips">' + chip('Normal') + chip('Spoiler') + '</div></section>'
    };
  }

  function category(slug) {
    var c = catBy[slug];
    if (!c) return notFound();
    var list = all.filter(function (a) { return a.category === slug; }).sort(function (a, b) { return a.title.localeCompare(b.title); });
    var items = list.map(function (a) {
      return '<li><a href="#/a/' + a.id + '">' + esc(a.title) + '</a> ' + chip(a.placeholder ? 'Template example' : STATUS[a.status]) +
        (a.summary ? '<div class="muted">' + esc(a.summary) + '</div>' : '') + '</li>';
    }).join('');
    return {
      title: c.name,
      html: '<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <span>' + esc(c.name) + '</span></nav>' +
        '<h1 class="title">' + esc(c.name) + '</h1><p class="muted">' + esc(c.description) + '</p>' +
        (list.length ? '<ul class="alist">' + items + '</ul>' : '<p class="muted">No articles yet.</p>') + '</div>'
    };
  }

  function article(id) {
    var a = byId[id];
    if (!a) return notFound();
    var c = catBy[a.category];
    var rows = (a.infobox || []).map(function (r) { return '<div class="ibr"><b>' + esc(r[0]) + '</b><span>' + fmt(r[1]) + '</span></div>'; }).join('');
    var img = a.image ? '<img src="' + esc(a.image) + '" alt="' + esc(a.title) + '" style="width:100%;display:block">' : '<div class="art" style="height:230px">Image or 3D model</div>';
    var banner = a.placeholder ? 'Template example: this page shows the layout only and contains no lore.'
      : a.visibility === 'spoiler' ? 'This page contains story spoilers.' : 'Statements marked Theory or In development are not confirmed canon.';
    var toc = '', body = '';
    (a.sections || []).forEach(function (s, i) {
      toc += '<li><a href="#/a/' + a.id + '" data-scroll="sec-' + i + '">' + esc(s.title) + '</a></li>';
      body += '<h2 id="sec-' + i + '">' + esc(s.title) + '</h2>' + (s.sources ? '<p class="src">Lore sources: ' + fmt(s.sources) + '</p>' : '') + '<ul>' +
        s.items.map(function (it) {
          var t = typeof it === 'string' ? { text: it } : it;
          return '<li>' + fmt(t.text) + (t.status ? ' ' + chip(STATUS[t.status] || t.status) : '') + '</li>';
        }).join('') + '</ul>';
    });
    var rel = (a.related || []).map(function (r) { return byId[r]; }).filter(Boolean);
    var back = all.filter(function (o) { return o.id !== a.id && (o.related || []).indexOf(a.id) > -1; });
    var relHtml = rel.length + back.length ? '<h2>Related Articles</h2><ul>' +
      rel.map(function (r) { return '<li><a href="#/a/' + r.id + '">' + esc(r.title) + '</a></li>'; }).join('') +
      back.map(function (r) { return '<li><a href="#/a/' + r.id + '">' + esc(r.title) + '</a> <span class="muted">(links here)</span></li>'; }).join('') + '</ul>' : '';
    var srcHtml = (a.sources || []).length ? '<h2>Sources</h2><ul>' + a.sources.map(function (s) { return '<li>' + fmt(s) + '</li>'; }).join('') + '</ul>' : '';
    return {
      title: a.title,
      html: '<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/c/' + c.slug + '">' + esc(c.name) + '</a> / <span>' + esc(a.title) + '</span></nav>' +
        '<h1 class="title">' + esc(a.title) + '</h1>' +
        '<div class="ban">' + chip(STATUS[a.status], a.status === 'canon' ? 'g' : '') + ' ' + chip(VIS[a.visibility]) + ' ' + banner + '</div>' +
        '<article class="wk"><aside class="ib"><div class="ibh">' + esc(a.title) + '</div>' + img +
        (a.imageCaption ? '<div class="ibc">' + esc(a.imageCaption) + '</div>' : '') + rows + '</aside>' +
        (a.summary ? '<p class="lead">' + fmt(a.summary) + '</p>' : '') +
        (toc ? '<div class="toc"><b>Contents</b><ol>' + toc + '</ol></div>' : '') + body + relHtml + srcHtml +
        '<div class="foot">Categories: <a class="chip" href="#/c/' + c.slug + '">' + esc(c.name) + '</a>' +
        (a.tags || []).map(function (t) { return chip(t); }).join('') + '</div></article></div>'
    };
  }

  function search(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var results = [];
    if (terms.length) {
      real.forEach(function (a) {
        var title = a.title.toLowerCase(), sum = (a.summary || '').toLowerCase(), tags = (a.tags || []).join(' ').toLowerCase();
        var text = (a.sections || []).map(function (s) {
          return s.title + ' ' + s.items.map(function (i) { return typeof i === 'string' ? i : i.text; }).join(' ');
        }).join(' ').toLowerCase();
        var score = 0, ok = true;
        terms.forEach(function (t) {
          var s = (title.indexOf(t) > -1 ? 10 : 0) + (tags.indexOf(t) > -1 ? 4 : 0) + (sum.indexOf(t) > -1 ? 3 : 0) + (text.indexOf(t) > -1 ? 1 : 0);
          if (!s) ok = false; score += s;
        });
        if (ok) results.push({ a: a, score: score });
      });
      results.sort(function (x, y) { return y.score - x.score; });
    }
    var list = results.map(function (r) {
      return '<li><a href="#/a/' + r.a.id + '">' + esc(r.a.title) + '</a> ' + chip(catBy[r.a.category].name) + ' ' + chip(STATUS[r.a.status]) +
        (r.a.summary ? '<div class="muted">' + esc(r.a.summary) + '</div>' : '') + '</li>';
    }).join('');
    return {
      title: 'Search',
      html: '<div class="wrap"><h1 class="title">Search</h1>' + searchForm('qs', 'Search the archive') +
        '<p class="muted" style="margin-top:16px">' + (terms.length ? plural(results.length, 'result') + ' for “' + esc(q) + '”.' : 'Type a name or term.') + '</p>' +
        (list ? '<ul class="alist">' + list + '</ul>' : '') + '</div>'
    };
  }

  function worldBible() {
    return {
      title: 'World Bible',
      html: '<div class="wrap"><h1 class="title">World Bible</h1><p class="muted">The consolidated canon, rules and continuity of THE LIGHT EATERS. No entries recorded yet.</p>' +
        '<ol class="alist">' + W.worldBible.map(function (s) { return '<li>' + esc(s) + ' ' + chip('Unknown') + '</li>'; }).join('') + '</ol></div>'
    };
  }

  function notFound() {
    return { title: 'Not found', html: '<div class="wrap"><h1 class="title">Page not found</h1><p class="muted"><a href="#/">Back to the home page</a></p></div>' };
  }

  /* ---------- Router ---------- */
  function parse() {
    var raw = location.hash.replace(/^#\/?/, '');
    var parts = raw.split('/');
    return { raw: raw, kind: parts[0], rest: parts.slice(1).map(function (p) { try { return decodeURIComponent(p); } catch (e) { return p; } }) };
  }
  function render() {
    var r = parse(), out;
    if (!r.raw) out = home();
    else if (r.kind === 'c') out = category(r.rest[0]);
    else if (r.kind === 'a') out = article(r.rest.join('/'));
    else if (r.kind === 'search') out = search(r.rest.join('/'));
    else if (r.kind === 'world-bible') out = worldBible();
    else out = notFound();
    document.getElementById('side').innerHTML = sidebar(r.raw ? r.kind : '', r.rest);
    document.getElementById('main').innerHTML = out.html;
    document.title = out.title + ' · THE LIGHT EATERS Wiki';
    window.scrollTo(0, 0);
  }

  document.addEventListener('submit', function (e) {
    if (e.target.matches && e.target.matches('[data-search]')) {
      e.preventDefault();
      location.hash = '#/search/' + encodeURIComponent(new FormData(e.target).get('q').trim());
    }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-scroll]') : null;
    if (t) {
      e.preventDefault();
      var el = document.getElementById(t.getAttribute('data-scroll'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  window.addEventListener('hashchange', render);
  render();
})();
