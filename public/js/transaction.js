function sendOrder() {
  const orderData = {
    id: this.pizza?.id || this.appetizer?.id || this.snack?.id || this.drink?.id,
    name: this.pizza?.name || this.appetizer?.name || this.snack?.name || this.drink?.name,
    price: this.pizza?.price || this.appetizer?.price || this.snack?.price || this.drink.price,
    description: this.pizza?.desc || this.appetizer?.desc || this.snack?.desc || this.drink?.desc,
    quantity: this.quantity,
    pizza: this.pizza,
    appetizer: this.appetizer,
    snack: this.snack,
    drink: this.drink,
    type: this.pizza ? "pizza" : this.appetizer ? "appetizer" : this.snack ? "snack" : "drink",
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
    crust: this.getSelectedCrustSize ? this.getSelectedCrustSize()?.name : "",
    dough: this.getSelectedDoughType ? this.getSelectedDoughType()?.name : "",
    cheeses: this.selectedCheeses.map((id) => this.getCheeseById(id)?.name || ""),
    meats: this.selectedMeats.map((id) => this.getMeatById(id)?.name || ""),
    vegetables: this.selectedVegetables.map((id) => this.getVegetableById(id)?.name || ""),
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
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    });
}

function sendCustomOrderForum() {
  const order = {
    id: this.id,
    type: "forum",
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
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    });
}

function submitOrder() {
  const payload = {
    address: this.address,
    tel: this.tel,
    delivery: this.delivery,
    paymentType: this.paymentType,
  };

  fetch("/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Order placed successfully!");
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
