
const fs = require("fs");
const path = require("path");

const PASTA_BACKEND = __dirname;
const ARQUIVO_SAIDA = path.join(
  PASTA_BACKEND,
  "backend_completo.txt"
);

const IGNORAR_PASTAS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  "coverage"
]);

const IGNORAR_ARQUIVOS = new Set([
  "backend_completo.txt",
  "ler-backend.js"
]);

const EXTENSOES_TEXTO = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".jsonc",
  ".env",
  ".sql",
  ".md",
  ".txt",
  ".yml",
  ".yaml",
  ".xml",
  ".html",
  ".css",
  ".scss",
  ".prisma",
  ".sh",
  ".bat",
  ".py",
  ".java",
  ".properties",
  ".gitignore",
  ".dockerignore"
]);

function ehArquivoDeTexto(nome) {
  return (
    EXTENSOES_TEXTO.has(path.extname(nome).toLowerCase()) ||
    nome === ".env" ||
    nome.startsWith(".env.") ||
    nome === ".gitignore" ||
    nome === ".dockerignore"
  );
}

function lerPasta(pasta, resultados = []) {
  const itens = fs.readdirSync(pasta, {
    withFileTypes: true
  });

  for (const item of itens) {
    const caminho = path.join(pasta, item.name);

    if (item.isDirectory()) {
      if (IGNORAR_PASTAS.has(item.name)) continue;
      lerPasta(caminho, resultados);
      continue;
    }

    if (!item.isFile()) continue;
    if (IGNORAR_ARQUIVOS.has(item.name)) continue;
    if (!ehArquivoDeTexto(item.name)) continue;

    try {
      const conteudo = fs.readFileSync(caminho, "utf8");

      resultados.push(
        `\n${"=".repeat(80)}\n` +
        `ARQUIVO: ${path.relative(PASTA_BACKEND, caminho)}\n` +
        `${"=".repeat(80)}\n\n` +
        conteudo +
        "\n"
      );

      console.log(`Lido: ${path.relative(PASTA_BACKEND, caminho)}`);
    } catch (erro) {
      console.error(`Erro ao ler ${caminho}:`, erro.message);
    }
  }

  return resultados;
}

try {
  const arquivos = lerPasta(PASTA_BACKEND);

  fs.writeFileSync(
    ARQUIVO_SAIDA,
    arquivos.join("\n"),
    "utf8"
  );

  console.log("\nLeitura concluída!");
  console.log(`Arquivos encontrados: ${arquivos.length}`);
  console.log(`Resultado salvo em: ${ARQUIVO_SAIDA}`);
} catch (erro) {
  console.error("Erro ao processar o backend:", erro.message);
}