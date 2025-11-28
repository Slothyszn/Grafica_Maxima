export async function excluirProduto() {
  const id = document.getElementById("produtoExcluir").value;

  if (!id) {
    alert("Informe o ID!");
    return;
  }

  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  try {
    const resposta = await fetch(`http://localhost:3000/api/produtos/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.mensagem || "Erro ao excluir produto");
    }

    alert("Produto removido com sucesso!");

    // Opcional: atualizar lista de produtos
    if (typeof ConsultarProdutos === "function") {
      ConsultarProdutos();
    }

  } catch (erro) {
    console.error("Erro ao remover produto:", erro);
    alert("Erro ao deletar produto.");
  }
}
