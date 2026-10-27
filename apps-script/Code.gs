// Apps Script da planilha do Diário Miccional.
// Copie este arquivo para o editor do Apps Script (Extensões → Apps Script) e publique
// uma nova versão da implantação. O server.js chama este script com { action, table, data, secret }.

function getSheet(table) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table);
}

// Cria a aba quando ela ainda não existe, usando os campos do registro como cabeçalho
function getOrCreateSheet(table, data) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = planilha.getSheetByName(table);
  if (!sheet) {
    sheet = planilha.insertSheet(table);
    sheet.appendRow(Object.keys(data));
  }
  return sheet;
}

// Acrescenta no cabeçalho as colunas novas que o registro trouxer
function garantirColunas(sheet, data) {
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0]
    .filter((h) => h !== '');
  const novas = Object.keys(data).filter((k) => headers.indexOf(k) === -1);
  if (novas.length) {
    sheet.getRange(1, headers.length + 1, 1, novas.length).setValues([novas]);
  }
  return headers.concat(novas);
}

function readRows(table) {
  const sheet = getSheet(table);
  if (!sheet) return []; // aba ainda não criada: nenhum registro

  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values
    .filter((r) => r[0] !== '')
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const secret = PropertiesService.getScriptProperties().getProperty('API_SECRET');
  const body = JSON.parse(e.postData.contents);

  if (body.secret !== secret) {
    return json({ erro: 'não autorizado' });
  }

  if (!body.table) {
    return json({ erro: 'tabela não informada' });
  }

  if (body.action === 'insert') {
    const sheet = getOrCreateSheet(body.table, body.data);
    const headers = garantirColunas(sheet, body.data);
    sheet.appendRow(headers.map((h) => (body.data[h] !== undefined ? body.data[h] : '')));
    return json({ ok: true });
  }

  if (body.action === 'list') {
    return json(readRows(body.table));
  }

  return json({ erro: 'ação inválida' });
}
