const playlist = [
    {
        title: "¿Te sientes casi?",
        artist: "Melodias Celestiales",
        album: "Melodias Celestiales",
        src: "assets/audio/te-sientes-casi.mp3"
    },
    {
        title: "Dulce comunión",
        artist: "Melodias Celestiales",
        album: "Melodias Celestiales",
        src: "assets/audio/dulce-comunion.mp3"
    },
    {
        title: "El gran médico",
        artist: "Melodias Celestiales",
        album: "Melodias Celestiales",
        src: "assets/audio/el-gran-medico.mp3"
    },
    {
        title: "Dulces melodías",
        artist: "Melodias Celestiales",
        album: "Melodias Celestiales",
        src: "assets/audio/dulces-melodias.mp3"
    },{
        title: "La siembra",
        artist: "Melodias Celestiales",
        album: "Melodias Celestiales",
        src: "assets/audio/la-siembra.mp3"
    },{
        title: "Oh Cristo amado",
        artist: "Melodias Celestiales",
        album: "Melodias Celestiales",
        src: "assets/audio/oh-cristo-amado.mp3"
    },{
        title: "Todo a Cristo",
        artist: "Melodias Celestiales",
        album: "Melodias Celestiales",
        src: "assets/audio/todo-a-cristo.mp3"
    }
];
// Obtener referencias a los elementos del reproductor
const audio = document.getElementById("audio-player");

const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const trackAlbum = document.getElementById("track-album");

const trackSelect = document.getElementById("track-select");

const playBtn = document.getElementById("btn-play");


const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");
//variables de control de estado
let currentTrack = 0;
let isPlaying = false;
//Funcion para cargar canciones
function loadTrack(index){

    const track = playlist[index];

    audio.src = track.src;

    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    trackAlbum.textContent = track.album;
}
// Función para reproducir o pausar la canción
loadTrack(0);
// Función para reproducir la canción
function playTrack(){

    audio.play();

    isPlaying = true;

    iconPlay.style.display = "none";
    iconPause.style.display = "block";
}

function pauseTrack(){

    audio.pause();

    isPlaying = false;

    iconPlay.style.display = "block";
    iconPause.style.display = "none";
}
// Evento para el botón de play/pause
playBtn.addEventListener("click", () => {

    if(isPlaying){
        pauseTrack();
    }else{
        playTrack();
    }

});
// Función para cambiar de pista
playlist.forEach((track, index) => {

    const option = document.createElement("option");

    option.value = index;
    option.textContent = track.title;

    trackSelect.appendChild(option);

});
// Evento para el selector de pistas
trackSelect.addEventListener("change", () => {

    currentTrack = Number(trackSelect.value);

    loadTrack(currentTrack);

    playTrack();

});
/* =============================================
   REFERENCIAS ADICIONALES DEL REPRODUCTOR
   ============================================= */
const progressTrack = document.getElementById("progress-track");
const progressFill = document.getElementById("progress-fill");
const timeCurrent = document.getElementById("time-current");
const timeTotal = document.getElementById("time-total");

const rewindBtn = document.getElementById("btn-rewind");
const forwardBtn = document.getElementById("btn-forward");

const volSlider = document.getElementById("vol-slider");
const volLabel = document.getElementById("vol-label");

const SEGUNDOS_SALTO = 10;

/* =============================================
   FORMATEAR SEGUNDOS A "M:SS"
   ============================================= */
function formatearTiempo(segundos) {
    if (!isFinite(segundos) || isNaN(segundos)) return "0:00";

    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);

    return `${minutos}:${segundosRestantes.toString().padStart(2, "0")}`;
}

/* =============================================
   FUNCIÓN COMPARTIDA PARA ACTUALIZAR EL ÍCONO
   (la usa script.js cuando termina una canción)
   ============================================= */
function setPlaying(reproduciendo) {
    isPlaying = reproduciendo;
    iconPlay.style.display = reproduciendo ? "none" : "block";
    iconPause.style.display = reproduciendo ? "block" : "none";
}

/* =============================================
   DURACIÓN TOTAL: se conoce cuando el navegador
   termina de leer los metadatos del archivo
   ============================================= */
audio.addEventListener("loadedmetadata", () => {
    timeTotal.textContent = formatearTiempo(audio.duration);
});

/* =============================================
   PROGRESO: se actualiza mientras se reproduce
   ============================================= */
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const porcentaje = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${porcentaje}%`;
    timeCurrent.textContent = formatearTiempo(audio.currentTime);
});

/* =============================================
   BARRA DE PROGRESO: hacer clic para saltar
   a un punto específico de la canción
   ============================================= */
progressTrack.addEventListener("click", (evento) => {
    if (!audio.duration) return;

    const rect = progressTrack.getBoundingClientRect();
    const clicX = evento.clientX - rect.left;
    const porcentaje = clicX / rect.width;

    audio.currentTime = porcentaje * audio.duration;
});

/* =============================================
   RETROCEDER / ADELANTAR 10 SEGUNDOS
   ============================================= */
rewindBtn.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - SEGUNDOS_SALTO);
});

forwardBtn.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + SEGUNDOS_SALTO);
});

/* =============================================
   CONTROL DE VOLUMEN
   ============================================= */
volSlider.addEventListener("input", () => {
    const valor = Number(volSlider.value);

    audio.volume = valor / 100;
    volLabel.textContent = `${valor}%`;

    // Actualiza el relleno visual del slider (coincide con el estilo de tu CSS)
    volSlider.style.background =
        `linear-gradient(to right, var(--dorado) ${valor}%, #dde3ef ${valor}%)`;
});