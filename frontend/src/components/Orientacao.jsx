// Recortes da imagem /ilustracoes.webp (1536x1024), um painel por página
const IMG_W = 1536;
const IMG_H = 1024;
const ILUSTRACOES = {
  completa: { x: 0, y: 0, w: IMG_W, h: IMG_H },
  calendario: { x: 32, y: 40, w: 473, h: 463 },
  micção: { x: 534, y: 40, w: 469, h: 463 },
  bebidas: { x: 1032, y: 40, w: 473, h: 463 },
  sono: { x: 32, y: 529, w: 721, h: 449 },
  consulta: { x: 782, y: 529, w: 723, h: 449 },
};

// `ilustracao` usa um recorte de /ilustracoes.webp; `imagem` aceita um arquivo próprio
export default function Orientacao({ titulo, children, ilustracao, imagem }) {
  const recorte = ILUSTRACOES[ilustracao];

  return (
    <div className="questions-section orientacao">
      <div className="orientacao-texto">
        {titulo && (
          <h4 style={{ marginTop: 0, marginBottom: '12px', color: '#E85D75' }}>{titulo}</h4>
        )}
        <div style={{ color: '#444', fontSize: '14px', lineHeight: 1.6 }}>{children}</div>
      </div>
      {imagem && <img src={imagem} alt="" className="orientacao-ilustracao" />}
      {recorte && (
        <div
          role="img"
          aria-hidden="true"
          className={`orientacao-ilustracao ${ilustracao === 'completa' ? 'completa' : ''}`}
          style={{
            aspectRatio: `${recorte.w} / ${recorte.h}`,
            backgroundSize: `${(IMG_W / recorte.w) * 100}% ${(IMG_H / recorte.h) * 100}%`,
            // Imagem inteira: posição 0 (evita divisão por zero)
            backgroundPosition:
              recorte.w === IMG_W
                ? '0 0'
                : `${(recorte.x / (IMG_W - recorte.w)) * 100}% ${
                    (recorte.y / (IMG_H - recorte.h)) * 100
                  }%`,
          }}
        />
      )}
    </div>
  );
}
