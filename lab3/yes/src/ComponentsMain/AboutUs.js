import React, { Component, useState } from "react";

const AboutUs = () => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  return (
    <section class="page__about-us about-us">
      <div class="about-us__container _container">
        <div class="about-us__body">
          <div class="about-us__heading article-header__subtitle">
            Who are we?
          </div>
          <div class="about-us__text">
            <p>
              Apologies if you were looking for an ordinary optical store. We've
              hand-picked the unique brands from all over the world to give you
              the special look for your everyday life.
            </p>
            {showMore && (
              <p>
                Our glasses will have you looking great and feeling better. We
                work with independent brands who use the highest-grade of
                materials, demonstrating detail and craftsmanship in every
                single pair. A wide range of styles reflect the diversity of our
                clients and are made to suit different face shapes.
              </p>
            )}
          </div>
          <button onClick={toggleShowMore}>
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
        <div class="about-us__image _ibg">
          <picture>
            <source srcset="img/photos/07.webp" type="image/webp" />
            <img src="img/photos/07.jpg?_v=1633799610512" alt="" />
          </picture>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
