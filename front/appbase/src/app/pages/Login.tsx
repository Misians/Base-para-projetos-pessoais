"use client";

import React, {  FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { FaUserShield } from "react-icons/fa";
//import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineSwapRight } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs";
import axios from 'axios';

const Login = () => {
    const [loginUserName, setLoginUserName] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    
    //const navigateTo = useNavigate();

    const [loginStatus, setLoginStatus] = useState<string>('');
    const [statusHolder, setStatusHolder] = useState<string>('message');

    const loginUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post<{ message?: string, accessToken?: string }>('http://localhost:3002/auth/login', {
                LoginUserName: loginUserName,
                LoginPassword: loginPassword
            });
            if (response.data.message || loginUserName === '' || loginPassword === '') {
                setLoginStatus('Credenciais incorretas');
            } else {
                const { accessToken } = response.data;
                if (accessToken) {
                    localStorage.setItem('token', accessToken); // Store JWT token in local storage
                    console.log(accessToken);
                    //navigateTo('/dashboard');
                }
            }
        } catch (error) {
            console.error('Erro ao efetuar login:', error);
            setLoginStatus('Ocorreu um erro ao efetuar login');
        }
    };

    useEffect(() => {
        if (loginStatus !== '') {
            setStatusHolder('showMessage');
            const timer = setTimeout(() => {
                setStatusHolder('message');
            }, 4000);
            return () => clearTimeout(timer); // Cleanup timeout
        }
    }, [loginStatus]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoginUserName('');
        setLoginPassword('');
    };

    return (
        <div className='loginPage flex'>
            <div className='container flex'>
                <div className="imgDiv">              
                  <img src='login.jpg' alt="aaaaaaaaaaa" />

                    {/* <img src={'photoImg'} alt="avatar" /> */}
                    {/* <div className="textDiv">
                        <h2 className='title'>Faça suas buscas aqui!</h2>
                        <p>Para poder fazer suas buscas é necessário ter login na plataforma</p>
                    </div> */}
                    <div className="footerDiv flex">
                        <span className='Text'>Não tem uma conta?</span>
                            <button className='btn-create'>
                                Criar Conta
                            </button>
                    </div>
                </div>
                <div className="formDiv flex">
                    <div className="headerDiv">
                        {/* <img src={'logo'} alt="logo img" /> */}
                        <h3>Bem vindo de volta!</h3>
                    </div>
                    <form className='form grid' onSubmit={onSubmit}>
                        <span className={statusHolder}>{loginStatus}</span>
                        <div className="inputDiv">
                            <label htmlFor="username">Usuário</label>
                            <div className="input flex">
                                <FaUserShield className="icon"/>
                                <input
                                    type="text"
                                    id='username'
                                    placeholder='Digite seu login de usuario'
                                    value={loginUserName}
                                    onChange={(event) => setLoginUserName(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="password">Senha</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className="icon"/>
                                <input
                                    type="password"
                                    id='password'
                                    placeholder='Digite sua senha'
                                    value={loginPassword}
                                    onChange={(event) => setLoginPassword(event.target.value)}
                                />
                            </div>
                        </div>
                        <br />
                        <button type='submit' className='btn flex' onClick={loginUser}>
                            <span>LOGIN</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>
                        <span className='forgotPassword'>Forgot your Password? <a href="/RecuperarSenha">Click Here</a></span>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
