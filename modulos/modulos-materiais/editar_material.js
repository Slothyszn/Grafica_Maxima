export async function habilitarEdicaoMaterial() {
  const nomeSelecionado = document.getElementById("tipoMaterial").value;
  if (!nomeSelecionado) return;
  console.log("🟢 Função habilitarEdicaoMaterial chamada!");

  try {
    const resposta = await fetch("http://localhost:3000/api/materiais");
    const dados = await resposta.json();

    console.log("🔍 Resposta do servidor:", dados);

    const material = dados.Material.find(m => m.nome === nomeSelecionado); 
    if (!material) {
      alert("Material não encontrado!");
      return;
    }

    document.getElementById("editar-material").style.display = "block";

    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value.trim();

      if (!campo || !novoValor) {
        alert("Escolha o campo e insira o novo valor!");
        return;
      }

      try {
        const respostaPut = await fetch(`http://localhost:3000/api/materiais/${material.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campo, novoValor }) // ✅ ajustado
        });

        if (!respostaPut.ok) throw new Error("Falha ao atualizar material.");

        alert("Material atualizado com sucesso!");
        document.getElementById("editar-material").style.display = "none";
      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert("Erro ao atualizar o materual.");
      }
    };
  } catch (erro) {
    console.error("Erro ao carregar material:", erro);
    alert("Erro ao carregar dados da material.");
  }
}
