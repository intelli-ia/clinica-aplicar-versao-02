"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as fpixel from '@/lib/fpixel';

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
      question: "1. O que é seletividade alimentar?",
      answer: "Seletividade alimentar é uma dificuldade relacionada à aceitação, variedade ou forma como a criança se relaciona com os alimentos. Ela pode aparecer como um repertório muito restrito, recusa de texturas, marcas, cores ou preparos específicos. Cada caso precisa ser compreendido individualmente."
    },
    {
      question: "2. Meu filho come poucos alimentos. Isso significa que ele tem seletividade alimentar?",
      answer: "Nem toda recusa alimentar tem a mesma causa. Uma conversa com a família e uma avaliação individualizada ajudam a entender o repertório atual da criança, o contexto das refeições e quais necessidades devem ser consideradas."
    },
    {
      question: "3. O acompanhamento serve para obrigar a criança a comer?",
      answer: "Não. O objetivo é compreender a dificuldade e construir estratégias graduais, respeitando as características da criança e orientando a família sobre como lidar com a alimentação de forma mais clara e possível na rotina."
    },
    {
      question: "4. Como funciona a avaliação inicial?",
      answer: "A equipe conversa com os responsáveis sobre a história da criança, os alimentos aceitos e recusados, a rotina das refeições e as principais preocupações da família. A partir dessas informações, são definidos os próximos passos e o plano de acompanhamento."
    },
    {
      question: "5. A partir de qual idade a Clínica Aplicar atende?",
      answer: "A Clínica Aplicar acompanha crianças e adolescentes. Entre em contato para entender se o atendimento é indicado para a idade e as necessidades do seu filho."
    },
    {
      question: "6. O atendimento acontece apenas no consultório?",
      answer: "O formato depende da avaliação e da proposta de acompanhamento. Quando necessário, o trabalho pode considerar ambientes da rotina da criança, como casa, escola ou restaurante."
    },
    {
      question: "7. Quanto tempo dura o acompanhamento?",
      answer: "A duração varia de acordo com as necessidades da criança, os objetivos definidos e a evolução observada ao longo do processo. A equipe explica as etapas e reavalia o planejamento quando necessário."
    },
    {
      question: "8. Vocês atendem por plano de saúde?",
      answer: "A Clínica Aplicar trabalha com reembolso de planos de saúde, conforme as condições de cada contrato. Fale com a equipe para entender como funciona no seu caso."
    },
    {
      question: "9. Como faço para saber se o acompanhamento é indicado para o meu filho?",
      answer: "O primeiro passo é conversar com a equipe e explicar o que acontece nas refeições, quais alimentos a criança aceita ou recusa e quais são as principais dificuldades da família. A partir disso, vocês recebem orientação sobre o próximo passo."
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
            <span className="hero-line">Avaliação e </span>
            <span className="hero-line">acompanhamento para </span>
            <span className="hero-line"><span className="highlight">seletividade alimentar</span> </span>
            <span className="hero-line">infantil</span>
          </h1>
          <h2 className="hero-description">
            Seu filho come poucos alimentos, recusa novas texturas ou vive momentos difíceis nas refeições? Tenha apoio especializado para entender a seletividade alimentar e construir um caminho possível para a rotina da sua família.
          </h2>
          <div className="hero-btns">
            <a 
              href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              onClick={() => fpixel.event('Lead')}
            >
              Agendar conversa sobre seletividade alimentar
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

      {/* D2 - Manifesto */}
      <section className="manifesto-section" id="manifesto">
        <div className="manifesto-body">
          <h1>
            Seletividade alimentar não se resolve com pressão.{' '}
            <span className="highlight-alt">Se resolve com compreensão e acompanhamento.</span>
          </h1>

          <p>
            Quando a criança aceita poucos alimentos, recusa determinadas texturas ou não tolera
            mudanças no preparo das refeições, a alimentação pode se tornar uma fonte de
            preocupação para toda a família.
          </p>
          <p>
            Você não precisa lidar sozinho com recusas, insegurança e conflitos na hora de comer.
          </p>
          <p>
            Antes de definir qualquer estratégia, é importante entender o repertório alimentar da
            criança, sua rotina, o contexto das refeições e os fatores que podem estar
            relacionados a essa dificuldade.
          </p>
          <p>
            Na Clínica Aplicar, o acompanhamento começa com escuta e avaliação individualizada.
            Nossa equipe compreende as necessidades da criança e constrói estratégias que façam
            sentido para a realidade de cada família.
          </p>
          <p>
            O trabalho não se limita ao consultório. As estratégias precisam funcionar em casa,
            na escola, em restaurantes, em festas e nos demais ambientes em que a criança vive.
          </p>
          <p className="manifesto-closing">
            Porque ampliar a relação com a alimentação não é sobre obrigar. É sobre construir
            novos caminhos.
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
      </section>

      {/* D3 - Roadmap */}
      <section className="roadmap-section" id="valores">
        <div className="roadmap-header">
          <span className="roadmap-label">— PASSO A PASSO —</span>
          <h1>Veja como funciona o acompanhamento para seletividade alimentar</h1>
        </div>

        <div className="roadmap-track">
          <div className="roadmap-line" />

          {/* Passo 1 - Esquerda */}
          <div className="roadmap-item left reveal">
            <div className="roadmap-card">
              <h3>Primeiro contato</h3>
              <p>Clique no botão e entre em contato pelo WhatsApp. Vamos entender o momento da sua família e conhecer as principais dificuldades nas refeições.</p>
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
              <p>Conhecemos a história da criança, os alimentos que ela aceita ou recusa e como acontecem as refeições no dia a dia.</p>
            </div>
          </div>

          {/* Passo 3 - Esquerda */}
          <div className="roadmap-item left reveal">
            <div className="roadmap-card">
              <h3>Avaliação da alimentação</h3>
              <p>Nossa equipe avalia o repertório alimentar e as necessidades da criança para compreender a dificuldade e definir os próximos passos.</p>
            </div>
            <div className="roadmap-node"><span>03</span></div>
            <div className="roadmap-spacer" />
          </div>

          {/* Passo 4 - Direita */}
          <div className="roadmap-item right reveal">
            <div className="roadmap-spacer" />
            <div className="roadmap-node roadmap-node--check"><span>✓</span></div>
            <div className="roadmap-card">
              <h3>Plano de acompanhamento</h3>
              <p>A partir da avaliação, construímos estratégias personalizadas para a criança e orientações que possam ser aplicadas com mais clareza e segurança na rotina da família.</p>
            </div>
          </div>
        </div>
      </section>


      {/* D4 - CTA Jornada */}
      <section className="cta-v4 reveal">
        <div className="cta-container-v4">
          <div className="cta-content-v4">
            <h1>
              <span style={{ display: 'block' }}>Dê o primeiro passo para entender a</span>
              <span style={{ display: 'block' }}>seletividade alimentar do seu filho.</span>
            </h1>

            <h2>Você não precisa continuar lidando sozinha com as dificuldades nas refeições. Fale com a nossa equipe, conte o que está acontecendo e entenda como funciona o acompanhamento para a sua família.</h2>

            <div className="cta-action-v4">
              <a
                href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cta-on-orange"
                onClick={() => fpixel.event('Lead')}
              >
                Agendar conversa sobre seletividade alimentar
              </a>
            </div>

            <div className="cta-v4-badges">
              <span className="cta-v4-badge">✓ Reunião inicial gratuita</span>
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

            <p>Fundada pela Dra. Karina Roig Gatto — psicóloga e mestre com duas décadas de experiência em desenvolvimento infantil — reunimos uma equipe multidisciplinar dedicada a compreender cada criança de forma individualizada.</p>

            <p>No acompanhamento da seletividade alimentar, consideramos o repertório alimentar da criança, sua rotina, suas preferências e os desafios vividos pela família nas refeições.</p>

            <p>Nosso diferencial está em transformar objetivos terapêuticos em estratégias que façam sentido na vida real. Por isso, o acompanhamento pode considerar os ambientes em que a criança se alimenta, como casa, escola, restaurante e outros locais da rotina.</p>

            <div className="about-accent-line" />

            <blockquote className="about-manifesto">
              Porque uma orientação só é útil quando consegue fazer sentido no dia a dia.
            </blockquote>

            <div className="about-stats-row">
              <div className="about-stat-card">
                <strong>+20 anos</strong>
                <span>de desenvolvimento infantil</span>
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
