import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Input, Button, Card, CardBody , Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
let ubicacionActual = "https://remoto.rhglobal.com.ar"

function LoginForm() {
 
    const [selected, setSelected] = useState("login");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signUpName, setSignUpName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");
    const [invalidPss, setInvalidPass] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidName, setInvalidName] = useState(false);
    const [invalidIgual, setInvaliIgual] = useState(false);


    let ippublica
        obtenerIpPublica();


    async function obtenerIpPublica() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
          ippublica = data.ip
        } catch (error) {
            console.error('Error al obtener la IP:', error);
        }
    }

///////// iniciar session
const handleLoginSubmit = (e) => {
    e.preventDefault();

    const emailToLower = loginEmail.toLowerCase();

    // Validación del formato del correo electrónico con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToLower)) {
        console.error("El correo electrónico no es válido.");
        setInvalidEmail(true); // Marcar el correo como inválido
        return; // Detener la ejecución si el correo no es válido
    }
    setInvalidEmail(false); 

    // Preparar datos para la solicitud
    const loginData = {
        correo: emailToLower,
        contraseña: loginPassword,
    };

    // Realizar solicitud POST
    fetch(ubicacionActual + '/validacioncredenciales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Respuesta del servidor no fue exitosa");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        switch (data.respuesta) {
            case "NoExiste":
                onOpen(); // Manejar el caso de usuario no existente
                break;
            case false:
                setInvalidPass(true); // Manejar el caso de contraseña incorrecta
                break;
            case true:
                window.location.href = '/chat'; // Redirigir al usuario a /chat
                break;
            default:
                console.error("Respuesta no reconocida del servidor");
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
};

//////// REGISTRARSE
    
const handleSignUpSubmit = (e) => {
    e.preventDefault();

    // Expresiones regulares para las validaciones
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/; // al menos una mayúscula, una minúscula y un símbolo
    const regexName = /^\S*$/; // no permite espacios
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // patrón básico de correo electrónico


        // Validación del nombre
        if (!regexName.test(signUpName)) {
            console.error("El nombre no debe contener espacios.");
            setInvalidName(true)
            return; // Termina la ejecución si el nombre tiene espacios
        }

         // Validación del correo electrónico
    if (!regexEmail.test(signUpEmail)) {
        setInvalidEmail(true); 
        console.error("Ingresa un correo electrónico válido.");
        return; // Termina la ejecución si el correo no es válido
    }


    // Validación de la contraseña
    if (!regexPassword.test(signUpPassword)) {
        console.error("La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un símbolo especial.");
        setInvalidPass(true);
        return; // Termina la ejecución si la contraseña no cumple los requisitos
    }

// Asumiendo que las validaciones ya se han pasado y los datos son correctos

// Datos del formulario
const userData = {
    name: signUpName,
    email: signUpEmail,
    password: signUpPassword
};

// Opción de fetch para el método POST
const fetchOptions = {
    method: 'POST', // Método HTTP
    headers: {
        'Content-Type': 'application/json', // Indicando que el cuerpo del mensaje es un JSON
    },
    body: JSON.stringify(userData), // Convirtiendo los datos del usuario a string en formato JSON
};

fetch(ubicacionActual + '/registrodeusuario', fetchOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json(); // Procesando la respuesta como JSON
    })
    .then(data => {
        console.log('Success:', data); // Acciones en caso de éxito, como mostrar un mensaje
        // Utilizar la URL de redireccionamiento proporcionada por el servidor para redirigir
        if(data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
            // Manejar el caso en que no se proporciona una URL de redireccionamiento
            onOpen()
        }
    })
    .catch((error) => {
        console.error('Error:', error); // Manejo de errores
    });
   
};


///////////////////////////////////////////// REESTABLECER CONTRASEÑA

