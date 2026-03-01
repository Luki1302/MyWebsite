document.addEventListener("DOMContentLoaded", () => {
  const projectItems = document.querySelectorAll(".project-item");
  if (projectItems.length === 0) return;

  projectItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      document.body.classList.add("project-hover");
    });

    item.addEventListener("mouseleave", () => {
      document.body.classList.remove("project-hover");
    });
  });
});
