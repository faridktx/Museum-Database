import { Link } from "wouter";
import "./components.css";

export function Operations({ title, operations }) {
  return (
    <div className="operations-page">
      <div className="container">
        <h1>{title} Operations</h1>
        <div className="operations-grid">
          {operations.map((operation, index) => (
            <div key={index} className="operation-card">
              <div className="operation-icon">{operation.icon}</div>
              <h2>{operation.title}</h2>
              <p>{operation.description}</p>
              <Link href={operation.path}>
                <button className="button">Select Operation</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
