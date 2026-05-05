import './Header.scss';
import logo from '../../assets/supernatural_logo.png';

import { Component } from "react";
import Button from "../Button/Button";
import { localStorageService } from '../../services/localStorage';
import { searchKey } from '../../config/localStorage';

interface HeaderProps {
  onSearch: (query: string) => void;
}

class Header extends Component<HeaderProps> {
  state = {
    searchValue: localStorageService.get(searchKey)
  }

  handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const query = this.state.searchValue.trim();
    const lastQuery = localStorageService.get(searchKey);
    localStorageService.set(searchKey, query);
    
    if (query !== lastQuery) this.props.onSearch(query);
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchValue: event.target.value });
  }

  render() {
    return(
      <header className="header">
        <div className='header__logo-and-title'>
          <img className='header__logo' src={logo} alt='supernatural logo' />
          <h2 className='header__title'>Hunterpedia</h2>
        </div>
        <form className='header__form' onSubmit={this.handleSubmit}>
          <input className="header__input" value={this.state.searchValue} onChange={this.handleChange} />
          <Button text='Search' type='submit'/>
        </form>
        <Button text='Test Error' type='button' />
      </header>
    )
  }
}

export default Header;