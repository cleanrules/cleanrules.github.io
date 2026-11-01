// cleanrules site: theme toggle, mobile menu, tabs, copy button and reveal-on-scroll.
(() => {
  const root = document.documentElement;
  root.classList.add("js");

  // Theme: explicit choice wins, otherwise follow the system.
  const toggle = document.getElementById("theme-toggle");
  const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : systemDark();
  toggle?.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
  });

  // Mobile menu: a button shows and hides the page links on narrow screens.
  const menu = document.getElementById("nav-menu");
  const links = document.getElementById("nav-links");
  if (menu && links) {
    const setOpen = (open) => {
      links.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menu.addEventListener("click", () => setOpen(!links.classList.contains("open")));
    links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("open")) { setOpen(false); menu.focus(); }
    });
    window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  // Accessible tab lists: arrow keys, Home and End move between tabs.
  function setupTabs(list, onSelect) {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      onSelect(tab);
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        let j = null;
        if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") j = 0;
        else if (e.key === "End") j = tabs.length - 1;
        if (j === null) return;
        e.preventDefault();
        const next = tabs[j];
        next.focus();
        select(next);
      });
    });
  }

  // Explain demo scenarios.
  const scenarioTabs = document.querySelector('.demo-out [role="tablist"]');
  if (scenarioTabs) {
    const input = document.getElementById("demo-input");
    setupTabs(scenarioTabs, (tab) => {
      document.querySelectorAll('.demo-out [role="tabpanel"]').forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      });
      if (input && tab.dataset.input) input.textContent = tab.dataset.input;
    });
  }

  // API preview per language.
  const codeTabs = document.querySelector(".code-tabs");
  if (codeTabs) {
    setupTabs(codeTabs, (tab) => {
      document.querySelectorAll(".preview pre[data-lang]").forEach((pre) => {
        pre.hidden = pre.dataset.lang !== tab.dataset.lang;
      });
    });
  }

  // Generic tab groups: each tab names its panel with aria-controls.
  document.querySelectorAll("[data-tabgroup]").forEach((list) => {
    const panels = [...list.querySelectorAll('[role="tab"]')].map((t) => document.getElementById(t.getAttribute("aria-controls")));
    setupTabs(list, (tab) => {
      const id = tab.getAttribute("aria-controls");
      panels.forEach((panel) => { if (panel) panel.hidden = panel.id !== id; });
    });
  });

  // Reference menu in the header (a disclosure button; links are always visible on phones).
  document.querySelectorAll(".nav-drop").forEach((drop) => {
    const btn = drop.querySelector(".nav-drop-btn");
    const sub = drop.querySelector(".nav-sub");
    if (!btn || !sub) return;
    const setOpen = (open) => { sub.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); setOpen(!sub.classList.contains("open")); });
    document.addEventListener("click", (e) => { if (!drop.contains(e.target)) setOpen(false); });
    drop.addEventListener("keydown", (e) => { if (e.key === "Escape" && sub.classList.contains("open")) { setOpen(false); btn.focus(); } });
    drop.addEventListener("focusout", (e) => { if (!drop.contains(e.relatedTarget)) setOpen(false); });
  });

  // Language tabs: choosing a language selects it in every tab list of the page,
  // and the choice is remembered for the next page.
  const langLists = [...document.querySelectorAll("[data-langtabs]")];
  if (langLists.length) {
    const choose = (lang, save) => {
      langLists.forEach((list) => {
        const tab = list.querySelector(`[role="tab"][data-lang="${lang}"]`);
        if (tab && tab.getAttribute("aria-selected") !== "true") tab.click();
      });
      if (save) { try { localStorage.setItem("lang", lang); } catch (e) { /* storage unavailable */ } }
    };
    let syncing = false;
    langLists.forEach((list) => {
      list.querySelectorAll('[role="tab"]').forEach((tab) => {
        tab.addEventListener("click", () => {
          if (!syncing) { syncing = true; choose(tab.dataset.lang, true); syncing = false; }
        });
      });
    });
    let saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) { /* storage unavailable */ }
    if (saved) { syncing = true; choose(saved, false); syncing = false; }
  }

  // Manual: the chapter list folds away on narrow screens.
  const side = document.querySelector(".doc-side details");
  if (side && window.matchMedia("(max-width: 960px)").matches) side.open = false;

  // Manual: highlight the section being read in the on-page table of contents.
  const tocLinks = [...document.querySelectorAll(".doc-toc a")];
  if (tocLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove("active"));
          byId.get(entry.target.id)?.classList.add("active");
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    byId.forEach((_, id) => { const h = document.getElementById(id); if (h) spy.observe(h); });
  }

  // Copy buttons.
  document.querySelectorAll(".copy[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = document.getElementById(btn.dataset.copy)?.innerText ?? "";
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
      } catch (e) {
        btn.textContent = "Select & copy";
      }
      setTimeout(() => { btn.textContent = "Copy"; }, 1600);
    });
  });

  // Reveal sections as they scroll into view.
  const targets = document.querySelectorAll(".section:not(.no-reveal) .wrap > *, .card, .feature, .timeline li, .lang");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }
})();
