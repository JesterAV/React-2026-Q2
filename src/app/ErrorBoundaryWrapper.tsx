'use client';

import { useTranslations } from "next-intl";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

export default function ErrorBoundaryWrapper({children}: {children: React.ReactNode}) {
  const t = useTranslations('errorBoundary');

  return (
    <ErrorBoundary
      title={t('errorBoundaryText')}
      buttonText={t('errorBoundaryButton')}>
        {children}
    </ErrorBoundary>
  )
}