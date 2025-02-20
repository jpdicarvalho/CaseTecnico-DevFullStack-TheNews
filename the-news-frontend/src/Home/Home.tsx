// App.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoTheNews from '../image.png';
import Loader from '../Loader/Loader';
import { CiLogout } from "react-icons/ci";
import { FcFlashOn } from "react-icons/fc";

import { FaUserCircle } from "react-icons/fa";
import raio from '../raio.png'
import './Home.css';

function Home() {
    const navigate = useNavigate();

    const[isLoading, setIsLoading] = useState (false);
    const[message, setMessage] = useState (false);

    
    return (
        <>
            <div className='header__home'>
                <FaUserCircle className='icons__headers'/>
            </div>

            <div className='main__home center'>
                
                <div className='img__box center'>
                    <img className='img__logo' src={LogoTheNews} alt="" />
                </div>

                <div className='text__container'>
                    <p className='name__plataform__home'>the news</p>
                </div>

                <div className='streak__container'>
                    <div>
                        <h1>
                            1
                        </h1>
                        <h2>
                            Dia de leitura
                        </h2>
                    </div>
                    <div className='box__img__raio'>
                        <img className='img__raio' src={raio} alt="" />
                    </div>

                </div>

                <div className='menssagem'>
                    <p>Seu primeiro dia de leitura, continue assim!!</p>
                </div>

                <div className='history__'>
                    <p>Histório</p>
                </div>
               
            </div>
        </>
    );
}

export default Home;