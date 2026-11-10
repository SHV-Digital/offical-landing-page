export const locales = [
  { code: 'pt-BR', label: 'Português (Brasil)', short: 'PT', flag: 'br', og: 'pt_BR' },
  { code: 'en', label: 'English', short: 'EN', flag: 'gb', og: 'en_US' },
  { code: 'es', label: 'Español', short: 'ES', flag: 'es', og: 'es_ES' },
];

export function getLocale(pathname = '/') {
  return locales.find(({ code }) => code.toLowerCase() === pathname.split('/')[1].toLowerCase()) || locales[0];
}

export const translations = {
  'pt-BR': {
    title: 'SHV Digital — Desenvolvimento de software sob medida',
    description: 'Desenvolvimento de software sob medida, arquitetura de sistemas, automação e produtos digitais. Engenharia responsável e visão de longo prazo com a SHV Digital.',
    nav: ['Sobre', 'Diferenciais', 'Serviços'], navigationLabel: 'Navegação principal', contactLabel: 'Contato', languageLabel: 'Selecionar idioma', homeLabel: 'SHV Digital — Página inicial',
    hero: { badge: 'Onde o software é levado a sério', title: 'Construímos software', line1: 'com engenharia responsável', line2: 'e visão de longo prazo', description: 'Projetamos e desenvolvemos sistemas digitais sob medida, com foco em arquitetura sólida, decisões técnicas conscientes e produtos preparados para evoluir com segurança.', cta: 'Entrar em contato', pauseAnimation: 'Pausar animações do logo e do texto', resumeAnimation: 'Retomar animações do logo e do texto', logoInteraction: 'Logo 3D interativo da SHV Digital', rotateHint: 'Arraste para girar. Com foco, use as setas; Home redefine.' },
    about: { title: 'Sobre', headline: 'Quem somos nós?', carouselRole: 'carrossel', carouselLabel: 'Os princípios da SHV Digital', carouselHint: 'Explore nossos princípios. No modo animado, selecione um cartão ou use as setas. Passe o mouse ou use o foco do teclado para pausar a rotação.', selectCard: 'Explorar princípio', previousCard: 'Princípio anterior', nextCard: 'Próximo princípio', pauseRotation: 'Pausar animações da seção Sobre', resumeRotation: 'Retomar animações da seção Sobre', paragraphs: [
      'Engenharia responsável para software que precisa durar.',
      'Na SHV Digital, trabalhamos ao lado do seu time — da arquitetura aos detalhes do produto. Entendemos o contexto antes de escrever a primeira linha de código.',
      'Cada decisão busca reduzir a complexidade, apoiar o crescimento e permitir que o produto evolua com segurança.',
    ], cards: [
      { title: 'Engenharia responsável', description: 'Decisões técnicas bem fundamentadas, código limpo e foco em manutenibilidade.' },
      { title: 'Soluções bem estruturadas', description: 'Arquitetura clara, modular e preparada para evolução contínua.' },
      { title: 'Direção técnica', description: 'Ajudamos a tomar decisões certas no momento certo, reduzindo riscos.' },
    ] },
    differentials: { title: 'Diferenciais', description: 'Mais do que desenvolver software, entregamos clareza técnica, confiabilidade e produtos preparados para o futuro.', cards: [
      { title: 'Engenharia de verdade', description: 'Código sólido, decisões técnicas conscientes e foco em qualidade desde a primeira linha.' },
      { title: 'Arquitetura pensada para crescer', description: 'Soluções desenhadas para evoluir com o negócio, evitando retrabalho e limitações futuras.' },
      { title: 'Experiência e acabamento', description: 'Cuidado extremo com UI, UX, performance e detalhes que elevam a percepção do produto.' },
      { title: 'Parceria real', description: 'Atuamos como extensão do time, com transparência, proximidade e visão de longo prazo.' },
    ] },
    services: { title: 'Serviços', headline: 'Um núcleo. Muitas possibilidades.', activateAll: 'Ativar todos os serviços', pauseAnimation: 'Pausar animações de Serviços', resumeAnimation: 'Retomar animações de Serviços', idleLabel: 'Aguardando ativação', idleTitle: 'Qual solução vamos ativar?', idleDescription: 'Selecione um serviço no circuito para conhecer o que podemos construir. Ou ative o núcleo SHV para conectar todas as possibilidades.', selectedService: 'Serviço em destaque', allActive: 'Todos os serviços conectados', allTitle: 'Toda a potência. Uma só conexão.', allDescription: 'Estratégia, engenharia e experiência trabalhando juntas — do primeiro desafio à evolução do seu produto.', description: 'Atuamos em todo o ciclo de construção de software, da estratégia técnica à entrega de produtos digitais sólidos e bem acabados.', cards: [
      { title: 'Desenvolvimento de software sob medida', description: 'Aplicações web e sistemas desenvolvidos de acordo com o contexto real do negócio, com foco em qualidade, performance e manutenibilidade.' },
      { title: 'Arquitetura e evolução de sistemas', description: 'Definição e melhoria de arquiteturas escaláveis, seguras e preparadas para crescer sem comprometer o futuro do produto.' },
      { title: 'Automação e eficiência', description: 'Automação de processos, integrações e fluxos que reduzem custos operacionais e aumentam produtividade.' },
      { title: 'Produtos digitais', description: 'Criação e evolução de produtos digitais com atenção extrema à experiência do usuário, performance e acabamento final.' },
    ] },
    contact: { title: 'Vamos conversar', description: 'Conte um pouco sobre sua ideia ou desafio. Nós entraremos em contato para entender o contexto e avaliar como podemos ajudar.', email: 'Seu e-mail', message: 'Sua mensagem', submit: 'Enviar mensagem' },
  },
  en: {
    title: 'SHV Digital — Custom Software Development',
    description: 'Custom software development, systems architecture, automation, and digital products. Responsible engineering and a long-term vision with SHV Digital.',
    nav: ['About', 'Why SHV', 'Services'], navigationLabel: 'Main navigation', contactLabel: 'Contact', languageLabel: 'Select language', homeLabel: 'SHV Digital — Home',
    hero: { badge: 'Where software is taken seriously', title: 'We build software', line1: 'with responsible engineering', line2: 'and a long-term vision', description: 'We design and develop custom digital systems with solid architecture, thoughtful technical decisions, and products built to evolve reliably.', cta: 'Get in touch', pauseAnimation: 'Pause logo and text animations', resumeAnimation: 'Resume logo and text animations', logoInteraction: 'Interactive SHV Digital 3D logo', rotateHint: 'Drag to rotate. When focused, use arrow keys; Home resets.' },
    about: { title: 'About us', headline: 'Who are we?', carouselRole: 'carousel', carouselLabel: 'The principles behind SHV Digital', carouselHint: 'Explore our principles. In animated mode, select a card or use the arrow keys. Hover or keyboard focus pauses rotation.', selectCard: 'Explore principle', previousCard: 'Previous principle', nextCard: 'Next principle', pauseRotation: 'Pause About section animations', resumeRotation: 'Resume About section animations', paragraphs: [
      'Responsible engineering for software built to last.',
      'At SHV Digital, we work alongside your team, from architecture to the finishing touches. We understand the context before writing the first line of code.',
      'Every decision aims to reduce complexity, support growth, and help your product evolve with confidence.',
    ], cards: [
      { title: 'Responsible engineering', description: 'Well-founded technical decisions, clean code, and a focus on maintainability.' },
      { title: 'Well-structured solutions', description: 'Clear, modular architecture built for continuous evolution.' },
      { title: 'Technical guidance', description: 'We help you make the right decisions at the right time, reducing risk.' },
    ] },
    differentials: { title: 'Why SHV', description: 'More than software development: we deliver technical clarity, reliability, and products ready for the future.', cards: [
      { title: 'Engineering that delivers', description: 'Solid code, thoughtful technical decisions, and a focus on quality from the very first line.' },
      { title: 'Architecture built to grow', description: 'Solutions designed to evolve with your business, avoiding rework and future limitations.' },
      { title: 'Experience and polish', description: 'Meticulous attention to UI, UX, performance, and the details that elevate your product.' },
      { title: 'A true partnership', description: 'We act as an extension of your team, with transparency, close collaboration, and a long-term vision.' },
    ] },
    services: { title: 'Services', headline: 'One core. Many possibilities.', activateAll: 'Activate all services', pauseAnimation: 'Pause Services animations', resumeAnimation: 'Resume Services animations', idleLabel: 'Awaiting activation', idleTitle: 'What shall we power up?', idleDescription: 'Select a service on the circuit to explore what we can build. Or activate the SHV core to connect every possibility.', selectedService: 'Service in focus', allActive: 'All services connected', allTitle: 'Full power. One connection.', allDescription: 'Strategy, engineering, and experience working together — from your first challenge to your product’s next chapter.', description: 'We support the entire software development lifecycle, from technical strategy to delivering robust, polished digital products.', cards: [
      { title: 'Custom software development', description: 'Web applications and systems tailored to your business context, with a focus on quality, performance, and maintainability.' },
      { title: 'Systems architecture and evolution', description: 'Designing and improving scalable, secure architectures built to grow without compromising the future of your product.' },
      { title: 'Automation and efficiency', description: 'Process automation, integrations, and workflows that reduce operating costs and boost productivity.' },
      { title: 'Digital products', description: 'Building and evolving digital products with meticulous attention to user experience, performance, and polish.' },
    ] },
    contact: { title: 'Let’s talk', description: 'Tell us about your idea or challenge. We’ll get in touch to understand the context and explore how we can help.', email: 'Your email', message: 'Your message', submit: 'Send message' },
  },
  es: {
    title: 'SHV Digital — Desarrollo de software a medida',
    description: 'Desarrollo de software a medida, arquitectura de sistemas, automatización y productos digitales. Ingeniería responsable y visión a largo plazo con SHV Digital.',
    nav: ['Nosotros', 'Por qué SHV', 'Servicios'], navigationLabel: 'Navegación principal', contactLabel: 'Contacto', languageLabel: 'Seleccionar idioma', homeLabel: 'SHV Digital — Inicio',
    hero: { badge: 'Donde el software se toma en serio', title: 'Construimos software', line1: 'con ingeniería responsable', line2: 'y visión a largo plazo', description: 'Diseñamos y desarrollamos sistemas digitales a medida, con una arquitectura sólida, decisiones técnicas conscientes y productos preparados para evolucionar con seguridad.', cta: 'Ponte en contacto', pauseAnimation: 'Pausar animaciones del logo y del texto', resumeAnimation: 'Reanudar animaciones del logo y del texto', logoInteraction: 'Logo 3D interactivo de SHV Digital', rotateHint: 'Arrastra para girar. Con el foco, usa las flechas; Home restablece.' },
    about: { title: 'Sobre nosotros', headline: '¿Quiénes somos?', carouselRole: 'carrusel', carouselLabel: 'Los principios de SHV Digital', carouselHint: 'Explora nuestros principios. En el modo animado, selecciona una tarjeta o usa las flechas. El cursor o el foco del teclado pausan la rotación.', selectCard: 'Explorar principio', previousCard: 'Principio anterior', nextCard: 'Siguiente principio', pauseRotation: 'Pausar animaciones de la sección Sobre nosotros', resumeRotation: 'Reanudar animaciones de la sección Sobre nosotros', paragraphs: [
      'Ingeniería responsable para un software que perdura.',
      'En SHV Digital trabajamos junto a tu equipo, desde la arquitectura hasta los últimos detalles del producto. Entendemos el contexto antes de escribir la primera línea de código.',
      'Cada decisión busca reducir la complejidad, apoyar el crecimiento y permitir que tu producto evolucione con seguridad.',
    ], cards: [
      { title: 'Ingeniería responsable', description: 'Decisiones técnicas bien fundamentadas, código limpio y enfoque en la mantenibilidad.' },
      { title: 'Soluciones bien estructuradas', description: 'Arquitectura clara, modular y preparada para una evolución continua.' },
      { title: 'Orientación técnica', description: 'Te ayudamos a tomar las decisiones correctas en el momento adecuado, reduciendo riesgos.' },
    ] },
    differentials: { title: 'Por qué SHV', description: 'Más que desarrollar software, ofrecemos claridad técnica, fiabilidad y productos preparados para el futuro.', cards: [
      { title: 'Ingeniería de verdad', description: 'Código sólido, decisiones técnicas conscientes y un enfoque en la calidad desde la primera línea.' },
      { title: 'Arquitectura pensada para crecer', description: 'Soluciones diseñadas para evolucionar con el negocio, evitando retrabajos y limitaciones futuras.' },
      { title: 'Experiencia y acabado', description: 'Atención al detalle en UI, UX, rendimiento y todo lo que eleva la percepción del producto.' },
      { title: 'Una verdadera colaboración', description: 'Actuamos como una extensión de tu equipo, con transparencia, cercanía y visión a largo plazo.' },
    ] },
    services: { title: 'Servicios', headline: 'Un núcleo. Muchas posibilidades.', activateAll: 'Activar todos los servicios', pauseAnimation: 'Pausar animaciones de Servicios', resumeAnimation: 'Reanudar animaciones de Servicios', idleLabel: 'Esperando activación', idleTitle: '¿Qué solución activamos?', idleDescription: 'Selecciona un servicio en el circuito para descubrir lo que podemos construir. O activa el núcleo SHV para conectar todas las posibilidades.', selectedService: 'Servicio destacado', allActive: 'Todos los servicios conectados', allTitle: 'Toda la potencia. Una sola conexión.', allDescription: 'Estrategia, ingeniería y experiencia trabajando juntas — desde el primer desafío hasta la evolución de tu producto.', description: 'Participamos en todo el ciclo de desarrollo de software, desde la estrategia técnica hasta la entrega de productos digitales sólidos y cuidados.', cards: [
      { title: 'Desarrollo de software a medida', description: 'Aplicaciones web y sistemas adaptados al contexto real del negocio, con enfoque en calidad, rendimiento y mantenibilidad.' },
      { title: 'Arquitectura y evolución de sistemas', description: 'Definición y mejora de arquitecturas escalables, seguras y preparadas para crecer sin comprometer el futuro del producto.' },
      { title: 'Automatización y eficiencia', description: 'Automatización de procesos, integraciones y flujos de trabajo que reducen costes operativos y aumentan la productividad.' },
      { title: 'Productos digitales', description: 'Creación y evolución de productos digitales con especial atención a la experiencia de usuario, el rendimiento y el acabado final.' },
    ] },
    contact: { title: 'Hablemos', description: 'Cuéntanos tu idea o desafío. Nos pondremos en contacto para entender el contexto y evaluar cómo podemos ayudarte.', email: 'Tu correo electrónico', message: 'Tu mensaje', submit: 'Enviar mensaje' },
  },
};
