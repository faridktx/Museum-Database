import { useState } from "react";
import { fetchWithBody, compileErrors } from "./utils";
import "./components.css";
import { Link } from "wouter";
import { Popup } from "../components/popup";
import { useUser } from "@clerk/clerk-react";

const initialAddFormState = {
  exhibitName: "",
  description: "",
  startDate: "",
  endDate: "",
};

export function AddExhibit() {
  const { user } = useUser();
  const [formData, setFormData] = useState(initialAddFormState);
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
    const response = await fetchWithBody("/api/exhibit/insert/", "POST", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialAddFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully added the exhibit!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Error!",
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
          <h2>Add New Exhibit</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="exhibitName">
                  Exhibit Name
                </label>
                <input
                  type="text"
                  id="exhibitName"
                  value={formData.exhibitName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required" htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/exhibit">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Add Exhibit
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

const initialModifyFormState = {
  exhibitID: "",
  exhibitName: "",
  description: "",
  startDate: "",
  endDate: "",
};

export function ModifyExhibit() {
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

    const response = await fetchWithBody("/api/exhibit/modify/", "PATCH", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialModifyFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully modified the exhibit!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Error!",
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
          <h2>Modify Exhibit</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="exhibitID" className="required">
                  Exhibit ID
                </label>
                <input
                  type="number"
                  id="exhibitID"
                  value={formData.exhibitID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="exhibitName">Exhibit Name</label>
                <input
                  type="text"
                  id="exhibitName"
                  value={formData.exhibitName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/exhibit">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Update Exhibit
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
  exhibitID: "",
};

export function DeleteExhibit() {
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

    const response = await fetchWithBody("/api/exhibit/delete/", "DELETE", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialDeleteFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully removed the exhibit!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Error!",
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
          <h2>Remove Exhibit</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="exhibitID">
                Exhibit ID
                </label>
                <input
                  type="number"
                  id="exhibitID"
                  value={formData.exhibitID}
                  onChange={handleChange}
                  placeholder="Enter the ID of the exhibit"
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/exhibit">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Remove Exhibit
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
