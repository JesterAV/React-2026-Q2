'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from '../i18n/navigation';

export function useCharacterDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const openDetails = (id: string): void => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('detailId', id);
    router.push(`?${params.toString()}`);
  };

  const closeDetails = (): void => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.delete('detailId');
    router.push(`?${params.toString()}`);
  };

  return { openDetails, closeDetails };
}