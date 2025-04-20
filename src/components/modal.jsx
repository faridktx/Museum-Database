export const ErrorModal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <>
      <style>{`
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
          }
  
          .modal-box {
            background: #fdfdfd;
            border: 1px solid #ccc;
            border-radius: 10px;
            width: 90%;
            max-width: 640px;
            padding: 2rem;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
            font-family: "Segoe UI", sans-serif;
            animation: fadeIn 0.25s ease-out;
          }
  
          .modal-box h3 {
            margin-top: 0;
            font-size: 1.6rem;
            color: #222;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
  
          .modal-box p {
            margin: 0.75rem 0;
            padding: 0.5rem 0.75rem;
            border-left: 4px solid #a33;
            background-color: #fdf3f3;
            color: #a33;
            font-size: 0.92rem;
            line-height: 1.6;
            text-align: left;
            border-radius: 4px;
          }
  
          .modal-actions {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
          }
  
          .modal-actions button {
            padding: 0.65rem 1.6rem;
            border-radius: 6px;
            border: 1px solid transparent;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease, border 0.2s ease;
            background-color: #444444;
            color: white;
          }
  
          .modal-actions button:hover {
            background-color: #333333;
            border-color: #222222;
          }
  
          @keyframes fadeIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>

      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Error</h3>
          {message.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
          <div className="modal-actions">
            <button onClick={onClose}>OK</button>
          </div>
        </div>
      </div>
    </>
  );
};
