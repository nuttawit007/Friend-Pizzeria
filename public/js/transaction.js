function sendOrder() {
  const orderData = {
    name: this.pizza.name,
    price: this.pizza.price,
    description: this.pizza.desc,
    quantity: this.quantity,
    pizza: this.pizza,
  };
  console.log(orderData);

  fetch("/basket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Order successfully sent:", data);
      this.modalOpen = false;
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error sending order:", error);
    });
}
