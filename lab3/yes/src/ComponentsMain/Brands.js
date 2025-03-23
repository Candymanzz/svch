import React, { Component } from "react";

const Brands = () => {
  return (
    <section className="page__brands brands">
      <div className="brands__header article-header">
        <h4 className="brands__subtitle article-header__subtitle">
          Our brands
        </h4>
        <a
          href="#no-scroll"
          className="brands__link article-header__link badge badge-info alert alert-primary"
        >
          SEE more
        </a>
      </div>
      <div className="brands__body">
        <div className="brands__row brands__row_top">
          <a href="#no-scroll" className="brands__brand">
            Krewe
          </a>
          <a href="#no-scroll" className="brands__brand">
            Carla
          </a>
          <a href="#no-scroll" className="brands__brand">
            Colour
          </a>
        </div>
        <div className="brands__row brands__row_bottom">
          <a href="#no-scroll" className="brands__brand">
            Modern
          </a>
          <a href="#no-scroll" className="brands__brand">
            Legacy
          </a>
          <a href="#no-scroll" className="brands__brand">
            TIJN
          </a>
        </div>
      </div>
    </section>
  );
};

export default Brands;
