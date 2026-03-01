const projects = [
  { id: "furtgoh", video: "assets/01-furtgoh/01-furtgoh-0.webm" },
  {
    id: "pharmaziemuseum",
    video: "assets/02-pharmaziemuseum/02-pharmaziemuseum-0.webm",
  },
  { id: "ofletters", video: "assets/03-ofletters/03-ofletters-0.webm" },
  {
    id: "jointhecampuslifeathgkbasel",
    video:
      "assets/04-jointhecampuslifeathgkbasel/04-jointhecampuslifeathgkbasel-0.webm",
  },
  { id: "llunibot77", video: "assets/05-llunibot77/05-llunibot77-0.webm" },
  {
    id: "cocreatehs25",
    video: "assets/06-cocreatehs25/06-cocreatehs25-0.webm",
  },
  {
    id: "schalenwelten",
    video: "assets/07-schalenwelten/07-schalenwelten-0.webm",
  },
  { id: "fontastic", video: "assets/08-fontastic/08-fontastic-0.webm" },
  { id: "documenta16", video: "assets/09-documenta16/09-documenta16-0.webm" },
  {
    id: "hgkstudienfuehrer",
    video: "assets/10-hgkstudienfuehrer/10-hgkstudienfuehrer-0.webm",
  },
  { id: "waswenn", video: "assets/11-waswenn/11-waswenn-0.webm" },
  {
    id: "selectedworks",
    video: "assets/12-selectedworks/12-selectedworks-0.webm",
  },
  { id: "lost", video: "assets/13-lost/13-lost-0.webm" },
];

let currentIndex = Math.floor(Math.random() * projects.length);
const video = document.getElementById("trailer-video");
const fadeOutDuration = 1;
const fadeInDelay = 300;
const hoverFadeDuration = 400;
let fadeOutTimer = null;
let isHovering = false;
let switchTimeout = null;

function initTrailerPlayer() {
  playTrailer(currentIndex);

  video.addEventListener("timeupdate", () => {
    if (isHovering) return;
    const timeRemaining = video.duration - video.currentTime;

    if (timeRemaining <= fadeOutDuration && timeRemaining > 0) {
      if (!fadeOutTimer) {
        video.style.transition = "opacity 1s ease-out";
        video.style.opacity = "0";
        fadeOutTimer = true;
      }
    }
  });

  video.addEventListener("ended", () => {
    fadeOutTimer = null;
    currentIndex = (currentIndex + 1) % projects.length;
    playTrailer(currentIndex);
  });

  const headerProjects = document.querySelector(".header-projects");
  const projectLinks = document.querySelectorAll(".header-projects a.nav-link");

  projectLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const href = link.getAttribute("href");
      const projectIndex = projects.findIndex(
        (p) => href && href.includes(p.id),
      );
      if (
        projectIndex !== -1 &&
        !document.body.classList.contains("menu-open")
      ) {
        isHovering = true;
        video.loop = true;
        fadeOutTimer = null;
        if (projectIndex !== currentIndex) {
          currentIndex = projectIndex;
          playTrailer(currentIndex, true);
        }
      }
    });
  });

  if (headerProjects) {
    headerProjects.addEventListener("mouseleave", () => {
      isHovering = false;
      video.loop = false;
    });
  }
}

function playTrailer(index, smooth) {
  const project = projects[index];

  if (switchTimeout) {
    clearTimeout(switchTimeout);
    switchTimeout = null;
  }

  if (smooth) {
    video.style.transition = "opacity " + hoverFadeDuration + "ms ease";
    video.style.opacity = "0";

    switchTimeout = setTimeout(() => {
      switchTimeout = null;
      loadAndPlay(project);
    }, hoverFadeDuration);
  } else {
    video.style.opacity = "0";
    loadAndPlay(project);
  }

  highlightNavLink(project.id);
}

function getVideoPath(project) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  return isMobile ? project.video.replace(".webm", "-hf.webm") : project.video;
}

function loadAndPlay(project) {
  video.innerHTML = "";
  video.removeAttribute("src");

  const videoPath = getVideoPath(project);

  const webmSource = document.createElement("source");
  webmSource.src = videoPath;
  webmSource.type = "video/webm";
  video.appendChild(webmSource);

  const mp4Source = document.createElement("source");
  mp4Source.src = videoPath.replace(".webm", ".mp4");
  mp4Source.type = "video/mp4";
  video.appendChild(mp4Source);

  video.load();

  const startVideoPlayback = () => {
    video.play().catch(() => {});

    if (isHovering) {
      video.style.transition = "opacity " + hoverFadeDuration + "ms ease";
      video.style.opacity = "1";
    } else {
      setTimeout(() => {
        video.style.transition = "opacity 2s ease-in";
        video.style.opacity = "1";
      }, fadeInDelay);
    }
  };

  video.addEventListener(
    "error",
    () => {
      fadeOutTimer = null;
      currentIndex = (currentIndex + 1) % projects.length;
      playTrailer(currentIndex);
    },
    { once: true },
  );

  if (video.readyState >= 3) {
    startVideoPlayback();
  } else {
    video.addEventListener("canplay", startVideoPlayback, { once: true });
  }
}

function highlightNavLink(projectId) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  const links = document.querySelectorAll(".header-projects a.nav-link");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(projectId)) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("headerLoaded", () => {
  initTrailerPlayer();
});
