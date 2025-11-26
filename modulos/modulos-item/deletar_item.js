export async function excluirItem() {
  const id = document.getElementById("itemExcluir").value;

  if (!id) {
    alert("Informe o ID do item!");
    return;
  }

  if (!confirm("Tem certeza que deseja excluir este item?")) return;

  try {
    const resposta = await fetch(`http://localhost:3000/api/itens/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.erro || "Erro ao excluir item");
    }

    alert("Item removido com sucesso!");

    // Atualiza a lista/tabela se houver função global
    if (window.ConsultarItens) window.ConsultarItens();
    if (window.carregarOpcoesItens) window.carregarOpcoesItens();

  } catch (erro) {
    console.error("Erro ao remover item:", erro);
    alert("Erro ao deletar item: " + erro.message);
  }
}
