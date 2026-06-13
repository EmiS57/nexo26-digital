const WHATSAPP_NUMBER = "525517973390";

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const form = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

const buildWhatsappUrl = (message) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

const scrollToSection = (target) => {
  const headerOffset = header?.offsetHeight || 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - 18;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth",
  });
};

const closeMenu = () => {
  nav?.classList.remove("is-open");
  menuToggle?.classList.remove("is-active");
  menuToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  menuToggle.classList.toggle("is-active", Boolean(isOpen));
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("menu-open", Boolean(isOpen));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      event.preventDefault();
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    window.requestAnimationFrame(() => scrollToSection(target));
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const business = String(formData.get("business") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const whatsappMessage = `Hola, soy ${name}. Tengo un negocio de ${business}. Mi WhatsApp es ${phone}. Me interesa cotizar una página web con NEXO26 Digital.${message ? ` ${message}` : ""}`;

  if (formNote) {
    formNote.textContent = "Abriendo WhatsApp Business con tu mensaje preparado...";
  }

  window.open(buildWhatsappUrl(whatsappMessage), "_blank", "noopener,noreferrer");
});
