import { useState } from 'react';
import './OptionManager.css';

export default function OptionManager({
  options,
  onAdd,
  onRemove,
  onReset,
  disabled,
}) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;
    onAdd(inputValue);
    setInputValue('');
  };

  return (
    <div className="manager-card">
      <div className="manager-header">
        <div>
          <h2>Seçenekler ({options.length})</h2>
          <p>Çarka eklenecek ihtimalleri düzenle</p>
        </div>
        <button
          type="button"
          className="reset-btn"
          onClick={onReset}
          disabled={disabled}
          title="Varsayılan listeye dön"
        >
          Sıfırla
        </button>
      </div>

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Örn: İskender, Uyku, Kod Yaz..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          maxLength={32}
        />
        <button
          type="submit"
          className="add-btn"
          disabled={disabled || !inputValue.trim()}
        >
          Ekle
        </button>
      </form>

      {options.length < 2 && (
        <div className="warning-banner">
          Çarkı çevirebilmek için en az 2 seçenek bulunmalıdır.
        </div>
      )}

      <ul className="options-list">
        {options.map((opt) => (
          <li key={opt.id} className="option-item">
            <div className="option-info">
              <span
                className="color-dot"
                style={{ backgroundColor: opt.color }}
              />
              <span className="option-text">{opt.text}</span>
            </div>
            <button
              type="button"
              className="delete-btn"
              onClick={() => onRemove(opt.id)}
              disabled={disabled}
              aria-label={`${opt.text} seçeneğini sil`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
