import Header from '../Components/Header';
import './global.css';
import {Poppins,Roboto} from "next/font/google"
import Providers from './providers';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Khreedo India',
  description: 'Khreedo India',
}
const roboto=Roboto({
  subsets:["latin"],
  weight:["100","200","300","400","500","600","700","800","900"],
  variable:"--font-roboto"

  
})
const poppins=Poppins({
  subsets:["latin"],
  weight:["100","200","300","400","500","600","700","800","900"],
  variable:"--font-poppins"

  
})



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <Providers>
 <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 2000,
            style: {
              border: '1px solid #006400',
              padding: '12px 16px',
              color: '#fff',
              background: '#228B22',
              fontSize: '15px',
              fontWeight: '500',
            },
            iconTheme: {
              primary: '#006400',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            style: {
              border: '1px solid #ef4444',
              padding: '12px 16px',
              color: '#1f2937',
              background: '#fee2e2',
              fontSize: '15px',
              fontWeight: '500',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
        
        <Header/>
        {children}
        </Providers>
        </body>
    </html>
  )
}
