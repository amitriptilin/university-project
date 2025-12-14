import './header.css'

import login from 'D:/project/university-project/src/utils/icons/login.svg'

const Header = () => {
    return (
        <div className="wrapper">
            <div className='header'>
                <div className="btn-wrapper-first">
                    <button className="attendance" type="button">Посещаемость занятий</button>
                    <button className="avg" type="button">Средний балл</button>
                </div>
                <div className="btn-wrapper-second">
                    <button href="#" className="login">
                        <img className='login-img' src={login} alt="login"></img>
                        Вход в аккаунт
                    </button>
                </div>
            </div>
        </div>
    ) 
};

export default Header;

