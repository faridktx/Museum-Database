import { useState } from "react";
import { toastProcess, fetchWithBody } from "./utils";
import "./components.css";
import { Link } from "wouter";

const initialAddFormState = {
  itemID: "",
  employeeID: "",
  saleDate: "",
  totalCost: "",
  customerCost: "",
  quantity: ""
};

export function AddSale() {
  const [formData, setFormData] = useState(initialAddFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/sales/insert/", "POST", formData);
    if (response.success) setFormData(initialAddFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Add Sale</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="itemID">Item ID</label>
              <input type="number" id="itemID" value={formData.itemID} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="employeeID">Employee ID</label>
              <input type="number" id="employeeID" value={formData.employeeID} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="saleDate">Sale Date</label>
              <input type="date" id="saleDate" value={formData.saleDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="totalCost">Total Cost</label>
              <input type="number" id="totalCost" value={formData.totalCost} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="customerCost">Customer Cost</label>
              <input type="number" id="customerCost" value={formData.customerCost} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" value={formData.quantity} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/sales"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Add Sale</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialModifyFormState = {
  saleID: "",
  itemID: "",
  employeeID: "",
  saleDate: "",
  totalCost: "",
  customerCost: "",
  quantity: ""
};

export function ModifySale() {
  const [formData, setFormData] = useState(initialModifyFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/sales/modify/", "PATCH", formData);
    if (response.success) setFormData(initialModifyFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Modify Sale</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="saleID" className="required">Sale ID</label>
              <input type="number" id="saleID" value={formData.saleID} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="itemID">Item ID</label>
              <input type="number" id="itemID" value={formData.itemID} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="employeeID">Employee ID</label>
              <input type="number" id="employeeID" value={formData.employeeID} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="saleDate">Sale Date</label>
              <input type="date" id="saleDate" value={formData.saleDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="totalCost">Total Cost</label>
              <input type="number" id="totalCost" value={formData.totalCost} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="customerCost">Customer Cost</label>
              <input type="number" id="customerCost" value={formData.customerCost} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" value={formData.quantity} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/sales"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Update Sale</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialDeleteFormState = {
  saleID: ""
};

export function DeleteSale() {
  const [formData, setFormData] = useState(initialDeleteFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/sales/delete/", "DELETE", formData);
    if (response.success) setFormData(initialDeleteFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Remove Sale</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="saleID">Sale ID</label>
              <input type="number" id="saleID" value={formData.saleID} onChange={handleChange} required />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/sales"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Remove Sale</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}