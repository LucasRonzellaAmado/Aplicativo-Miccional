// Logo da FAM nas cores do painel: "rosa" para fundos claros, "branco" para o cabeçalho rosa
export default function LogoFam({ cor = 'rosa', altura = 40, style, className }) {
  return (
    <img
      className={className}
      src={cor === 'branco' ? '/fam-logo-branco.png' : '/fam-logo.png'}
      alt="FAM - Faculdade de Americana"
      style={{ height: `${altura}px`, width: 'auto', display: 'block', ...style }}
    />
  );
}
