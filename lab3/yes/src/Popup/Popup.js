import React, { useEffect, useRef } from "react";

const Popup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupRef}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Подробная информация</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          consectetur ligula et felis facilisis, nec dapibus ligula hendrerit.
        </p>
      </div>
    </div>
  );
};

export default Popup;
