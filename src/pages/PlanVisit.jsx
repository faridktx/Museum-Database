import "../components/components.css";
import { FaClock, FaMapMarkerAlt, FaSubway, FaWheelchair, FaTicketAlt } from "react-icons/fa";

export function PlanVisit() {
  return (
    <div className="plan-visit-page container">
      <div className="dashboard-header">
        <h1>Plan Your Visit</h1>
      </div>

      <div className="visit-grid">
        <div className="visit-card">
          <h3><FaClock /> Hours & Location</h3>
          <p>Monday – Friday: 9am – 5pm</p>
          <p>Saturday – Sunday: 9am – 6pm</p>
          <p>Last entry is 1 hour before closing</p>
          <p><FaMapMarkerAlt /> 123 Curio Blvd, Houston, TX 77004</p>
        </div>

        <div className="visit-card">
          <h3><FaTicketAlt /> Admission</h3>
          <li><strong>Child Tickets:</strong> $15.00</li>
    <li><strong>Senior Tickets:</strong> $10.00</li>
    <li><strong>General Tickets:</strong> $30.00</li>
    <li><strong>Children under 3:</strong> Free</li>
    <li><strong>Members:</strong> Free</li>
        </div>

        <div className="visit-card">
          <h3><FaSubway /> Getting Here</h3>
          <p>By Metro: Red Line to Museum District Station</p>
          <p>By Bus: Routes 5, 25, or 56</p>
        </div>

        <div className="visit-card">
          <h3><FaWheelchair /> Accessibility</h3>
          <p>Wheelchair accessible paths throughout the museum</p>
          <p>Complimentary wheelchairs available at the entrance</p>
        </div>
        <div className="promo-section">
  <div className="promo-card promo-fade">
    <div className="promo-icon">🎟️</div>
    <h3>Buy Tickets</h3>
    <p>Plan your next visit and experience our most exciting exhibits.</p>
    <a href="/tickets-memberships" className="button promo-button">Purchase Tickets</a>
  </div>

  
</div>
      </div>
    </div>
    
  );
}