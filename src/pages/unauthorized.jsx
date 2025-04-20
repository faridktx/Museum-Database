import "../components/components.css";

export function Unauthorized() {
  return (
    <div className="not-found">
      <div className="container">
        <h1>401 Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </div>
  );
}
