const router = require("express").Router();
const { IngredientType, PizzaType, PizzaDough, PizzaSize } = require("@prisma/client");
const prisma = require("../../config/db");

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

  const ingredients = await prisma.ingredient.findMany();
  const groupedIngredients = ingredients.reduce(
    (acc, ingredient) => {
      if (!acc[ingredient.type]) acc[ingredient.type] = [];

      acc[ingredient.type].push(ingredient);
      return acc;
    },
    { cheese: [], meat: [], vegetable: [], sauce: [], spice: [] }
  );
  res.render("custom/custom", { user: req.user, pizzas, groupedIngredients });
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

router.post("/ingredients", async (req, res) => {
  let payload = {
    cheeses: [
      {
        id: "mozzarella",
        name: "มอซซาเรลล่า",
        image: "/img/assets/ingredient/cheese/mozzarella.png",
      },
      {
        id: "parmesan",
        name: "พาร์เมซาน",
        image: "/img/assets/ingredient/cheese/parmesan.png",
      },
      {
        id: "bluecheese",
        name: "บลูชีส",
        image: "/img/assets/ingredient/cheese/bluecheese.png",
      },
      {
        id: "cheddar",
        name: "เชดดาร์",
        image: "/img/assets/ingredient/cheese/cheddar.png",
      },
      { id: "feta", name: "เฟต้า", image: "/img/assets/ingredient/cheese/feta.png" },
    ],

    meats: [
      { id: "ham", name: "แฮม", image: "/img/assets/ingredient/meat/ham.png" },
      { id: "shrimp", name: "กุ้ง", image: "/img/assets/ingredient/meat/shrimp.png" },
      {
        id: "friedchicken",
        name: "ไก่บัพฟาโล",
        image: "/img/assets/ingredient/meat/buffalochicken.png",
      },
      {
        id: "pulledpork",
        name: "หมูรวมควัน",
        image: "/img/assets/ingredient/meat/pulledpork.png",
      },
      {
        id: "pepperoni",
        name: "เปปเปอโรนี",
        image: "/img/assets/ingredient/meat/pepperoni.png",
      },
      { id: "bacon", name: "เบคอน", image: "/img/assets/ingredient/meat/bacon.png" },
    ],

    vegetables: [
      { id: "mushroom", name: "เห็ด", image: "/img/assets/ingredient/veg/mushroom.png" },
      {
        id: "jalapeno",
        name: "ฮาลาพีโย่",
        image: "/img/assets/ingredient/veg/jalapeno.png",
      },
      { id: "redchili", name: "พริก", image: "/img/assets/ingredient/veg/redchili.png" },
      {
        id: "bellpaper",
        name: "พริกหวาน",
        image: "/img/assets/ingredient/veg/bellpepper.png",
      },
      { id: "onion", name: "หอมแดง", image: "/img/assets/ingredient/veg/onion.png" },
      { id: "olive", name: "มะกอก", image: "/img/assets/ingredient/veg/blackolive.png" },
      { id: "tomato", name: "มะเขือเทศ", image: "/img/assets/ingredient/veg/tomato.png" },
      { id: "spinach", name: "ปวยเล้ง", image: "/img/assets/ingredient/veg/spinach.png" },
      { id: "basil", name: "โหระพา", image: "/img/assets/ingredient/veg/basil.png" },
    ],

    sauces: [
      {
        id: "saucetomato",
        name: "ซอสแดง",
        image: "/img/assets/ingredient/sauce/saucetomato.png",
      },
      {
        id: "saucewhite",
        name: "ซอสขาว",
        image: "/img/assets/ingredient/sauce/saucewhite.png",
      },
      {
        id: "saucebuffalo",
        name: "ซอสบัฟฟาโล",
        image: "/img/assets/ingredient/sauce/saucebuffalo.png",
      },
      {
        id: "saurcebbq",
        name: "ซอสบาบีคิว",
        image: "/img/assets/ingredient/sauce/saucebbq.png",
      },
    ],

    spices: [
      {
        id: "oregano",
        name: "ออริกาโน่",
        image: "/img/assets/ingredient/spice/oregano.png",
      },
      {
        id: "blackpepper",
        name: "พริกไทยดำ",
        image: "/img/assets/ingredient/spice/blackpepper.png",
      },
      { id: "salt", name: "เกลือ", image: "/img/assets/ingredient/spice/salt.png" },
    ],
  };
  payload.cheeses = payload.cheeses.map((e) => {
    return { name: e.name, imageUrl: e.image, key: e.id, type: IngredientType.CHEESE };
  });

  payload.meats = payload.meats.map((e) => {
    return { name: e.name, imageUrl: e.image, key: e.id, type: IngredientType.MEAT };
  });

  payload.vegetables = payload.vegetables.map((e) => {
    return { name: e.name, imageUrl: e.image, key: e.id, type: IngredientType.VEGETABLE };
  });

  payload.sauces = payload.sauces.map((e) => {
    return { name: e.name, imageUrl: e.image, key: e.id, type: IngredientType.SAUCE };
  });

  payload.spices = payload.spices.map((e) => {
    return { name: e.name, imageUrl: e.image, key: e.id, type: IngredientType.SPICE };
  });

  const ingredients = await prisma.ingredient.createMany({
    data: [
      ...payload.cheeses,
      ...payload.meats,
      ...payload.vegetables,
      ...payload.sauces,
      ...payload.spices,
    ],
  });

  res.status(201).json(ingredients);
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
    include: {
      items: { include: { pizza: true, drink: true, appetizer: true, snack: true } },
    },
  });

  if (!basket) return res.status(404).json({ error: "Basket not found" });
  res.json(basket);
});

