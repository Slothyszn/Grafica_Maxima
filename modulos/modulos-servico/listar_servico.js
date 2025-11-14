export async function ConsultarServicos() {
  const servicos = await fetch("http://localhost:3000/api/servicos");
  const dados = await servicos.json();
  const lista = dados.Servico.map(p => p.nome).join("<br> ");
  document.getElementById("resultado-servicos").innerHTML = lista;
  //JSON.stringify(dados, null, 2);
}

// Faz as informações dos servicos sumirem após aparecerem
export async function desaparecerServicos() {
  document.getElementById("resultado-servicos").textContent = '';
}

export async function carregarOpcoesServicos() {
  try {
    const resposta = await fetch("http://localhost:3000/api/servicos");
    const dados = await resposta.json();

    const datalist = document.getElementById("listaServicos");
    datalist.innerHTML = ""; // limpa antes de inserir

    dados.Servico.forEach(servico => {
      const option = document.createElement("option");
      option.value = servico.nome; // nome exibido
      datalist.appendChild(option);
    });

  } catch (erro) {
    console.error("❌ Erro ao carregar opções de serviços:", erro);
  }
}

