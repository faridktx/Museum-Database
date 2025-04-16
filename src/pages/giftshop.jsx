import { useEffect, useState } from "react";
import "../components/components.css";
import { useUser } from "@clerk/clerk-react";
import { apiFetch, fetchWithBody } from "../components/utils";
import { Popup } from "../components/popup";
import {
  ShoppingCart,
  Book,
  ShoppingBag,
  Coffee,
  Gem,
  Puzzle,
} from "lucide-react";

export function GiftShop() {
  const { user } = useUser();

  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [shopItems, setShopItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState({
    title: "",
    message: "",
    buttonText: "Ok",
  });

  useEffect(() => {
    const loadGiftShopItems = async () => {
      const response = await apiFetch("/api/getgiftshopitems/", "GET", user.id);
      setShopItems(response.data);
      setCategories(
        [...new Set(response.data.map((item) => item.category))].sort(),
      );
    };
    loadGiftShopItems();
  }, []);

  const handleGiftShopPurchase = async () => {
    const response = await fetchWithBody("/api/giftshop", "POST", {
      cart: cart,
      id: user.id,
    });
    if (response.success) {
      setCart({});
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully purchased your items!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Errors!",
        message: compileErrors(response.errors),
        buttonText: "Ok",
      });
    }
    setShowPopup(true);
  };

  const categoryIconMap = {
    Books: <Book size={48} strokeWidth={1} />,
    Apparel: <ShoppingBag size={48} strokeWidth={1} />,
    Home: <Coffee size={48} strokeWidth={1} />,
    Collectibles: <Gem size={48} strokeWidth={1} />,
    Games: <Puzzle size={48} strokeWidth={1} />,
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 0) return;

    setCart((prevCart) => {
      if (newQuantity === 0) {
        const newCart = { ...prevCart };
        delete newCart[itemId];
        return newCart;
      }

      return {
        ...prevCart,
        [itemId]: newQuantity,
      };
    });
  };

  const calculateCartTotal = () => {
    return Object.entries(cart)
      .reduce((total, [itemId, quantity]) => {
        const item = shopItems.find(
          (item) => item.item_id === parseInt(itemId),
        );
        return total + parseFloat(item.unit_price) * parseInt(quantity);
      }, 0)
      .toFixed(2);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const getItemsInCategory = (category) => {
    return shopItems.filter((item) => item.category === category);
  };

  return (
    <div className="gift-shop-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Museum Gift Shop</h1>
          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart />
            <span className="cart-count">{getCartItemCount()}</span>
          </button>
        </div>

        {showCart && (
          <div className="shopping-cart">
            <h2>Your Shopping Cart</h2>
            {Object.keys(cart).length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-items">
                  {Object.entries(cart).map(([itemId, quantity]) => {
                    const item = shopItems.find(
                      (item) => item.item_id === parseInt(itemId),
                    );
                    return (
                      <div key={itemId} className="cart-item">
                        <div className="cart-item-image">
                          {categoryIconMap[item.category]}
                        </div>
                        <div className="cart-item-info">
                          <h3>{item.item_name}</h3>
                          <p>${item.unit_price.toFixed(2)} each</p>
                        </div>
                        <div className="cart-item-quantity">
                          <div className="quantity-selector">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(itemId, quantity - 1)
                              }
                            >
                              -
                            </button>
                            <span className="quantity">{quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(itemId, quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                          <p className="cart-item-subtotal">
                            ${(item.unit_price * quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="cart-total">
                  <span>Total:</span>
                  <span>${calculateCartTotal()}</span>
                </div>
                <button
                  onClick={handleGiftShopPurchase}
                  className="button checkout-button"
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        )}

        <div className="gift-shop-container">
          {categories.map((category) => (
            <div key={category} className="product-category">
              <h2>{category}</h2>
              <div className="product-grid">
                {getItemsInCategory(category).map((item) => (
                  <div key={item.item_id} className="product-card">
                    <div className="product-image">
                      {categoryIconMap[item.category]}
                    </div>
                    <div className="product-info">
                      <h3>{item.item_name}</h3>
                      <p className="product-description">{item.description}</p>
                      <p className="product-price">
                        ${item.unit_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="product-actions">
                      <div className="quantity-selector">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.item_id,
                              (cart[item.item_id] || 0) - 1,
                            )
                          }
                          disabled={!cart[item.item_id]}
                        >
                          -
                        </button>
                        <span className="quantity">
                          {cart[item.item_id] || 0}
                        </span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.item_id,
                              (cart[item.item_id] || 0) + 1,
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Popup
        show={showPopup}
        title={currentPopup.title}
        message={currentPopup.message}
        buttonText={currentPopup.buttonText}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}
