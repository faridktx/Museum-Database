import { useState } from "react";
import "../components/components.css";
import { fetchWithBody } from "../components/utils";

export function Memberships() {
  const [membership, setMembership] = useState(null);

  const membershipOptions = [
    {
      id: "individual",
      title: "Individual",
      price: 75,
      period: "year",
      benefits: [
        "Free admission for one adult",
        "Invitations to members-only events",
        "10% discount at museum shop",
        "Member newsletter subscription",
        "Early access to special exhibitions",
      ],
    },
    {
      id: "dual",
      title: "Dual",
      price: 120,
      period: "year",
      benefits: [
        "Free admission for two adults",
        "Invitations to members-only events",
        "10% discount at museum shop",
        "Member newsletter subscription",
        "Early access to special exhibitions",
        "Free entry to members lounge",
      ],
    },
    {
      id: "family",
      title: "Family",
      price: 160,
      period: "year",
      benefits: [
        "Free admission for two adults and up to 4 children",
        "Invitations to members-only events",
        "15% discount at museum shop",
        "Member newsletter subscription",
        "Early access to special exhibitions",
        "Free entry to members lounge",
        "Free kids activities on family days",
      ],
    },
    {
      id: "benefactor",
      title: "Benefactor",
      price: 500,
      period: "year",
      benefits: [
        "Free admission for two adults and up to 6 guests",
        "VIP invitations to all museum events",
        "20% discount at museum shop",
        "Member newsletter subscription",
        "Private tours with curators",
        "Free entry to members lounge",
        "Exclusive benefactor events",
        "Recognition on benefactor wall",
      ],
    },
  ];

  const handleMembershipPurchase = async () => {
    const response = fetchWithBody("/api/memberships", "POST", {
      membership: membership,
    });
  };

  const handleMembershipSelect = (membershipId) => {
    setMembership(membershipId);
  };

  return (
    <div className="memberships-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Museum Memberships</h1>
        </div>

        <div className="memberships-container">
          <div className="membership-intro">
            <p>
              Become a member of our museum and enjoy exclusive benefits while
              supporting our mission to preserve and share cultural heritage.
              Select a membership type below to get started.
            </p>
          </div>

          <div className="membership-options">
            {membershipOptions.map((option) => (
              <div
                key={option.id}
                className={`membership-card ${membership === option.id ? "selected" : ""}`}
                onClick={() => handleMembershipSelect(option.id)}
              >
                <div className="membership-header">
                  <h3>{option.title}</h3>
                  <div className="membership-price">
                    <span className="price">${option.price}</span>
                    <span className="period">/{option.period}</span>
                  </div>
                </div>
                <div className="membership-benefits">
                  <h4>Benefits:</h4>
                  <ul>
                    {option.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`button ${membership === option.id ? "selected" : ""}`}
                >
                  {membership === option.id ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>

          {membership && (
            <div className="membership-form">
              <h2>Complete Your Membership</h2>
              <p>
                Please provide your information to complete your{" "}
                {membershipOptions.find((o) => o.id === membership)?.title}{" "}
                membership application.
              </p>

              <form>
                <div className="membership-summary">
                  <h3>Membership Summary</h3>
                  <div className="summary-row">
                    <span>Membership Type:</span>
                    <span>
                      {
                        membershipOptions.find((o) => o.id === membership)
                          ?.title
                      }
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Annual Fee:</span>
                    <span>
                      $
                      {
                        membershipOptions.find((o) => o.id === membership)
                          ?.price
                      }
                      .00
                    </span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setMembership(null)}
                  >
                    Choose Different Plan
                  </button>
                  <button
                    onClick={() => handleMembershipPurchase()}
                    type="submit"
                    className="button"
                  >
                    Purchase Membership
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
