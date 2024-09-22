import React from "react";
import Header from "../../compnents/header/Header";
import Footer from "../../compnents/footer/Footer";

function Layout({ children }) {
  //Шаблон страницы
  return (
    <div className="container">
      <Header/>
      <div className="wrapper">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;