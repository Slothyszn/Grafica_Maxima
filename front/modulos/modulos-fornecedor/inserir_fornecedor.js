export async function InserirFornecedor(event) {
  event.preventDefault();

  // Pegando valores do formulário
  const nome = document.getElementById("nome").value.trim();
  const contato = document.getElementById("contato").value.trim();

  if (!nome || !contato) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }


  const novoFornecedor = { nome, contato };

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/fornecedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFornecedor)
    });

    if (!resposta.ok) {
      const erroData = await resposta.json();
      throw new Error(erroData.erro || "Erro ao inserir fornecedor");
    }

    const data = await resposta.json();
    alert(`Fornecedor inserido com sucesso!\nNome: ${data.nome}\nContato: ${data.contato}`);

    // Opcional: limpar formulário
    document.getElementById("nome").value = "";
    document.getElementById("contato").value = "";

  } catch (erro) {
    console.error("Erro ao inserir fornecedor:", erro);
    alert(`Não foi possível inserir o fornecedor: ${erro.message}`);
  }
}
