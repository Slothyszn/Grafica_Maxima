export async function habilitarEdicaoConfig() {
  const selecionado = document.getElementById("tipoConfig").value;
  if (!selecionado) return;

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/configs");
    const dados = await resposta.json();
    const configs = Array.isArray(dados) ? dados : dados.Config || [];

    const config = configs.find(c => String(c.id_config) === selecionado || String(c.id_config) === selecionado);
    if (!config) return alert("Configuração não encontrada");

    const formEditar = document.getElementById("editar-config");
    if (formEditar) formEditar.style.display = "block";
    // Quando o usuário escolher qual campo editar, se for id_color ou id_impres
    // devemos ligar o input #novoValorConfig ao datalist correspondente para facilitar a seleção.
    const campoSelect = document.getElementById("campoEditarConfig");
    const novoValorInput = document.getElementById("novoValorConfig");
    if (campoSelect && novoValorInput) {
      campoSelect.addEventListener('change', () => {
        const campoEscolhido = campoSelect.value;
        if (campoEscolhido === 'id_impres') {
          novoValorInput.setAttribute('list', 'listaImpressoras');
          novoValorInput.placeholder = 'Escolha a impressora (id)';
        } else if (campoEscolhido === 'id_color') {
          novoValorInput.setAttribute('list', 'listaColorimetria');
          novoValorInput.placeholder = 'Escolha a colorimetria (id)';
        } else {
          novoValorInput.removeAttribute('list');
          novoValorInput.placeholder = 'Novo valor';
        }
      });
    }

    document.getElementById("btnSalvarAlteracaoConfig").onclick = async () => {
      const campo = document.getElementById("campoEditarConfig").value;
      const novoValor = document.getElementById("novoValorConfig").value.trim();

      if (!campo || !novoValor) return alert("Escolha campo e insira novo valor");

      const payload = { campo, novoValor };

      try {
        const respostaPut = await fetch(`https://grafica-maxima.onrender.com/api/configs/${config.id_config}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!respostaPut.ok) {
          const erroData = await respostaPut.json().catch(() => ({}));
          throw new Error(erroData.mensagem || "Falha ao atualizar config.");
        }

        alert("Config atualizada com sucesso!");
        if (formEditar) formEditar.style.display = "none";
      } catch (erro) {
        console.error("Erro ao atualizar config:", erro);
        alert(`Erro: ${erro.message}`);
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar configs:", erro);
    alert("Erro ao carregar configs.");
  }
}
