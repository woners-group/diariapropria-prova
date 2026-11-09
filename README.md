# Diária Própria — Prova final

Projeto independente da landing. Prova de 15 perguntas sorteadas e embaralhadas;
com 65% de acertos o aluno baixa o certificado em PDF com o nome dele.
HTML, CSS e JavaScript puro: abra `index.html` ou publique a pasta inteira.

## Estrutura

```
prova/
├── index.html                  # Telas: nome → perguntas → resultado/certificado
├── favicon.ico
├── site.webmanifest            # Ícone/nome ao "Adicionar à tela inicial"
├── robots.txt                  # Não indexar (prova é só para alunos)
│
├── content/
│   ├── acesso.js               # ✏️ Login da prova (usuário/senha em hash)
│   └── perguntas.js            # ✏️ Perguntas, quantidade, % de aprovação, link da landing
│
├── ferramentas/
│   └── gerar-acesso.html       # Gera o hash de um novo usuário/senha (NÃO publicar)
│
└── assets/
    ├── css/
    │   ├── base.css            # Design system (cópia do da landing)
    │   ├── components.css      # Ícones e animações (cópia do da landing)
    │   └── prova.css           # Estilos da prova (parede de tijolos, certificado…)
    ├── js/
    │   ├── icons.js            # Ícones SVG (cópia do da landing)
    │   ├── sha256.js           # Hash da senha (funciona sem https)
    │   ├── acesso.js           # Tela de login
    │   └── prova.js            # Lógica, embaralhamento e PDF do certificado
    ├── img/favicon/
    └── vendor/jspdf/           # Biblioteca de PDF (MIT) — não editar
```

## Como editar

- **Login:** os dados de acesso não ficam escritos em nenhum arquivo. Para trocar, abra
  `ferramentas/gerar-acesso.html`, gere o código e cole em `hash` no `content/acesso.js`.
  Para desligar o login: `ativo: false`.

- **Perguntas:** `content/perguntas.js`. A **primeira alternativa é sempre a correta**
  (a ordem é embaralhada na tela). Pode ter mais perguntas que a `quantidade`: cada
  tentativa sorteia.
- **Aprovação:** `aprovacao: 0.65` (65%).
- **Link da logo:** `linkSite` — troque pela URL da landing quando publicar.
- **Visual:** `base.css` e `components.css` são cópias dos arquivos da landing
  (`../site/assets/css`). Mudou lá? Copie para cá.

## Publicação

- Publique **sem** a pasta `ferramentas/` (já está no `.gitignore`).
- Publique em um endereço separado (ex.: `prova.seudominio.com.br`) e envie o link
  só para quem comprou o plano Completo.
- Tudo roda no navegador do aluno, sem servidor: quem souber abrir o código
  consegue ver as respostas. Para validar certificados de verdade, seria preciso um back-end.
