'use client';

import { useTranslations } from "next-intl";

function ResultContainerError() {
  const t = useTranslations('resultContainerError');

  return (
    <div className="result-container__error">
      <h2 className="result-container__message">
        {t('resultContainerErrorText')}
      </h2>
    </div>
  )
}

export default ResultContainerError;