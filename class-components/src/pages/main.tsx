import './main.scss';

import { Component } from "react";
import Header from "../components/Header/Header";
import ResultContainer from "../components/ResultContainer/ResultContainer";
import { supernaturalApi } from '../services/supernaturalApi';
import type { Character } from '../types/characters';
import { localStorageService } from '../services/localStorage';
import { searchKey } from '../config/localStorage';

class MainPage extends Component {
  state: {characters: Character[]} = {
    characters: []
  }

  handleSearch = async (query: string): Promise<void> => {
    try {
      const data = await supernaturalApi.searchCharacter(query.trim());
      this.setState({characters: data.data});
    } catch {

    }
  }

  componentDidMount = async (): Promise<void> => {
    const lastSearch = localStorageService.get(searchKey);
    if (lastSearch) {
      this.handleSearch(lastSearch);
    } else {
      try {
        const data = await supernaturalApi.fetchAllCharacters();
        this.setState({characters: data.data});
      } catch {

      }
    }
  }

  render() {
    return (
      <div className="main">
        <Header onSearch={this.handleSearch} />
        <ResultContainer characters={this.state.characters} />
      </div>
    )
  }
}

export default MainPage;