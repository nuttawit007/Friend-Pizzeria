function updateQueryString(filterValue) {
  const params = new URLSearchParams(window.location.search);

  params.set("filter", filterValue);

  window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
  window.location.reload();
}
