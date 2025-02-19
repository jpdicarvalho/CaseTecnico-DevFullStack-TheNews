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

            <div className='tittle__login'>
                <h3 className=''>The News</h3>
                <p className=''>Faça login e confira as melhores noticias...</p>
            </div>

            <div className="input-container">
                <input placeholder="Email Address" type="email" required/>
                <button className="invite-btn" type="button">
                    Entrar
                </button>
            </div>
        </div>

        <div className='footer'>
            <p>Não tem uma conta? Cadastrar</p>
        </div>
    </div>
  );
}

export default Login;
