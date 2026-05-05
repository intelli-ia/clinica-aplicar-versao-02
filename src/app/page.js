"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as fpixel from '@/lib/fpixel';
import ScrollExpandMedia from '@/components/ScrollExpandMedia';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navLight, setNavLight] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const testimonials = document.getElementById('testimonials');
      const about = document.getElementById('about');
      const navbar = document.querySelector('.navbar');

      setNavVisible(window.scrollY > window.innerHeight * 0.85);

      if (!navbar) return;

      const navRect = navbar.getBoundingClientRect();
      const navMid = navRect.top + navRect.height / 2;

      const isOverLight = (el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return navMid >= rect.top && navMid <= rect.bottom;
      };

      if (isOverLight(testimonials) || isOverLight(about)) {
        setNavLight(true);
      } else {
        setNavLight(false);
      }
    };
    // Reveal geral (exclui itens do roadmap — tratados por IntersectionObserver)
    const reveals = document.querySelectorAll('.reveal:not(.roadmap-item)');
    const roadmapTrack = document.querySelector('.roadmap-track');
    const roadmapLine = document.querySelector('.roadmap-line');

    const handleScrollEffects = () => {
      reveals.forEach(reveal => {
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < window.innerHeight - 120) {
          reveal.classList.add('active');
        }
      });

      // Linha do roadmap acompanha o scroll bidirecionalmente
      if (roadmapTrack && roadmapLine) {
        const trackTop = roadmapTrack.getBoundingClientRect().top;
        const trackHeight = roadmapTrack.offsetHeight;
        const startPoint = window.innerHeight * 0.65;
        let progress = (startPoint - trackTop) / trackHeight;
        progress = Math.max(0, Math.min(progress, 1));
        roadmapLine.style.transform = `translateX(-50%) scaleY(${progress})`;
      }
    };

    // IntersectionObserver para itens do roadmap — garante animação mesmo quando já estão visíveis
    const roadmapItems = document.querySelectorAll('.roadmap-item.reveal');
    let roadmapObserver;
    if (roadmapItems.length && 'IntersectionObserver' in window) {
      roadmapObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              roadmapObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
      );
      roadmapItems.forEach(item => roadmapObserver.observe(item));
    }

    window.addEventListener('scroll', handleScrollEffects);
    window.addEventListener('scroll', handleScroll);
    handleScrollEffects();
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScrollEffects);
      window.removeEventListener('scroll', handleScroll);
      if (roadmapObserver) roadmapObserver.disconnect();
    };
  }, []);

  const faqs = [
    {
      question: "1. Como funciona a avaliação inicial?",
      answer: "A avaliação comportamental é o primeiro passo. Nossa equipe analisa o repertório atual da criança, identifica necessidades específicas e traça um plano de intervenção personalizado. Tudo é feito com acolhimento e transparência total com a família."
    },
    {
      question: "2. Vocês atendem plano de saúde?",
      answer: "Trabalhamos com reembolso de planos de saúde e também orientamos famílias sobre como solicitar liminares quando necessário. Entre em contato para entender como funciona no seu caso específico."
    },
    {
      question: "3. Vocês atendem em todo o Brasil?",
      answer: "Sim. Além dos atendimentos presenciais na clínica e em São Paulo, realizamos intervenções em outros estados quando necessário, adaptando nossa estrutura à realidade de cada família."
    },
    {
      question: "4. Vocês atendem em domicílio/outros lugares?",
      answer: "Sim, e esse é um dos nossos diferenciais. Atendemos em casa, restaurantes, supermercados, escola, casa de familiares — onde quer que seu filho precise desenvolver habilidades para a vida real."
    },
    {
      question: "5. A partir de qual idade podem começar?",
      answer: "Trabalhamos com crianças a partir dos primeiros sinais de atraso no desenvolvimento. Quanto mais cedo iniciamos a intervenção, melhores os resultados. Também atendemos adolescentes."
    },
    {
      question: "6. Qual a diferença da ABA para outras terapias?",
      answer: "ABA (Análise do Comportamento Aplicada) é a abordagem com maior respaldo científico para TEA. Trabalhamos com base em evidências, protocolos validados e metas mensuráveis — sempre adaptados à individualidade de cada criança."
    },
    {
      question: "7. Como sei se meu filho precisa de intervenção ABA?",
      answer: "Se você percebe atrasos na comunicação, dificuldades de interação social, comportamentos repetitivos ou seletividade alimentar severa, uma avaliação pode trazer clareza. Entre em contato e vamos conversar sobre o caso."
    },
    {
      question: "8. Quanto tempo dura o tratamento?",
      answer: "Cada criança tem seu próprio ritmo. O tratamento é contínuo e evolui conforme os avanços. Trabalhamos com metas claras e reavaliações periódicas para garantir progresso constante."
    },
    {
      question: "9. Vocês atendem casos de seletividade alimentar severa?",
      answer: "Sim. Temos protocolos exclusivos desenvolvidos ao longo de 20 anos especificamente para seletividade alimentar, com alto índice de sucesso. A intervenção acontece nos ambientes reais: restaurantes, casa, festas."
    }
  ];

  const testimonials = [
    { name: "Família Silva", city: "São Paulo - SP", text: "A Clínica Aplicar mudou a rotina da nossa casa. Hoje meu filho consegue se comunicar e expressar o que sente com clareza.", image: "/perfil_1.png" },
    { name: "Família Oliveira", city: "Campinas - SP", text: "A abordagem que vai além do consultório fez toda a diferença na adaptação escolar do nosso pequeno.", image: "/perfil_2.png" },
    { name: "Família Santos", city: "Rio de Janeiro - RJ", text: "Resultados reais e um suporte humanizado em cada etapa do diagnóstico. A equipe é extraordinária.", image: "/perfil_3.png" }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${navVisible ? 'visible' : ''} ${menuOpen ? 'open' : ''} ${navLight ? 'nav-light' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <Image src="/logo.png" alt="Clínica Aplicar" width={180} height={60} priority />
          </div>
          <div className="nav-right-actions">
            <ul className="nav-links">
              <li><a href="#manifesto">A Clínica</a></li>
              <li><a href="#about">Quem Somos</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
            <div className="nav-cta">
              <a 
                href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-sm btn-glass"
                onClick={() => fpixel.event('Lead')}
              >
                Agendar
              </a>
            </div>
          </div>
          {/* Hamburger Button - only visible on mobile */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {/* Mobile Menu Drawer */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#manifesto" onClick={() => setMenuOpen(false)}>A Clínica</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)}>Quem Somos</a></li>
            <li><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a></li>
            <li><a href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="mobile-menu-cta" onClick={() => { setMenuOpen(false); fpixel.event('Lead'); }}>Agendar consulta</a></li>
          </ul>
        </div>
      </nav>

      {/* D1 - Hero */}
      <section className="hero">
        <Image
          src="/hero_hq.jpg"
          alt="Clínica Aplicar Hero"
          fill
          priority
          quality={100}
          className="hero-bg-image pc-only"
        />
        <Image
          src="/hero_mobile.png"
          alt="Clínica Aplicar Hero Mobile"
          fill
          priority
          quality={100}
          className="hero-bg-image mobile-only"
        />

        <div className="hero-content">
          <span className="hero-eyebrow">CLÍNICA APLICAR</span>
          <h1>
            <span className="hero-line">Transforme a </span>
            <span className="hero-line">incerteza <br className="pc-only" />em um </span>
            <span className="hero-line"><span className="highlight">plano claro</span> para o </span>
            <span className="hero-line">desenvolvimento </span>
            <span className="hero-line">do seu filho</span>
          </h1>
          <h2 className="hero-description">
            Tenha diagnóstico preciso, tratamento especializado e um caminho claro para o desenvolvimento do seu filho
          </h2>
          <div className="hero-btns">
            <a 
              href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              onClick={() => fpixel.event('Lead')}
            >
              Fale conosco
            </a>
            <a href="#manifesto" className="btn btn-secondary">Saiba mais</a>
          </div>

          <div className="hero-social-proof">
            <div className="avatar-group">
              {[
                'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=80&h=80&fit=crop&crop=entropy&auto=format&q=80',
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=80&h=80&fit=crop&crop=entropy&auto=format&q=80',
                'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=80&h=80&fit=crop&crop=entropy&auto=format&q=80',
                'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=80&h=80&fit=crop&crop=entropy&auto=format&q=80',
              ].map((src, i) => (
                <div key={i} className="avatar">
                  <Image src={src} alt="Paciente atendido" width={40} height={40} />
                </div>
              ))}
            </div>
            <div className="proof-text">
              <strong>+20 anos de Experiência</strong>
              <span>Centenas de Crianças atendidas</span>
            </div>
          </div>
        </div>

      </section>

      {/* D2 - Manifesto (ScrollExpandMedia) */}
      <ScrollExpandMedia
        id="manifesto"
        mediaSrc="https://cdn.coverr.co/videos/coverr-children-playing-at-salote-lake-5028/720p.mp4"
        bgImageSrc="/hero_bg.jpg"
        titleLeft="O diagnóstico não define o futuro do seu filho."
        titleRight="O tratamento, sim."
        scrollToExpand="Role para descobrir"
      >
        <div className="manifesto-body">
          <p>Você não precisa aceitar promessas vazias ou informações conflitantes.</p>
          <p>
            Há mais de 20 anos, nós da Clínica Aplicar entregamos resultados reais: crianças
            desenvolvendo autonomia, se comunicando melhor e construindo uma vida com qualidade.
          </p>
          <p>
            Nossa abordagem é baseada em Análise do Comportamento Aplicada (ABA), ciência
            comprovada, adaptada à realidade de cada família.
          </p>
          <p>
            Não trabalhamos apenas em consultório. Trabalhamos onde a vida acontece: em casa,
            na escola, na casa da avó, no shopping, no dia a dia.
          </p>
          <p className="manifesto-closing">
            Porque desenvolvimento não é sobre corrigir. É sobre construir.
          </p>
          <div className="manifesto-cta">
            <a
              href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={() => fpixel.event('Lead')}
            >
              Fale conosco
            </a>
          </div>
        </div>
      </ScrollExpandMedia>

      {/* D3 - Roadmap */}
      <section className="roadmap-section" id="valores">
        <div className="roadmap-header">
          <span className="roadmap-label">— PASSO A PASSO —</span>
          <h1>Veja como é simples o processo</h1>
        </div>

        <div className="roadmap-track">
          <div className="roadmap-line" />

          {/* Passo 1 - Esquerda */}
          <div className="roadmap-item left reveal">
            <div className="roadmap-card">
              <h3>Primeiro contato</h3>
              <p>Clique no botão e entre em contato pelo WhatsApp. Vamos entender o momento do seu filho e agendar uma conversa.</p>
            </div>
            <div className="roadmap-node"><span>01</span></div>
            <div className="roadmap-spacer" />
          </div>

          {/* Passo 2 - Direita */}
          <div className="roadmap-item right reveal">
            <div className="roadmap-spacer" />
            <div className="roadmap-node"><span>02</span></div>
            <div className="roadmap-card">
              <h3>Reunião inicial</h3>
              <p>Conhecemos você, ouvimos sua história e apresentamos nossa abordagem e a proposta de acompanhamento.</p>
            </div>
          </div>

          {/* Passo 3 - Esquerda */}
          <div className="roadmap-item left reveal">
            <div className="roadmap-card">
              <h3>Avaliação comportamental</h3>
              <p>Nossa equipe avalia as habilidades e necessidades do seu filho para criar um plano personalizado.</p>
            </div>
            <div className="roadmap-node"><span>03</span></div>
            <div className="roadmap-spacer" />
          </div>

          {/* Passo 4 - Direita */}
          <div className="roadmap-item right reveal">
            <div className="roadmap-spacer" />
            <div className="roadmap-node roadmap-node--check"><span>✓</span></div>
            <div className="roadmap-card">
              <h3>Início do tratamento</h3>
              <p>Começa a intervenção ABA, com acompanhamento contínuo e suporte para toda a família.</p>
            </div>
          </div>
        </div>
      </section>


      {/* D4 - CTA Jornada */}
      <section className="cta-v4 reveal">
        <div className="cta-container-v4">
          <div className="cta-content-v4">
            <h1>
              <span style={{ display: 'block' }}>São mais de 20 anos de dedicação ao</span>
              <span style={{ display: 'block' }}>desenvolvimento infantil e</span>
              <span style={{ display: 'block' }}>centenas de famílias realizadas.</span>
            </h1>

            <h2>Não continue sozinha, dê o primeiro passo para a transformação que seu filho merece.</h2>

            <div className="cta-action-v4">
              <a
                href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cta-on-orange"
                onClick={() => fpixel.event('Lead')}
              >
                Falar conosco agora
              </a>
            </div>

            <div className="cta-v4-badges">
              <span className="cta-v4-badge">✓ Reunião gratuita de diagnóstico</span>
              <span className="cta-v4-badge">✓ 30 a 60 min · sem compromisso</span>
            </div>
          </div>
        </div>
      </section>

      {/* D5 - Quem Somos (Premium) */}
      <section className="about-premium-section" id="about">
        <div className="about-premium-inner">

          {/* Coluna esquerda — texto */}
          <div className="about-premium-left reveal">
            <span className="about-eyebrow">— Clínica Aplicar</span>
            <h1>Quem <span className="highlight-alt">somos</span></h1>

            <p>A Clínica Aplicar nasceu há mais de 20 anos com uma missão clara: transformar vidas através da ciência do comportamento aplicada com humanidade.</p>

            <p>Fundada pela Dra. Karina Roig Gatto — psicóloga e mestre com duas décadas de experiência em TEA — reunimos uma equipe multidisciplinar especializada em Análise do Comportamento Aplicada (ABA) e desenvolvimento infantil.</p>

            <p>Não limitamos o atendimento ao consultório. Vamos até a casa, o restaurante, o supermercado, a escola — onde quer que seu filho precise desenvolver habilidades reais para a vida real.</p>

            <p>Com protocolos exclusivos e abordagem personalizada, já transformamos a rotina de centenas de famílias, promovendo autonomia, comunicação e qualidade de vida.</p>

            <div className="about-accent-line" />

            <blockquote className="about-manifesto">
              Porque desenvolvimento acontece na vida, não só na terapia.
            </blockquote>

            <div className="about-stats-row">
              <div className="about-stat-card">
                <strong>+20 anos</strong>
                <span>de experiência</span>
              </div>
              <div className="about-stat-card">
                <strong>centenas</strong>
                <span>de famílias realizadas</span>
              </div>
            </div>

            <a
              href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={() => fpixel.event('Lead')}
            >
              Quero esse tipo de cuidado
            </a>
          </div>

          {/* Coluna direita — foto */}
          <div className="about-premium-right">
            <div className="about-photo-wrap">
              <div className="about-photo-bg-accent" />
              <Image
                src="/dra_karina.jpg"
                alt="Dra. Karina Roig Gatto - Clínica Aplicar"
                width={620}
                height={780}
                className="about-photo-img"
              />
              <div className="about-photo-badge">
                <span className="about-badge-name">Dra. Karina Roig Gatto</span>
                <span className="about-badge-title">Psicóloga · Mestre em TEA</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* D6 - FAQ (Split Edition) */}
      <section className="faq-split-v8 reveal" id="faq">
        <div className="faq-container-v8">
          <div className="faq-sidebar-v8">
            <div className="faq-header-v8">
              <h1>Perguntas <br /><span>Frequentes</span></h1>
              <p>Aqui você encontra as principais dúvidas sobre os nossos atendimentos.</p>
            </div>
            <div className="faq-support-v8">
              <a 
                href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                onClick={() => fpixel.event('Lead')}
              >
                Falar com suporte
              </a>
            </div>
          </div>

          <div className="faq-content-v8">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item-v8 ${activeFaq === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question-v8">
                  <h3>{faq.question}</h3>
                  <span className="faq-icon-v8">{activeFaq === index ? '−' : '+'}</span>
                </div>
                <div className="faq-answer-v8">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <Image src="/logo.png" alt="Logo Clínica Aplicar" width={120} height={50} className="footer-logo" />
          </div>
          <div className="footer-right">
            <p>© 2026 Clínica Aplicar. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
