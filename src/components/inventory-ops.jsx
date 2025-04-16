import { useState } from "react";
import { fetchWithBody } from "./utils";
import "./components.css";
import { Link } from "wouter";
import { Popup } from "../components/popup";
import { useUser } from "@clerk/clerk-react";

const initialAddFormState = {
  itemName: "",
  description: "",
  category: "",
  quantity: "",
  unitPrice: "",
};

export function AddInventory() {
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

    const response = await fetchWithBody("/api/inventory/insert/", "POST", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialAddFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully added the inventory!",
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
          <h2>Add Inventory Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  value={formData.itemName}
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
                <label className="required" htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  requireds
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
                <label className="required" htmlFor="unitPrice">Unit Price</label>
                <input
                  type="number"
                  id="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/inventory">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Add Item
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
  itemID: "",
  itemName: "",
  description: "",
  category: "",
  quantity: "",
  unitPrice: "",
};

export function ModifyInventory() {
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

    const response = await fetchWithBody("/api/inventory/modify/", "PATCH", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialModifyFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully modified the inventory!",
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
          <h2>Modify Inventory Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="itemID" className="required">
                  Item ID
                </label>
                <input
                  type="number"
                  id="itemID"
                  value={formData.itemID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  value={formData.itemName}
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
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
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
                <label htmlFor="unitPrice">Unit Price</label>
                <input
                  type="number"
                  id="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/inventory">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Update Item
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
  itemID: "",
};

export function DeleteInventory() {
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

    const response = await fetchWithBody("/api/inventory/delete/", "DELETE", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialDeleteFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully removed the inventory!",
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
          <h2>Remove Inventory Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="itemID">
                  Item ID
                </label>
                <input
                  type="number"
                  id="itemID"
                  value={formData.itemID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/inventory">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Remove Item
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
