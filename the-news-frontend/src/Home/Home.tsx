// App.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoTheNews from '../image.png';
import Loader from '../Loader/Loader';

import { FaUserCircle } from "react-icons/fa";
import raio from '../raio.png'
import ImagePost1 from '../Images/image_post_id12345.png'
import ImagePost2 from '../Images/image_post_id12346.png'
import ImagePost3 from '../Images/image_post_id12347.png'
import ImagePost4 from '../Images/image_post_id12348.png'

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
                    <div className='streak__box'>
                        <h1 className='streak__number'>
                            1
                        </h1>
                        <div className='box__img__raio'>
                            <img className='img__raio' src={raio} alt="" />
                        </div>
                        
                    </div>
                    <h2>
                        Dia de leitura
                    </h2>
                </div>

                <div className='menssagem'>
                    <p>Seu primeiro dia de leitura, continue assim!!</p>
                </div>

                <p className=''>Histórico de leitura</p>
                <div className='history__opened'>

                    <div className='post__container'>
                        <div>
                            <img src={ImagePost1} className='img__post' alt="" />
                        </div>
                        <p>Feb 17, 2025</p>
                    </div>

                    <div className='post__container'>
                        <div>
                            <img src={ImagePost2} className='img__post' alt="" />
                        </div>
                        <p>Feb 17, 2025</p>
                    </div>
                    
                    <div className='post__container'>
                        <div>
                            <img src={ImagePost3} className='img__post' alt="" />
                        </div>
                        <p>Feb 17, 2025</p>
                    </div>
                    <div className='post__container'>
                        <div>
                            <img src={ImagePost4} className='img__post' alt="" />
                        </div>
                        <p>Feb 17, 2025</p>
                    </div>
                </div>
               
            </div>
        </>
    );
}

export default Home;