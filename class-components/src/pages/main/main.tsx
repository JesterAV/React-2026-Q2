import './main.scss';
import Header from "../../components/Header/Header";
import ResultContainer from "../../components/ResultContainer/ResultContainer";
import { localStorageService } from '../../services/localStorage';
import { searchKey } from '../../config/localStorage';
import Loader from '../../components/Loader/Loader';
import { useEffect, useState } from 'react';
import PaginationControllers from '../../components/PaginationControllers/PaginationControllers';
import { useSearchParams } from 'react-router';
import DetailCard from '../../components/DetailCard/DetailCard';
import { useCharacterDetail } from '../../hooks/useCharacterDetail';
import SelectedItems from '../../components/SelectedItems/SelectedItems';

import { useGetAllCharactersQuery, useSearchCharactersQuery } from '../../store/api/supernaturalApi';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectId, setSelectId] = useState<string | null>(null);
  const { openDetails, closeDetails } = useCharacterDetail();
  const [error, setError] = useState<string | null>(null);
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentQuery = searchParams.get('search') || '';

  const getAllQuery = useGetAllCharactersQuery(currentPage, {
    skip: !!currentQuery
  });

  const searchQuery = useSearchCharactersQuery(
    {query: currentQuery, page: currentPage},
    {skip: !currentQuery}
  );

  const { data, isLoading, error: apiError, refetch } = currentQuery ? searchQuery : getAllQuery;

  useEffect(() => {
    if (apiError) setError('Failed to load characters');
  })

  const characters = data?.data || [];
  const totalItems = currentQuery ? data?.resultCount : data?.count;
  const totalPages = Math.ceil((totalItems || 0) / 20);
  const hasNext = !!data?.next;

  useEffect(() => {
    if (currentQuery) {
      localStorageService.set(searchKey, currentQuery);
    }
  }, [currentQuery]);

  useEffect(() => {
    const lastSearch = localStorageService.get(searchKey);
    const hasUrlParams = searchParams.toString() !== '';
    
    if (!hasUrlParams && lastSearch) {
      setSearchParams({ page: '1', search: lastSearch });
    }
  }, []);

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

  return (
    <div className="main">
      <Header onSearch={handleSearch} onClearCache={refetch} />
      <SelectedItems />
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
      {
        error && (
          <ErrorMessage message={error} onClose={() => setError(null)} />
        )
      }
    </div>
  );
}

export default MainPage;