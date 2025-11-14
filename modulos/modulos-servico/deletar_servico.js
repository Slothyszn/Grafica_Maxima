export async function carregarServicosParaExcluir() {
  const resposta = await fetch("http://localhost:3000/api/servicos");
  const dados = await resposta.json();

  const datalist = document.getElementById("listaServicosExcluir");
  datalist.innerHTML = "";
  dados.Servico.forEach(p => {
    const option = document.createElement("option");
    option.value = p.nome;
    datalist.appendChild(option);
  });
}

export async function excluirServico() {
  const nome = document.getElementById("servicoExcluir").value;
  if (!nome) return alert("Selecione o servico que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir o servico "${nome}"?`);
  if (!confirmacao) return;

  const resposta = await fetch(`http://localhost:3000/api/servicos/nome/${encodeURIComponent(nome)}`, {
    method: "DELETE"
  });

  const data = await resposta.json();
  alert(data.mensagem);
  carregarServicosParaExcluir(); // atualiza lista
}
