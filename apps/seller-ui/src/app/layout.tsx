import Providers from '../providers';
import './global.css';

export const metadata = {
  title: 'Khreedo India Seller ',
  description: 'This is a Seller workspace of Khreedo India',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
 {children}
        </Providers>
       
        
        </body>
    </html>
  )
}
