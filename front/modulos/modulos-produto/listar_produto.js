// ---------------------------------------------
// LISTAR – Buscar todos os produtos
// ---------------------------------------------
export async function ConsultarProdutos() {
  try {
    const [resProdutos, resFam, resCat] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/produtos"),
      fetch("https://grafica-maxima.onrender.com/api/familias"),
      fetch("https://grafica-maxima.onrender.com/api/categorias")
    ]);

    if (!resProdutos.ok || !resFam.ok || !resCat.ok) throw new Error("Erro ao carregar dados");

    const produtos = await resProdutos.json();
    const familias = await resFam.json();
    const categorias = await resCat.json();

    // Garante que sejam arrays
    const lista = Array.isArray(produtos.Produto) ? produtos.Produto : [];
    const listaFamilias = Array.isArray(familias.Familia) ? familias.Familia : [];
    const listaCategorias = Array.isArray(categorias.Categoria) ? categorias.Categoria : [];

    const tabelaBody = document.querySelector("#resultado tbody");
    if (!tabelaBody) return;

    if (!lista.length) {
      tabelaBody.innerHTML = `<tr><td colspan="4">Nenhum produto encontrado</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = lista
      .map(p => {
        const fam = listaFamilias.find(f => f.id_fam === p.id_fam);
        const cat = listaCategorias.find(c => c.id_categ === p.id_categ);
        return `
          <tr>
            <td>${p.id_prod}</td>
            <td>${p.id_fam} - ${fam ? fam.nome : "Desconhecida"}</td>
            <td>${p.id_categ} - ${cat ? cat.nome : "Desconhecida"}</td>
            <td>${p.custo_m2}</td>
          </tr>
        `;
      })
      .join("");

  } catch (erro) {
    console.error("Erro ao listar produtos:", erro);
    const tabelaBody = document.querySelector("#resultado tbody");
    if (tabelaBody)
      tabelaBody.innerHTML = `<tr><td colspan="4">Erro ao carregar produtos</td></tr>`;
  }
}


// ---------------------------------------------
// LIMPAR TABELA
// ---------------------------------------------
export function desaparecerProdutos() {
  const tabelaBody = document.querySelector("#resultado tbody");
  if (tabelaBody) tabelaBody.textContent = "";
}

// ---------------------------------------------
// CARREGAR LISTAS (datalist) → id_prod
// ---------------------------------------------
export async function carregarOpcoesProdutos() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/produtos");
    const dados = await resposta.json();
    const lista = Array.isArray(dados.Produto) ? dados.Produto : [];

    const dl = document.getElementById("listaProdutos");
    const dlExcluir = document.getElementById("listaProdutosExcluir");

    if (dl) dl.innerHTML = "";
    if (dlExcluir) dlExcluir.innerHTML = "";

    lista.forEach(p => {
      const op = document.createElement("option");
      op.value = p.id_prod;

      dl?.appendChild(op.cloneNode());
      dlExcluir?.appendChild(op.cloneNode());
    });
  } catch (erro) {
    console.error("Erro ao carregar datalist de produtos:", erro);
  }
}

// ---------------------------------------------
// CARREGAR FAMÍLIAS E CATEGORIAS
// ---------------------------------------------
export async function carregarTabelasExternasProduto() {
  try {
    // ---- Requisições paralelas ----
    const [resFam, resCat] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/familias"),
      fetch("https://grafica-maxima.onrender.com/api/categorias"),
    ]);

    if (!resFam.ok) throw new Error("Falha ao carregar famílias");
    if (!resCat.ok) throw new Error("Falha ao carregar categorias");

    const familias = await resFam.json();
    const categorias = await resCat.json();

    const listaF = document.getElementById("listaFamilias");
    const listaC = document.getElementById("listaCategorias");

    listaF.innerHTML = "";
    listaC.innerHTML = "";

    const listaFamilias = familias.Familia ?? [];
    const listaCategorias = categorias.Categoria ?? [];

    if (listaFamilias.length === 0) {
      const op = document.createElement("option");
      op.textContent = "Nenhuma família cadastrada";
      listaF.appendChild(op);
    } else {
      listaFamilias.forEach(f => {
        const op = document.createElement("option");
        op.value = f.id_fam;
        op.textContent = f.nome;
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
        op.textContent = c.nome;
        listaC.appendChild(op);
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar famílias e categorias:", erro);

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
