import './404.scss';
import logo from '../../../public/supernatural_logo.png';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router';
import { appRoutes } from '../../router/routes';
import Image from 'next/image';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='not-found-page'>
      <Image src={logo} alt='supernatural logo' width={170} height={170} />

      <h1 className='not-found-page__title'>404</h1>
      <p className='not-found-page'>{'Ooops! Page not found :('}</p>

      <Button text='Go to home' type='button' onClick={() => navigate(appRoutes.main)} />
    </div>
  )
}

export default NotFoundPage;