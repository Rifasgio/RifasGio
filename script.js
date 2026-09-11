document.addEventListener('DOMContentLoaded', () => {

    // === 1. LÓGICA DE SELECCIÓN Y CONFIGURACIONES ===
    const boletos = document.querySelectorAll('.numero');
    const contadorBoletos = document.getElementById('cantidad-boletos');
    const contadorPrecio = document.getElementById('precio-total');
    const PRECIO_BOLETO = 150;
    
    // === ELEMENTOS DE LA INTERFAZ PARA RECOGER DEL HTML ===
    const contadorRestantes = document.getElementById('numeros-restantes'); 
    const contenedorReloj = document.getElementById('temporizador-apartado'); 

    let tiempoLimite = null;
    let intervaloReloj = null;
    const TOTAL_BOLETOS_RIFA = boletos.length; // Cuenta automáticamente cuántos boletos pusiste en el HTML

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

        // Guardamos el momento exacto en que expira (Tiempo actual + 10 minutos)
        tiempoLimite = Date.now() + 10 * 60 * 1000;
        localStorage.setItem('rifa_expiracion', tiempoLimite);

        correrReloj();
    }

    function correrReloj() {
        intervaloReloj = setInterval(() => {
            const tiempoActual = Date.now();
            const diferencia = tiempoLimite - tiempoActual;

            if (diferencia <= 0) {
                // El tiempo se acabó
                clearInterval(intervaloReloj);
                liberarBoletosPorExpiracion();
                return;
            }

            // Calcular minutos y segundos restantes
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

            // Formatear texto estilo 09:05
            const textoMinutos = minutos < 10 ? '0' + minutos : minutos;
            const textoSegundos = segundos < 10 ? '0' + segundos : segundos;

            if (contenedorReloj) {
                contenedorReloj.style.display = 'block'; 
                contenedorReloj.innerHTML = `⚠️ Tus boletos están apartados. Tiempo restante para pagar: <b>${textoMinutos}:${textoSegundos}</b>`;
            }
        }, 1000);
    }

    function liberarBoletosPorExpiracion() {
        // Quita la selección de todos los boletos
        boletos.forEach(boleto => boleto.classList.remove('seleccionado'));
        
        // Reinicia los contadores a cero
        contadorBoletos.textContent = 0;
        contadorPrecio.textContent = 0;
        
        // Limpia la memoria local del navegador
        localStorage.removeItem('rifa_expiracion');
        localStorage.removeItem('rifa_seleccionados');

        if (contenedorReloj) {
            contenedorReloj.innerHTML = "❌ El tiempo de apartado expiró. Los boletos se han liberado.";
        }
        
        actualizarRestantes();
        alert("Tu tiempo de 10 minutos para apartar los boletos ha expirado. Por favor, selecciónalos de nuevo.");
    }

    // === GUARDAR SELECCIÓN EN MEMORIA LOCAL ===
    function guardarSeleccionEnDispositivo() {
        let numerosElegidos = [];
        document.querySelectorAll('.numero.seleccionado').forEach(boton => {
            numerosElegidos.push(boton.innerText);
        });
        localStorage.setItem('rifa_seleccionados', JSON.stringify(numerosElegidos));
    }

    // === COMPROBAR SI HABÍA UNA SESIÓN ACTIVA AL CARGAR LA PÁGINA ===
    const expiracionGuardada = localStorage.getItem('rifa_expiracion');
    const seleccionadosGuardados = localStorage.getItem('rifa_seleccionados');

    if (expiracionGuardada && Date.now() < expiracionGuardada && seleccionadosGuardados) {
        tiempoLimite = parseInt(expiracionGuardada);
        const numerosInteresados = JSON.parse(seleccionadosGuardados);

        boletos.forEach(boleto => {
            if (numerosInteresados.includes(boleto.innerText)) {
                boleto.classList.add('seleccionado');
            }
        });

        const cantidadRecuperada = numerosInteresados.length;
        contadorBoletos.textContent = cantidadRecuperada;
        contadorPrecio.textContent = cantidadRecuperada * PRECIO_BOLETO;
        
        correrReloj(); 
    }

    // Ejecución inicial para calcular los restantes del principio
    actualizarRestantes();

    // === EVENTO CLICK EN LOS BOLETOS ===
    boletos.forEach(boleto => {
        boleto.addEventListener('click', () => {
            boleto.classList.toggle('seleccionado');

            const seleccionados = document.querySelectorAll('.numero.seleccionado').length;

            contadorBoletos.textContent = seleccionados;
            contadorPrecio.textContent = seleccionados * PRECIO_BOLETO;

            actualizarRestantes();

            if (seleccionados > 0) {
                if (!localStorage.getItem('rifa_expiracion')) {
                    iniciarTemporizador();
                }
                guardarSeleccionEnDispositivo();
            } else {
                clearInterval(intervaloReloj);
                localStorage.removeItem('rifa_expiracion');
                localStorage.removeItem('rifa_seleccionados');
                if (contenedorReloj) contenedorReloj.style.display = 'none';
            }
        });
    });

    // === 2. BOTÓN DE COMPRA (CORREGIDO TOTALMENTE) ===
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            const cantidad = contadorBoletos.textContent;
            const precioTotal = contadorPrecio.textContent;

            // Se corrigió el nombre de la variable para que no se trabe el botón
            if (parseInt(cantidad) === 0 || cantidad === "") {
                alert("Por favor, selecciona al menos un boleto antes de comprar.");
                return;
            }

            const botonesSeleccionados = document.querySelectorAll('.numero.seleccionado');
            let numerosElegidos = [];
            
            botonesSeleccionados.forEach(boton => {
                numerosElegidos.push(boton.innerText);
            });

            let mensaje = `¡Hola! Quiero comprar boletos para la rifa.
*Boletos seleccionados:* ${numerosElegidos.join(', ')}
*Cantidad:* ${cantidad}
*Total a pagar:* $${precioTotal} MXN

¿Me compartes tus datos de transferencia para realizar el pago?`;

            const MI_TELEFONO_WHATSAPP = "5213312169240"; 
            let urlWhatsApp = "https://wa.me" + MI_TELEFONO_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
            
            window.open(urlWhatsApp, '_blank'); 
        });
    }
});

