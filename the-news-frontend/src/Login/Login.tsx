// App.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoTheNews from '../image.png';
import Loader from '../Loader/Loader';

import './Login.css';

function Login() {
    const navigate = useNavigate();

    const[email, setEmail] = useState ('');
    const[isLoading, setIsLoading] = useState (false);
    const[message, setMessage] = useState (false);

    console.log(email)

    const Login = () =>{
        setIsLoading(true)
        
        axios.post('https://the-news-api.joaopedrobraga-07.workers.dev/auth/login', {email: email})
        .then(res =>{
            // Armazene o token no localStorage
            localStorage.clear();
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userData', JSON.stringify(res.data));

            setTimeout(() => {
                setIsLoading(false)
                if(email === 'admin@admin.com'){
                    return navigate('/admin/dashboard');
                }
                navigate('/Home');
            }, 2000);

        }).catch(err => {
            console.log(err)
            
            setIsLoading(false)
            setMessage(err.response.data.message);

            setTimeout(() => {
                setMessage(false);
            }, 3000);
          })
    }
    return (
        <div className="container center">
            <div className='main center'>
                <div className='img__box center'>
                        <img className='img__logo' src={LogoTheNews} alt="" />
                </div>

                <div className='text__container'>
                    <p className='name__plataform'>The News</p>
                    <p className='text__span'>Todos os dados e históricos de suas leituras a um clique de você. Faça login e confira!</p>
                </div>

                {message && (
                    <p className='message'>{message}</p>
                )}

                {isLoading ? (
                    <Loader/>
                ):(
                    <div className="input-container">
                        <input placeholder="Entre com seu e-mail" type="email" onChange={(e) => {setEmail(e.target.value)}}required/>
                        <button className="invite-btn" type="button" onClick={Login}>
                            Entrar
                        </button>
                    </div>
                )}
               
            </div>
            <div className='footer'>
                <p>Ainda não tem uma conta? Crie a sua agora.</p>
            </div>
        </div>
    );
}

export default Login;
