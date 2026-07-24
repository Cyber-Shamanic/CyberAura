(() => {
  const calculator = document.querySelector("[data-price-calculator]");
  if (!calculator) return;

  const checkboxes = [...calculator.querySelectorAll("[data-price]")];
  const totalNode = calculator.querySelector("[data-calculator-total]");
  const countNode = calculator.querySelector("[data-calculator-count]");
  const orderLink = calculator.querySelector("[data-order-link]");

  const formatPrice = (value) =>
    new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(value);

  const update = () => {
    const selected = checkboxes.filter((checkbox) => checkbox.checked);
    const total = selected.reduce(
      (sum, checkbox) => sum + Number(checkbox.dataset.price || 0),
      0,
    );

    totalNode.textContent = formatPrice(total);
    countNode.textContent = `${selected.length} שירותים נבחרו`;

    const serviceIds = selected.map((checkbox) => checkbox.value).join(",");
    orderLink.href = `order.html${serviceIds ? `?services=${encodeURIComponent(serviceIds)}` : ""}`;
  };

  checkboxes.forEach((checkbox) => checkbox.addEventListener("change", update));
  update();
})();
