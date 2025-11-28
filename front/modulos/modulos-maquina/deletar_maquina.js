export async function carregarMaquinasParaExcluir() {
  const resposta = await fetch("https://grafica-maxima.onrender.com/api/maquinas");
  const dados = await resposta.json();

  const datalist = document.getElementById("listaMaquinasExcluir");
  datalist.innerHTML = "";
  dados.Maquina.forEach(p => {
    const option = document.createElement("option");
    option.value = p.tipo;
    datalist.appendChild(option);
  });
}

export async function excluirMaquina() {
  const tipo = document.getElementById("maquinaExcluir").value.trim(); // remove espaços
  if (!tipo) return alert("Selecione a máquina que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir a máquina "${tipo}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch(`https://grafica-maxima.onrender.com/api/maquinas/tipo/${encodeURIComponent(tipo)}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      const texto = await resposta.text(); // pega mensagem de erro
      throw new Error(texto);
    }

    const data = await resposta.json();
    alert(data.mensagem);
    carregarMaquinasParaExcluir(); // atualiza lista
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir a máquina.");
  }
}

