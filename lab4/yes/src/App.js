import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './ComponentsMain/Header';
import Footer from './ComponentsMain/Footer';
import AboutUs from './ComponentsMain/AboutUs';
import Contact from './ComponentsMain/Contact';
import Model from './ComponentsMain/Model';
import Bestsellers from './ComponentsMain/Bestsellers';
import Stock from './ComponentsMain/Stock';
import "./App.css";
import AllContentMain from "./ComponentsMain/AllContentMain";
import Shops from "./ComponentsMain/Shops";
import Info from "./ComponentsMain/Info";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Model />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/bestsellers" element={<Bestsellers />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/model/:id" element={<Model />} />
            <Route path="/bestseller/:id" element={<Bestsellers />} />
            <Route path="/stock/:id" element={<Stock />} />
            <Route path="/Main" element={<AllContentMain />} />
            <Route path="/Shop" element={<Shops />} />
            <Route path="/Info" element={<Info />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
