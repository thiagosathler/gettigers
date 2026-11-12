'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'pt' | 'es';

export interface Translations {
  nav: {
    home: string;
    services: string;
    findPros: string;
    becomeTiger: string;
    login: string;
    dashboard: string;
    logout: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    servicePlaceholder: string;
    zipPlaceholder: string;
    searchBtn: string;
    popularInFl: string;
    trust1: string;
    trust2: string;
    trust3: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  categories: {
    title: string;
    subtitle: string;
    viewAll: string;
    requestQuote: string;
  };
  topTigers: {
    title: string;
    subtitle: string;
    verified: string;
    reviews: string;
    speaks: string;
    viewProfile: string;
  };
  cta: {
    title: string;
    subtitle: string;
    btn: string;
  };
  footer: {
    about: string;
    rights: string;
    cities: string;
  };
  wizard: {
    step: string;
    of: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    step5Title: string;
    urgencyTitle: string;
    urgencyUrgent: string;
    urgencyWeek: string;
    urgencyFlexible: string;
    zipLabel: string;
    zipHelp: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    whatsappLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    next: string;
    back: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    reviewDirectNotice: string;
    copyLink: string;
    copied: string;
  };
  dashboard: {
    title: string;
    welcome: string;
    leadsTab: string;
    myUnlockedTab: string;
    portfolioTab: string;
    profileTab: string;
    openLeadsCount: string;
    distance: string;
    urgency: string;
    unlockFree: string;
    slotsLeft: string;
    slotsFull: string;
    unlockedSuccess: string;
    contactCustomer: string;
    sendWhatsapp: string;
    sendSms: string;
    callPhone: string;
  };
}

const dictionaries: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      findPros: 'Find Tigers',
      becomeTiger: 'Become a Tiger',
      login: 'Log In',
      dashboard: 'Tiger Dashboard',
      logout: 'Log Out',
    },
    hero: {
      badge: 'Florida\'s Top Independent Pros',
      titleStart: 'Hire trusted local pros across',
      titleHighlight: 'Florida',
      titleEnd: 'fast & direct.',
      subtitle: 'From vacation home turnover in Orlando to handyman fixes in Miami and Boca Raton. Connect directly via WhatsApp or SMS in English, Portuguese, or Spanish.',
      servicePlaceholder: 'What service do you need? (e.g., Cleaning, Handyman)',
      zipPlaceholder: 'ZIP Code (e.g. 32835, 33178)',
      searchBtn: 'Get Free Quotes',
      popularInFl: 'Popular in FL:',
      trust1: 'Up to 4 competitive quotes',
      trust2: 'Direct WhatsApp & SMS chat',
      trust3: 'Bilingual & Trilingual Pros',
    },
    howItWorks: {
      title: 'How GetTigers Works',
      subtitle: 'Fast, simple, and zero middleman markup on your final job.',
      step1Title: '1. Tell Us What You Need',
      step1Desc: 'Answer 3 quick questions about your home or project and enter your Florida ZIP Code.',
      step2Title: '2. Receive Up to 4 Direct Quotes',
      step2Desc: 'Qualified local Tigers within your radius review your request and reach out directly.',
      step3Title: '3. Choose the Best Tiger',
      step3Desc: 'Compare ratings, before & after photos, negotiate price directly and review after completion.',
    },
    categories: {
      title: 'Popular Services in Florida',
      subtitle: 'Verified informal and autonomous workers ready to tackle your tasks.',
      viewAll: 'Explore All Categories',
      requestQuote: 'Request Quote',
    },
    topTigers: {
      title: 'Featured Tigers in Your Area',
      subtitle: 'Top-rated autonomous professionals trusted by Florida homeowners & hosts.',
      verified: 'Verified Pro',
      reviews: 'reviews',
      speaks: 'Speaks:',
      viewProfile: 'View Profile & Work',
    },
    cta: {
      title: 'Are you a skilled worker in Florida?',
      subtitle: 'Join GetTigers for free. Receive high-intent local customer leads directly on your WhatsApp and phone every day.',
      btn: 'Join as a Tiger — It’s Free',
    },
    footer: {
      about: 'GetTigers connects homeowners, vacation rental hosts, and businesses with independent informal workers and handymen across Florida.',
      rights: 'All rights reserved.',
      cities: 'Serving Orlando, Kissimmee, Miami, Fort Lauderdale, Boca Raton, Tampa, St. Petersburg and Jacksonville.',
    },
    wizard: {
      step: 'Step',
      of: 'of',
      step1Title: 'Select Service Category',
      step2Title: 'Tell Us the Details',
      step3Title: 'When do you need it done?',
      step4Title: 'Your Florida Location',
      step5Title: 'Contact Information',
      urgencyTitle: 'How quickly do you need this service?',
      urgencyUrgent: 'Urgent (Today or Tomorrow)',
      urgencyWeek: 'Within this week',
      urgencyFlexible: 'Flexible / Next 2 weeks',
      zipLabel: 'Florida ZIP Code',
      zipHelp: 'Enter 5-digit ZIP code (e.g. 32835 Orlando, 33178 Miami, 33431 Boca Raton)',
      nameLabel: 'Your Full Name',
      emailLabel: 'Email Address',
      phoneLabel: 'U.S. Phone Number',
      whatsappLabel: 'WhatsApp Number (Optional, for instant chat)',
      notesLabel: 'Additional details or instructions for the Tigers',
      notesPlaceholder: 'Describe any specific requirements, gate codes or access details...',
      next: 'Next Step',
      back: 'Back',
      submit: 'Submit Request (Free)',
      submitting: 'Submitting Request...',
      successTitle: 'Your Request is Live!',
      successDesc: 'Up to 4 local Tigers within your radius are reviewing your request now. They will contact you via WhatsApp or SMS shortly.',
      reviewDirectNotice: 'Bookmark this direct link to rate and review the professional once the job is completed:',
      copyLink: 'Copy Review Link',
      copied: 'Copied!',
    },
    dashboard: {
      title: 'Tiger Pro Portal',
      welcome: 'Welcome back',
      leadsTab: 'New Opportunities (Leads)',
      myUnlockedTab: 'My Unlocked Leads',
      portfolioTab: 'Before & After Portfolio',
      profileTab: 'Service Radius & Profile',
      openLeadsCount: 'Opportunities in your Florida coverage area',
      distance: 'miles away',
      urgency: 'Urgency:',
      unlockFree: 'Unlock Customer Contact (Free in MVP)',
      slotsLeft: 'slots remaining',
      slotsFull: 'Max 4 Tigers reached',
      unlockedSuccess: 'Contact unlocked successfully!',
      contactCustomer: 'Reach out to the customer directly:',
      sendWhatsapp: 'Chat on WhatsApp',
      sendSms: 'Send Text Message (SMS)',
      callPhone: 'Call Customer',
    },
  },
  pt: {
    nav: {
      home: 'Início',
      services: 'Serviços',
      findPros: 'Encontrar Tigers',
      becomeTiger: 'Seja um Tiger',
      login: 'Entrar',
      dashboard: 'Painel do Tiger',
      logout: 'Sair',
    },
    hero: {
      badge: 'Profissionais Autônomos na Flórida',
      titleStart: 'Contrate profissionais de confiança na',
      titleHighlight: 'Flórida',
      titleEnd: 'rápido e direto.',
      subtitle: 'De limpeza de Airbnb em Orlando a handymen e reformas em Miami e Boca Raton. Fale direto via WhatsApp ou SMS em Português, Inglês ou Espanhol.',
      servicePlaceholder: 'O que você precisa? (ex: Limpeza, Pintura, Handyman)',
      zipPlaceholder: 'ZIP Code (ex: 32835, 33178)',
      searchBtn: 'Pedir Orçamentos Grátis',
      popularInFl: 'Mais buscados na FL:',
      trust1: 'Receba até 4 orçamentos rápidos',
      trust2: 'Contato direto via WhatsApp e SMS',
      trust3: 'Profissionais que falam sua língua',
    },
    howItWorks: {
      title: 'Como Funciona o GetTigers',
      subtitle: 'Sem taxas abusivas de intermediação. Negocie diretamente com o profissional.',
      step1Title: '1. Peça o Serviço em Minutos',
      step1Desc: 'Responda algumas perguntas rápidas sobre o imóvel ou serviço e informe seu ZIP Code da Flórida.',
      step2Title: '2. Receba até 4 Orçamentos',
      step2Desc: 'Tigers autônomos que atendem na sua região recebem o pedido e entram em contato direto com você.',
      step3Title: '3. Escolha o Melhor Tiger',
      step3Desc: 'Veja fotos de Antes e Depois, avaliações reais e feche direto pelo melhor preço e prazo.',
    },
    categories: {
      title: 'Serviços Populares na Flórida',
      subtitle: 'Trabalhadores autônomos e qualificados prontos para atender você.',
      viewAll: 'Ver Todas as Categorias',
      requestQuote: 'Solicitar Orçamento',
    },
    topTigers: {
      title: 'Tigers em Destaque na Região',
      subtitle: 'Profissionais bem avaliados pela comunidade e donos de imóveis na Flórida.',
      verified: 'Profissional Verificado',
      reviews: 'avaliações',
      speaks: 'Idiomas:',
      viewProfile: 'Ver Perfil e Trabalhos',
    },
    cta: {
      title: 'Você trabalha como autônomo na Flórida?',
      subtitle: 'Cadastre-se gratuitamente no GetTigers. Receba pedidos de clientes locais direto no seu WhatsApp e telefone todos os dias.',
      btn: 'Cadastrar como Tiger — É Grátis',
    },
    footer: {
      about: 'O GetTigers conecta moradores, proprietários de temporada e empresas a trabalhadores autônomos na Flórida sem intermediários.',
      rights: 'Todos os direitos reservados.',
      cities: 'Atendendo Orlando, Kissimmee, Miami, Fort Lauderdale, Boca Raton, Tampa, St. Petersburg e Jacksonville.',
    },
    wizard: {
      step: 'Etapa',
      of: 'de',
      step1Title: 'Escolha a Categoria do Serviço',
      step2Title: 'Detalhes do Serviço',
      step3Title: 'Para quando você precisa?',
      step4Title: 'Localização na Flórida',
      step5Title: 'Seus Dados de Contato',
      urgencyTitle: 'Qual a urgência para a realização do trabalho?',
      urgencyUrgent: 'Urgente (Hoje ou Amanhã)',
      urgencyWeek: 'Nesta semana',
      urgencyFlexible: 'Flexível / Próximas semanas',
      zipLabel: 'ZIP Code da Flórida',
      zipHelp: 'Digite o código de 5 dígitos (ex: 32835 Orlando, 33178 Miami, 33431 Boca Raton)',
      nameLabel: 'Seu Nome Completo',
      emailLabel: 'Seu E-mail',
      phoneLabel: 'Telefone dos EUA',
      whatsappLabel: 'WhatsApp (com código do país se for brasileiro)',
      notesLabel: 'Observações ou detalhes adicionais para os Tigers',
      notesPlaceholder: 'Descreva necessidades específicas, portão, condomínio...',
      next: 'Próxima Etapa',
      back: 'Voltar',
      submit: 'Solicitar Orçamentos (Grátis)',
      submitting: 'Enviando Pedido...',
      successTitle: 'Pedido Enviado com Sucesso!',
      successDesc: 'Até 4 Tigers qualificados que atendem seu ZIP Code foram notificados e entrarão em contato direto com você via WhatsApp ou SMS.',
      reviewDirectNotice: 'Guarde este link direto para avaliar o profissional após a conclusão do serviço:',
      copyLink: 'Copiar Link de Avaliação',
      copied: 'Copiado!',
    },
    dashboard: {
      title: 'Portal do Profissional (Tiger)',
      welcome: 'Bem-vindo de volta',
      leadsTab: 'Oportunidades (Pedidos Abertos)',
      myUnlockedTab: 'Meus Contatos Liberados',
      portfolioTab: 'Portfólio Antes e Depois',
      profileTab: 'Meu Raio & Perfil',
      openLeadsCount: 'Pedidos abertos no seu raio de atendimento na Flórida',
      distance: 'milhas de distância',
      urgency: 'Urgência:',
      unlockFree: 'Liberar Contato do Cliente (Grátis no MVP)',
      slotsLeft: 'vagas restantes',
      slotsFull: 'Limite de 4 Tigers atingido',
      unlockedSuccess: 'Contato liberado com sucesso!',
      contactCustomer: 'Entre em contato direto com o cliente:',
      sendWhatsapp: 'Conversar no WhatsApp',
      sendSms: 'Enviar Mensagem de Texto (SMS)',
      callPhone: 'Ligar para o Cliente',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      findPros: 'Buscar Tigers',
      becomeTiger: 'Únete como Tiger',
      login: 'Ingresar',
      dashboard: 'Panel de Tiger',
      logout: 'Cerrar Sesión',
    },
    hero: {
      badge: 'Profesionales Autónomos en Florida',
      titleStart: 'Contrata profesionales de confianza en',
      titleHighlight: 'Florida',
      titleEnd: 'rápido y directo.',
      subtitle: 'Desde limpieza de Airbnb en Orlando hasta pintura y reparaciones en Miami y Boca Raton. Contacto directo por WhatsApp o SMS en Español, Inglés o Portugués.',
      servicePlaceholder: '¿Qué servicio buscas? (ej. Limpieza, Handyman)',
      zipPlaceholder: 'ZIP Code (ej. 32835, 33178)',
      searchBtn: 'Pedir Cotizaciones Gratis',
      popularInFl: 'Más buscados en FL:',
      trust1: 'Hasta 4 presupuestos directos',
      trust2: 'Chat directo por WhatsApp y SMS',
      trust3: 'Profesionales que hablan tu idioma',
    },
    howItWorks: {
      title: 'Cómo Funciona GetTigers',
      subtitle: 'Sin comisiones abusivas sobre el trabajo. Negocia directamente con el profesional.',
      step1Title: '1. Describe tu Necesidad',
      step1Desc: 'Responde breves preguntas sobre tu hogar o proyecto e ingresa tu código postal (ZIP Code) en Florida.',
      step2Title: '2. Recibe hasta 4 Cotizaciones',
      step2Desc: 'Los Tigers calificados en tu radio de distancia revisan tu solicitud y te contactan directamente.',
      step3Title: '3. Elige el Mejor Tiger',
      step3Desc: 'Compara fotos de Antes y Después, opiniones reales y acuerda el mejor precio y fecha.',
    },
    categories: {
      title: 'Servicios Populares en Florida',
      subtitle: 'Trabajadores independientes listos para realizar tus trabajos con rapidez.',
      viewAll: 'Ver Todas las Categorías',
      requestQuote: 'Solicitar Cotización',
    },
    topTigers: {
      title: 'Tigers Destacados en Florida',
      subtitle: 'Profesionales recomendados por familias y dueños de propiedades en Florida.',
      verified: 'Profesional Verificado',
      reviews: 'opiniones',
      speaks: 'Idiomas:',
      viewProfile: 'Ver Perfil y Trabajos',
    },
    cta: {
      title: '¿Trabajas por tu cuenta en Florida?',
      subtitle: 'Únete gratis a GetTigers. Recibe solicitudes de clientes locales directamente en tu WhatsApp y teléfono todos los días.',
      btn: 'Registrarse como Tiger — Es Gratis',
    },
    footer: {
      about: 'GetTigers conecta propietarios, anfitriones de alquileres vacacionales y empresas con trabajadores autónomos en Florida sin intermediarios.',
      rights: 'Todos los derechos reservados.',
      cities: 'Sirviendo Orlando, Kissimmee, Miami, Fort Lauderdale, Boca Raton, Tampa, St. Petersburg y Jacksonville.',
    },
    wizard: {
      step: 'Paso',
      of: 'de',
      step1Title: 'Selecciona la Categoría',
      step2Title: 'Detalles del Servicio',
      step3Title: '¿Para cuándo lo necesitas?',
      step4Title: 'Ubicación en Florida',
      step5Title: 'Información de Contacto',
      urgencyTitle: '¿Qué tan pronto necesitas el servicio?',
      urgencyUrgent: 'Urgente (Hoy o Mañana)',
      urgencyWeek: 'Durante esta semana',
      urgencyFlexible: 'Flexible / Próximas 2 semanas',
      zipLabel: 'Código Postal de Florida (ZIP Code)',
      zipHelp: 'Ingresa el código de 5 dígitos (ej. 32835 Orlando, 33178 Miami, 33431 Boca Raton)',
      nameLabel: 'Tu Nombre Completo',
      emailLabel: 'Correo Electrónico',
      phoneLabel: 'Teléfono de EE.UU.',
      whatsappLabel: 'WhatsApp (Opcional, para chat inmediato)',
      notesLabel: 'Instrucciones o notas adicionales para los Tigers',
      notesPlaceholder: 'Detalles sobre acceso, instrucciones especiales...',
      next: 'Siguiente',
      back: 'Atrás',
      submit: 'Enviar Solicitud (Gratis)',
      submitting: 'Enviando...',
      successTitle: '¡Solicitud Publicada!',
      successDesc: 'Hasta 4 Tigers calificados en tu zona revisarán tu pedido y te contactarán pronto por WhatsApp o SMS.',
      reviewDirectNotice: 'Guarda este enlace directo para calificar al profesional cuando termine el trabajo:',
      copyLink: 'Copiar Enlace de Calificación',
      copied: '¡Copiado!',
    },
    dashboard: {
      title: 'Portal de Tiger Profesional',
      welcome: 'Bienvenido',
      leadsTab: 'Oportunidades (Pedidos Abiertos)',
      myUnlockedTab: 'Mis Contactos Liberados',
      portfolioTab: 'Portafolio Antes y Después',
      profileTab: 'Mi Radio y Perfil',
      openLeadsCount: 'Pedidos abiertos en tu radio de cobertura en Florida',
      distance: 'millas de distancia',
      urgency: 'Urgencia:',
      unlockFree: 'Desbloquear Contacto del Cliente (Gratis en MVP)',
      slotsLeft: 'cupos disponibles',
      slotsFull: 'Máximo de 4 Tigers alcanzado',
      unlockedSuccess: '¡Contacto desbloqueado con éxito!',
      contactCustomer: 'Comunícate directamente con el cliente:',
      sendWhatsapp: 'Escribir por WhatsApp',
      sendSms: 'Enviar Mensaje de Texto (SMS)',
      callPhone: 'Llamar al Cliente',
    },
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: dictionaries.en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('gettigers_lang') as Language;
    if (saved && (saved === 'en' || saved === 'pt' || saved === 'es')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gettigers_lang', lang);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
