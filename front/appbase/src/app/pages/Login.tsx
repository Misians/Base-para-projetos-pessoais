"use client";

import React, { FormEvent, useState, useEffect } from 'react';
import { FaUserShield } from "react-icons/fa";
import { AiOutlineSwapRight } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs";
import axios from 'axios';

const translations = {
    en: {
        welcomeBack: "Welcome back!",
        loginPrompt: "Login",
        username: "Username",
        enterUsername: "Enter your username",
        password: "Password",
        enterPassword: "Enter your password",
        incorrectCredentials: "Incorrect credentials",
        loginError: "Error logging in",
        noAccount: "Don't have an account?",
        createAccount: "Create Account",
        forgotPassword: "Forgot your Password?",
        clickHere: "Click Here",
    },
    pt: {
        welcomeBack: "Bem vindo de volta!",
        loginPrompt: "Login",
        username: "Usuário",
        enterUsername: "Digite seu login de usuario",
        password: "Senha",
        enterPassword: "Digite sua senha",
        incorrectCredentials: "Credenciais incorretas",
        loginError: "Ocorreu um erro ao efetuar login",
        noAccount: "Não tem uma conta?",
        createAccount: "Criar Conta",
        forgotPassword: "Esqueceu sua senha?",
        clickHere: "Clique aqui",
    }
};

const Login = () => {
    const [language, setLanguage] = useState<'en' | 'pt'>('pt');
    const [loginUserName, setLoginUserName] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    const [loginStatus, setLoginStatus] = useState<string>('');
    const [statusHolder, setStatusHolder] = useState<string>('message');

    const t = translations[language];

    const loginUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post<{ message?: string, accessToken?: string }>('http://localhost:3002/auth/login', {
                LoginUserName: loginUserName,
                LoginPassword: loginPassword
            });
            if (response.data.message || loginUserName === '' || loginPassword === '') {
                setLoginStatus(t.incorrectCredentials);
            } else {
                const { accessToken } = response.data;
                if (accessToken) {
                    localStorage.setItem('token', accessToken);
                    console.log(accessToken);
                }
            }
        } catch (error) {
            console.error(t.loginError, error);
            setLoginStatus(t.loginError);
        }
    };

    useEffect(() => {
        if (loginStatus !== '') {
            setStatusHolder('showMessage');
            const timer = setTimeout(() => {
                setStatusHolder('message');
            }, 4000);
            return () => clearTimeout(timer);
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
                  <img src='login.jpg' alt="Login Image" />
                    <div className="footerDiv flex">
                        <span className='Text'>{t.noAccount}</span>
                        <button className='btn-create'>
                            {t.createAccount}
                        </button>
                    </div>
                </div>
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <h3>{t.welcomeBack}</h3>
                        <div className="language-toggle" style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                            <img
                                src="reino-unido.png"
                                alt="English"
                                onClick={() => setLanguage('en')}
                                style={{
                                    width: '24px',
                                    cursor: 'pointer',
                                    opacity: language === 'en' ? 1 : 0.5,
                                
                                }}
                            />
                            <img
                                src="brasil.png"
                                alt="Portuguese"
                                onClick={() => setLanguage('pt')}
                                style={{
                                    width: '24px',
                                    cursor: 'pointer',
                                    opacity: language === 'pt' ? 1 : 0.5,
                                    
                                }}
                            />
                        </div>
                    </div>
                    <form className='form grid' onSubmit={onSubmit}>
                        <span className={statusHolder}>{loginStatus}</span>
                        <div className="inputDiv">
                            <label htmlFor="username">{t.username}</label>
                            <div className="input flex">
                                <FaUserShield className="icon"/>
                                <input
                                    type="text"
                                    id='username'
                                    placeholder={t.enterUsername}
                                    value={loginUserName}
                                    onChange={(event) => setLoginUserName(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="password">{t.password}</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className="icon"/>
                                <input
                                    type="password"
                                    id='password'
                                    placeholder={t.enterPassword}
                                    value={loginPassword}
                                    onChange={(event) => setLoginPassword(event.target.value)}
                                />
                            </div>
                        </div>
                        <br />
                        <button type='submit' className='btn flex' onClick={loginUser}>
                            <span>{t.loginPrompt}</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>
                        <span className='forgotPassword'>{t.forgotPassword} <a href="/RecuperarSenha">{t.clickHere}</a></span>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;