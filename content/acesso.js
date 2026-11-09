/* =========================================================
   ACESSO À PROVA — usuário e senha
   ---------------------------------------------------------
   • A senha NÃO fica escrita aqui: guardamos só o "hash"
     (uma impressão digital) de  usuario:senha.
   • Para trocar o usuário ou a senha, abra no navegador
     ferramentas/gerar-acesso.html, digite os novos dados
     e cole o código gerado em "hash" abaixo.
   • Importante: a prova roda no navegador do aluno. O login
     impede quem só tem o link, mas não é uma proteção de
     servidor. Troque a senha se ela vazar.
   ========================================================= */

window.PROVA_ACESSO = {
  ativo: true,                     // false = prova sem login
  // hash de  usuario:senha  (não escreva a senha neste arquivo)
  hash: "ce7693c31c80aca5aa60793a5f1e76613da197815f86e917cbf605e5024eceab",
  lembrarNaSessao: true,           // não pede login de novo até fechar o navegador
  tentativasAntesDeEsperar: 5,
  segundosDeEspera: 30,
  mensagemAjuda: "Os dados de acesso foram enviados junto com a compra do plano Completo.",
};
