/* ==========================================================================
   Andara Rent a Car — Lógica de la página
   --------------------------------------------------------------------------
   Sitio 100 % estático: no hay servidor ni base de datos. Las consultas se
   envían abriendo WhatsApp con un mensaje ya redactado.

   Módulos:
   1. Configuración y datos de la flota
   2. Utilidades (WhatsApp, formato de precios)
   3. Navegación (header, menú móvil, sección activa)
   4. Flota (render de tarjetas y filtros)
   5. Animaciones al hacer scroll
   6. Formulario de contacto (validación + WhatsApp)
   7. Inicialización
   ========================================================================== */

(function () {
  'use strict';

  // Marca que JS está activo: habilita las animaciones de aparición en CSS.
  document.documentElement.classList.add('js');

  /* 1. Configuración -------------------------------------------------------- */

  const CONFIG = {
    // Número ficticio en formato internacional, sin "+" ni espacios (wa.me lo exige así).
    whatsappNumber: '5493515550123',
    defaultMessage: '¡Hola Andara! Quiero hacer una consulta sobre el alquiler de un vehículo.',
  };

  /** Arma la URL de una imagen de Unsplash con un tamaño uniforme para las tarjetas. */
  const unsplash = (id) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&h=450&q=72`;

  /**
   * Flota disponible. Para agregar un vehículo basta con sumar un objeto a esta lista:
   * la tarjeta, el filtro y la opción del formulario se generan solos.
   */
  const FLEET = [
    {
      brand: 'Fiat', model: '500 Cult', year: 2023, category: 'Económico',
      seats: 4, transmission: 'Manual', ac: true, trunk: '185 L', price: 52000,
      image: unsplash('1549317661-bd32c8ce0db2'),
      alt: 'Fiat 500 celeste estacionado frente a una casa de piedra',
    },
    {
      brand: 'Volkswagen', model: 'Polo Highline', year: 2022, category: 'Económico',
      seats: 5, transmission: 'Manual', ac: true, trunk: '300 L', price: 58000,
      image: unsplash('1541899481282-d53bffe3c35d'),
      alt: 'Volkswagen Polo azul petróleo estacionado al sol',
    },
    {
      brand: 'Hyundai', model: 'Accent GLS', year: 2024, category: 'Sedán',
      seats: 5, transmission: 'Automática', ac: true, trunk: '480 L', price: 71000,
      image: unsplash('1619767886558-efdc259cde1a'),
      alt: 'Hyundai Accent negro circulando por una ruta arbolada',
    },
    {
      brand: 'Toyota', model: 'Camry Hybrid', year: 2024, category: 'Sedán',
      seats: 5, transmission: 'Automática', ac: true, trunk: '428 L', price: 86000,
      image: unsplash('1621007947382-bb3c3994e3fb'),
      alt: 'Toyota Camry gris oscuro en un estacionamiento cubierto',
    },
    {
      brand: 'Toyota', model: 'RAV4 Hybrid', year: 2024, category: 'SUV',
      seats: 5, transmission: 'Automática', ac: true, trunk: '580 L', price: 98000,
      image: unsplash('1617469767053-d3b523a0b982'),
      alt: 'Toyota RAV4 plateada estacionada junto a árboles',
    },
    {
      brand: 'Jeep', model: 'Grand Cherokee Limited', year: 2022, category: 'SUV',
      seats: 5, transmission: 'Automática', ac: true, trunk: '1.000 L', price: 118000,
      image: unsplash('1511527844068-006b95d162c2'),
      alt: 'Jeep Grand Cherokee gris en un camino de montaña nevado',
    },
    {
      brand: 'Toyota', model: 'Tacoma TRD 4x4', year: 2023, category: 'Camioneta',
      seats: 5, transmission: 'Automática', ac: true, trunk: 'Caja 1.100 L', price: 124000,
      image: unsplash('1559416523-140ddc3d238c'),
      alt: 'Camioneta Toyota Tacoma color arena sobre un camino de tierra',
    },
    {
      brand: 'Ford', model: 'Expedition XLT', year: 2023, category: 'Camioneta',
      seats: 8, transmission: 'Automática', ac: true, trunk: '570 L', price: 145000,
      image: unsplash('1533473359331-0135ef1b58bf'),
      alt: 'Ford Expedition blanca en un paisaje de rocas rojizas',
    },
    {
      brand: 'Land Rover', model: 'Range Rover Sport', year: 2021, category: 'Premium',
      seats: 5, transmission: 'Automática', ac: true, trunk: '489 L', price: 210000,
      image: unsplash('1563720223185-11003d516935'),
      alt: 'Range Rover Sport negra frente a un garaje',
    },
    {
      brand: 'Mercedes-Benz', model: 'GLE 450 Coupé', year: 2022, category: 'Premium',
      seats: 5, transmission: 'Automática', ac: true, trunk: '655 L', price: 230000,
      image: unsplash('1590362891991-f776e747a588'),
      alt: 'Mercedes-Benz GLE Coupé blanca dentro de un garaje iluminado',
    },
  ];

  /* 2. Utilidades ----------------------------------------------------------- */

  /** Devuelve el enlace de WhatsApp con el mensaje codificado para URL. */
  const whatsappLink = (message = CONFIG.defaultMessage) =>
    `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  /** Formatea un precio en pesos argentinos: 52000 → "$ 52.000". */
  const formatPrice = (value) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

  /** Escapa texto antes de insertarlo como HTML. */
  const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** Vuelve a dibujar los íconos Lucide (necesario tras insertar HTML dinámico). */
  const refreshIcons = () => {
    if (window.lucide) window.lucide.createIcons();
  };

  /** Fecha local de hoy en formato AAAA-MM-DD (para el input date). */
  const todayISO = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };

  /* 3. Navegación ----------------------------------------------------------- */

  function initNavigation() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav__link');

    // Header sólido al bajar del hero.
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Abrir / cerrar menú móvil.
    const setMenu = (open) => {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-open', open);
    };

    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));

    // Cerrar al elegir una sección, con Escape o al volver a escritorio.
    // Se cierra el menú primero (libera el bloqueo de scroll del body) y recién
    // después se desplaza a la sección; si no, el navegador ignora el salto.
    menu.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      const wasOpen = menu.classList.contains('is-open');
      setMenu(false);
      if (wasOpen && target) {
        e.preventDefault();
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, '', link.getAttribute('href'));
        });
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 921px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });

    // Resaltar en el menú la sección visible.
    const sections = [...links]
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) =>
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => spy.observe(section));

    // Todos los enlaces marcados con data-whatsapp apuntan al número configurado.
    document.querySelectorAll('[data-whatsapp]').forEach((el) => {
      el.href = whatsappLink();
      el.target = '_blank';
      el.rel = 'noopener';
    });
  }

  /* 4. Flota ---------------------------------------------------------------- */

  /** Genera el HTML de una tarjeta de vehículo. */
  function carCard(car) {
    const name = `${car.brand} ${car.model}`;
    const message =
      `¡Hola Andara! Quiero consultar la disponibilidad del ${name} (${car.year}). ` +
      '¿Para qué fechas lo tienen libre y cuál sería el precio final?';
    const premium = car.category === 'Premium' ? ' car__badge--premium' : '';

    return `
      <article class="car reveal" data-category="${escapeHTML(car.category)}">
        <div class="car__media">
          <img src="${car.image}" alt="${escapeHTML(car.alt)}" loading="lazy" width="720" height="450">
          <span class="car__badge${premium}">${escapeHTML(car.category)}</span>
        </div>
        <div class="car__body">
          <div class="car__head">
            <h3 class="car__name">${escapeHTML(car.model)}</h3>
            <span class="car__year">${car.year}</span>
          </div>
          <p class="car__brand">${escapeHTML(car.brand)}</p>
          <ul class="car__specs">
            <li><i data-lucide="users" aria-hidden="true"></i>${car.seats} pasajeros</li>
            <li><i data-lucide="cog" aria-hidden="true"></i>${escapeHTML(car.transmission)}</li>
            <li><i data-lucide="snowflake" aria-hidden="true"></i>${car.ac ? 'Aire acond.' : 'Sin aire'}</li>
            <li><i data-lucide="briefcase" aria-hidden="true"></i>${escapeHTML(car.trunk)}</li>
          </ul>
          <div class="car__foot">
            <p class="car__price">desde <strong>${formatPrice(car.price)}</strong> / día</p>
            <a class="btn btn--dark" href="${whatsappLink(message)}" target="_blank" rel="noopener"
               aria-label="Consultar disponibilidad del ${escapeHTML(name)} por WhatsApp">
              <i data-lucide="message-circle" aria-hidden="true"></i> Consultar disponibilidad
            </a>
          </div>
        </div>
      </article>`;
  }

  function initFleet() {
    const grid = document.getElementById('fleet-grid');
    const select = document.getElementById('f-vehicle');
    if (!grid) return;

    grid.innerHTML = FLEET.map(carCard).join('');

    // Opciones del formulario agrupadas por categoría.
    if (select) {
      const groups = {};
      FLEET.forEach((car) => {
        (groups[car.category] ||= []).push(`${car.brand} ${car.model} (${car.year})`);
      });
      Object.entries(groups).forEach(([category, cars]) => {
        const group = document.createElement('optgroup');
        group.label = category;
        cars.forEach((label) => group.append(new Option(label, label)));
        select.insertBefore(group, select.lastElementChild);
      });
    }

    // Filtros por categoría.
    const buttons = document.querySelectorAll('.filter');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        grid.querySelectorAll('.car').forEach((card) => {
          const show = filter === 'todos' || card.dataset.category === filter;
          card.hidden = !show;
          if (show) card.classList.add('is-visible'); // evita que queden ocultas por la animación
        });
      });
    });
  }

  /* 5. Animaciones al hacer scroll ----------------------------------------- */

  function initReveal() {
    const items = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Pequeño escalonado entre elementos hermanos (tarjetas, ventajas, pasos).
    items.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      const index = siblings.indexOf(el);
      if (siblings.length > 2) el.style.setProperty('--delay', `${(index % 4) * 0.08}s`);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* 6. Formulario de contacto ---------------------------------------------- */

  /** Reglas de validación: cada una devuelve un mensaje de error o '' si es válido. */
  const VALIDATORS = {
    name: (v) =>
      v.length < 3 ? 'Ingresá tu nombre y apellido.'
        : !/^[\p{L}' .-]+$/u.test(v) ? 'Usá solo letras y espacios.'
          : v.split(/\s+/).length < 2 ? 'Incluí también tu apellido.' : '',
    email: (v) =>
      !v ? 'Ingresá tu correo electrónico.'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Revisá el formato del correo (ej.: nombre@correo.com).' : '',
    phone: (v) => {
      const digits = v.replace(/\D/g, '');
      if (!v) return 'Ingresá un teléfono de contacto.';
      if (!/^[\d\s()+-]+$/.test(v)) return 'Usá solo números, espacios o guiones.';
      return digits.length < 8 || digits.length > 15 ? 'El teléfono debe tener entre 8 y 15 dígitos.' : '';
    },
    vehicle: (v) => (!v ? 'Elegí un vehículo o la opción “Todavía no lo decidí”.' : ''),
    date: (v) =>
      !v ? 'Indicá una fecha estimada.'
        : v < todayISO() ? 'La fecha no puede ser anterior a hoy.' : '',
    message: (v) => (v.length < 10 ? 'Contanos un poco más (mínimo 10 caracteres).' : ''),
  };

  function initForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    form.elements.date.min = todayISO();

    /** Valida un campo, muestra el error y devuelve true si es correcto. */
    const validateField = (input) => {
      const rule = VALIDATORS[input.name];
      if (!rule) return true;
      const error = rule(input.value.trim());
      const field = input.closest('.field');
      field.classList.toggle('is-invalid', Boolean(error));
      field.classList.toggle('is-valid', !error);
      field.querySelector('.field__error').textContent = error;
      input.setAttribute('aria-invalid', String(Boolean(error)));
      return !error;
    };

    // Validación en vivo: al salir del campo y, si ya tenía error, mientras se corrige.
    form.querySelectorAll('input, select, textarea').forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('is-invalid')) validateField(input);
      });
      input.addEventListener('change', () => validateField(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = '';

      const inputs = [...form.querySelectorAll('input, select, textarea')];
      const results = inputs.map(validateField);
      const firstInvalid = inputs[results.indexOf(false)];
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      const [y, m, d] = data.date.split('-');
      const message = [
        '¡Hola Andara! Quiero consultar por un alquiler.',
        '',
        `• Nombre: ${data.name.trim()}`,
        `• Correo: ${data.email.trim()}`,
        `• Teléfono: ${data.phone.trim()}`,
        `• Vehículo: ${data.vehicle}`,
        `• Fecha estimada: ${d}/${m}/${y}`,
        '',
        data.message.trim(),
      ].join('\n');

      // No se guarda nada: solo se abre WhatsApp con el mensaje armado.
      // (Con 'noopener' window.open devuelve siempre null, por eso se corta el opener a mano.)
      const url = whatsappLink(message);
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      else window.location.href = url; // si el navegador bloqueó la ventana emergente

      status.textContent = '¡Listo! Abrimos WhatsApp con tu consulta: solo falta que toques "Enviar".';
    });
  }

  /* 7. Inicialización ------------------------------------------------------- */

  function init() {
    initFleet();      // primero la flota, para que sus tarjetas tengan animación
    initNavigation();
    initReveal();
    initForm();
    refreshIcons();

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  // Los scripts usan "defer", así que el DOM ya está listo; Lucide se carga antes que este archivo.
  init();
})();
