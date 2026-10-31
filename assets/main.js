// cleanrules site: theme toggle, tabs, copy button and reveal-on-scroll.
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

  // Accessible tab lists: arrow keys move between tabs.
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
        const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const next = tabs[(i + step + tabs.length) % tabs.length];
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
  const targets = document.querySelectorAll(".section .wrap > *, .card, .feature, .timeline li, .lang");
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
