(() => {
  const form = document.querySelector("[data-order-form]");
  if (!form) return;

  const whatsappNumber = "972535366687";
  const serviceInputs = [...form.querySelectorAll('input[name="services"]')];
  const summaryList = form.querySelector("[data-summary-list]");
  const summaryTotal = form.querySelector("[data-summary-total]");
  const statusNode = form.querySelector("[data-form-status]");

  const formatPrice = (value) =>
    new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(value);

  const selectedServices = () =>
    serviceInputs
      .filter((input) => input.checked)
      .map((input) => ({
        id: input.value,
        name: input.dataset.name,
        category: input.dataset.category,
        price: Number(input.dataset.price || 0),
      }));

  const updateSummary = () => {
    const selected = selectedServices();
    summaryList.innerHTML = "";

    if (!selected.length) {
      const item = document.createElement("li");
      item.textContent = "עדיין לא נבחרו שירותים.";
      summaryList.append(item);
    } else {
      selected.forEach((service) => {
        const item = document.createElement("li");
        item.textContent = `${service.category} — ${service.name} · החל מ־${formatPrice(service.price)}`;
        summaryList.append(item);
      });
    }

    const total = selected.reduce((sum, service) => sum + service.price, 0);
    summaryTotal.textContent = `אומדן התחלתי: ${formatPrice(total)}`;
  };

  const preselectFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    const requested = (params.get("services") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    serviceInputs.forEach((input) => {
      if (requested.includes(input.value)) input.checked = true;
    });
  };

  const clean = (value, fallback = "לא צוין") =>
    String(value || "").trim() || fallback;

  form.addEventListener("change", updateSummary);
  form.addEventListener("reset", () => {
    statusNode.textContent = "";
    window.setTimeout(updateSummary, 0);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const selected = selectedServices();
    if (!selected.length) {
      statusNode.textContent = "יש לבחור לפחות שירות אחד לפני השליחה.";
      serviceInputs[0]?.focus();
      return;
    }

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const total = selected.reduce((sum, service) => sum + service.price, 0);
    const serviceLines = selected
      .map(
        (service, index) =>
          `${index + 1}. ${service.category} — ${service.name} (החל מ־${formatPrice(service.price)})`,
      )
      .join("\n");

    const message = [
      "⚡ *בקשת שירות חדשה — Cyber Shamanic*",
      "",
      `👤 *שם:* ${clean(data.get("name"))}`,
      `🏢 *עסק / פרויקט:* ${clean(data.get("company"))}`,
      `📧 *אימייל:* ${clean(data.get("email"))}`,
      `📱 *טלפון:* ${clean(data.get("phone"))}`,
      "",
      "🧩 *השירותים שנבחרו:*",
      serviceLines,
      "",
      `💰 *אומדן התחלתי:* ${formatPrice(total)}`,
      `🎯 *תקציב מועדף:* ${clean(data.get("budget"))}`,
      `🗓️ *לוח זמנים:* ${clean(data.get("timeline"))}`,
      "",
      "📝 *תיאור הבקשה:*",
      clean(data.get("details")),
      "",
      "המחיר הסופי ייקבע לאחר אפיון והגדרת היקף העבודה.",
      "— נשלח מאתר SiteForge v0.0.2",
    ].join("\n");

    statusNode.textContent = "הבקשה מוכנה — WhatsApp נפתח עם כל הבחירות.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });

  preselectFromQuery();
  updateSummary();
})();
