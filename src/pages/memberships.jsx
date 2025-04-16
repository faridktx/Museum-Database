import { useEffect, useState } from "react";
import "../components/components.css";
import { useUser } from "@clerk/clerk-react";
import {
  apiFetch,
  capitalize,
  fetchWithBody,
  compileErrors,
} from "../components/utils";
import { Popup } from "../components/popup";

export function Memberships() {
  const { user } = useUser();
  const [membership, setMembership] = useState(null);
  const [membershipOptions, setMembersshipOption] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState({
    title: "",
    message: "",
    buttonText: "Ok",
  });

  useEffect(() => {
    const loadMemberships = async () => {
      const response = await apiFetch("/api/getmemberships/", "GET", user.id);
      setMembersshipOption(response.data.sort((a, b) => a.price - b.price));
    };
    loadMemberships();
  }, []);

  const handleMembershipPurchase = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/memberships", "POST", {
      membership: membership,
      id: user.id,
    });
    if (response.success) {
      setMembership(null);

      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully purchased your membership!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Errors!",
        message: compileErrors(response.errors),
        buttonText: "Ok",
      });
    }
    setShowPopup(true);
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
            {membershipOptions &&
              membershipOptions.map((option) => (
                <div
                  key={option.membership_type}
                  className={`membership-card ${membership === option.membership_type ? "selected" : ""}`}
                  onClick={() => handleMembershipSelect(option.membership_type)}
                >
                  <div className="membership-header">
                    <h3>{capitalize(option.membership_type)}</h3>
                    <div className="membership-price">
                      <span className="price">${option.price}</span>
                      <span className="period">/{option.period}</span>
                    </div>
                  </div>
                  <div className="membership-benefits">
                    <h4>Benefits:</h4>
                    <ul>
                      {option.benefits.split(";").map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className={`button ${membership === option.membership_type ? "selected" : ""}`}
                  >
                    {membership === option.membership_type
                      ? "Selected"
                      : "Select"}
                  </button>
                </div>
              ))}
          </div>

          {membershipOptions && (
            <div className="membership-form">
              <h2>Complete Your Membership</h2>
              <p>
                Please provide your information to complete your{" "}
                {capitalize(
                  membershipOptions.find(
                    (o) => o.membership_type === membership,
                  )?.membership_type,
                )}{" "}
                membership application.
              </p>

              <form>
                <div className="membership-summary">
                  <h3>Membership Summary</h3>
                  <div className="summary-row">
                    <span>Membership Type:</span>
                    <span>
                      {capitalize(
                        membershipOptions.find(
                          (o) => o.membership_type === membership,
                        )?.membership_type,
                      )}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Annual Fee:</span>
                    <span>
                      $
                      {
                        membershipOptions.find(
                          (o) => o.membership_type === membership,
                        )?.price
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
                    onClick={(e) => handleMembershipPurchase(e)}
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
