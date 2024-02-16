import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LoginForm from './LoginForm';
import {NextUIProvider} from "@nextui-org/react";
import Menu from './menu';
import miImagen from './Intervia_inicio.png';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NextUIProvider className="opacity-100">
    <div className='Backperzonalizado flex flex-col items-center'> {/* Ajuste para centrar y manejar el espacio interno */}
      <Menu />
      <img src={miImagen} alt="Descripción de la imagen" className="mx-auto max-w-xs  mb-4" /> {/* Ajuste de margen inferior */}
      <LoginForm className="absolute top-1/2 transform -translate-y-1/2 w-full" /> {/* Asumiendo que LoginForm acepte className para ajustar el margen */}
    </div>
  </NextUIProvider>
);
