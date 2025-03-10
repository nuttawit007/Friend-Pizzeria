const router = require("express").Router();
const { IngredientType, PizzaDough, PizzaSize, ProductType } = require("@prisma/client");
const prisma = require("../../config/db");

router.get("/pizzas", async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const [pizzas, appetizers, snacks, drinks] = await Promise.all([
      prisma.pizza.findMany({
        where: { public: true, type: "NORMAL" },
        include: { ingredients: { include: { ingredient: true } } },
      }),
      prisma.appetizer.findMany(),
      prisma.snack.findMany(),
      prisma.drink.findMany(),
    ]);

    const catalogData = {
      pizza: { pizzas, appetizers: [], snacks: [], drinks: [] },
      appetizer: { pizzas: [], appetizers, snacks: [], drinks: [] },
      snack: { pizzas: [], appetizers: [], snacks, drinks: [] },
      drink: { pizzas: [], appetizers: [], snacks: [], drinks },
      "": { pizzas, appetizers, snacks, drinks },
    };

    res.render("catalogs/catalogs", {
      user: req.user,
      queryFilter: filter,
      ...(catalogData[filter] || catalogData[""]),
    });
  } catch (error) {
    console.error("Error fetching catalog data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/pizzas/custom", async (req, res) => {
  const pizzas = await prisma.pizza.findMany({
    include: { ingredients: { include: { ingredient: true } } },
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
  res.render("custom/custom", {
    user: req.user,
    pizzas,
    ingredients,
    groupedIngredients,
  });
});

router.get("/pizzas/:id", async (req, res) => {
  const { id } = req.params;
  const pizza = await prisma.pizza.findUnique({
    where: { id: Number(id) },
    include: { ingredients: { include: { ingredient: true } } },
  });

  if (!pizza) return res.status(404).json({ error: "Pizza not found" });
  res.json(pizza);
});

router.post("/pizzas", async (req, res) => {
  const { name, description, price, ingredientIds, imageUrl } = req.body;

  const pizza = await prisma.pizza.create({
    data: {
      name,
      description,
      price,
      ingredients: {
        create: ingredientIds.map((id) => ({ ingredientId: id })),
      },
      imageUrl: imageUrl,
    },
  });

  res.status(201).json(pizza);
});

router.put("/pizzas/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, ingredientIds, imageUrl } = req.body;

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
      imageUrl: imageUrl,
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

router.post("/ingredient", async (req, res) => {
  const { name, type, imageUrl, key, amount } = req.body;

  const ingredient = await prisma.ingredient.create({
    data: {
      name,
      type,
      imageUrl,
      key,
      amount: Number(amount),
    },
  });

  res.status(201).json(ingredient);
});

router.put("/ingredient", async (req, res) => {
  const { id, name, type, imageUrl, key, amount } = req.body;

  const ingredient = await prisma.ingredient.update({
    where: { id: Number(id) },
    data: {
      name,
      type,
      imageUrl,
      key,
      amount: Number(amount),
    },
  });

  res.json(ingredient);
});

router.get("/ingredients", async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany();
    const groupedIngredients = ingredients.reduce(
      (acc, ingredient) => {
        if (!acc[ingredient.type]) acc[ingredient.type] = [];

        acc[ingredient.type].push(ingredient);
        return acc;
      },
      { cheese: [], meat: [], vegetable: [], sauce: [], spice: [] }
    );
    res.status(200).json({ ingredients, groupedIngredients });
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

router.delete("/ingredient/:id", async (req, res) => {
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
  const userId = req.user.id;

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
  const userId = req.user.id;
  let basket = await prisma.basket.findUnique({
    where: { userId },
  });
  if (req.body.type !== "forum") {
    const {
      pizza,
      appetizer,
      drink,
      snack,
      quantity,
      type,
      pizzaName,
      size,
      dough,
      price,
      cheeses,
      meats,
      vegetables,
      sauces,
      spices,
      specialInstructions,
    } = req.body;
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

    if (type === "normal" || type === "pizza") {
      await prisma.basketItem.upsert({
        where: { basketId_pizzaId: { basketId: basket.id, pizzaId: Number(pizza.id) } },
        update: { quantity: { increment: quantity } },
        create: { basketId: basket.id, pizzaId: Number(pizza.id), quantity },
      });
    } else if (type === "custom") {
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
          type: ProductType.CUSTOM,
        },
      });
      await prisma.basketItem.upsert({
        where: { basketId_pizzaId: { basketId: basket.id, pizzaId: Number(pz.id) } },
        update: { quantity: { increment: 1 } },
        create: { basketId: basket.id, pizzaId: Number(pz.id), quantity: 1 },
      });
    } else if (type.toLowerCase() === "appetizer") {
      const app = await prisma.appetizer.findFirst({ where: { id: Number(appetizer.id) } });

      await prisma.basketItem.upsert({
        where: {
          basketId_appetizerId: { basketId: basket.id, appetizerId: Number(app.id) },
        },
        update: { quantity: { increment: quantity } },
        create: {
          basketId: basket.id,
          appetizerId: Number(appetizer.id),
          quantity: Number(quantity),
        },
      });
    } else if (type.toLowerCase() === "drink") {
      await prisma.basketItem.upsert({
        where: { basketId_drinkId: { basketId: basket.id, drinkId: Number(drink.id) } },
        update: { quantity: { increment: quantity } },
        create: { basketId: basket.id, drinkId: Number(drink.id), quantity: Number(quantity) },
      });
    } else if (type.toLowerCase() === "snack") {
      await prisma.basketItem.upsert({
        where: { basketId_snackId: { basketId: basket.id, snackId: Number(snack.id) } },
        update: { quantity: { increment: quantity } },
        create: { basketId: basket.id, snackId: Number(snack.id), quantity: Number(quantity) },
      });
    }

    res.json({ message: "Pizza added to basket" });
  } else {
    const { id } = req.body;
    if (id) {
      const info = await prisma.pizza.findUnique({
        where: { id: Number(id) },
        include: { ingredients: { include: { ingredient: true } } },
      });
      if (!info) return res.status(404).json({ error: "Pizza not found" });
      await prisma.basketItem.upsert({
        where: { basketId_pizzaId: { basketId: basket.id, pizzaId: Number(info.id) } },
        update: { quantity: { increment: 1 } },
        create: { basketId: 1, pizzaId: Number(info.id), quantity: 1 },
      });
      res.json({ message: "Pizza added to basket" });
    }
  }
});

router.delete("/basket/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { type } = req.query;

    if (!type || !id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid type or ID" });
    }
    const fieldMapping = {
      normal: "pizzaId",
      custom: "pizzaId",
      drink: "drinkId",
      snack: "snackId",
      appetizer: "appetizerId",
    };

    const field = fieldMapping[type.toLowerCase()];

    if (!field) {
      return res.status(400).json({ error: "Invalid type" });
    }

    await prisma.basketItem.deleteMany({
      where: { basket: { userId }, [field]: Number(id) },
    });

    res.json({ message: `${type} removed from basket` });
  } catch (error) {
    console.error("Error deleting basket item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/basket", async (req, res) => {
  const userId = req.user.id;
  const basket = await prisma.basket.findUnique({
    where: { userId },
  });

  await prisma.basketItem.deleteMany({ where: { basketId: basket.id } });

  res.json({ message: "Basket cleared" });
});

router.post("/order", async (req, res) => {
  const userId = req.user.id;
  const { address, tel, delivery, paymentType } = req.body;

  const basket = await prisma.basket.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          pizza: { include: { ingredients: true } },
          appetizer: true,
          drink: true,
          snack: true,
        },
      },
    },
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
        quantity: e.quantity,
      },
      e.drink && {
        type: "DRINK",
        name: e.drink.name,
        price: e.drink.price,
        quantity: e.quantity,
      },
      e.snack && {
        type: "SNACK",
        name: e.snack.name,
        price: e.snack.price,
        quantity: e.quantity,
      },
      e.appetizer && {
        type: "APPETIZER",
        name: e.appetizer.name,
        price: e.appetizer.price,
        quantity: e.quantity,
      },
    ])
    .filter(Boolean);
  const totalPrice = combinedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      paymentType,
      delivery,
      address,
      phone: tel,
      items: {
        create: basket.items.map((item) => ({
          ...(item.pizza && { pizzaId: item.pizzaId }),
          ...(item.drink && { drinkId: item.drinkId }),
          ...(item.snack && { snackId: item.snackId }),
          ...(item.appetizer && { appetizerId: item.appetizerId }),
          quantity: item.quantity,
        })),
      },
    },
  });
  combinedItems
    .filter((e) => e.type === ProductType.CUSTOM || e.type === ProductType.NORMAL)
    .forEach(async (e) => {
      e.ingredients.forEach(async (i) => {
        await prisma.ingredient.update({
          where: { id: i.ingredientId },
          data: { amount: { decrement: 1 } },
        });
      });
    });
  await prisma.basketItem.deleteMany({ where: { basketId: basket.id } });

  res.json(order);
});

