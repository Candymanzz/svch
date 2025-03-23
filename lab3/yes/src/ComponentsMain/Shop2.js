import React from "react";

const Shop2 = () => {
  return (
    <section className="page__for-sight shop">
      <div className="shop__item">
        <div className="shop__image _ibg">
          <picture>
            <source srcSet="img/photos/05.webp" type="image/webp" />
            <img
              src="img/photos/05.jpg?_v=1633799610512"
              alt="woman with glasses"
            />
          </picture>
        </div>
        <a href="#no-scroll" className="shop__link">
          FOR SIGHT
        </a>
      </div>
      <div className="shop__item">
        <div className="shop__image _ibg">
          <picture>
            <source srcSet="img/photos/06.webp" type="image/webp" />
            <img
              src="img/photos/06.jpg?_v=1633799610512"
              alt="woman with glasses"
            />
          </picture>
        </div>
      </div>
    </section>
  );
};

export default Shop2;
