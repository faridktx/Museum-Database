import { useEffect, useState } from "react";
import "../pages/sheets/Style.giftshop.css";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { apiFetch } from "../components/utils.custom";

export function GiftShop() {
  const { user } = useUser();
  const [, navigate] = useLocation();

  const [cart, setCart] = useState({});
  const [shopItems, setShopItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    size: "",
    price: "",
  });

  useEffect(() => {
    const loadGiftShopItems = async () => {
      const response = await apiFetch(
        "/api/custom/giftshop-items",
        "GET",
        user?.id,
      );
      setShopItems(response.data || []);
      setFilteredItems(response.data || []);
    };
    if (user?.id) loadGiftShopItems();
  }, [user]);

  useEffect(() => {
    let filtered = shopItems.filter((item) => {
      return (
        (!filters.category || item.category === filters.category) &&
        (!filters.color || item.color === filters.color) &&
        (!filters.size || item.size === filters.size) &&
        (!filters.price || item.unit_price <= parseFloat(filters.price))
      );
    });
    setFilteredItems(filtered);
  }, [filters, shopItems]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    setCart((prevCart) => {
      const item = shopItems.find((i) => i.item_id === parseInt(itemId));
      if (!item) return prevCart;

      if (newQuantity === 0) {
        const newCart = { ...prevCart };
        delete newCart[itemId];
        return newCart;
      }

      return {
        ...prevCart,
        [itemId]: {
          count: newQuantity,
          price: parseFloat(item.unit_price),
        },
      };
    });
  };

  const calculateCartTotal = () => {
    return Object.entries(cart)
      .reduce((total, [itemId, { count, price }]) => {
        return total + count * price;
      }, 0)
      .toFixed(2);
  };

  const uniqueValues = (field) => [
    ...new Set(shopItems.map((item) => item[field])),
  ];

  const clearFilters = () => {
    setFilters({ category: "", color: "", size: "", price: "" });
  };

  const handleRedirectToCart = () => {
    if (!user?.id) {
      alert("Please log in to checkout.");
      navigate("/sign-in");
      return;
    }

    const existing = localStorage.getItem("museum_cart");
    const parsed = existing ? JSON.parse(existing) : {};
    const merged = { ...parsed, giftshop: cart, guestId: user.id };

    localStorage.setItem("museum_cart", JSON.stringify(merged));
    navigate("/dashboard/cart");
  };

  return (
    <div className="giftshop-layout">
      <aside className="giftshop-filters">
        <div className="filters-container-horizontal">
          <h3>Filters</h3>
          <div className="filter-row">
            <div className="filter-item">
              <select
                onChange={(e) =>
                  setFilters((f) => ({ ...f, category: e.target.value }))
                }
                value={filters.category}
              >
                <option value="">All Categories</option>
                {uniqueValues("category").map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <select
                onChange={(e) =>
                  setFilters((f) => ({ ...f, color: e.target.value }))
                }
                value={filters.color}
              >
                <option value="">All Colors</option>
                {uniqueValues("color").map((color) => (
                  <option key={color}>{color}</option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <select
                onChange={(e) =>
                  setFilters((f) => ({ ...f, size: e.target.value }))
                }
                value={filters.size}
              >
                <option value="">All Sizes</option>
                {uniqueValues("size").map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <input
                type="number"
                placeholder="Max Price"
                value={filters.price}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, price: e.target.value }))
                }
              />
            </div>
          </div>
          <button onClick={clearFilters} className="clear-filters">
            Clear Filters
          </button>
        </div>

        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          {Object.keys(cart).length === 0 ? (
            <p className="empty-cart-msg">Your cart is empty.</p>
          ) : (
            <>
              {Object.entries(cart).map(([itemId, { count, price }]) => {
                const item = shopItems.find(
                  (i) => i.item_id === parseInt(itemId),
                );
                return (
                  <div key={itemId} className="cart-line">
                    <span>
                      {item?.item_name} × {count}
                    </span>
                    <span>${(price * count).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="cart-line" style={{ fontWeight: "600" }}>
                <span>Total</span>
                <span>${calculateCartTotal()}</span>
              </div>
              <button
                className="checkout-button"
                onClick={handleRedirectToCart}
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </aside>

      <main className="giftshop-content">
        <h2>Museum Gift Shop</h2>
        <div className="product-grid">
          {filteredItems.map((item) => (
            <div key={item.item_id} className="product-card">
              <div className="product-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.item_name} />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      backgroundColor: "#f1f5f9",
                    }}
                  ></div>
                )}
              </div>
              <div className="product-info">
                <h3>{item.item_name}</h3>
                <p className="product-description">{item.description}</p>
                <p className="product-price">${item.unit_price.toFixed(2)}</p>
              </div>
              <div className="product-actions">
                <button
                  className="quantity-btn"
                  onClick={() =>
                    handleQuantityChange(
                      item.item_id,
                      (cart[item.item_id]?.count || 0) - 1,
                    )
                  }
                  disabled={!cart[item.item_id]}
                >
                  -
                </button>
                <span className="quantity">
                  {cart[item.item_id]?.count || 0}
                </span>
                <button
                  className="quantity-btn"
                  onClick={() =>
                    handleQuantityChange(
                      item.item_id,
                      (cart[item.item_id]?.count || 0) + 1,
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
