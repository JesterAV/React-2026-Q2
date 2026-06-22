import { Suspense } from 'react';
import Loader from '../../components/Loader/Loader';
import MainPage from '../../components/MainPageContent/MainPageContent';
import ErrorBoundaryWrapper from '../ErrorBoundaryWrapper';

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundaryWrapper>
        <MainPage />
      </ErrorBoundaryWrapper>
    </Suspense>
  );
}
