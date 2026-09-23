/* =============================================
   IMÁGENES DEL CARRUSEL DE PASTORES
   ============================================= */
const pastores = [
  "Images/prguzman.jpg",
  "Images/pramartha.jpg"
];

/* =============================================
   MENÚ MÓVIL
   Se activa de inmediato (no depende del preloader)
   para que el botón hamburguesa responda apenas
   carga la página.
   ============================================= */
function iniciarMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  const cerrarBtn = document.getElementById('nav-close');

  // Si falta algún elemento clave, no seguimos (evita errores en consola)
  if (!toggle || !nav) return;

  function abrirMenu() {
    nav.classList.add('nav-open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.classList.add('visible');
  }

  function cerrarMenu() {
    nav.classList.remove('nav-open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('visible');
  }

  toggle.addEventListener('click', () => {
    const estaAbierto = nav.classList.contains('nav-open');
    estaAbierto ? cerrarMenu() : abrirMenu();
  });

  if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarMenu);
  if (overlay) overlay.addEventListener('click', cerrarMenu);

  // Cerrar el menú al elegir una opción (mejor experiencia en móvil)
  nav.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', cerrarMenu);
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrarMenu();
  });
}

// El menú no depende de fuentes ni del preloader, así que se inicia
// apenas el DOM está listo.
document.addEventListener('DOMContentLoaded', iniciarMenu);


/* =============================================
   PRELOADER
   Este bloque corre primero, antes que todo.
   ============================================= */
const texto = "Iglesia Buenas Nuevas";

const RETRASO_POR_LETRA = 80;
const DURACION_ENTRADA  = 400;
const PAUSA_EN_PANTALLA = 1100;
const DURACION_SALIDA   = 300;

const RETRASO_INICIAL_LOGO = 500;
function iniciarPreloader() {
  const contenedor  = document.getElementById('preloader-text');
  const lineaAccent = contenedor.querySelector('.line-accent');

  // 1. Crear una <span> por cada carácter y animar entrada
  //    (con un retraso inicial para que el logo aparezca primero)
  texto.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = char === ' ' ? 'letter space' : 'letter';
    if (char !== ' ') span.textContent = char;
    contenedor.appendChild(span);

    setTimeout(() => {
      span.style.animation =
        `letterIn ${DURACION_ENTRADA}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`;
    }, RETRASO_INICIAL_LOGO + i * RETRASO_POR_LETRA);
  });

  // 2. Activar la línea dorada a la mitad de la entrada
  const mitadEntrada = RETRASO_INICIAL_LOGO + (texto.length * RETRASO_POR_LETRA) / 2;
  setTimeout(() => {
    lineaAccent.style.animationPlayState = 'running';
  }, mitadEntrada);

  // 3. Calcular cuándo termina de entrar la última letra
  const finEntrada = RETRASO_INICIAL_LOGO + texto.length * RETRASO_POR_LETRA + DURACION_ENTRADA;

  // 4. Animar la SALIDA de las letras (de derecha a izquierda)
  setTimeout(() => {
    const letras = contenedor.querySelectorAll('.letter');
    letras.forEach((el, i) => {
      const indiceReverso = letras.length - 1 - i;
      setTimeout(() => {
        el.style.animation =
          `letterOut ${DURACION_SALIDA}ms ease-in forwards`;
      }, indiceReverso * 40);
    });

    lineaAccent.style.transition = 'opacity 0.5s ease';
    lineaAccent.style.opacity    = '0';

  }, finEntrada + PAUSA_EN_PANTALLA);

  // 5. Ocultar preloader, mostrar la web e iniciar el resto
  const tiempoTotal = finEntrada + PAUSA_EN_PANTALLA + DURACION_SALIDA + 300;
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.getElementById('main-content').classList.add('visible');

    /*
     * ─────────────────────────────────────────────────────
     * IMPORTANTE: el carrusel y el reproductor se inician
     * AQUÍ, después de que el preloader termina.
     *
     * Antes estaban sueltos al inicio del archivo y eso
     * causaba dos problemas:
     *   1. Intentaban buscar elementos del DOM que aún
     *      estaban ocultos o inexistentes → error silencioso.
     *   2. Ese error cortaba la ejecución del script y el
     *      preloader nunca llegaba a mostrarse correctamente.
     * ─────────────────────────────────────────────────────
     */
    iniciarCarrusel();
    iniciarReproductor();
    iniciarBannerModal();
    iniciarGaleria();
    iniciarReflexionDelDia();

  }, tiempoTotal);
}
// Esperar a que las fuentes carguen antes de empezar el preloader
document.fonts.ready.then(iniciarPreloader);
//BOTON PARA INICIAR SESIÓN EN EL PANEL DE ADMINISTRACIÓN
function iniciarBotonLogin() {
    const enlace = document.getElementById('login-panel-link');
    if (enlace) enlace.href = ADMIN_PANEL_URL;
}

document.addEventListener('DOMContentLoaded', iniciarBotonLogin);
/* =============================================
   CONFIGURACIÓN DE LA API
   Cambia esta URL cuando despliegues el backend
   a producción (Render, Railway, etc.)
   ============================================= */
