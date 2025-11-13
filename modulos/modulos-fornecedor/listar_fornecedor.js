export async function ConsultarFornecedores() {
  const resposta = await fetch("http://localhost:3000/api/fornecedores");
  const dados = await resposta.json();

  const fornecedores = Array.isArray(dados) ? dados : dados.Fornecedor || [];

  const lista = fornecedores.map(m => m.nome).join("<br>");
  document.getElementById("resultado-fornecedores").innerHTML = lista;
}

// Faz as informações sumirem após aparecerem
export async function desaparecerFornecedores() {
  document.getElementById("resultado-fornecedores").textContent = '';
}


export async function carregarOpcoesFornecedores() {
  try {
    const resposta = await fetch("http://localhost:3000/api/fornecedores");
    const dados = await resposta.json();

    const datalist = document.getElementById("listaFornecedores");
    datalist.innerHTML = ""; // limpa antes de inserir

    // verifica se veio o array certo
    if (!dados.Fornecedor || !Array.isArray(dados.Fornecedor)) {
      console.error("❌ Estrutura inesperada:", dados);
      return;
    }

    dados.Fornecedor.forEach(fornecedor => {
      const option = document.createElement("option");
      option.value = fornecedor.nome;
      datalist.appendChild(option);
    });

    console.log("✅ Opções de fornecedores carregadas:", dados.Fornecedor.length);

  } catch (erro) {
    console.error("❌ Erro ao carregar opções de fornecedores:", erro);
  }
}
