import './about.scss';
import logo from '../../assets/supernatural_logo.png';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router';
import { appRoutes } from '../../router/routes';

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className='about-page'>
      <img src={logo} alt='supernatural logo' className='about-page__image' />
      <p className='about-page__text'>This application offers a search engine in which you can find characters from the Supernatural series.</p>
      <p className='about-page__text'>Author: <a href='https://github.com/JesterAV' target='_blank' className='about-page__link'>JesterAV</a></p>
      <Button text='Go to main page' type='button' onClick={() => navigate(appRoutes.main)} />
    </div>
  )
}

export default AboutPage;