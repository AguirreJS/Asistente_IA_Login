import React from 'react';
import {Button, ButtonGroup , Link} from "@nextui-org/react";
import {Image} from "@nextui-org/react";
import './index.css';

function Menu() {
  return (

    <nav className="opacity-100 perzonalizado_menu ">
      <div className="flex justify-center ">
        <div className="flex">
          <div className="mt-7  flex items-center">
          <Image
      isBlurred
      width={240}
      src="https://www.asistente.intervia.com.ar/Intervia_inicio.png"
      alt="NextUI Album Cover"
      classNames="m-5"
    />
    </div>
        </div>
      </div>

  </nav>

  




  );
}

export default Menu;
