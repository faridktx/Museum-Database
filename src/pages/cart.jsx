import { useEffect, useState } from "react";
import "../pages/sheets/Style.cart.css";
import { useUser } from "@clerk/clerk-react";
import { fetchWithBody, capitalize } from "../components/utils";
import { Popup } from "../components/popup";

export function Cart() {
  const { user } = useUser();
  const [tickets, setTickets] = useState({});
  const [exhibits, setExhibits] = useState({});
  const [membership, setMembership] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", message: "", buttonText: "Ok" });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart_data"));
    if (data) {
      setTickets(data.tickets || {});
      setExhibits(data.exhibits || {});
      setMembership(data.membership || null);
    }
  }, []);

  useEffect(() => {
    async function loadMembershipDetails() {
      if (membership) {
        try {
          const res = await fetch("/api/getmemberships/", {
            method: "GET",
            headers: { "x-user-id": user.id },
          });
          const text = await res.text();
          if (!text) return;
          const json = JSON.parse(text);
          const match = json.data.find((m) => m.membership_type === membership);
          setMembershipData(match);
        } catch (error) {
          console.error("Failed to fetch membership data:", error);
        }
      }
    }
    loadMembershipDetails();
  }, [membership, user.id]);

  useEffect(() => {
    const form = document.querySelector(".checkout-form");
    const handler = () => setFormValid(form?.checkValidity() || false);
    form?.addEventListener("input", handler);
    handler();
    return () => form?.removeEventListener("input", handler);
  }, []);

  const calculateSubtotal = () => {
    let subtotal = 0;
    for (const key in tickets) subtotal += tickets[key].count * tickets[key].price;
    for (const key in exhibits) subtotal += exhibits[key].count * exhibits[key].price;
    if (membershipData) subtotal += membershipData.price;
    return subtotal;
  };

  const getTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.0825;
    const serviceFee = subtotal > 0 ? 2.0 : 0;
    const processingFee = subtotal > 0 ? 0.75 : 0;
    const total = subtotal + tax + serviceFee + processingFee;
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      processingFee: processingFee.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/tickets", "POST", {
      tickets,
      exhibits,
      membership,
      id: user.id,
    });
    if (response.success) {
      setPopupContent({ title: "Success", message: "Your purchase is complete!", buttonText: "Great" });
      localStorage.removeItem("cart_data");
    } else {
      setPopupContent({ title: "Error", message: "Something went wrong.", buttonText: "Try Again" });
    }
    setShowPopup(true);
  };

  const totals = getTotal();

  return (
    <>
      <div className="page-layout">
        {/* LEFT: Order Summary */}
        <div className="order-summary-box">
          <h3>Order Summary</h3>
          {Object.entries(tickets).map(([type, item]) => (
            <div key={type} className="order-line">
              <span>{capitalize(type)}</span>
              <span>{item.count} × ${item.price.toFixed(2)}</span>
            </div>
          ))}
          {Object.entries(exhibits).map(([name, item]) => (
            <div key={name} className="order-line">
              <span>{name}</span>
              <span>{item.count} × ${item.price.toFixed(2)}</span>
            </div>
          ))}
          {membershipData && (
            <div className="order-line">
              <span>{capitalize(membershipData.membership_type)} Membership</span>
              <span>${membershipData.price.toFixed(2)} / {membershipData.period}</span>
            </div>
          )}

          {parseFloat(totals.subtotal) > 0 && (
            <>
              <div className="order-line">
                <strong>Subtotal</strong>
                <strong>${totals.subtotal}</strong>
              </div>
              <div className="order-line">
                <span>Sales Tax (8.25%)</span>
                <span>${totals.tax}</span>
              </div>
              <div className="order-line">
                <span>Service Fee</span>
                <span>${totals.serviceFee}</span>
              </div>
              <div className="order-line">
                <span>Processing Fee</span>
                <span>${totals.processingFee}</span>
              </div>
              <div className="order-line">
                <strong>Total</strong>
                <strong>${totals.total}</strong>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Checkout Form */}
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h3>Checkout</h3>

          <fieldset>
            <legend>Personal Information</legend>
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" autoComplete="name" required />
            <small>e.g. Jane Doe</small>

            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
            <small>e.g. jane@example.com</small>

            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" />
            <small>Optional</small>
          </fieldset>

          <fieldset>
            <legend>Billing & Shipping Address</legend>
            <label htmlFor="address1">Address Line 1</label>
            <input id="address1" name="address1" type="text" autoComplete="address-line1" required />
            <small>e.g. 123 Museum Lane</small>

            <label htmlFor="address2">Address Line 2</label>
            <input id="address2" name="address2" type="text" autoComplete="address-line2" />
            <small>Optional</small>

            <label htmlFor="city">City</label>
            <input id="city" name="city" type="text" autoComplete="address-level2" required />
            <small>e.g. New York</small>

            <label htmlFor="state">State/Province</label>
            <input id="state" name="state" type="text" autoComplete="address-level1" required />
            <small>e.g. NY</small>

            <label htmlFor="zip">Postal Code</label>
            <input id="zip" name="zip" type="text" autoComplete="postal-code" required />
            <small>e.g. 10001</small>

            <label htmlFor="country">Country</label>
            <input id="country" name="country" type="text" autoComplete="country" required />
            <small>e.g. United States</small>
          </fieldset>

          <fieldset>
            <legend>Payment Information</legend>
            <label htmlFor="cardName">Cardholder Name</label>
            <input id="cardName" name="cardName" type="text" autoComplete="cc-name" required />
            <small>Name on card</small>

            <label htmlFor="cardNumber">Card Number</label>
            <input id="cardNumber" name="cardNumber" type="text" inputMode="numeric" autoComplete="cc-number" pattern="\d{13,19}" required />
            <small>e.g. 4242 4242 4242 4242</small>

            <div className="card-row">
              <div>
                <label htmlFor="exp">Expiration (MM/YY)</label>
                <input id="exp" name="exp" type="text" inputMode="numeric" autoComplete="cc-exp" pattern="\d{2}/\d{2}" required />
                <small>e.g. 08/26</small>
              </div>
              <div>
                <label htmlFor="cvv">CVV</label>
                <input id="cvv" name="cvv" type="text" inputMode="numeric" autoComplete="cc-csc" pattern="\d{3,4}" required />
                <small>3 or 4 digit code</small>
              </div>
            </div>
          </fieldset>

          <section className="terms-check">
            <label>
              <input type="checkbox" required /> I agree to the terms and conditions.
            </label>
          </section>

          <button className="checkout-button" type="submit" disabled={!formValid}>
            Place Order
          </button>
        </form>
      </div>

      <Popup
        show={showPopup}
        title={popupContent.title}
        message={popupContent.message}
        buttonText={popupContent.buttonText}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
}