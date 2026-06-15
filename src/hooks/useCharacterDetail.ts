import { useSearchParams } from "react-router";

export function useCharacterDetail() {
  const [searchParams, setSearchParams] = useSearchParams();

  const openDetails = (id: string): void => {
    const params = new URLSearchParams(searchParams);
    params.set('details', id);
    setSearchParams(params);
  }

  const closeDetails = (): void => {
    const params = new URLSearchParams(searchParams);
    params.delete('details');
    setSearchParams(params);
  }

  return {
    openDetails,
    closeDetails
  }
}