export async function habilitarEdicaoMaquina() {
  const nomeSelecionado = document.getElementById("tipoMaquina").value;
  if (!nomeSelecionado) return;
  console.log("🟢 Função habilitarEdicaoMaquina chamada!");

  try {
    const resposta = await fetch("http://localhost:3000/api/maquinas");
    const dados = await resposta.json();

    console.log("🔍 Resposta do servidor:", dados);

    const maquina = dados.Maquina.find(m => m.tipo === nomeSelecionado); 
    if (!maquina) {
      alert("Máquina não encontrada!");
      return;
    }

    document.getElementById("editar-maquina").style.display = "block";

    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value.trim();

      if (!campo || !novoValor) {
        alert("Escolha o campo e insira o novo valor!");
        return;
      }

      try {
        const respostaPut = await fetch(`http://localhost:3000/api/maquinas/${maquina.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campo, novoValor }) // ✅ ajustado
        });

        if (!respostaPut.ok) throw new Error("Falha ao atualizar máquina.");

        alert("Máquina atualizada com sucesso!");
        document.getElementById("editar-maquina").style.display = "none";
      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert("Erro ao atualizar a máquina.");
      }
    };
  } catch (erro) {
    console.error("Erro ao carregar máquina:", erro);
    alert("Erro ao carregar dados da máquina.");
  }
}
