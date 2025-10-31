export async function ConsultarPapeis() {
  const papeis = await fetch("http://localhost:3000/api/papeis");
  const dados = await papeis.json();
  document.getElementById("resultado").textContent = JSON.stringify(dados, null, 2);
}


export async function desaparecer() {
  document.getElementById("resultado").textContent = '';
}