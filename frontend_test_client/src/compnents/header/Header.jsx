import React, { useState, useEffect } from 'react';
import cl from './Header.module.scss';
import MicranLogo from '../../imgs/MicranLogo.svg';
import MicranLogoW from '../../imgs/MicranLogoWhite.svg'
import { NavLink } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Обработчик скролла
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 40) { // Меняем цвет после 40px скролла
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`${cl.header} ${isScrolled ? cl.headerScroll : ''}`}>
      <div className={cl.header__container}>
        <NavLink className={cl.header__logo_container} to={"/*"}>
        {
          isScrolled ?
            <img src={MicranLogoW} alt="Micran Logo" className={cl.header__logo} />
            :
            <img src={MicranLogo} alt="Micran Logo" className={cl.header__logo} />
        }
        </NavLink>
        <ul className={cl.header__nav}>
          <NavLink className={`${cl.header__link} ${isScrolled ? cl.white : ''}`} to={"/*"}>Главная</NavLink>
          <NavLink className={`${cl.header__link} ${isScrolled ? cl.white : ''}`} to={"/InteractionObjects"}>Взаимодействие с объектами</NavLink>
        </ul>
      </div>
    </div>
  );
}