router.get("/orders", async (req, res) => {
  const userId = req.user.id;

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
        id: e.pizza.id,
        type: e.pizza.type,
        name: e.pizza.name,
        description: (e.pizza.description && e.pizza.description.trim()) || "",
        price: e.pizza.price,
        size: e.pizza.size,
        dought: e.pizza.pizzaDough,
        ingredients: e.pizza.ingredients,
        quantity: e.quantity,
      },
      e.drink && {
        id: e.drink.id,
        type: "DRINK",
        name: e.drink.name,
        price: e.drink.price,
        quantity: e.quantity,
      },
      e.snack && {
        id: e.snack.id,
        type: "SNACK",
        name: e.snack.name,
        price: e.snack.price,
        quantity: e.quantity,
      },
      e.appetizer && {
        id: e.appetizer.id,
        type: "APPETIZER",
        name: e.appetizer.name,
        price: e.appetizer.price,
        quantity: e.quantity,
      },
    ])
    .filter(Boolean);
  const totalCost = combinedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.render("order/order", {
    user: req.user,
    result: combinedItems,
    custom: combinedItems.filter((e) => e.type === ProductType.CUSTOM),
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

router.post("/menu", async (req, res) => {
  const { name, price, type } = req.body;
  if (type == ProductType.NORMAL || type == ProductType.CUSTOM) {
    const menu = await prisma.pizza.create({
      data: {
        name,
        price,
        type,
      },
    });
    res.status(201).json(menu);
  } else if (type == ProductType.APPETIZER) {
    const menu = await prisma.appetizer.create({
      data: {
        name,
        price,
      },
    });
    res.status(201).json(menu);
  } else if (type == ProductType.SNACK) {
    const menu = await prisma.snack.create({
      data: {
        name,
        price,
      },
    });
    res.status(201).json(menu);
  } else if (type == ProductType.DRINK) {
    const menu = await prisma.drink.create({
      data: {
        name,
        price,
      },
    });
    res.status(201).json(menu);
  } else {
    res.status(400).json({ msg: "Invalid type" });
  }
});

router.put("/menu", async (req, res) => {
  const { id, name, price, type, public } = req.body;
  const [isPizza, isAppetizer, isSnack, isDrink] = [
    await prisma.pizza.findFirst({ where: { id: Number(id) } }),
    await prisma.appetizer.findFirst({ where: { id: Number(id) } }),
    await prisma.snack.findFirst({ where: { id: Number(id) } }),
    await prisma.drink.findFirst({ where: { id: Number(id) } }),
  ];

  if (isPizza) {
    await prisma.pizza.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        public,
        type,
      },
    });
  }

  if (isAppetizer) {
    await prisma.appetizer.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        public,
        type,
      },
    });
  }

  if (isSnack) {
    await prisma.snack.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        public,
        type,
      },
    });
  }

  if (isDrink) {
    await prisma.drink.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        public,
        type,
      },
    });
  }

  res.json({ message: "Menu updated successfully" });
});

