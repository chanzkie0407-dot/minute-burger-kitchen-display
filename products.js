const PRODUCTS = {
  // === SULIT — Buy 1 Take 1, Default: 10 min ===
  MB: { name: "Minute Burger", category: "Sulit", defaultTime: 10, buy1Take1: true },
  DMB: { name: "Double Minute Burger", category: "Sulit", defaultTime: 10, buy1Take1: true },
  CB: { name: "CheesyBurger", category: "Sulit", defaultTime: 10, buy1Take1: true },
  DBM: { name: "Double CheesyBurger", category: "Sulit", defaultTime: 10, buy1Take1: true },

  // === CHICKEN — Buy 1 Take 1, Default: 10 min ===
  CT: { name: "ChickenTime Burger", category: "Chicken", defaultTime: 10, buy1Take1: true },
  DCT: { name: "Double ChickenTime Burger", category: "Chicken", defaultTime: 10, buy1Take1: true },

  // === HOTDOG — Buy 1 Take 1, Default: 10 min ===
  CD: { name: "Cheesydog", category: "Hotdog", defaultTime: 10, buy1Take1: true },
  BH: { name: "Beef Hungarian", category: "Hotdog", defaultTime: 10, buy1Take1: true },
  FO: { name: "French Onion Franks", category: "Hotdog", defaultTime: 10, buy1Take1: true },

  // === DRINKS — Default: 3 min, Hindi Buy 1 Take 1 ===
  IC: { name: "Iced Choco", category: "Drinks", defaultTime: 3, buy1Take1: false },
  CI: { name: "Iced Coffee", category: "Drinks", defaultTime: 3, buy1Take1: false },
  HM: { name: "Hot Choco", category: "Drinks", defaultTime: 3, buy1Take1: false },
  HC: { name: "Hot Coffee", category: "Drinks", defaultTime: 3, buy1Take1: false },
  H20: { name: "Mineral Water", category: "Drinks", defaultTime: 3, buy1Take1: false },
  FT: { name: "FruiTwist", category: "Drinks", defaultTime: 3, buy1Take1: false },
  BLT: { name: "Black Lemon Ice Tea", category: "Drinks", defaultTime: 3, buy1Take1: false },

  // === EXTRAS — Default: 3 min ===
  EGG: { name: "Dagdag Itlog", category: "Extras", defaultTime: 3, buy1Take1: false },
  CL: { name: "Coleslaw", category: "Extras", defaultTime: 3, buy1Take1: false },
  SC: { name: "Slice Cheese", category: "Extras", defaultTime: 3, buy1Take1: false },

  // === BIGTIME BURGERS — Default: 12 min ===
  BPB: { name: "Black Pepper Burger", category: "Bigtime", defaultTime: 12, buy1Take1: false },
  BCB: { name: "Bacon Cheese Burger", category: "Bigtime", defaultTime: 12, buy1Take1: false },
  BSB: { name: "Beef Shawarma Burger", category: "Bigtime", defaultTime: 12, buy1Take1: false },
  RSB: { name: "Roasted Crispy Chicken Burger", category: "Bigtime", defaultTime: 12, buy1Take1: false },
  CCB: { name: "Crispy Chicken Chimichurri Burger", category: "Bigtime", defaultTime: 12, buy1Take1: false },
  BIY: { name: "Premium Steak Burger", category: "Bigtime", defaultTime: 12, buy1Take1: false },
  PBB: { name: "Bacon Pizza Burger", category: "Bigtime", defaultTime: 12, buy1Take1: false },
  CSB: { name: "Chicken Sisig Burger", category: "Bigtime", defaultTime: 12, buy1Take1: false }
};
