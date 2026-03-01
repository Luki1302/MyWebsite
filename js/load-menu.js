document.addEventListener("headerLoaded", () => {
  initMenu();
});

function initMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const menuOverlay = document.getElementById("menu-overlay");
  const trailerContainer = document.querySelector(".trailer-container");
  const infoPanels = document.querySelectorAll(".info-content");
  const menuNavLinks = document.querySelectorAll(".menu-nav-link");

  if (!menuToggle || !menuOverlay) {
    console.error("Menu-Elemente nicht gefunden!");
    return;
  }

  let lockedContent = null;

  function openFullMenu() {
    menuOverlay.classList.add("active");
    if (trailerContainer) trailerContainer.classList.add("blurred");
    document.body.classList.add("menu-open");
    document.body.classList.remove("nav-preview");
    menuToggle.textContent = "Close";

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isDetailPage =
      document.body.classList.contains("detail-page") &&
      !document.body.classList.contains("page-projects");
    if (isMobile && isDetailPage) {
      const headerProjects = document.querySelector(".header-projects");
      const activeLink = document.querySelector(
        ".header-projects .nav-link.active",
      );
      if (headerProjects) {
        headerProjects.style.setProperty("animation", "none", "important");
        headerProjects.style.transition = "none";

        let clipTop = 0,
          clipBottom = 0;
        if (activeLink) {
          const navRect = headerProjects.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          const allLinks = headerProjects.querySelectorAll(".nav-link");
          clipTop = linkRect.top - navRect.top;
          clipBottom = navRect.bottom - linkRect.bottom;
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
        }

        headerProjects.style.clipPath = `inset(${clipTop}px 0 ${clipBottom}px 0)`;
        headerProjects.style.transform = `translateY(-${clipTop}px)`;

        void headerProjects.offsetHeight;
        headerProjects.style.transition =
          "clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        headerProjects.style.clipPath = "inset(0 0 0 0)";
        headerProjects.style.transform = "translateY(0)";

        setTimeout(() => {
          headerProjects.style.removeProperty("clip-path");
          headerProjects.style.removeProperty("transform");
          headerProjects.style.removeProperty("transition");
        }, 550);
      }
    }
  }

  function closeFullMenu() {
    menuOverlay.classList.remove("active");
    if (trailerContainer) trailerContainer.classList.remove("blurred");
    document.body.classList.remove("menu-open");
    document.body.classList.remove("project-preview");
    menuToggle.textContent = "Menu";
    lockedContent = null;
    hideContent();

    const headerProjects = document.querySelector(".header-projects");
    if (headerProjects) {
      headerProjects.style.removeProperty("animation");
      headerProjects.style.removeProperty("clip-path");
      headerProjects.style.removeProperty("transform");
      headerProjects.style.removeProperty("transition");
    }
  }

  const isTouch = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;

  menuNavLinks.forEach((link) => {
    const contentType = link.getAttribute("data-content");
    if (!contentType) return;

    if (!isTouch) {
      link.addEventListener("mouseenter", () => {
        if (!lockedContent && document.body.classList.contains("menu-open")) {
          showContent(contentType);
        }
      });

      link.addEventListener("mouseleave", () => {
        if (!lockedContent && document.body.classList.contains("menu-open")) {
          hideContent();
        }
      });
    }

    link.addEventListener("click", () => {
      if (!document.body.classList.contains("menu-open")) {
        openFullMenu();
        lockedContent = contentType;
        showContent(contentType);
      } else {
        if (lockedContent === contentType) {
          lockedContent = null;
          hideContent();
        } else {
          lockedContent = contentType;
          showContent(contentType);
        }
      }
    });
  });

  function showContent(contentType) {
    infoPanels.forEach((panel) => panel.classList.remove("visible"));
    const target = document.querySelector(
      `.info-content[data-panel="${contentType}"]`,
    );
    if (target) target.classList.add("visible");
  }

  function hideContent() {
    infoPanels.forEach((panel) => panel.classList.remove("visible"));
  }

  menuToggle.addEventListener("click", () => {
    if (menuOverlay.classList.contains("active")) {
      closeFullMenu();
    } else {
      openFullMenu();
    }
  });

  menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) {
      closeFullMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOverlay.classList.contains("active")) {
      closeFullMenu();
    }
  });

  const isDetailPage =
    document.body.classList.contains("detail-page") &&
    !document.body.classList.contains("page-projects");

  if (isDetailPage) {
    const headerProjectLinks = document.querySelectorAll(
      ".header-projects .nav-link",
    );
    let projectPreviewTimeout;

    function openProjectPreview() {
      clearTimeout(projectPreviewTimeout);
      if (!document.body.classList.contains("menu-open")) {
        document.body.classList.add("project-preview");
      }
    }

    function scheduleCloseProjectPreview() {
      projectPreviewTimeout = setTimeout(() => {
        if (!document.body.classList.contains("menu-open")) {
          document.body.classList.remove("project-preview");
        }
      }, 150);
    }

    headerProjectLinks.forEach((link) => {
      link.addEventListener("mouseenter", openProjectPreview);
      link.addEventListener("mouseleave", scheduleCloseProjectPreview);
    });

    document.addEventListener(
      "scroll",
      () => {
        if (document.body.classList.contains("project-preview")) {
          document.body.classList.remove("project-preview");
        }
      },
      { passive: true },
    );
  }
}
