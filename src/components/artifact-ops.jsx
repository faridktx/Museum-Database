import { useEffect, useState } from "react";
import { toastSuccess, toastProcess, apiModifyFetch } from "./utils";
import "./components.css";
import { ACQUISITIONTYPES } from "./constants.js";
import { Select } from "./common/select";
import { artistSetter, exhibitSetter } from "./common/setters";

export function DeleteArtifact() {
  useEffect(() => toastSuccess(), []);

  const [formData, setFormData] = useState({
    artifactID: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiModifyFetch(
      "/api/artifact/delete/",
      "DELETE",
      formData,
    );
    toastProcess(response);
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
            </div>
            <div className="form-actions">
              <button type="button" className="button button-secondary">
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