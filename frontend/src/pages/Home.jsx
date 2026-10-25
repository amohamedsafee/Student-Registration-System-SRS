import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const statsRef = useRef(null);

  // Scroll reveal & Stat count-up
  useEffect(() => {
    // 1. Reveal elements on scroll
    const revealEls = document.querySelectorAll('[data-reveal]');
    let revealObserver;

    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-in'));
    }

    // 2. Stat count-up
    let statObserver;
    let counted = false;

    const runCount = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1500;
      let start = null;

      const tick = (now) => {
        if (!start) start = now;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const startCounting = () => {
      if (counted) return;
      counted = true;
      document.querySelectorAll('[data-count]').forEach(runCount);
    };

    if (statsRef.current && 'IntersectionObserver' in window) {
      statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              startCounting();
              statObserver.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      statObserver.observe(statsRef.current);
    } else {
      startCounting();
    }

    // Hash navigation scroll support
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }

    return () => {
      if (revealObserver) revealObserver.disconnect();
      if (statObserver) statObserver.disconnect();
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <>
      <style>{`
        /* =========================================================
           KEYFRAMES & ANIMATIONS
           ========================================================= */
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity .6s ease-out, transform .6s ease-out;
          transition-delay: var(--d, 0ms);
        }
        [data-reveal].is-in {
          opacity: 1;
          transform: none;
        }

        /* =========================================================
           HERO
           ========================================================= */
        .home-hero {
          padding: 5rem 0 6rem;
          background: var(--bg);
          border-bottom: var(--border-thick);
        }
        .home-hero-grid {
          display: grid;
          gap: 4rem;
          align-items: center;
        }
        @media(min-width: 1024px) {
          .home-hero-grid {
            grid-template-columns: 1.1fr .9fr;
            gap: 2rem;
          }
        }

        .home-hero-eyebrow {
          display: inline-block;
          padding: .25rem .75rem;
          background: var(--orange);
          color: var(--navy);
          font-size: .75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: 1.5rem;
          border: 2px solid var(--navy);
        }

        .home-hero h1 {
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -.04em;
          color: var(--navy);
        }
        .home-hero h1 .highlight-red {
          font-style: normal !important;
          color: var(--red);
        }

        .home-hero-lead {
          margin-top: 2rem;
          max-width: 30rem;
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--text-muted);
          line-height: 1.6;
          border-left: 4px solid var(--green);
          padding-left: 1.5rem;
        }

        .home-hero-actions {
          display: flex;
          gap: 1rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }

        .home-hero-visual {
          position: relative;
        }
        .home-hero-card {
          position: relative;
          background: #fff;
          border: var(--border-thick);
          box-shadow: var(--shadow-hard);
          padding: 2rem;
          z-index: 2;
          transition: transform .2s, box-shadow .2s;
        }
        .home-hero-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 12px 12px 0px 0px var(--navy);
        }
        .home-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid var(--navy);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .home-card-label {
          font-size: .75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: var(--text-muted);
        }
        .home-card-number {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -.02em;
          color: var(--navy);
          margin-top: .25rem;
        }
        .home-card-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: .9375rem;
        }
        .home-card-row dt {
          font-weight: 600;
          color: var(--text-muted);
        }
        .home-card-row dd {
          font-weight: 800;
          color: var(--navy);
        }

        .home-floating-chip {
          position: absolute;
          bottom: -2rem;
          left: -2rem;
          background: #fff;
          border: var(--border-thick);
          box-shadow: var(--shadow-hard-sm);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 3;
        }
        .home-chip-icon {
          width: 2.5rem;
          height: 2.5rem;
          display: grid;
          place-items: center;
          background: var(--green);
          color: #fff;
        }
        .home-chip-title {
          font-size: .875rem;
          font-weight: 900;
          text-transform: uppercase;
          color: var(--navy);
        }
        .home-chip-sub {
          font-size: .75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        /* =========================================================
           STATS BAR
           ========================================================= */
        .home-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border: var(--border-thick);
          background: #fff;
          margin-top: 6rem;
        }
        @media(min-width: 768px) {
          .home-stats {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .home-stat {
          padding: 2rem 1.5rem;
          text-align: center;
          border-bottom: 2px solid var(--navy);
          border-right: 2px solid var(--navy);
        }
        .home-stat:nth-child(even) {
          border-right: none;
        }
        @media(min-width: 768px) {
          .home-stat {
            border-bottom: none;
          }
          .home-stat:last-child {
            border-right: none;
          }
        }
        .home-stat-value {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1;
          color: var(--navy);
          letter-spacing: -.05em;
        }
        .home-stat-label {
          margin-top: .5rem;
          font-size: .75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: var(--red);
        }

        /* =========================================================
           TICKER
           ========================================================= */
        .home-ticker {
          background: var(--navy);
          padding: 1rem 0;
          overflow: hidden;
          border-bottom: var(--border-thick);
        }
        .home-ticker-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .home-ticker-group {
          display: flex;
          align-items: center;
          gap: 3rem;
          padding-right: 3rem;
        }
        .home-ticker-item {
          color: #fff;
          font-size: 1rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .1em;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .home-ticker-item::before {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--orange);
        }

        /* =========================================================
           SECTIONS GENERAL
           ========================================================= */
        .home-section {
          padding: 7rem 0;
          background: var(--bg);
        }
        .home-section-bg {
          background: var(--bg-alt);
          border-bottom: var(--border-thick);
        }
        .home-section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          letter-spacing: -.03em;
          line-height: 1.1;
          color: var(--navy);
          max-width: 40rem;
        }
        .home-section-desc {
          margin-top: 1rem;
          font-size: 1.125rem;
          color: var(--text-muted);
          max-width: 35rem;
        }

        /* =========================================================
           COURSES PREVIEW
           ========================================================= */
        .home-courses-grid {
          display: grid;
          gap: 2rem;
          margin-top: 4rem;
        }
        @media(min-width: 768px) {
          .home-courses-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .home-course-card {
          background: #fff;
          border: var(--border-thick);
          padding: 2rem;
          position: relative;
          transition: transform .2s, box-shadow .2s;
        }
        .home-course-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hard);
        }
        .home-course-card::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          height: 8px;
        }
        .home-course-card.card-red::before { background: var(--red); }
        .home-course-card.card-green::before { background: var(--green); }
        .home-course-card.card-orange::before { background: var(--orange); }

        .home-course-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .home-course-icon {
          width: 3rem;
          height: 3rem;
          background: #F1F5F9;
          border: 2px solid var(--navy);
          display: grid;
          place-items: center;
          color: var(--navy);
        }
        .home-pill-open {
          border: 2px solid var(--green);
          padding: .25rem .5rem;
          font-size: .75rem;
          font-weight: 900;
          text-transform: uppercase;
          color: var(--green);
        }
        .home-course-name {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -.02em;
          color: var(--navy);
        }
        .home-course-meta {
          margin-top: 1.5rem;
          border-top: 2px solid var(--navy);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: .75rem;
        }
        .home-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: .875rem;
          font-weight: 600;
        }
        .home-meta-row dt { color: var(--text-muted); }
        .home-meta-row dd { color: var(--navy); font-weight: 800; }
        .home-course-link {
          display: inline-block;
          margin-top: 2rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .05em;
          color: var(--navy);
          border-bottom: 3px solid var(--navy);
          padding-bottom: .25rem;
          transition: color .2s, border-color .2s;
        }
        .home-course-card:hover .home-course-link {
          color: var(--red);
          border-color: var(--red);
        }

        /* =========================================================
           BENTO FEATURES
           ========================================================= */
        .home-bento {
          display: grid;
          gap: 1.5rem;
          margin-top: 4rem;
        }
        @media(min-width: 768px) {
          .home-bento {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .home-bento-card {
          background: #fff;
          border: var(--border-thick);
          padding: 2.5rem;
          transition: background .2s;
        }
        .home-bento-card:hover {
          background: #F8FAFC;
        }
        .home-bento-card.span-2 {
          grid-column: span 2;
        }
        .home-bento-icon {
          width: 3rem;
          height: 3rem;
          background: var(--navy);
          color: #fff;
          display: grid;
          place-items: center;
          margin-bottom: 1.5rem;
        }
        .home-bento-card h3 {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--navy);
          margin-bottom: 1rem;
        }
        .home-bento-card p {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* =========================================================
           STATUS SECTION
           ========================================================= */
        .home-status-section {
          background: var(--navy);
          color: #fff;
          border-bottom: var(--border-thick);
        }
        .home-status-grid {
          display: grid;
          gap: 4rem;
          align-items: center;
        }
        @media(min-width: 1024px) {
          .home-status-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .home-status-section .home-section-title {
          color: #fff;
        }
        .home-status-section .home-section-desc {
          color: #A5B4FC;
        }
        .home-status-box {
          border: 3px solid #fff;
          background: rgba(255, 255, 255, 0.05);
          padding: 2rem;
        }
        .home-status-row {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .home-status-row:last-child {
          border-bottom: none;
        }
        .home-status-num {
          width: 2.5rem;
          height: 2.5rem;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        .home-num-1 { background: var(--orange); color: var(--navy); }
        .home-num-2 { background: var(--red); color: #fff; }
        .home-num-3 { background: var(--green); color: #fff; }
        .home-status-code {
          font-size: 1.125rem;
          font-weight: 900;
          letter-spacing: .05em;
        }
        .home-status-text {
          font-size: .9375rem;
          color: #CBD5E1;
          margin-top: .25rem;
        }

        /* =========================================================
           FAQ
           ========================================================= */
        .home-faq-list {
          margin-top: 4rem;
          border-top: var(--border-thick);
        }
        .home-faq-item {
          border-bottom: var(--border-thick);
        }
        .home-faq-q {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
          text-align: left;
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--navy);
        }
        .home-faq-plus {
          font-size: 2rem;
          font-weight: 400;
          line-height: 0;
          transition: transform .3s;
        }
        .home-faq-item.open .home-faq-plus {
          transform: rotate(45deg);
          color: var(--red);
        }
        .home-faq-a {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .3s ease;
        }
        .home-faq-item.open .home-faq-a {
          grid-template-rows: 1fr;
        }
        .home-faq-a > div {
          overflow: hidden;
        }
        .home-faq-a p {
          padding-bottom: 2rem;
          font-size: 1.125rem;
          color: var(--text-muted);
          max-width: 50rem;
        }

        /* =========================================================
           FINAL CTA
           ========================================================= */
        .home-cta-wrap {
          padding: 0 1.25rem 6rem;
          background: var(--bg);
        }
        @media(min-width: 640px) {
          .home-cta-wrap {
            padding: 0 2rem 8rem;
          }
        }
        .home-cta {
          max-width: 80rem;
          margin: 0 auto;
          background: var(--orange);
          border: var(--border-thick);
          box-shadow: var(--shadow-hard);
          padding: 5rem 2rem;
          text-align: center;
        }
        .home-cta h2 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -.03em;
          line-height: 1.1;
          color: var(--navy);
        }
        .home-cta p {
          margin: 1.5rem auto 0;
          max-width: 30rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--navy);
        }
        .home-cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 3rem;
          flex-wrap: wrap;
        }
      `}</style>

      <div style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
        {/* Navigation Bar (Standard 80px size on Homepage, shrinks to 60px on sub-pages) */}
        <Navbar />

        <main>
          {/* ===================== HERO ===================== */}
          <section className="home-hero">
            <div className="llc-container home-hero-grid">
              <div data-reveal="">
                <div className="home-hero-eyebrow">Admissions Open · 2026</div>
                <h1>Your seat is <span className="highlight-red">one form</span> away.</h1>
                <p className="home-hero-lead">
                  Browse courses, pick an open batch and register in under two minutes. Your account is created in the same step — then track your application status live.
                </p>
                <div className="home-hero-actions">
                  <Link to="/register" className="btn-primary" id="home-start-reg-btn">
                    Start Registration
                  </Link>
                  <Link to="/courses" className="btn-secondary" id="home-browse-courses-btn">
                    Browse Courses
                  </Link>
                </div>
              </div>

              <div className="home-hero-visual" data-reveal="" style={{ '--d': '200ms' }}>
                <div className="home-hero-card">
                  <div className="home-card-header">
                    <div>
                      <p className="home-card-label">Reference</p>
                      <p className="home-card-number">LLC-2026-000128</p>
                    </div>
                    <span className="badge-pending">Pending</span>
                  </div>
                  <dl>
                    <div className="home-card-row">
                      <dt>Student</dt>
                      <dd>A. Fathima</dd>
                    </div>
                    <div className="home-card-row">
                      <dt>Course</dt>
                      <dd>Spoken English</dd>
                    </div>
                    <div className="home-card-row">
                      <dt>Batch</dt>
                      <dd>Weekend · Apr 2026</dd>
                    </div>
                    <div className="home-card-row">
                      <dt>Submitted</dt>
                      <dd>12 Apr 2026</dd>
                    </div>
                  </dl>
                </div>

                <div className="home-floating-chip">
                  <div className="home-chip-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="home-chip-title">Batch Open</div>
                    <div className="home-chip-sub">3 seats left</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="llc-container">
              <div className="home-stats" data-reveal="" style={{ '--d': '300ms' }} ref={statsRef}>
                <div className="home-stat">
                  <div className="home-stat-value"><span data-count="12">0</span>+</div>
                  <div className="home-stat-label">Courses</div>
                </div>
                <div className="home-stat">
                  <div className="home-stat-value"><span data-count="35">0</span>+</div>
                  <div className="home-stat-label">Batches</div>
                </div>
                <div className="home-stat">
                  <div className="home-stat-value"><span data-count="2400">0</span>+</div>
                  <div className="home-stat-label">Students</div>
                </div>
                <div className="home-stat">
                  <div className="home-stat-value"><span data-count="48">0</span>h</div>
                  <div className="home-stat-label">Avg Review</div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== TICKER ===================== */}
          <section className="home-ticker" aria-hidden="true">
            <div className="home-ticker-track">
              <div className="home-ticker-group">
                <span className="home-ticker-item">Spoken English</span>
                <span className="home-ticker-item">Arabic</span>
                <span className="home-ticker-item">Tamil</span>
                <span className="home-ticker-item">IELTS Prep</span>
                <span className="home-ticker-item">French</span>
                <span className="home-ticker-item">Quran &amp; Tajweed</span>
              </div>
              <div className="home-ticker-group">
                <span className="home-ticker-item">Spoken English</span>
                <span className="home-ticker-item">Arabic</span>
                <span className="home-ticker-item">Tamil</span>
                <span className="home-ticker-item">IELTS Prep</span>
                <span className="home-ticker-item">French</span>
                <span className="home-ticker-item">Quran &amp; Tajweed</span>
              </div>
            </div>
          </section>

          {/* ===================== COURSES PREVIEW ===================== */}
          <section className="home-section" id="courses">
            <div className="llc-container">
              <h2 className="home-section-title" data-reveal="">Active Catalogue.</h2>
              <p className="home-section-desc" data-reveal="" style={{ '--d': '100ms' }}>
                Only batches that are currently open for registration. The server re-checks availability on submission.
              </p>

              <div className="home-courses-grid">
                <article className="home-course-card card-red" data-reveal="" style={{ '--d': '0ms' }}>
                  <div className="home-course-top">
                    <div className="home-course-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <span className="home-pill-open">3 Open</span>
                  </div>
                  <h3 className="home-course-name">Spoken English</h3>
                  <div className="home-course-meta">
                    <div className="home-meta-row">
                      <dt>Duration</dt>
                      <dd>3 Months</dd>
                    </div>
                    <div className="home-meta-row">
                      <dt>Schedule</dt>
                      <dd>Weekends</dd>
                    </div>
                  </div>
                  <Link to="/courses" className="home-course-link">View Batches</Link>
                </article>

                <article className="home-course-card card-green" data-reveal="" style={{ '--d': '100ms' }}>
                  <div className="home-course-top">
                    <div className="home-course-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <span className="home-pill-open">2 Open</span>
                  </div>
                  <h3 className="home-course-name">Quran &amp; Tajweed</h3>
                  <div className="home-course-meta">
                    <div className="home-meta-row">
                      <dt>Duration</dt>
                      <dd>6 Months</dd>
                    </div>
                    <div className="home-meta-row">
                      <dt>Schedule</dt>
                      <dd>Weekdays</dd>
                    </div>
                  </div>
                  <Link to="/courses" className="home-course-link">View Batches</Link>
                </article>

                <article className="home-course-card card-orange" data-reveal="" style={{ '--d': '200ms' }}>
                  <div className="home-course-top">
                    <div className="home-course-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                    </div>
                    <span className="home-pill-open">1 Open</span>
                  </div>
                  <h3 className="home-course-name">IELTS Preparation</h3>
                  <div className="home-course-meta">
                    <div className="home-meta-row">
                      <dt>Duration</dt>
                      <dd>10 Weeks</dd>
                    </div>
                    <div className="home-meta-row">
                      <dt>Schedule</dt>
                      <dd>Weekends</dd>
                    </div>
                  </div>
                  <Link to="/courses" className="home-course-link">View Batches</Link>
                </article>
              </div>
            </div>
          </section>

          {/* ===================== FEATURES BENTO ===================== */}
          <section className="home-section home-section-bg">
            <div className="llc-container">
              <h2 className="home-section-title" data-reveal="">Built for reliability.</h2>
              <p className="home-section-desc" data-reveal="" style={{ '--d': '100ms' }}>
                The engineering nobody notices — until it saves them.
              </p>

              <div className="home-bento">
                <div className="home-bento-card span-2" data-reveal="" style={{ '--d': '0ms' }}>
                  <div className="home-bento-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <h3>Atomic Registration</h3>
                  <p>Account, profile, and application are written in one MySQL transaction. If anything fails, nothing is half-created.</p>
                </div>

                <div className="home-bento-card" data-reveal="" style={{ '--d': '100ms' }}>
                  <div className="home-bento-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h3>Bank-grade Security</h3>
                  <p>Argon2/bcrypt hashing, HTTP-only Secure cookies, and generic auth errors.</p>
                </div>

                <div className="home-bento-card" data-reveal="" style={{ '--d': '200ms' }}>
                  <div className="home-bento-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                  </div>
                  <h3>Mobile First</h3>
                  <p>Designed for a phone in one hand on a slow connection.</p>
                </div>

                <div className="home-bento-card" data-reveal="" style={{ '--d': '300ms' }}>
                  <div className="home-bento-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h3>Verified Email</h3>
                  <p>Single-use verification and reset tokens that expire.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== STATUS PIPELINE ===================== */}
          <section className="home-section home-status-section" id="status">
            <div className="llc-container home-status-grid">
              <div data-reveal="">
                <h2 className="home-section-title">Track your admission.</h2>
                <p className="home-section-desc">
                  Every registration moves through a defined set of states. No phone calls, no guessing.
                </p>
              </div>

              <div className="home-status-box" data-reveal="" style={{ '--d': '200ms' }}>
                <div className="home-status-row">
                  <div className="home-status-num home-num-1">1</div>
                  <div>
                    <div className="home-status-code">PENDING</div>
                    <div className="home-status-text">Application received and waiting in the review queue.</div>
                  </div>
                </div>
                <div className="home-status-row">
                  <div className="home-status-num home-num-2">2</div>
                  <div>
                    <div className="home-status-code">UNDER_REVIEW</div>
                    <div className="home-status-text">An administrator is checking your details.</div>
                  </div>
                </div>
                <div className="home-status-row">
                  <div className="home-status-num home-num-3">3</div>
                  <div>
                    <div className="home-status-code">CONFIRMED</div>
                    <div className="home-status-text">Your seat is secured. Welcome to LLC.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== FAQ ACCORDION ===================== */}
          <section className="home-section" id="faq">
            <div className="llc-container" style={{ maxWidth: '60rem' }}>
              <h2 className="home-section-title" data-reveal="">Questions.</h2>

              <div className="home-faq-list" data-reveal="" style={{ '--d': '100ms' }}>
                {[
                  {
                    q: 'Do I need an account before I register?',
                    a: 'No. Your account is created as part of the registration form. You choose your email and password while applying.'
                  },
                  {
                    q: 'Does submitting the form confirm my admission?',
                    a: 'No. Every new registration starts as PENDING. An administrator reviews it and moves it to UNDER_REVIEW and then CONFIRMED.'
                  },
                  {
                    q: 'Can I register for more than one course?',
                    a: 'Yes. Once you have an account you can add registrations for other courses and batches from your dashboard.'
                  }
                ].map((faq, index) => (
                  <div key={index} className={`home-faq-item ${openFaq === index ? 'open' : ''}`}>
                    <button
                      className="home-faq-q"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={openFaq === index}
                    >
                      <span>{faq.q}</span>
                      <span className="home-faq-plus">+</span>
                    </button>
                    <div className="home-faq-a">
                      <div><p>{faq.a}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===================== FINAL CTA ===================== */}
          <section className="home-cta-wrap">
            <div className="home-cta" data-reveal="">
              <h2>Take your seat.</h2>
              <p>Registration takes about two minutes. You will receive a unique reference number the moment you submit.</p>
              <div className="home-cta-actions">
                <Link to="/register" className="btn-primary" id="home-cta-apply-btn">
                  Apply Now
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </>
  );
}
