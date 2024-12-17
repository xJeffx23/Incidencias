import './Login.css';
import React, { useState } from 'react'; // manejar estados (email, contraseña y msg)
import '../../App.css';
import { Link } from 'react-router-dom'; // rutas
import { useNavigate } from 'react-router-dom'; // redireccion del login
import video from '../../assets/video.mp4';
import logo from '../../assets/logo.png';
import Axios from 'axios'; // para token

//icons de https://react-icons.github.io/react-icons/
import { MdMarkEmailRead } from "react-icons/md";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

const Login = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            setMessage('Por favor complete ambos campos');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(loginEmail)) {
            setMessage('Por favor ingrese un correo electrónico válido');
            return;
        }
        try {
            const response = await Axios.post('http://localhost:4000/login', {
                email: loginEmail,
                password: loginPassword,
            });
            setMessage(response.data.message);
            localStorage.setItem('token', response.data.token);  
            localStorage.setItem('role', response.data.role);  //se guarda el rol del usuario (dash)
            navigate('/dashboard');  
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };
    
    

//contenido 
    return (
        <div className='loginPage flex'>
            <div className='container flex'>
                <div className='videoDiv'>
                    <video src={video} autoPlay muted loop></video>
                    <div className='textDiv'>
                        <h2 className='title'>Registre las incidencias de su comunidad!</h2>
                        <p>Ayude a mejorar su comunidad reportando de manera rápida y sencilla</p>
                    </div>
                    <div className="footerDiv flex">
                        <span className="text">¿Aún no está registrado?</span>
                        <Link to={'/register'}>
                            <button className='btn'>Registrarse</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image" />
                        <h3>Inicio de sesión</h3>
                    </div>

                    <form action="" className='form grid'>
                        <span className='showMessage'>{message}</span>

                        <div className="inputDiv">
                            <label htmlFor="email">Correo Electrónico</label>
                            <div className="input flex">
                                <MdMarkEmailRead className='icon' />
                                <input 
                                    type="email" 
                                    id='email' 
                                    placeholder='Ingrese su correo electrónico' 
                                    onChange={(event) => {
                                        setLoginEmail(event.target.value);
                                    }} 
                                />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon' />
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="Ingrese su contraseña" 
                                    onChange={(event) => {
                                        setLoginPassword(event.target.value);
                                    }} 
                                />
                            </div>
                        </div>

                        <button type='submit' className='btn flex' onClick={handleLogin}>
                            <span>Iniciar sesión</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
