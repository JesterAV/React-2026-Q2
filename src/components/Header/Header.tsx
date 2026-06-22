'use client';

import './Header.scss';
import logo from '../../../public/supernatural_logo.png';
import Image from 'next/image';
import Button from "../Button/Button";
import { localStorageService } from '../../services/localStorage';
import { searchKey } from '../../config/localStorage';
import { useState, useEffect } from 'react';
import { appRoutes } from '../../router/routes';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import { useRouter } from '../../i18n/navigation';
import LangSwitcher from '../LangSwitcher/LangSwitcher';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  onSearch: (query: string) => void;
  onClearCache: () => void;
}

function Header({ onSearch, onClearCache }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const t = useTranslations('header');

  useEffect(() => {
    setSearchValue(localStorageService.get(searchKey));
  }, []);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const query = searchValue.trim();
    const lastQuery = localStorageService.get(searchKey);
    localStorageService.set(searchKey, query);
    if (query !== lastQuery) onSearch(query);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
  };

  if (hasError) throw new Error('Test Error');

  return (
    <header className="header">
      <div className='header__logo-and-title'>
        <Image src={logo} alt='supernatural logo' width={100} height={100} />
        <h2 className='header__title'>Hunterpedia</h2>
      </div>
      <form className='header__form' onSubmit={handleSubmit}>
        <input className="header__input" value={searchValue} onChange={handleChange} />
        <Button text={t('searchButton')} type='submit' />
      </form>
      <Button text={t('testButton')} type='button' onClick={() => setHasError(true)} />
      <Button text={t('aboutButton')} type='button' onClick={() => router.push(appRoutes.about)} />
      <Button text={t('clearCache')} type='button' onClick={() => onClearCache()} />
      <ThemeSwitcher />
      <LangSwitcher />
    </header>
  );
}

export default Header;