import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 10) {
          navRef.current.style.boxShadow = '0 6px 0 0 rgba(24, 43, 94, 0.12)';
        } else {
          navRef.current.style.boxShadow = 'none';
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavAnchor = (e, hashId) => {
    if (isHomePage) {
      e.preventDefault();
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (isMobileOpen) {
      closeMobileMenu();
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <style>{`
        .llc-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          border-bottom: 3px solid var(--navy);
          transition: all .25s ease;
        }
        .llc-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: height .25s ease;
        }
        
        /* Standard size on Homepage (80px height) */
        .llc-nav.nav-standard .llc-nav-inner {
          height: 80px;
        }
        .llc-nav.nav-standard .llc-brand-mark {
          width: 3.5rem;
          height: 3.5rem;
        }
        .llc-nav.nav-standard .llc-brand-name {
          font-size: 1.125rem;
        }
        .llc-nav.nav-standard .llc-brand-sub {
          font-size: 11px;
        }
        .llc-nav.nav-standard .llc-nav-links {
          gap: 2rem;
        }
        .llc-nav.nav-standard .llc-nav-link {
          font-size: .875rem;
        }
        .llc-nav.nav-standard .llc-nav-toggle {
          width: 3rem;
          height: 3rem;
        }

        /* Compact shrunk size on Inner / Subsequent Pages (60px height) */
        .llc-nav.nav-compact .llc-nav-inner {
          height: 60px;
        }
        .llc-nav.nav-compact .llc-brand-mark {
          width: 2.35rem;
          height: 2.35rem;
        }
        .llc-nav.nav-compact .llc-brand-name {
          font-size: 0.95rem;
        }
        .llc-nav.nav-compact .llc-brand-sub {
          font-size: 9.5px;
        }
        .llc-nav.nav-compact .llc-nav-links {
          gap: 1.5rem;
        }
        .llc-nav.nav-compact .llc-nav-link {
          font-size: .8125rem;
        }
        .llc-nav.nav-compact .llc-nav-toggle {
          width: 2.25rem;
          height: 2.25rem;
        }
        .llc-nav.nav-compact .btn-sm-solid {
          padding: 0.45rem 1rem;
          font-size: 0.75rem;
        }
        .llc-nav.nav-compact .btn-ghost {
          padding: 0.45rem 0.85rem;
          font-size: 0.75rem;
        }

        .llc-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .llc-brand-mark {
          object-fit: contain;
          border: 2px solid var(--navy);
          background: #fff;
          transition: width .25s ease, height .25s ease;
        }
        .llc-brand-text {
          display: none;
          flex-direction: column;
          line-height: 1.1;
        }
        @media(min-width: 640px) {
          .llc-brand-text { display: flex; }
        }
        .llc-brand-name {
          font-weight: 900;
          letter-spacing: -.03em;
          text-transform: uppercase;
          color: var(--navy);
          transition: font-size .25s ease;
        }
        .llc-brand-sub {
          font-weight: 700;
          letter-spacing: .1em;
          color: var(--red);
          text-transform: uppercase;
          transition: font-size .25s ease;
        }
        .llc-nav-links {
          display: none;
          align-items: center;
          transition: gap .25s ease;
        }
        @media(min-width: 1024px) {
          .llc-nav-links { display: flex; }
        }
        .llc-nav-link {
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .05em;
          color: var(--navy);
          transition: color .2s, font-size .25s ease;
          position: relative;
        }
        .llc-nav-link:hover, .llc-nav-link.is-active {
          color: var(--red);
        }
        .llc-nav-link.is-active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--red);
        }
        .llc-nav-actions {
          display: none;
          align-items: center;
          gap: 1.25rem;
        }
        @media(min-width: 640px) {
          .llc-nav-actions { display: flex; }
        }
        .llc-nav-toggle {
          display: grid;
          place-items: center;
          border: 2px solid var(--navy);
          background: transparent;
          transition: all .25s ease;
        }
        @media(min-width: 1024px) {
          .llc-nav-toggle { display: none; }
        }
        .llc-burger {
          position: relative;
          display: block;
          width: 1.35rem;
          height: 0.9rem;
        }
        .llc-burger span {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2.5px;
          background: var(--navy);
          transition: all .3s;
        }
        .llc-burger span:nth-child(1) { top: 0; }
        .llc-burger span:nth-child(2) { top: 50%; transform: translateY(-50%); }
        .llc-burger span:nth-child(3) { top: 100%; transform: translateY(-100%); }
        .llc-nav-toggle.is-open .llc-burger span:nth-child(1) { top: 50%; transform: translateY(-50%) rotate(45deg); }
        .llc-nav-toggle.is-open .llc-burger span:nth-child(2) { opacity: 0; }
        .llc-nav-toggle.is-open .llc-burger span:nth-child(3) { top: 50%; transform: translateY(-50%) rotate(-45deg); }

        .llc-mobile-sheet {
          display: grid;
          grid-template-rows: 0fr;
          overflow: hidden;
          background: var(--bg-alt);
          border-bottom: 0 solid var(--navy);
          transition: grid-template-rows .3s ease, border-bottom .3s ease;
        }
        .llc-mobile-sheet.open {
          grid-template-rows: 1fr;
          border-bottom: 3px solid var(--navy);
        }
        .llc-mobile-sheet > div { overflow: hidden; }
        @media(min-width: 1024px) {
          .llc-mobile-sheet { display: none; }
        }
        .llc-mobile-inner { padding: 1.25rem 1.5rem; }
        .llc-mobile-link {
          display: block;
          padding: 0.85rem 0;
          font-size: 1rem;
          font-weight: 800;
          text-transform: uppercase;
          border-bottom: 1px solid #E2E8F0;
          color: var(--navy);
        }
        .llc-mobile-cta {
          display: flex;
          gap: 1rem;
          margin-top: 1.25rem;
        }
        .llc-mobile-cta a, .llc-mobile-cta button {
          flex: 1;
          padding: 0.85rem;
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          border: 2px solid var(--navy);
        }
        .llc-mobile-cta .outline { color: var(--navy); background: #fff; }
        .llc-mobile-cta .solid { background: var(--navy); color: #fff; }
      `}</style>

      <header className={`llc-nav no-print ${isHomePage ? 'nav-standard' : 'nav-compact'}`} ref={navRef}>
        <div className="llc-container llc-nav-inner">
          <Link to="/" className="llc-brand">
            <img
              src="https://llc-edu.com/wp-content/uploads/2025/06/CAMPUS-2-150x150.png"
              alt="LLC Logo"
              className="llc-brand-mark"
            />
            <span className="llc-brand-text">
              <span className="llc-brand-name">Language Learning</span>
              <span className="llc-brand-sub">Kalmunai · LK</span>
            </span>
          </Link>

          <nav className="llc-nav-links">
            <Link
              to="/courses"
              className={`llc-nav-link ${isActive('/courses') ? 'is-active' : ''}`}
            >
              Courses
            </Link>
            <a
              href={isHomePage ? '#status' : '/#status'}
              onClick={(e) => handleNavAnchor(e, 'status')}
              className="llc-nav-link"
            >
              Process
            </a>
            <a
              href={isHomePage ? '#faq' : '/#faq'}
              onClick={(e) => handleNavAnchor(e, 'faq')}
              className="llc-nav-link"
            >
              FAQ
            </a>
            <Link
              to="/register"
              className={`llc-nav-link ${isActive('/register') ? 'is-active' : ''}`}
            >
              Apply Online
            </Link>
            {isAuthenticated && !isAdmin && (
              <Link
                to="/dashboard"
                className={`llc-nav-link ${isActive('/dashboard') ? 'is-active' : ''}`}
              >
                My Dashboard
              </Link>
            )}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`llc-nav-link ${isActive('/admin') ? 'is-active' : ''}`}
              >
                Admin Console
              </Link>
            )}
          </nav>

          <div className="llc-nav-actions">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className={`${isHomePage ? 'text-xs' : 'text-[11px]'} font-black uppercase text-[#182B5E] max-w-[130px] truncate`}>
                    {user?.full_name || user?.email}
                  </span>
                  <span className={`${isHomePage ? 'text-[10px]' : 'text-[9px]'} font-bold text-[#D9381E] uppercase`}>
                    {user?.role === 'admin' ? 'Administrator' : 'Student'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-sm-solid"
                  id="navbar-logout-btn"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Sign in
                </Link>
                <Link to="/register" className="btn-sm-solid">
                  Apply Now
                </Link>
              </>
            )}
          </div>

          <button
            className={`llc-nav-toggle ${isMobileOpen ? 'is-open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
            id="navbar-toggle-btn"
          >
            <span className="llc-burger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        <div className={`llc-mobile-sheet ${isMobileOpen ? 'open' : ''}`}>
          <div>
            <div className="llc-mobile-inner">
              <Link to="/courses" className="llc-mobile-link" onClick={closeMobileMenu}>
                Courses
              </Link>
              <a
                href={isHomePage ? '#status' : '/#status'}
                className="llc-mobile-link"
                onClick={(e) => handleNavAnchor(e, 'status')}
              >
                Process
              </a>
              <a
                href={isHomePage ? '#faq' : '/#faq'}
                className="llc-mobile-link"
                onClick={(e) => handleNavAnchor(e, 'faq')}
              >
                FAQ
              </a>
              <Link to="/register" className="llc-mobile-link" onClick={closeMobileMenu}>
                Apply Online
              </Link>
              {isAuthenticated && !isAdmin && (
                <Link to="/dashboard" className="llc-mobile-link" onClick={closeMobileMenu}>
                  My Dashboard
                </Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link to="/admin" className="llc-mobile-link" onClick={closeMobileMenu}>
                  Admin Console
                </Link>
              )}
              <div className="llc-mobile-cta">
                {isAuthenticated ? (
                  <button
                    className="solid"
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                  >
                    Sign Out ({user?.role})
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="outline" onClick={closeMobileMenu}>
                      Sign in
                    </Link>
                    <Link to="/register" className="solid" onClick={closeMobileMenu}>
                      Apply
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
