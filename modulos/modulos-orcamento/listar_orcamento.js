// ---------------------------------------------
// LISTAR – Buscar todos os orçamentos
// ---------------------------------------------
export async function ConsultarOrcamentos() {
  try {
    const resposta = await fetch("http://localhost:3000/api/orcamentos");
    const dados = await resposta.json();

    // pega o array correto ou cria vazio
    const lista = Array.isArray(dados.Orcamento) ? dados.Orcamento : [];

    const tabelaBody = document.querySelector("#tabela-orcamento tbody");
    if (!tabelaBody) return;

    if (!lista.length) {
      tabelaBody.innerHTML = `<tr><td colspan="7">Nenhum orçamento encontrado</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = lista
      .map(o => `
        <tr>
          <td>${o.id_orc}</td>
          <td>${o.nome_cli}</td>
          <td>${o.perc_lucro}</td>
          <td>${o.adicional}</td>
          <td>${o.total}</td>
          <td>${o.dt_criacao}</td>
          <td>${o.dt_limite}</td>
        </tr>
      `)
      .join("");
  } catch (erro) {
    console.error("Erro ao listar orçamentos:", erro);
    const tabelaBody = document.querySelector("#tabela-orcamento tbody");
    if (tabelaBody)
      tabelaBody.innerHTML = `<tr><td colspan="7">Erro ao carregar orçamentos</td></tr>`;
  }
}

// ---------------------------------------------
// LIMPAR TABELA
// ---------------------------------------------
export function desaparecerOrcamentos() {
  const tabelaBody = document.querySelector("#tabela-orcamento tbody");
  if (tabelaBody) tabelaBody.textContent = "";
}

// ---------------------------------------------
// CARREGAR LISTAS (datalist) → id_orc
// ---------------------------------------------
export async function carregarOpcoesOrcamentos() {
  try {
    const resposta = await fetch("http://localhost:3000/api/orcamentos");
    const dados = await resposta.json();
    const lista = Array.isArray(dados.Orcamento) ? dados.Orcamento : [];

    const dlEditar = document.getElementById("listaOrcamentosEditar");
    const dlExcluir = document.getElementById("listaOrcamentosExcluir");

    if (dlEditar) dlEditar.innerHTML = "";
    if (dlExcluir) dlExcluir.innerHTML = "";

    lista.forEach(o => {
      const op = document.createElement("option");
      op.value = `${o.id_orc} | ${o.nome_cli}`;

      dlEditar?.appendChild(op.cloneNode());
      dlExcluir?.appendChild(op.cloneNode());
    });
  } catch (erro) {
    console.error("Erro ao carregar datalist de orçamentos:", erro);
  }
}
