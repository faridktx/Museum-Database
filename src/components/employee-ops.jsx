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
import { ROLES } from "./constants.js";
import { Select } from "./common/select";
import { exhibitSetter } from "./common/setters";

export function DeleteEmployee() {
  useEffect(() => toastSuccessDelete("Employee"), []);

  const [formData, setFormData] = useState({
    employeeID: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiModifyFetch(
      "/api/employee/delete/",
      "DELETE",
      formData,
    );

    toastProcessDelete(response, "Employee");
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
          <h2>Remove Existing Employee</h2>
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
              <div className="form-group"></div>
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
                Remove Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ModifyEmployee() {
  useEffect(() => toastSuccessModify("Employee"), []);
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

    toastProcessModify(response, "Employee");
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
              <div className="form-group"></div>
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

              <div className="form-group">
                <label htmlFor="ssn">Social Security Number <i>(XXX-XX-XXXX)</i></label>
                <input
                  type="text"
                  id="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number <i>(XXX-XXX-XXXX)</i></label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label htmlFor="personalEmail">Personal Email</label>
                <input
                  type="email"
                  id="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="workEmail">Work Email</label>
                <input
                  type="email"
                  id="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                />
              </div>
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
                <label htmlFor="hiringDate">Hiring Date</label>
                <input
                  type="date"
                  id="hiringDate"
                  value={formData.hiringDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="firedDate">Fired Date</label>
                <input
                  type="date"
                  id="firedDate"
                  value={formData.firedDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <Select
                id="role"
                field="Role"
                formElem={formData.role}
                isRequired={false}
                handler={handleChange}
                isFromDB={false}
                options={ROLES}
              />
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
                Modify Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AddEmployee() {
  useEffect(() => exhibitSetter(setExhibits), []);
  useEffect(() => toastSuccessInsert("Employee"));

  const [exhibitOptions, setExhibits] = useState([]);
  const [formData, setFormData] = useState({
    employeeName: "",
    exhibitID: "",
    ssn: "",
    phoneNumber: "",
    address: "",
    personalEmail: "",
    workEmail: "",
    birthDate: "",
    hiringDate: "",
    salary: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiFetch("/api/employee/insert/", "POST", formData);
    toastProcessInsert(response, "Employee");
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
          <h2>Add New Employee</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="employeeName">
                  Employee Name
                </label>
                <input
                  type="text"
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter the name of the employee"
                  required
                />
              </div>
              <div className="form-group"></div>
            </div>

            <div className="input-group">
              <Select
                id="exhibitID"
                field="Exhibit Name"
                formElem={formData.exhibitID}
                isRequired={true}
                handler={handleChange}
                isFromDB={true}
                options={exhibitOptions}
              />

              <div className="form-group">
                <label className="required" htmlFor="ssn">
                  Social Security Number <i>(XXX-XX-XXXX)</i>
                </label>
                <input
                  type="text"
                  id="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="phoneNumber">
                Phone Number <i>(XXX-XXX-XXXX)</i>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="required" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="personalEmail">
                  Personal Email
                </label>
                <input
                  type="email"
                  id="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="required" htmlFor="workEmail">
                  Work Email
                </label>
                <input
                  type="email"
                  id="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  required
                />
              </div>
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
                <label className="required" htmlFor="hiringDate">
                  Hiring Date
                </label>
                <input
                  type="date"
                  id="hiringDate"
                  value={formData.hiringDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="form-group">
                <label className="required" htmlFor="salary">
                  Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <Select
                id="role"
                field="Role"
                formElem={formData.role}
                isRequired={true}
                handler={handleChange}
                isFromDB={false}
                options={ROLES}
              />
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
                Add Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
