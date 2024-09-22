import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage";
import InteractionObjects from "./pages/HomePage/InteractionObjects";


function App() {
  //Главная страница и страница взаимодействие с объектами
  return (
    <BrowserRouter>
       <Routes>
          <Route path="*" element={<HomePage />}/>
          <Route path="/InteractionObjects" element={<InteractionObjects />}></Route>
       </Routes>
    </BrowserRouter>
  );
}

export default App;
