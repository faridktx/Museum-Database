import { useState } from "react";
import { fetchWithBody, compileErrors } from "./utils";
import "./components.css";
import { Link } from "wouter";
import { Popup } from "../components/popup";
import { useUser } from "@clerk/clerk-react";

const initialModifyFormState = {
  guestID: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  paidDate: "",
  membershipType: "",
};

export function ModifyGuest() {
  const { user } = useUser();
  const [formData, setFormData] = useState(initialModifyFormState);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState({
    title: "",
    message: "",
    buttonText: "Ok",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithBody("/api/guest/modify/", "PATCH", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialModifyFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully modified the guest!",
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

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Modify Guest</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="guestID" className="required">
                  Guest ID
                </label>
                <input
                  type="text"
                  id="guestID"
                  value={formData.guestID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">
                  Phone Number <i>(XXX-XXX-XXXX)</i>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="paidDate">Paid Date</label>
                <input
                  type="date"
                  id="paidDate"
                  value={formData.paidDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="membershipTier">Membership Tier</label>
                <input
                  type="text"
                  id="membershipTier"
                  value={formData.membershipType}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/guest">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Update Guest
              </button>
            </div>
          </form>
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

const initialDeleteFormState = {
  guestID: "",
};

export function DeleteGuest() {
  const { user } = useUser();
  const [formData, setFormData] = useState(initialDeleteFormState);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState({
    title: "",
    message: "",
    buttonText: "Ok",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithBody("/api/guest/delete/", "DELETE", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialDeleteFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully removed the guest!",
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

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Remove Guest</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="guestID">
                  Guest ID
                </label>
                <input
                  type="text"
                  id="guestID"
                  value={formData.guestID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/guest">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Remove Guest
              </button>
            </div>
          </form>
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
