export async function ConsultarMateriais() {
  const resposta = await fetch("http://localhost:3000/api/materiais");
  const dados = await resposta.json();

  const materiais = Array.isArray(dados) ? dados : dados.Material || [];

  const lista = materiais.map(m => m.nome).join("<br>");
  document.getElementById("resultado-materiais").innerHTML = lista;
}

// Faz as informações sumirem após aparecerem
export async function desaparecerMateriais() {
  document.getElementById("resultado-materiais").textContent = '';
}


export async function carregarOpcoesMateriais() {
  try {
    const resposta = await fetch("http://localhost:3000/api/materiais");
    const dados = await resposta.json();

    const datalist = document.getElementById("listaMateriais");
    datalist.innerHTML = ""; // limpa antes de inserir

    // verifica se veio o array certo
    if (!dados.Material || !Array.isArray(dados.Material)) {
      console.error("❌ Estrutura inesperada:", dados);
      return;
    }

    dados.Material.forEach(material => {
      const option = document.createElement("option");
      option.value = material.nome;
      datalist.appendChild(option);
    });

    console.log("✅ Opções de materiais carregadas:", dados.Material.length);

  } catch (erro) {
    console.error("❌ Erro ao carregar opções de materiais:", erro);
  }
}
