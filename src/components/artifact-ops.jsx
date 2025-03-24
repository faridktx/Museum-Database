import { useEffect, useState } from "react";
import {
  showToastSuccessNotification,
  showToastFailNotification,
  apiFetch,
} from "./utils";
import "./components.css";
<<<<<<< Updated upstream
=======
import { ExhibitsRequired, ExhibitsOptional } from "./common/exhibits";
import { ACQUISITIONTYPES } from "./constants.js";
import { artistSetter, exhibitSetter } from "./common/setters";
>>>>>>> Stashed changes

export function DeleteArtifact() {
  useEffect(() => {
    if (localStorage.getItem("modification") === "true") {
      showToastSuccessNotification("Artifact", "removed");
    }
  }, []);

  const [formData, setFormData] = useState({
    artifactID: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiFetch(
      "/api/artifact/delete/",
      "DELETE",
      formData,
    );

    if (response.success) {
      localStorage.setItem("modification", "true");
      location.reload();
    } else {
      showToastFailNotification("Artifact", "removal");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Remove Existing Artifact</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="artifactID">
                  Artifact ID
                </label>
                <input
                  type="number"
                  id="artifactID"
                  value={formData.artifactID}
                  onChange={handleChange}
                  placeholder="Enter the ID of the artifact"
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => (location.href = "/login/artifact")}
              >
                Cancel
              </button>
              <button type="submit" className="button">
                Remove Artifact
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ModifyArtifact() {
  const [formData, setFormData] = useState({
    artifactID: "",
    artifactName: "",
    artist: "",
    acquisitionDate: "",
    acquisitionValue: "",
    acquisitionType: "",
    creationDate: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Modify Existing Artifact</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="artifactID">
                  Artifact ID
                </label>
                <input
                  type="number"
                  id="artifactID"
                  value={formData.artifactID}
                  onChange={handleChange}
                  placeholder="Enter the ID of the artifact"
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label htmlFor="artifactName">Artifact Name</label>
                <input
                  type="text"
                  id="artifactName"
                  value={formData.artifactName}
                  onChange={handleChange}
                  placeholder="Enter the name of the artifact"
                />
              </div>

              <div className="form-group">
                <label htmlFor="artist">Artist Name</label>
                <input
                  type="text"
                  id="artist"
                  value={formData.artist}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label htmlFor="acquisitionDate">Acquisition Date</label>
                <input
                  type="date"
                  id="acquisitionDate"
                  value={formData.acquisitionDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="acquisitionValue">Acquisition Value</label>
                <input
                  type="number"
                  id="acquisitionValue"
                  value={formData.acquisitionValue}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label htmlFor="acquisitionType">Acquisition Type</label>
                <select
                  id="acquisitionType"
                  value={formData.acquisitionType}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select your option
                  </option>
                  <option value="purchase">Purchase</option>
                  <option value="gift">Gift</option>
                  <option value="bequest">Bequest</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="creationDate">Creation Date</label>
                <input
                  type="date"
                  id="creationDate"
                  value={formData.creationDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the artifact"
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button type="submit" className="button">
                Modify Artifact
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AddArtifact() {
  const [formData, setFormData] = useState({
    artifactName: "",
    artist: "",
    acquisitionDate: "",
    acquisitionValue: "",
    acquisitionType: "",
    creationDate: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h2>Add New Artifact</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="artifactName">
                  Artifact Name
                </label>
                <input
                  type="text"
                  id="artifactName"
                  value={formData.artifactName}
                  onChange={handleChange}
                  placeholder="Enter the name of the artifact"
                  required
                />
              </div>

              <div className="form-group">
                <label className="required" htmlFor="artist">
                  Artist Name
                </label>
                <input
                  type="text"
                  id="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="acquisitionDate">
                  Acquisition Date
                </label>
                <input
                  type="date"
                  id="acquisitionDate"
                  value={formData.acquisitionDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="required" htmlFor="acquisitionValue">
                  Acquisition Value
                </label>
                <input
                  type="number"
                  id="acquisitionValue"
                  value={formData.acquisitionValue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="acquisitionType">
                  Acquisition Type
                </label>
                <select
                  id="acquisitionType"
                  value={formData.acquisitionType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select your option
                  </option>
                  <option value="purchase">Purchase</option>
                  <option value="gift">Gift</option>
                  <option value="bequest">Bequest</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="creationDate">Creation Date</label>
                <input
                  type="date"
                  id="creationDate"
                  value={formData.creationDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the artifact"
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button type="submit" className="button">
                Add Artifact
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
