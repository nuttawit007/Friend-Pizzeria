document.addEventListener("DOMContentLoaded", function () {
  // // Promotion carousel
  // new Glide(".promotion-glide", {
  //   type: "carousel",
  //   startAt: 0,
  //   perView: 1,
  //   gap: 0,
  //   autoplay: 3000,
  //   hoverpause: true,
  // }).mount();
  // // Pizza carousel
  // new Glide(".pizza-glide", {
  //   type: "carousel",
  //   startAt: 0,
  //   perView: 3,
  //   gap: 30,
  //   autoplay: 3000,
  //   hoverpause: true,
  //   breakpoints: {
  //     1024: {
  //       perView: 2,
  //     },
  //     640: {
  //       perView: 1,
  //     },
  //   },
  // }).mount();
});

document.addEventListener("DOMContentLoaded", function () {
  const glide = new Glide(".glide", {
    type: "carousel",
    startAt: 0,
    perView: 1,
    gap: 30,
    autoplay: 3000,
    hoverpause: true,
    breakpoints: {
      1024: {
        perView: 2,
      },
      640: {
        perView: 1,
      },
    },
  });

  glide.mount();
});
