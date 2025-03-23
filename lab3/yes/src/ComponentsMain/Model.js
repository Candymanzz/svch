import React, { Component } from "react";

const Model = () => {
  return (
    <section className="page__model model">
      <div className="model__container">
        <div className="model__picture">
          <div className="model__image _ibg">
            <picture>
              <source srcset="img/photos/04.webp" type="image/webp" />
              <img
                src="img/photos/04.jpg?_v=1633799610512"
                alt="woman with flowers on her eyes"
              />
            </picture>
          </div>
        </div>
        <div className="model__body">
          <div className="model__text">
            <div className="model__label">TIJN</div>
            <div className="model__name">Mitchel</div>
            <div className="model__description">
              All-time classic round shape
            </div>
          </div>
          <a href="#no-scroll" className="model__link">
            <span>SHOP THIS MODEL</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Model;
