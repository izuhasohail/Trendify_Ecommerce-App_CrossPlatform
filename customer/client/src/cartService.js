import Cookies from "js-cookie";

const COOKIE_NAME = "cart";

const getCartItems = () => {
  const cartCookie = Cookies.get(COOKIE_NAME);
  return cartCookie ? JSON.parse(cartCookie) : [];
};

const setCartItems = (cartItems) => {
  // const expirationTime = new Date(Date.now() + 30 * 1000);
  Cookies.set(COOKIE_NAME, JSON.stringify(cartItems), { expires: 1 }); // Set cookie expiration as needed

  // setTimeout(() => {
  //   Cookies.remove(COOKIE_NAME);
  // }, 30 * 1000);
};

const addToCart = (product) => {
  console.log("product added as ", product._id);

  const cartItems = getCartItems();
  const existingProductIndex = cartItems.findIndex(
    (item) => item._id === product._id
  );

  if (existingProductIndex !== -1) {
    // Product already exists in the cart, update quantity
    if (product.quantity) {
      cartItems[existingProductIndex].quantity += product.quantity;
    } else {
      cartItems[existingProductIndex].quantity += 1;
    }
  } else {
    // Product doesn't exist in the cart, add it
    cartItems.push({
      ...product,
      quantity: product.quantity && product.quantity > 0 ? product.quantity : 1,
    });
  }

  setCartItems(cartItems);
};

const removeFromCart = (productId) => {
  let cartItems = getCartItems();

  const productToRemoveIndex = cartItems.findIndex(
    (item) => item._id === productId
  );

  if (productToRemoveIndex !== -1) {
    // If there are multiple identical products, decrement the quantity
    if (cartItems[productToRemoveIndex].quantity > 1) {
      cartItems[productToRemoveIndex].quantity -= 1;
    } else {
      // If only one instance, remove the entire product
      cartItems = cartItems.filter((item) => item._id !== productId);
    }
  }

  setCartItems(cartItems);
};

const updateQuantity = (productId, newQuantity) => {
  const cartItems = getCartItems();
  const productToUpdateIndex = cartItems.findIndex(
    (item) => item._id === productId
  );

  if (productToUpdateIndex !== -1 && newQuantity >= 1) {
    // Ensure quantity is at least 1 before updating
    cartItems[productToUpdateIndex].quantity = newQuantity;
  }

  setCartItems(cartItems);
};

const clearCart = () => {
  Cookies.remove(COOKIE_NAME);
};

const getCartLength = () => {
  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    return 0; // Return 0 if the cart is empty
  }

  // Otherwise, calculate and return the total quantity of items in the cart
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

const removeEntireItem = (productId) => {
  let cartItems = getCartItems();
  cartItems = cartItems.filter((item) => item._id !== productId);
  setCartItems(cartItems);
};

export {
  getCartItems,
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartLength,
  removeEntireItem,
};
