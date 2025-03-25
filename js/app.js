const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultados');
const mensajeError = document.querySelector('#mensaje-error');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarPersonaje);
});

function buscarPersonaje(e) {
    e.preventDefault(); 
    limpiar(); 

    console.log('Buscando personaje...');

    let personaje = document.querySelector('#personaje').value; 

    if (personaje.trim() === '') {
        mostrarError('El campo es obligatorio: ingresa el nombre de un personaje');
        return; 
    }
   consultarAPI(personaje);
}

function consultarAPI(personaje) {
    const apiKey = '98a4d0528e3878e674db3126f42e7874';
    const privateKey = 'c050bb5e4fb84d40ce1d2a9464eab17ec40533be';
    const ts = Date.now();
    const hash = md5(ts + privateKey + apiKey);

    const personajeCodificado = encodeURIComponent(personaje);
    const url = `https://gateway.marvel.com/v1/public/characters?name=${personajeCodificado}&ts=${ts}&apikey=${apiKey}&hash=${hash}`;
    console.log(url);

    fetch(url)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Error en la solicitud a la API');
            }
            return respuesta.json();
        })
        .then(datos => {
            console.log(datos);
            if (datos.data.total === 0) {
                mostrarError('El personaje no se encuentra en la API');
            } else {
                mostrarPersonaje(datos);
            }
        })
        .catch(error => {
            console.error('Error al consultar la API:', error);
            mostrarError('No se pudo obtener la información');
        });
}

function mostrarError(mensaje) {
    limpiar();

    const error = document.createElement('div');
    error.innerHTML = `
        <strong>Error!</strong>
        <span>${mensaje}</span>
    `;
    error.classList.add('alert', 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'relative');

    resultado.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 5000);
}

function mostrarPersonaje(datos) {
    const { results } = datos.data;

    if (!results || results.length === 0) {
        mostrarError('El personaje no se encuentra en la API');
        return;
    }

    const { name, description, thumbnail } = results[0];

    const resultadoContainer = document.createElement('div');
    resultadoContainer.classList.add('resultado-container');

    const imagenDiv = document.createElement('div');
    imagenDiv.classList.add('resultado-imagen');

    const imagenPersonaje = document.createElement('img');
    imagenPersonaje.src = `${thumbnail.path}.${thumbnail.extension}`;
    imagenPersonaje.alt = name;
    imagenDiv.appendChild(imagenPersonaje);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('resultado-info');

    const nombrePersonaje = document.createElement('p');
    nombrePersonaje.classList.add('nombre-personaje');
    nombrePersonaje.textContent = name;

    const descripcionPersonaje = document.createElement('p');
    descripcionPersonaje.classList.add('descripcion-personaje');
    descripcionPersonaje.textContent = description ? description : 'No hay descripción disponible';

    infoDiv.appendChild(nombrePersonaje);
    infoDiv.appendChild(descripcionPersonaje);

    resultadoContainer.appendChild(imagenDiv);
    resultadoContainer.appendChild(infoDiv);

    limpiar();
    resultado.appendChild(resultadoContainer);
}

function limpiar() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
    while (mensajeError.firstChild) {
        mensajeError.removeChild(mensajeError.firstChild);
    }
}

function md5(string) {
    return CryptoJS.MD5(string).toString();
}