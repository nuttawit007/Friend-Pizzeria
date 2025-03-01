const router = require("express").Router();
const prisma = require("../../config/db");

// Pizza CRUD
router.get("/pizzas", async (req, res) => {
  const pizzas = await prisma.pizza.findMany({
    include: { images: true, ingredients: { include: { ingredient: true } } },
  });
  res.render("catalogs/catalogs", { user: req.user, pizzas });
});

router.get("/pizzas/custom", async (req, res) => {
  const pizzas = await prisma.pizza.findMany({
    include: { images: true, ingredients: { include: { ingredient: true } } },
  });
  res.render("custom/custom", { user: req.user, pizzas });
});

router.get("/pizzas/:id", async (req, res) => {
  const { id } = req.params;
  const pizza = await prisma.pizza.findUnique({
    where: { id: Number(id) },
    include: { images: true, ingredients: { include: { ingredient: true } } },
  });

  if (!pizza) return res.status(404).json({ error: "Pizza not found" });
  res.json(pizza);
});

router.post("/pizzas", async (req, res) => {
  const { name, description, price, ingredientIds, imageUrls } = req.body;

  const pizza = await prisma.pizza.create({
    data: {
      name,
      description,
      price,
      ingredients: {
        create: ingredientIds.map((id) => ({ ingredientId: id })),
      },
      images: {
        create: imageUrls.map((url) => ({ imageUrl: url })),
      },
    },
  });

  res.status(201).json(pizza);
});

router.put("/pizzas/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, ingredientIds, imageUrls } = req.body;

  const pizza = await prisma.pizza.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      price,
      ingredients: {
        deleteMany: {},
        create: ingredientIds.map((id) => ({ ingredientId: id })),
      },
      images: {
        deleteMany: {},
        create: imageUrls.map((url) => ({ imageUrl: url })),
      },
    },
  });

  res.json(pizza);
});

router.delete("/pizzas/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.pizza.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Pizza deleted successfully" });
});

// Appetizer CRUD
router.get("/appetizers", async (req, res) => {
  const appetizers = await prisma.appetizer.findMany();
  res.json(appetizers);
});

router.post("/appetizers", async (req, res) => {
  const { name, description, price } = req.body;

  const appetizer = await prisma.appetizer.create({
    data: {
      name,
      description,
      price,
    },
  });

  res.status(201).json(appetizer);
});

router.put("/appetizers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const appetizer = await prisma.appetizer.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      price,
    },
  });

  res.json(appetizer);
});

router.delete("/appetizers/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.appetizer.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Appetizer deleted successfully" });
});

// Snack CRUD
router.get("/snacks", async (req, res) => {
  const snacks = await prisma.snack.findMany();
  res.json(snacks);
});

router.post("/snacks", async (req, res) => {
  const { name, description, price } = req.body;

  const snack = await prisma.snack.create({
    data: {
      name,
      description,
      price,
    },
  });

  res.status(201).json(snack);
});

router.put("/snacks/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const snack = await prisma.snack.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      price,
    },
  });

  res.json(snack);
});

router.delete("/snacks/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.snack.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Snack deleted successfully" });
});

// Drink CRUD
router.get("/drinks", async (req, res) => {
  const drinks = await prisma.drink.findMany();
  res.json(drinks);
});

router.post("/drinks", async (req, res) => {
  const { name, description, price } = req.body;

  const drink = await prisma.drink.create({
    data: {
      name,
      description,
      price,
    },
  });

  res.status(201).json(drink);
});

router.put("/drinks/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const drink = await prisma.drink.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      price,
    },
  });

  res.json(drink);
});

router.delete("/drinks/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.drink.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Drink deleted successfully" });
});

// Ingredient CRUD
router.post("/ingredients", async (req, res) => {
  const { name } = req.body;

  const existingIngredient = await prisma.ingredient.findUnique({
    where: { name },
  });

  if (existingIngredient) {
    return res.status(400).json({ msg: "Ingredient already exists" });
  }

  const ingredient = await prisma.ingredient.create({
    data: {
      name,
    },
  });

  res.status(201).json(ingredient);
});

router.get("/ingredients", async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ msg: "Error retrieving ingredients", error });
  }
});

router.get("/ingredients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: Number(id) },
    });

    if (!ingredient) {
      return res.status(404).json({ msg: "Ingredient not found" });
    }

    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ msg: "Error retrieving ingredient", error });
  }
});

router.put("/ingredients/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const ingredient = await prisma.ingredient.update({
      where: { id: Number(id) },
      data: {
        name,
      },
    });

    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ msg: "Error updating ingredient", error });
  }
});

router.delete("/ingredients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ingredient = await prisma.ingredient.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ msg: "Ingredient deleted successfully", ingredient });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting ingredient", error });
  }
});

router.get("/basket", async (req, res) => {
  const userId = 1;

  const basket = await prisma.basket.findUnique({
    where: { userId },
    include: { items: { include: { pizza: true } } },
  });

  if (!basket) return res.status(404).json({ error: "Basket not found" });
  res.json(basket);
});

router.post("/basket", async (req, res) => {
  const userId = 1;
  const { pizza, quantity } = req.body;
  const { id } = pizza;
  let basket = await prisma.basket.findUnique({
    where: { userId },
  });

  if (!basket) {
    basket = await prisma.basket.create({ data: { userId } });
  }

  await prisma.basketItem.upsert({
    where: { basketId_pizzaId: { basketId: basket.id, pizzaId: Number(id) } },
    update: { quantity: { increment: quantity } },
    create: { basketId: basket.id, pizzaId: Number(id), quantity },
  });

  res.json({ message: "Pizza added to basket" });
});

router.delete("/basket/:pizzaId", async (req, res) => {
  const userId = req.user.id;
  const { pizzaId } = req.params;

  await prisma.basketItem.deleteMany({
    where: { basket: { userId }, pizzaId: Number(pizzaId) },
  });

  res.json({ message: "Pizza removed from basket" });
});

router.post("/order", async (req, res) => {
  const userId = 1;
  console.log(userId);
  const basket = await prisma.basket.findUnique({
    where: { userId },
    include: { items: { include: { pizza: true } } },
  });

  if (!basket || basket.items.length === 0) {
    return res.status(400).json({ error: "Basket is empty" });
  }

  const totalPrice = basket.items.reduce(
    (sum, item) => sum + item.pizza.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      items: {
        create: basket.items.map((item) => ({
          pizzaId: item.pizzaId,
          quantity: item.quantity,
        })),
      },
    },
  });

  await prisma.basketItem.deleteMany({ where: { basketId: basket.id } });

  res.json(order);
});

router.get("/orders", async (req, res) => {
  const userId = 1;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { pizza: true } } },
  });

  res.json(orders);
});

router.patch("/order/:orderId", async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: Number(orderId) },
    data: { status },
  });

  res.json(order);
});

module.exports = router;
