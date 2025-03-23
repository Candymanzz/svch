import React, { Component, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

const Stock = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/data/stockDataS.json")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  return (
    <section className="page__stock stock">
      <div className="stock__header article-header">
        <h4 className="stock__subtitle article-header__subtitle subtitle">
          New in stock
        </h4>
        <a
          href="/NewInStock/NewInStock"
          className="stock__link article-header__link"
        >
          SEE THE COLLECTION
        </a>
      </div>
      <div className="stock__items items-optic">
        {items.map((item) => (
          <a key={item.id} href="#no-scroll" className="items-optic__column">
            <div className="items-optic__image _ibg">
              <picture>
                <source srcSet={item.images.webp} type="image/webp" />
                <img src={item.images.png} alt={item.model} />
              </picture>
            </div>
            <div
              id="carouselExampleIndicators"
              class="carousel slide"
              data-ride="carousel"
            >
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div className="items-optic__model">{item.model}</div>
                </div>
                <div class="carousel-item">
                  <div className="items-optic__color">{item.color}</div>
                </div>
                <div class="carousel-item">
                  <div className="items-optic__price">&#36; {item.price}</div>
                </div>
              </div>
              <a
                class="carousel-control-prev"
                href="#carouselExampleIndicators"
                role="button"
                data-slide="prev"
              >
                <span
                  class="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span class="sr-only">Previous</span>
              </a>
              <a
                class="carousel-control-next"
                href="#carouselExampleIndicators"
                role="button"
                data-slide="next"
              >
                <span
                  class="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Stock;
