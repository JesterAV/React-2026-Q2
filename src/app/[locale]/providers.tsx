'use client';

import { Provider } from "react-redux";
import { store } from "../../store/store";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "../../context/ThemeContext";

export function Providers({
  children,
  messages,
  locale
}:{
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </Provider>
  )
}