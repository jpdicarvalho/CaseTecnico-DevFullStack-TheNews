// App.tsx
import './Login.css';
import LogoTheNews from './image.png';

function Login() {
  return (
    <div className="container center">
        <div className='main center'>
            <div className='img__box center'>
                    <img className='img__logo' src={LogoTheNews} alt="" />
                    
            </div>

            <div className='text__container'>
                <p className='name__plataform'>The News</p>
                <p className='text__span'>Tudo que você precisa saber a um clique de você. Faça login e confira!</p>
                
            </div>

            <div className="input-container">
                <input placeholder="Entre com seu e-mail" type="email" required/>
                <button className="invite-btn" type="button">
                    Entrar
                </button>
            </div>
        </div>

        <div className='footer'>
            <p>Ainda não tem uma conta? Crie a sua agora.</p>
        </div>
    </div>
  );
}

export default Login;
