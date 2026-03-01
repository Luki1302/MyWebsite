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
    setTimeout(showSlide, 3000);
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
    setTimeout(showSlide, 3000);
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
    setTimeout(showSlide, 3000);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var slides = document.querySelectorAll(".slide4");
  var currentSlide = 0;

  showSlide();

  function showSlide() {
    slides.forEach(function (slide) {
      slide.style.display = "none";
    });
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].style.display = "block";
    setTimeout(showSlide, 3000);
  }
});
