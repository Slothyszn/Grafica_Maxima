export async function habilitarEdicaoServico() {
  const nomeSelecionado = document.getElementById("tipoServico").value;
  if (!nomeSelecionado) return;

  try {
    const resposta = await fetch("http://localhost:3000/api/servicos");
    const dados = await resposta.json();

    const servico = dados.Servico.find(p => p.nome === nomeSelecionado);
    if (!servico) {
      alert("Serviço não encontrado!");
      return;
    }

    document.getElementById("editar-servico").style.display = "block";
    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value;

      if (!campo || !novoValor) {
        alert("Escolha o campo e insira o novo valor!");
        return;
      }

      // envia o PUT para o back
      await fetch(`http://localhost:3000/api/servicos/${servico.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campo, novoValor })
      });

      alert("Serviço atualizado!");
      document.getElementById("editar-servico").style.display = "none";
    };
  } catch (erro) {
    console.error("Erro ao carregar servico:", erro);
  }
}