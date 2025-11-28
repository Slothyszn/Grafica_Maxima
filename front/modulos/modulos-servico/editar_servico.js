export async function habilitarEdicaoServico() {
  const selecionado = document.getElementById("tipoServico").value;
  if (!selecionado) return;

  // pega só o ID antes do " | "
  const idSelecionado = selecionado.split(" | ")[0].trim();

  try {
    const resposta = await fetch("http://localhost:3000/api/servicos");
    if (!resposta.ok) {
      alert('Erro ao carregar serviços para edição');
      return;
    }
    const dados = await resposta.json();

    const servico = dados.Servico.find(p => String(p.id_serv) === idSelecionado);
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
      try {
        const res = await fetch(`http://localhost:3000/api/servicos/${servico.id_serv}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campo, novoValor })
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.mensagem || 'Erro ao atualizar serviço');
        }

        alert('Serviço atualizado!');
        document.getElementById('editar-servico').style.display = 'none';
        if (window.ConsultarServicos) await window.ConsultarServicos();
      } catch (erro) {
        console.error('Erro ao atualizar serviço:', erro);
        alert('Erro ao atualizar serviço: ' + (erro.message || erro));
      }
    };
  } catch (erro) {
    console.error("Erro ao carregar servico:", erro);
  }
}