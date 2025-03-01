document.addEventListener("DOMContentLoaded", function () {
  const pizzaIcon = document.getElementById("pizza-iconic");
  const ingredients = document.getElementById("ingredients");

  if (pizzaIcon && ingredients) {
    const tl = gsap.timeline();

    tl.from([pizzaIcon, ingredients], {
      x: 200,
      opacity: 0,
      duration: 2,
      ease: "power2.out",
    }).to([pizzaIcon, ingredients], {
      opacity: 1,
      ease: "bounce.out",
    });

    tl.call(() => {
      gsap.to(pizzaIcon, {
        y: 20,
        x: 10,
        rotation: 5,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(ingredients, {
        y: 20,
        x: 10,
        rotation: -3,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  } else {
    console.error("One or more elements not found!");
  }
});
