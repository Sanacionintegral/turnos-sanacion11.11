const API_URL = "https://script.google.com/macros/s/AKfycbw5DSkMqBCk9E8I2q_6FjNR3fBXXfWW8BHHwbZZyhEoKkwbmcpQWOX0hUZCjZ3FskhFQg/exec";

const form = document.getElementById("turno-form");
const nombreInput = document.getElementById("nombre");
const celularInput = document.getElementById("celular");
const diaSelect = document.getElementById("dia");
const horaSelect = document.getElementById("hora");

fetch(API_URL)
  .then((res) => res.json())
  .then((ocupados) => {
    const dias = generarDiasDisponibles();
    dias.forEach((dia) => {
      const option = document.createElement("option");
      option.value = dia;
      option.textContent = dia;
      diaSelect.appendChild(option);
    });

    diaSelect.addEventListener("change", () => {
      const diaElegido = diaSelect.value;
      const horas = generarHorasPorDia(diaElegido);

      horaSelect.innerHTML = "";
      horas.forEach((hora) => {
        const yaOcupado = ocupados.some(t => t.dia === diaElegido && t.hora === hora);
        if (!yaOcupado) {
          const option = document.createElement("option");
          option.value = hora;
          option.textContent = hora;
          horaSelect.appendChild(option);
        }
      });
    });
  });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = nombreInput.value;
  const celular = celularInput.value;
  const dia = diaSelect.value;
  const hora = horaSelect.value;

  if (!nombre || !celular || !dia || !hora) {
    alert("Por favor completá todos los campos.");
    return;
  }

  const url = `https://wa.me/542235931151?text=Ya reservé mi turno para el ${dia} a las ${hora}. Mi nombre es ${nombre} y mi número es ${celular}`;
  window.open(url, "_blank");

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ dia, hora, nombre, celular }),
    headers: {
      "Content-Type": "application/json"
    }
  });
});

function generarDiasDisponibles() {
  const dias = [];
  const hoy = new Date();
  for (let i = 0; i <= 40; i++) {
    const d = new Date(hoy);
    d.setDate(d.getDate() + i);
    const diaSemana = d.getDay();
    const fecha = d.getDate().toString().padStart(2, "0") + "/" + (d.getMonth() + 1).toString().padStart(2, "0");
    if ((diaSemana >= 1 && diaSemana <= 5) || diaSemana === 6) {
      const diaTexto = d.toLocaleDateString("es-AR", { weekday: "long" }) + " " + fecha;
      dias.push(diaTexto.charAt(0).toUpperCase() + diaTexto.slice(1));
    }
  }
  return dias;
}

function generarHorasPorDia(diaTexto) {
  const esSabado = diaTexto.toLowerCase().includes("sábado");
  const horas = [];
  const inicio = esSabado ? 8 : 6;
  const fin = esSabado ? 16 : 20;
  for (let h = inicio; h < fin; h++) {
    const horaStr = h.toString().padStart(2, '0') + ":00";
    horas.push(horaStr);
  }
  return horas;
}
