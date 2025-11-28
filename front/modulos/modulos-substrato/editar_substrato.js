// ==========================
// HABILITAR EDIÇÃO DE SUBSTRATO
// ==========================
export async function habilitarEdicaoSubstrato() {
    const selecionado = document.getElementById("tipoSubstrato").value;
    if (!selecionado) return;

    try {
        // Carregar dados externos
        const [resSubs, resFamilias, resCategorias] = await Promise.all([
            fetch("https://grafica-maxima.onrender.com/api/substratos"),
            fetch("https://grafica-maxima.onrender.com/api/familias"),
            fetch("https://grafica-maxima.onrender.com/api/categorias")
        ]);

        const dadosSubs = await resSubs.json();
        const dadosFams = await resFamilias.json();
        const dadosCategs = await resCategorias.json();

        const substratos = Array.isArray(dadosSubs.Substrato) ? dadosSubs.Substrato : [];
        const familias = Array.isArray(dadosFams.Familia) ? dadosFams.Familia : [];
        const categorias = Array.isArray(dadosCategs.Categoria) ? dadosCategs.Categoria : [];

        const substrato = substratos.find(s => String(s.id_sub) === selecionado);
        if (!substrato) return alert("Substrato não encontrado!");

        // Mostrar container
        const formEditar = document.getElementById("editar-substrato");
        if (formEditar) formEditar.style.display = "block";

        const campoSel = document.getElementById("campoEditar");
        const inputTexto = document.getElementById("novoValor");

        // Criar select dinâmico (como no fornecimento)
        let inputSelect = document.getElementById("novoValorSelect");
        if (!inputSelect) {
            inputSelect = document.createElement("select");
            inputSelect.id = "novoValorSelect";
            inputTexto.parentNode.insertBefore(inputSelect, inputTexto.nextSibling);
        }
        inputSelect.style.display = "none";

        // Ajustar input dependendo do campo selecionado
        campoSel.addEventListener("change", () => {
            const campo = campoSel.value;

            // reset
            inputTexto.style.display = '';
            inputSelect.style.display = 'none';
            inputSelect.innerHTML = '';

            if (!campo) return;

            // ID FAMÍLIA → select
            if (campo === "id_fam") {
                inputTexto.style.display = 'none';
                inputSelect.style.display = '';

                inputSelect.innerHTML =
                    '<option value="">Selecione...</option>' +
                    familias
                        .map(f => `<option value="${f.id_fam}">${f.id_fam} | ${f.nome}</option>`)
                        .join('');
                return;
            }

            // ID CATEGORIA → select
            if (campo === "id_categ") {
                inputTexto.style.display = 'none';
                inputSelect.style.display = '';

                inputSelect.innerHTML =
                    '<option value="">Selecione...</option>' +
                    categorias
                        .map(c => `<option value="${c.id_categ}">${c.id_categ} | ${c.nome}</option>`)
                        .join('');
                return;
            }

            // MEDIDA → select
            if (campo === "med_sub") {
                inputTexto.style.display = 'none';
                inputSelect.style.display = '';

                inputSelect.innerHTML =
                    '<option value="">Selecione...</option>' +
                    '<option value="gramatura">gramatura</option>' +
                    '<option value="espessura">espessura</option>';
                return;
            }

            // VALOR → input normal
            if (campo === "valor") {
                inputTexto.style.display = '';
                inputSelect.style.display = 'none';
                return;
            }
        });

        // BOTÃO SALVAR ALTERAÇÃO
        document.getElementById("btnSalvarAlteracao").onclick = async () => {
            const campo = campoSel.value;
            if (!campo) return alert("Escolha o campo!");

            const novoValor =
                inputSelect.style.display === '' ? inputSelect.value : inputTexto.value.trim();

            if (!novoValor) return alert("Informe o novo valor!");

            
            const payload = { campo, novoValor };

            try {
                const resposta = await fetch(`https://grafica-maxima.onrender.com/api/substratos/${substrato.id_sub}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!resposta.ok) {
                    const erroData = await resposta.json().catch(() => ({}));
                    throw new Error(erroData.mensagem || "Falha ao atualizar substrato.");
                }

                alert("Substrato atualizado com sucesso!");
                formEditar.style.display = "none";

            } catch (erro) {
                console.error("Erro ao atualizar substrato:", erro);
                alert("Erro ao atualizar substrato.");
            }
        };

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Erro ao carregar substratos.");
    }
}
