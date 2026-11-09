/* =========================================================
   Login da prova — confere usuário e senha pelo hash
   configurado em content/acesso.js. Carregar ANTES de prova.js.
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.PROVA_ACESSO || { ativo: false };
  const CHAVE = "dp_prova_acesso";
  const $ = (s) => document.querySelector(s);

  const telaLogin = $('[data-screen="login"]');
  const telaInicio = $('[data-screen="inicio"]');
  const form = $("[data-form-login]");
  const inUser = $('[name="usuario"]');
  const inSenha = $('[name="senha"]');
  const erro = $("[data-erro-login]");
  const botao = $("[data-entrar]");
  const toggle = $("[data-ver-senha]");
  const sair = $("[data-sair]");
  const ajuda = $("[data-ajuda-login]");

  const hashDe = (u, s) => window.sha256(`${u.trim().toLowerCase()}:${s}`);

  function sessaoValida() {
    if (!CFG.lembrarNaSessao) return false;
    try { return sessionStorage.getItem(CHAVE) === CFG.hash; } catch (e) { return false; }
  }

  function liberar(lembrar) {
    if (lembrar && CFG.lembrarNaSessao) {
      try { sessionStorage.setItem(CHAVE, CFG.hash); } catch (e) {}
    }
    telaLogin.hidden = true;
    telaInicio.hidden = false;
    if (sair) sair.hidden = false;
    document.body.classList.add("is-logado");
    const nome = $('[name="nome"]');
    if (nome) nome.focus({ preventScroll: true });
  }

  function bloquear() {
    try { sessionStorage.removeItem(CHAVE); } catch (e) {}
    location.reload();
  }

  // prova sem login
  if (!CFG.ativo || !CFG.hash) {
    if (telaLogin) telaLogin.remove();
    telaInicio.hidden = false;
    return;
  }

  if (ajuda && CFG.mensagemAjuda) ajuda.textContent = CFG.mensagemAjuda;
  if (sair) sair.addEventListener("click", bloquear);

  if (sessaoValida()) { liberar(false); return; }

  telaLogin.hidden = false;
  telaInicio.hidden = true;

  // mostrar / ocultar senha
  if (toggle) {
    toggle.addEventListener("click", () => {
      const ver = inSenha.type === "password";
      inSenha.type = ver ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(ver));
      toggle.setAttribute("aria-label", ver ? "Ocultar senha" : "Mostrar senha");
      inSenha.focus();
    });
  }

  let falhas = 0;
  const LIMITE = CFG.tentativasAntesDeEsperar || 5;
  const ESPERA = CFG.segundosDeEspera || 30;

  function mostrarErro(msg) {
    erro.textContent = msg;
    erro.hidden = false;
    form.classList.remove("is-shake");
    void form.offsetWidth;
    form.classList.add("is-shake");
  }

  function esperar() {
    let s = ESPERA;
    botao.disabled = true;
    const tick = () => {
      if (s <= 0) {
        botao.disabled = false;
        botao.textContent = "Entrar";
        erro.hidden = true;
        falhas = 0;
        return;
      }
      botao.textContent = `Aguarde ${s}s`;
      s--;
      setTimeout(tick, 1000);
    };
    tick();
  }

  [inUser, inSenha].forEach((i) => i.addEventListener("input", () => {
    i.removeAttribute("aria-invalid");
    if (!botao.disabled) erro.hidden = true;
  }));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (botao.disabled) return;
    const u = inUser.value, s = inSenha.value;
    if (!u.trim() || !s) {
      if (!u.trim()) inUser.setAttribute("aria-invalid", "true");
      if (!s) inSenha.setAttribute("aria-invalid", "true");
      mostrarErro("Preencha usuário e senha.");
      (!u.trim() ? inUser : inSenha).focus();
      return;
    }
    if (hashDe(u, s) === CFG.hash) {
      form.classList.add("is-ok");
      botao.textContent = "Acesso liberado";
      setTimeout(() => liberar(true), 350);
      return;
    }
    falhas++;
    inSenha.value = "";
    inSenha.setAttribute("aria-invalid", "true");
    if (falhas >= LIMITE) {
      mostrarErro(`Muitas tentativas. Aguarde ${ESPERA} segundos e tente de novo.`);
      esperar();
    } else {
      const resta = LIMITE - falhas;
      mostrarErro(`Usuário ou senha incorretos. ${resta} ${resta === 1 ? "tentativa" : "tentativas"} antes de uma pausa.`);
      inSenha.focus();
    }
  });

  inUser.focus({ preventScroll: true });
})();
