import React, { useState } from 'react';
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] });

const Hamburger = ({ menuOpen }) => (
  <div>
    <div className={`hamburger-bar bar1 ${menuOpen ? 'open' : ''}`} />
    <div className={`hamburger-bar bar2 ${menuOpen ? 'open' : ''}`} />
    <div className={`hamburger-bar bar3 ${menuOpen ? 'open' : ''}`} />
  </div>
);

export const MenuItems = () => (
  <ul className="nav-items">
    <a href="/">
      <li className={`${inter.className} nav-item`}>
        Home
      </li>
    </a>
    <a href="/about">
      <li className={`${inter.className} nav-item`}>
        About
      </li>
    </a>
    <a href="/danny-maziad-resume.pdf" target="_blank" rel="noopener noreferrer">
      <li className={`${inter.className} nav-item`}>
      Resume
      </li>
    </a>
    <a href="https://github.com/dmaziad" target="_blank" rel="noopener noreferrer">
      <li className={`${inter.className} nav-item`}>
      GitHub
      </li>
    </a>
    <a href="https://www.linkedin.com/in/dmaziad" target="_blank" rel="noopener noreferrer">
      <li className={`${inter.className} nav-item`}>
        LinkedIn
      </li>
    </a>
  </ul>
);

const Menu = ({isOpen}) => (
  <div className={`menu ${isOpen ? 'open' : ''}`}>
    <MenuItems loc='menu' />
  </div>
);

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
  <>
    <nav style={{width: '100%'}}>
      <div className="menu-button">
        <button className={inter.className} onClick={() => setMenuOpen(!menuOpen)}>
          {/* {menuOpen ? ' close' : 'menu'} */}
          <Hamburger menuOpen={menuOpen} />
        </button>
      </div>
      <MenuItems />
    </nav>
    <Menu isOpen={menuOpen} />
  </>
  );
}

export default NavBar;