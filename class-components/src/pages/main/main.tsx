import './main.scss';
import Header from "../../components/Header/Header";
import ResultContainer from "../../components/ResultContainer/ResultContainer";
import { supernaturalApi } from '../../services/supernaturalApi';
import { localStorageService } from '../../services/localStorage';
import { searchKey } from '../../config/localStorage';
import Loader from '../../components/Loader/Loader';
import { useEffect, useState } from 'react';
import { apiConfig } from '../../config/api';
import PaginationControllers from '../../components/PaginationControllers/PaginationControllers';
import { useSearchParams } from 'react-router';
import DetailCard from '../../components/DetailCard/DetailCard';
import { useCharacterDetail } from '../../hooks/useCharacterDetail';

function MainPage() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectId, setSelectId] = useState<string | null>(null);
  const { openDetails, closeDetails } = useCharacterDetail();
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentQuery = searchParams.get('search') || '';

  const loadCharacters = async (page: number, query: string) => {
    setIsLoading(true);

    try {
      const data = query 
        ? await supernaturalApi.searchCharacter(query, page)
        : await supernaturalApi.fetchAllCharacters(page);

      setCharacters(data.data);

      const totalItems = query ? data.resultCount : data.count;
      const pages = Math.ceil(totalItems / apiConfig.defaultPageSize);
      setTotalPages(pages > 0 ? pages : 1);
      
      if (query) localStorageService.set(searchKey, query);
      
      setHasNext(!!data.next);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string): void => {
    const params: { page: string; search?: string } = { page: '1' };
    if (query.trim()) params.search = query.trim();
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number): void => {
    const params: { page: string; search?: string } = { page: newPage.toString() };
    if (currentQuery) params.search = currentQuery;
    setSearchParams(params);
  };

  const handleSelectId = (id: string | null) => {
    setSelectId(id);
    if (id) {
      openDetails(id)
    } else {
      closeDetails();
    }
  }

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && selectId) {
      handleSelectId(null);
    }
  }

  useEffect(() => {
    loadCharacters(currentPage, currentQuery);
  }, [currentPage, currentQuery]);

  useEffect(() => {
    const lastSearch = localStorageService.get(searchKey);
    const hasUrlParams = searchParams.toString() !== '';
    
    if (!hasUrlParams) {
      const params: { page: string; search?: string } = { page: '1' };
      if (lastSearch) {
        params.search = lastSearch;
      }
      setSearchParams(params);
    }
  }, []);

  useEffect(() => {

  }, [selectId])

  return (
    <div className="main">
      <Header onSearch={handleSearch} />
      {isLoading ? (
        <Loader />
      ) : (
        <div className='main__split-view'>
          <div className={`main__left ${selectId ? 'with-details' : ''}`} onClick={handleOutsideClick}>
            <ResultContainer characters={characters} setId={setSelectId} />
            <PaginationControllers
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={handlePageChange}
              hasNext={hasNext}
            />
          </div>
          {
            selectId && (
              <div className='main__right'>
                <DetailCard id={selectId} handleSetCard={handleSelectId} />
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}

export default MainPage;