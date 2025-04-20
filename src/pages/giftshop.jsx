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
  const [uniqueMemberships, setUniqueMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    supplier: "",
    price: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsRes, membershipsRes] = await Promise.all([
          apiFetch("/api/custom/giftshop-items", "GET", user?.id),
          apiFetch("/api/custom/memberships", "GET", user?.id),
        ]);

        setShopItems(itemsRes.data || []);
        setFilteredItems(itemsRes.data || []);
        setUniqueMemberships(membershipsRes.data || []);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    if (user?.id) loadData();
  }, [user]);

  useEffect(() => {
    let filtered = shopItems.filter((item) => {
      return (
        (!filters.category || item.category === filters.category) &&
        (!filters.supplier || item.supplier === filters.supplier) &&
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

  const handleMembershipSelect = (membership) => {
    setSelectedMembership((prev) => {
      // If clicking the same membership, deselect it
      if (prev?.membership_type === membership.membership_type) {
        return null;
      }
      return membership;
    });
  };

  const calculateCartTotal = () => {
    const itemsTotal = Object.entries(cart).reduce(
      (total, [itemId, { count, price }]) => {
        return total + count * price;
      },
      0,
    );

    const membershipTotal = selectedMembership ? selectedMembership.price : 0;

    return (itemsTotal + membershipTotal).toFixed(2);
  };

  const uniqueValues = (field) => [
    ...new Set(shopItems.map((item) => item[field])),
  ];

  const clearFilters = () => {
    setFilters({ category: "", supplier: "", price: "" });
  };

  const handleRedirectToCart = () => {
    if (!user?.id) {
      alert("Please log in to checkout.");
      navigate("/sign-in");
      return;
    }

    const existing = localStorage.getItem("museum_cart");
    const parsed = existing ? JSON.parse(existing) : {};

    // Prepare membership data if selected
    const membershipCart = selectedMembership
      ? {
          membership: selectedMembership.membership_type,
          membershipData: selectedMembership,
        }
      : {};

    const merged = {
      ...parsed,
      giftshop: cart,
      ...membershipCart,
      guestId: user.id,
    };

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
                  setFilters((f) => ({ ...f, supplier: e.target.value }))
                }
                value={filters.supplier}
              >
                <option value="">All Suppliers</option>
                {uniqueValues("supplier").map((sup) => (
                  <option key={sup}>{sup}</option>
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
          {Object.keys(cart).length === 0 && !selectedMembership ? (
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

              {selectedMembership && (
                <div className="cart-line membership-line">
                  <span>
                    {selectedMembership.membership_type} Membership × 1
                  </span>
                  <span>${selectedMembership.price.toFixed(2)}</span>
                </div>
              )}

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

        <div className="membership-section">
          <h3>Memberships</h3>
          {uniqueMemberships.map((membership) => (
            <div
              key={membership.membership_type}
              className={`membership-card ${
                selectedMembership?.membership_type ===
                membership.membership_type
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleMembershipSelect(membership)}
            >
              <h4>{capitalize(membership.membership_type)}</h4>
              <p>${membership.price.toFixed(2)}</p>
              <p>{membership.description}</p>
              <small>{membership.period}</small>
            </div>
          ))}
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
                  <div className="image-placeholder"></div>
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
