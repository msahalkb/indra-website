(function () {
  "use strict";
  var C = window.INDRA || {};
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function parseDate(s) {
    if (!s) return null;
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function endOfDay(s) {
    var d = parseDate(s);
    return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59) : null;
  }
  function safeUrl(u) {
    return /^(https?:|mailto:)/i.test(u || "") ? u : "";
  }
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  /* ---------- Announcements ---------- */
  var box = document.getElementById("announcements");
  (C.announcements || []).forEach(function (a) {
    var from = parseDate(a.from), until = endOfDay(a.until);
    if ((from && now < from) || (until && now > until)) return;
    var note = el("div", "note");
    note.appendChild(el("p", null, a.text || ""));
    if (a.linkUrl && safeUrl(a.linkUrl)) {
      var l = el("a", null, a.linkText || "Learn more");
      l.href = a.linkUrl; l.target = "_blank"; l.rel = "noopener";
      note.appendChild(l);
    }
    box.appendChild(note);
  });

  /* ---------- Events ---------- */
  function eventCard(e) {
    var d = parseDate(e.date);
    var card = el("article", "event");
    var tile = el("div", "date-tile");
    if (d) {
      tile.appendChild(el("span", "d", String(d.getDate())));
      tile.appendChild(el("span", "m", MONTHS[d.getMonth()]));
      tile.appendChild(el("span", "y", String(d.getFullYear())));
    }
    var body = el("div");
    body.appendChild(el("h4", null, e.title || "Event"));
    var meta = [e.time, e.venue].filter(Boolean).join(", ");
    if (meta) body.appendChild(el("div", "meta", meta));
    if (e.description) body.appendChild(el("p", null, e.description));
    if (e.linkUrl && safeUrl(e.linkUrl)) {
      var a = el("a", null, e.linkText || "More details");
      a.href = e.linkUrl; a.target = "_blank"; a.rel = "noopener";
      body.appendChild(a);
    }
    card.appendChild(tile); card.appendChild(body);
    return card;
  }
  var events = (C.events || []).filter(function (e) { return parseDate(e.date); });
  var upcoming = events.filter(function (e) { return parseDate(e.date) >= today; })
    .sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
  var past = events.filter(function (e) { return parseDate(e.date) < today; })
    .sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });

  var upEl = document.getElementById("eventsUpcoming");
  var pastEl = document.getElementById("eventsPast");
  pastEl.classList.add("past");
  if (upcoming.length) upcoming.forEach(function (e) { upEl.appendChild(eventCard(e)); });
  else upEl.appendChild(el("p", "empty", "No events are scheduled right now. Follow us on Instagram to hear first."));
  if (past.length) past.forEach(function (e) { pastEl.appendChild(eventCard(e)); });
  else document.getElementById("pastHeading").hidden = true;

  /* ---------- Gallery ---------- */
  var grid = document.getElementById("galleryGrid");
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbCap = document.getElementById("lightboxCap");
  var photos = C.gallery || [];
  if (!photos.length) grid.appendChild(el("p", "empty", "Photos coming soon."));
  photos.forEach(function (p) {
    var fig = el("button", "shot");
    fig.type = "button";
    var img = new Image();
    img.loading = "lazy";
    img.alt = p.alt || p.caption || "";
    img.src = p.src;
    img.onerror = function () {
      fig.className = "shot placeholder";
      fig.disabled = true;
      fig.textContent = "Photo coming soon" + (p.caption ? ": " + p.caption : "");
    };
    fig.appendChild(img);
    if (p.caption) fig.appendChild(el("span", "cap", p.caption));
    fig.addEventListener("click", function () {
      lbImg.src = p.src; lbImg.alt = img.alt; lbCap.textContent = p.caption || "";
      if (lb.showModal) lb.showModal();
    });
    grid.appendChild(fig);
  });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });

  /* ---------- Membership ---------- */
  var m = C.membership || {};
  var closes = endOfDay(m.closesOn);
  var memberOpen = m.open === true && (!closes || now <= closes);
  if (memberOpen) {
    document.getElementById("join").hidden = false;
    document.getElementById("navJoin").hidden = false;
    document.getElementById("joinTitle").textContent = m.title || "Join Indra";
    document.getElementById("joinText").textContent = m.text || "";
    if (closes) {
      var d = parseDate(m.closesOn);
      document.getElementById("joinDeadline").textContent =
        "Applications close on " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear() + ".";
    }
    var btn = document.getElementById("joinBtn");
    var url = safeUrl(m.formUrl);
    if (url) {
      btn.href = url;
      if (m.embed) {
        btn.hidden = true;
        var frame = document.createElement("iframe");
        frame.src = url; frame.title = "Membership form"; frame.loading = "lazy";
        var holder = document.getElementById("joinEmbed");
        holder.hidden = false; holder.appendChild(frame);
        document.querySelector(".join").classList.add("has-embed");
      }
    } else {
      btn.removeAttribute("href");
      btn.setAttribute("aria-disabled", "true");
      btn.textContent = "Form link coming soon";
    }
  }

  /* ---------- Social links ---------- */
  var s = C.social || {};
  var links = document.getElementById("socialLinks");
  var ICONS = {
    linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
    instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>',
    email: '<path d="M2 5h20a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zm1.6 2L12 12.6 20.4 7H3.6zM3 8.8V17h18V8.8l-9 6-9-6z"/>'
  };
  [["LinkedIn", s.linkedin, "linkedin"], ["Instagram", s.instagram, "instagram"], ["Email us", s.email ? "mailto:" + s.email : "", "email"]]
    .forEach(function (x) {
      if (!x[1]) return;
      var a = el("a", "btn btn-ghost btn-social");
      a.href = x[1];
      if (x[1].indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      a.insertAdjacentHTML("beforeend",
        '<svg class="icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">' + ICONS[x[2]] + "</svg>");
      a.appendChild(el("span", null, x[0]));
      links.appendChild(a);
    });

  document.getElementById("year").textContent = "\u00A9 " + now.getFullYear() + " Indra";

  /* ---------- Extra sections from config.sections ---------- */
  var navEl = document.querySelector(".nav nav");
  var navContact = navEl && navEl.querySelector('a[href="#contact"]');
  var lastAfter = {};
  (C.sections || []).forEach(function (sec) {
    if (!sec || !sec.title) return;
    var id = String(sec.id || sec.title).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "section";
    if (document.getElementById(id)) id = id + "-x";
    var anchorId = ["about", "events", "gallery"].indexOf(sec.after) > -1 ? sec.after : "gallery";
    var anchor = lastAfter[anchorId] || document.getElementById(anchorId);
    if (!anchor) return;

    var section = el("section", "section" + (sec.theme === "light" ? " section-light" : ""));
    section.id = id;
    var wrap = el("div", "wrap");
    wrap.appendChild(el("h2", null, sec.title));
    if (sec.intro) wrap.appendChild(el("p", "lead", sec.intro));
    var cards = el("div", "cards");
    (sec.items || []).forEach(function (it) {
      if (!it || !it.title) return;
      var card = el("article", "card");
      if (it.image) {
        var img = new Image();
        img.loading = "lazy"; img.alt = it.alt || it.title; img.src = it.image;
        img.className = "card-img";
        img.onerror = function () { img.remove(); };
        card.appendChild(img);
      }
      var body = el("div", "card-body");
      if (it.tag) body.appendChild(el("span", "tag", it.tag));
      body.appendChild(el("h3", null, it.title));
      if (it.text) body.appendChild(el("p", null, it.text));
      if (it.linkUrl && safeUrl(it.linkUrl)) {
        var a = el("a", "card-link", it.linkText || "Learn more");
        a.href = it.linkUrl; a.target = "_blank"; a.rel = "noopener";
        body.appendChild(a);
      }
      card.appendChild(body);
      cards.appendChild(card);
    });
    wrap.appendChild(cards);
    section.appendChild(wrap);
    anchor.parentNode.insertBefore(section, anchor.nextSibling);
    lastAfter[anchorId] = section;

    if (navEl) {
      var link = el("a", null, sec.title);
      link.href = "#" + id;
      navEl.insertBefore(link, navContact || document.getElementById("navJoin"));
    }
  });

  /* ---------- Contact form (emailed through FormSubmit) ---------- */
  var cf = document.getElementById("contactForm");
  var toEmail = (C.contact && C.contact.email) || "";
  if (cf && toEmail) {
    var cStatus = document.getElementById("cStatus"), cSend = document.getElementById("cSend");
    cf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      cStatus.className = "status";
      if (!cf.checkValidity()) {
        cStatus.textContent = "Please fill in your name, a valid email and a message.";
        cStatus.className = "status err";
        cf.reportValidity();
        return;
      }
      var fd = new FormData(cf);
      if (fd.get("_honey")) return; // bot
      var payload = {
        name: fd.get("name"), email: fd.get("email"), message: fd.get("message"),
        _subject: "Indra website: message from " + fd.get("name"),
        _template: "table", _captcha: "false"
      };
      cSend.disabled = true; cStatus.textContent = "Sending...";
      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(toEmail), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d && (d.success === true || d.success === "true")) {
          cf.reset();
          cStatus.textContent = "Message sent. We will reply to your email soon.";
          cStatus.className = "status ok";
        } else { throw new Error("failed"); }
      }).catch(function () {
        cStatus.className = "status err";
        cStatus.textContent = "Could not send the message. Please email us directly at " + toEmail + ".";
      }).then(function () { cSend.disabled = false; });
    });
  }

  /* ---------- Hero: gantry robot that picks letter blocks and builds INDRA ---------- */
  (function () {
    var cv = document.getElementById("scan");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var stage = cv.parentNode;
    var rdA = document.getElementById("rdAngle"), rdP = document.getElementById("rdPts");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var PI = Math.PI;

    /* ---- Easy settings ---- */
    var LETTERS = ["I", "N", "D", "R", "A"];            // what the robot builds
    var TILT = [-24, 17, -13, 27, -20];                 // angle each block lies at on the belt (degrees)
    var SEG = [900, 500, 250, 450, 800, 450, 250, 400]; // ms per step: arrive, lower, grip, lift, move, lower, release, lift
    var HOLD = 2200, SWEEP = 900;                       // pause when finished, then clear the shelf (ms)

    /* ---- Layout (600 x 450 drawing units) ---- */
    var BS = 34, HB = BS / 2, GRIP = 10, OFF = GRIP + HB;
    var RAIL_Y = 66, UP = 138;
    var BELT_TOP = 372, SHELF_TOP = 304, FLOOR = 412;
    var PICK_X = 104, HOME_X = 300, SHELF_CX = 430, PITCH = 48;
    var N = LETTERS.length, CYC = 0, q;
    for (q = 0; q < SEG.length; q++) CYC += SEG[q];
    var WORK = N * CYC, TOTAL = WORK + HOLD + SWEEP;
    var W = 0, H = 0, dpr = 1, sc = 1, ox = 0, oy = 0, visible = true;

    function slotX(i) { return SHELF_CX + (i - (N - 1) / 2) * PITCH; }
    function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function out(x) { return 1 - Math.pow(1 - x, 3); }
    function mix(a, b, f) { return a + (b - a) * f; }

    /* where the gripper must be to grab block i as it lies on the belt */
    function pickInfo(i) {
      var a = TILT[i % TILT.length] * PI / 180;
      var cy = BELT_TOP - HB * (Math.cos(a) + Math.abs(Math.sin(a)));
      return { a: a, cy: cy, px: PICK_X + OFF * Math.sin(a), py: cy - OFF * Math.cos(a) };
    }

    /* everything on screen is a pure function of time, so the loop is easy to tune */
    function sample(tt) {
      tt = tt % TOTAL;
      var s = { x: HOME_X, y: UP, a: 0, g: 0, blocks: [], placed: 0, belt: 0 }, i, j;
      if (tt >= WORK) {
        var r = tt - WORK;
        var slide = r > HOLD ? ease(Math.min((r - HOLD) / SWEEP, 1)) * 380 : 0;
        s.x = mix(slotX(N - 1), HOME_X, ease(Math.min(r / 800, 1)));
        for (i = 0; i < N; i++) s.blocks.push({ x: slotX(i) + slide, y: SHELF_TOP - HB, a: 0, ch: LETTERS[i], hot: false });
        s.placed = r > HOLD + SWEEP / 2 ? 0 : N;
        s.belt = N * 150;
        return s;
      }
      i = Math.floor(tt / CYC);
      var loc = tt - i * CYC, seg = 0;
      while (seg < SEG.length - 1 && loc >= SEG[seg]) { loc -= SEG[seg]; seg++; }
      var p = loc / SEG[seg], e = ease(p);
      var pk = pickInfo(i), fromX = i ? slotX(i - 1) : HOME_X;
      var shelfY = SHELF_TOP - HB - OFF;
      for (j = 0; j < i; j++) s.blocks.push({ x: slotX(j), y: SHELF_TOP - HB, a: 0, ch: LETTERS[j], hot: false });
      s.placed = i;
      s.belt = i * 150 + (seg === 0 ? out(p) : 1) * 150;
      var b = { x: PICK_X, y: pk.cy, a: pk.a, ch: LETTERS[i], hot: false };
      if (seg === 0) { s.x = mix(fromX, pk.px, e); s.a = mix(0, pk.a, e); b.x = mix(-40, PICK_X, out(p)); }
      else if (seg === 1) { s.x = pk.px; s.a = pk.a; s.y = mix(UP, pk.py, e); }
      else if (seg === 2) { s.x = pk.px; s.a = pk.a; s.y = pk.py; s.g = e; }
      else if (seg === 3) { s.x = pk.px; s.a = pk.a; s.y = mix(pk.py, UP, e); s.g = 1; }
      else if (seg === 4) { s.x = mix(pk.px, slotX(i), e); s.a = mix(pk.a, 0, e); s.g = 1; }
      else if (seg === 5) { s.x = slotX(i); s.y = mix(UP, shelfY, e); s.g = 1; }
      else if (seg === 6) { s.x = slotX(i); s.y = shelfY; s.g = 1 - e; }
      else { s.x = slotX(i); s.y = mix(shelfY, UP, e); }
      if (seg >= 2 && seg <= 5) {            // carried: follows the gripper
        b.x = s.x - OFF * Math.sin(s.a); b.y = s.y + OFF * Math.cos(s.a); b.a = s.a; b.hot = true;
      } else if (seg >= 6) {                 // set down on the shelf
        b.x = slotX(i); b.y = SHELF_TOP - HB; b.a = 0; s.placed = i + 1;
      }
      s.blocks.push(b);
      return s;
    }

    function block(x, y, a, ch, hot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      ctx.fillStyle = hot ? "#FFD21F" : "#fff";
      ctx.fillRect(-HB, -HB, BS, BS);
      ctx.fillStyle = "#000"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "900 21px Archivo, 'Arial Black', Arial, sans-serif";
      ctx.fillText(ch, 0, 1);
      ctx.restore();
    }

    function draw(s) {
      var i, x, gx, gy;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * ox, dpr * oy);
      ctx.fillStyle = "#1a1a1a";
      for (gy = 15; gy < 450; gy += 30) for (gx = 15; gx < 600; gx += 30) ctx.fillRect(gx - 1, gy - 1, 2, 2);
      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(0, FLOOR, 600, 2);

      // gantry frame and rail
      ctx.fillStyle = "#2f2f2f";
      ctx.fillRect(14, RAIL_Y, 12, FLOOR - RAIL_Y); ctx.fillRect(574, RAIL_Y, 12, FLOOR - RAIL_Y);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(14, RAIL_Y - 4, 572, 10);

      // conveyor
      ctx.fillStyle = "#2f2f2f";
      ctx.fillRect(40, BELT_TOP + 14, 8, FLOOR - BELT_TOP - 14); ctx.fillRect(150, BELT_TOP + 14, 8, FLOOR - BELT_TOP - 14);
      ctx.fillStyle = "#151515"; ctx.fillRect(-10, BELT_TOP, 214, 14);
      ctx.strokeStyle = "#555"; ctx.lineWidth = 1; ctx.strokeRect(-9.5, BELT_TOP + 0.5, 213, 13);
      ctx.fillStyle = "#4a4a4a";
      for (x = -22 + (s.belt % 22); x < 204; x += 22) ctx.fillRect(x, BELT_TOP + 6, 10, 2);
      for (i = 0; i < 2; i++) {
        var rx = i ? 196 : 4, ra = s.belt / 7;
        ctx.fillStyle = "#222"; ctx.strokeStyle = "#777";
        ctx.beginPath(); ctx.arc(rx, BELT_TOP + 7, 8, 0, PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx, BELT_TOP + 7); ctx.lineTo(rx + Math.cos(ra) * 7, BELT_TOP + 7 + Math.sin(ra) * 7); ctx.stroke();
      }

      // shelf with a faint outline of each slot
      var sl = slotX(0) - PITCH / 2 - 8, sw = N * PITCH + 16;
      ctx.fillStyle = "#2f2f2f";
      ctx.fillRect(sl + 14, SHELF_TOP + 10, 8, FLOOR - SHELF_TOP - 10); ctx.fillRect(sl + sw - 22, SHELF_TOP + 10, 8, FLOOR - SHELF_TOP - 10);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(sl, SHELF_TOP, sw, 10);
      ctx.setLineDash([3, 3]); ctx.strokeStyle = "#444"; ctx.lineWidth = 1;
      ctx.fillStyle = "#363636"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "900 21px Archivo, 'Arial Black', Arial, sans-serif";
      for (i = 0; i < N; i++) {
        ctx.strokeRect(slotX(i) - HB + 0.5, SHELF_TOP - BS + 0.5, BS - 1, BS - 1);
        ctx.fillText(LETTERS[i], slotX(i), SHELF_TOP - HB + 1);
      }
      ctx.setLineDash([]);

      for (i = 0; i < s.blocks.length; i++) block(s.blocks[i].x, s.blocks[i].y, s.blocks[i].a, s.blocks[i].ch, s.blocks[i].hot);

      // carriage, telescoping rod, wrist and gripper
      var len = s.y - RAIL_Y - 14;
      ctx.fillStyle = "#fff"; ctx.fillRect(s.x - 2, RAIL_Y + 14, 4, len);
      ctx.fillStyle = "#bdbdbd"; ctx.fillRect(s.x - 4, RAIL_Y + 14, 8, len * 0.55);
      ctx.fillStyle = "#FFD21F"; ctx.fillRect(s.x - 24, RAIL_Y - 9, 48, 23);
      ctx.fillStyle = "#000"; ctx.fillRect(s.x - 17, RAIL_Y - 2, 8, 8); ctx.fillRect(s.x + 9, RAIL_Y - 2, 8, 8);
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.a);
      ctx.fillStyle = "#fff"; ctx.fillRect(-31, 0, 62, GRIP);
      var hg = mix(27, HB + 1, s.g);
      ctx.fillRect(-hg - 4, GRIP, 4, 22); ctx.fillRect(hg, GRIP, 4, 22);
      ctx.restore();
      ctx.fillStyle = "#000"; ctx.strokeStyle = "#FFD21F"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, PI * 2); ctx.fill(); ctx.stroke();
    }

    function readout(s) {
      rdA.textContent = "x " + Math.round(s.x) + "   z " + Math.round(s.y - UP) + "   θ " + Math.round(s.a * 180 / PI) + "°";
      rdP.textContent = "placed " + s.placed + "/" + N;
    }

    function build() {
      var r = stage.getBoundingClientRect();
      W = Math.round(r.width); H = Math.round(r.height);
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      sc = Math.min(W / 600, H / 450); ox = (W - 600 * sc) / 2; oy = (H - 450 * sc) / 2;
    }

    var clock = 0, last = null, lastRead = 0;
    function tick(t) {
      requestAnimationFrame(tick);
      if (last === null) last = t;
      var dt = Math.min(t - last, 64); last = t;
      if (!visible || !W) return;
      // hold the opening frame until the loading screen has gone
      var ld = document.getElementById("loader");
      var waiting = ld && !ld.classList.contains("done") && t < 11000;
      if (!waiting) clock += dt;
      var s = sample(clock);
      draw(s);
      if (t - lastRead > 100) { lastRead = t; readout(s); }
    }

    function start() {
      build();
      if (!W) return;
      if (reduce) { var s = sample(WORK + 1000); draw(s); readout(s); }
    }

    start();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    if ("ResizeObserver" in window) {
      var rt;
      new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(start, 120); }).observe(stage);
    }
    if (reduce) return;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(stage);
    }
    requestAnimationFrame(tick);
  })();
})();
