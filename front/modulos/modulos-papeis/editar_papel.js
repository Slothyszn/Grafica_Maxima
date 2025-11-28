export async function habilitarEdicao() {
  const nomeSelecionado = document.getElementById("tipoPapel").value;
  if (!nomeSelecionado) return;

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/papeis");
    const dados = await resposta.json();

    const papel = dados.Papel.find(p => p.nome === nomeSelecionado);
    if (!papel) {
      alert("Papel não encontrado!");
      return;
    }

    document.getElementById("editar-papel").style.display = "block";
    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value;

      if (!campo || !novoValor) {
        alert("Escolha o campo e insira o novo valor!");
        return;
      }

      // envia o PUT para o back
      await fetch(`https://grafica-maxima.onrender.com/api/papeis/${papel.id_papel}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campo, novoValor })
      });

      alert("Papel atualizado!");
      document.getElementById("editar-papel").style.display = "none";
    };
  } catch (erro) {
    console.error("Erro ao carregar papel:", erro);
  }
}