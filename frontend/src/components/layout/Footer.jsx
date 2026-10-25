import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .llc-footer {
          background: var(--navy);
          color: #fff;
          border-top: var(--border-thick);
          padding: 5rem 0 2rem;
        }
        .llc-footer-grid {
          display: grid;
          gap: 3rem;
        }
        @media(min-width: 768px) {
          .llc-footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }
        .llc-footer-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -.02em;
          margin-bottom: 1rem;
          color: #fff;
        }
        .llc-footer-brand-mark {
          width: 3.5rem;
          height: 3.5rem;
          object-fit: contain;
          border: 2px solid #fff;
          background: #fff;
        }
        .llc-footer-desc {
          color: #CBD5E1;
          max-width: 22rem;
          font-size: .9375rem;
          line-height: 1.6;
        }
        .llc-footer-title {
          font-size: .875rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: 1.5rem;
          color: var(--orange);
        }
        .llc-footer-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .llc-footer-links a {
          font-size: .9375rem;
          font-weight: 600;
          color: #fff;
          transition: color .2s;
        }
        .llc-footer-links a:hover {
          color: var(--orange);
        }
        .llc-footer-bottom {
          margin-top: 5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: .875rem;
          color: #CBD5E1;
        }
      `}</style>

      <footer className="llc-footer no-print">
        <div className="llc-container">
          <div className="llc-footer-grid">
            {/* Brand column */}
            <div>
              <div className="llc-footer-brand">
                <img
                  src="https://llc-edu.com/wp-content/uploads/2025/06/CAMPUS-2-150x150.png"
                  alt="LLC Logo"
                  className="llc-footer-brand-mark"
                />
                <span>Language Learning</span>
              </div>
              <p className="llc-footer-desc">
                Kalmunai's premier language training campus. Admissions and batch registration built for absolute reliability.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <div className="llc-footer-title">Platform</div>
              <div className="llc-footer-links">
                <Link to="/courses">Courses</Link>
                <Link to="/register">Apply Online</Link>
                <Link to="/test-ui">UI Testing Suite</Link>
                <Link to="/login">Student Sign In</Link>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <div className="llc-footer-title">Contact</div>
              <div className="llc-footer-links">
                <a href="mailto:hello@llc.lk">hello@llc.lk</a>
                <a href="tel:+94770000000">+94 77 000 0000</a>
                <span className="text-slate-400 text-xs">Main Street, Kalmunai, Sri Lanka</span>
              </div>
            </div>
          </div>

          <div className="llc-footer-bottom">
            <span>© {currentYear} Language Learning Campus.</span>
            <span>Built for reliability.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
