export async function ConsultarMaquinas() {
  const resposta = await fetch("https://grafica-maxima.onrender.com/api/maquinas");
  const dados = await resposta.json();

  // Se o backend retornar { Maquina: [...] }, usa esse campo;
  // se retornar um array direto, usa ele mesmo.
  const maquinas = Array.isArray(dados) ? dados : dados.Maquina || [];

  const lista = maquinas.map(m => m.tipo).join("<br>");
  document.getElementById("resultado-maquinas").innerHTML = lista;
}

// Faz as informações sumirem após aparecerem
export async function desaparecerMaquinas() {
  document.getElementById("resultado-maquinas").textContent = '';
}


export async function carregarOpcoesMaquinas() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/maquinas");
    const dados = await resposta.json();

    const datalist = document.getElementById("listaMaquinas");
    datalist.innerHTML = ""; // limpa antes de inserir

    // verifica se veio o array certo
    if (!dados.Maquina || !Array.isArray(dados.Maquina)) {
      console.error("❌ Estrutura inesperada:", dados);
      return;
    }

    dados.Maquina.forEach(maquina => {
      const option = document.createElement("option");
      option.value = maquina.tipo; // mostra o tipo da máquina no input
      datalist.appendChild(option);
    });

    console.log("✅ Opções de máquinas carregadas:", dados.Maquina.length);

  } catch (erro) {
    console.error("❌ Erro ao carregar opções de máquinas:", erro);
  }
}