const API_BASE_URL = 'https://buenasnuevasweb-backend.onrender.com';
const ADMIN_PANEL_URL = 'https://admin-buenasnuevas.netlify.app/'; // cambiar cuando despliegues el panel
/* =============================================
   REFLEXIÓN DEL DÍA
   ============================================= */
async function iniciarReflexionDelDia() {
    const seccion = document.getElementById('reflexion');
    if (!seccion) return;

    try {
        const respuesta = await fetch(`${API_BASE_URL}/reflexion/hoy`);

        if (!respuesta.ok) {
            seccion.remove();
            return;
        }

        const datos = await respuesta.json();

        if (!datos || !datos.textoReflexion) {
            seccion.remove();
            return;
        }

        document.getElementById('reflexion-fecha').textContent = formatearFechaHoy(datos.fecha);
        document.getElementById('reflexion-texto').textContent = `“${datos.textoReflexion}”`;
        document.getElementById('reflexion-versiculo-texto').textContent = `“${datos.versiculoTexto}”`;
        document.getElementById('reflexion-referencia').textContent = datos.versiculoReferencia;

    } catch (error) {
        console.warn('No se pudo cargar la reflexión del día:', error);
        seccion.remove();
    }
}

function formatearFechaHoy(fechaISO) {
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fechaISO + 'T00:00:00').toLocaleDateString('es-PE', opciones);
}
/* =============================================
   MODAL DE BANNERS (eventos/anuncios)
   Se inicia junto con el carrusel y el reproductor,
   justo después de que el preloader termina.
   ============================================= */
async function iniciarBannerModal() {

  const modal = document.getElementById('banner-modal');
  const botonReabrir = document.getElementById('banner-reabrir');
  if (!modal || !botonReabrir) return;

  let banners = [];

  try {
    const respuesta = await fetch(`${API_BASE_URL}/banners/publicados?tamano=5`);
    if (!respuesta.ok) return;

    const datos = await respuesta.json();
    banners = datos.content || [];
  } catch (error) {
    console.warn('No se pudieron cargar los banners:', error);
    return;
  }

  if (banners.length === 0) return; // sin banners, ni modal ni botón flotante

  let indiceActual = 0;

  const media = document.getElementById('banner-modal-media');
  const titulo = document.getElementById('banner-modal-titulo');
  const descripcion = document.getElementById('banner-modal-descripcion');
  const fecha = document.getElementById('banner-modal-fecha');
  const dotsContenedor = document.getElementById('banner-modal-dots');
  const cerrarBtn = document.getElementById('banner-modal-close');
  const backdrop = document.getElementById('banner-modal-backdrop');

  function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const opciones = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(fechaISO).toLocaleDateString('es-PE', opciones);
}

  function mostrarBanner(indice) {
    const banner = banners[indice];

    media.innerHTML = '';

    if (banner.tipoArchivo === 'VIDEO') {
    const video = document.createElement('video');
    video.src = banner.imagenUrl;
    video.controls = true;      // el visitante decide cuándo reproducir
    video.playsInline = true;
    // ya no ponemos autoplay ni muted
    media.appendChild(video);
} else {
    const img = document.createElement('img');
    img.src = banner.imagenUrl;
    img.alt = banner.titulo;
    media.appendChild(img);
}

    titulo.textContent = banner.titulo;
    descripcion.textContent = banner.descripcion || '';
    fecha.textContent = banner.fechaEvento ? formatearFecha(banner.fechaEvento) : '';

    dotsContenedor.querySelectorAll('button').forEach((punto, i) => {
      punto.classList.toggle('activo', i === indice);
    });
  }

  function crearDots() {
    dotsContenedor.innerHTML = '';
    if (banners.length <= 1) return;

    banners.forEach((_, i) => {
      const punto = document.createElement('button');
      punto.type = 'button';
      punto.setAttribute('aria-label', `Ver anuncio ${i + 1}`);
      punto.addEventListener('click', () => {
        indiceActual = i;
        mostrarBanner(indiceActual);
      });
      dotsContenedor.appendChild(punto);
    });
  }

  function abrirModal() {
    indiceActual = 0;
    mostrarBanner(indiceActual);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('visible'));
    botonReabrir.hidden = true; // mientras el modal está abierto, ocultamos el botón flotante
  }

  function cerrarModal() {
    modal.classList.remove('visible');
    setTimeout(() => { modal.hidden = true; }, 300);
    sessionStorage.setItem('banners-vistos', 'true');
    botonReabrir.hidden = false; // al cerrar, mostramos el botón para reabrir cuando quiera
  }

  cerrarBtn.addEventListener('click', cerrarModal);
  backdrop.addEventListener('click', cerrarModal);
  botonReabrir.addEventListener('click', abrirModal);

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !modal.hidden) cerrarModal();
  });

  crearDots();

  // Solo se abre automáticamente si no se ha visto en esta sesión;
  // si ya se vio, dejamos directamente visible el botón para reabrir.
  if (sessionStorage.getItem('banners-vistos')) {
    botonReabrir.hidden = false;
  } else {
    abrirModal();
  }
}

