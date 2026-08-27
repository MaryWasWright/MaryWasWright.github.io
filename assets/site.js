(function () {
  var panel = document.querySelector("[data-menu]");
  var openBtn = document.querySelector("[data-open-menu]");
  var closeBtn = document.querySelector("[data-close-menu]");
  if (!panel || !openBtn) return;

  function openMenu(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    panel.classList.add("is-open");
    panel.removeAttribute("hidden");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu() {
    panel.classList.remove("is-open");
    panel.setAttribute("hidden", "");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openMenu);
  openBtn.addEventListener("touchend", function (e) {
    e.preventDefault();
    openMenu(e);
  }, { passive: false });

  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  panel.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
})();

(function () {
  var list = document.querySelector("[data-article-list]");
  if (!list) return;
  var search = document.querySelector("[data-search]");
  var chips = document.querySelector("[data-chips]");
  var count = document.querySelector("[data-count]");
  var topic = "";
  var articles = [];

  function render() {
    var q = (search && search.value ? search.value : "").trim().toLowerCase();
    var shown = articles.filter(function (a) {
      if (topic && a.topic !== topic) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().indexOf(q) !== -1 ||
        a.source.toLowerCase().indexOf(q) !== -1 ||
        a.summary.toLowerCase().indexOf(q) !== -1 ||
        a.topic.toLowerCase().indexOf(q) !== -1
      );
    });
    if (count) count.textContent = shown.length + (shown.length === 1 ? " source" : " sources");
    if (!shown.length) {
      list.innerHTML = '<li class="paper-card">Nothing on this shelf matches. Try another word or clear the filter.</li>';
      return;
    }
    list.innerHTML = shown.map(function (a) {
      var year = a.year || "n.d.";
      return (
        '<li><a class="paper-card" href="' + a.url + '" target="_blank" rel="noopener noreferrer">' +
        '<div style="display:flex;justify-content:space-between;gap:0.75rem;margin-bottom:0.5rem">' +
        '<span class="topic">' + a.topic + "</span><span class=\"src\">" + year + "</span></div>" +
        "<h3>" + a.title + "</h3>" +
        '<p class="src">' + a.source + "</p>" +
        "<p>" + a.summary + "</p>" +
        "<span style=\"margin-top:1rem;font-weight:600;color:var(--ink)\">Open source</span>" +
        "</a></li>"
      );
    }).join("");
  }

  fetch("data/articles.json?v=beyond1")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      articles = data;
      var topics = [];
      data.forEach(function (a) {
        if (topics.indexOf(a.topic) === -1) topics.push(a.topic);
      });
      if (chips) {
        chips.innerHTML =
          '<button type="button" data-topic="" class="is-on">All topics</button>' +
          topics.map(function (t) {
            return '<button type="button" data-topic="' + t + '">' + t + "</button>";
          }).join("");
        chips.addEventListener("click", function (e) {
          var btn = e.target.closest("button");
          if (!btn) return;
          topic = btn.getAttribute("data-topic") || "";
          chips.querySelectorAll("button").forEach(function (b) {
            b.classList.toggle("is-on", b === btn);
          });
          render();
        });
      }
      render();
    });

  if (search) search.addEventListener("input", render);
})();