const handleResetSubmit = (e) => {
    e.preventDefault();

    // Expresiones regulares para las validaciones
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/; // al menos una mayúscula, una minúscula y un símbolo
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // patrón básico de correo electrónico

    // Validación del correo electrónico
    if (!regexEmail.test(resetEmail)) {
        console.error("Ingresa un correo electrónico válido.");
        setInvalidEmail(true); 
        return; // Termina la ejecución si el correo no es válido
    }
    setInvalidEmail(false); 
    // Validación de la contraseña
    if (!regexPassword.test(resetPassword)) {
        console.error("La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un símbolo especial.");
        setInvalidPass(true);
        return; // Termina la ejecución si la contraseña no cumple los requisitos
    }

    // Validación de la confirmación de la contraseña
    if (resetPassword !== resetConfirmPassword) {
        console.error("Las contraseñas no coinciden.");
        setInvaliIgual(true);
        return; // Termina la ejecución si las contraseñas no coinciden
    }

    // Si todo es correcto, se procede con el reseteo de la contraseña
    fetch(  ubicacionActual + '/restartuser', {
        method: 'POST', // Método HTTP para enviar datos
        headers: {
          'Content-Type': 'application/json', // Indicamos que el cuerpo de la solicitud es un JSON
        },
        body: JSON.stringify({
          email: resetEmail, // Asignamos el email ingresado
          password: resetPassword, // Asignamos la contraseña ingresada
        }),
      })
      .then(response => response.json()) // Convertimos la respuesta a JSON
      .then(data => {
        console.log('Success:', data); // Manejo exitoso de la respuesta
        if(data.rest == true){
            onOpen();
        } else {
            setInvalidEmail(true); 
        }
         // Podrías llamar a onOpen aquí si deseas hacerlo tras la respuesta exitosa
      })
      .catch((error) => {
        console.error('Error:', error); // Manejo de errores de la solicitud
      });
      
};



    const {isOpen, onOpen, onOpenChange} = useDisclosure();


    return (
        <div className="flex items-center justify-center h-screen">
            <div className={`p-4 max-w-md mx-auto rounded-lg border shadow-md flex flex-col items-center translate-y-[-30%] ${selected === "login" ? "translate-y-[-30%]" : "translate-y-[-30%]"} `}>
            <Card className={`max-w-full w-[400px] ${selected === "login" ? "h-[300px]" : "h-[400px]"} bg-[#33333]`}>
                    <CardBody className="overflow-hidden">
                        <Tabs fullWidth size="md" aria-label="Tabs form" selectedKey={selected} onSelectionChange={setSelected}>
                            <Tab key="login" title="Login">
                                <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}  >
                                    <Input errorMessage={`${invalidEmail === false ? "" : "Correo invalido"}`} isRequired label="Correo" placeholder="Ingrese su Correo" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                    <Input  errorMessage={`${invalidPss === false ? "" : "Contraseña Incorrecta"}`} isInvalid={invalidPss} isRequired label="Contraseña" placeholder="Ingrese su Contraseña" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                                    
                                </form>
                            </Tab>

                            <Tab key="sign-up" title="Registrarme">
                                <form className="flex flex-col gap-4" onSubmit={handleSignUpSubmit}>
                                    <Input errorMessage= {`${invalidName === false ? "" : "Ingrese un solo nombre sin espacios"}`} isRequired label="Nombre" placeholder="Ingrese su nombre" type="text" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} />
                                    <Input errorMessage={`${invalidEmail === false ? "" : "Correo invalido"}`}  isRequired label="Correo" placeholder="Correo Electronico" type="email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
                                    <Input  errorMessage={`${invalidPss === false ? "" : "La contraseña necesita incluir minúsculas, mayúsculas y un símbolo."}`}  isInvalid={invalidPss} isRequired label="Contraseña" placeholder="Ingrese una Contraseña" type="password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} />
                                </form>
                            </Tab>

                            <Tab key="Pss" title="Recuperar Contraseña">
                                <form className="flex flex-col gap-4" onSubmit={handleResetSubmit}>
                                    <Input errorMessage={`${invalidEmail === false ? "" : "Correo invalido"}`} isRequired label="Correo" placeholder="Ingrese correo electronico" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                                    <Input errorMessage={`${invalidPss === false ? "" : "La contraseña necesita incluir minúsculas, mayúsculas y un símbolo."}`}  isRequired label="Nueva contraseña" placeholder="Ingrese nueva contraseña" type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} />
                                    <Input errorMessage={`${invalidIgual === false ? "" : "Las contraseñas no coinciden."}`} isInvalid={invalidPss} isRequired label="Repita nueva contraseña" placeholder="Repita nueva contraseña" type="password" value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} />
                                </form>
                            </Tab>
                        </Tabs>
                        <div className="flex gap-2 justify-end">
                            {selected === "login" && (
                                <Button fullWidth color="primary" onClick={handleLoginSubmit}>
                                    Ingresar
                                </Button>
                            )}
                            {selected === "sign-up" && (
                                <Button fullWidth color="primary" onClick={handleSignUpSubmit}>
                                    Registrarme
                                </Button>
                            )}
                            {selected === "Pss" && (
                                <Button fullWidth color="primary" onClick={handleResetSubmit}>
                                    Enviar
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>


      <Modal 
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
        {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
              {selected === "login" && "Usuario Invalido."}
            {selected === "sign-up" && "Error Inesperado."}
            {selected === "Pss" && "Email enviado"}


              </ModalHeader>
              <ModalBody>
              <p className="mt-4">
            {selected === "login" && "Atención: El usuario ingresado no se encuentra registrado en nuestra base de datos. Por favor, verifica la información e intenta nuevamente con un usuario válido. Recuerda que si se registran más de 5 intentos fallidos con un usuario no reconocido, tu acceso al sistema será temporalmente suspendido por motivos de seguridad. Agradecemos tu comprensión."}
            {selected === "sign-up" && "Lamentamos los inconvenientes, pero hemos encontrado un error inesperado en nuestro sistema. Por favor, ponte en contacto con el administrador del sitio para completar el proceso de registro de manera segura. Agradecemos tu comprensión y paciencia"}
            {selected === "Pss" && "Te hemos enviado un enlace a tu correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para actualizar tu contraseña. Si no recibes el correo en los próximos minutos, verifica también en tu carpeta de spam. ¡Gracias por tu paciencia!"}
        </p>
              </ModalBody>
              <ModalFooter>
                <Button color="foreground" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20" onPress={onClose}>
                  Aceptar
                </Button>
              </ModalFooter>
              </>
          )}
        </ModalContent>
      </Modal>




        </div>
    );
}

export default LoginForm;
