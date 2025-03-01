function sendOrder() {
  const orderData = {
    name: this.pizza.name,
    price: this.pizza.price,
    description: this.pizza.desc,
    quantity: this.quantity,
  };
  console.log(orderData);

  fetch("/your-backend-api-endpoint", {
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
    })
    .catch((error) => {
      console.error("Error sending order:", error);
    });
}
