document.addEventListener("DOMContentLoaded", function () {
    /* ------------------------------------------------------
     * 1. Função debounce para otimizar eventos de scroll
     * ------------------------------------------------------ */
    function debounce(func, wait = 20, immediate = true) {
      let timeout;
      return function () {
        const context = this, args = arguments;
        const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  
    /* ------------------------------------------------------
     * 2. Scroll suave para links internos
     * ------------------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  
    /* ------------------------------------------------------
     * 3. Efeito fade-in com Intersection Observer
     * ------------------------------------------------------ */
    const fadeElements = document.querySelectorAll(".atuacao-item, .beneficio, .hero-content, .cta");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aparecer");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      fadeElements.forEach(el => observer.observe(el));
    } else {
      fadeElements.forEach(el => el.classList.add("aparecer"));
    }
  
    /* ------------------------------------------------------
     * 4. Botão "Voltar ao Topo"
     * ------------------------------------------------------ */
    const scrollTopBtn = document.createElement("button");
    scrollTopBtn.id = "scrollTopBtn";
    scrollTopBtn.textContent = "↑ Topo";
    scrollTopBtn.style.cssText = `
      display: none;
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 10px 15px;
      font-size: 14px;
      border: none;
      border-radius: 8px;
      background: #2c3e50;
      color: white;
      cursor: pointer;
      z-index: 999;
    `;
    document.body.appendChild(scrollTopBtn);
  
    window.addEventListener("scroll", debounce(() => {
      scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    }));
  
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  