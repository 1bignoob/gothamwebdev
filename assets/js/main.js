const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const desktopMq = window.matchMedia("(min-width: 801px)");

const setMenuState = (open) => {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle.setAttribute("aria-label", open ? "Close site menu" : "Open site menu");
  siteNav.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
};

const closeMenu = () => {
  setMenuState(false);
};

const openMenu = () => {
  setMenuState(true);
};

const toggleMenu = () => {
  if (!siteNav) {
    return;
  }
  setMenuState(!siteNav.classList.contains("is-open"));
};

document.addEventListener("click", (event) => {
  if (menuToggle && siteNav) {
    if (event.target === menuToggle || menuToggle.contains(event.target)) {
      return;
    }

    if (siteNav.classList.contains("is-open") && event.target === siteNav) {
      closeMenu();
      return;
    }
  }
});

if (menuToggle) {
  menuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMenu();
  });
}

if (siteNav) {
  siteNav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) {
      return;
    }

    if (!desktopMq.matches) {
      closeMenu();
    }
  });
}

const resetMenuForDesktop = () => {
  if (desktopMq.matches) {
    closeMenu();
  }
};

if (desktopMq.addEventListener) {
  desktopMq.addEventListener("change", resetMenuForDesktop);
} else if (desktopMq.addListener) {
  desktopMq.addListener(resetMenuForDesktop);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
