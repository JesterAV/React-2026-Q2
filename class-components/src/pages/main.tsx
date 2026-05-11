import './main.scss';

import { Component } from "react";
import Header from "../components/Header/Header";
import ResultContainer from "../components/ResultContainer/ResultContainer";
import { supernaturalApi } from '../services/supernaturalApi';
import type { Character } from '../types/characters';
import { localStorageService } from '../services/localStorage';
import { searchKey } from '../config/localStorage';
import Loader from '../components/Loader/Loader';

interface MainPageState {
  characters: Character[],
  isLoading: boolean
}

class MainPage extends Component {
  state: MainPageState = {
    characters: [],
    isLoading: false
  }

  handleSearch = async (query: string): Promise<void> => {
    this.setState({ isLoading: true });

    try {
      const data = await supernaturalApi.searchCharacter(query.trim());
      this.setState({characters: data.data});
    } catch(error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount = async (): Promise<void> => {
    const lastSearch = localStorageService.get(searchKey);
    if (lastSearch) {
      this.handleSearch(lastSearch);
    } else {
      this.setState({ isLoading: true });
      try {
        const data = await supernaturalApi.fetchAllCharacters();
        this.setState({characters: data.data});
      } catch(error) {
        console.error(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  render() {
    return (
      <div className="main">
        <Header onSearch={this.handleSearch} />
        {
          this.state.isLoading ? <Loader /> : <ResultContainer characters={this.state.characters} />
        }
      </div>
    )
  }
}

export default MainPage;