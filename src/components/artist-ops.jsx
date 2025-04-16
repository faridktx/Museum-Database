import { useState } from "react";
import { fetchWithBody, compileErrors } from "./utils";
import "./components.css";
import { NATIONALITIES } from "./constants";
import { Select } from "./common/select";
import { Link } from "wouter";
import { Popup } from "../components/popup";
import { useUser } from "@clerk/clerk-react";

const initialDeleteFormState = {
  artistID: "",
};

export function DeleteArtist() {
  const { user } = useUser();
  const [formData, setFormData] = useState(initialDeleteFormState);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState({
    title: "",
    message: "",
    buttonText: "Ok",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithBody("/api/artist/delete/", "DELETE", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialDeleteFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully removed the artist!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Errors!",
        message: compileErrors(response.errors),
        buttonText: "Ok",
      });
    }
    setShowPopup(true);
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
          <h2>Remove Artist</h2>
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
  artistID: "",
  artistName: "",
  nationality: "",
  birthDate: "",
  deathDate: "",
};

export function ModifyArtist() {
  const { user } = useUser();
  const [formData, setFormData] = useState(initialModifyFormState);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState({
    title: "",
    message: "",
    buttonText: "Ok",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithBody("/api/artist/modify/", "PATCH", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialModifyFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully modified the artist!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Errors!",
        message: compileErrors(response.errors),
        buttonText: "Ok",
      });
    }
    setShowPopup(true);
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
          <h2>Modify Artist</h2>
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

const initialAddFormState = {
  artistName: "",
  nationality: "",
  birthDate: "",
  deathDate: "",
};

export function AddArtist() {
  const { user } = useUser();
  const [formData, setFormData] = useState(initialAddFormState);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState({
    title: "",
    message: "",
    buttonText: "Ok",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithBody("/api/artist/insert/", "POST", {
      ...formData,
      id: user.id,
    });
    if (response.success) {
      setFormData(initialAddFormState);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPopup({
        title: "Success!",
        message: "You have successfully added the artist!",
        buttonText: "Ok",
      });
    } else {
      setCurrentPopup({
        title: "Errors!",
        message: compileErrors(response.errors),
        buttonText: "Ok",
      });
    }
    setShowPopup(true);
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
