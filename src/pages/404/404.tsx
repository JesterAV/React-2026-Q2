import './404.scss';
import logo from '../../assets/supernatural_logo.png';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router';
import { appRoutes } from '../../router/routes';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='not-found-page'>
      <img src={logo} alt='supernatural logo' className='not-found-page__image' />

      <h1 className='not-found-page__title'>404</h1>
      <p className='not-found-page'>{'Ooops! Page not found :('}</p>

      <Button text='Go to home' type='button' onClick={() => navigate(appRoutes.main)} />
    </div>
  )
}

export default NotFoundPage;