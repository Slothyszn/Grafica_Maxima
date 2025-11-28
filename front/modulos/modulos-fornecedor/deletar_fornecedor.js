export async function carregarFornecedoresParaExcluir() {
  const resposta = await fetch("https://grafica-maxima.onrender.com/api/fornecedores");
  const dados = await resposta.json();

  const datalist = document.getElementById("listaFornecedoresExcluir");
  datalist.innerHTML = "";
  dados.Fornecedor.forEach(p => {
    const option = document.createElement("option");
    option.value = p.nome;
    datalist.appendChild(option);
  });
}

export async function excluirFornecedor() {
  const nome = document.getElementById("fornecedorExcluir").value.trim(); // remove espaços
  if (!nome) return alert("Selecione o fornecedor que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir o fornecedor "${nome}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch(`https://grafica-maxima.onrender.com/api/fornecedores/nome/${encodeURIComponent(nome)}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      const texto = await resposta.text(); // pega mensagem de erro
      throw new Error(texto);
    }

    const data = await resposta.json();
    alert(data.mensagem);
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir o fornecedor.");
  }
}

