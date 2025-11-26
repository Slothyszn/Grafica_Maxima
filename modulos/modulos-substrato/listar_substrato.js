// ---------------------------------------------
// LISTAR – Buscar todos os substratos
// ---------------------------------------------
export async function ConsultarSubstratos() {
  try {
    const resposta = await fetch("http://localhost:3000/api/substratos");
    const dados = await resposta.json();

    const lista = Array.isArray(dados.Substrato) ? dados.Substrato : dados;

    const tabelaBody = document.querySelector("#resultado tbody");
    if (!tabelaBody) return;

    if (!lista.length) {
      tabelaBody.innerHTML = `<tr><td colspan="5">Nenhum substrato encontrado</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = lista
      .map(s => `
        <tr>
          <td>${s.id_sub}</td>
          <td>${s.id_fam}</td>
          <td>${s.id_categ}</td>
          <td>${s.med_sub}</td>
          <td>${s.valor}</td>
        </tr>
      `)
      .join("");
  } catch (erro) {
    console.error("Erro ao listar substratos:", erro);
    const tabelaBody = document.querySelector("#resultado tbody");
    if (tabelaBody)
      tabelaBody.innerHTML = `<tr><td colspan="5">Erro ao carregar substratos</td></tr>`;
  }
}

// ---------------------------------------------
// LIMPAR TABELA
// ---------------------------------------------
export function desaparecerSubstratos() {
  const tabelaBody = document.querySelector("#resultado tbody");
  if (tabelaBody) tabelaBody.textContent = "";
}

// ---------------------------------------------
// CARREGAR LISTAS (datalist) → id_sub
// ---------------------------------------------
export async function carregarOpcoesSubstratos() {
  try {
    const resposta = await fetch("http://localhost:3000/api/substratos");
    const dados = await resposta.json();
    const lista = Array.isArray(dados.Substrato) ? dados.Substrato : [];

    const dl = document.getElementById("listaSubstratos");
    const dlExcluir = document.getElementById("listaSubstratosExcluir");

    if (dl) dl.innerHTML = "";
    if (dlExcluir) dlExcluir.innerHTML = "";

    lista.forEach(s => {
      const op = document.createElement("option");
      op.value = s.id_sub;

      dl?.appendChild(op.cloneNode());
      dlExcluir?.appendChild(op.cloneNode());
    });
  } catch (erro) {
    console.error("Erro ao carregar datalist de substratos:", erro);
  }
}

// ---------------------------------------------
// CARREGAR FAMÍLIAS E CATEGORIAS
// ---------------------------------------------
export async function carregarTabelasExternasSubstrato() {
  try {
    // ---- Requisições paralelas ----
    const [resFam, resCat] = await Promise.all([
      fetch("http://localhost:3000/api/familias"),
      fetch("http://localhost:3000/api/categorias"),
    ]);

    // ---- Checagem de erros HTTP ----
    if (!resFam.ok) throw new Error("Falha ao carregar famílias");
    if (!resCat.ok) throw new Error("Falha ao carregar categorias");

    const familias = await resFam.json();
    const categorias = await resCat.json();

    const listaF = document.getElementById("listaFamilias");
    const listaC = document.getElementById("listaCategorias");

    listaF.innerHTML = "";
    listaC.innerHTML = "";

    // ---- Normalização segura ----
    const listaFamilias = familias.Familia ?? [];
    const listaCategorias = categorias.Categoria ?? [];

    // ---- Se vazio, deixa amigável ----
    if (listaFamilias.length === 0) {
      const op = document.createElement("option");
      op.textContent = "Nenhuma família cadastrada";
      listaF.appendChild(op);
    } else {
      listaFamilias.forEach(f => {
        const op = document.createElement("option");
        op.value = f.id_fam;
        op.textContent = f.nome; // fica mais visual
        listaF.appendChild(op);
      });
    }

    if (listaCategorias.length === 0) {
      const op = document.createElement("option");
      op.textContent = "Nenhuma categoria cadastrada";
      listaC.appendChild(op);
    } else {
      listaCategorias.forEach(c => {
        const op = document.createElement("option");
        op.value = c.id_categ;
        op.textContent = c.nome; // idem
        listaC.appendChild(op);
      });
    }

  } catch (erro) {
    console.error("Erro ao carregar famílias e categorias:", erro);

    // ---- Feedback visual amigável ----
    const listaF = document.getElementById("listaFamilias");
    const listaC = document.getElementById("listaCategorias");

    listaF.innerHTML = "";
    listaC.innerHTML = "";

    const op = document.createElement("option");
    op.textContent = "Erro ao carregar dados";
    listaF.appendChild(op.cloneNode(true));
    listaC.appendChild(op);
  }
}
