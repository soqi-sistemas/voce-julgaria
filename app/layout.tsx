import './globals.css'

export const metadata = {
  title: 'Você Julgaria?',
  description: 'Desabafos e julgamentos morais anônimos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
