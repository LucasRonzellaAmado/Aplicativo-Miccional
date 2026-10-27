// Relatório de 3 dias do diário, aberto numa nova aba pronto para "Salvar como PDF"

const diaLocal = (valor) => {
  const d = new Date(valor);
  return isNaN(d) ? '' : d.toLocaleDateString('en-CA');
};

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// A planilha pode devolver booleanos como texto ("TRUE", "sim"...)
const simNao = (v) => {
  if (v === '' || v === null || v === undefined) return '—';
  const s = String(v).toLowerCase();
  return s === 'true' || s === 'sim' ? 'Sim' : s === 'false' || s === 'nao' || s === 'não' ? 'Não' : esc(v);
};

const hora = (ts) =>
  new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const dataBR = (dia) => new Date(`${dia}T00:00:00`).toLocaleDateString('pt-BR');

const perda = (r) => (simNao(r.teve_perda) === 'Sim' ? `Sim (${esc(r.tamanho_perda) || '—'})` : simNao(r.teve_perda));

const tabela = (colunas, linhas) =>
  linhas.length === 0
    ? '<p class="vazio">Nenhum registro</p>'
    : `<table><thead><tr>${colunas.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
       <tbody>${linhas.map((l) => `<tr>${l.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const ordenar = (lista) => [...lista].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// Os 3 dias que terminam na data final (AAAA-MM-DD)
export const tresDias = (dataFinal) =>
  [2, 1, 0].map((n) => {
    const d = new Date(`${dataFinal}T00:00:00`);
    d.setDate(d.getDate() - n);
    return d.toLocaleDateString('en-CA');
  });

const duracao = (dormir, acordar) => {
  const min = Math.round((new Date(acordar) - new Date(dormir)) / 60000);
  return min > 0 ? `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}` : '—';
};

export function montarRelatorio({ nome, dias, micData, hydData, noctData, sonoData = [] }) {
  const doDia = (lista, dia) => ordenar(lista.filter((r) => diaLocal(r.timestamp) === dia));

  const secoesDias = dias
    .map((dia, i) => {
      const mic = doDia(micData, dia);
      const hyd = doDia(hydData, dia);
      const noct = doDia(noctData, dia);
      const totalLiq = hyd.reduce((s, h) => s + Number(h.volume || 0), 0);
      const totalUrina = [...mic, ...noct].reduce((s, r) => s + Number(r.volume || 0), 0);
      const perdas = [...mic, ...noct].filter((r) => simNao(r.teve_perda) === 'Sim').length;

      return `
      <section class="dia">
        <h2>Dia ${i + 1} — ${dataBR(dia)}</h2>
        <div class="stats">
          <div class="stat"><span>${mic.length}</span>Micções</div>
          <div class="stat"><span>${totalUrina} mL</span>Volume urinado</div>
          <div class="stat"><span>${totalLiq} mL</span>Líquidos</div>
          <div class="stat"><span>${noct.length}</span>Durante o sono</div>
          <div class="stat"><span>${perdas}</span>Perdas</div>
        </div>

        <h3>Micções</h3>
        ${tabela(
          ['Hora', 'Volume', 'Urgência', 'Perda', 'Esforço', 'Esvaziou', 'Gotejamento', 'Notas'],
          mic.map((r) => [
            hora(r.timestamp),
            r.volume ? `${esc(r.volume)} mL` : '—',
            simNao(r.urgencia),
            perda(r),
            simNao(r.esforco),
            simNao(r.esvaziou_completo),
            simNao(r.gotinhas_pos),
            esc(r.notas),
          ])
        )}

        <h3>Hidratação</h3>
        ${tabela(
          ['Hora', 'Bebida', 'Volume', 'Notas'],
          hyd.map((r) => [hora(r.timestamp), esc(r.tipo), `${esc(r.volume)} mL`, esc(r.notas)])
        )}

        <h3>Durante o sono</h3>
        ${tabela(
          ['Foi dormir', 'Acordou', 'Duração', 'Notas'],
          sonoData
            .filter((s) => diaLocal(s.hora_acordar) === dia)
            .map((s) => [
              `${dataBR(diaLocal(s.hora_dormir))} ${hora(s.hora_dormir)}`,
              hora(s.hora_acordar),
              duracao(s.hora_dormir, s.hora_acordar),
              esc(s.notas),
            ])
        )}
        ${tabela(
          ['Hora', 'Volume', 'Perda', 'Notas'],
          noct.map((r) => [hora(r.timestamp), r.volume ? `${esc(r.volume)} mL` : '—', perda(r), esc(r.notas)])
        )}
      </section>`;
    })
    .join('');

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Diário Miccional - ${esc(nome)} - ${dataBR(dias[0])} a ${dataBR(dias[2])}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; margin: 0; padding: 24px; background: #fff; }
  header { background: linear-gradient(135deg, #E85D75, #F48FA3); color: #fff; padding: 20px 24px; border-radius: 14px; }
  header .logo { height: 46px; display: block; margin-bottom: 12px; }
  header h1 { margin: 0 0 6px; font-size: 22px; }
  header p { margin: 2px 0; font-size: 13px; opacity: .95; }
  .dia { margin-top: 22px; break-inside: avoid-page; }
  .dia + .dia { break-before: page; }
  h2 { color: #E85D75; font-size: 17px; border-bottom: 2px solid #FFE4EA; padding-bottom: 6px; }
  h3 { color: #E85D75; font-size: 14px; margin: 18px 0 8px; }
  .stats { display: flex; gap: 10px; }
  .stat { flex: 1; background: #FFF0F3; border-radius: 10px; padding: 10px; text-align: center; font-size: 11px; color: #777; }
  .stat span { display: block; font-size: 18px; font-weight: 700; color: #E85D75; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #FFE4EA; color: #C2405A; text-align: left; padding: 6px; }
  td { padding: 6px; border-bottom: 1px solid #F5D5DC; vertical-align: top; }
  tr:nth-child(even) td { background: #FFF8FA; }
  .vazio { color: #999; font-size: 12px; font-style: italic; }
  footer { margin-top: 24px; font-size: 10px; color: #999; text-align: center; }
  .acoes { text-align: center; margin: 16px 0; }
  .acoes button { background: #E85D75; color: #fff; border: 0; border-radius: 8px; padding: 10px 22px; font-size: 14px; cursor: pointer; }
  @media print { .acoes { display: none; } body { padding: 0; } }
</style></head>
<body>
  <div class="acoes"><button onclick="window.print()">Salvar como PDF</button></div>
  <header>
    <img class="logo" src="${window.location.origin}/fam-logo-branco.png" alt="FAM - Faculdade de Americana">
    <h1>Diário Miccional — Relatório de 3 dias</h1>
    <p><strong>Paciente:</strong> ${esc(nome) || '—'}</p>
    <p><strong>Período:</strong> ${dataBR(dias[0])} a ${dataBR(dias[2])}</p>
    <p><strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
  </header>
  ${secoesDias}
  <footer>Registros preenchidos pela paciente. O diário não realiza diagnóstico e não substitui a avaliação de um profissional de saúde.</footer>
  <script>window.onload = () => setTimeout(() => window.print(), 500);</script>
</body></html>`;
}
