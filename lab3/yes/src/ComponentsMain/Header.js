import React, { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";
import AllContentMain from "../ComponentsMain/AllContentMain";
import Shops from "../ComponentsMain/Shops";
import Info from "../ComponentsMain/Info";

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <a href="#" className="header__logo logo ">
            yes.
          </a>
        </div>
        <div className="header__menu menu">
          <div className="menu__icon icon-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <nav className="menu__body">
            <a href="" className="menu__link">
              Sun
            </a>
            <Link to="/Info" className="menu__link">
              Info
            </Link>
            <Link to="/Shop" className="menu__link">
              Shops
            </Link>
            <Link to="/Main" className="menu__link">
              Main
            </Link>
          </nav>
        </div>
        <div className="header__right">
          <a data-da=".menu__body,767,last" href="#" className="header__link">
            Customer care
          </a>
        </div>
      </div>
      <Routes>
        <Route path="/Main" element={<AllContentMain />} />
        <Route path="/Shop" element={<Shops />} />
        <Route path="/Info" element={<Info />} />
      </Routes>
    </header>
  );
};

export default Header;
