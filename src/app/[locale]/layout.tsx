import '../../styles/reset.css';
import '../../styles/variables.css';
import '../../styles/globals.css';

export const dynamic = 'force-dynamic';

import { getMessages } from 'next-intl/server';
import { Providers } from './providers';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Providers messages={messages} locale={locale}>
          <div id="root">{children}</div>
        </Providers>
      </body>
    </html>
  );
}