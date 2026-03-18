'use client';

const letters = 'Generating'.split('');

export function GeneratingIndicator() {
  return (
    <div className="flex items-center justify-center gap-px mb-6">
      {letters.map((letter, idx) => (
        <span
          key={idx}
          className="inline-block opacity-0 animate-[letterAnim_4s_linear_infinite] text-sm font-medium text-white"
          style={{ animationDelay: `${0.1 + idx * 0.105}s` }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
