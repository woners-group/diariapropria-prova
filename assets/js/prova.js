/* =========================================================
   Prova final — lógica, embaralhamento e certificado em PDF
   As perguntas ficam em content/perguntas.js
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.PROVA_CONFIG || {};
  const BANCO = window.PROVA_PERGUNTAS || [];
  const TOTAL = Math.min(CFG.quantidade || 15, BANCO.length);
  const MINIMO = Math.ceil(TOTAL * (CFG.aprovacao || 0.65)); // 15 × 65% = 9,75 → 10 acertos
  const LETRAS = "ABCDEFGH";

  const $ = (s) => document.querySelector(s);

  const el = {
    telas: document.querySelectorAll("[data-screen]"),
    intro: $("[data-intro]"),
    regras: $("[data-regras]"),
    formNome: $("[data-form-nome]"),
    inputNome: $('[name="nome"]'),
    erroNome: $("[data-erro-nome]"),
    parede: $("[data-wall]"),
    paredeRes: $("[data-wall-result]"),
    previewNome: $("[data-preview-nome]"),
    carimbo: $("[data-carimbo]"),
    contador: $("[data-contador]"),
    formPergunta: $("[data-form-pergunta]"),
    pergunta: $("[data-pergunta]"),
    opcoes: $("[data-opcoes]"),
    erroResposta: $("[data-erro-resposta]"),
    voltar: $("[data-voltar]"),
    proxima: $("[data-proxima]"),
    score: $("[data-score]"),
    scorePct: $("[data-score-pct]"),
    scoreAcertos: $("[data-score-acertos]"),
    resTitulo: $("[data-resultado-titulo]"),
    resTexto: $("[data-resultado-texto]"),
    baixar: $("[data-baixar]"),
    refazer: $("[data-refazer]"),
    revisao: $("[data-revisao]"),
    revisaoLista: $("[data-revisao-lista]"),
  };

  const estado = { nome: "", questoes: [], respostas: [], atual: 0, acertos: 0, tentativa: 0, codigo: "" };

  /* ---------- Utilitários ---------- */
  // Fisher–Yates: embaralhamento sem viés
  function embaralhar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function formatarNome(nome) {
    const minusculas = ["da", "de", "do", "das", "dos", "e"];
    return nome
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .split(" ")
      .map((p, i) => (i > 0 && minusculas.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
      .join(" ");
  }

  const ico = (n, c) => (window.ICON ? window.ICON(n, c) : "");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Parede de tijolos: 1 tijolo por pergunta (estado: vazio, assentado, certo, errado) */
  function desenharParede(alvo, estados) {
    if (!alvo) return;
    alvo.style.setProperty("--cols", Math.min(5, TOTAL));
    alvo.innerHTML = estados.map((st, i) =>
      `<span class="tijolo${st ? " is-" + st : ""}" style="--i:${i}"></span>`).join("");
  }

  function mostrar(tela) {
    el.telas.forEach((t) => (t.hidden = t.dataset.screen !== tela));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Tela inicial ---------- */
  function montarInicio() {
    el.intro.innerHTML = `${TOTAL} perguntas sobre o curso. Acerte pelo menos <strong>${MINIMO}</strong> (${Math.round((CFG.aprovacao || 0.65) * 100)}%) e baixe seu certificado na hora.`;
    el.regras.innerHTML = [
      `${TOTAL} perguntas de múltipla escolha`,
      `Aprovação com ${MINIMO} acertos ou mais`,
      "Pode refazer quantas vezes quiser",
      "Perguntas e alternativas mudam de ordem a cada tentativa",
    ].map((t) => `<li>${t}</li>`).join("");
    desenharParede($("[data-wall-intro]"), new Array(TOTAL).fill("assentado"));
  }

  // prévia do certificado atualiza enquanto digita
  el.inputNome.addEventListener("input", () => {
    const n = formatarNome(el.inputNome.value);
    if (el.previewNome) el.previewNome.textContent = n || "Seu Nome Aqui";
    if (el.inputNome.getAttribute("aria-invalid") === "true" && n.split(" ").filter((p) => p.length >= 2).length >= 2) {
      el.inputNome.setAttribute("aria-invalid", "false");
      el.erroNome.hidden = true;
    }
  });

  el.formNome.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = formatarNome(el.inputNome.value);
    const valido = nome.split(" ").filter((p) => p.length >= 2).length >= 2;
    el.erroNome.hidden = valido;
    el.inputNome.setAttribute("aria-invalid", String(!valido));
    if (!valido) { el.inputNome.focus(); return; }
    estado.nome = nome;
    iniciarProva();
  });

  /* ---------- Prova ---------- */
  function iniciarProva() {
    estado.tentativa++;
    // sorteia e embaralha as perguntas; depois embaralha as alternativas de cada uma
    estado.questoes = embaralhar(BANCO).slice(0, TOTAL).map((q) => {
      const alts = q.alternativas.map((texto, i) => ({ texto, correta: i === 0 }));
      return { pergunta: q.pergunta, alternativas: embaralhar(alts) };
    });
    estado.respostas = new Array(TOTAL).fill(null);
    estado.atual = 0;
    mostrar("prova");
    renderPergunta();
  }

  function renderPergunta() {
    const i = estado.atual;
    const q = estado.questoes[i];

    el.contador.textContent = `Pergunta ${i + 1} de ${TOTAL}`;
    desenharParede(el.parede, estado.respostas.map((r, k) => (r !== null ? "assentado" : k === i ? "atual" : "")));
    // animação de entrada da pergunta
    el.formPergunta.classList.remove("q-in");
    void el.formPergunta.offsetWidth;
    el.formPergunta.classList.add("q-in");
    el.pergunta.textContent = q.pergunta;
    el.opcoes.innerHTML = q.alternativas
      .map((a, j) => `
        <label class="option">
          <input type="radio" name="resposta" value="${j}" ${estado.respostas[i] === j ? "checked" : ""}>
          <span class="option__letter" aria-hidden="true">${LETRAS[j]}</span>
          <span>${esc(a.texto)}</span>
        </label>`)
      .join("");

    el.erroResposta.hidden = true;
    el.voltar.disabled = i === 0;
    el.proxima.textContent = i === TOTAL - 1 ? "Finalizar prova" : "Próxima";
    el.opcoes.setAttribute("aria-describedby", "atalhos");
  }

  el.formPergunta.addEventListener("submit", (e) => {
    e.preventDefault();
    const marcada = el.opcoes.querySelector("input:checked");
    if (!marcada) { el.erroResposta.hidden = false; return; }
    estado.respostas[estado.atual] = Number(marcada.value);

    if (estado.atual < TOTAL - 1) {
      estado.atual++;
      renderPergunta();
      el.pergunta.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
      finalizar();
    }
  });

  el.opcoes.addEventListener("change", () => (el.erroResposta.hidden = true));

  // atalhos de teclado: A–D ou 1–4 escolhem a alternativa
  document.addEventListener("keydown", (e) => {
    if ($('[data-screen="prova"]').hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toUpperCase();
    let idx = LETRAS.indexOf(k);
    if (idx < 0 && /^[1-9]$/.test(k)) idx = Number(k) - 1;
    const radios = el.opcoes.querySelectorAll("input");
    if (idx >= 0 && idx < radios.length) {
      radios[idx].checked = true;
      radios[idx].focus();
      el.erroResposta.hidden = true;
    }
  });

  el.voltar.addEventListener("click", () => {
    const marcada = el.opcoes.querySelector("input:checked");
    if (marcada) estado.respostas[estado.atual] = Number(marcada.value);
    if (estado.atual > 0) { estado.atual--; renderPergunta(); }
  });

  /* ---------- Resultado ---------- */
  function finalizar() {
    const erradas = [];
    estado.acertos = estado.questoes.reduce((soma, q, i) => {
      const certo = q.alternativas[estado.respostas[i]]?.correta === true;
      if (!certo) erradas.push(q.pergunta);
      q.certo = certo;
      return soma + (certo ? 1 : 0);
    }, 0);

    const pct = Math.round((estado.acertos / TOTAL) * 100);
    const aprovado = estado.acertos >= MINIMO;

    desenharParede(el.paredeRes, estado.questoes.map((q) => (q.certo ? "certo" : "errado")));
    if (el.carimbo) {
      el.carimbo.hidden = !aprovado;
      el.carimbo.classList.remove("is-on");
      void el.carimbo.offsetWidth;
      if (aprovado) el.carimbo.classList.add("is-on");
    }
    el.scorePct.textContent = `${pct}%`;
    el.scoreAcertos.textContent = `${estado.acertos} de ${TOTAL}`;
    el.score.classList.toggle("is-fail", !aprovado);

    if (aprovado) {
      estado.codigo = gerarCodigo();
      el.resTitulo.textContent = "Aprovado!";
      el.resTexto.innerHTML = `Parabéns, <strong>${esc(estado.nome)}</strong>! Você acertou ${estado.acertos} de ${TOTAL} perguntas. Seu certificado já está pronto.`;
    } else {
      el.resTitulo.textContent = "Quase lá";
      el.resTexto.innerHTML = `Você acertou ${estado.acertos} de ${TOTAL}. Precisa de pelo menos <strong>${MINIMO}</strong>. Revise os assuntos abaixo e tente de novo — as perguntas vão mudar de ordem.`;
    }

    el.baixar.hidden = !aprovado;
    el.refazer.innerHTML = ico("refresh") + (aprovado ? " Fazer a prova de novo" : " Tentar de novo");
    el.refazer.className = aprovado ? "btn btn--ghost" : "btn btn--primary btn--xl";

    el.revisao.hidden = aprovado || erradas.length === 0;
    el.revisaoLista.innerHTML = erradas.map((p) => `<li>${esc(p)}</li>`).join("");

    mostrar("resultado");
  }

  el.refazer.addEventListener("click", iniciarProva);
  el.baixar.addEventListener("click", gerarCertificado);

  function gerarCodigo() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let c = "";
    const rnd = (window.crypto && crypto.getRandomValues) ? crypto.getRandomValues(new Uint32Array(10)) : null;
    for (let i = 0; i < 10; i++) c += chars[(rnd ? rnd[i] : Math.floor(Math.random() * 1e9)) % chars.length];
    return `DP-${c.slice(0, 5)}-${c.slice(5)}`;
  }

  /* ---------- Certificado em PDF (jsPDF) ---------- */
  function gerarCertificado() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("Não foi possível gerar o PDF. Verifique se a pasta assets/vendor/jspdf está junto com a prova.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297, H = 210;

    const COR = {
      amarelo: [255, 194, 26],
      asfalto: [22, 19, 15],
      tijolo: [181, 72, 43],
      papel: [255, 253, 248],
      cinza: [110, 100, 89],
    };

    // fundo
    doc.setFillColor(...COR.papel);
    doc.rect(0, 0, W, H, "F");

    // faixas zebradas (topo e base), igual à landing
    function faixa(y, h) {
      doc.setFillColor(...COR.amarelo);
      doc.rect(0, y, W, h, "F");
      doc.setFillColor(...COR.asfalto);
      const passo = 12, larg = 6;
      for (let x = -h; x < W + h; x += passo) {
        doc.lines([[larg, 0], [h, h], [-larg, 0]], x, y, [1, 1], "F", true);
      }
    }
    faixa(0, 9);
    faixa(H - 9, 9);

    // moldura
    doc.setDrawColor(...COR.asfalto);
    doc.setLineWidth(0.8);
    doc.rect(14, 17, W - 28, H - 34);

    const centro = W / 2;

    // texto centralizado com espaçamento entre letras (o align do jsPDF ignora o charSpace)
    function espacado(texto, y, espaco) {
      doc.setCharSpace(espaco);
      const largura = doc.getTextWidth(texto) + espaco * (texto.length - 1);
      doc.text(texto, centro - largura / 2, y);
      doc.setCharSpace(0);
    }

    // marca
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COR.tijolo);
    espacado(String(CFG.curso || "Diária Própria").toUpperCase(), 34, 1.5);

    // título
    doc.setTextColor(...COR.asfalto);
    doc.setFontSize(40);
    espacado("CERTIFICADO", 54, 0.5);
    doc.setFontSize(14);
    espacado("DE CONCLUSÃO", 64, 3);

    // barra amarela decorativa
    doc.setFillColor(...COR.amarelo);
    doc.rect(centro - 20, 70, 40, 2.2, "F");

    // nome
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(...COR.cinza);
    doc.text("Certificamos que", centro, 86, { align: "center" });

    doc.setFont("helvetica", "bold");
    let tam = 32;
    doc.setFontSize(tam);
    while (doc.getTextWidth(estado.nome) > W - 70 && tam > 16) doc.setFontSize(--tam);
    doc.setTextColor(...COR.asfalto);
    doc.text(estado.nome, centro, 102, { align: "center" });
    doc.setDrawColor(...COR.amarelo);
    doc.setLineWidth(1.2);
    doc.line(centro - 90, 107, centro + 90, 107);

    // texto
    const pct = Math.round((estado.acertos / TOTAL) * 100);
    const corpo =
      `concluiu o curso livre ${CFG.curso || "Diária Própria"} — ${CFG.subtituloCurso || "Do alicerce ao reboco"}, ` +
      `com aprovação na prova final e aproveitamento de ${pct}% (${estado.acertos} de ${TOTAL} acertos).`;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12.5);
    doc.setTextColor(...COR.asfalto);
    doc.text(doc.splitTextToSize(corpo, 200), centro, 120, { align: "center", lineHeightFactor: 1.5 });

    doc.setFontSize(10);
    doc.setTextColor(...COR.cinza);
    doc.text(
      "Conteúdo: profissão, ferramentas, materiais, leitura de projetos, canteiro de obras, segurança (EPI),",
      centro, 140, { align: "center" }
    );
    doc.text("fundações, alvenaria, revestimentos e contrapiso.", centro, 145, { align: "center" });

    // rodapé: data, assinatura e código
    const data = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const yBase = 172;
    doc.setDrawColor(...COR.asfalto);
    doc.setLineWidth(0.4);
    doc.line(40, yBase, 110, yBase);
    doc.line(W - 110, yBase, W - 40, yBase);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...COR.asfalto);
    doc.text(data, 75, yBase - 3, { align: "center" });
    doc.text(CFG.curso || "Diária Própria", W - 75, yBase - 3, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...COR.cinza);
    doc.text("DATA DE EMISSÃO", 75, yBase + 5, { align: "center" });
    doc.text("COORDENAÇÃO DO CURSO", W - 75, yBase + 5, { align: "center" });

    // selo central
    doc.setFillColor(...COR.amarelo);
    doc.circle(centro, yBase - 2, 13, "F");
    doc.setDrawColor(...COR.asfalto);
    doc.setLineWidth(0.6);
    doc.circle(centro, yBase - 2, 11);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COR.asfalto);
    doc.text(`${pct}%`, centro, yBase, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(...COR.cinza);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Código do certificado: ${estado.codigo} · Curso livre, sem regulamentação do MEC.`,
      centro, H - 20, { align: "center" }
    );

    const arquivo = "Certificado - " + estado.nome.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s-]/g, "") + ".pdf";
    doc.save(arquivo);
  }

  /* ---------- Início ---------- */
  const linkSite = $("[data-link-site]");
  if (linkSite && CFG.linkSite) linkSite.href = CFG.linkSite;

  const ano = $("[data-year]");
  if (ano) ano.textContent = new Date().getFullYear();

  if (!BANCO.length) {
    el.intro.textContent = "Nenhuma pergunta encontrada. Verifique o arquivo content/perguntas.js.";
    el.formNome.hidden = true;
    return;
  }
  if (window.hydrateIcons) window.hydrateIcons();
  montarInicio();
})();
