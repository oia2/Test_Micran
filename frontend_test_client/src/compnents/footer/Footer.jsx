import React from 'react'
import cl from './Footer.module.scss'
import MicranLogoW from '../../imgs/MicranLogoWhite.svg'

export default function Footer() {
  return (
    <div className={cl.footer}>
        <div className={cl.footer__container}>
            <img src={MicranLogoW} alt="" />
            <p className={cl.footer__text}>Все права защищены © Микран, 1991-2024</p>
        </div> 
    </div>
  )
}
