import './Header.scss';
import logo from '../../assets/supernatural_logo.png';

import Button from "../Button/Button";
import { localStorageService } from '../../services/localStorage';
import { searchKey } from '../../config/localStorage';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { appRoutes } from '../../router/routes';

interface HeaderProps {
  onSearch: (query: string) => void;
}

function Header({ onSearch }: HeaderProps) {
  const [searchValue, setSearchValue] = useState(localStorageService.get(searchKey));
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const query = searchValue.trim();
    const lastQuery = localStorageService.get(searchKey);
    localStorageService.set(searchKey, query);
    
    if (query !== lastQuery) onSearch(query);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
  }

  if (hasError) throw new Error('Test Error');
  
  return(
    <header className="header">
      <div className='header__logo-and-title'>
        <img className='header__logo' src={logo} alt='supernatural logo' />
        <h2 className='header__title'>Hunterpedia</h2>
      </div>
      <form className='header__form' onSubmit={handleSubmit}>
        <input className="header__input" value={searchValue} onChange={handleChange} />
        <Button text='Search' type='submit'/>
      </form>
      <Button text='Test Error' type='button' onClick={() => setHasError(true)} />
      <Button text='About' type='button' onClick={() => navigate(appRoutes.about)} />
    </header>
  )
}

export default Header;