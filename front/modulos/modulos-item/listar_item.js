// ===============================
// LISTAR ITENS
// ===============================
export async function ConsultarItens() {
  try {
    const res = await fetch('https://grafica-maxima.onrender.com/api/itens');
    if (!res.ok) {
      console.warn('ConsultarItens: resposta não OK', res.status);
      const tbodyErr = document.querySelector('#resultado-item tbody');
      if (tbodyErr) tbodyErr.innerHTML = '<tr><td colspan="6">Erro ao carregar itens</td></tr>';
      return;
    }

    const dados = await res.json();
    const lista = Array.isArray(dados && dados.Item) ? dados.Item : [];

    const tbody = document.querySelector('#resultado-item tbody');
    if (!tbody) return;

    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="6">Nenhum item encontrado</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map(i => `
      <tr>
        <td>${i.id_item}</td>
        <td>${i.id_orcRaw}</td>
        <td>${i.tipo}</td>
        <td>${i.id_ref}</td>
        <td>${i.quant}</td>
        <td>${i.custo_parcial}</td>
      </tr>
    `).join('');

    // expõe globalmente
    window.ConsultarItens = ConsultarItens;

  } catch (erro) {
    console.error('Erro ao consultar itens:', erro);
    const tbody = document.querySelector('#resultado-item tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="6">Erro ao carregar itens</td></tr>`;
  }
}

// ===============================
// LIMPAR TABELA
// ===============================
export function desaparecerItens() {
  const tbody = document.querySelector('#resultado-item tbody');
  if (tbody) tbody.innerHTML = '';
}

// ===============================
// CARREGAR DATALISTS (editar/excluir)
// ===============================
export async function carregarOpcoesItens() {
  try {
    const res = await fetch('https://grafica-maxima.onrender.com/api/itens');
    if (!res.ok) return;

    const dados = await res.json();
    const lista = Array.isArray(dados && dados.Item) ? dados.Item : [];

    const dlEditar = document.getElementById('listaItens');
    const dlExcluir = document.getElementById('listaItensExcluir');

    if (dlEditar) {
      dlEditar.innerHTML = '';
      lista.forEach(i => {
        const option = document.createElement('option');
        option.value = i.id_item; // só envia o ID para edição
        option.textContent = `ID:${i.id_item} | Tipo:${i.tipo} | Ref:${i.id_ref} | Quant:${i.quant}`;
        dlEditar.appendChild(option);
      });
    }

    if (dlExcluir) {
      dlExcluir.innerHTML = '';
      lista.forEach(i => {
        const option = document.createElement('option');
        option.value = i.id_item; // só envia o ID para exclusão
        option.textContent = `ID:${i.id_item} | Tipo:${i.tipo} | Ref:${i.id_ref}`;
        dlExcluir.appendChild(option);
      });
    }

  } catch (erro) {
    console.error('Erro ao carregar opções de itens:', erro);
  }
}

// Carrega IDs externos dependendo do tipo selecionado
export async function carregarTabelasExternasItens() {
  try {
    const [resOrc, resImp, resProd, resServ, resItens] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/orcamentos"),
      fetch("https://grafica-maxima.onrender.com/api/impressao"),
      fetch("https://grafica-maxima.onrender.com/api/produtos"),
      fetch("https://grafica-maxima.onrender.com/api/servicos"),
      fetch("https://grafica-maxima.onrender.com/api/itens")
    ]);

    const resFamilia = await fetch("https://grafica-maxima.onrender.com/api/familias")
    const dataFam = await resFamilia.json();
    const famArray = Array.isArray(dataFam) ? dataFam : dataFam.Familia || [];

    const dataOrc = await resOrc.json();
    const dataImp = await resImp.json();
    const dataProd = await resProd.json();
    const dataServ = await resServ.json();
    const dataItens = await resItens.json();

    const orcArr = Array.isArray(dataOrc) ? dataOrc : dataOrc.Orcamento || [];
    const impArr = Array.isArray(dataImp) ? dataImp : dataImp.Impressao || [];
    const prodArr = Array.isArray(dataProd) ? dataProd : dataProd.Produto || [];
    const servArr = Array.isArray(dataServ) ? dataServ : dataServ.Servico || [];
    const itensArr = Array.isArray(dataItens) ? dataItens : dataItens.Item || [];

    const id_orc = document.getElementById("id_orc");
    const id_ref = document.getElementById("id_ref");

    const listaOrc = document.getElementById("listaOrc");

    if (listaOrc) listaOrc.innerHTML = "";

    // Preencher datalist para edição e exclusão (todos os itens)
    orcArr.forEach(orc => {
      const option = document.createElement("option");
      option.value = `${orc.id_orc} | ${orc.nome_cli} | ${orc.dt_criacao}`;
      listaOrc.appendChild(option.cloneNode(true));
    });

    // Atualizar IDs conforme o tipo selecionado
    const selectTipo = document.getElementById("tipo");
    const datalistIds = document.getElementById("listaIds");

    if (selectTipo) {
      selectTipo.addEventListener("change", () => {
        datalistIds.innerHTML = "";

        console.log(selectTipo.value);
        let lista = [];
        if (selectTipo.value === "impressao") lista = impArr;
        if (selectTipo.value === "produto") lista = prodArr;
        if (selectTipo.value === "servico") lista = servArr;


        lista.forEach(obj => {
          const id = obj.id_imp || obj.id_prod || obj.id_serv || obj.id; // flexível
          const nome = obj.nome || obj.cod || obj.descricao || "";

          const option = document.createElement("option");
          option.value = id;

          // Label específico para serviço
          if (selectTipo.value === "servico") {
            
            const custo = obj.custo_fixo != null ? obj.custo_fixo : "";
            option.label = `${id} - ${nome} - R$ ${custo}`;

          } else if (selectTipo.value === "produto"){
              const dimensao4 = document.getElementById("dimensao-editar");
              if (dimensao4) dimensao4.style.display = "block";

              const dimensao = document.getElementById("impressao-editar");
              if (dimensao) dimensao.style.display = "none";
              const dimensao2 = document.getElementById("impressao-dimensao");
              if (dimensao2) dimensao2.style.display = "none";

              const familia = famArray.find(f => f.id_fam === obj.id_fam);
              const nomeFamilia = familia ? familia.nome : "Família não encontrada";
              const preco = obj.custo_m2 != null ? obj.custo_m2 : "";

              //const option = document.createElement("option");
              option.value = `${obj.id_prod} - ${nomeFamilia} - R$ ${preco}`; // o que aparece
              datalistIds.appendChild(option);

          } else if (selectTipo.value === "impressao") {
              const dimensao4 = document.getElementById("dimensao-editar");
              if (dimensao4) dimensao4.style.display = "none";
              const dimensao = document.getElementById("impressao-editar");
              if (dimensao) dimensao.style.display = "block";
              const dimensao2 = document.getElementById("impressao-dimensao");
              if (dimensao2) dimensao2.style.display = "block";
              const dimensao5 = document.getElementById("info-impressao");
              if (dimensao5) dimensao5.style.display = "block";
          } else {
              option.label = nome ? `${id} - ${nome}` : String(id);
          }

          datalistIds.appendChild(option);
        });
      });
    }

  } catch (erro) {
    console.error("Erro ao carregar dados externos de Itens:", erro);
  }
}
