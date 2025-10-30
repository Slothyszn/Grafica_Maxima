import { ConsultarPapeis } from '../modulos/listar_papeis.js';
import { InserirPapel } from '../modulos/inserir_papel.js';

document.getElementById("btn-consulta").addEventListener("click", ConsultarPapeis);
document.getElementById("btn-inserir").addEventListener("click", InserirPapel);