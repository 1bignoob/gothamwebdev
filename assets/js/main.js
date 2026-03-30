const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const dropdownNodes = Array.from(document.querySelectorAll(".nav-dropdown"));
const DROPDOWN_CLOSE_DELAY_MS = 200;
const DROPDOWN_OPEN_ANIMATION_MS = 760;
const closeTimers = new WeakMap();
const animationTimers = new WeakMap();

const cancelScheduledClose = (dropdown) => {
  const timer = closeTimers.get(dropdown);
  if (timer) {
    clearTimeout(timer);
    closeTimers.delete(dropdown);
  }
};

const scheduleClose = (dropdown) => {
  cancelScheduledClose(dropdown);
  const timer = setTimeout(() => {
    closeDropdown(dropdown);
  }, DROPDOWN_CLOSE_DELAY_MS);
  closeTimers.set(dropdown, timer);
};

const restartOpenAnimation = (dropdown) => {
  const existingTimer = animationTimers.get(dropdown);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  dropdown.classList.remove("is-opening");
  void dropdown.offsetWidth;
  dropdown.classList.add("is-opening");

  const timer = setTimeout(() => {
    dropdown.classList.remove("is-opening");
    animationTimers.delete(dropdown);
  }, DROPDOWN_OPEN_ANIMATION_MS);

  animationTimers.set(dropdown, timer);
};

const closeDropdown = (dropdown) => {
  cancelScheduledClose(dropdown);
  dropdown.classList.remove("is-open");
  dropdown.classList.remove("is-opening");
  const trigger = dropdown.querySelector(".nav-dropdown-toggle");
  if (trigger) {
    trigger.setAttribute("aria-expanded", "false");
  }
};

const openDropdown = (dropdown) => {
  const wasOpen = dropdown.classList.contains("is-open");
  cancelScheduledClose(dropdown);
  dropdown.classList.add("is-open");
  if (!wasOpen) {
    restartOpenAnimation(dropdown);
  }
  const trigger = dropdown.querySelector(".nav-dropdown-toggle");
  if (trigger) {
    trigger.setAttribute("aria-expanded", "true");
  }
};

dropdownNodes.forEach((dropdown) => {
  const trigger = dropdown.querySelector(".nav-dropdown-toggle");
  if (!trigger) {
    return;
  }

  dropdown.addEventListener("mouseenter", () => {
    dropdownNodes.forEach((node) => {
      if (node !== dropdown) {
        closeDropdown(node);
      }
    });
    openDropdown(dropdown);
  });

  dropdown.addEventListener("mouseleave", () => {
    scheduleClose(dropdown);
  });

  dropdown.addEventListener("focusin", () => {
    openDropdown(dropdown);
  });

  dropdown.addEventListener("focusout", (event) => {
    if (!dropdown.contains(event.relatedTarget)) {
      scheduleClose(dropdown);
    }
  });

  trigger.addEventListener("click", () => {
    const willOpen = !dropdown.classList.contains("is-open");
    dropdownNodes.forEach((node) => closeDropdown(node));
    if (willOpen) {
      openDropdown(dropdown);
    }
  });
});

document.addEventListener("click", (event) => {
  dropdownNodes.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      closeDropdown(dropdown);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    dropdownNodes.forEach((dropdown) => closeDropdown(dropdown));
  }
});
