'use client'

import Button from "../Button/Button";
import { useLocale } from "next-intl"
import { useRouter, usePathname } from "../../i18n/navigation";

export default function LangSwitcher() {
  const locale = useLocale();
  const currentText = locale === 'ru' ? 'EN' : 'RU';
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = () => {
    router.replace(pathname, {
      locale: locale === 'ru' ? 'en' : 'ru'
    })
  }

  return (
    <>
      <Button text={currentText} type='button' onClick={changeLanguage} />
    </>
  )
}