export async function carregarPapeisParaExcluir() {
  const resposta = await fetch("https://grafica-maxima.onrender.com/api/papeis");
  const dados = await resposta.json();

  const datalist = document.getElementById("listaPapeisExcluir");
  datalist.innerHTML = "";
  dados.Papel.forEach(p => {
    const option = document.createElement("option");
    option.value = p.nome;
    datalist.appendChild(option);
  });
}

export async function excluirPapel() {
  const nome = document.getElementById("papelExcluir").value;
  if (!nome) return alert("Selecione o papel que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir o papel "${nome}"?`);
  if (!confirmacao) return;

  const resposta = await fetch(`https://grafica-maxima.onrender.com/api/papeis/nome/${encodeURIComponent(nome)}`, {
    method: "DELETE"
  });

  const data = await resposta.json();
  alert(data.mensagem);
  carregarPapeisParaExcluir(); // atualiza lista
}
