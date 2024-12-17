import React, { useState } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import Axios from 'axios';

// assets 
import video from '../../assets/video.mp4';
import logo from '../../assets/logo.png';

//icons de https://react-icons.github.io/react-icons/ y https://icons.getbootstrap.com
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { MdMarkEmailRead } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { HiOutlineIdentification } from "react-icons/hi";


const Register = () => {
    //estados locales y estado de error o exito
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    //crear usuario
    const createUser = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) {
            setMessage('Todos los campos son obligatorios');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage('Por favor ingrese un correo electrónico válido');
            return;
        }
        if (password.length < 6) {
            setMessage('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        try {
            const response = await Axios.post('http://localhost:4000/register', { firstName, lastName, email, password });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setMessage(error.response?.data?.message || 'Error al registrar usuario');
        }
    };
    
    //contneido
    return (
        <div className='registerPage flex'>
            <div className='container flex'>
                <div className='videoDiv'>
                    <video src={video} autoPlay muted loop></video>
                    <div className='textDiv'>
                        <h2 className='title'>Registre las incidencias de su comunidad!</h2>
                        <p>Ayude a mejorar a su comunidad reportando de manera rápida y sencilla</p>
                    </div>
                    <div className="footerDiv flex">
                        <span className="text">¿Ya tiene una cuenta?</span>
                        <Link to={'/'}>
                            <button className='btn'>Iniciar sesión</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image" />
                        <h3>Registro de usuario</h3>
                    </div>

                    <form action="" className='form grid'>
                        {message && <span className='showMessage'>{message}</span>}

                        <div className="inputDiv">
                            <label htmlFor="firstName">Nombre</label>
                            <div className="input flex">
                                <BsPerson className='icon' />
                                <input 
                                    type="text" 
                                    id='firstName' 
                                    placeholder='Ingrese su nombre' 
                                    onChange={(event) => {
                                        setFirstName(event.target.value);
                                    }} 
                                />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="lastName">Apellidos</label>
                            <div className="input flex">
                                <HiOutlineIdentification className='icon' />
                                <input 
                                    type="text" 
                                    id='lastName' 
                                    placeholder='Ingrese sus apellidos' 
                                    onChange={(event) => {
                                        setLastName(event.target.value);
                                    }} 
                                />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="email">Correo Electrónico</label>
                            <div className="input flex">
                                <MdMarkEmailRead className='icon' />
                                <input 
                                    type="email" 
                                    id='email' 
                                    placeholder='Ingrese su correo electrónico' 
                                    onChange={(event) => {
                                        setEmail(event.target.value);
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
                                        setPassword(event.target.value);
                                    }} 
                                />
                            </div>
                        </div>

                        <button type='submit' className='btn flex' onClick={createUser}>
                            <span>Registrar nuevo usuario</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
