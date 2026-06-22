'use client'

import './404.scss';
import logo from '../../../public/supernatural_logo.png';
import Button from '../Button/Button';
import { appRoutes } from '../../router/routes';
import Image from 'next/image';
import { useRouter } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';

function NotFoundPage() {
  const router = useRouter();
  const t = useTranslations('notFoundPage');

  return (
    <div className='not-found-page'>
      <Image src={logo} alt='supernatural logo' width={170} height={170} />

      <h1 className='not-found-page__title'>404</h1>
      <p className='not-found-page__text'>{t('notFoundPageText')}</p>

      <Button text={t('notFoundPageTextButton')} type='button' onClick={() => router.push(appRoutes.main)} />
    </div>
  )
}

export default NotFoundPage;