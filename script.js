document.addEventListener('DOMContentLoaded', () => {

  // Seleção de elementos principais
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id]');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // --- 1. ANIMAÇÃO DE TYPEWRITER PARA O HERO ---
  const initHeroAnimation = () => {
    const heroTitle = document.querySelector('.hero-text h1');
    const heroParagraphs = document.querySelectorAll('.hero-text p');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');

    if (heroTitle) {
      // Texto original dividido em partes
      const beforeName = 'Olá, eu sou ';
      const name = 'Victor Alecrim';

      // Limpar o conteúdo inicial
      heroTitle.innerHTML = '';
      heroTitle.style.opacity = '1';

      // Mostrar imagem primeiro
      setTimeout(() => {
        if (heroImage) {
          heroImage.style.opacity = '1';
          heroImage.style.animation = 'slideInFromRight 0.8s ease-out forwards';
        }
      }, 300);

      // Função de typewriter
      let charIndex = 0;
      const typeWriter = () => {
        if (charIndex < beforeName.length) {
          // Digitando "Olá, eu sou "
          heroTitle.innerHTML += beforeName.charAt(charIndex);
          charIndex++;
          const speed = Math.random() * 100 + 50;
          setTimeout(typeWriter, speed);
        } else if (charIndex < beforeName.length + name.length) {
          // Digitando "Victor Alecrim" em amarelo
          const nameIndex = charIndex - beforeName.length;
          if (nameIndex === 0) {
            heroTitle.innerHTML += '<span class="highlight">';
          }
          heroTitle.innerHTML = heroTitle.innerHTML.slice(0, -7) + name.charAt(nameIndex) + '</span>';
          charIndex++;
          const speed = Math.random() * 100 + 50;
          setTimeout(typeWriter, speed);
        } else {
          // Animação dos parágrafos após o título
          heroTitle.classList.add('typing-complete');
          animateDescriptions();
        }
      };

      // Iniciar typewriter após um delay
      setTimeout(typeWriter, 800);
    }

    // Animar descrições sequencialmente
    const animateDescriptions = () => {
      heroParagraphs.forEach((p, index) => {
        setTimeout(() => {
          p.style.opacity = '1';
          p.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }, index * 400);
      });

      // Animar botões por último
      setTimeout(() => {
        if (heroButtons) {
          heroButtons.style.opacity = '1';
          heroButtons.style.animation = 'slideInFromBottom 0.8s ease-out forwards';
        }
      }, heroParagraphs.length * 400 + 400);
    };
  };

  // --- 2. LÓGICA DO MENU MOBILE (HAMBURGER) ---
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // --- 3. FECHAR MENU AO CLICAR EM UM LINK E ATUALIZAR LINK ATIVO ---
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      hamburger.classList.remove('active');
      navMenu.classList.remove('active');

      navLinks.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');

      // Scroll suave para a seção
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 4. ESTILO DO HEADER E LINK ATIVO AO ROLAR A PÁGINA ---
  const handleScroll = () => {
    if (header) {
      const currentTheme = body.getAttribute('data-theme');
      if (window.scrollY > 100) {
        header.style.background = currentTheme === 'dark'
          ? 'rgba(31, 41, 55, 0.98)'
          : 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = currentTheme === 'dark'
          ? 'rgba(31, 41, 55, 0.95)'
          : 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }
    }
    updateActiveNavOnScroll();
  };

  const updateActiveNavOnScroll = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + header.offsetHeight + 50;

    sections.forEach(section => {
      if (scrollPosition >= section.offsetTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Se estivermos no topo da página, destacar o Home
    if (window.scrollY < 100) {
      currentSectionId = 'home';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);

  // --- 5. SISTEMA DE TEMA (DARK/LIGHT MODE) ---
  if (themeToggle && body) {
    const updateThemeIcon = (theme) => {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);

      // Atualizar header imediatamente
      handleScroll();
    });
  }

  // --- 6. ANIMAÇÃO DAS BARRAS DE HABILIDADE (SKILLS) ---
  const skillsSection = document.querySelector('.skills');
  if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillBars = entry.target.querySelectorAll('.skill-progress');
          skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = width;
            }, 200);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    skillObserver.observe(skillsSection);
  }

  // --- 7. FORMULÁRIO DE CONTATO (ENVIO DE EMAIL) ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  // Inicializa com a sua Public Key (use o valor exatamente como consta no painel)
  emailjs.init("FpcAkIsACRtEn5JMS"); // se no painel aparecer "user_xxx", use esse formato

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('nome').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('assunto').value.trim(),
      message: document.getElementById('mensagem').value.trim()
    };

    // console.table(formData);
    // console.log(formData);

    const serviceID = "service_c85xjl9";
    const templateID = "template_ra055m8";
    const publicKey = "FpcAkIsACRtEn5JMS"; // opcional: passar como 4º argumento se precisar

    try {
      // A) Usar await (recomendado)
      const res = await emailjs.send(serviceID, templateID, formData);
      // Caso a API exija publicKey como 4º arg: await emailjs.send(serviceID, templateID, formData, publicKey);

      console.log('EmailJS response:', res);
      submitBtn.textContent = 'Mensagem Enviada!';
      submitBtn.style.background = '#10b981';
      contactForm.reset();

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 2500);

    } catch (err) {
      console.error('Erro EmailJS:', err);
      submitBtn.textContent = 'Erro ao Enviar';
      submitBtn.style.background = '#ef4444';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 2500);
    }
  });
}


  // --- 8. INICIALIZAR ANIMAÇÕES ---
  initHeroAnimation();
  updateActiveNavOnScroll();
});