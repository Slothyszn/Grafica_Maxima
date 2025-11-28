
export async function excluirSubstrato() {
  const id = document.getElementById("substratoExcluir").value;

  if (!id) {
    alert("Informe o ID!");
    return;
  }

  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    const resposta = await fetch(`https://grafica-maxima.onrender.com/api/substratos/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) throw new Error("Erro ao excluir");

    alert("Substrato removido!");
  } catch (erro) {
    console.error("Erro ao remover:", erro);
    alert("Erro ao deletar.");
  }
}
