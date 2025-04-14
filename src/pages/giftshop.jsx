import { useState } from "react";
import "../components/components.css";
import {
  ShoppingCart,
  Book,
  ShoppingBag,
  Coffee,
  Gem,
  FileText,
  Calendar,
  Puzzle,
  ShirtIcon,
} from "lucide-react";

export function GiftShop() {
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);

  const shopItems = [
    {
      id: "ancient-egypt-booklet",
      name: "Ancient Egypt Exhibition Booklet",
      price: 12.99,
      description: "A detailed guide to our Ancient Egypt exhibition",
      category: "Books",
      image: <Book size={48} strokeWidth={1} />,
    },
    {
      id: "museum-tote",
      name: "Museum Collection Tote Bag",
      price: 24.99,
      description: "Canvas tote bag with museum logo",
      category: "Apparel",
      image: <ShoppingBag size={48} strokeWidth={1} />,
    },
    {
      id: "art-history-book",
      name: "Art History: A Complete Guide",
      price: 39.99,
      description: "Comprehensive art history reference book",
      category: "Books",
      image: <Book size={48} strokeWidth={1} />,
    },
    {
      id: "artifact-mug",
      name: "Artifact Collection Mug",
      price: 18.99,
      description: "Ceramic mug featuring famous artifacts",
      category: "Home",
      image: <Coffee size={48} strokeWidth={1} />,
    },
    {
      id: "museum-calendar",
      name: "2024 Museum Calendar",
      price: 15.99,
      description: "Wall calendar featuring 12 famous artworks",
      category: "Home",
      image: <Calendar size={48} strokeWidth={1} />,
    },
    {
      id: "sculpture-replica",
      name: "Mini Sculpture Replica",
      price: 49.99,
      description: "High-quality replica of famous sculpture",
      category: "Collectibles",
      image: <Gem size={48} strokeWidth={1} />,
    },
    {
      id: "museum-notebook",
      name: "Museum Collection Notebook",
      price: 14.99,
      description: "Hardcover notebook with museum designs",
      category: "Stationery",
      image: <FileText size={48} strokeWidth={1} />,
    },
    {
      id: "museum-shirt",
      name: "Museum Logo T-Shirt",
      price: 22.99,
      description: "Cotton t-shirt with embroidered museum logo",
      category: "Apparel",
      image: <ShirtIcon size={48} strokeWidth={1} />,
    },
    {
      id: "art-puzzle",
      name: "Masterpiece Puzzle (1000 pc)",
      price: 27.99,
      description: "1000 piece puzzle of famous artwork",
      category: "Games",
      image: <Puzzle size={48} strokeWidth={1} />,
    },
  ];

  const categories = [
    ...new Set(shopItems.map((item) => item.category)),
  ].sort();

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
        const item = shopItems.find((item) => item.id === itemId);
        return total + item.price * quantity;
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
                    const item = shopItems.find((item) => item.id === itemId);
                    return (
                      <div key={itemId} className="cart-item">
                        <div className="cart-item-image">{item.image}</div>
                        <div className="cart-item-info">
                          <h3>{item.name}</h3>
                          <p>${item.price.toFixed(2)} each</p>
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
                            ${(item.price * quantity).toFixed(2)}
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
                <button className="button checkout-button">
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
                  <div key={item.id} className="product-card">
                    <div className="product-image">{item.image}</div>
                    <div className="product-info">
                      <h3>{item.name}</h3>
                      <p className="product-description">{item.description}</p>
                      <p className="product-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="product-actions">
                      <div className="quantity-selector">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              (cart[item.id] || 0) - 1,
                            )
                          }
                          disabled={!cart[item.id]}
                        >
                          -
                        </button>
                        <span className="quantity">{cart[item.id] || 0}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              (cart[item.id] || 0) + 1,
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
    </div>
  );
}
