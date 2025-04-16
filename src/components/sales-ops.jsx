import { useState } from "react";
import { fetchWithBody } from "./utils";
import "./components.css";
import { Link } from "wouter";
import { Popup } from "../components/popup";
import { useUser } from "@clerk/clerk-react";

const initialAddFormState = {
  itemID: "",
  guestID: "",
  saleDate: "",
  quantity: "",
  totalCost: "",
};

export function AddSale() {
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

    const response = await fetchWithBody("/api/sales/insert/", "POST", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialAddFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully added the sale!",
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
          <h2>Add Sale</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="itemID">Item ID</label>
                <input
                  type="number"
                  id="itemID"
                  value={formData.itemID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required" htmlFor="guestID">Guest ID</label>
                <input
                  type="number"
                  id="guestID"
                  value={formData.guestID}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="saleDate">Sale Date</label>
                <input
                  type="date"
                  id="saleDate"
                  value={formData.saleDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required" htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="totalCost">Total Cost</label>
                <input
                  type="number"
                  id="totalCost"
                  value={formData.totalCost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/sales">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Add Sale
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
  saleID: "",
  itemID: "",
  guestID: "",
  saleDate: "",
  quantity: "",
  totalCost: "",
};

export function ModifySale() {
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

    const response = await fetchWithBody("/api/sales/modify/", "PATCH", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialModifyFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully modified the sale!",
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
          <h2>Modify Sale</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="saleID" className="required">
                  Sale ID
                </label>
                <input
                  type="number"
                  id="saleID"
                  value={formData.saleID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="itemID">Item ID</label>
                <input
                  type="number"
                  id="itemID"
                  value={formData.itemID}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="guestID">Guest ID</label>
                <input
                  type="number"
                  id="guestID"
                  value={formData.guestID}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="saleDate">Sale Date</label>
                <input
                  type="date"
                  id="saleDate"
                  value={formData.saleDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="totalCost">Total Cost</label>
                <input
                  type="number"
                  id="totalCost"
                  value={formData.totalCost}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/sales">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Update Sale
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
  saleID: "",
};

export function DeleteSale() {
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

    const response = await fetchWithBody("/api/sales/delete/", "DELETE", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialDeleteFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully removed the sale!",
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
          <h2>Remove Sale</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="artifactID">
                  Sale ID
                </label>
                <input
                  type="number"
                  id="saleID"
                  value={formData.saleID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/sales">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Remove Sale
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
