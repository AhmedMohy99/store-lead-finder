export const metadata = {
  title: 'Store Lead Finder',
  description: 'Find stores and brands that do not have a website and export them to Excel.'
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
