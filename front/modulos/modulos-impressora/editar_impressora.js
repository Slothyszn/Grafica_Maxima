export async function habilitarEdicaoImpressora() {
  const selecionado = document.getElementById("tipoImpressora").value;
  if (!selecionado) return;

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/impressoras");
    const dados = await resposta.json();
    const impressoras = Array.isArray(dados) ? dados : dados.Impressora || [];

    const impressora = impressoras.find(i => String(i.id_impres) === selecionado || i.nome === selecionado);
    if (!impressora) return alert("Impressora não encontrada");

    const formEditar = document.getElementById("editar-impressora");
    if (formEditar) formEditar.style.display = "block";

    // ajustar entrada dependendo do campo (select para enums)
    const campoSel = document.getElementById("campoEditarImpr");
    const inputTexto = document.getElementById("novoValorImpr");
    const inputSelect = document.getElementById("novoValorImprSelect");

    function ajustarInputPorCampo() {
      const campo = campoSel.value;
      if (!campo) {
        inputTexto.style.display = '';
        inputSelect.style.display = 'none';
        inputSelect.innerHTML = '';
        return;
      }

      // enum fields: tecno, tipo, med_velo
      if (campo === 'tecno') {
        inputTexto.style.display = 'none';
        inputSelect.style.display = '';
        inputSelect.innerHTML = '<option value="">Selecione...</option><option value="offset">offset</option><option value="digital">digital</option>';
      } else if (campo === 'tipo') {
        inputTexto.style.display = 'none';
        inputSelect.style.display = '';
        inputSelect.innerHTML = '<option value="">Selecione...</option><option value="folha">folha</option><option value="rolo">rolo</option>';
      } else if (campo === 'med_velo') {
        inputTexto.style.display = 'none';
        inputSelect.style.display = '';
        inputSelect.innerHTML = '<option value="">Selecione...</option><option value="iph">iph</option><option value="mph">mph</option><option value="m2ph">m2ph</option>';
      } else {
        inputTexto.style.display = '';
        inputSelect.style.display = 'none';
        inputSelect.innerHTML = '';
      }
    }

    campoSel.addEventListener('change', ajustarInputPorCampo);

    document.getElementById("btnSalvarAlteracaoImpr").onclick = async () => {
      const campo = campoSel.value;
      const novoValor = (inputSelect.style.display === '' ? inputSelect.value : inputTexto.value).trim();

      if (!campo || !novoValor) return alert("Escolha campo e insira novo valor");

      const payload = { campo, novoValor };

      try {
        const respostaPut = await fetch(`https://grafica-maxima.onrender.com/api/impressoras/${impressora.id_impres}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!respostaPut.ok) {
          const erroData = await respostaPut.json().catch(() => ({}));
          throw new Error(erroData.mensagem || "Falha ao atualizar impressora.");
        }

        alert("Impressora atualizada com sucesso!");
        if (formEditar) formEditar.style.display = "none";
      } catch (erro) {
        console.error("Erro ao atualizar impressora:", erro);
        alert(`Erro: ${erro.message}`);
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar impressoras:", erro);
    alert("Erro ao carregar impressoras.");
  }
}
