// app/layout.tsx
export const metadata = {
  title: 'Você Julgaria?',
  description: 'Desabafos e julgamentos morais anônimos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  );
}
