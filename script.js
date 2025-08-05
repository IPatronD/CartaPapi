document.addEventListener('DOMContentLoaded', function () {
    // Efecto de aparición gradual
    const elementos = document.querySelectorAll('.carta > *');
    elementos.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ${index * 0.1}s, transform 0.5s ${index * 0.1}s`;
    });

    setTimeout(() => {
        elementos.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 300);

    // Efecto al hacer clic en la carta
    const carta = document.querySelector('.carta');
    carta.addEventListener('click', function () {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });

    // Confeti al abrir
    const sobre = document.querySelector('.sobre');
    sobre.addEventListener('click', function (e) {
        if (e.target === this) {
            const confeti = document.createElement('div');
            confeti.innerHTML = '🎉🎊🥳';
            confeti.style.position = 'fixed';
            confeti.style.top = '0';
            confeti.style.left = '0';
            confeti.style.width = '100%';
            confeti.style.height = '100%';
            confeti.style.display = 'flex';
            confeti.style.justifyContent = 'center';
            confeti.style.alignItems = 'center';
            confeti.style.fontSize = '50px';
            confeti.style.pointerEvents = 'none';
            confeti.style.zIndex = '100';
            confeti.style.animation = 'fadeOut 2s forwards';

            document.body.appendChild(confeti);

            setTimeout(() => {
                confeti.remove();
            }, 2000);
        }
    });

    // Funcionalidad del carrusel mejorado
    const carrusel = document.querySelector('.carrusel');
    const carruselInner = document.querySelector('.carrusel-inner');
    const items = document.querySelectorAll('.carrusel-item');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const indicadoresContainer = document.querySelector('.carrusel-indicadores');

    let currentIndex = 0;
    let intervalo;
    const totalItems = items.length;

    // Crear indicadores
    function crearIndicadores() {
        indicadoresContainer.innerHTML = '';
        items.forEach((_, index) => {
            const indicador = document.createElement('div');
            indicador.classList.add('carrusel-indicador');
            if (index === 0) indicador.classList.add('active');
            indicador.addEventListener('click', () => goToItem(index));
            indicadoresContainer.appendChild(indicador);
        });
    }

    // Actualizar carrusel
    function updateCarrusel() {
        carruselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualizar clases active
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        // Actualizar indicadores
        const indicadores = document.querySelectorAll('.carrusel-indicador');
        indicadores.forEach((ind, index) => {
            ind.classList.toggle('active', index === currentIndex);
        });
    }

    // Ir a un item específico
    function goToItem(index) {
        currentIndex = index;
        updateCarrusel();
        resetInterval();
    }

    // Siguiente item
    function nextItem() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarrusel();
    }

    // Item anterior
    function prevItem() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarrusel();
    }

    // Reiniciar intervalo
    function resetInterval() {
        clearInterval(intervalo);
        startInterval();
    }

    // Iniciar intervalo
    function startInterval() {
        intervalo = setInterval(() => {
            nextItem();
        }, 5000);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextItem();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevItem();
        resetInterval();
    });

    // Iniciar carrusel
    crearIndicadores();
    updateCarrusel();
    startInterval();

    // Pausar auto-avance al interactuar
    carrusel.addEventListener('mouseenter', () => clearInterval(intervalo));
    carrusel.addEventListener('mouseleave', startInterval);

    // Lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="close-lightbox">&times;</span>
        <div class="lightbox-content">
            <img class="lightbox-img" src="" alt="">
        </div>
        <span class="lightbox-control lightbox-prev"><i class="fas fa-chevron-left"></i></span>
        <span class="lightbox-control lightbox-next"><i class="fas fa-chevron-right"></i></span>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.querySelector('.lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    // Abrir lightbox
    items.forEach(item => {
        const img = item.querySelector('img');
        img.addEventListener('click', () => {
            lightbox.style.display = 'block';
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            document.body.style.overflow = 'hidden';
        });
    });

    // Cerrar lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Navegación en lightbox
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevItem();
        lightboxImg.src = items[currentIndex].querySelector('img').src;
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextItem();
        lightboxImg.src = items[currentIndex].querySelector('img').src;
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowLeft') {
                prevItem();
                lightboxImg.src = items[currentIndex].querySelector('img').src;
            } else if (e.key === 'ArrowRight') {
                nextItem();
                lightboxImg.src = items[currentIndex].querySelector('img').src;
            }
        }
    });

    // Agregar estilo para el fadeOut
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.5); }
        }
    `;
    document.head.appendChild(style);
});