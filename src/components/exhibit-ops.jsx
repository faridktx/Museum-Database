import { useState } from "react";
import { toastProcess, fetchWithBody } from "./utils";
import "./components.css";
import { Link } from "wouter";

const initialAddFormState = {
  exhibitName: "",
  description: "",
  exhibitType: "",
  startDate: "",
  endDate: "",
  specialExhibit: ""
};

export function AddExhibit() {
  const [formData, setFormData] = useState(initialAddFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/exhibit/insert/", "POST", formData);
    if (response.success) setFormData(initialAddFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Add New Exhibit</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="required" htmlFor="exhibitName">Exhibit Name</label>
              <input id="exhibitName" value={formData.exhibitName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input id="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="exhibitType">Exhibit Type</label>
              <input id="exhibitType" value={formData.exhibitType} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input type="date" id="startDate" value={formData.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input type="date" id="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="specialExhibit">Special Exhibit (true/false)</label>
              <input id="specialExhibit" value={formData.specialExhibit} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/exhibits"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Add Exhibit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialModifyFormState = {
  exhibitID: "",
  exhibitName: "",
  description: "",
  exhibitType: "",
  startDate: "",
  endDate: "",
  specialExhibit: ""
};

export function ModifyExhibit() {
  const [formData, setFormData] = useState(initialModifyFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/exhibit/modify/", "PATCH", formData);
    if (response.success) setFormData(initialModifyFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Modify Exhibit</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exhibitID" className="required">Exhibit ID</label>
              <input type="number" id="exhibitID" value={formData.exhibitID} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="exhibitName">Exhibit Name</label>
              <input id="exhibitName" value={formData.exhibitName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input id="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="exhibitType">Exhibit Type</label>
              <input id="exhibitType" value={formData.exhibitType} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input type="date" id="startDate" value={formData.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input type="date" id="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="specialExhibit">Special Exhibit</label>
              <input id="specialExhibit" value={formData.specialExhibit} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/exhibits"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Update Exhibit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialDeleteFormState = {
  exhibitID: ""
};

export function DeleteExhibit() {
  const [formData, setFormData] = useState(initialDeleteFormState);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWithBody("/api/exhibit/delete/", "DELETE", formData);
    if (response.success) setFormData(initialDeleteFormState);
    toastProcess(response);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Remove Exhibit</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exhibitID">Exhibit ID</label>
              <input type="number" id="exhibitID" value={formData.exhibitID} onChange={handleChange} required />
            </div>
            <div className="form-actions">
              <Link href="/dashboard/exhibits"><button type="button" className="button button-secondary">Cancel</button></Link>
              <button type="submit" className="button">Remove Exhibit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}