router.delete("/menu/:id", async (req, res) => {
  const { id } = req.params;
  const [isPizza, isAppetizer, isSnack, isDrink] = [
    await prisma.pizza.findFirst({ where: { id: Number(id) } }),
    await prisma.appetizer.findFirst({ where: { id: Number(id) } }),
    await prisma.snack.findFirst({ where: { id: Number(id) } }),
    await prisma.drink.findFirst({ where: { id: Number(id) } }),
  ];

  if (isPizza) {
    await prisma.pizza.delete({
      where: { id: Number(id) },
    });
  }

  if (isAppetizer) {
    await prisma.appetizer.delete({
      where: { id: Number(id) },
    });
  }

  if (isSnack) {
    await prisma.snack.delete({
      where: { id: Number(id) },
    });
  }

  if (isDrink) {
    await prisma.drink.delete({
      where: { id: Number(id) },
    });
  }

  res.json({ message: "Menu deleted successfully" });
});
router.put("/transaction", async (req, res) => {
  const { id, status } = req.body;
  const transaction = await prisma.order.update({
    where: { id: Number(id) },
    data: { status },
  });
  res.json(transaction);
});

router.put("/member/:id", async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { email, name },
  });

  res.json(user);
});

router.delete("/member/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Member deleted successfully" });
});

router.put("/review/:id", async (req, res) => {
  const { id } = req.params;
  const { star, review } = req.body;

  const transaction = await prisma.order.update({
    where: { id: Number(id) },
    data: { star, reviews: JSON.stringify(review) },
  });

  res.json(transaction);
});

router.put("/public/:id", async (req, res) => {
  const { id } = req.params;
  const { public } = req.body;

  const menu = await prisma.pizza.findFirst({
    where: { id: Number(id) },
  });

  if (!menu) return res.status(404).json({ error: "Menu not found" });

  const updatedMenu = await prisma.pizza.update({
    where: { id: Number(id) },
    data: { public: !public },
  });

  res.json(updatedMenu);
});
module.exports = router;
