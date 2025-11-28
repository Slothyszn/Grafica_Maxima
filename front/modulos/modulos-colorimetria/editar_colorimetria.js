export async function habilitarEdicaoColorimetria() {
  const selecionado = document.getElementById("tipoColorimetria").value;
  if (!selecionado) return;

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/colorimetria");
    const dados = await resposta.json();
    const registros = Array.isArray(dados) ? dados : dados.Colorimetria || [];

    const registro = registros.find(r => r.cod === selecionado || String(r.id_color) === selecionado);
    if (!registro) {
      alert("Colorimetria não encontrada!");
      return;
    }

    const formEditar = document.getElementById("editar-colorimetria");
    if (formEditar) formEditar.style.display = "block";

    document.getElementById("btnSalvarAlteracaoColor").onclick = async () => {
      const campo = document.getElementById("campoEditarColor").value;
      const novoValor = document.getElementById("novoValorColor").value.trim();

      if (!campo || !novoValor) return alert("Escolha o campo e insira o novo valor!");

      const payload = { campo, novoValor };

      try {
        const respostaPut = await fetch(`https://grafica-maxima.onrender.com/api/colorimetria/${registro.id_color}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!respostaPut.ok) {
          const erroData = await respostaPut.json().catch(() => ({}));
          throw new Error(erroData.mensagem || "Falha ao atualizar colorimetria.");
        }

        alert("Colorimetria atualizada com sucesso!");
        if (formEditar) formEditar.style.display = "none";
      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert(`Erro ao atualizar a colorimetria: ${erro.message}`);
      }
    };
  } catch (erro) {
    console.error("Erro ao carregar colorimetrias:", erro);
    alert("Erro ao carregar dados das colorimetrias.");
  }
}
