import {NextIntlClientProvider} from 'next-intl';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>class-components</title>
      </head>
      <body>
        <NextIntlClientProvider>
          <div id="root">
            {children}
          </div>
        </NextIntlClientProvider>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  )
}