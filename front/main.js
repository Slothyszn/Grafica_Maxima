// ------------------------------
// 📦 Importações dos módulos
// ------------------------------
import { ConsultarPapeis, desaparecerPapeis, carregarOpcoesPapeis } from '../modulos/modulos-papeis/listar_papeis.js';
import { InserirPapel } from '../modulos/modulos-papeis/inserir_papel.js';
import { habilitarEdicao } from '../modulos/modulos-papeis/editar_papel.js';
import { carregarPapeisParaExcluir, excluirPapel } from '../modulos/modulos-papeis/deletar_papel.js';

import { InserirMaquina } from '../modulos/modulos-maquina/inserir_maquina.js';
import { ConsultarMaquinas, desaparecerMaquinas, carregarOpcoesMaquinas} from '../modulos/modulos-maquina/listar_maquina.js'
import { habilitarEdicaoMaquina } from '../modulos/modulos-maquina/editar_maquina.js'
import { carregarMaquinasParaExcluir, excluirMaquina } from '../modulos/modulos-maquina/deletar_maquina.js'

import { carregarFornecedoresParaExcluir, excluirFornecedor} from '../modulos/modulos-fornecedor/deletar_fornecedor.js'
import { habilitarEdicaoFornecedor } from '../modulos/modulos-fornecedor/editar_fornecedor.js'
import { InserirFornecedor } from '../modulos/modulos-fornecedor/inserir_fornecedor.js'
import { ConsultarFornecedores, carregarOpcoesFornecedores, desaparecerFornecedores } from '../modulos/modulos-fornecedor/listar_fornecedor.js'
 

// ------------------------------
// 📑 Detectar qual página está sendo carregada
// ------------------------------
const url = window.location.pathname;

// ------------------------------
// 📄 Página de Papéis
// ------------------------------
if (url.includes("papeis")) {

    const btnConsulta = document.getElementById("btn-consulta");
    const btnDesapareca = document.getElementById("btn-desapareca");
    const formPapel = document.getElementById("form-papel");
    const tipoPapel = document.getElementById("tipoPapel");
    const btnExcluir = document.getElementById("btnExcluir");

    if (btnConsulta) btnConsulta.addEventListener("click", ConsultarPapeis);
    if (btnDesapareca) btnDesapareca.addEventListener("click", desaparecerPapeis);
    if (formPapel) formPapel.addEventListener("submit", InserirPapel);
    if (tipoPapel) tipoPapel.addEventListener("change", habilitarEdicao);
    if (btnExcluir) btnExcluir.addEventListener("click", excluirPapel);

    window.addEventListener("DOMContentLoaded", carregarOpcoesPapeis);
    window.onload = carregarPapeisParaExcluir;
}

// ------------------------------
// ⚙️ Página de Máquinas
// ------------------------------
if (url.includes("maquinas")) {

    const formMaquina = document.getElementById("form-maquina");
    const btnConsulta = document.getElementById("btn-consulta-maquinas");
    const btnDesapareca = document.getElementById("btn-desapareca-maquinas");
    const tipoMaquina = document.getElementById("tipoMaquina");
    const btnExcluir = document.getElementById("btnExcluir");


    if (formMaquina) formMaquina.addEventListener("submit", InserirMaquina);
    if (btnConsulta) btnConsulta.addEventListener("click", ConsultarMaquinas);
    if (btnDesapareca) btnDesapareca.addEventListener("click", desaparecerMaquinas);
    if (tipoMaquina) tipoMaquina.addEventListener("change", habilitarEdicaoMaquina);
    if (btnExcluir) btnExcluir.addEventListener("click", excluirMaquina);

    window.addEventListener("DOMContentLoaded", carregarOpcoesMaquinas);
    window.onload = carregarMaquinasParaExcluir;

  // depois tu pode adicionar mais listeners pra listar, editar, deletar máquinas
}

// ------------------------------
// 🔧 Próximas páginas (Serviços, Clientes, etc.)
// ------------------------------
// 


if (url.includes("fornecedores")) {

  const formFornecedor = document.getElementById("form-fornecedor");
  const btnConsulta = document.getElementById("btn-consulta-fornecedores");
  const btnDesapareca = document.getElementById("btn-desapareca-fornecedores");
  const tipoFornecedor = document.getElementById("tipoFornecedor");
  const btnExcluir = document.getElementById("btnExcluir");

  if (formFornecedor) formFornecedor.addEventListener("submit", InserirFornecedor);
  if (btnConsulta) btnConsulta.addEventListener("click", ConsultarFornecedores);
  if (btnDesapareca) btnDesapareca.addEventListener("click", desaparecerFornecedores);
  if (tipoFornecedor) tipoFornecedor.addEventListener("change", habilitarEdicaoFornecedor);
  if (btnExcluir) btnExcluir.addEventListener("click", excluirFornecedor);

  window.addEventListener("DOMContentLoaded", carregarOpcoesFornecedores);
  window.onload = carregarFornecedoresParaExcluir;
}
