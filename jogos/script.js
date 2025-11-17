document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".menu a");
    const body = document.body;
    const defaultBackground = "radial-gradient(circle at center, #000 0%, #111 100%)";
  
    links.forEach(link => {
      link.addEventListener("mouseenter", () => {
        const color = link.getAttribute("data-color");
        body.style.background = `radial-gradient(circle at center, ${color} 0%, #000 100%)`;
      });
  
      link.addEventListener("mouseleave", () => {
        body.style.background = defaultBackground;
      });
    });
  });
  