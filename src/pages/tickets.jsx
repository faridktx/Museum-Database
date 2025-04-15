import { useEffect, useState } from "react";
import "../components/components.css";
import { fetchWithBody } from "../components/utils";
import { useUser } from "@clerk/clerk-react";
import { apiFetch, compileErrors } from "../components/utils";
import { Popup } from "../components/popup";

export function Tickets() {
  const { user } = useUser();
  const [ticketPrices, setTicketPrices] = useState({});
  const [exhibitPrices, setExhibitPrices] = useState({});
  const [tickets, setTickets] = useState({});
  const [exhibits, setExhibits] = useState({});

  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState({
    title: "",
    message: "",
    buttonText: "Ok",
  });
  useEffect(() => {
    const loadExhibits = async () => {
      const response = await apiFetch("/api/getexhibitnames/", "GET", user.id);

      const exhibitQuantity = {};
      const exhibitPrices = {};
      response.data.forEach((exhibit) => {
        exhibitQuantity[exhibit.exhibit_name] = 0;
        exhibitPrices[exhibit.exhibit_name] = 15;
      });

      setExhibits(exhibitQuantity);
      setExhibitPrices(exhibitPrices);
    };
    loadExhibits();
  }, []);

  useEffect(() => {
    const loadTickets = async () => {
      const response = await apiFetch("/api/gettickets/", "GET", user.id);

      const ticketQuantity = {};
      const ticketPrices = {};
      response.data
        .sort((a, b) => a.price - b.price)
        .forEach((ticket) => {
          ticketQuantity[ticket.ticket_type] = 0;
          ticketPrices[ticket.ticket_type] = ticket.price;
        });

      setTickets(ticketQuantity);
      setTicketPrices(ticketPrices);
    };
    loadTickets();
  }, []);

  const totalQuantitySelected = () => {
    const ticketsSelected = Object.values(tickets).reduce((total, qty) => {
      return total + qty;
    }, 0);
    const exhibitsSelected = Object.values(exhibits).reduce((total, qty) => {
      return total + qty;
    }, 0);
    return exhibitsSelected + ticketsSelected;
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

  const handleTicketPurchase = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/tickets", "POST", {
      tickets: tickets,
      exhibits: exhibits,
      id: user.id,
    });
    if (response.success) {
      let resetExhibits = {};
      Object.keys(exhibits).forEach((exhibit) => {
        resetExhibits[exhibit] = 0;
      });

      let resetTickets = {};
      Object.keys(tickets).forEach((ticket) => {
        resetTickets[ticket] = 0;
      });

      setTickets(resetTickets);
      setExhibits(resetExhibits);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setCurrentPopup({
        title: "Success!",
        message: "You have successfully purchased your tickets!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Error!",
        message: compileErrors(response.errors),
        buttonText: "Ok",
      });
    }
    setShowPopup(true);
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
              onClick={(e) => handleTicketPurchase(e)}
              className="button checkout-button"
            >
              Purchase Tickets
            </button>
          </div>
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
