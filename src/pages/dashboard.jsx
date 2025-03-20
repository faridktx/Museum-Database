import '../components/components.css';

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="container dashboard-content">
        <h1 style={{borderBottom: "1px solid rgba(0, 0, 0, 0.1)"}}>Museum Collection Dashboard</h1>
        <section className="dashboard-section">
          <h2>Reports</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Collection Overview</h3>
              <p>View comprehensive reports about your museum's collection.</p>
              <button className="button">Generate Report</button>
            </div>
            <div className="dashboard-card">
              <h3>Conservation Status</h3>
              <p>Track the condition and maintenance of artifacts.</p>
              <button className="button">View Status</button>
            </div>
            <div className="dashboard-card">
              <h3>Loan History</h3>
              <p>Review artifact loan records and current locations.</p>
              <button className="button">Access History</button>
            </div>
          </div>
        </section>
        <section className="dashboard-section">
          <h2>Data Management</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Update Artifacts</h3>
              <p>Add to or modify existing artifact information.</p>
            <button className="button" onClick={() => window.location.href = '/login/artifact'}>Update Artifact</button>
            </div>
            <div className="dashboard-card">
              <h3>Update Artists</h3>
              <p>Add to or modify the existing artist database.</p>
              <button className="button" onClick={() => window.location.href = '/login/artist'}>Update Artists</button>
            </div>
            <div className="dashboard-card">
              <h3>Update Employees</h3>
              <p>Modify existing museum employee information.</p>
              <button className="button" onClick={() => window.location.href = '/login/employee'}>Update Records</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
