(() => {
  const yearNodes = document.querySelectorAll("[data-current-year]");
  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
      const email = "cybershamanic@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        button.textContent = "האימייל הועתק ✓";
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });
})();
