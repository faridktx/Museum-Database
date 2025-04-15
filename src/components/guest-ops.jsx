import { useState } from "react";
import { toastProcess, fetchWithBody } from "./utils";
import "./components.css";
import { Link } from "wouter";

const initialAddFormState = {
  email: "",
  phoneNumber: "",
  billingDate: "",
  membershipTier: "",
  monthsPaid: "",
  memberName: "",
  address: "",
  monthlyPayment: ""
};

export function AddGuest() {
  const [formData, setFormData] = useState(initialAddFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/guest/insert/", "POST", formData);
    if (response.success) setFormData(initialAddFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Add Guest</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="billingDate">Billing Date</label>
              <input type="date" id="billingDate" value={formData.billingDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="membershipTier">Membership Tier</label>
              <input id="membershipTier" value={formData.membershipTier} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="monthsPaid">Months Paid</label>
              <input type="number" id="monthsPaid" value={formData.monthsPaid} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="memberName">Member Name</label>
              <input id="memberName" value={formData.memberName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input id="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="monthlyPayment">Monthly Payment</label>
              <input type="number" id="monthlyPayment" value={formData.monthlyPayment} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/guests"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Add Guest</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialModifyFormState = {
  guestID: "",
  email: "",
  phoneNumber: "",
  billingDate: "",
  membershipTier: "",
  monthsPaid: "",
  memberName: "",
  address: "",
  monthlyPayment: ""
};

export function ModifyGuest() {
  const [formData, setFormData] = useState(initialModifyFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/guest/modify/", "PATCH", formData);
    if (response.success) setFormData(initialModifyFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Modify Guest</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="guestID" className="required">Guest ID</label>
              <input type="number" id="guestID" value={formData.guestID} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="billingDate">Billing Date</label>
              <input type="date" id="billingDate" value={formData.billingDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="membershipTier">Membership Tier</label>
              <input id="membershipTier" value={formData.membershipTier} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="monthsPaid">Months Paid</label>
              <input type="number" id="monthsPaid" value={formData.monthsPaid} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="memberName">Member Name</label>
              <input id="memberName" value={formData.memberName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input id="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="monthlyPayment">Monthly Payment</label>
              <input type="number" id="monthlyPayment" value={formData.monthlyPayment} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/guests"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Update Guest</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialDeleteFormState = {
  guestID: ""
};

export function DeleteGuest() {
  const [formData, setFormData] = useState(initialDeleteFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/guest/delete/", "DELETE", formData);
    if (response.success) setFormData(initialDeleteFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Remove Guest</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="guestID">Guest ID</label>
              <input type="number" id="guestID" value={formData.guestID} onChange={handleChange} required />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/guests"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Remove Guest</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}