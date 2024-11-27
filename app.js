import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase Configuración
const firebaseConfig = {
    apiKey: "AIzaSyCwbr5J2idiM3avOT5b3z1bfzSkxEIHcRc",
    authDomain: "temperatura-planta-auto.firebaseapp.com",
    databaseURL: "https://temperatura-planta-auto-default-rtdb.firebaseio.com",
    projectId: "temperatura-planta-auto",
    storageBucket: "temperatura-planta-auto.firebasestorage.app",
    messagingSenderId: "356630632066",
    appId: "1:356630632066:web:dc27254dcc90f5a3c7069b",
    measurementId: "G-18BZN752L8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Conectado a Firebase');

// Gráfica de Chart.js
const ctx = document.getElementById('temperatureChart').getContext('2d');
let temperatureData = [];
let referenceData = [];
let timeLabels = [];
let timeCounter = 0;

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [
            { label: 'Temperatura (°C)', data: temperatureData, borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', fill: false },
            { label: 'Referencia (°C)', data: referenceData, borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)', fill: false }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Tiempo (segundos)' } },
            y: { beginAtZero: false, title: { display: true, text: 'Valor (°C)' } }
        }
    }
});

const MAX_DATA_POINTS = 50;
let lastTemperature = null;
let lastReference = null;

// Función para actualizar los datos en el gráfico
function updateGraphData() {
    if (temperatureData.length >= MAX_DATA_POINTS) {
        temperatureData.shift();
        referenceData.shift();
        timeLabels.shift();
    }
    chart.update();
}

// Simulamos la actualización de datos (en la vida real estos vendrían de Firebase)
function updateData(value, time) {
    temperatureData.push(value.temperature);
    referenceData.push(value.reference);
    timeLabels.push(time);
}

// Subscribirse a los cambios en los datos
onValue(ref(database, 'temperature'), (snapshot) => {
    lastTemperature = snapshot.val(); // Guardamos el último valor recibido
});

onValue(ref(database, 'reference'), (snapshot) => {
    lastReference = snapshot.val(); // Guardamos el último valor recibido
});

// Función para actualizar la gráfica cada 2 segundos
setInterval(() => {
    if (lastTemperature !== null && lastReference !== null) {
        updateData({ temperature: lastTemperature, reference: lastReference }, timeCounter);
        updateGraphData();
        timeCounter++;
    }
}, 2000);  // 2000 ms = 2 segundos


onValue(ref(database, 'temperature'), (snapshot) => {
    const temperature = snapshot.val();
    document.getElementById('temperature').textContent = `${temperature} °C`;
    updateDataIfChanged(temperatureData, temperature, timeCounter);
    updateGraphData();
    chart.update();
    timeCounter++;
}, { onlyOnce: false }); // Esto permite que el evento se dispare continuamente.

onValue(ref(database, 'reference'), (snapshot) => {
    const reference = snapshot.val();
    document.getElementById('reference').textContent = `${reference} °C`;
    updateDataIfChanged(referenceData, reference, timeCounter);
    updateGraphData();
    chart.update();
    timeCounter++;
}, { onlyOnce: false }); // También se dispara continuamente para referencia.
 
onValue(ref(database, 'Alarm'), (snapshot) => {
    const alarmState = snapshot.val();
    document.getElementById('Alarm').textContent = alarmState ? 'Activa' : 'No activa';
    console.log(`Estado de la alarma: ${alarmState}`);
});

onValue(ref(database, 'alarm2'), (snapshot) => {
    const alarmState = snapshot.val();
    document.getElementById('alarm2').textContent = alarmState ? 'Activa' : 'No activa';
    console.log(`Estado de la alarma 2: ${alarmState}`);
});

onValue(ref(database, 'alarm3'), (snapshot) => {
    const alarmState = snapshot.val();
    document.getElementById('alarm3').textContent = alarmState ? 'Activa' : 'No activa';
    console.log(`Estado de la alarma 3: ${alarmState}`);
});

onValue(ref(database, 'alarm4'), (snapshot) => {
    const alarmState = snapshot.val();
    document.getElementById('alarm4').textContent = alarmState ? 'Activa' : 'No activa';
    console.log(`Estado de la alarma 4: ${alarmState}`);
});

// Manejo del formulario para enviar nuevos datos
const testForm = document.getElementById('testForm');
testForm.addEventListener('submit', (event) => {
    event.preventDefault();


    const reference = parseFloat(document.getElementById('referenceInput').value);
    

    
    set(ref(database, 'reference'), reference).catch((error) => console.error('Error al actualizar referencia:', error));
    
});

// Navegación entre secciones
const sections = {
    btnPlanta: 'sectionPlanta',
    btnEmpresa: 'sectionEmpresa',
    btnEquipo: 'sectionEquipo',
    btnInstrumentos: 'sectionInstrumentos'
};

Object.keys(sections).forEach((buttonId) => {
    document.getElementById(buttonId).addEventListener('click', () => {
        Object.values(sections).forEach((sectionId) => {
            document.getElementById(sectionId).classList.add('hidden');
        });
        document.getElementById(sections[buttonId]).classList.remove('hidden');
    });
});
