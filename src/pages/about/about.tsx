import './about.scss';
import logo from '../../../public/supernatural_logo.png';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router';
import { appRoutes } from '../../router/routes';
import Image from 'next/image';

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className='about-page'>
      <Image src={logo} alt='supernatural logo' width={200} height={200} />
      <p className='about-page__text'>This application offers a search engine in which you can find characters from the Supernatural series.</p>
      <p className='about-page__text'>Author: <a href='https://github.com/JesterAV' target='_blank' className='about-page__link'>JesterAV</a></p>
      <Button text='Go to main page' type='button' onClick={() => navigate(appRoutes.main)} />
    </div>
  )
}

export default AboutPage;