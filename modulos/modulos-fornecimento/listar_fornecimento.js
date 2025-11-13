// listar_fornecimento.js

// ==========================
// CONSULTAR fornecimentos
// ==========================
export async function ConsultarFornecimentos() {
  try {
    const resposta = await fetch("http://localhost:3000/api/fornecimentos");
    const dados = await resposta.json();

    const respostaFornecedores = await fetch("http://localhost:3000/api/fornecedores");
    const fornecedores = await respostaFornecedores.json();

    const respostaMateriais = await fetch("http://localhost:3000/api/materiais");
    const materiais = await respostaMateriais.json();

    const fornecimentos = Array.isArray(dados.Fornecimento) ? dados.Fornecimento : [];

    const lista = fornecimentos.map(f => {
      const nomeFornecedor = fornecedores.Fornecedor.find(x => x.id == f.id_fornecedor)?.nome || "N/A";
      const nomeMaterial = materiais.Material.find(x => x.id == f.id_material)?.nome || "N/A";

      return `ID: ${f.id} | Fornecedor: ${nomeFornecedor} | Material: ${nomeMaterial} | Comp: ${f.comprimento_base} | Larg: ${f.largura_base} | Unidades: ${f.unidades} | Custo Total: ${f.custo_total} | Custo Unitário: ${f.custo_unitario_estimado}`;
    }).join("<br>");

    document.getElementById("resultado-fornecimentos").innerHTML = lista;
  } catch (erro) {
    console.error("❌ Erro ao consultar fornecimentos:", erro);
  }
}

// ==========================
// FAZER INFORMAÇÕES SUMIREM
// ==========================
export function desaparecerFornecimentos() {
  const resultado = document.getElementById("resultado-fornecimentos");
  if (resultado) resultado.textContent = '';
}

// ==========================
// CARREGAR opções de datalists para edição
// ==========================
export async function carregarOpcoesFornecimentos() {
  try {
    const respostaFornecimentos = await fetch("http://localhost:3000/api/fornecimentos");
    const dadosFornecimentos = await respostaFornecimentos.json();

    const respostaFornecedores = await fetch("http://localhost:3000/api/fornecedores");
    const fornecedores = await respostaFornecedores.json();

    const respostaMateriais = await fetch("http://localhost:3000/api/materiais");
    const materiais = await respostaMateriais.json();

    const datalistEditar = document.getElementById("listaFornecimentos");
    const datalistExcluir = document.getElementById("listaFornecimentosExcluir");
    datalistEditar.innerHTML = "";
    datalistExcluir.innerHTML = "";

    if (!Array.isArray(dadosFornecimentos.Fornecimento)) return;

    dadosFornecimentos.Fornecimento.forEach(f => {
      const nomeFornecedor = fornecedores.Fornecedor.find(x => x.id == f.id_fornecedor)?.nome || "N/A";
      const nomeMaterial = materiais.Material.find(x => x.id == f.id_material)?.nome || "N/A";

      const textoLegivel = `${f.id} | ${nomeFornecedor} | ${nomeMaterial}`;

      const optionEditar = document.createElement("option");
      optionEditar.value = textoLegivel;
      datalistEditar.appendChild(optionEditar);

      const optionExcluir = document.createElement("option");
      optionExcluir.value = textoLegivel;
      datalistExcluir.appendChild(optionExcluir);
    });
  } catch (erro) {
    console.error("❌ Erro ao carregar opções de fornecimentos:", erro);
  }
}

// ==========================
// CARREGAR fornecedores e materiais para inserir novo fornecimento
// ==========================
export async function carregarOpcoesParaNovoFornecimento() {
  try {
    const respostaF = await fetch("http://localhost:3000/api/fornecedores");
    const fornecedores = await respostaF.json();
    const datalistF = document.getElementById("listaFornecedores");
    datalistF.innerHTML = "";
    fornecedores.Fornecedor.forEach(f => {
      const option = document.createElement("option");
      option.value = f.nome;
      datalistF.appendChild(option);
    });

    const respostaM = await fetch("http://localhost:3000/api/materiais");
    const materiais = await respostaM.json();
    const datalistM = document.getElementById("listaMateriais");
    datalistM.innerHTML = "";
    materiais.Material.forEach(m => {
      const option = document.createElement("option");
      option.value = m.nome;
      datalistM.appendChild(option);
    });
  } catch (erro) {
    console.error("❌ Erro ao carregar fornecedores/materiais:", erro);
  }
}
