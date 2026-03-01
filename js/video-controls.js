(function () {
  function addMuteButton(wrapper, video) {
    wrapper.style.position = "relative";

    var controlsBar = document.createElement("div");
    controlsBar.className = "video-controls-bar";

    var muteBtn = document.createElement("button");
    muteBtn.className = "video-ctrl-btn";
    muteBtn.dataset.control = "mute";
    muteBtn.textContent = "UNMUTE";

    controlsBar.appendChild(muteBtn);
    wrapper.appendChild(controlsBar);

    muteBtn.addEventListener("click", function () {
      if (video.muted) {
        document
          .querySelectorAll(
            ".video-player, .video-player-mute, .video-mute-wrapper",
          )
          .forEach(function (other) {
            var otherVideo = other.querySelector("video");
            var otherBtn = other.querySelector('[data-control="mute"]');
            if (otherVideo && otherVideo !== video) {
              otherVideo.muted = true;
              if (otherBtn) otherBtn.textContent = "UNMUTE";
            }
          });
        video.muted = false;
        if (video.paused) video.play().catch(function () {});
        muteBtn.textContent = "MUTE";
      } else {
        video.muted = true;
        muteBtn.textContent = "UNMUTE";
      }
    });
  }

  function initVideoPlayers() {
    var wrappers = document.querySelectorAll(".video-player");
    if (
      !wrappers.length &&
      !document.querySelectorAll(".video-player-mute").length &&
      !document.querySelectorAll(".video-mute-wrapper").length
    )
      return;

    wrappers.forEach(function (wrapper) {
      var video = wrapper.querySelector("video");
      if (!video) return;

      var frame = document.createElement("div");
      frame.className = "video-player-frame";
      wrapper.insertBefore(frame, video);
      frame.appendChild(video);

      var timeline = document.createElement("div");
      timeline.className = "video-timeline";
      var progressBar = document.createElement("div");
      progressBar.className = "video-timeline-progress";
      timeline.appendChild(progressBar);
      frame.appendChild(timeline);

      var controlsBar = document.createElement("div");
      controlsBar.className = "video-controls-bar";

      var pauseBtn = document.createElement("button");
      pauseBtn.className = "video-ctrl-btn";
      pauseBtn.dataset.control = "pause";
      pauseBtn.textContent = "PAUSE";

      var muteBtn = document.createElement("button");
      muteBtn.className = "video-ctrl-btn";
      muteBtn.dataset.control = "mute";
      muteBtn.textContent = "UNMUTE";

      var isTouchDevice =
        "ontouchstart" in window ||
        (window.matchMedia &&
          window.matchMedia("(hover: none) and (pointer: coarse)").matches);

      if (isTouchDevice) {
        var fsBtn = document.createElement("button");
        fsBtn.className = "video-ctrl-btn";
        fsBtn.dataset.control = "fullscreen";
        fsBtn.textContent = "FULL";
        controlsBar.appendChild(fsBtn);

        fsBtn.addEventListener("click", function () {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
          }
        });
      }

      controlsBar.appendChild(pauseBtn);
      controlsBar.appendChild(muteBtn);
      frame.appendChild(controlsBar);

      video.addEventListener("timeupdate", function () {
        if (video.duration) {
          progressBar.style.width =
            (video.currentTime / video.duration) * 100 + "%";
        }
      });

      var seeking = false;
      var wasPlayingBeforeSeek = false;

      function seekTo(e) {
        var rect = timeline.getBoundingClientRect();
        var ratio = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width),
        );
        if (video.duration) {
          video.currentTime = ratio * video.duration;
          progressBar.style.width = ratio * 100 + "%";
        }
      }

      timeline.addEventListener("mousedown", function (e) {
        seeking = true;
        wasPlayingBeforeSeek = !video.paused;
        video.pause();
        seekTo(e);
      });

      document.addEventListener("mousemove", function (e) {
        if (seeking) seekTo(e);
      });

      document.addEventListener("mouseup", function () {
        if (seeking) {
          seeking = false;
          if (wasPlayingBeforeSeek) {
            video.play();
          }
        }
      });

      pauseBtn.addEventListener("click", function () {
        if (video.paused) {
          video.play();
          pauseBtn.textContent = "PAUSE";
        } else {
          video.pause();
          pauseBtn.textContent = "PLAY";
        }
      });

      muteBtn.addEventListener("click", function () {
        if (video.muted) {
          document
            .querySelectorAll(
              ".video-player, .video-player-mute, .video-mute-wrapper",
            )
            .forEach(function (other) {
              var otherVideo = other.querySelector("video");
              var otherBtn = other.querySelector('[data-control="mute"]');
              if (otherVideo && otherVideo !== video) {
                otherVideo.muted = true;
                if (otherBtn) otherBtn.textContent = "UNMUTE";
              }
            });
          video.muted = false;
          video.play().catch(function () {});
          muteBtn.textContent = "MUTE";
        } else {
          video.muted = true;
          muteBtn.textContent = "UNMUTE";
        }
      });
    });

    document.querySelectorAll(".video-player-mute").forEach(function (wrapper) {
      var video = wrapper.querySelector("video");
      if (!video) return;
      addMuteButton(wrapper, video);
    });

    document
      .querySelectorAll(".video-mute-wrapper")
      .forEach(function (wrapper) {
        var video = wrapper.querySelector("video");
        if (!video) return;
        addMuteButton(wrapper, video);
      });

    function resetMute() {
      document
        .querySelectorAll(
          ".video-player, .video-player-mute, .video-mute-wrapper",
        )
        .forEach(function (wrapper) {
          var video = wrapper.querySelector("video");
          var muteBtn = wrapper.querySelector('[data-control="mute"]');
          if (video) {
            video.muted = true;
            if (muteBtn) muteBtn.textContent = "UNMUTE";
          }
        });
    }

    function resumePlay() {
      document
        .querySelectorAll(
          ".video-player, .video-player-mute, .video-mute-wrapper",
        )
        .forEach(function (wrapper) {
          var video = wrapper.querySelector("video");
          var pauseBtn = wrapper.querySelector('[data-control="pause"]');
          if (video && video.paused) {
            video.play();
            if (pauseBtn) pauseBtn.textContent = "PAUSE";
          }
        });
    }

    var scrollMuteObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            var video = entry.target;
            if (!video.muted) {
              video.muted = true;
              var wrapper = video.closest(
                ".video-player, .video-player-mute, .video-mute-wrapper",
              );
              var muteBtn = wrapper
                ? wrapper.querySelector('[data-control="mute"]')
                : null;
              if (muteBtn) muteBtn.textContent = "UNMUTE";
            }
          }
        });
      },
      { threshold: 0 },
    );

    document
      .querySelectorAll(
        ".video-player video, .video-player-mute video, .video-mute-wrapper video",
      )
      .forEach(function (video) {
        scrollMuteObserver.observe(video);
      });

    window.addEventListener("pagehide", resetMute);

    window.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        resetMute();
        resumePlay();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVideoPlayers);
  } else {
    initVideoPlayers();
  }
})();
