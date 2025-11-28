// ==========================
// INSERIR FORNECIMENTO
// ==========================
export async function InserirFornecimento(event) {
  event.preventDefault();

  try {
    // Carregar tabelas necessárias com Promise.all
    const [resForn, resSub, resForm] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/fornecedores"),
      fetch("https://grafica-maxima.onrender.com/api/substratos"),
      fetch("https://grafica-maxima.onrender.com/api/formatos")
    ]);

    const dadosForn = await resForn.json();
    const dadosSub = await resSub.json();
    const dadosForm = await resForm.json();

    const fornecedores = Array.isArray(dadosForn.Fornecedor) ? dadosForn.Fornecedor : [];
    const substratos = Array.isArray(dadosSub.Substrato) ? dadosSub.Substrato : [];
    const formatos = Array.isArray(dadosForm.Formato) ? dadosForm.Formato : [];

    // Pegar valores do formulário
    const nomeFornecedor = document.getElementById("nome_fornecedor").value.trim();
    const nomeSubstrato = document.getElementById("nome_substrato").value.trim();
    const nomeFormato = document.getElementById("nome_formato").value.trim();
    const forma = document.getElementById("forma").value;
    const custo = document.getElementById("custo_pro_m2").value;

    // Validar
    const fornecedor = fornecedores.find(f => f.nome === nomeFornecedor);
    const substrato = substratos.find(s => s.id_sub == nomeSubstrato);
    const formato = formatos.find(f => f.nome === nomeFormato);

    if (!fornecedor) return alert("Fornecedor não encontrado!");
    if (!substrato) return alert("Substrato não encontrado!");
    if (!formato) return alert("Formato não encontrado!");
    if (!forma) return alert("Selecione a forma (folha ou rolo)!");
    if (!custo || isNaN(Number(custo))) return alert("Informe um custo válido!");

    // Montar objeto
    const novoFornecimento = {
      id_forn: fornecedor.id_forn,
      id_sub: substrato.id_sub,
      id_fmt: formato.id_fmt,
      forma: forma,
      custo_m2: Number(custo)
    };

    console.log("Enviando:", novoFornecimento);

    // Enviar para backend
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/fornecimentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFornecimento)
    });

    if (!resposta.ok) throw new Error("Erro ao inserir fornecimento");

    const data = await resposta.json();
    alert(data.mensagem || "Fornecimento inserido com sucesso!");

  } catch (erro) {
    console.error("Erro ao inserir fornecimento:", erro);
    alert("Não foi possível inserir o fornecimento.");
  }
}
