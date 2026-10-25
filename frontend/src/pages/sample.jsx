import React, { useState, useEffect, useRef } from 'react';

export default function LandingPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const navRef = useRef(null);
  const statsRef = useRef(null);

  // Sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        // In the original code, the navbar stays visible. 
        // We can add a subtle shadow when scrolled if desired.
        if (window.scrollY > 20) {
          navRef.current.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
          navRef.current.style.boxShadow = 'none';
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal & Stat count-up
  useEffect(() => {
    // 1. Reveal elements
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

    return () => {
      if (revealObserver) revealObserver.disconnect();
      if (statObserver) statObserver.disconnect();
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <>
      <style>{`
        /* =========================================================
           TOKENS
           ========================================================= */
        :root{
          --navy: #182B5E;
          --navy-light: #2A427D;
          --red: #D9381E;
          --green: #116530;
          --orange: #F28C28;
          
          --bg: #F7F9FC;
          --bg-alt: #FFFFFF;
          
          --text-main: #182B5E;
          --text-muted: #5A6B8C;
          
          --border-thick: 3px solid var(--navy);
          --border-thin: 1px solid #CBD5E1;
          --shadow-hard: 8px 8px 0px 0px var(--navy);
          --shadow-hard-sm: 4px 4px 0px 0px var(--navy);
        }

        /* =========================================================
           RESET / BASE (SHARP EDGES)
           ========================================================= */
        *,*::before,*::after{box-sizing:border-box; border-radius: 0 !important;}
        *{margin:0;padding:0}
        html{
          scroll-behavior:smooth;
          scroll-padding-top:6rem;
        }
        body{
          background:var(--bg);
          color:var(--text-main);
          font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
          line-height:1.6;
          -webkit-font-smoothing:antialiased;
          overflow-x:hidden;
        }
        img,svg{display:block;max-width:100%}
        a{color:inherit;text-decoration:none}
        button{font:inherit;color:inherit;background:none;border:none;cursor:pointer}
        ul{list-style:none}
        ::selection{background:var(--navy);color:#fff}

        /* =========================================================
           LAYOUT HELPERS
           ========================================================= */
        .container{
          width:100%;
          max-width:80rem;
          margin-inline:auto;
          padding-inline:1.25rem;
        }
        @media(min-width:640px){ .container{padding-inline:2rem} }

        /* =========================================================
           KEYFRAMES
           ========================================================= */
        @keyframes marquee{
          from{transform:translateX(0)}
          to{transform:translateX(-50%)}
        }

        [data-reveal]{
          opacity:0;
          transform:translateY(30px);
          transition:opacity .6s ease-out, transform .6s ease-out;
          transition-delay:var(--d,0ms);
        }
        [data-reveal].is-in{opacity:1;transform:none}

        /* =========================================================
           NAVBAR
           ========================================================= */
        .nav{
          position:fixed;
          inset:0 0 auto 0;
          z-index:50;
          background:var(--bg-alt);
          border-bottom:var(--border-thick);
          transition:transform .3s ease, box-shadow .3s ease;
        }
        .nav-inner{
          display:flex;
          align-items:center;
          justify-content:space-between;
          height:80px;
        }
        .brand{display:flex;align-items:center;gap:1rem}
        .brand-mark{
          width:3.5rem;
          height:3.5rem;
          object-fit:contain;
          border: 2px solid var(--navy);
        }
        .brand-text{display:none;flex-direction:column;line-height:1.1}
        @media(min-width:640px){ .brand-text{display:flex} }
        .brand-name{font-size:1.125rem;font-weight:900;letter-spacing:-.03em;text-transform:uppercase;}
        .brand-sub{font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--red);text-transform:uppercase}

        .nav-links{display:none;align-items:center;gap:2rem}
        @media(min-width:1024px){ .nav-links{display:flex} }
        .nav-link{
          font-size:.875rem;
          font-weight:800;
          text-transform:uppercase;
          letter-spacing:.05em;
          color:var(--navy);
          transition:color .2s;
        }
        .nav-link:hover{color:var(--red)}

        .nav-actions{display:none;align-items:center;gap:1.5rem}
        @media(min-width:640px){ .nav-actions{display:flex} }
        .btn-ghost{
          font-size:.875rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;
        }
        .btn-sm-solid{
          padding:.75rem 1.5rem;
          background:var(--navy);
          color:#fff;
          font-size:.875rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;
          border:2px solid var(--navy);
          transition:all .2s;
        }
        .btn-sm-solid:hover{
          background:#fff;
          color:var(--navy);
          box-shadow:var(--shadow-hard-sm);
          transform:translate(-2px, -2px);
        }

        /* Mobile Toggle */
        .nav-toggle{
          display:grid;place-items:center;
          width:3rem;height:3rem;
          border:2px solid var(--navy);
        }
        @media(min-width:1024px){ .nav-toggle{display:none} }
        .burger{position:relative;display:block;width:1.5rem;height:1rem;}
        .burger span{position:absolute;left:0;width:100%;height:3px;background:var(--navy);transition:all .3s;}
        .burger span:nth-child(1){top:0}
        .burger span:nth-child(2){top:50%;transform:translateY(-50%)}
        .burger span:nth-child(3){top:100%;transform:translateY(-100%)}
        .nav-toggle.is-open .burger span:nth-child(1){top:50%;transform:translateY(-50%) rotate(45deg)}
        .nav-toggle.is-open .burger span:nth-child(2){opacity:0}
        .nav-toggle.is-open .burger span:nth-child(3){top:50%;transform:translateY(-50%) rotate(-45deg)}

        /* Mobile Sheet */
        .mobile-sheet{
          display:grid;grid-template-rows:0fr;overflow:hidden;
          background:var(--bg-alt);border-bottom:0 solid var(--navy);
          transition:grid-template-rows .3s ease, border-bottom .3s ease;
        }
        .mobile-sheet.open{grid-template-rows:1fr;border-bottom:3px solid var(--navy)}
        .mobile-sheet > div{overflow:hidden}
        @media(min-width:1024px){ .mobile-sheet{display:none} }
        .mobile-inner{padding:1.5rem;}
        .mobile-link{
          display:block;padding:1rem 0;
          font-size:1.125rem;font-weight:800;text-transform:uppercase;
          border-bottom:1px solid #E2E8F0;
        }
        .mobile-cta{display:flex;gap:1rem;margin-top:1.5rem}
        .mobile-cta a{
          flex:1;padding:1rem;text-align:center;font-weight:800;text-transform:uppercase;border:2px solid var(--navy);
        }
        .mobile-cta .outline{color:var(--navy)}
        .mobile-cta .solid{background:var(--navy);color:#fff}

        /* =========================================================
           HERO
           ========================================================= */
        .hero{
          padding-top:10rem;padding-bottom:6rem;
          background:var(--bg);
          border-bottom:var(--border-thick);
        }
        .hero-grid{display:grid;gap:4rem;align-items:center}
        @media(min-width:1024px){ .hero-grid{grid-template-columns:1.1fr .9fr;gap:2rem} }

        .hero-eyebrow{
          display:inline-block;
          padding:.25rem .75rem;
          background:var(--orange);
          color:var(--navy);
          font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;
          margin-bottom:1.5rem;
        }

        .hero h1{
          font-size:clamp(3rem, 6vw, 5.5rem);
          font-weight:900;
          line-height:0.95;
          letter-spacing:-.04em;
          color:var(--navy);
        }
        .hero h1 em{
          font-style:normal;
          color:var(--red);
        }

        .hero-lead{
          margin-top:2rem;
          max-width:30rem;
          font-size:1.125rem;
          font-weight:500;
          color:var(--text-muted);
          line-height:1.6;
          border-left:4px solid var(--green);
          padding-left:1.5rem;
        }

        .hero-actions{display:flex;gap:1rem;margin-top:3rem;flex-wrap:wrap;}
        .btn-primary{
          padding:1.25rem 2.5rem;
          background:var(--navy);
          color:#fff;
          font-size:1rem;font-weight:900;text-transform:uppercase;letter-spacing:.05em;
          border:2px solid var(--navy);
          transition:all .2s;
        }
        .btn-primary:hover{
          box-shadow:var(--shadow-hard);
          transform:translate(-4px, -4px);
        }
        .btn-secondary{
          padding:1.25rem 2.5rem;
          background:transparent;
          color:var(--navy);
          font-size:1rem;font-weight:900;text-transform:uppercase;letter-spacing:.05em;
          border:2px solid var(--navy);
          transition:background .2s;
        }
        .btn-secondary:hover{background:#E2E8F0}

        .hero-visual{position:relative}
        .hero-card{
          position:relative;
          background:#fff;
          border:var(--border-thick);
          box-shadow:var(--shadow-hard);
          padding:2rem;
          z-index:2;
          transition:transform .2s;
        }
        .hero-card:hover{transform:translate(-2px, -2px); box-shadow:12px 12px 0px 0px var(--navy);}
        .card-header{
          display:flex;justify-content:space-between;align-items:flex-start;
          border-bottom:2px solid var(--navy);
          padding-bottom:1.5rem;
          margin-bottom:1.5rem;
        }
        .card-label{font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);}
        .card-number{font-size:1.5rem;font-weight:900;letter-spacing:-.02em;color:var(--navy);margin-top:.25rem;}
        .badge-pending{
          background:var(--orange);color:var(--navy);
          padding:.25rem .5rem;font-size:.75rem;font-weight:900;text-transform:uppercase;
        }
        .card-row{display:flex;justify-content:space-between;margin-bottom:1rem;font-size:.9375rem;}
        .card-row dt{font-weight:600;color:var(--text-muted);}
        .card-row dd{font-weight:800;color:var(--navy);}

        .floating-chip{
          position:absolute;
          bottom:-2rem;left:-2rem;
          background:#fff;
          border:var(--border-thick);
          box-shadow:var(--shadow-hard-sm);
          padding:1rem 1.5rem;
          display:flex;align-items:center;gap:1rem;
          z-index:3;
        }
        .chip-icon{
          width:2.5rem;height:2.5rem;display:grid;place-items:center;
          background:var(--green);color:#fff;
        }
        .chip-title{font-size:.875rem;font-weight:900;text-transform:uppercase;color:var(--navy);}
        .chip-sub{font-size:.75rem;font-weight:600;color:var(--text-muted);}

        /* =========================================================
           STATS BAR
           ========================================================= */
        .stats{
          display:grid;grid-template-columns:repeat(2,1fr);
          border:var(--border-thick);background:#fff;
          margin-top:6rem;
        }
        @media(min-width:768px){ .stats{grid-template-columns:repeat(4,1fr)} }
        .stat{
          padding:2rem 1.5rem;text-align:center;
          border-bottom:2px solid var(--navy);
          border-right:2px solid var(--navy);
        }
        .stat:nth-child(even){border-right:none;}
        @media(min-width:768px){
          .stat{border-bottom:none;}
          .stat:last-child{border-right:none;}
        }
        .stat-value{font-size:3rem;font-weight:900;line-height:1;color:var(--navy);letter-spacing:-.05em;}
        .stat-label{margin-top:.5rem;font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--red);}

        /* =========================================================
           TICKER
           ========================================================= */
        .ticker{
          background:var(--navy);
          padding:1rem 0;overflow:hidden;
          border-bottom:var(--border-thick);
        }
        .ticker-track{display:flex;width:max-content;animation:marquee 30s linear infinite;}
        .ticker-group{display:flex;align-items:center;gap:3rem;padding-right:3rem;}
        .ticker-item{
          color:#fff;font-size:1rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;
          display:flex;align-items:center;gap:1rem;
        }
        .ticker-item::before{content:'';width:8px;height:8px;background:var(--orange);}

        /* =========================================================
           SECTIONS
           ========================================================= */
        .section{padding:7rem 0; background:var(--bg);}
        .section-bg{background:var(--bg-alt);border-bottom:var(--border-thick);}
        .section-title{
          font-size:clamp(2rem, 4vw, 3rem);font-weight:900;letter-spacing:-.03em;line-height:1.1;color:var(--navy);
          max-width:40rem;
        }
        .section-desc{margin-top:1rem;font-size:1.125rem;color:var(--text-muted);max-width:35rem;}

        /* =========================================================
           COURSES
           ========================================================= */
        .courses-grid{display:grid;gap:2rem;margin-top:4rem;}
        @media(min-width:768px){ .courses-grid{grid-template-columns:repeat(3,1fr)} }
        .course-card{
          background:#fff;border:var(--border-thick);
          padding:2rem;position:relative;
          transition:transform .2s, box-shadow .2s;
        }
        .course-card:hover{transform:translateY(-4px); box-shadow:var(--shadow-hard);}
        .course-card::before{content:'';position:absolute;top:-3px;left:-3px;right:-3px;height:8px;}
        .course-card.red::before{background:var(--red);}
        .course-card.green::before{background:var(--green);}
        .course-card.orange::before{background:var(--orange);}

        .course-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;}
        .course-icon{
          width:3rem;height:3rem;background:#F1F5F9;border:2px solid var(--navy);
          display:grid;place-items:center;color:var(--navy);
        }
        .pill-open{
          border:2px solid var(--green);padding:.25rem .5rem;
          font-size:.75rem;font-weight:900;text-transform:uppercase;color:var(--green);
        }
        .course-name{font-size:1.5rem;font-weight:900;letter-spacing:-.02em;color:var(--navy);}
        .course-meta{margin-top:1.5rem;border-top:2px solid var(--navy);padding-top:1.5rem;display:flex;flex-direction:column;gap:.75rem;}
        .meta-row{display:flex;justify-content:space-between;font-size:.875rem;font-weight:600;}
        .meta-row dt{color:var(--text-muted);}
        .meta-row dd{color:var(--navy);font-weight:800;}
        .course-link{
          display:inline-block;margin-top:2rem;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);
          border-bottom:3px solid var(--navy);padding-bottom:.25rem;
        }
        .course-card:hover .course-link{color:var(--red);border-color:var(--red);}

        /* =========================================================
           FEATURES
           ========================================================= */
        .bento{display:grid;gap:1.5rem;margin-top:4rem;}
        @media(min-width:768px){ .bento{grid-template-columns:repeat(3,1fr)} }
        .bento-card{
          background:#fff;border:var(--border-thick);padding:2.5rem;
          transition:background .2s;
        }
        .bento-card:hover{background:#F8FAFC;}
        .bento-card.span-2{grid-column:span 2;}
        .bento-icon{
          width:3rem;height:3rem;background:var(--navy);color:#fff;display:grid;place-items:center;margin-bottom:1.5rem;
        }
        .bento-card h3{font-size:1.25rem;font-weight:900;color:var(--navy);margin-bottom:1rem;}
        .bento-card p{font-size:1rem;color:var(--text-muted);line-height:1.6;}

        /* =========================================================
           STATUS SECTION
           ========================================================= */
        .status-section{
          background:var(--navy);color:#fff;border-bottom:var(--border-thick);
        }
        .status-grid{display:grid;gap:4rem;align-items:center;}
        @media(min-width:1024px){ .status-grid{grid-template-columns:1fr 1fr} }
        .status-section .section-title{color:#fff;}
        .status-section .section-desc{color:#A5B4FC;}

        .status-box{
          border:3px solid #fff;background:rgba(255,255,255,0.05);padding:2rem;
        }
        .status-row{
          display:flex;gap:1.5rem;padding:1.5rem 0;border-bottom:1px solid rgba(255,255,255,0.2);
        }
        .status-row:last-child{border-bottom:none;}
        .status-num{
          width:2.5rem;height:2.5rem;display:grid;place-items:center;font-weight:900;font-size:1.25rem;flex-shrink:0;
        }
        .num-1{background:var(--orange);color:var(--navy);}
        .num-2{background:var(--red);color:#fff;}
        .num-3{background:var(--green);color:#fff;}
        .status-code{font-size:1.125rem;font-weight:900;letter-spacing:.05em;}
        .status-text{font-size:.9375rem;color:#CBD5E1;margin-top:.25rem;}

        /* =========================================================
           FAQ
           ========================================================= */
        .faq-list{margin-top:4rem;border-top:var(--border-thick);}
        .faq-item{border-bottom:var(--border-thick);}
        .faq-q{
          width:100%;display:flex;justify-content:space-between;align-items:center;
          padding:2rem 0;text-align:left;font-size:1.25rem;font-weight:900;color:var(--navy);
        }
        .faq-plus{
          font-size:2rem;font-weight:400;line-height:0;transition:transform .3s;
        }
        .faq-item.open .faq-plus{transform:rotate(45deg);color:var(--red);}
        .faq-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s ease;}
        .faq-item.open .faq-a{grid-template-rows:1fr;}
        .faq-a > div{overflow:hidden;}
        .faq-a p{padding-bottom:2rem;font-size:1.125rem;color:var(--text-muted);max-width:50rem;}

        /* =========================================================
           FINAL CTA
           ========================================================= */
        .cta-wrap{padding:0 1.25rem 6rem; background:var(--bg);}
        @media(min-width:640px){ .cta-wrap{padding:0 2rem 8rem;} }
        .cta{
          max-width:80rem;margin:0 auto;
          background:var(--orange);
          border:var(--border-thick);
          box-shadow:var(--shadow-hard);
          padding:5rem 2rem;text-align:center;
        }
        .cta h2{font-size:clamp(2.5rem, 5vw, 4rem);font-weight:900;letter-spacing:-.03em;line-height:1.1;color:var(--navy);}
        .cta p{margin:1.5rem auto 0;max-width:30rem;font-size:1.125rem;font-weight:600;color:var(--navy);}
        .cta-actions{display:flex;gap:1rem;justify-content:center;margin-top:3rem;flex-wrap:wrap;}

        /* =========================================================
           FOOTER
           ========================================================= */
        .footer{background:var(--navy);color:#fff;border-top:var(--border-thick);padding:5rem 0 2rem;}
        .footer-grid{display:grid;gap:3rem;}
        @media(min-width:768px){ .footer-grid{grid-template-columns:2fr 1fr 1fr;} }
        .footer-brand{
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size:1.5rem;font-weight:900;letter-spacing:-.02em;margin-bottom:1rem;
        }
        .footer-desc{color:#CBD5E1;max-width:20rem;font-size:.9375rem;}
        .footer-title{font-size:.875rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;margin-bottom:1.5rem;color:var(--orange);}
        .footer-links{display:flex;flex-direction:column;gap:1rem;}
        .footer-links a{font-size:.9375rem;font-weight:600;color:#fff;transition:color .2s;}
        .footer-links a:hover{color:var(--orange);}
        .footer-bottom{
          margin-top:5rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.2);
          display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;
          font-size:.875rem;color:#CBD5E1;
        }

        @media(prefers-reduced-motion:reduce){
          html{scroll-behavior:auto}
          [data-reveal]{opacity:1 !important;transform:none !important;transition:none !important}
          *,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;}
        }
      `}</style>

      <div className="landing-root" style={{ background: 'var(--bg)', color: 'var(--text-main)', minHeight: '100vh' }}>
        {/* ===================== NAVBAR ===================== */}
      <header className="nav" ref={navRef}>
        <div className="container nav-inner">
          <a href="#" className="brand">
            <img src="https://llc-edu.com/wp-content/uploads/2025/06/CAMPUS-2-150x150.png" alt="LLC Logo" className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">Language Learning</span>
              <span className="brand-sub">Kalmunai · LK</span>
            </span>
          </a>

          <nav className="nav-links">
            <a className="nav-link" href="/courses">Courses</a>
            <a className="nav-link" href="#how-it-works">Process</a>
            <a className="nav-link" href="/test-ui">UI System</a>
            <a className="nav-link" href="#faq">FAQ</a>
          </nav>

          <div className="nav-actions">
            <a className="btn-ghost" href="/login">Sign in</a>
            <a className="btn-sm-solid" href="/register">Apply Now</a>
          </div>

          <button 
            className={`nav-toggle ${isMobileOpen ? 'is-open' : ''}`} 
            onClick={toggleMobileMenu} 
            aria-label="Menu"
          >
            <span className="burger"><span></span><span></span><span></span></span>
          </button>
        </div>

        <div className={`mobile-sheet ${isMobileOpen ? 'open' : ''}`}>
          <div>
            <div className="mobile-inner">
              <a className="mobile-link" href="/courses" onClick={closeMobileMenu}>Courses</a>
              <a className="mobile-link" href="#how-it-works" onClick={closeMobileMenu}>Process</a>
              <a className="mobile-link" href="/test-ui" onClick={closeMobileMenu}>UI System</a>
              <a className="mobile-link" href="#faq" onClick={closeMobileMenu}>FAQ</a>
              <div className="mobile-cta">
                <a className="outline" href="/login" onClick={closeMobileMenu}>Sign in</a>
                <a className="solid" href="/register" onClick={closeMobileMenu}>Apply</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ===================== HERO ===================== */}
        <section className="hero">
          <div className="container hero-grid">
            <div data-reveal="">
              <div className="hero-eyebrow">Admissions Open · 2026</div>
              <h1>Your seat is <span style={{ color: 'var(--red)' }}>one form</span> away.</h1>
              <p className="hero-lead">
                Browse courses, pick an open batch and register in under two minutes. Your account is created in the same step — then track your application status live.
              </p>
              <div className="hero-actions">
                <a className="btn-primary" href="/register">Start Registration</a>
                <a className="btn-secondary" href="/courses">Browse Courses</a>
              </div>
            </div>

            <div className="hero-visual" data-reveal="" style={{ '--d': '200ms' }}>
              <div className="hero-card">
                <div className="card-header">
                  <div>
                    <p className="card-label">Reference</p>
                    <p className="card-number">LLC-2026-000128</p>
                  </div>
                  <span className="badge-pending">Pending</span>
                </div>
                <dl>
                  <div className="card-row"><dt>Student</dt><dd>A. Fathima</dd></div>
                  <div className="card-row"><dt>Course</dt><dd>Spoken English</dd></div>
                  <div className="card-row"><dt>Batch</dt><dd>Weekend · Apr 2026</dd></div>
                  <div className="card-row"><dt>Submitted</dt><dd>12 Apr 2026</dd></div>
                </dl>
              </div>
              <div className="floating-chip">
                <div className="chip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <div className="chip-title">Batch Open</div>
                  <div className="chip-sub">3 seats left</div>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="stats" data-reveal="" style={{ '--d': '300ms' }} ref={statsRef}>
              <div className="stat">
                <div className="stat-value"><span className="num" data-count="12">0</span>+</div>
                <div className="stat-label">Courses</div>
              </div>
              <div className="stat">
                <div className="stat-value"><span className="num" data-count="35">0</span>+</div>
                <div className="stat-label">Batches</div>
              </div>
              <div className="stat">
                <div className="stat-value"><span className="num" data-count="2400">0</span>+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat">
                <div className="stat-value"><span className="num" data-count="48">0</span>h</div>
                <div className="stat-label">Avg Review</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== TICKER ===================== */}
        <section className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <div className="ticker-group">
              <span className="ticker-item">Spoken English</span>
              <span className="ticker-item">Arabic</span>
              <span className="ticker-item">Tamil</span>
              <span className="ticker-item">IELTS Prep</span>
              <span className="ticker-item">French</span>
              <span className="ticker-item">Quran &amp; Tajweed</span>
            </div>
            <div className="ticker-group">
              <span className="ticker-item">Spoken English</span>
              <span className="ticker-item">Arabic</span>
              <span className="ticker-item">Tamil</span>
              <span className="ticker-item">IELTS Prep</span>
              <span className="ticker-item">French</span>
              <span className="ticker-item">Quran &amp; Tajweed</span>
            </div>
          </div>
        </section>

        {/* ===================== COURSES ===================== */}
        <section className="section" id="courses">
          <div className="container">
            <h2 className="section-title" data-reveal="">Active Catalogue.</h2>
            <p className="section-desc" data-reveal="" style={{ '--d': '100ms' }}>Only batches that are currently open for registration. The server re-checks availability on submission.</p>

            <div className="courses-grid">
              <article className="course-card red" data-reveal="" style={{ '--d': '0ms' }}>
                <div className="course-top">
                  <div className="course-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <span className="pill-open">3 Open</span>
                </div>
                <h3 className="course-name">Spoken English</h3>
                <div className="course-meta">
                  <div className="meta-row"><dt>Duration</dt><dd>3 Months</dd></div>
                  <div className="meta-row"><dt>Schedule</dt><dd>Weekends</dd></div>
                </div>
                <a className="course-link" href="#register">View Batches</a>
              </article>

              <article className="course-card green" data-reveal="" style={{ '--d': '100ms' }}>
                <div className="course-top">
                  <div className="course-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  </div>
                  <span className="pill-open">2 Open</span>
                </div>
                <h3 className="course-name">Quran &amp; Tajweed</h3>
                <div className="course-meta">
                  <div className="meta-row"><dt>Duration</dt><dd>6 Months</dd></div>
                  <div className="meta-row"><dt>Schedule</dt><dd>Weekdays</dd></div>
                </div>
                <a className="course-link" href="#register">View Batches</a>
              </article>

              <article className="course-card orange" data-reveal="" style={{ '--d': '200ms' }}>
                <div className="course-top">
                  <div className="course-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  </div>
                  <span className="pill-open">1 Open</span>
                </div>
                <h3 className="course-name">IELTS Preparation</h3>
                <div className="course-meta">
                  <div className="meta-row"><dt>Duration</dt><dd>10 Weeks</dd></div>
                  <div className="meta-row"><dt>Schedule</dt><dd>Weekends</dd></div>
                </div>
                <a className="course-link" href="#register">View Batches</a>
              </article>
            </div>
          </div>
        </section>

        {/* ===================== FEATURES ===================== */}
        <section className="section section-bg">
          <div className="container">
            <h2 className="section-title" data-reveal="">Built for reliability.</h2>
            <p className="section-desc" data-reveal="" style={{ '--d': '100ms' }}>The engineering nobody notices — until it saves them.</p>

            <div className="bento">
              <div className="bento-card span-2" data-reveal="" style={{ '--d': '0ms' }}>
                <div className="bento-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                </div>
                <h3>Atomic Registration</h3>
                <p>Account, profile, and application are written in one MySQL transaction. If anything fails, nothing is half-created.</p>
              </div>

              <div className="bento-card" data-reveal="" style={{ '--d': '100ms' }}>
                <div className="bento-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3>Bank-grade Security</h3>
                <p>Argon2/bcrypt hashing, HTTP-only Secure cookies, and generic auth errors.</p>
              </div>

              <div className="bento-card" data-reveal="" style={{ '--d': '200ms' }}>
                <div className="bento-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                </div>
                <h3>Mobile First</h3>
                <p>Designed for a phone in one hand on a slow connection.</p>
              </div>

              <div className="bento-card" data-reveal="" style={{ '--d': '300ms' }}>
                <div className="bento-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <h3>Verified Email</h3>
                <p>Single-use verification and reset tokens that expire.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== STATUS ===================== */}
        <section className="section status-section" id="status">
          <div className="container status-grid">
            <div data-reveal="">
              <h2 className="section-title">Track your admission.</h2>
              <p className="section-desc">Every registration moves through a defined set of states. No phone calls, no guessing.</p>
            </div>

            <div className="status-box" data-reveal="" style={{ '--d': '200ms' }}>
              <div className="status-row">
                <div className="status-num num-1">1</div>
                <div>
                  <div className="status-code">PENDING</div>
                  <div className="status-text">Application received and waiting in the review queue.</div>
                </div>
              </div>
              <div className="status-row">
                <div className="status-num num-2">2</div>
                <div>
                  <div className="status-code">UNDER_REVIEW</div>
                  <div className="status-text">An administrator is checking your details.</div>
                </div>
              </div>
              <div className="status-row">
                <div className="status-num num-3">3</div>
                <div>
                  <div className="status-code">CONFIRMED</div>
                  <div className="status-text">Your seat is secured. Welcome to LLC.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FAQ ===================== */}
        <section className="section" id="faq">
          <div className="container" style={{ maxWidth: '60rem' }}>
            <h2 className="section-title" data-reveal="">Questions.</h2>
            
            <div className="faq-list" data-reveal="" style={{ '--d': '100ms' }}>
              {[
                {
                  q: "Do I need an account before I register?",
                  a: "No. Your account is created as part of the registration form. You choose your email and password while applying."
                },
                {
                  q: "Does submitting the form confirm my admission?",
                  a: "No. Every new registration starts as PENDING. An administrator reviews it and moves it to UNDER_REVIEW and then CONFIRMED."
                },
                {
                  q: "Can I register for more than one course?",
                  a: "Yes. Once you have an account you can add registrations for other courses and batches from your dashboard."
                }
              ].map((faq, index) => (
                <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                  <button className="faq-q" onClick={() => toggleFaq(index)}>
                    <span>{faq.q}</span>
                    <span className="faq-plus">+</span>
                  </button>
                  <div className="faq-a">
                    <div><p>{faq.a}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== FINAL CTA ===================== */}
        <section className="cta-wrap">
          <div className="cta" data-reveal="">
            <h2>Take your seat.</h2>
            <p>Registration takes about two minutes. You will receive a unique reference number the moment you submit.</p>
            <div className="cta-actions">
              <a className="btn-primary" href="#register">Apply Now</a>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <img src="https://llc-edu.com/wp-content/uploads/2025/06/CAMPUS-2-150x150.png" alt="LLC Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                LLC KALMUNAI
              </div>
              <p className="footer-desc">Practical language education with a registration process that respects your time.</p>
            </div>
            <div>
              <div className="footer-title">Explore</div>
              <div className="footer-links">
                <a href="#courses">Courses</a>
                <a href="#faq">FAQ</a>
                <a href="#login">Sign In</a>
              </div>
            </div>
            <div>
              <div className="footer-title">Contact</div>
              <div className="footer-links">
                <a href="mailto:hello@llc.lk">hello@llc.lk</a>
                <a href="tel:+94770000000">+94 77 000 0000</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Language Learning Campus.</span>
            <span>Built for reliability.</span>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}