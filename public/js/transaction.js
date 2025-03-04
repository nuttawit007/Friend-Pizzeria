function sendOrder() {
  const orderData = {
    name: this.pizza.name,
    price: this.pizza.price,
    description: this.pizza.desc,
    quantity: this.quantity,
    pizza: this.pizza,
    type: "normal",
  };

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

function sendCustomOrder() {
  const order = {
    pizzaName: this.pizzaName,
    size: this.getSelectedSize ? this.getSelectedSize().label : "",
    crust: this.getSelectedCrustSize ? this.getSelectedCrustSize().name : "",
    dough: this.getSelectedDoughType ? this.getSelectedDoughType().name : "",
    cheeses: this.selectedCheeses.map((id) => this.getCheeseById(id)?.name || ""),
    meats: this.selectedMeats.map((id) => this.getMeatById(id)?.name || ""),
    vegetables: this.selectedVegetables.map(
      (id) => this.getVegetableById(id)?.name || ""
    ),
    sauces: this.selectedSauces.map((id) => this.getSauceById(id)?.name || ""),
    spices: this.selectedSpices.map((id) => this.getSpiceById(id)?.name || ""),
    specialInstructions: this.specialInstructions || "",
    price: this.total || 0,
    type: "custom",
  };
  fetch("/basket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Order placed successfully!");
      console.log("Order Response:", data);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    });
}

function submitOrder() {
  fetch("/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Order placed successfully!");
      console.log("Order Response:", data);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    });
}

window.sendCustomOrder = sendCustomOrder;

window.submitOrder = submitOrder;
window.sendOrder = sendOrder;
