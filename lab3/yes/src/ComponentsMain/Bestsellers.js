import React, { Component, useState, useEffect } from "react";

const Bestsellers = () => {
  const [items, setItem] = useState([]);

  useEffect(() => {
    fetch("/data/stockDataB.json")
      .then((response) => response.json())
      .then((data) => setItem(data))
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  return (
    <section className="page__bestsellers bestsellers">
      <div className="bestsellers__header article-header">
        <h4 className="bestsellers__subtitle article-header__subtitle subtitle">
          Bestsellers
        </h4>
        <a
          href="#no-scroll"
          className="bestsellers__link article-header__link btn btn-outline-dange btn btn-danger"
        >
          SEE THE COLLECTION
        </a>
      </div>
      <div className="bestsellers__items items-optic row">
        {items.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card">
              <a href="#no-scroll" className="items-optic__column">
                <div className="items-optic__image _ibg">
                  <picture>
                    <source srcSet={item.images.webp} type="image/webp" />
                    <img
                      src={item.images.png}
                      alt=""
                      className="card-img-top"
                    />
                  </picture>
                </div>
                <div className="card-body">
                  <h5 className="items-optic__model card-title">
                    {item.model}
                  </h5>
                  <p className="items-optic__color card-text">{item.color}</p>
                  <div className="items-optic__price card-text">
                    &#36; {item.price}
                  </div>
                  <a href="#no-scroll" className="btn btn-primary">
                    View Details
                  </a>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Bestsellers;
