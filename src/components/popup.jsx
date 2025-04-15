import { useState, useEffect } from "react";
import "./components.css";

export function Popup({
  show,
  title,
  message,
  onClose,
  buttonText = "OK",
  type = "default",
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  const getPopupClass = () => {
    switch (type) {
      case "success":
        return "popup-success";
      case "error":
        return "popup-error";
      default:
        return "";
    }
  };

  return (
    <div
      className={`popup-overlay ${show ? "show" : "hide"}`}
      onClick={onClose}
    >
      <div
        className={`popup-content ${getPopupClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="popup-title">{title}</h2>}
        <div className="popup-message">{message}</div>
        <div className="popup-actions">
          <button
            className={`button ${type === "error" ? "button-error" : ""}`}
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
