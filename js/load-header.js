(function () {
  var isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
  var v = document.createElement("video");
  var canWebM =
    v.canPlayType('video/webm; codecs="vp9, opus"') ||
    v.canPlayType('video/webm; codecs="vp8, vorbis"');
  if (isMobile || !canWebM) {
    document.querySelectorAll('a[href$=".webm"]').forEach(function (link) {
      link.href = link.href.replace(/\.webm$/, ".mp4");
    });
  }
})();

const cursorEl = document.createElement("div");
cursorEl.className = "cursor-circle";
document.body.appendChild(cursorEl);
document.addEventListener("mousemove", (e) => {
  cursorEl.style.left = e.clientX + "px";
  cursorEl.style.top = e.clientY + "px";
});
document.addEventListener("mouseleave", () => {
  cursorEl.style.opacity = "0";
});
document.addEventListener("mouseenter", () => {
  cursorEl.style.opacity = "1";
});

(function () {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const navType = (performance.getEntriesByType("navigation")[0] || {}).type;
  if (navType === "reload") {
    localStorage.removeItem("darkMode");
  }
  const stored = localStorage.getItem("darkMode");
  const shouldBeDark =
    stored !== null ? stored === "true" : prefersDark.matches;
  if (shouldBeDark) {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
})();

(function () {
  const saved = sessionStorage.getItem("transitionColor");
  const savedText = sessionStorage.getItem("transitionText");
  const savedType = sessionStorage.getItem("transitionType");
  const isDarkMode = document.documentElement.classList.contains("dark");
  const pageColor = document.body.classList.contains("detail-page")
    ? isDarkMode
      ? "black"
      : "white"
    : "black";
  document.body.style.setProperty("--transition-bg", saved || pageColor);
  if (saved) sessionStorage.removeItem("transitionColor");
  if (savedText) {
    sessionStorage.removeItem("transitionText");
    sessionStorage.removeItem("transitionType");
    const colorClass = (saved || pageColor) === "black" ? "dark" : "light";
    const overlay = document.createElement("div");
    overlay.className = `transition-overlay intro ${savedType || "type-detail"} ${colorClass}`;
    const text = document.createElement("span");
    text.className = "transition-text";
    text.textContent = savedText;
    overlay.appendChild(text);
    document.body.appendChild(overlay);
  }
})();

fetch("/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
    if (sessionStorage.getItem("menuWasOpen")) {
      sessionStorage.removeItem("menuWasOpen");
      const hp = document.querySelector(".header-projects");
      if (hp) {
        hp.style.transition = "none";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            hp.style.transition = "";
          });
        });
      }
    }
    const pageTitle = document.body.getAttribute("data-page-title");
    const indicator = document.querySelector(".page-title-indicator");
    const isDetailPage =
      document.body.classList.contains("detail-page") &&
      !document.body.classList.contains("page-projects");
    const isMobileLayout = window.matchMedia("(max-width: 767px)").matches;
    if (indicator) {
      if (isDetailPage) {
        if (isMobileLayout) {
          const projectLink = document.querySelector(
            `.header-projects a[href="${window.location.pathname}"]`,
          );
          indicator.innerHTML = projectLink
            ? projectLink.innerHTML
            : pageTitle || "";
        } else {
          indicator.textContent = "Projects";
        }
      } else if (pageTitle) {
        indicator.textContent = pageTitle;
      }
    }
    const currentPath = window.location.pathname;
    document.querySelectorAll(".header-projects .nav-link").forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
        link.addEventListener("click", (e) => e.preventDefault());
      }
    });
    if (isDetailPage) {
      const activeLink = document.querySelector(
        ".header-projects .nav-link.active",
      );
      const headerProjects = document.querySelector(".header-projects");
      if (activeLink && headerProjects) {
        requestAnimationFrame(() => {
          const navRect = headerProjects.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          const allLinks = headerProjects.querySelectorAll(".nav-link");
          let clipTop = linkRect.top - navRect.top;
          let clipBottom = navRect.bottom - linkRect.bottom;
          for (let i = 0; i < allLinks.length; i++) {
            if (allLinks[i] === activeLink) {
              if (i > 0) {
                const prevBottom =
                  allLinks[i - 1].getBoundingClientRect().bottom;
                clipTop = (linkRect.top + prevBottom) / 2 - navRect.top;
              }
              if (i < allLinks.length - 1) {
                const nextTop = allLinks[i + 1].getBoundingClientRect().top;
                clipBottom =
                  navRect.bottom - (linkRect.bottom + nextTop) / 2 + 3;
              }
              break;
            }
          }
          headerProjects.style.setProperty("--clip-top", `${clipTop}px`);
          headerProjects.style.setProperty("--clip-bottom", `${clipBottom}px`);
        });
      }
    }
    function getTransitionText(href) {
      if (href === "/index.html") return "Lukas Hecht";
      if (href === "/projects.html") return "Projects";
      const link = document.querySelector(`.header-projects a[href="${href}"]`);
      return link ? link.textContent.replace(/\s+/g, " ").trim() : "";
    }

    function getTransitionType(href) {
      if (href === "/index.html") return "type-home";
      if (href === "/projects.html") return "type-projects";
      return "type-detail";
    }

    function createOutroOverlay(href) {
      const text = getTransitionText(href);
      if (!text) return;
      const type = getTransitionType(href);
      const isDark = document.documentElement.classList.contains("dark");
      const destColor = href !== "/index.html" && !isDark ? "white" : "black";
      sessionStorage.setItem("transitionText", text);
      sessionStorage.setItem("transitionType", type);
      const overlay = document.createElement("div");
      overlay.className = `transition-overlay outro ${type} ${destColor === "black" ? "dark" : "light"}`;
      const textEl = document.createElement("span");
      textEl.className = "transition-text";
      textEl.textContent = text;
      overlay.appendChild(textEl);
      document.body.appendChild(overlay);
    }

    function fadeAndNavigate(href) {
      const isDark = document.documentElement.classList.contains("dark");
      const destColor = href !== "/index.html" && !isDark ? "white" : "black";
      if (document.body.classList.contains("menu-open")) {
        sessionStorage.setItem("menuWasOpen", "true");
      }
      sessionStorage.setItem("transitionColor", destColor);
      document.body.style.setProperty("--transition-bg", destColor);
      document.body.classList.add("page-leaving");
      createOutroOverlay(href);
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    }

    function navigateWithTransition(href) {
      const headerProjects = document.querySelector(".header-projects");
      if (!headerProjects) {
        fadeAndNavigate(href);
        return;
      }

      const clickedLink = headerProjects.querySelector(`a[href="${href}"]`);
      let clipTop = 0,
        clipBottom = 0;
      if (clickedLink) {
        const navRect = headerProjects.getBoundingClientRect();
        const linkRect = clickedLink.getBoundingClientRect();
        clipTop = linkRect.top - navRect.top;
        clipBottom = navRect.bottom - linkRect.bottom;
        const allLinks = headerProjects.querySelectorAll(".nav-link");
        for (let i = 0; i < allLinks.length; i++) {
          if (allLinks[i] === clickedLink) {
            if (i > 0) {
              const prevBottom = allLinks[i - 1].getBoundingClientRect().bottom;
              clipTop = (linkRect.top + prevBottom) / 2 - navRect.top;
            }
            if (i < allLinks.length - 1) {
              const nextTop = allLinks[i + 1].getBoundingClientRect().top;
              clipBottom = navRect.bottom - (linkRect.bottom + nextTop) / 2 + 3;
            }
            break;
          }
        }
      }

      if (document.body.classList.contains("menu-open")) {
        sessionStorage.setItem("menuWasOpen", "true");
        document.getElementById("menu-overlay")?.classList.remove("active");
        document
          .querySelector(".trailer-container")
          ?.classList.remove("blurred");
        document.body.classList.remove("menu-open");
        const menuToggle = document.getElementById("menu-toggle");
        if (menuToggle) menuToggle.textContent = "Menu";
      }

      if (clickedLink) {
        clickedLink.classList.add("active");
        headerProjects.style.clipPath = `inset(${clipTop}px 0 ${clipBottom}px 0)`;
        headerProjects.style.transform = `translateY(-${clipTop}px)`;
      } else {
        headerProjects.style.clipPath = "inset(0 0 100% 0)";
      }

      const isDark = document.documentElement.classList.contains("dark");
      const destColor = href !== "/index.html" && !isDark ? "white" : "black";
      setTimeout(() => {
        sessionStorage.setItem("transitionColor", destColor);
        document.body.style.setProperty("--transition-bg", destColor);
        document.body.classList.add("page-leaving");
        createOutroOverlay(href);
      }, 250);

      setTimeout(() => {
        window.location.href = href;
      }, 800);
    }

    document
      .querySelectorAll(".header-projects .nav-link:not(.active)")
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          navigateWithTransition(link.getAttribute("href"));
        });
      });

    if (indicator && isDetailPage) {
      indicator.addEventListener("click", (e) => {
        e.preventDefault();
        if (!window.matchMedia("(max-width: 767px)").matches) {
          fadeAndNavigate("/projects.html");
        }
      });
    }

    document.querySelectorAll(".project-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        navigateWithTransition(item.getAttribute("href"));
      });
    });

    document
      .querySelectorAll('.header .nav-link[href="/index.html"]')
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          if (
            window.location.pathname === "/index.html" &&
            !document.body.classList.contains("menu-open")
          )
            return;
          e.preventDefault();
          fadeAndNavigate("/index.html");
        });
      });

    const projectsMenuLink = document.querySelector(
      '.menu-nav-link[href="/projects.html"]',
    );
    if (projectsMenuLink) {
      projectsMenuLink.addEventListener("click", (e) => {
        e.preventDefault();
        fadeAndNavigate("/projects.html");
      });
    }

    if (document.body.classList.contains("detail-page")) {
      const preventScroll = (e) => {
        if (document.body.classList.contains("menu-open")) {
          if (e.target.closest && e.target.closest(".info-panel")) return;
          e.preventDefault();
        }
      };
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
    }

    if (document.body.classList.contains("detail-page")) {
      const header = document.querySelector(".header");
      let lastScrollY = window.scrollY;

      window.addEventListener("scroll", () => {
        if (document.body.classList.contains("menu-open")) return;

        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          header.classList.add("header-hidden");
        } else {
          header.classList.remove("header-hidden");
        }
        lastScrollY = currentScrollY;
      });

      new MutationObserver(() => {
        if (!document.body.classList.contains("menu-open")) {
          header.classList.remove("header-hidden");
          lastScrollY = window.scrollY;
        }
      }).observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        let stagger = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => el.classList.add("in-view"), stagger);
            stagger += 80;
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (
      document.body.classList.contains("detail-page") &&
      !document.body.classList.contains("page-projects")
    ) {
      for (const child of document.body.children) {
        if (
          child.classList.contains("detail-info") ||
          child.classList.contains("flex-container") ||
          child.classList.contains("video-player") ||
          child.tagName === "VIDEO"
        ) {
          revealObserver.observe(child);
        }
      }
    }
    if (document.body.classList.contains("page-projects")) {
      document.querySelectorAll(".project-item").forEach((el) => {
        revealObserver.observe(el);
      });
    }

    const introOverlay = document.querySelector(".transition-overlay.intro");
    if (introOverlay) {
      requestAnimationFrame(() => {
        introOverlay.classList.add("exit");
      });
      setTimeout(() => {
        document.body.classList.add("page-ready");
      }, 150);
      setTimeout(() => {
        introOverlay.remove();
      }, 600);
    } else {
      requestAnimationFrame(() => {
        document.body.classList.add("page-ready");
      });
    }

    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
    let mouseX = 0,
      mouseY = 0;
    if (!isTouchDevice) {
      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.querySelectorAll(".info-link").forEach((link) => {
          const rect = link.getBoundingClientRect();
          if (
            mouseX >= rect.left &&
            mouseX <= rect.right &&
            mouseY >= rect.top &&
            mouseY <= rect.bottom
          ) {
            link.classList.add("info-link-hover");
          } else {
            link.classList.remove("info-link-hover");
          }
        });
      });
      document.addEventListener("click", () => {
        if (!document.body.classList.contains("menu-open")) return;
        document
          .querySelectorAll(".info-content.visible .info-link")
          .forEach((link) => {
            const rect = link.getBoundingClientRect();
            if (
              mouseX >= rect.left &&
              mouseX <= rect.right &&
              mouseY >= rect.top &&
              mouseY <= rect.bottom
            ) {
              window.open(link.href, link.target || "_self");
            }
          });
      });
    }

    if (document.body.classList.contains("detail-page")) {
      const scrollbar = document.createElement("div");
      scrollbar.className = "page-scrollbar";
      const thumb = document.createElement("div");
      thumb.className = "page-scrollbar-thumb";
      scrollbar.appendChild(thumb);
      document.body.appendChild(scrollbar);

      function updateScrollbar() {
        const scrollTop = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollableHeight = totalHeight - viewportHeight;
        if (scrollableHeight <= 0) {
          thumb.style.display = "none";
          return;
        }
        thumb.style.display = "";
        const thumbPct = (viewportHeight / totalHeight) * 100;
        const topPct = (scrollTop / scrollableHeight) * (100 - thumbPct);
        thumb.style.height = thumbPct + "%";
        thumb.style.top = topPct + "%";
      }

      window.addEventListener("scroll", updateScrollbar, { passive: true });
      window.addEventListener("resize", updateScrollbar);
      updateScrollbar();

      let sbDragging = false;
      let sbStartY = 0;
      let sbStartScroll = 0;

      thumb.addEventListener("mousedown", function (e) {
        sbDragging = true;
        sbStartY = e.clientY;
        sbStartScroll = window.scrollY;
        e.preventDefault();
      });

      document.addEventListener("mousemove", function (e) {
        if (!sbDragging) return;
        const totalHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const thumbPct = (viewportHeight / totalHeight) * 100;
        const usableTrack = viewportHeight * (1 - thumbPct / 100);
        const delta =
          ((e.clientY - sbStartY) / usableTrack) *
          (totalHeight - viewportHeight);
        window.scrollTo(0, sbStartScroll + delta);
      });

      document.addEventListener("mouseup", function () {
        sbDragging = false;
      });
    }

    const darkmodeToggle = document.getElementById("darkmode-toggle");
    if (darkmodeToggle) {
      const root = document.documentElement;

      function applyTheme(isDark) {
        root.classList.toggle("dark", isDark);
        root.classList.toggle("light", !isDark);
        darkmodeToggle.textContent = isDark ? "Light" : "Dark";
      }

      applyTheme(root.classList.contains("dark"));

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      prefersDark.addEventListener("change", (e) => {
        if (localStorage.getItem("darkMode") === null) {
          applyTheme(e.matches);
        }
      });

      darkmodeToggle.addEventListener("click", () => {
        const nowDark = !root.classList.contains("dark");
        applyTheme(nowDark);
        localStorage.setItem("darkMode", nowDark);
      });
    }

    document.dispatchEvent(new Event("headerLoaded"));
  });
