// ---------------------------------------------
// CARREGAR DIMENSÕES PARA EXCLUIR
// ---------------------------------------------
export async function carregarDimensoesParaExcluir() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/dimensoes");
    const dados = await resposta.json();
    const dimensoes = Array.isArray(dados.Dimensao) ? dados.Dimensao : [];

    const datalist = document.getElementById("listaDimensoesExcluir");
    if (!datalist) return;
    datalist.innerHTML = "";

    dimensoes.forEach(d => {
      const option = document.createElement("option");
      option.value = d.id_dim;
      option.textContent = `ID: ${d.id_dim} - ${d.cmpr}x${d.larg}`;
      datalist.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar dimensões para excluir:", erro);
  }
}

// ---------------------------------------------
// EXCLUIR DIMENSÃO SELECIONADA
// ---------------------------------------------
export async function excluirDimensao() {
  const valor = document.getElementById("dimensaoExcluir").value.trim();
  if (!valor) return alert("Selecione a dimensão que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir a dimensão ID "${valor}"?`);
  if (!confirmacao) return;

  try {
    const del = await fetch(`https://grafica-maxima.onrender.com/api/dimensoes/${valor}`, {
      method: "DELETE"
    });

    if (!del.ok) {
      const texto = await del.text().catch(() => "");
      throw new Error(texto || "Erro ao deletar dimensão");
    }

    const data = await del.json().catch(() => ({}));
    alert(data.mensagem || "Dimensão excluída com sucesso");

    // Atualiza lista de datalist e tabela
    carregarDimensoesParaExcluir();
    if (typeof ConsultarDimensoes === "function") ConsultarDimensoes();
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir a dimensão.");
  }
}
