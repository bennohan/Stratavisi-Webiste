/**
 * Tailwind CSS Configuration
 * Kustomisasi tema font dan token warna Stratavisi
 */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'], /* ganti ke "Krona One" kalau mau SEMUA teks Krona */
        display: ['"Krona One"', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: 'var(--brand)',
        'brand-ink': 'var(--brand-ink)',
        accent: 'var(--accent)',
        'accent-ink': 'var(--accent-ink)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        paper: 'var(--paper)',
        soft: 'var(--soft)'
      }
    }
  }
};
