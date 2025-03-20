import { TiArrowBackOutline } from "react-icons/ti";
import './components.css';

export function Operations({title, operations}) {
    return (
        <div className="operations-page">
          <div className="container">
            <div>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="back-button"
            >
              <TiArrowBackOutline />
              Dashboard
            </button>
            </div>
            <h1>{title} Operations</h1>
            <div className="operations-grid">
              {operations.map((op, index) => (
                <div 
                  key={index} 
                  className="operation-card"
                  onClick={() => window.location.href = op.path}
                >
                  <div className="operation-icon">{op.icon}</div>
                  <h2>{op.title}</h2>
                  <p>{op.description}</p>
                  <button className="button">
                    Select Operation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
    );
}