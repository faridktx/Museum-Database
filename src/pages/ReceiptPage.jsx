import { useEffect, useState } from "react";
import "../pages/sheets/Style.cart.css";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { capitalize } from "../components/utils.custom";

export function ReceiptPage() {
  const { user } = useUser();
  const [location, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    tickets: [],
    exhibits: [],
    giftshop: [],
    membership: null,
    purchaseDate: new Date().toISOString()
  });

  useEffect(() => {
    const query = new URLSearchParams(location.split('?')[1]);
    const saleIds = query.get('ids')?.split(',') || [];
    
    if (!saleIds.length) {
      setError("No order information found");
      setLoading(false);
      return;
    }

    async function fetchOrderDetails() {
      try {
        // Group sale IDs by type
        const groupedIds = {
          tickets: saleIds.filter(id => id.startsWith('T-')).map(id => id.substring(2)),
          exhibits: saleIds.filter(id => id.startsWith('E-')).map(id => id.substring(2)),
          giftshop: saleIds.filter(id => id.startsWith('G-')).map(id => id.substring(2)),
          membership: saleIds.find(id => id.startsWith('M-'))?.substring(2)
        };

        // Fetch all data in parallel
        const [ticketsRes, exhibitsRes, giftshopRes, membershipRes] = await Promise.all([
          groupedIds.tickets.length ? fetch(`/api/receipt-tickets?ids=${groupedIds.tickets.join(',')}`) : Promise.resolve({ json: () => ({ success: true, tickets: [] }) }),
          groupedIds.exhibits.length ? fetch(`/api/receipt-exhibit-tickets?ids=${groupedIds.exhibits.join(',')}`) : Promise.resolve({ json: () => ({ success: true, exhibits: [] }) }),
          groupedIds.giftshop.length ? fetch(`/api/receipt-gift-shop-sales?ids=${groupedIds.giftshop.join(',')}`) : Promise.resolve({ json: () => ({ success: true, items: [] }) }),
          groupedIds.membership ? fetch(`/api/receipt-membership-sales?id=${groupedIds.membership}`) : Promise.resolve({ json: () => ({ success: true, membership: null }) })
        ]);

        // Process responses
        const [ticketsData, exhibitsData, giftshopData, membershipData] = await Promise.all([
          ticketsRes.json(),
          exhibitsRes.json(),
          giftshopRes.json(),
          membershipRes.json()
        ]);

        if (!ticketsData.success || !exhibitsData.success || !giftshopData.success || !membershipData.success) {
          throw new Error("Failed to load some order details");
        }

        // Get exhibit names for exhibit tickets
        const exhibitNames = {};
        if (exhibitsData.exhibits.length) {
          const exhibitIds = exhibitsData.exhibits.map(e => e.exhibit_id);
          const namesRes = await fetch(`/api/receipt-exhibits?ids=${exhibitIds.join(',')}`);
          const namesData = await namesRes.json();
          if (namesData.success) {
            namesData.exhibits.forEach(exhibit => {
              exhibitNames[exhibit.exhibit_id] = exhibit.exhibit_name;
            });
          }
        }

        // Get gift shop item names
        const giftItemNames = {};
        if (giftshopData.items.length) {
          const itemIds = giftshopData.items.map(i => i.item_id);
          const namesRes = await fetch(`/api/receipt-gift-shop-items?ids=${itemIds.join(',')}`);
          const namesData = await namesRes.json();
          if (namesData.success) {
            namesData.items.forEach(item => {
              giftItemNames[item.item_id] = item.item_name;
            });
          }
        }

        // Transform data for display
        setOrderDetails({
          tickets: ticketsData.tickets.map(t => ({
            id: t.ticket_id,
            type: 'ticket',
            name: t.ticket_type,
            price: t.price || 0, // You may need to fetch prices separately
            quantity: t.quantity,
            date: t.purchase_date
          })),
          exhibits: exhibitsData.exhibits.map(e => ({
            id: e.ticket_id,
            type: 'exhibit',
            name: exhibitNames[e.exhibit_id] || `Exhibit #${e.exhibit_id}`,
            price: e.price || 0, // You may need to fetch prices separately
            quantity: e.quantity,
            date: e.purchase_date
          })),
          giftshop: giftshopData.items.map(g => ({
            id: g.sale_id,
            type: 'gift',
            name: giftItemNames[g.item_id] || `Item #${g.item_id}`,
            price: g.total_cost / g.quantity,
            quantity: g.quantity,
            date: g.sale_date
          })),
          membership: membershipData.membership ? {
            id: membershipData.membership.sale_id,
            type: 'membership',
            name: membershipData.membership.membership_type,
            price: membershipData.membership.price,
            quantity: 1,
            date: membershipData.membership.purchase_date
          } : null,
          purchaseDate: ticketsData.tickets[0]?.purchase_date || 
                       exhibitsData.exhibits[0]?.purchase_date || 
                       giftshopData.items[0]?.sale_date || 
                       membershipData.membership?.purchase_date ||
                       new Date().toISOString()
        });

      } catch (err) {
        console.error("Failed to load receipt:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [location]);

  // Combine all items for display
  const allItems = [
    ...orderDetails.tickets,
    ...orderDetails.exhibits,
    ...orderDetails.giftshop,
    ...(orderDetails.membership ? [orderDetails.membership] : [])
  ];

  // Calculate totals
  const subtotal = allItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="page-layout">
        <div className="receipt-container">
          <h2>Loading your receipt...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout">
        <div className="receipt-container error">
          <h2>Error loading receipt</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className="page-layout">
        <div className="receipt-container">
          <h2>No order information available</h2>
          <p>We couldn't find details for this purchase.</p>
          <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <div className="receipt-container">
        <header className="receipt-header">
          <h2>Thank you for your purchase!</h2>
          <p>Your order is confirmed.</p>
          <p>Order Date: {new Date(orderDetails.purchaseDate).toLocaleDateString()}</p>
        </header>

        <div className="receipt-details">
          <section className="receipt-section">
            <h3>Order Summary</h3>
            <div className="receipt-items">
              {allItems.map((item, index) => (
                <div key={`${item.type}-${item.id}`} className="receipt-item">
                  <div className="item-name">
                    {item.type === 'ticket' && `${capitalize(item.name)} Ticket`}
                    {item.type === 'exhibit' && `${item.name} Exhibit`}
                    {item.type === 'gift' && `${item.name}`}
                    {item.type === 'membership' && `${capitalize(item.name)} Membership`}
                  </div>
                  <div className="item-quantity">{item.quantity}</div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="receipt-totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Tax (8.25%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-line grand-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </section>

          {orderDetails.membership && (
            <section className="receipt-section membership-info">
              <h3>Membership Information</h3>
              <p>
                Your {capitalize(orderDetails.membership.name)} membership is now active!
                <br />
                Membership benefits begin immediately and will expire in 1 year.
              </p>
            </section>
          )}

          <section className="receipt-actions">
            <button onClick={() => window.print()} className="print-button">
              Print Receipt
            </button>
            <button onClick={() => navigate('/dashboard')} className="dashboard-button">
              Return to Dashboard
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}