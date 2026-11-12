import { useState } from 'react';
import confetti from 'canvas-confetti';
import Wheel from './components/Wheel';
import OptionManager from './components/OptionManager';
import WinnerModal from './components/WinnerModal';
import './App.css';

const DEFAULT_OPTIONS = [
  { id: '1', text: 'Lahmacun & Ayran', color: '#EF4444' },
  { id: '2', text: 'Smash Burger', color: '#F59E0B' },
  { id: '3', text: 'Ev Yemeği (Sağlıklı)', color: '#10B981' },
  { id: '4', text: 'Bol Malzemos Pizza', color: '#3B82F6' },
  { id: '5', text: 'Çiğ Köfte Dürüm', color: '#8B5CF6' },
  { id: '6', text: 'Sadece Kahve İç', color: '#EC4899' },
];

const PALETTE = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  '#06B6D4', '#6366F1', '#84CC16', '#E11D48'
];

export default function App() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const addOption = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextColor = PALETTE[options.length % PALETTE.length];
    const newOption = {
      id: crypto.randomUUID(),
      text: trimmed,
      color: nextColor,
    };

    setOptions((prev) => [...prev, newOption]);
  };

  const removeOption = (id) => {
    if (isSpinning) return;
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  const resetOptions = () => {
    if (isSpinning) return;
    setOptions(DEFAULT_OPTIONS);
    setWinner(null);
  };

  const triggerConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: PALETTE,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: PALETTE,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSpin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    const sliceAngle = 360 / options.length;
    const winningIndex = Math.floor(Math.random() * options.length);

    // Kazanan dilimin merkez açısı (Saat yönünde 0 dereceden itibaren)
    const sliceCenterAngle = winningIndex * sliceAngle + sliceAngle / 2;

    // İbre üstte (0 derece) durduğu için, dilim merkezini 360 dereceye tamamlayacak hedef açı
    const targetRemainder = (360 - sliceCenterAngle) % 360;

    // Mevcut rotasyonun mod 360 değerini hesaba katarak ileri doğru tam tur ekleme
    const currentMod = ((rotation % 360) + 360) % 360;
    let deltaAngle = targetRemainder - currentMod;
    if (deltaAngle < 0) deltaAngle += 360;

    // Dilim içinde doğal duruş hissi için küçük rastgele sapma (±%35 dilim genişliği)
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.7);
    const fullSpins = 360 * 6; // En az 6 tam tur
    const nextRotation = rotation + fullSpins + deltaAngle + jitter;

    setRotation(nextRotation);

    // CSS transition süresiyle (4500ms) senkronize bitiş
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(options[winningIndex]);
      triggerConfetti();
    }, 4500);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="badge">KARARSIZLIĞA SON</div>
        <h1>Gereksiz Karar Çarkı</h1>
        <p>Hayati önemi olmayan kararlarını şansa bırak, kafanı yorma.</p>
      </header>

      <main className="main-grid">
        <section className="wheel-section">
          <Wheel
            options={options}
            rotation={rotation}
            isSpinning={isSpinning}
            onSpin={handleSpin}
          />
        </section>

        <section className="controls-section">
          <OptionManager
            options={options}
            onAdd={addOption}
            onRemove={removeOption}
            onReset={resetOptions}
            disabled={isSpinning}
          />
        </section>
      </main>

      <WinnerModal
        winner={winner}
        onClose={() => setWinner(null)}
        onSpinAgain={handleSpin}
      />
    </div>
  );
}
