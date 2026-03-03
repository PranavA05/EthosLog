import "./globals.css";
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav-container ">
          <div className=" nav-inner">
            <Link href=" /" className="brand-logo">ethoslog</Link>        
            <div className="nav-links-wrapper">
              <Link href="/library " className="styled-link">Library</Link>
              <Link href=" /lab" className="styled-link">Insight Lab</Link>
              <Link href="/reflection" className="styled-link">Board</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}