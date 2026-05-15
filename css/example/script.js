/**
 * SENAI LIVROS — JAVASCRIPT PURO
 * Versão: 1.0.0
 *
 * Módulos:
 * 1. Particles Canvas
 * 2. Navbar Scroll
 * 3. Mobile Menu
 * 4. Scroll Reveal
 * 5. Animated Counters
 * 6. Tabs
 * 7. Back to Top
 * 8. CTA Form
 * 9. Book Card Interactions
 * 10. Keyboard Navigation
 */

(function () {
    'use strict';
  
    /* ============================================================
       1. PARTICLES CANVAS
       Partículas suaves animadas no hero background
    ============================================================ */
  
    const ParticleSystem = {
      canvas: null,
      ctx: null,
      particles: [],
      animId: null,
      config: {
        count: 80,
        colors: ['#2563EB', '#7C3AED', '#10B981', '#F97316', '#EC4899', '#06B6D4'],
        minRadius: 1,
        maxRadius: 3,
        minSpeed: 0.12,
        maxSpeed: 0.5,
        connectionDistance: 100,
        connectionOpacity: 0.08,
      },
  
      init() {
        this.canvas = document.getElementById('particlesCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();
  
        window.addEventListener('resize', () => this.resize(), { passive: true });
      },
  
      resize() {
        const hero = document.querySelector('.hero');
        if (!hero || !this.canvas) return;
        this.canvas.width  = hero.offsetWidth;
        this.canvas.height = hero.offsetHeight;
        // Recria partículas ao redimensionar
        if (this.particles.length) {
          this.particles = [];
          this.createParticles();
        }
      },
  
      createParticles() {
        const { count, colors, minRadius, maxRadius, minSpeed, maxSpeed } = this.config;
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: minRadius + Math.random() * (maxRadius - minRadius),
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * (minSpeed + Math.random() * (maxSpeed - minSpeed)) * 2,
            vy: (Math.random() - 0.5) * (minSpeed + Math.random() * (maxSpeed - minSpeed)) * 2,
            opacity: 0.15 + Math.random() * 0.55,
            pulseSpeed: 0.01 + Math.random() * 0.02,
            pulseOffset: Math.random() * Math.PI * 2,
            life: 0,
          });
        }
      },
  
      drawConnections() {
        const { connectionDistance, connectionOpacity } = this.config;
        const ctx = this.ctx;
        const count = this.particles.length;
  
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            const dx = this.particles[i].x - this.particles[j].x;
            const dy = this.particles[i].y - this.particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
  
            if (dist < connectionDistance) {
              const alpha = connectionOpacity * (1 - dist / connectionDistance);
              ctx.beginPath();
              ctx.moveTo(this.particles[i].x, this.particles[i].y);
              ctx.lineTo(this.particles[j].x, this.particles[j].y);
              ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      },
  
      animate() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
  
        ctx.clearRect(0, 0, w, h);
        this.drawConnections();
  
        this.particles.forEach(p => {
          p.life += 0.016;
  
          // Pulse opacity
          const pulseOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.life * p.pulseSpeed * 60 + p.pulseOffset));
  
          // Move
          p.x += p.vx;
          p.y += p.vy;
  
          // Wrap around edges
          if (p.x < -p.radius) p.x = w + p.radius;
          if (p.x > w + p.radius) p.x = -p.radius;
          if (p.y < -p.radius) p.y = h + p.radius;
          if (p.y > h + p.radius) p.y = -p.radius;
  
          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.round(pulseOpacity * 255).toString(16).padStart(2, '0');
          ctx.fill();
        });
  
        this.animId = requestAnimationFrame(() => this.animate());
      },
    };
  
  
    /* ============================================================
       2. NAVBAR SCROLL
       Comportamento sticky com visual dinâmico no scroll
    ============================================================ */
  
    const Navbar = {
      el: null,
      lastScrollY: 0,
      ticking: false,
  
      init() {
        this.el = document.getElementById('navbar');
        if (!this.el) return;
  
        window.addEventListener('scroll', () => {
          this.lastScrollY = window.scrollY;
          if (!this.ticking) {
            requestAnimationFrame(() => {
              this.update();
              this.ticking = false;
            });
            this.ticking = true;
          }
        }, { passive: true });
      },
  
      update() {
        if (!this.el) return;
        if (this.lastScrollY > 40) {
          this.el.classList.add('scrolled');
        } else {
          this.el.classList.remove('scrolled');
        }
      },
    };
  
  
    /* ============================================================
       3. MOBILE MENU
       Toggle responsivo com animação suave
    ============================================================ */
  
    const MobileMenu = {
      toggle: null,
      menu: null,
      links: null,
      isOpen: false,
  
      init() {
        this.toggle = document.getElementById('mobileToggle');
        this.menu   = document.getElementById('mobileMenu');
        if (!this.toggle || !this.menu) return;
        this.links  = this.menu.querySelectorAll('.mobile-link, .btn-primary');
  
        this.toggle.addEventListener('click', () => this.toggleMenu());
  
        // Fechar ao clicar em links
        this.links.forEach(link => {
          link.addEventListener('click', () => this.closeMenu());
        });
  
        // Fechar ao clicar fora
        document.addEventListener('click', e => {
          if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
            this.closeMenu();
          }
        });
  
        // Fechar ao pressionar Escape
        document.addEventListener('keydown', e => {
          if (e.key === 'Escape' && this.isOpen) this.closeMenu();
        });
      },
  
      toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
      },
  
      openMenu() {
        this.isOpen = true;
        this.menu.classList.add('open');
        this.toggle.classList.add('open');
        this.toggle.setAttribute('aria-expanded', 'true');
        this.menu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      },
  
      closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('open');
        this.toggle.classList.remove('open');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      },
    };
  
  
    /* ============================================================
       4. SCROLL REVEAL
       Animações de entrada ao scroll usando IntersectionObserver
    ============================================================ */
  
    const ScrollReveal = {
      observer: null,
  
      init() {
        // Verifica suporte
        if (!('IntersectionObserver' in window)) {
          // Fallback: mostra todos os elementos imediatamente
          document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('revealed'));
          return;
        }
  
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Parar de observar após revelar
                this.observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px',
          }
        );
  
        document.querySelectorAll('.reveal-up').forEach(el => {
          this.observer.observe(el);
        });
      },
    };
  
  
    /* ============================================================
       5. ANIMATED COUNTERS
       Conta animada dos números de estatísticas
    ============================================================ */
  
    const Counters = {
      observer: null,
  
      init() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;
  
        if (!('IntersectionObserver' in window)) {
          counters.forEach(el => this.setFinalValue(el));
          return;
        }
  
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.animateCounter(entry.target);
                this.observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 }
        );
  
        counters.forEach(el => this.observer.observe(el));
      },
  
      setFinalValue(el) {
        const count  = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        el.textContent = count + suffix;
      },
  
      animateCounter(el) {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();
  
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  
        const tick = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOut(progress);
          const currentValue = Math.floor(easedProgress * target);
  
          el.textContent = currentValue + suffix;
  
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target + suffix;
          }
        };
  
        requestAnimationFrame(tick);
      },
    };
  
  
    /* ============================================================
       6. TABS
       Sistema de abas para tipos de transação
    ============================================================ */
  
    const Tabs = {
      init() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        if (!tabBtns.length) return;
  
        tabBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            this.activate(tabId);
          });
  
          // Suporte a teclado
          btn.addEventListener('keydown', (e) => {
            const btns = Array.from(tabBtns);
            const idx  = btns.indexOf(btn);
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              btns[(idx + 1) % btns.length].click();
              btns[(idx + 1) % btns.length].focus();
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              btns[(idx - 1 + btns.length) % btns.length].click();
              btns[(idx - 1 + btns.length) % btns.length].focus();
            }
          });
        });
      },
  
      activate(tabId) {
        // Deactivate all
        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.remove('active');
        });
  
        // Activate target
        const activeBtn   = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const activePanel = document.getElementById(`tab-${tabId}`);
  
        if (activeBtn) {
          activeBtn.classList.add('active');
          activeBtn.setAttribute('aria-selected', 'true');
        }
        if (activePanel) {
          activePanel.classList.add('active');
        }
      },
    };
  
  
    /* ============================================================
       7. BACK TO TOP
       Botão flutuante que aparece após scroll
    ============================================================ */
  
    const BackToTop = {
      btn: null,
  
      init() {
        this.btn = document.getElementById('backToTop');
        if (!this.btn) return;
  
        window.addEventListener('scroll', () => {
          if (window.scrollY > 400) {
            this.btn.classList.add('visible');
          } else {
            this.btn.classList.remove('visible');
          }
        }, { passive: true });
  
        this.btn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      },
    };
  
  
    /* ============================================================
       8. CTA FORM
       Validação e submissão do formulário de e-mail
    ============================================================ */
  
    const CTAForm = {
      form: null,
      input: null,
      submitBtn: null,
  
      init() {
        this.form      = document.getElementById('ctaForm');
        this.input     = document.getElementById('cta-email');
        this.submitBtn = this.form ? this.form.querySelector('.cta-submit') : null;
  
        if (!this.form) return;
  
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit();
        });
      },
  
      isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
  
      handleSubmit() {
        const email = this.input.value.trim();
  
        if (!email) {
          this.showError('Por favor, insira seu e-mail.');
          return;
        }
  
        if (!this.isValidEmail(email)) {
          this.showError('E-mail inválido. Tente novamente.');
          return;
        }
  
        // Simulação de submissão
        this.setLoading(true);
  
        setTimeout(() => {
          this.setLoading(false);
          this.showSuccess();
        }, 1500);
      },
  
      setLoading(isLoading) {
        if (!this.submitBtn) return;
        if (isLoading) {
          this.submitBtn.textContent = 'Aguarde...';
          this.submitBtn.disabled = true;
          this.submitBtn.style.opacity = '0.7';
        } else {
          this.submitBtn.textContent = 'Começar Grátis →';
          this.submitBtn.disabled = false;
          this.submitBtn.style.opacity = '1';
        }
      },
  
      showError(msg) {
        this.clearFeedback();
        const err = document.createElement('p');
        err.textContent = '⚠️ ' + msg;
        err.style.cssText = 'color:#F97316;font-size:13px;margin-top:8px;text-align:center;animation:fadeIn 0.3s ease;';
        err.className = 'form-feedback';
        this.form.appendChild(err);
        this.input.style.border = '1px solid rgba(249,115,22,0.5)';
  
        setTimeout(() => this.clearFeedback(), 3000);
      },
  
      showSuccess() {
        this.clearFeedback();
        const success = document.createElement('p');
        success.textContent = '🎉 Incrível! Acesso enviado para o seu e-mail.';
        success.style.cssText = 'color:#10B981;font-size:14px;font-weight:600;margin-top:12px;text-align:center;animation:fadeIn 0.4s ease;';
        success.className = 'form-feedback';
        this.form.appendChild(success);
        this.input.value = '';
        this.input.style.border = '';
      },
  
      clearFeedback() {
        document.querySelectorAll('.form-feedback').forEach(el => el.remove());
        if (this.input) this.input.style.border = '';
      },
    };
  
  
    /* ============================================================
       9. BOOK CARDS INTERACTIONS
       Efeitos de hover 3D nas cards de livros
    ============================================================ */
  
    const BookCards = {
      init() {
        const cards = document.querySelectorAll('.showcase-card, .step-card, .benefit-card');
  
        cards.forEach(card => {
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
  
            const rotateX = y * -6;
            const rotateY = x *  6;
  
            card.style.transform = `
              translateY(-4px)
              perspective(600px)
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
            `;
          });
  
          card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => { card.style.transition = ''; }, 500);
          });
        });
      },
    };
  
  
    /* ============================================================
       10. SMOOTH ANCHOR SCROLL
       Scroll suave para âncoras internas
    ============================================================ */
  
    const SmoothScroll = {
      init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
          link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
  
            const target = document.querySelector(href);
            if (!target) return;
  
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
      },
    };
  
  
    /* ============================================================
       11. PROGRESS BAR ANIMATION
       Anima a barra de progresso quando entra na viewport
    ============================================================ */
  
    const ProgressBar = {
      init() {
        const bar = document.querySelector('.progress-fill');
        if (!bar) return;
  
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Força reflow para animar do 0
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    bar.style.width = bar.style.getPropertyValue('--progress') || '77%';
                  });
                });
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );
  
        observer.observe(bar);
      },
    };
  
  
    /* ============================================================
       12. BADGE CARDS HOVER GLOW
       Efeito de brilho dinâmico nas badge cards
    ============================================================ */
  
    const BadgeGlow = {
      init() {
        document.querySelectorAll('.badge-card').forEach((card, idx) => {
          const colors = ['#F97316', '#2563EB', '#10B981', '#F97316', '#7C3AED', '#EC4899'];
          const color = colors[idx % colors.length];
  
          card.addEventListener('mouseenter', () => {
            card.style.boxShadow = `0 16px 48px ${color}22`;
            card.style.borderColor = `${color}44`;
          });
  
          card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
            card.style.borderColor = '';
          });
        });
      },
    };
  
  
    /* ============================================================
       13. FLOATING BOOKS PARALLAX
       Leve efeito parallax nas book cards do hero com mouse
    ============================================================ */
  
    const BookParallax = {
      heroVisual: null,
      books: null,
  
      init() {
        this.heroVisual = document.querySelector('.hero-visual');
        this.books = document.querySelectorAll('.book-float');
        if (!this.heroVisual || !this.books.length) return;
  
        // Apenas em dispositivos com mouse (não touch)
        if (window.matchMedia('(hover: hover)').matches) {
          document.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
        }
      },
  
      handleMouseMove(e) {
        const x = (e.clientX / window.innerWidth  - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
  
        this.books.forEach((book, i) => {
          const depth  = 0.3 + (i * 0.1);
          const moveX  = x * 8 * depth;
          const moveY  = y * 4 * depth;
  
          // Preserva a animação de float, adiciona apenas translação extra
          book.style.setProperty('--px', `${moveX}px`);
          book.style.setProperty('--py', `${moveY}px`);
        });
      },
    };
  
  
    /* ============================================================
       14. LEADERBOARD HIGHLIGHT
       Animação de entrada na leaderboard
    ============================================================ */
  
    const Leaderboard = {
      init() {
        const items = document.querySelectorAll('.leaderboard-item');
        if (!items.length) return;
  
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              items.forEach((item, i) => {
                setTimeout(() => {
                  item.style.opacity = '0';
                  item.style.transform = 'translateX(-16px)';
                  requestAnimationFrame(() => {
                    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                  });
                }, i * 80);
              });
              observer.disconnect();
            }
          },
          { threshold: 0.4 }
        );
  
        const leaderboard = document.querySelector('.leaderboard');
        if (leaderboard) observer.observe(leaderboard);
      },
    };
  
  
    /* ============================================================
       15. TYPEWRITER EFFECT
       Efeito de digitação no hero badge
    ============================================================ */
  
    const Typewriter = {
      phrases: [
        '+142.000 leitores ativos · Plataforma gratuita',
        'Empreste · Doe · Venda · Troque livros',
        'Conecte-se com leitores da sua cidade',
      ],
      currentPhrase: 0,
      currentChar: 0,
      isDeleting: false,
      el: null,
      speed: {
        type: 45,
        delete: 22,
        pause: 2200,
      },
  
      init() {
        this.el = document.querySelector('.hero-badge span:last-child');
        if (!this.el) return;
        // Inicia após um delay para não conflitar com a reveal animation
        setTimeout(() => this.tick(), 2500);
      },
  
      tick() {
        const phrase = this.phrases[this.currentPhrase];
        const speed  = this.isDeleting ? this.speed.delete : this.speed.type;
  
        if (!this.isDeleting) {
          this.currentChar++;
          this.el.textContent = phrase.slice(0, this.currentChar);
  
          if (this.currentChar === phrase.length) {
            // Pausa no final antes de apagar
            setTimeout(() => {
              this.isDeleting = true;
              this.tick();
            }, this.speed.pause);
            return;
          }
        } else {
          this.currentChar--;
          this.el.textContent = phrase.slice(0, this.currentChar);
  
          if (this.currentChar === 0) {
            this.isDeleting = false;
            this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
          }
        }
  
        setTimeout(() => this.tick(), speed + Math.random() * 30);
      },
    };
  
  
    /* ============================================================
       16. INIT — Inicializa todos os módulos
    ============================================================ */
  
    function init() {
      // Partículas (hero visual)
      ParticleSystem.init();
  
      // Navbar comportamento
      Navbar.init();
  
      // Menu mobile
      MobileMenu.init();
  
      // Scroll reveal (IntersectionObserver)
      ScrollReveal.init();
  
      // Contadores animados
      Counters.init();
  
      // Sistema de abas
      Tabs.init();
  
      // Botão voltar ao topo
      BackToTop.init();
  
      // Formulário CTA
      CTAForm.init();
  
      // Cards 3D hover
      BookCards.init();
  
      // Scroll suave em âncoras
      SmoothScroll.init();
  
      // Barra de progresso animada
      ProgressBar.init();
  
      // Brilho nas badges
      BadgeGlow.init();
  
      // Parallax nos livros flutuantes
      BookParallax.init();
  
      // Leaderboard entrada animada
      Leaderboard.init();
  
      // Typewriter no hero badge
      Typewriter.init();
    }
  
    // Aguarda DOM pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  
  })();