router.post("/basket", async (req, res) => {
  const userId = 1;
  const {
    pizza,
    quantity,
    type,
    pizzaName,
    base,
    size,
    crust,
    dough,
    price,
    cheeses,
    meats,
    vegetables,
    sauces,
    spices,
    specialInstructions,
  } = req.body;
  let basket = await prisma.basket.findUnique({
    where: { userId },
  });

  if (!basket) {
    basket = await prisma.basket.create({ data: { userId } });
  }
  const pizzaDough = {
    บางกรอบ: PizzaDough.THIN,
    หนาหนุ่ม: PizzaDough.THICK,
    ขอบชีส: PizzaDough.STUFFED,
  };

  const pizzaSize = {
    "4 นิ้ว": PizzaSize.SMALL,
    "6 นิ้ว": PizzaSize.MEDIUM,
    "8 นิ้ว": PizzaSize.LARGE,
  };

  if (type === "normal") {
    await prisma.basketItem.upsert({
      where: { basketId_pizzaId: { basketId: basket.id, pizzaId: Number(pizza.id) } },
      update: { quantity: { increment: quantity } },
      create: { basketId: basket.id, pizzaId: Number(pizza.id), quantity },
    });
  } else {
    const ingredientPayload = [...cheeses, ...meats, ...vegetables, ...sauces, ...spices];
    const ingredient = await prisma.ingredient.findMany();
    const ingredientId = ingredientPayload.map((e) => {
      return ingredient.find((i) => i.name === e).id;
    });
    const pz = await prisma.pizza.create({
      data: {
        name: pizzaName,
        description: specialInstructions,
        price: +price.toFixed(2),
        size: pizzaSize[size],
        pizzaDough: pizzaDough[dough],
        ingredients: { create: ingredientId.map((id) => ({ ingredientId: id })) },
        author: { connect: { id: userId } },
        type: PizzaType.CUSTOM,
      },
    });
    await prisma.basketItem.upsert({
      where: { basketId_pizzaId: { basketId: basket.id, pizzaId: Number(pz.id) } },
      update: { quantity: { increment: 1 } },
      create: { basketId: basket.id, pizzaId: Number(pz.id), quantity: 1 },
    });
  }
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
  const basket = await prisma.basket.findUnique({
    where: { userId },
    include: { items: { include: { pizza: true } } },
  });

  if (!basket || basket.items.length === 0) {
    return res.status(400).json({ error: "Basket is empty" });
  }

  const combinedItems = basket.items
    .flatMap((e) => [
      e.pizza && {
        type: e.pizza.type,
        name: e.pizza.name,
        description: (e.pizza.description && e.pizza.description.trim()) || "",

        price: e.pizza.price,
        size: e.pizza.size,
        dought: e.pizza.pizzaDough,
        ingredients: e.pizza.ingredients,
        quantity: 1,
      },
      e.drink && {
        type: "DRINK",
        name: e.drink.name,
        price: e.drink.price,
        quantity: 1,
      },
      e.snack && {
        type: "SNACK",
        name: e.snack.name,
        price: e.snack.price,
        quantity: 1,
      },
      e.appetizer && {
        type: "APPETIZER",
        name: e.appetizer.name,
        price: e.appetizer.price,
        quantity: 1,
      },
    ])
    .filter(Boolean);
  const totalPrice = combinedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
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

  const result = await prisma.basket.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          pizza: {
            include: { ingredients: { include: { ingredient: true } } },
          },
          drink: true,
          snack: true,
          appetizer: true,
        },
      },
    },
  });

  const combinedItems = result.items
    .flatMap((e) => [
      e.pizza && {
        type: e.pizza.type,
        name: e.pizza.name,
        description: (e.pizza.description && e.pizza.description.trim()) || "",

        price: e.pizza.price,
        size: e.pizza.size,
        dought: e.pizza.pizzaDough,
        ingredients: e.pizza.ingredients,
        quantity: 1,
      },
      e.drink && {
        type: "DRINK",
        name: e.drink.name,
        price: e.drink.price,
        quantity: 1,
      },
      e.snack && {
        type: "SNACK",
        name: e.snack.name,
        price: e.snack.price,
        quantity: 1,
      },
      e.appetizer && {
        type: "APPETIZER",
        name: e.appetizer.name,
        price: e.appetizer.price,
        quantity: 1,
      },
    ])
    .filter(Boolean);
  const totalCost = combinedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  res.render("order/order", {
    user: req.user,
    result: combinedItems,
    custom: combinedItems.filter((e) => e.type === PizzaType.CUSTOM),
    total: result ? totalCost.toFixed(2) : 0,
  });
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
