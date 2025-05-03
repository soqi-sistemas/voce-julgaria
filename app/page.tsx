// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase.from('cases').select('*').order('created_at', { ascending: false })
      if (!error) setCases(data || [])
    }
    fetchCases()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Você julgaria?</h1>
        
        {cases.map((c) => (
          <div key={c.id} className="bg-zinc-900 p-4 rounded-2xl shadow-lg mb-4">
            <p className="text-base md:text-lg mb-3 leading-relaxed whitespace-pre-wrap">{c.text}</p>
            <div className="text-sm text-zinc-400 text-right">Postado em {new Date(c.created_at).toLocaleDateString('pt-BR')}</div>
          </div>
        ))}
        
        {cases.length === 0 && (
          <div className="text-zinc-400 text-center mt-10">Nenhum caso ainda. Seja o primeiro a postar!</div>
        )}
      </div>
    </main>
  )
}
