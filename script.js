const SHEET_URL = "https://docs.google.com/spreadsheets/d/ID_DA_PLANILHA/export?format=csv&gid=1995482119";

async function buscarDados() {
  const res = await fetch(SHEET_URL);
  const csv = await res.text();

  const linhas = csv.split("\n").map(l => l.split(","));
  const header = linhas[0].map(h => h.trim());
  const dados = linhas.slice(1);

  return dados.map(linha => {
    let item = {};
    header.forEach((h, i) => item[h] = linha[i]);
    return item;
  });
}

function calcularPontuacao(dados) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  let pontuacao = {};

  dados.forEach(item => {

    const status = item.status;
    const tipo = item.TipoOS || "";
    const tecnico = item.name;
    const dataOS = new Date(item.schedule_date);

    if(!tecnico || status !== "Concluido") return;

    if(dataOS.getMonth() !== mesAtual || dataOS.getFullYear() !== anoAtual) return;

    let pontos = 2;

    if(
      tipo.includes("Instalação") ||
      tipo.includes("Migração") ||
      tipo.includes("Troca de Endereço")
    ){
      pontos = 3;
    }

    if(!pontuacao[tecnico]){
      pontuacao[tecnico] = 0;
    }

    pontuacao[tecnico] += pontos;

  });

  return Object.entries(pontuacao)
    .sort((a,b) => b[1] - a[1]);
}
