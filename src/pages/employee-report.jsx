import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "../components/utils";
import { ArrowLeft, Download } from "lucide-react";
import "../components/components.css";

export function EmployeeReport() {
  const { user } = useUser();
  const [, navigate] = useLocation();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [nameSearch, setNameSearch] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [hiringDateStart, setHiringDateStart] = useState('');
  const [hiringDateEnd, setHiringDateEnd] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, exRes] = await Promise.all([
          apiFetch("/api/employees", "GET", user.id),
          apiFetch("/api/exhibits", "GET", user.id)
        ]);
        
        const empData = empRes.data;
        const exData = exRes.data;
        
        // Extract unique roles and exhibits
        const uniqueRoles = [...new Set(empData.map(emp => emp.role))].filter(Boolean);
        
        setEmployees(empData);
        setFilteredEmployees(empData);
        setRoles(['All', ...uniqueRoles]);
        setExhibits(['All', ...exData.map(ex => ex.exhibit_name)]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  useEffect(() => {
    applyFilters();
  }, [employees, nameSearch, idSearch, selectedRole, selectedDepartment, hiringDateStart, hiringDateEnd]);

  const applyFilters = () => {
    let filtered = [...employees];

    // Name filter
    if (nameSearch) {
      filtered = filtered.filter(emp => 
        emp.employee_name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    // ID filter
    if (idSearch) {
      filtered = filtered.filter(emp => 
        emp.employee_id.toString().includes(idSearch)
      );
    }

    // Role filter
    if (selectedRole && selectedRole !== 'All') {
      filtered = filtered.filter(emp => 
        emp.role === selectedRole
      );
    }

    // Department filter
    if (selectedDepartment && selectedDepartment !== 'All') {
      filtered = filtered.filter(emp => 
        emp.department === selectedDepartment
      );
    }

    // Date range filter
    if (hiringDateStart) {
      filtered = filtered.filter(emp => 
        new Date(emp.hiring_date) >= new Date(hiringDateStart)
      );
    }

    if (hiringDateEnd) {
      filtered = filtered.filter(emp => 
        new Date(emp.hiring_date) <= new Date(hiringDateEnd)
      );
    }

    setFilteredEmployees(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const handleClearFilters = () => {
    setNameSearch('');
    setIdSearch('');
    setSelectedRole('All');
    setSelectedDepartment('All');
    setHiringDateStart('');
    setHiringDateEnd('');
  };

  const exportToCsv = () => {
    const headers = [
      "ID",
      "Name",
      "Role",
      "Department",
      "Phone",
      "Work Email",
      "Hire Date",
      "Salary"
    ];
    
    const rows = filteredEmployees.map(emp => [
      emp.employee_id,
      emp.employee_name,
      emp.role,
      emp.department,
      emp.phone_number,
      emp.work_email,
      emp.hiring_date,
      emp.salary
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employee_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading">Loading employee data...</div>;

  return (
    <div className="reports-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Employee Directory</h1>
        </div>

        <div className="report-controls-simplified">
          <div className="report-header-actions">
            <button
              className="button button-outline export-button"
              onClick={exportToCsv}
            >
              <Download size={16} />
              Export to CSV
            </button>
          </div>

          <div className="report-results">
            <div className="filters-container-horizontal">
              <div className="filter-row">
                {/* Name Search */}
                <div className="filter-item">
                  <input
                    id="name-search"
                    type="text"
                    placeholder="Name"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="rounded-input"
                  />
                </div>

                {/* ID Search */}
                <div className="filter-item">
                  <input
                    id="id-search"
                    type="text"
                    placeholder="Employee ID"
                    value={idSearch}
                    onChange={(e) => setIdSearch(e.target.value)}
                    className="rounded-input"
                  />
                </div>

                {/* Role Filter */}
                <div className="filter-item">
                  <select
                    id="role-filter"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="rounded-input"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div className="filter-item">
                  <select
                    id="dept-filter"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="rounded-input"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hiring Date Range */}
                <div className="filter-item date-range">
                  <input
                    type="date"
                    placeholder="Start date"
                    value={hiringDateStart}
                    onChange={(e) => setHiringDateStart(e.target.value)}
                    className="rounded-input date-input"
                  />
                  <span className="date-separator">to</span>
                  <input
                    type="date"
                    placeholder="End date"
                    value={hiringDateEnd}
                    onChange={(e) => setHiringDateEnd(e.target.value)}
                    className="rounded-input date-input"
                  />
                </div>

                {/* Clear Filters Button */}
                <div className="filter-item">
                  <button 
                    className="clear-filters rounded-button"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Phone</th>
                    <th>Work Email</th>
                    <th>Hire Date</th>
                    <th>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.employee_id}>
                        <td>{emp.employee_id}</td>
                        <td>{emp.employee_name}</td>
                        <td>{emp.role}</td>
                        <td>{emp.department || 'N/A'}</td>
                        <td>{formatPhone(emp.phone_number)}</td>
                        <td>{emp.work_email || 'N/A'}</td>
                        <td>{formatDate(emp.hiring_date)}</td>
                        <td>${emp.salary.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-results">
                        No employees match the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}