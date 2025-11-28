// ==========================
// HABILITAR EDIÇÃO DE FORMATO
// ==========================
export async function habilitarEdicaoFormato() {
  const inputSelecionado = document.getElementById("formatoEditar");
  if (!inputSelecionado) return;

  const valorSelecionado = inputSelecionado.value.trim();
  if (!valorSelecionado) return;

  const idSelecionado = valorSelecionado.split(" | ")[0]; // pega só o ID

  try {
    // Carregar formatos
    const resFormatos = await fetch("https://grafica-maxima.onrender.com/api/formatos");
    const dadosFormatos = await resFormatos.json();
    const formatos = Array.isArray(dadosFormatos.Formato) ? dadosFormatos.Formato : [];

    const formato = formatos.find(f => f.id_fmt == idSelecionado);
    if (!formato) return alert("Formato não encontrado!");

    const containerEdicao = document.getElementById("editar-formato");
    if (!containerEdicao) return;
    containerEdicao.style.display = "block";

    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value.trim();

      if (!campo || !novoValor) return alert("Escolha o campo e insira o novo valor!");

      const corpoPut = { campo, novoValor };

      // Se estiver editando o tipo, valida opções
      if (campo === "tipo") {
        if (!["fornecimento", "item"].includes(novoValor)) {
          return alert("Tipo inválido! Escolha 'fornecimento' ou 'item'.");
        }
      }

      try {
        const respostaPut = await fetch(`https://grafica-maxima.onrender.com/api/formatos/${idSelecionado}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpoPut)
        });

        if (!respostaPut.ok) throw new Error("Falha ao atualizar formato.");

        alert("Formato atualizado com sucesso!");
        containerEdicao.style.display = "none";

      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert("Erro ao atualizar formato.");
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar formato:", erro);
    alert("Erro ao carregar dados do formato.");
  }
}
