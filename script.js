document.addEventListener('DOMContentLoaded', () => {

    // === 1. TU LÓGICA ORIGINAL (REPARADA) ===
    // Esto hace que los boletos se pongan verdes y sumen el dinero exactamente como antes
    const boletos = document.querySelectorAll('.numero');
    const contadorBoletos = document.getElementById('cantidad-boletos');
    const contadorPrecio = document.getElementById('precio-total');
    const PRECIO_BOLETO = 150;

    boletos.forEach(boleto => {
        boleto.addEventListener('click', () => {
            // Activa o desactiva el boleto
            boleto.classList.toggle('seleccionado');

            // Cuenta los seleccionados en tiempo real
            const seleccionados = document.querySelectorAll('.numero.seleccionado').length;

            // Actualiza la pantalla
            contadorBoletos.textContent = seleccionados;
            contadorPrecio.textContent = seleccionados * PRECIO_BOLETO;
        });
    });

    // === 2. BOTÓN DE COMPRA (SEPARADO PARA NO INTERFERIR) ===
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            const cantidad = contadorBoletos.textContent;
            const precioTotal = contadorPrecio.textContent;

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

            // Cambia las X por tu número de teléfono real (ej. 521XXXXXXXXXX)
            const MI_TELEFONO_WHATSAPP = "5213312169240"; 

                            let urlWhatsApp = "https://whatsapp.com" + MI_TELEFONO_WHATSAPP + "&text=" + encodeURIComponent(mensaje);

            window.open(urlWhatsApp, '_blank');


        });
    }
});
