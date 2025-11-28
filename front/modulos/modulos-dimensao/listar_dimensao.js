// ---------------------------------------------
// LISTAR – Buscar todas as dimensões
// ---------------------------------------------
export async function ConsultarDimensoes() {
  try {
    const resposta = await fetch("http://localhost:3000/api/dimensoes");
    const dados = await resposta.json();

    // pega o array correto ou cria vazio
    const lista = Array.isArray(dados.Dimensao) ? dados.Dimensao : [];

    const tabelaBody = document.querySelector("#tabelaDimensao tbody");
    if (!tabelaBody) return;

    if (!lista.length) {
      tabelaBody.innerHTML = `<tr><td colspan="7">Nenhuma dimensão encontrada</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = lista
      .map(d => `
        <tr>
          <td>${d.id_dim}</td>
          <td>${d.cmpr}</td>
          <td>${d.larg}</td>
          <td>${d.mrg_interna}</td>
          <td>${d.mrg_sangria}</td>
          <td>${d.mrg_branca}</td>
          <td>${d.mrg_espaco}</td>
        </tr>
      `)
      .join("");
  } catch (erro) {
    console.error("Erro ao listar dimensões:", erro);
    const tabelaBody = document.querySelector("#tabelaDimensao tbody");
    if (tabelaBody)
      tabelaBody.innerHTML = `<tr><td colspan="7">Erro ao carregar dimensões</td></tr>`;
  }
}
// ---------------------------------------------
// LIMPAR TABELA
// ---------------------------------------------
export function desaparecerDimensoes() {
  const tabelaBody = document.querySelector("#tabelaDimensao tbody");
  if (tabelaBody) tabelaBody.textContent = "";
}

// ---------------------------------------------
// CARREGAR LISTAS (datalist) → id_dim
// ---------------------------------------------
export async function carregarOpcoesDimensoes() {
  try {
    const resposta = await fetch("http://localhost:3000/api/dimensoes");
    const dados = await resposta.json();
    const lista = Array.isArray(dados.Dimensao) ? dados.Dimensao : [];

    const dl = document.getElementById("listaDimensoes");
    const dlExcluir = document.getElementById("listaDimensoesExcluir");

    if (dl) dl.innerHTML = "";
    if (dlExcluir) dlExcluir.innerHTML = "";

    lista.forEach(d => {
      const op = document.createElement("option");
      op.value = d.id_dim;

      dl?.appendChild(op.cloneNode());
      dlExcluir?.appendChild(op.cloneNode());
    });
  } catch (erro) {
    console.error("Erro ao carregar datalist de dimensões:", erro);
  }
}
