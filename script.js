document.addEventListener('DOMContentLoaded', () => {
    // === SECCIÓN 1: SELECCIÓN DE BOLETOS Y CÁLCULO EN TIEMPO REAL ===
    const boletos = document.querySelectorAll('.numero');
    const contadorBoletos = document.getElementById('cantidad-boletos');
    const contadorPrecio = document.getElementById('precio-total');

    const PRECIO_BOLETO = 150; // El precio por boleto que definiste

    boletos.forEach(boleto => {
        boleto.addEventListener('click', () => {
            // Activa o desactiva el color verde del boleto al hacer clic
            boleto.classList.toggle('seleccionado');

            // Cuenta cuántos boletos tienen la clase 'seleccionado' en este momento
            const seleccionados = document.querySelectorAll('.numero.seleccionado').length;

            // Actualiza los textos en la pantalla en tiempo real
            contadorBoletos.textContent = seleccionados;
            contadorPrecio.textContent = seleccionados * PRECIO_BOLETO;
        });
    });

    // === SECCIÓN 2: BOTÓN DE COMPRA Y ENVÍO A WHATSAPP ===
    const btnComprar = document.getElementById('btn-comprar');
    
    // Verificamos que el botón exista en el HTML para evitar errores en consola
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            // Obtenemos los datos actuales que están reflejados en la pantalla
            const cantidad = contadorBoletos.textContent;
            const precioTotal = contadorPrecio.textContent;

            // Validación: Si el usuario no ha seleccionado boletos, detenemos el proceso
            if (parseInt(cantidad) === 0 || cantidad === "") {
                alert("Por favor, selecciona al menos un boleto antes de comprar.");
                return;
            }

            // Buscamos los textos de los números de los boletos que se seleccionaron
            const botonesSeleccionados = document.querySelectorAll('.numero.seleccionado');
            let numerosElegidos = [];
            
            botonesSeleccionados.forEach(boton => {
                numerosElegidos.push(boton.innerText);
            });

            // Redactamos el mensaje automático para WhatsApp respetando los saltos de línea
            let mensaje = ¡Hola! Quiero comprar boletos para la rifa.
*Boletos seleccionados:* ${numerosElegidos.join(', ')}
*Cantidad:* ${cantidad}
*Total a pagar:* $${precioTotal} MXN

¿Me compartes tus datos de transferencia para realizar el pago?`;

            // ⚠️ REMPLAZA AQUÍ: Pon tu número de WhatsApp con código de país (ej. 521XXXXXXXXXX para México)
            const MI_TELEFONO_WHATSAPP = "523312169240"; 

            // Creamos el enlace seguro de WhatsApp codificando el texto y lo abrimos en una nueva pestaña
            let urlWhatsApp = `https://wa.me{MI_TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
            window.open(urlWhatsApp, '_blank');
        });
    }
});

