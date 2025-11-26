// Função para ajustar input dependendo do campo
function ajustarInputPorCampo(campoSel, inputTexto, inputSelect, fornecedores, substratos, formatos) {
  const campo = campoSel.value;
  if (!campo) {
    inputTexto.style.display = '';
    inputSelect.style.display = 'none';
    inputSelect.innerHTML = '';
    return;
  }

  if (campo === 'id_forn') {
    inputTexto.style.display = 'none';
    inputSelect.style.display = '';
    inputSelect.innerHTML = '<option value="">Selecione...</option>' +
      fornecedores.map(f => `<option value="${f.nome}">${f.nome}</option>`).join('');
  } else if (campo === 'id_sub') {
    inputTexto.style.display = 'none';
    inputSelect.style.display = '';
    inputSelect.innerHTML = '<option value="">Selecione...</option>' +
      substratos.map(s => `<option value="${s.nome || s.id_sub}">${s.nome || `Substrato #${s.id_sub}`}</option>`).join('');
  } else if (campo === 'id_fmt') {
    inputTexto.style.display = 'none';
    inputSelect.style.display = '';
    inputSelect.innerHTML = '<option value="">Selecione...</option>' +
      formatos.map(f => `<option value="${f.nome}">${f.nome}</option>`).join('');
  } else {
    inputTexto.style.display = '';
    inputSelect.style.display = 'none';
    inputSelect.innerHTML = '';
  }
}

// ==========================
// HABILITAR EDIÇÃO DE FORNECIMENTO
// ==========================
export async function habilitarEdicaoFornecimento() {
  const inputSelecionado = document.getElementById("fornecimentoEditar");
  if (!inputSelecionado) return;

  const valorSelecionado = inputSelecionado.value.trim();
  if (!valorSelecionado) return;

  const idSelecionado = valorSelecionado.split(" | ")[0]; // pega só o ID

  try {
    const [resFornc, resFornec, resSubs, resForm] = await Promise.all([
      fetch("http://localhost:3000/api/fornecimentos"),
      fetch("http://localhost:3000/api/fornecedores"),
      fetch("http://localhost:3000/api/substratos"),
      fetch("http://localhost:3000/api/formatos")
    ]);

    const dadosFornc = await resFornc.json();
    const dadosFornec = await resFornec.json();
    const dadosSubs = await resSubs.json();
    const dadosForm = await resForm.json();

    const fornecimentos = Array.isArray(dadosFornc.Fornecimento) ? dadosFornc.Fornecimento : [];
    const fornecedores = Array.isArray(dadosFornec.Fornecedor) ? dadosFornec.Fornecedor : [];
    const substratos = Array.isArray(dadosSubs.Substrato) ? dadosSubs.Substrato : [];
    const formatos = Array.isArray(dadosForm.Formato) ? dadosForm.Formato : [];

    const fornecimento = fornecimentos.find(f => f.id_fornec == idSelecionado);
    if (!fornecimento) return alert("Fornecimento não encontrado!");

    const containerEdicao = document.getElementById("editar-fornecimento");
    if (!containerEdicao) return;
    containerEdicao.style.display = "block";

    const campoSel = document.getElementById("campoEditar");
    const inputTexto = document.getElementById("novoValor");
    const inputSelect = document.createElement("select"); // cria select dinamicamente
    inputSelect.id = "novoValorSelect";
    inputTexto.parentNode.insertBefore(inputSelect, inputTexto.nextSibling);
    inputSelect.style.display = "none";

    campoSel.addEventListener('change', () => ajustarInputPorCampo(campoSel, inputTexto, inputSelect, fornecedores, substratos, formatos));

    const idFornec = fornecimento.id_fornec;

    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = campoSel.value;

      const novoValor =
        inputSelect.style.display !== "none"
          ? inputSelect.value
          : inputTexto.value.trim();

      if (!campo || !novoValor) {
        return alert("Escolha o campo e insira o novo valor!");
      }

      const corpoPut = { campo, novoValor };

      // Mapear nomes para IDs
      if (campo === "id_forn") {
        const f = fornecedores.find(f => f.nome === novoValor);
        if (!f) return alert("Fornecedor não encontrado!");
        corpoPut.novoValor = f.id_forn;
      }

      if (campo === "id_sub") {
        const s = substratos.find(s => s.id_sub == novoValor || s.nome == novoValor);
        if (!s) return alert("Substrato não encontrado!");
        corpoPut.novoValor = s.id_sub;
      }

      if (campo === "id_fmt") {
        const f = formatos.find(f => f.nome === novoValor);
        if (!f) return alert("Formato não encontrado!");
        corpoPut.novoValor = f.id_fmt; // <- use nome, não id_form
      }

      try {
        const respostaPut = await fetch(`http://localhost:3000/api/fornecimentos/${idFornec}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpoPut)
        });

        if (!respostaPut.ok) throw new Error("Falha ao atualizar fornecimento.");

        alert("Atualizado!");
        containerEdicao.style.display = "none";
        
      } catch (erro) {
        console.error("Erro ao atualizar fornecimento:", erro);
        alert("Erro ao atualizar.");
      }
    };
  } catch (erro) {
    console.error("Erro ao carregar fornecimento:", erro);
    alert("Erro ao carregar dados do fornecimento.");
  }
}
