import React, { Component } from "react";

const Shop2 = () => {
  return (
    <section class="page__for-sight shop">
      <div class="shop__item">
        <div class="shop__image _ibg">
          <picture>
            <source srcset="img/photos/05.webp" type="image/webp" />
            <img
              src="img/photos/05.jpg?_v=1633799610512"
              alt="woman with glasses"
            />
          </picture>
        </div>
        <a href="#no-scroll" class="shop__link">
          FOR SIGHT
        </a>
      </div>
      <div class="shop__item">
        <div class="shop__image _ibg">
          <picture>
            <source srcset="img/photos/06.webp" type="image/webp" />
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
