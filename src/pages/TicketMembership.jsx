import { useEffect, useState } from "react";
import "../pages/sheets/Style.TicketMembership.css";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { apiFetch, capitalize } from "../components/utils.custom";

export function TicketMembership() {
  const { user } = useUser();
  const [, navigate] = useLocation();

  const [tickets, setTickets] = useState({});
  const [exhibits, setExhibits] = useState({});
  const [membership, setMembership] = useState(null);
  const [membershipOptions, setMembershipOptions] = useState([]);
  const [openMembership, setOpenMembership] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      const [ticketsRes, exhibitsRes, membershipsRes] = await Promise.all([
        apiFetch("/api/custom/ticket-types", "GET", user?.id),
        apiFetch("/api/custom/exhibit-names", "GET", user?.id),
        apiFetch("/api/custom/memberships", "GET", user?.id),
      ]);

      const ticketCart = {};
      (ticketsRes.data || []).forEach((t) => {
        ticketCart[t.ticket_type] = { count: 0, price: t.price };
      });

      const exhibitCart = {};
      (exhibitsRes.data || []).forEach((e) => {
        exhibitCart[e.exhibit_name] = { count: 0, price: 15 }; // assume 15 or fetch dynamically if needed
      });

      setTickets(ticketCart);
      setExhibits(exhibitCart);
      setMembershipOptions(
        (membershipsRes.data || []).sort((a, b) => a.price - b.price),
      );
    }

    if (user?.id) fetchAll();
  }, [user]);

  const handleRedirectToCart = async () => {
    if (!user?.id) {
      alert("Please log in to proceed.");
      navigate("/sign-in");
      return;
    }

    const ticketItems = {};
    for (const [type, { count, price }] of Object.entries(tickets)) {
      if (count > 0) ticketItems[type] = { count, price };
    }

    const exhibitItems = {};
    for (const [name, { count, price }] of Object.entries(exhibits)) {
      if (count > 0) exhibitItems[name] = { count, price };
    }

    localStorage.setItem(
      "museum_cart",
      JSON.stringify({
        guestId: user.id,
        tickets: ticketItems,
        exhibits: exhibitItems,
        membership,
      }),
    );

    navigate("/dashboard/cart");
  };

  return (
    <div className="page-layout">
      <div className="ticket-wrapper">
        <h2>General Admissions</h2>
        <div className="ticket-info">
          Tickets grant access to our museum’s core collection...
        </div>

        <div className="ticket-box">
          <h3>Tickets</h3>
          {Object.entries(tickets).map(([type, item]) => (
            <div key={type} className="ticket-option">
              <span>
                {capitalize(type)} - ${item.price}
              </span>
              <div className="quantity-selector">
                <button
                  onClick={() =>
                    setTickets((p) => ({
                      ...p,
                      [type]: {
                        ...p[type],
                        count: Math.max(0, p[type].count - 1),
                      },
                    }))
                  }
                >
                  -
                </button>
                <span className="qty-count">{item.count}</span>
                <button
                  onClick={() =>
                    setTickets((p) => ({
                      ...p,
                      [type]: { ...p[type], count: p[type].count + 1 },
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="ticket-box">
          <h3>Special Exhibit Access</h3>
          {Object.entries(exhibits).map(([name, item]) => (
            <div key={name} className="ticket-option">
              <span>
                {name} - ${item.price}
              </span>
              <div className="quantity-selector">
                <button
                  onClick={() =>
                    setExhibits((p) => ({
                      ...p,
                      [name]: {
                        ...p[name],
                        count: Math.max(0, p[name].count - 1),
                      },
                    }))
                  }
                >
                  -
                </button>
                <span className="qty-count">{item.count}</span>
                <button
                  onClick={() =>
                    setExhibits((p) => ({
                      ...p,
                      [name]: { ...p[name], count: p[name].count + 1 },
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary-box">
          <h3>Order Summary</h3>

          {Object.entries(tickets).map(
            ([type, item]) =>
              item.count > 0 && (
                <div key={type} className="order-line">
                  <span>{capitalize(type)} Tickets</span>
                  <span>${(item.count * item.price).toFixed(2)}</span>
                </div>
              ),
          )}

          {Object.entries(exhibits).map(
            ([name, item]) =>
              item.count > 0 && (
                <div key={name} className="order-line">
                  <span>{name} Exhibit</span>
                  <span>${(item.count * item.price).toFixed(2)}</span>
                </div>
              ),
          )}

          {membership && (
            <div className="order-line">
              <span>{capitalize(membership)} Membership</span>
              <span>
                $
                {
                  membershipOptions.find(
                    (opt) => opt.membership_type === membership,
                  )?.price
                }
              </span>
            </div>
          )}

          <div className="order-line" style={{ fontWeight: "600" }}>
            <span>Total</span>
            <span>
              $
              {(
                Object.values(tickets).reduce(
                  (sum, item) => sum + item.count * item.price,
                  0,
                ) +
                Object.values(exhibits).reduce(
                  (sum, item) => sum + item.count * item.price,
                  0,
                ) +
                (membership
                  ? membershipOptions.find(
                      (opt) => opt.membership_type === membership,
                    )?.price || 0
                  : 0)
              ).toFixed(2)}
            </span>
          </div>

          <button onClick={handleRedirectToCart} className="checkout-button">
            View Cart & Checkout
          </button>
        </div>
      </div>

      <div className="membership-section">
        <h2>Membership Plans</h2>
        <div className="ticket-info" style={{ marginTop: "-0.5rem" }}>
          All memberships include unlimited access to all special exhibits...
        </div>

        {membershipOptions.map((option) => {
          const isSelected = membership === option.membership_type;
          const isOpen = openMembership === option.membership_type;

          return (
            <div
              key={option.membership_type}
              className={`membership-card ${isSelected ? "selected" : ""} ${isOpen ? "open" : ""}`}
            >
              <div
                className="membership-header"
                onClick={() =>
                  setOpenMembership(isOpen ? null : option.membership_type)
                }
              >
                <h3>{capitalize(option.membership_type)}</h3>
                <p>
                  ${option.price} / {option.period}
                </p>
              </div>

              <div className="membership-details">
                <ul>
                  {option.benefits.split(";").map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <button
                  className="select-button"
                  onClick={() =>
                    setMembership(isSelected ? null : option.membership_type)
                  }
                >
                  {isSelected ? "Unselect" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
