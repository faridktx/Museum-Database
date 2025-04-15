import { useState } from "react";
import { toastProcess, fetchWithBody } from "./utils";
import "./components.css";
import { Link } from "wouter";

const initialAddFormState = {
  itemName: "",
  quantity: "",
  costPerUnit: "",
  totalCost: "",
  supplierName: ""
};

export function AddInventoryItem() {
  const [formData, setFormData] = useState(initialAddFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/inventory/insert/", "POST", formData);
    if (response.success) setFormData(initialAddFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Add Inventory Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="itemName">Item Name</label>
              <input id="itemName" value={formData.itemName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" value={formData.quantity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="costPerUnit">Cost Per Unit</label>
              <input type="number" id="costPerUnit" value={formData.costPerUnit} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="totalCost">Total Cost</label>
              <input type="number" id="totalCost" value={formData.totalCost} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="supplierName">Supplier Name</label>
              <input id="supplierName" value={formData.supplierName} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/inventory"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Add Item</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialModifyFormState = {
  itemID: "",
  itemName: "",
  quantity: "",
  costPerUnit: "",
  totalCost: "",
  supplierName: ""
};

export function ModifyInventoryItem() {
  const [formData, setFormData] = useState(initialModifyFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/inventory/modify/", "PATCH", formData);
    if (response.success) setFormData(initialModifyFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Modify Inventory Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="itemID" className="required">Item ID</label>
              <input type="number" id="itemID" value={formData.itemID} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="itemName">Item Name</label>
              <input id="itemName" value={formData.itemName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" value={formData.quantity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="costPerUnit">Cost Per Unit</label>
              <input type="number" id="costPerUnit" value={formData.costPerUnit} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="totalCost">Total Cost</label>
              <input type="number" id="totalCost" value={formData.totalCost} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="supplierName">Supplier Name</label>
              <input id="supplierName" value={formData.supplierName} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/inventory"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Update Item</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialDeleteFormState = {
  itemID: ""
};

export function DeleteInventoryItem() {
  const [formData, setFormData] = useState(initialDeleteFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/inventory/delete/", "DELETE", formData);
    if (response.success) setFormData(initialDeleteFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Remove Inventory Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="itemID">Item ID</label>
              <input type="number" id="itemID" value={formData.itemID} onChange={handleChange} required />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/inventory"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Remove Item</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}