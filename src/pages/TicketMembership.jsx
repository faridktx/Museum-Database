import { useEffect, useState } from "react";
import "../pages/sheets/Style.TicketMembership.css";
import { useUser } from "@clerk/clerk-react";
import { apiFetch, capitalize } from "../components/utils";
import { useLocation } from "wouter";

export function TicketMembership() {
  const { user } = useUser();
  const [, navigate] = useLocation();

  const [ticketPrices, setTicketPrices] = useState({});
  const [exhibitPrices, setExhibitPrices] = useState({});
  const [tickets, setTickets] = useState({});
  const [exhibits, setExhibits] = useState({});
  const [membership, setMembership] = useState(null);
  const [membershipOptions, setMembershipOptions] = useState([]);
  const [openMembership, setOpenMembership] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      const [ticketsRes, exhibitsRes, membershipsRes] = await Promise.all([
        apiFetch("/api/gettickets/", "GET", user.id),
        apiFetch("/api/getexhibitnames/", "GET", user.id),
        apiFetch("/api/getmemberships/", "GET", user.id),
      ]);

      const ticketQty = {}, ticketPrice = {};
      ticketsRes.data.sort((a, b) => a.price - b.price).forEach(t => {
        ticketQty[t.ticket_type] = 0;
        ticketPrice[t.ticket_type] = t.price;
      });

      const exhibitQty = {}, exhibitPrice = {};
      exhibitsRes.data.forEach(e => {
        exhibitQty[e.exhibit_name] = 0;
        exhibitPrice[e.exhibit_name] = 15;
      });

      setTickets(ticketQty);
      setTicketPrices(ticketPrice);
      setExhibits(exhibitQty);
      setExhibitPrices(exhibitPrice);
      setMembershipOptions(membershipsRes.data.sort((a, b) => a.price - b.price));
    }

    fetchAll();
  }, [user.id]);

  const handleRedirectToCart = () => {
    const ticketItems = Object.entries(tickets).reduce((acc, [type, count]) => {
      if (count > 0) acc[type] = { count, price: ticketPrices[type] };
      return acc;
    }, {});

    const exhibitItems = Object.entries(exhibits).reduce((acc, [name, count]) => {
      if (count > 0) acc[name] = { count, price: exhibitPrices[name] };
      return acc;
    }, {});

    localStorage.setItem("cart_data", JSON.stringify({ tickets: ticketItems, exhibits: exhibitItems, membership }));
    navigate("/dashboard/cart");
  };

  return (
    <div className="page-layout">
      {/* LEFT: TICKETS + EXHIBITS + SUMMARY */}
      <div className="ticket-wrapper">
        <h2>General Admissions</h2>
        <div className="ticket-info">
          Tickets grant access to our museum’s core collection. Additional access to exclusive and rotating special exhibits requires separate admission unless a membership is purchased.
        </div>

        <div className="ticket-box">
          <h3>Tickets</h3>
          {Object.keys(tickets).map(type => (
            <div key={type} className="ticket-option">
              <span>{capitalize(type)} - ${ticketPrices[type]}</span>
              <div className="quantity-selector">
                <button onClick={() => setTickets(p => ({ ...p, [type]: Math.max(0, p[type] - 1) }))}>-</button>
                <span className="qty-count">{tickets[type]}</span>
                <button onClick={() => setTickets(p => ({ ...p, [type]: p[type] + 1 }))}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="ticket-box">
          <h3>Special Exhibit Access</h3>
          {Object.keys(exhibits).map(name => (
            <div key={name} className="ticket-option">
              <span>{name} - ${exhibitPrices[name]}</span>
              <div className="quantity-selector">
                <button onClick={() => setExhibits(p => ({ ...p, [name]: Math.max(0, p[name] - 1) }))}>-</button>
                <span className="qty-count">{exhibits[name]}</span>
                <button onClick={() => setExhibits(p => ({ ...p, [name]: p[name] + 1 }))}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary-box">
          <h3>Order Summary</h3>

          {Object.entries(tickets).map(([type, count]) =>
            count > 0 ? (
              <div key={type} className="order-line">
                <span>{capitalize(type)} Tickets</span>
                <span>${(count * ticketPrices[type]).toFixed(2)}</span>
              </div>
            ) : null
          )}

          {Object.entries(exhibits).map(([name, count]) =>
            count > 0 ? (
              <div key={name} className="order-line">
                <span>{name} Exhibit</span>
                <span>${(count * exhibitPrices[name]).toFixed(2)}</span>
              </div>
            ) : null
          )}

          {membership && (
            <div className="order-line">
              <span>{capitalize(membership)} Membership</span>
              <span>
                $
                {
                  membershipOptions.find(
                    (opt) => opt.membership_type === membership
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
                Object.entries(tickets).reduce(
                  (sum, [type, count]) => sum + count * ticketPrices[type],
                  0
                ) +
                Object.entries(exhibits).reduce(
                  (sum, [name, count]) => sum + count * exhibitPrices[name],
                  0
                ) +
                (membership
                  ? membershipOptions.find((opt) => opt.membership_type === membership)?.price || 0
                  : 0)
              ).toFixed(2)}
            </span>
          </div>

          <button onClick={handleRedirectToCart} className="checkout-button">
            View Cart & Checkout
          </button>
        </div>
      </div>

      {/* RIGHT: MEMBERSHIPS */}
      <div className="membership-section">
        <h2>Membership Plans</h2>
        <div className="ticket-info" style={{ marginTop: "-0.5rem" }}>
          All memberships include unlimited access to all special exhibit areas and exclusive member benefits throughout the year.
        </div>

        {membershipOptions.map(option => {
          const isSelected = membership === option.membership_type;
          const isOpen = openMembership === option.membership_type;

          return (
            <div
              key={option.membership_type}
              className={`membership-card ${isSelected ? "selected" : ""} ${isOpen ? "open" : ""}`}
            >
              <div
                className="membership-header"
                onClick={() => setOpenMembership(isOpen ? null : option.membership_type)}
              >
                <h3>{capitalize(option.membership_type)}</h3>
                <p>${option.price} / {option.period}</p>
              </div>

              <div className="membership-details">
                <ul>
                  {option.benefits.split(";").map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <button
                  className="select-button"
                  onClick={() => setMembership(isSelected ? null : option.membership_type)}
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
