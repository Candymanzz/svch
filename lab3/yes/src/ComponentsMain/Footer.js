import React, { Component } from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__header head-footer">
          <div className="head-footer__body _container">
            <a href="#no-scroll" className="head-footer__logo logo">
              yes.
            </a>
            <div className="head-footer__slogan">
              We treat your eyes with care
            </div>
          </div>
        </div>
        <div className="footer__main _container">
          <div className="footer__left left-footer">
            <div className="left-footer__body">
              <div className="footer__menu menu-footer" data-spollers="768,max">
                {/* Menu Columns */}
                {[
                  { title: "Shop", items: ["Sun", "Optical", "Brands"] },
                  {
                    title: "Customer care",
                    items: ["FAQ", "Shipping and returns", "Fit guide"],
                  },
                  {
                    title: "Fit guide",
                    items: ["Terms and conditions", "Privacy policy"],
                  },
                ].map((menu, index) => (
                  <div className="menu-footer__column" key={index}>
                    <div className="menu-footer__heading" data-spoller>
                      {menu.title}
                    </div>
                    <ul className="menu-footer__list">
                      {menu.items.map((item, idx) => (
                        <li key={idx}>
                          <a className="menu-footer__link" href="#no-scroll">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div
                className="footer__copyrights copyrights"
                data-da=".footer__main,992,last"
              >
                <div className="copyrights__top">
                  <div className="copyrights__item">
                    Designed and built by Margarita
                  </div>
                  <div className="copyrights__item">
                    &#169; 2020 Yes for Eyes
                  </div>
                </div>
                <div className="copyrights__bottom">
                  <div className="copyrights__item copyrights__item_small">
                    Photo materials belong to
                    <a href="#no-scroll">Krewe</a>
                    <a href="#no-scroll">Carla Colour</a>
                    <a href="#no-scroll">TIJN</a>
                    <a href="#no-scroll">Modern Legacy</a>
                    <a href="#no-scroll">Unsplash</a>
                  </div>
                  <div className="copyrights__item copyrights__item_small">
                    This site is a design concept and not meant for commercial
                    purposes. I don't own or sell any goods displayed on this
                    site.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__right right-footer">
            <div className="right-footer__body">
              <div className="right-footer__top">
                <div className="right-footer__text">
                  No spam, just pure inspiration and good news
                </div>
              </div>
              <div className="right-footer__bottom">
                <div className="right-footer__contacts contacts-footer">
                  <div className="contacts-footer__left">
                    <div className="contacts-footer__text">
                      We are always close
                    </div>
                    <a
                      href="tel:+316574857326"
                      className="contacts-footer__tel"
                    >
                      +111 11 111 11 11
                    </a>
                    <a
                      href="mailto:hello@gmail.com"
                      className="contacts-footer__email"
                    >
                      hello@gmail.com
                    </a>
                  </div>
                  <div className="contacts-footer__right">
                    <div className="contacts-footer__socials socials">
                      <a
                        href="#no-scroll"
                        className="socials__item socials__item_insta"
                      >
                        <picture>
                          <source
                            srcSet="img/icons/insta_icon.svg"
                            type="image/webp"
                          />
                          <img
                            src="img/icons/insta_icon.svg?_v=1633799610512"
                            alt="go to instagram"
                          />
                        </picture>
                      </a>
                      <a
                        href="#no-scroll"
                        className="socials__item socials__item_facebook"
                      >
                        <picture>
                          <source
                            srcSet="img/icons/facebook_icon.svg"
                            type="image/webp"
                          />
                          <img
                            src="img/icons/facebook_icon.svg?_v=1633799610512"
                            alt="go to facebook"
                          />
                        </picture>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* New Card for Company Info */}
              <div className="footer__card">
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Join Our Newsletter</h5>
                    <p className="card-text">
                      Subscribe for updates on new products and exclusive
                      offers.
                    </p>
                    <a href="#no-scroll" className="btn btn-primary">
                      Subscribe
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
