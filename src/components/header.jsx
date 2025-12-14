import { Link, useLocation } from 'react-router-dom';
import './header.css';
import login from 'D:/project/university-project/src/utils/icons/login.svg';

const Header = () => {
    const location = useLocation();
    
    return (
        <div className="wrapper">
            <div className='header'>
                <div className="btn-wrapper-first">
                    <Link 
                        to="/grades" 
                        className={`attendance ${location.pathname === '/grades' || location.pathname === '/' ? 'active' : ''}`}
                    >
                        Журнал оценок
                    </Link>
                    <Link 
                        to="/performance" 
                        className={`avg ${location.pathname === '/performance' ? 'active' : ''}`}
                    >
                        Успеваемость
                    </Link>
                </div>
                <div className="btn-wrapper-second">
                    <Link to="/login" className="login">
                        <img className='login-img' src={login} alt="login" />
                        <span>Вход в аккаунт</span>
                    </Link>
                </div>
            </div>
        </div>
    ) 
};

export default Header;