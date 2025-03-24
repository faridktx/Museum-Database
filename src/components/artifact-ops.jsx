import { useEffect, useState } from "react";
import {
  toastSuccessDelete,
  toastSuccessInsert,
  toastSuccessModify,
  toastProcessDelete,
  toastProcessModify,
  toastProcessInsert,
  apiModifyFetch,
} from "./utils";
import "./components.css";
import { ExhibitsRequired, ExhibitsOptional } from "./common/exhibits";
import { ACQUISITIONTYPES } from "shared/constants.js";
import { artistSetter, exhibitSetter } from "./common/setters";

export function DeleteArtifact() {
  useEffect(() => toastSuccessDelete("Aritifact"), []);

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
    toastProcessDelete(response, "Artifact");
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
  useEffect(() => toastSuccessModify("Artifact"), []);

  useEffect(() => {
    exhibitSetter(setExhibits);
    artistSetter(setArtists);
  }, []);

  const [artistOptions, setArtists] = useState([]);
  const [exhibitOptions, setExhibits] = useState([]);
  const [formData, setFormData] = useState({
    artifactID: "",
    exhibitID: "",
    artistID: "",
    artifactName: "",
    acquisitionDate: "",
    acquisitionValue: "",
    acquisitionType: "",
    creationDate: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiModifyFetch(
      "/api/artifact/modify/",
      "PATCH",
      formData,
    );

    toastProcessModify(response, "Artifact");
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

              <ExhibitsOptional
                exhibitID={formData.exhibitID}
                changeHandler={handleChange}
                exhibitOptions={exhibitOptions}
              />

              <div className="form-group">
                <label htmlFor="artist">Artist Name (ID)</label>
                <select
                  id="artist"
                  value={formData.artist}
                  onChange={handleChange}
                >
                  <option value="" disabled selected>
                    Select your option
                  </option>
                  {artistOptions.map((artist, index) => (
                    <option id={index} value={artist.id}>
                      {`${artist.name} (${artist.id})`}
                    </option>
                  ))}
                </select>
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
                  <option value="" selected disabled>
                    Select your option
                  </option>
                  {ACQUISITIONTYPES.map((acqType, index) => (
                    <option key={index} value={acqType}>
                      {acqType}
                    </option>
                  ))}
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
  useEffect(() => toastSuccessInsert("Artifact"), []);

  useEffect(() => {
    exhibitSetter(setExhibits);
    artistSetter(setArtists);
  }, []);

  const [artistOptions, setArtists] = useState([]);
  const [exhibitOptions, setExhibits] = useState([]);
  const [formData, setFormData] = useState({
    artifactName: "",
    exhibitID: "",
    artistID: "",
    acquisitionDate: "",
    acquisitionValue: "",
    acquisitionType: "",
    creationDate: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiModifyFetch(
      "/api/artifact/insert/",
      "POST",
      formData,
    );

    toastProcessInsert(response, "Artifact");
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
          <h2 style={{ marginBottom: "0" }}>Add New Artifact</h2>
          <div
            style={{
              fontSize: "12px",
              marginBottom: "calc(var(--spacing) * 1.5)",
            }}
          >
            <i>
              If an artifact created by a new artist needs to be inserted,
              please add the artist first.
            </i>
          </div>
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

              <ExhibitsRequired
                exhibitID={formData.exhibitID}
                changeHandler={handleChange}
                exhibitOptions={exhibitOptions}
              />

              <div className="form-group">
                <label className="required" htmlFor="artistID">
                  Artist Name (ID)
                </label>
                <select
                  id="artistID"
                  value={formData.artistID}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled selected>
                    Select your option
                  </option>
                  {artistOptions.map((artist, index) => (
                    <option id={index} value={artist.id}>
                      {`${artist.name} (${artist.id})`}
                    </option>
                  ))}
                </select>
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
                  <option value="" selected disabled>
                    Select your option
                  </option>
                  {ACQUISITIONTYPES.map((acqType, index) => (
                    <option key={index} value={acqType}>
                      {acqType}
                    </option>
                  ))}
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
