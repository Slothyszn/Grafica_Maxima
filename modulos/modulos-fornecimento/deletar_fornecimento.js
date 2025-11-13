export async function carregarFornecimentosParaExcluir() {
  try {
    const resposta = await fetch("http://localhost:3000/api/fornecimentos");
    const dados = await resposta.json();

    const datalist = document.getElementById("listaFornecimentosExcluir");
    datalist.innerHTML = "";

    dados.Fornecimento.forEach(f => {
      const option = document.createElement("option");
      option.value = f.id;
      datalist.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar fornecimentos para excluir:", erro);
  }
}

export async function excluirFornecimento() {
  let valor = document.getElementById("fornecimentoExcluir").value;
  if (!valor) return alert("Escolha o fornecimento que deseja excluir.");

  // Pega só o ID antes do primeiro " | "
  const id = valor.split(" | ")[0].trim();

  if (!confirm(`Tem certeza que deseja excluir o fornecimento ${id}?`)) return;

  try {
    const resposta = await fetch(`http://localhost:3000/api/fornecimentos/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) throw new Error(await resposta.text());
    const data = await resposta.json();
    alert(data.mensagem);
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir o fornecimento.");
  }
}