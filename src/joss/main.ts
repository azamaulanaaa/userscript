if (
  window.location.href.startsWith(
    "https://joss.jatimprov.go.id/index.php/home/tracking",
  )
) {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.toString().length > 0) {
    const targetUrl = "https://joss.jatimprov.go.id/index.php/home/cari";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = targetUrl;
    form.style.display = "none";

    for (const [key, value] of urlParams) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }
}
