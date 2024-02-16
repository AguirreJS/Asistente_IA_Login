
import {Button, ButtonGroup , Link,  Input} from "@nextui-org/react";
import {EyeFilledIcon} from "./scripts-next/EyeFilledIcon";
import {EyeSlashFilledIcon} from "./scripts-next/EyeSlashFilledIcon";
import React, { useState } from 'react';


function LoginForm() {


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      ProcesarLogin();
    }
  };

  
  
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const [email, setEmail] = useState(''); // Estado para el email
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [mensajeError, setMensajeError] = useState('');

  const ProcesarLogin = () => {
    console.log("ejecutando");
    const emailValue = document.getElementById('Email').value;
    const PssValue = document.getElementById('Pss').value
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valorEmail = regex.test(emailValue);
    console.log(emailValue);

    if (emailValue && !valorEmail) {
      setMensajeError('Email no válido');
      setEmail(true)
      return false;
    } else {
      setMensajeError('');
      setEmail(false)
     if(PssValue){
    envioCredencialesBack(PssValue , emailValue)
     }
    }

    let IPpublica;

async function obtenerIpPublica() {
  return fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      IPpublica = data.ip;
      return data.ip; // Esto devuelve la IP para el encadenamiento de promesas
    })
    .catch(error => {
      console.error('Error al obtener la IP:', error);
      throw error;
    });
}




async function envioCredencialesBack(contraseña , correo){

  let IPpublica = await obtenerIpPublica()

  if(IPpublica){
    let datosAEnviar = {
      contraseña: contraseña, // Asegúrate de que estas variables estén definidas
      correo: correo,         // y contengan los valores que quieres enviar.
      IPpublica: IPpublica    // y contengan los valores que quieres enviar.
    };
  
    fetch('https://remoto.rhglobal.com.ar:8443/validacioncredenciales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosAEnviar),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud al servidor falló');
      }
      return response.json(); // o response.text() si la respuesta no es JSON
    })
    .then(respuestaDelServidor => {
      if(respuestaDelServidor.respuesta == false){
        setMensajeError('Usuario o contraseña Incorrectos');
      }else if (respuestaDelServidor.respuesta == true){
        setMensajeError('Correcto');
        window.location.href = '/chat'; // Esto redirige al usuario a la ruta '/chat'
    }
    
      return respuestaDelServidor;
    })
    .catch(error => {
      setMensajeError('Error en la respuesta del servidor');
    });





  }
  

}



  };

  return (

 




    <div className="flex items-center justify-center h-screen ">
<div className="p-4 max-w-md mx-auto rounded-lg border shadow-md flex flex-col items-center translate-y-[-55%]">
    <div className="flex w-full flex-wrap items-center justify-center mb-6 md:mb-0 gap-4">

    <div className="w-full flex justify-center">
  <h1 className="text-white">Login</h1>
</div>

    <div className="w-full flex flex-row flex-wrap gap-4">
    <Input
              id="Email"
              type="email"
              label="Email"
              labelPlacement="outside"
              isInvalid={email}
              color='#720455'
              className="text-black"
            />
          
            </div>

<div className="w-full flex flex-row flex-wrap gap-4">

    <Input
      id="Pss"
      label="Password"
      className="text-white"
      variant="bordered"
      placeholder="Enter your password"
      color='#720455'
      endContent={
        <button className="focus:outline-none" color='primary' type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <EyeSlashFilledIcon color='secondary' className="text-2xl text-default-500 pointer-events-none" />
          ) : (
            <EyeFilledIcon color='secondary' className="text-2xl text-default-500 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
   
    />
         <h1 id="errorEmail" className="text-white">{mensajeError}</h1>

</div>

<div className="flex-shrink-0 flex items-center">
    <Button className="gap-4" color="primary" variant="shadow"  onClick={ProcesarLogin}>
      Ingresar
    </Button>
    </div>



    <div className="flex-shrink-0 flex items-center">

<Button
      href="./"
      as={Link}
      color="primary"
      showAnchorIcon
      variant="solid"
    >
    Registrar Mi Empresa.
    </Button>



          </div>





    </div>


   
  </div>

</div>
  



  );
}

export default LoginForm;
