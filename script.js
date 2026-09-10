document.addEventListener('DOMContentLoaded', () => {
    const boletos = document.querySelectorAll('.numero');
    const contadorBoletos = document.getElementById('cantidad-boletos');
    const contadorPrecio = document.getElementById('precio-total');
    
    const PRECIO_BOLETO = 150; // El precio por boleto que definiste

    boletos.forEach(boleto => {
        boleto.addEventListener('click', () => {
            // Activa o desactiva el color verde del boleto
            boleto.classList.toggle('seleccionado');

            // Cuenta cuántos boletos tienen la clase 'seleccionado' en este momento
            const seleccionados = document.querySelectorAll('.numero.seleccionado').length;

            // Actualiza los textos en la pantalla en tiempo real
            contadorBoletos.textContent = seleccionados;
            contadorPrecio.textContent = seleccionados * PRECIO_BOLETO;
        });
    });
});
