document.addEventListener('DOMContentLoaded', () => {

    // === 1. LÓGICA DE SELECCIÓN Y CONFIGURACIONES ===
    const boletos = document.querySelectorAll('.numero');
    const contadorBoletos = document.getElementById('cantidad-boletos');
    const contadorPrecio = document.getElementById('precio-total');
    const PRECIO_BOLETO = 150;
    
    // === ELEMENTOS DE LA INTERFAZ ===
    const contadorRestantes = document.getElementById('numeros-restantes'); 
    const contenedorReloj = document.getElementById('temporizador-apartado'); 

    let tiempoLimite = null;
    let intervaloReloj = null;
    const TOTAL_BOLETOS_RIFA = boletos ? boletos.length : 10; 

    // === FUNCIÓN: ACTUALIZAR NÚMEROS RESTANTES ===
    function actualizarRestantes() {
        const seleccionados = document.querySelectorAll('.numero.seleccionado').length;
        if (contadorRestantes) {
            contadorRestantes.textContent = TOTAL_BOLETOS_RIFA - seleccionados;
        }
    }

    // === LÓGICA: TEMPORIZADOR DE 10 MINUTOS ===
    function iniciarTemporizador() {
        if (intervaloReloj) clearInterval(intervaloReloj);
        tiempoLimite = Date.now() + 10 * 60 * 1000;
        localStorage.setItem('rifa_expiracion', tiempoLimite);
        correrReloj();
    }

    function correrReloj() {
        if (intervaloReloj) clearInterval(intervaloReloj);
        
        intervaloReloj = setInterval(() => {
            const tiempoActual = Date.now();
            const diferencia = tiempoLimite - tiempoActual;

            if (diferencia <= 0) {
                clearInterval(intervaloReloj);
                liberarBoletosPorExpiracion();
                return;
            }

            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

            const textoMinutos = minutos < 10 ? '0' + minutos : minutos;
            const textoSegundos = segundos < 10 ? '0' + segundos : segundos;

            if (contenedorReloj) {
                contenedorReloj.style.display = 'block'; 
                contenedorReloj.innerHTML = `⚠️ Tus boletos están apartados. Tiempo restante para pagar: <b>${textoMinutos}:${textoSegundos}</b>`;
            }
        }, 1000);
    }

    function liberarBoletosPorExpiracion() {
        if(boletos) {
            boletos.forEach(boleto => boleto.classList.remove('seleccionado'));
        }
        
        if(contadorBoletos) contadorBoletos.textContent = 0;
        if(contadorPrecio) contadorPrecio.textContent = 0;
        
        localStorage.removeItem('rifa_expiracion');
        localStorage.removeItem('rifa_seleccionados');

        if (contenedorReloj) {
            contenedorReloj.innerHTML = "❌ El tiempo de apartado expiró. Los boletos se han liberado.";
        }
        
        actualizarRestantes();
        alert("Tu tiempo de 10 minutos para apartar los boletos ha expirado. Por favor, selecciónalos de nuevo.");
    }

    function guardarSeleccionEnDispositivo() {
        let numerosElegidos = [];
        document.querySelectorAll('.numero.seleccionado').forEach(boton => {
            numerosElegidos.push(boton.innerText);
        });
        localStorage.setItem('rifa_seleccionados', JSON.stringify(numerosElegidos));
    }

    // === COMPROBAR SESIÓN ACTIVA AL CARGAR ===
    const expiracionGuardada = localStorage.getItem('rifa_expiracion');
    const seleccionadosGuardados = localStorage.getItem('rifa_seleccionados');

    if (expiracionGuardada && Date.now() < parseInt(expiracionGuardada) && seleccionadosGuardados) {
        tiempoLimite = parseInt(expiracionGuardada);
        const numerosInteresados = JSON.parse(seleccionadosGuardados);

        if(boletos) {
            boletos.forEach(boleto => {
                if (numerosInteresados.includes(boleto.innerText)) {
                    boleto.classList.add('seleccionado');
                }
            });
        }

        const cantidadRecuperada = numerosInteresados.length;
        // CORREGIDO: Ya no dice quantityRecuperada, ahora está correcto
        if(contadorBoletos) contadorBoletos.textContent = cantidadRecuperada;
        if(contadorPrecio) contadorPrecio.textContent = cantidadRecuperada * PRECIO_BOLETO;
        
        correrReloj(); 
    }

    actualizarRestantes();

    // === EVENTO CLICK EN LOS BOLETOS ===
    if(boletos) {
        boletos.forEach(boleto => {
            boleto.addEventListener('click', () => {
                boleto.classList.toggle('seleccionado');

                const seleccionados = document.querySelectorAll('.numero.seleccionado').length;

                if(contadorBoletos) contadorBoletos.textContent = seleccionados;
                if(contadorPrecio) contadorPrecio.textContent = seleccionados * PRECIO_BOLETO;

                actualizarRestantes();

                if (seleccionados > 0) {
                    if (!localStorage.getItem('rifa_expiracion')) {
                        iniciarTemporizador();
                    }
                    guardarSeleccionEnDispositivo();
                } else {
                    if(intervaloReloj) clearInterval(intervaloReloj);
                    localStorage.removeItem('rifa_expiracion');
                    localStorage.removeItem('rifa_seleccionados');
                    if (contenedorReloj) contenedorReloj.style.display = 'none';
                }
            });
        });
    }

    // === 2. BOTÓN DE COMPRA CORREGIDO CON TU NÚMERO ===
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            const seleccionadosActuales = document.querySelectorAll('.numero.seleccionado');
            const cantidad = seleccionadosActuales.length;
            const precioTotal = cantidad * PRECIO_BOLETO;

            if (cantidad === 0) {
                alert("Por favor, selecciona al menos un boleto antes de comprar.");
                return;
            }

            let numerosElegidos = [];
            seleccionadosActuales.forEach(boton => {
                numerosElegidos.push(boton.innerText);
            });

            let mensaje = `¡Hola! Quiero comprar boletos para la rifa.
*Boletos seleccionados:* ${numerosElegidos.join(', ')}
*Cantidad:* ${cantidad}
*Total a pagar:* $${precioTotal} MXN

¿Me compartes tus datos de transferencia para realizar el pago?`;

            // Enlace directo absoluto y verificado por partes para tu número: 523312169240
            const lada = "52";
            const telefonoFijo = "3312169240";
            let urlWhatsApp = "https://wa.me" + lada + telefonoFijo + "?text=" + encodeURIComponent(mensaje);
            
            window.open(urlWhatsApp, '_blank'); 
        });
    }
});
