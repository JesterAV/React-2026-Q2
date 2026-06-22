'use client'

import './main.scss';
import Header from "../../components/Header/Header";
import ResultContainer from "../../components/ResultContainer/ResultContainer";
import { localStorageService } from '../../services/localStorage';
import { searchKey } from '../../config/localStorage';
import Loader from '../../components/Loader/Loader';
import { useEffect, useState } from 'react';
import PaginationControllers from '../../components/PaginationControllers/PaginationControllers';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '../../i18n/navigation';
import DetailCard from '../../components/DetailCard/DetailCard';
import { useCharacterDetail } from '../../hooks/useCharacterDetail';
import SelectedItems from '../../components/SelectedItems/SelectedItems';

import {
  useGetAllCharactersQuery,
  useSearchCharactersQuery
} from '../../store/api/supernaturalApi';

import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

export default function MainPage() {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const router = useRouter();

  const selectId = searchParams.get('detailId') ?? null;
  const { openDetails, closeDetails } = useCharacterDetail();
  const [error, setError] = useState<string | null>(null);

  const currentPage = Number(searchParams.get('page') ?? '1');
  const currentQuery = searchParams.get('search') ?? '';

  const getAllQuery = useGetAllCharactersQuery(currentPage, {
    skip: !!currentQuery
  });

  const searchQuery = useSearchCharactersQuery(
    { query: currentQuery, page: currentPage },
    { skip: !currentQuery }
  );

  const { data, isLoading, error: apiError, refetch } =
    currentQuery ? searchQuery : getAllQuery;

  useEffect(() => {
    if (apiError) setError('Failed to load characters');
  }, [apiError]);

  const characters = data?.data ?? [];
  const totalItems = currentQuery ? data?.resultCount ?? 0 : data?.count ?? 0;
  const totalPages = Math.ceil(totalItems / 20);
  const hasNext = !!data?.next;

  useEffect(() => {
    if (currentQuery) localStorageService.set(searchKey, currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const lastSearch = localStorageService.get(searchKey);
    const hasUrlParams = searchParams.toString() !== '';
    if (!hasUrlParams && lastSearch) {
      router.replace(`?page=1&search=${lastSearch}`);
    }
  }, []);

  const handleSearch = (query: string): void => {
    const params = new URLSearchParams();
    params.set('page', '1');
    if (query.trim()) params.set('search', query.trim());
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number): void => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    if (currentQuery) params.set('search', currentQuery);
    router.push(`?${params.toString()}`);
  };

  const handleSelectId = (id: string | null) => {
    if (id) {
      openDetails(id);
    } else {
      closeDetails();
    }
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && selectId) {
      handleSelectId(null);
    }
  };

  return (
    <div className="main">
      <Header onSearch={handleSearch} onClearCache={refetch} />
      <SelectedItems />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="main__split-view">
          <div
            className={`main__left ${selectId ? 'with-details' : ''}`}
            onClick={handleOutsideClick}
          >
            <ResultContainer
              characters={characters}
              setId={handleSelectId}
            />
            <PaginationControllers
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={handlePageChange}
              hasNext={hasNext}
            />
          </div>
          {selectId && (
            <div className="main__right">
              <DetailCard
                id={selectId}
                handleSetCard={handleSelectId}
              />
            </div>
          )}
        </div>
      )}
      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}