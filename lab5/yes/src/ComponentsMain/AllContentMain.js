import Intro from "../ComponentsMain/Intro";
import Shop from "../ComponentsMain/Shop";
import Stock from "../ComponentsMain/Stock";
import Model from "../ComponentsMain/Model";
import Bestsellers from "../ComponentsMain/Bestsellers";
import Brands from "../ComponentsMain/Brands";
import AboutUs from "../ComponentsMain/AboutUs";
import Footer from "../ComponentsMain/Footer";
import Shop2 from "../ComponentsMain/Shop2";
import React from "react";

const AllContentMain = () => {
  return (
    <>
      <main className="page">
        <Intro />
        <Shop />
        {/* ? */}
        <Stock />
        <Model />
        <Bestsellers />
        <Shop2 />
        <Brands />
        <AboutUs />
      </main>
      <Footer />
    </>
  );
};

export default AllContentMain;
