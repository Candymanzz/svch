import React, { useState } from "react";
import Popup from "../Popup/Popup";

const Intro = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <section className="page__intro intro">
      <div className="intro__container _container">
        <div className="intro__body">
          <h1 className="intro__title">We treat your eyes with care</h1>

          <a
            href="#"
            className="intro__link alert alert-primary"
            onClick={openPopup}
          >
            <span>SEE THE COLLECTION</span>
          </a>

          <Popup isOpen={isPopupOpen} onClose={closePopup} />
        </div>

        <div className="intro__image">
          <div className="intro__pic _ibg">
            <picture>
              <source srcSet="img/photos/01.webp" type="image/webp" />

              <img
                src="img/photos/01.jpg?_v=1633799610512"
                alt="Girl with flowers and glasses"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
