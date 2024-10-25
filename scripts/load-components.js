// loadComponents.js
async function loadComponent(componentId, filePath) {
  return fetch(filePath)
    .then(function (response) {
      return response.text().then(function (html) {
        document.getElementById(componentId).innerHTML = html;
        return html;
      });
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
      throw err; // Rethrow the error to propagate it to the caller
    });
}

// Load the header and footer components
document.addEventListener("DOMContentLoaded", async (event) => {
  await loadComponent("header", "includes/header.html");
  await loadComponent("footer", "includes/footer.html");

  // Ladeanimation
  setTimeout(function () {
    document.querySelector(".loading-screen").classList.add("fade-out");
    setTimeout(function () {
      document.querySelector(".loading-screen").style.display = "none";
      // document.querySelector('.content').style.opacity = '1';
    }, 1000);
  }, 1000);

  // get menu items
  // add a click event to each
  // find the corresponding content div based on which menu element is clicked
  // scroll to that content div with scrollTo

  // get menu items

  const menuItems = document.querySelectorAll(".has-section");
  // console.log("menuItems", menuItems);
  if (menuItems) {
    // add a click event to each
    menuItems.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        // find the corresponding content div based on which menu element is clicked
        const id = element.getAttribute("href");
        const section = document.querySelector(id);
        console.log("section", section);
        if (section) {
          // console.log('section', section)
          scrollTo({ top: section.offsetTop - 100, behavior: "smooth" });
        }
      });
    });
  }

  // closing a project
  document.querySelectorAll(".close-button").forEach((button) => {
    button.addEventListener("click", () => {
      const container = button.closest(".project-container");
      const isSmallScreen = window.matchMedia("(max-width: 800px)").matches;
      console.log("container", container);
      container.classList.remove("active");

      if (isSmallScreen) {
        setTimeout(function () {
          scrollTo({ top: container.offsetTop - 180, behavior: "smooth" });
        }, 500);
      } else {
        setTimeout(function () {
          scrollTo({ top: container.offsetTop - 100, behavior: "smooth" });
        }, 500);
      }
    });
  });
});

// nach Neuladen nach oben scrollen
window.onload = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
  // console.log('on load test', window.scrollTo(0,0))
};

//  Detailansicht
function zoom(element) {
  const allContainers = document.getElementsByClassName("project-container");
  const parent = element.parentElement;
  const isActive = parent.classList.contains("active");
  const isSmallScreen = window.matchMedia("(max-width: 800px)").matches;

  if (!isActive) {
    for (let index = 0; index < allContainers.length; index++) {
      const child = allContainers[index];
      if (child != parent) {
        child.classList.remove("active");
      }
    }
    parent.classList.toggle("active");

    if (isSmallScreen) {
      setTimeout(function () {
        scrollTo({ top: parent.offsetTop - 180, behavior: "smooth" });
      }, 500);
    } else {
      setTimeout(function () {
        scrollTo({ top: parent.offsetTop - 100, behavior: "smooth" });
      }, 500);
    }
  }
}

// Diashow
document.addEventListener("DOMContentLoaded", function () {
  var slides = document.querySelectorAll(".slide1");
  var currentSlide = 0;

  showSlide();

  function showSlide() {
    slides.forEach(function (slide) {
      slide.style.display = "none";
    });
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].style.display = "block";
    setTimeout(showSlide, 3000); // Wechsel alle 3 Sekunden
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var slides = document.querySelectorAll(".slide2");
  var currentSlide = 0;

  showSlide();

  function showSlide() {
    slides.forEach(function (slide) {
      slide.style.display = "none";
    });
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].style.display = "block";
    setTimeout(showSlide, 3000); // Wechsel alle 3 Sekunden
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var slides = document.querySelectorAll(".slide3");
  var currentSlide = 0;

  showSlide();

  function showSlide() {
    slides.forEach(function (slide) {
      slide.style.display = "none";
    });
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].style.display = "block";
    setTimeout(showSlide, 3000); // Wechsel alle 3 Sekunden
  }
});

// loadComponents.js
async function loadComponent(componentId, filePath) {
  return fetch(filePath)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      document.getElementById(componentId).innerHTML = html;
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
}

// Load the header and footer components
document.addEventListener("DOMContentLoaded", async (event) => {
  await loadComponent("header", "includes/header.html");
  await loadComponent("footer", "includes/footer.html");

  const navToggle = document.getElementById("nav-toggle");
  const navList = document.getElementById("nav-list");
  const navClose = document.getElementById("nav-list");

  navToggle.addEventListener("click", (e) => {
    navList.classList.toggle("show");
  });

  navClose.addEventListener("click", (e) => {
    navList.classList.toggle("show");
  });
});
