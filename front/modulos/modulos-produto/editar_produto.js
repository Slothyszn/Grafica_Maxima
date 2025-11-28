// ==========================
// HABILITAR EDIÇÃO DE PRODUTO
// ==========================
export async function habilitarEdicaoProduto() {
    const selecionado = document.getElementById("tipoProduto").value;
    if (!selecionado) return;

    try {
        // Carregar dados externos
        const [resProds, resFamilias, resCategorias] = await Promise.all([
            fetch("https://grafica-maxima.onrender.com/api/produtos"),
            fetch("https://grafica-maxima.onrender.com/api/familias"),
            fetch("https://grafica-maxima.onrender.com/api/categorias")
        ]);

        const dadosProds = await resProds.json();
        const dadosFams = await resFamilias.json();
        const dadosCategs = await resCategorias.json();

        const produtos = Array.isArray(dadosProds.Produto) ? dadosProds.Produto : [];
        const familias = Array.isArray(dadosFams.Familia) ? dadosFams.Familia : [];
        const categorias = Array.isArray(dadosCategs.Categoria) ? dadosCategs.Categoria : [];

        const produto = produtos.find(p => String(p.id_prod) === selecionado);
        if (!produto) return alert("Produto não encontrado!");

        // Mostrar container
        const formEditar = document.getElementById("editar-produto");
        if (formEditar) formEditar.style.display = "block";

        const campoSel = document.getElementById("campoEditar");
        const inputTexto = document.getElementById("novoValor");

        // Criar select dinâmico
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
                    familias.map(f => `<option value="${f.id_fam}">${f.id_fam} | ${f.nome}</option>`).join('');
                return;
            }

            // ID CATEGORIA → select
            if (campo === "id_categ") {
                inputTexto.style.display = 'none';
                inputSelect.style.display = '';
                inputSelect.innerHTML =
                    '<option value="">Selecione...</option>' +
                    categorias.map(c => `<option value="${c.id_categ}">${c.id_categ} | ${c.nome}</option>`).join('');
                return;
            }

            // CUSTO → input normal
            if (campo === "custo_m2") {
                inputTexto.style.display = '';
                inputSelect.style.display = 'none';
                return;
            }
        });

        // BOTÃO SALVAR ALTERAÇÃO
        document.getElementById("btnSalvarAlteracao").onclick = async () => {
            const campo = campoSel.value;
            if (!campo) return alert("Escolha o campo!");

            const novoValor = inputSelect.style.display === '' ? inputSelect.value : inputTexto.value.trim();
            if (!novoValor) return alert("Informe o novo valor!");

            const payload = { campo, novoValor };

            try {
                const resposta = await fetch(`https://grafica-maxima.onrender.com/api/produtos/${produto.id_prod}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!resposta.ok) {
                    const erroData = await resposta.json().catch(() => ({}));
                    throw new Error(erroData.mensagem || "Falha ao atualizar produto.");
                }

                alert("Produto atualizado com sucesso!");
                formEditar.style.display = "none";

                // Opcional: atualizar lista de produtos
                if (typeof ConsultarProdutos === "function") {
                    ConsultarProdutos();
                }

            } catch (erro) {
                console.error("Erro ao atualizar produto:", erro);
                alert("Erro ao atualizar produto.");
            }
        };

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Erro ao carregar produtos.");
    }
}
