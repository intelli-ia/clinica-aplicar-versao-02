"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navLight, setNavLight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const testimonials = document.getElementById('testimonials');
      const about = document.getElementById('about');
      const navbar = document.querySelector('.navbar');
      
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
    // Timeline Line Fill functionality
    const reveals = document.querySelectorAll('.reveal');
    const timeline = document.querySelector('.timeline-container');
    const timelineLine = document.querySelector('.timeline-line');

    let maxProgress = 0;

    const handleScrollEffects = () => {
      // Existing Reveal effect
      reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
          reveal.classList.add('active');
        }
      });

      // New Timeline Line fill effect - ONE WAY
      if (timeline && timelineLine) {
        const windowHeight = window.innerHeight;
        const timelineTop = timeline.getBoundingClientRect().top;
        const timelineHeight = timeline.offsetHeight;

        const startPoint = windowHeight * 0.7; 
        let currentProgress = (startPoint - timelineTop) / timelineHeight;
        currentProgress = Math.max(0, Math.min(currentProgress, 1));

        // Only update if current scroll depth is greater than previous max
        if (currentProgress > maxProgress) {
          maxProgress = currentProgress;
          timelineLine.style.transform = `translateX(-50%) scaleY(${maxProgress})`;
        }
      }
    };

    window.addEventListener('scroll', handleScrollEffects);
    window.addEventListener('scroll', handleScroll);
    handleScrollEffects();
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScrollEffects);
      window.removeEventListener('scroll', handleScroll);
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
      <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
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
              <a href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-glass">Agendar</a>
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
            <li><a href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="mobile-menu-cta" onClick={() => setMenuOpen(false)}>Agendar consulta</a></li>
          </ul>
        </div>
      </nav>

      {/* D1 - Hero */}
      <section className="hero">
        {/* Imagem de fundo otimizada que segue o zoom/escala */}
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
            <a href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Fale conosco</a>
            <a href="#manifesto" className="btn btn-secondary">Saiba mais</a>
          </div>
        </div>

        {/* Ticker Infinito (Agora fixo na base da Hero) */}
        <div className="ticker-wrapper">
          <div className="ticker-content">
            <span>TRANSPARÊNCIA E ENTREGA</span>
            <span className="separator">•</span>
            <span>20+ ANOS DE RESULTADOS</span>
            <span className="separator">•</span>
            <span>CIÊNCIA ABA ADAPTADA</span>
            <span className="separator">•</span>
            <span>ONDE A VIDA ACONTECE</span>
            <span className="separator">•</span>
            <span>CONSTRUIR, NÃO CORRIGIR</span>
            <span className="separator">•</span>
            {/* Terceira repetição */}
            <span>TRANSPARÊNCIA E ENTREGA</span>
            <span className="separator">•</span>
            <span>20+ ANOS DE RESULTADOS</span>
            <span className="separator">•</span>
            <span>CIÊNCIA ABA ADAPTADA</span>
            <span className="separator">•</span>
            <span>ONDE A VIDA ACONTECE</span>
            <span className="separator">•</span>
            <span>CONSTRUIR, NÃO CORRIGIR</span>
            <span className="separator">•</span>
            {/* Quarta repetição */}
            <span>TRANSPARÊNCIA E ENTREGA</span>
            <span className="separator">•</span>
            <span>20+ ANOS DE RESULTADOS</span>
            <span className="separator">•</span>
            <span>CIÊNCIA ABA ADAPTADA</span>
            <span className="separator">•</span>
            <span>ONDE A VIDA ACONTECE</span>
            <span className="separator">•</span>
            <span>CONSTRUIR, NÃO CORRIGIR</span>
            <span className="separator">•</span>
          </div>
        </div>
      </section>
      <section className="manifesto-timeline reveal" id="manifesto">
        <div className="section-header">
          <h1>O diagnóstico não define o futuro do seu filho. <br /> <span className="highlight-alt">O tratamento, sim.</span></h1>
          <p className="subtitle">Entenda como construímos resultados <br /> reais com a ciência ABA</p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {/* Item 1 - Esquerda */}
          <div className="timeline-item left reveal">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <h3>Transparência e Entrega</h3>
              <p>Você não precisa aceitar promessas vazias ou informações conflitantes. Entregamos clareza e resultados mensuráveis.</p>
            </div>
          </div>

          {/* Item 2 - Direita */}
          <div className="timeline-item right reveal">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <h3>20+ anos de Resultados</h3>
              <p>Entregamos autonomia e comunicação real para que seu filho construa uma vida com qualidade e independência.</p>
            </div>
          </div>

          {/* Item 3 - Esquerda */}
          <div className="timeline-item left reveal">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <h3>Ciência ABA Adaptada</h3>
              <p>Nossa base é a Análise do Comportamento Aplicada, adaptada integralmente à realidade e necessidades da sua família.</p>
            </div>
          </div>

          {/* Item 4 - Direita */}
          <div className="timeline-item right reveal">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <h3>Onde a Vida Acontece</h3>
              <p>Trabalhamos na casa, escola e ambientes reais. Onde quer que seu filho precise desenvolver habilidades para a vida.</p>
            </div>
          </div>

          {/* Item 5 - Esquerda */}
          <div className="timeline-item left reveal">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <h3>Construir, não Corrigir</h3>
              <p>Desenvolvimento não é sobre consertar o que está &quot;atrasado&quot;, mas sobre construir as bases de um futuro sólido.</p>
            </div>
          </div>
        </div>
      </section>


      {/* D4 - CTA Jornada */}
      <section className="cta-v4 reveal">
        <div className="cta-container-v4">
          <div className="cta-content-v4">
            <h1>Pronto para dar o <br /><span className="highlight-alt">próximo passo?</span></h1>
            
            <h2>Agende uma conversa com nossa equipe. Vamos entender o momento do seu filho e apresentar o melhor caminho para o desenvolvimento dele.</h2>
            
            <div className="cta-action-v4">
              <a href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn btn-cta-light">Fale conosco no WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* D5 - Quem Somos (Autoridade - Design Híbrido) */}
      <section className="about-v5-hybrid reveal" id="about">
        <div className="about-container-v5-hybrid">
          
          <div className="about-header-v5">
            <h1>Você já tentou de tudo para o <br /><span className="highlight-alt">desenvolvimento do seu filho:</span></h1>
          </div>
          
          <div className="about-content-v5-left">
            <p>Muitas famílias chegam até nós exaustas por não verem evolução real, sentindo que cada dia é um tempo precioso que não volta mais.</p>
            
            <div className="about-glass-card-v5-light">
              <p><strong>Na Clínica Aplicar, sob a liderança da Dra. Karina Roig Gatto — psicóloga e mestre com 20 anos de experiência — nós oferecemos ciência, escuta profunda e um caminho claro para a autonomia e comunicação do seu filho em ambientes reais.</strong></p>
            </div>

            <p>Não oferecemos atalhos, oferecemos acompanhamento real, com resultados visíveis, mas que respeitam a sua história e o seu tempo.</p>
            
            <div className="about-cta-v5">
              <a href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Quero esse tipo de cuidado</a>
            </div>
          </div>

          <div className="about-image-v5-right">
            <Image 
              src="/dra_karina.jpg" 
              alt="Dra. Karina Roig Gatto - Clínica Aplicar" 
              width={500} 
              height={600} 
              className="founder-photo-hybrid" 
            />
          </div>

        </div>
      </section>

      {/* D6 - FAQ (Grid Edition) */}
      <section className="faq-grid-v7 reveal" id="faq">
        <div className="faq-header-v7">
          <h1>Perguntas <span className="highlight-alt">Frequentes</span></h1>
          <p>Tire suas principais dúvidas sobre o atendimento na Clínica Aplicar</p>
        </div>

        <div className="faq-container-v7">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-card-v7 ${activeFaq === index ? 'active' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question-v7">
                <span className="faq-num">0{index + 1}</span>
                <h3>{faq.question}</h3>
                <span className="faq-plus">{activeFaq === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer-v7">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-footer-v7">
          <a href="https://api.whatsapp.com/send/?phone=5511930034781&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Tire outras dúvidas
          </a>
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
