import { useState } from "react";
import "../components/components.css";
import { fetchWithBody } from "../components/utils";

export function Tickets() {
  const [tickets, setTickets] = useState({
    general: 0,
    senior: 0,
    student: 0,
    child: 0,
  });

  const [exhibits, setExhibits] = useState({
    "Ancient Egypt": 0,
    "Renaissance Art": 0,
    "Modern Sculpture": 0,
    "Natural History": 0,
  });

  const ticketPrices = {
    general: 15,
    senior: 10,
    student: 8,
    child: 5,
  };

  const exhibitPrices = {
    "Ancient Egypt": 8,
    "Renaissance Art": 10,
    "Modern Sculpture": 7,
    "Natural History": 9,
  };

  const totalQuantitySelected = () => {
    return Object.values(tickets).reduce((total, qty) => {
      return total + qty;
    });
  };

  const handleTicketChange = (type, value) => {
    if (value >= 0) {
      setTickets((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const handleExhibitChange = (name, value) => {
    if (value >= 0) {
      setExhibits((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTicketPurchase = () => {
    const response = fetchWithBody("/api/tickets", "POST", {
      tickets: tickets,
      exhibits: exhibits,
    });
  };

  const calculateSubtotal = () => {
    let ticketSubtotal = Object.keys(tickets).reduce((total, type) => {
      return total + tickets[type] * ticketPrices[type];
    }, 0);

    let exhibitSubtotal = Object.keys(exhibits).reduce((total, name) => {
      return total + exhibits[name] * exhibitPrices[name];
    }, 0);

    return {
      tickets: ticketSubtotal,
      exhibits: exhibitSubtotal,
      total: ticketSubtotal + exhibitSubtotal,
    };
  };

  const subtotals = calculateSubtotal();

  return (
    <div className="tickets-page">
      <div className="container">
        <div className="tickets-container">
          <div className="ticket-section">
            <h2>General Admission</h2>
            <p className="section-description">
              Purchase tickets for general admission to the museum.
            </p>

            <div className="ticket-options">
              {Object.keys(tickets).map((type) => (
                <div key={type} className="ticket-option">
                  <div className="ticket-info">
                    <h3 className="ticket-type">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <p className="ticket-price">${ticketPrices[type]}.00</p>
                  </div>
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleTicketChange(type, tickets[type] - 1)
                      }
                      disabled={tickets[type] === 0}
                    >
                      -
                    </button>
                    <span className="quantity">{tickets[type]}</span>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleTicketChange(type, tickets[type] + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ticket-section">
            <h2>Special Exhibits</h2>
            <p className="section-description">
              Enhance your visit with our special exhibits.
            </p>

            <div className="ticket-options">
              {Object.keys(exhibits).map((name) => (
                <div key={name} className="ticket-option">
                  <div className="ticket-info">
                    <h3 className="ticket-type">{name}</h3>
                    <p className="ticket-price">${exhibitPrices[name]}.00</p>
                  </div>
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleExhibitChange(name, exhibits[name] - 1)
                      }
                      disabled={exhibits[name] === 0}
                    >
                      -
                    </button>
                    <span className="quantity">{exhibits[name]}</span>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleExhibitChange(name, exhibits[name] + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-line">
              <span>General Admission Subtotal:</span>
              <span>${subtotals.tickets}.00</span>
            </div>
            <div className="summary-line">
              <span>Special Exhibits Subtotal:</span>
              <span>${subtotals.exhibits}.00</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${subtotals.total}.00</span>
            </div>
            <button
              disabled={totalQuantitySelected() <= 0}
              onClick={() => handleTicketPurchase()}
              className="button checkout-button"
            >
              Purchase Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
