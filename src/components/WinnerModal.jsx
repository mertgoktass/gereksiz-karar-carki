import './WinnerModal.css';

export default function WinnerModal({ winner, onClose, onSpinAgain }) {
  if (!winner) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div
          className="winner-glow"
          style={{ backgroundColor: winner.color }}
        />
        <span className="modal-subtitle">KADERİN SEÇİMİ</span>
        <h2 className="winner-title">{winner.text}</h2>
        <p className="modal-desc">
          Tartışma bitmiştir. Çark hükmünü verdi, artık geri dönüş yok.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn secondary"
            onClick={() => {
              onClose();
              onSpinAgain();
            }}
          >
            Tekrar Çevir
          </button>
          <button
            type="button"
            className="modal-btn primary"
            onClick={onClose}
            style={{ backgroundColor: winner.color }}
          >
            Kabul Ediyorum
          </button>
        </div>
      </div>
    </div>
  );
}
