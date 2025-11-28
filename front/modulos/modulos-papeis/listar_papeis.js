export async function ConsultarPapeis() {
  const papeis = await fetch("https://grafica-maxima.onrender.com/api/papeis");
  const dados = await papeis.json();
  const lista = dados.Papel.map(p => p.nome).join("<br> ");
  document.getElementById("resultado").innerHTML = lista;
  //JSON.stringify(dados, null, 2);
}

// Faz as informações dos papeis sumirem após aparecerem
export async function desaparecerPapeis() {
  document.getElementById("resultado").textContent = '';
}

export async function carregarOpcoesPapeis() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/papeis");
    const dados = await resposta.json();

    const datalist = document.getElementById("listaPapeis");
    datalist.innerHTML = ""; // limpa antes de inserir

    dados.Papel.forEach(papel => {
      const option = document.createElement("option");
      option.value = papel.nome; // nome exibido
      datalist.appendChild(option);
    });

  } catch (erro) {
    console.error("❌ Erro ao carregar opções de papéis:", erro);
  }
}