/* =============================================
   CARRUSEL DE IMÁGENES DE PASTORES
   Se llama desde el preloader al terminar.
   ============================================= */
function iniciarCarrusel() {
  let currentIndex = 0;
  const imgElement = document.getElementById("pastores-img");

  // Verificar que el elemento existe antes de usarlo
  if (!imgElement) return;

  setInterval(() => {
    // Fade out
    imgElement.style.opacity = 0;

    setTimeout(() => {
      // Alternar entre imagen 0 e imagen 1
      currentIndex = currentIndex === 0 ? 1 : 0;
      imgElement.src = pastores[currentIndex];

      // Fade in
      imgElement.style.opacity = 1;
    }, 300);

  }, 4000);
}
/* =============================================
   GALERÍA DINÁMICA
   Carga las fotos activas desde el backend y las
   inserta en el carrusel (duplicadas en ambos
   grupos, para mantener el efecto de scroll continuo).
   ============================================= */
async function iniciarGaleria() {
    const grupo1 = document.getElementById('galeria-grupo-1');
    const grupo2 = document.getElementById('galeria-grupo-2');
    if (!grupo1 || !grupo2) return;

    try {
        const respuesta = await fetch(`${API_BASE_URL}/fotos/publicas?tamano=30`);
        if (!respuesta.ok) return;

        const datos = await respuesta.json();
        const fotos = datos.content || [];

        if (fotos.length === 0) return;

        function crearTarjetas() {
            return fotos.map((foto) => {
                const card = document.createElement('div');
                card.className = 'card';
                const img = document.createElement('img');
                img.src = foto.imagenUrl;
                img.alt = foto.descripcion || 'Foto de la galería';
                img.loading = 'lazy';
                card.appendChild(img);
                return card;
            });
        }

        crearTarjetas().forEach((card) => grupo1.appendChild(card));
        crearTarjetas().forEach((card) => grupo2.appendChild(card));

    } catch (error) {
        console.warn('No se pudo cargar la galería:', error);
    }
}
/* =============================================
   FOOTER: año dinámico y botón "volver arriba"
   ============================================= */
function iniciarFooter() {

  // Año actual en el copyright, para no tener que actualizarlo a mano
  const anioSpan = document.getElementById('footer-year');
  if (anioSpan) anioSpan.textContent = new Date().getFullYear();

  // Botón "volver arriba": aparece al bajar y sube suavemente al hacer clic
  const botonSubir = document.getElementById('back-to-top');
  if (!botonSubir) return;

  const ALTURA_MINIMA = 400; // px de scroll antes de mostrar el botón

  function actualizarVisibilidad() {
    botonSubir.classList.toggle('visible', window.scrollY > ALTURA_MINIMA);
  }

  window.addEventListener('scroll', actualizarVisibilidad, { passive: true });
  actualizarVisibilidad();

  botonSubir.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', iniciarFooter);

/* =============================================
   REPRODUCTOR DE AUDIO
   Se llama desde el preloader al terminar.

   NOTA: las variables "trackSelect", "audio",
   "currentTrack", "playlist", "loadTrack",
   "playTrack", "setPlaying", "progressFill" y
   "timeCurrent" no se declaran en este archivo:
   provienen de assets/js/audio-player.js, que se
   carga sin "defer" al final del <body> y por eso
   ya existe cuando esta función se ejecuta. Se
   mantiene igual que el original para no romper
   esa integración.
   ============================================= */
function iniciarReproductor() {

  // Si el reproductor no existe en la página, no seguimos
  if (typeof trackSelect === 'undefined' || !trackSelect) return;

  // ── Selector de canciones ────────────────────────────
  trackSelect.addEventListener('change', () => {

    if (trackSelect.value === '') return;

    currentTrack = Number(trackSelect.value);

    loadTrack(currentTrack);

    playTrack();

  });

  // ── Pista anterior ───────────────────────────────────
  document.getElementById('btn-prev').addEventListener('click', () => {

    if (currentTrack > 0) {

      currentTrack--;

      loadTrack(currentTrack);

      trackSelect.value = currentTrack;

      playTrack();
    }

  });

  // ── Pista siguiente ──────────────────────────────────
  document.getElementById('btn-next').addEventListener('click', () => {

    if (currentTrack < playlist.length - 1) {

      currentTrack++;

      loadTrack(currentTrack);

      trackSelect.value = currentTrack;

      playTrack();
    }

  });

  // ── Reproducir siguiente automáticamente ─────────────
  audio.addEventListener('ended', () => {

    if (currentTrack < playlist.length - 1) {

      currentTrack++;

      loadTrack(currentTrack);

      trackSelect.value = currentTrack;

      playTrack();

    } else {

      setPlaying(false);

      progressFill.style.width = '0%';

      timeCurrent.textContent = '0:00';

    }

  });

  // Volumen inicial al 80%
  audio.volume = 0.8;
}