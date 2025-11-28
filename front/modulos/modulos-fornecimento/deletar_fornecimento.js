// ==========================
// CARREGAR FORNECIMENTOS PARA EXCLUIR
// ==========================
export async function carregarFornecimentosParaExcluir() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/fornecimentos");
    const dados = await resposta.json();

    const fornecimentos = Array.isArray(dados.Fornecimento) ? dados.Fornecimento : [];

    const datalist = document.getElementById("listaFornecimentosExcluir");
    if (!datalist) return;
    datalist.innerHTML = "";

    fornecimentos.forEach(f => {
      const option = document.createElement("option");
      // Opção legível: "ID | Fornecedor | Substrato"
      const fornecedorNome = f.id_forn || f.nome || "N/A";
      const substratoNome = f.id_sub || f.substrato || "N/A";
      option.value = `${f.id_fornec} | ${fornecedorNome} | ${substratoNome}`;
      datalist.appendChild(option);
    });

  } catch (erro) {
    console.error("Erro ao carregar fornecimentos para excluir:", erro);
  }
}

// ==========================
// EXCLUIR FORNECIMENTO
// ==========================
export async function excluirFornecimento() {
  const input = document.getElementById("fornecimentoExcluir");
  if (!input) return;
  const valor = input.value.trim();
  if (!valor) return alert("Escolha o fornecimento que deseja excluir.");

  // Pega só o ID antes do primeiro " | "
  const id = valor.split(" | ")[0].trim();

  if (!confirm(`Tem certeza que deseja excluir o fornecimento ${id}?`)) return;

  try {
    const resposta = await fetch(`https://grafica-maxima.onrender.com/api/fornecimentos/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      const textoErro = await resposta.text();
      throw new Error(textoErro || "Falha ao excluir fornecimento.");
    }

    const data = await resposta.json();
    alert(data.mensagem || "Fornecimento excluído com sucesso!");

  } catch (erro) {
    console.error("Erro ao excluir fornecimento:", erro);
    alert("Ocorreu um erro ao tentar excluir o fornecimento.");
  }
}
