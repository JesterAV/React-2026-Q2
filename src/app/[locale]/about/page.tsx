import './about.scss';

import logo from '../../../../public/supernatural_logo.png';
import Image from 'next/image';
import { Link } from '../../../i18n/navigation';
import { appRoutes } from '../../../router/routes';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('aboutPage')

  return (
    <div className='about-page'>
      <Image src={logo} alt='supernatural logo' width={200} height={200} />
      <p className='about-page__text'>{t('aboutText')}</p>
      <p className='about-page__text'>{t('aboutAuthor')}<a href='https://github.com/JesterAV' target='_blank' className='about-page__link'>JesterAV</a></p>
      <Link href={appRoutes.main} className='button'>
        {t('buttonText')}
      </Link>
    </div>
  )
}