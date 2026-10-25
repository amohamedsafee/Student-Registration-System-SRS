import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import StatusBadge from '../ui/StatusBadge';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();

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
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .llc-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }
        .llc-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .llc-brand-mark {
          width: 3.5rem;
          height: 3.5rem;
          object-fit: contain;
          border: 2px solid var(--navy);
          background: #fff;
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
          font-size: 1.125rem;
          font-weight: 900;
          letter-spacing: -.03em;
          text-transform: uppercase;
          color: var(--navy);
        }
        .llc-brand-sub {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          color: var(--red);
          text-transform: uppercase;
        }
        .llc-nav-links {
          display: none;
          align-items: center;
          gap: 2rem;
        }
        @media(min-width: 1024px) {
          .llc-nav-links { display: flex; }
        }
        .llc-nav-link {
          font-size: .875rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .05em;
          color: var(--navy);
          transition: color .2s;
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
          gap: 1.5rem;
        }
        @media(min-width: 640px) {
          .llc-nav-actions { display: flex; }
        }
        .llc-nav-toggle {
          display: grid;
          place-items: center;
          width: 3rem;
          height: 3rem;
          border: 2px solid var(--navy);
          background: transparent;
        }
        @media(min-width: 1024px) {
          .llc-nav-toggle { display: none; }
        }
        .llc-burger {
          position: relative;
          display: block;
          width: 1.5rem;
          height: 1rem;
        }
        .llc-burger span {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
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
        .llc-mobile-inner { padding: 1.5rem; }
        .llc-mobile-link {
          display: block;
          padding: 1rem 0;
          font-size: 1.125rem;
          font-weight: 800;
          text-transform: uppercase;
          border-bottom: 1px solid #E2E8F0;
          color: var(--navy);
        }
        .llc-mobile-cta {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .llc-mobile-cta a, .llc-mobile-cta button {
          flex: 1;
          padding: 1rem;
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          border: 2px solid var(--navy);
        }
        .llc-mobile-cta .outline { color: var(--navy); background: #fff; }
        .llc-mobile-cta .solid { background: var(--navy); color: #fff; }
      `}</style>

      <header className="llc-nav no-print" ref={navRef}>
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
            <Link
              to="/test-ui"
              className={`llc-nav-link ${isActive('/test-ui') ? 'is-active' : ''}`}
            >
              UI Showcase
            </Link>
          </nav>

          <div className="llc-nav-actions">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black uppercase text-[#182B5E] max-w-[130px] truncate">
                    {user?.full_name || user?.email}
                  </span>
                  <span className="text-[10px] font-bold text-[#D9381E] uppercase">
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
              <Link to="/register" className="llc-mobile-link" onClick={closeMobileMenu}>
                Apply Online
              </Link>
              <Link to="/test-ui" className="llc-mobile-link" onClick={closeMobileMenu}>
                UI Showcase
              </Link>
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
