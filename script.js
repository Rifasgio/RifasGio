// Esperamos a que la página cargue por completo
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los botones de números
    const boletos = document.querySelectorAll('.numero');

    // Le añadimos la función a cada uno para que reaccione al tocarlo
    boletos.forEach(boleto => {
        boleto.addEventListener('click', () => {
            // Al tocarlo, añade o quita la clase "seleccionado"
            boleto.classList.toggle('seleccionado');
        });
    });
});
