import React from "react";

const Shop = () => {
  return (
    <section className="page__shop shop">
      <div className="shop__item _scr-item">
        <div className="shop__image _ibg">
          <picture>
            <source srcSet="img/photos/02.webp" type="image/webp" />
            <img
              src="img/photos/02.jpg?_v=1633799610512"
              alt="woman with glasses"
            />
          </picture>
        </div>
        <a href="#no-scroll" className="shop__link">
          <span>SHOP WOMEN</span>
        </a>
      </div>
      <div className="shop__item _scr-item">
        <div className="shop__image _ibg">
          <picture>
            <source srcSet="img/photos/03.webp" type="image/webp" />
            <img
              src="img/photos/03.jpg?_v=1633799610512"
              alt="woman with glasses"
            />
          </picture>
        </div>
        <a href="#no-scroll" className="shop__link">
          <span>SHOP MEN</span>
        </a>
      </div>
    </section>
  );
};

export default Shop;
