export async function InserirFornecedor(event) {
  event.preventDefault();

  const novoFornecedor = {
    nome: document.getElementById("nome").value,
    contato: document.getElementById("contato").value
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/fornecedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFornecedor)
    });

    if (!resposta.ok) throw new Error("Erro ao inserir Fornecedor");

    const data = await resposta.json();
    alert(data.mensagem); // mostra mensagem de sucesso
  } catch (erro) {
    console.error("Erro ao inserir fornecedor:", erro);
    alert("Não foi possível inserir o fornecedor.");
  }
}
