import { useEffect, useState } from "react";
import { toastSuccess, toastProcess, apiModifyFetch } from "./utils";
import "./components.css";
import { Select } from "./common/select";
import { ROLES } from "shared/constants.js";
import { exhibitSetter } from "./common/setters";

export function ModifyEmployee() {
  useEffect(() => toastSuccess(), []);
  useEffect(() => exhibitSetter(setExhibits), []);
  const [exhibitOptions, setExhibits] = useState([]);
  const [formData, setFormData] = useState({
    employeeID: "",
    exhibitID: "",
    employeeName: "",
    ssn: "",
    phoneNumber: "",
    address: "",
    personalEmail: "",
    workEmail: "",
    birthDate: "",
    hiringDate: "",
    firedDate: "",
    salary: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiModifyFetch(
      "/api/employee/modify/",
      "PATCH",
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
          <h2>Modify Existing Employee</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="employeeID">
                  Employee ID
                </label>
                <input
                  type="number"
                  id="employeeID"
                  value={formData.employeeID}
                  onChange={handleChange}
                  placeholder="Enter the ID of the employee"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="employeeName">Employee Name</label>
                <input
                  type="text"
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter the name of the employee"
                />
              </div>
              <Select
                id="exhibitID"
                field="Exhibit Name"
                formElem={formData.exhibitID}
                isRequired={false}
                handler={handleChange}
                isFromDB={true}
                options={exhibitOptions}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="button button-secondary">
                Cancel
              </button>
              <button type="submit" className="button">
                Modify Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}