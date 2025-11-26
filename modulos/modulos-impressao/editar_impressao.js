// ==========================
// HABILITAR EDIÇÃO DE IMPRESSÃO
// ==========================
export async function habilitarEdicaoImpressao() {
    const selecionado = document.getElementById("impressaoEditar").value;
    if (!selecionado) return;

    try {
        // Pegar todas impressões, substratos, colorimetrias e impressoras
        const [resImpressao, resSubs, resColors, resImprs] = await Promise.all([
            fetch("http://localhost:3000/api/impressao"),
            fetch("http://localhost:3000/api/substratos"),
            fetch("http://localhost:3000/api/colorimetria"),
            fetch("http://localhost:3000/api/impressoras")
        ]);

        const dataImpressao = await resImpressao.json();
        const dataSubs = await resSubs.json();
        const dataColors = await resColors.json();
        const dataImprs = await resImprs.json();

        const impressaoList = Array.isArray(dataImpressao.Impressao) ? dataImpressao.Impressao : [];
        const substratos = Array.isArray(dataSubs.Substrato) ? dataSubs.Substrato : [];
        const frente = Array.isArray(dataColors.Colorimetria) ? dataColors.Colorimetria : [];
        const verso = Array.isArray(dataColors.Colorimetria) ? dataColors.Colorimetria : [];
        const impressoras = Array.isArray(dataImprs.Impressora) ? dataImprs.Impressora : [];

        const [id_imp] = selecionado.split(" | ");
        const impressao = impressaoList.find(i => String(i.id_imp) === id_imp);
        if (!impressao) return alert("Impressão não encontrada!");

        // Mostrar container de edição
        const containerEditar = document.getElementById("editar-impressao");
        if (containerEditar) containerEditar.style.display = "block";

        const campoSel = document.getElementById("campoEditarImpressao");
        const inputTexto = document.getElementById("novoValorImpressao");

        // Criar select dinâmico
        let inputSelect = document.getElementById("novoValorImpressaoSelect");
        if (!inputSelect) {
            inputSelect = document.createElement("select");
            inputSelect.id = "novoValorImpressaoSelect";
            inputTexto.parentNode.insertBefore(inputSelect, inputTexto.nextSibling);
        }
        inputSelect.style.display = "none";

        campoSel.addEventListener("change", () => {
            const campo = campoSel.value;

            // reset
            inputTexto.style.display = '';
            inputSelect.style.display = 'none';
            inputSelect.innerHTML = '';

            if (!campo) return;

            // ID SUBSTRATO → select
            if (campo === "id_sub") {
                inputTexto.style.display = 'none';
                inputSelect.style.display = '';
                inputSelect.innerHTML =
                    '<option value="">Selecione...</option>' +
                    substratos.map(s => `<option value="${s.id_sub}">${s.id_sub} | ${s.med_sub} | ${s.valor}</option>`).join('');
                return;
            }

            // COR FRENTE → select
            if (campo === "cod_frente") {
                inputTexto.style.display = 'none';
                inputSelect.style.display = '';
                inputSelect.innerHTML =
                    '<option value="">Selecione...</option>' +
                    frente.map(c => `<option value="${c.id_color}">${c.id_color} | ${c.nome}</option>`).join('');
                return;
            }

            // COR VERSO → select
            if (campo === "cod_verso") {
                inputTexto.style.display = 'none';
                inputSelect.style.display = '';
                inputSelect.innerHTML =
                    '<option value="">Selecione...</option>' +
                    verso.map(c => `<option value="${c.id_color}">${c.id_color} | ${c.nome}</option>`).join('');
                return;
            }

            // IMPRESSORA → select
            if (campo === "id_impres") {
                inputTexto.style.display = 'none';
                inputSelect.style.display = '';
                inputSelect.innerHTML =
                    '<option value="">Selecione...</option>' +
                    impressoras.map(i => `<option value="${i.id_impres}">${i.id_impres} | ${i.nome}</option>`).join('');
                return;
            }

            // VALORES NUMÉRICOS → input normal
            if (["velo", "n_pass", "custo_hora", "custo_exced"].includes(campo)) {
                inputTexto.style.display = '';
                inputSelect.style.display = 'none';
                return;
            }
        });

        // BOTÃO SALVAR ALTERAÇÃO
        document.getElementById("btnSalvarAlteracaoImpressao").onclick = async () => {
            const campo = campoSel.value;
            if (!campo) return alert("Escolha o campo!");

            const novoValor = inputSelect.style.display === '' ? inputSelect.value : inputTexto.value.trim();
            if (!novoValor) return alert("Informe o novo valor!");

            const payload = { campo, novoValor };

            try {
                const resposta = await fetch(`http://localhost:3000/api/impressao/${impressao.id_imp}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!resposta.ok) {
                    const erroData = await resposta.json().catch(() => ({}));
                    throw new Error(erroData.mensagem || "Falha ao atualizar impressão.");
                }

                alert("Impressão atualizada com sucesso!");
                containerEditar.style.display = "none";

            } catch (erro) {
                console.error("Erro ao atualizar impressão:", erro);
                alert("Erro ao atualizar impressão.");
            }
        };

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Erro ao carregar impressões.");
    }
}
