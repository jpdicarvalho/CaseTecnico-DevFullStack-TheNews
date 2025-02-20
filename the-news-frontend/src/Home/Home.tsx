// App.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoTheNews from '../image.png';
import Loader from '../Loader/Loader';

import './Home.css';

function Home() {
    const navigate = useNavigate();

    const[isLoading, setIsLoading] = useState (false);
    const[message, setMessage] = useState (false);

    
    return (
        <>
            <div className='header__home'>
                    <div>user</div>
                    <div>LOGUT</div>
                </div>
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

               
            </div>
            <div className='footer'>
                <p>Ainda não tem uma conta? Crie a sua agora.</p>
            </div>
        </>
    );
}

export default Home;