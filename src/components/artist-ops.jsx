import { useState } from "react";
import { toastProcess, fetchWithBody } from "./utils";
import "./components.css";
import { NATIONALITIES } from "./constants";
import { Select } from "./common/select";
import { Link } from "wouter";

const initialDeleteFormState = {
  artistID: "",
};

export function DeleteArtist() {
  const [formData, setFormData] = useState(initialDeleteFormState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithBody(
      "/api/artist/delete/",
      "DELETE",
      formData,
    );
    if (response.success) setFormData(initialDeleteFormState);
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
          <h2>Remove Existing Artist</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="artistID">
                  Artist ID
                </label>
                <input
                  type="number"
                  id="artistID"
                  value={formData.artistID}
                  onChange={handleChange}
                  placeholder="Enter the ID of the artist"
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>

            <div className="form-actions">
              <Link href="/dashboard/artist">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Remove Artist
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialModifyFormState = {
  artistID: "",
  artistName: "",
  nationality: "",
  birthDate: "",
  deathDate: "",
};

export function ModifyArtist() {
  const [formData, setFormData] = useState(initialModifyFormState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithBody(
      "/api/artist/modify/",
      "PATCH",
      formData,
    );
    if (response.success) setFormData(initialModifyFormState);
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
          <h2>Modify Existing Artist</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="artistID">
                  Artist ID
                </label>
                <input
                  type="number"
                  id="artistID"
                  value={formData.artistID}
                  onChange={handleChange}
                  placeholder="Enter the ID of the artist"
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label htmlFor="artistName">Artist Name</label>
                <input
                  type="text"
                  id="artistName"
                  value={formData.artistName}
                  onChange={handleChange}
                  placeholder="Enter the name of the artist"
                />
              </div>

              <Select
                id="nationality"
                field="Nationality"
                formElem={formData.nationality}
                isRequired={false}
                handler={handleChange}
                isFromDB={false}
                options={NATIONALITIES}
              />
            </div>

            <div className="input-group">
              <div className="form-group">
                <label htmlFor="birthDate">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="deathDate">Death Date</label>
                <input
                  type="date"
                  id="deathDate"
                  value={formData.deathDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/artist">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Modify Artist
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialAddFormState = {
  artistName: "",
  nationality: "",
  birthDate: "",
  deathDate: "",
};

export function AddArtist() {
  const [formData, setFormData] = useState(initialAddFormState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithBody(
      "/api/artist/insert/",
      "POST",
      formData,
    );
    if (response.success) setFormData(initialAddFormState);
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
          <h2>Add New Artist</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="artistName">
                  Artist Name
                </label>
                <input
                  type="text"
                  id="artistName"
                  value={formData.artistName}
                  onChange={handleChange}
                  placeholder="Enter the name of the artist"
                  required
                />
              </div>

              <Select
                id="nationality"
                field="Nationality"
                formElem={formData.nationality}
                isRequired={true}
                handler={handleChange}
                isFromDB={false}
                options={NATIONALITIES}
              />
            </div>

            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="birthDate">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="deathDate">Death Date</label>
                <input
                  type="date"
                  id="deathDate"
                  value={formData.deathDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <Link href="/dashboard/artist">
                <button type="button" className="button button-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="button">
                Add Artist
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
