// ---------------------------------------------
// LISTAR – Buscar todas as mãos de obra
// ---------------------------------------------
export async function ConsultarMaoObra() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/maoObras");
    const dados = await resposta.json();

    const lista = Array.isArray(dados.MaoObra) ? dados.MaoObra : dados;

    const tabelaBody = document.querySelector("#resultado tbody");
    if (!tabelaBody) return;

    if (!lista.length) {
      tabelaBody.innerHTML = `<tr><td colspan="2">Nenhuma mão de obra encontrada</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = lista
      .map(m => `
        <tr>
          <td>${m.id_serv}</td>
          <td>${m.id_item}</td>
        </tr>
      `)
      .join("");
  } catch (erro) {
    console.error("Erro ao listar mãos de obra:", erro);
    const tabelaBody = document.querySelector("#resultado tbody");
    if (tabelaBody)
      tabelaBody.innerHTML = `<tr><td colspan="2">Erro ao carregar mãos de obra</td></tr>`;
  }
}

// ---------------------------------------------
// LIMPAR TABELA
// ---------------------------------------------
export function desaparecerMaoObra() {
  const tabelaBody = document.querySelector("#resultado tbody");
  if (tabelaBody) tabelaBody.textContent = "";
}

// ---------------------------------------------
// CARREGAR LISTAS (datalist) → id_serv | id_item
// ---------------------------------------------
export async function carregarOpcoesMaoObra() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/maoObras");
    const dados = await resposta.json();
    const lista = Array.isArray(dados.MaoObra) ? dados.MaoObra : [];

    const dl = document.getElementById("listaMaoObra");
    const dlExcluir = document.getElementById("listaMaoObraExcluir");

    if (dl) dl.innerHTML = "";
    if (dlExcluir) dlExcluir.innerHTML = "";

    lista.forEach(m => {
      const op = document.createElement("option");
      op.value = `${m.id_serv} | ${m.id_item}`;

      dl?.appendChild(op.cloneNode());
      dlExcluir?.appendChild(op.cloneNode());
    });
  } catch (erro) {
    console.error("Erro ao carregar datalist de mãos de obra:", erro);
  }
}


export async function carregarTabelasExternasMaoObra() {
  try {
    // ---- Requisições paralelas ----
    const [resServ, resItens] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/servicos"),
      fetch("https://grafica-maxima.onrender.com/api/itens")
    ]);

    if (!resServ.ok) throw new Error("Falha ao carregar serviços");
    if (!resItens.ok) throw new Error("Falha ao carregar itens");

    const servicos = await resServ.json();
    const itens = await resItens.json();

    const listaS = document.getElementById("listaServicos");
    const listaI = document.getElementById("listaItens");

    listaS.innerHTML = "";
    listaI.innerHTML = "";

    const listaServicos = servicos.Servico ?? [];
    const listaItens = itens.Item ?? [];

    // ---- Serviços ----
    if (listaServicos.length === 0) {
      const op = document.createElement("option");
      op.textContent = "Nenhum serviço cadastrado";
      listaS.appendChild(op);
    } else {
      listaServicos.forEach(s => {
        const op = document.createElement("option");
        op.value = s.id_serv;
        op.textContent = s.nome || `Serviço ${s.id_serv}`;
        listaS.appendChild(op);
      });
    }

    // ---- Itens ----
    if (listaItens.length === 0) {
      const op = document.createElement("option");
      op.textContent = "Nenhum item cadastrado";
      listaI.appendChild(op);
    } else {
      listaItens.forEach(i => {
        const op = document.createElement("option");
        op.value = i.id_item;
        op.textContent = i.nome || `Item ${i.id_item}`;
        listaI.appendChild(op);
      });
    }

  } catch (erro) {
    console.error("Erro ao carregar serviços e itens:", erro);

    const listaS = document.getElementById("listaServicos");
    const listaI = document.getElementById("listaItens");

    listaS.innerHTML = "";
    listaI.innerHTML = "";

    const op = document.createElement("option");
    op.textContent = "Erro ao carregar dados";
    listaS.appendChild(op.cloneNode(true));
    listaI.appendChild(op);
  }
}