export async function excluirImpressao() {
  let id = document.getElementById("impressaoExcluir").value;

  if (!id) {
    alert("Informe o ID da impressão!");
    return;
  }

  id = id.split("|")[0].trim();

  if (!confirm("Tem certeza que deseja excluir esta impressão?")) return;

  try {
    const resposta = await fetch(`https://grafica-maxima.onrender.com/api/impressao/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) throw new Error("Erro ao excluir");

    alert("Impressão removida com sucesso!");
  } catch (erro) {
    console.error("Erro ao remover impressão:", erro);
    alert("Erro ao deletar impressão.");
  }
}
