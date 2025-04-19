import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { QRCodeCanvas } from "qrcode.react";
import "../pages/sheets/Style.ReceiptPage.css";

export function ReceiptPage() {
  const [ticketSales, setTicketSales] = useState([]);
  const [giftSales, setGiftSales] = useState([]);
  const [guestId, setGuestId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [location] = useLocation();
  const query = new URLSearchParams(location.split("?")[1]);
  const ids = query.get("ids");

  useEffect(() => {
    async function fetchData() {
      if (!ids) return;

      try {
        const res = await fetch(`/api/custom/receipt-details?saleIds=${ids}`);
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!data.success) throw new Error("Failed to load receipt data");

        setTicketSales(data.tickets || []);
        setGiftSales(data.giftshop || []);
        setGuestId(data.guest_id || "N/A");
        setPurchaseDate(data.date || "N/A");
        setLoading(false);
      } catch (err) {
        console.error("Error loading receipt:", err);
        alert("Failed to load receipt.");
      }
    }

    fetchData();
  }, [ids]);

  const total = [...ticketSales, ...giftSales].reduce(
    (sum, item) => sum + parseFloat(item.unit_price || 0) * parseInt(item.quantity || 0),
    0
  );

  return (
    <div className="receipt-page">
      <h1>Purchase Receipt</h1>

      {loading ? (
        <p>Loading receipt...</p>
      ) : (
        <>
          <p><strong>Guest ID:</strong> {guestId}</p>
          <p><strong>Date:</strong> {purchaseDate}</p>

          {ticketSales.length > 0 && (
            <div className="receipt-section">
              <h2>Tickets & Memberships</h2>
              {ticketSales.map((t, i) => (
                <div key={i} className="receipt-line">
                  <span>{t.ticket_type}</span>
                  <span>{t.quantity} × ${parseFloat(t.unit_price).toFixed(2)}</span>
                </div>
              ))}
              <div className="qr-container">
                <QRCode value={`https://museum.com/verify?id=${guestId}`} size={100} />
                <p>Scan to verify</p>
              </div>
            </div>
          )}

          {giftSales.length > 0 && (
            <div className="receipt-section">
              <h2>Gift Shop Purchases</h2>
              {giftSales.map((g, i) => (
                <div key={i} className="receipt-line">
                  <span>{g.item_name}</span>
                  <span>{g.quantity} × ${parseFloat(g.unit_price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="receipt-total">
            <strong>Total Paid:</strong> <span>${total.toFixed(2)}</span>
          </div>

          <button className="print-button" onClick={() => window.print()}>
            Print Receipt
          </button>
        </>
      )}
    </div>
  );
}
