// ==========================
// HABILITAR EDIÇÃO DE FAMÍLIA
// ==========================
export async function habilitarEdicaoFamilia() {
  const inputSelecionado = document.getElementById("tipoFamilia");
  if (!inputSelecionado) return;

  const valorSelecionado = inputSelecionado.value.trim();
  if (!valorSelecionado) return;

  const idSelecionado = valorSelecionado.split(" | ")[0]; // pega só o ID

  try {
    // Carregar famílias
    const resFamilias = await fetch("https://grafica-maxima.onrender.com/api/familias");
    const dadosFamilias = await resFamilias.json();
    const familias = Array.isArray(dadosFamilias.Familia) ? dadosFamilias.Familia : [];

    const familia = familias.find(f => f.id_fam == idSelecionado);
    if (!familia) return alert("Família não encontrada!");

    const containerEdicao = document.getElementById("editar-familia");
    if (!containerEdicao) return;
    containerEdicao.style.display = "block";

    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value.trim();

      if (!campo || !novoValor) return alert("Escolha o campo e insira o novo valor!");

      const corpoPut = { campo, novoValor };

      // Se estiver editando o tipo, valida opções
      if (campo === "tipo") {
        if (!["substrato", "produto"].includes(novoValor)) {
          return alert("Tipo inválido! Escolha 'substrato' ou 'produto'.");
        }
      }

      try {
        const respostaPut = await fetch(`https://grafica-maxima.onrender.com/api/familias/${idSelecionado}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpoPut)
        });

        if (!respostaPut.ok) throw new Error("Falha ao atualizar família.");

        alert("Família atualizada com sucesso!");
        containerEdicao.style.display = "none";

      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert("Erro ao atualizar família.");
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar família:", erro);
    alert("Erro ao carregar dados da família.");
  }
}
