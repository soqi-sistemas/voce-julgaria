'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function VoceJulgaria() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [votedCases, setVotedCases] = useState([]);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('votedCases');
    if (stored) setVotedCases(JSON.parse(stored));
    fetchCases();
    loginAnon();
  }, []);

  async function loginAnon() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      await supabase.auth.signInAnonymously();
    }
  }

  async function fetchCases() {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setCases(data);
  }

  async function vote(caseId, field) {
    if (votedCases.includes(caseId)) {
      setAlert('Você já votou neste caso.');
      return;
    }
    setAlert('');
    await supabase.rpc('increment_vote', { case_id: caseId, field_name: field });
    const updated = [...votedCases, caseId];
    localStorage.setItem('votedCases', JSON.stringify(updated));
    setVotedCases(updated);
    fetchCases();
  }

  return (
    <main className="bg-black text-white min-h-screen flex flex-col items-center p-6 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Você Julgaria?</h1>
        <p className="text-lg text-gray-400 italic">Casos reais. Julgamentos anônimos. E se fosse com você?</p>
      </div>

      {alert && (
        <div className="bg-red-700 text-white p-3 rounded-xl text-sm">{alert}</div>
      )}

      {!selectedCase && (
        <section className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">Casos Populares</h2>
          <ul className="space-y-4">
            {cases.map((c) => (
              <li
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className="bg-gray-900 p-4 rounded-xl hover:bg-gray-800 transition cursor-pointer"
              >
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-400">{c.content.substring(0, 90)}...</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {selectedCase && (
        <section className="w-full max-w-xl bg-gray-900 p-6 rounded-2xl space-y-4">
          <button onClick={() => setSelectedCase(null)} className="text-sm text-gray-400 hover:underline">
            ← Voltar
          </button>
          <h2 className="text-2xl font-bold">{selectedCase.title}</h2>
          <p className="text-gray-300">{selectedCase.content}</p>

          <div className="space-y-4 pt-4">
            <div>
              <p className="text-gray-400">Ele/ela estava errado(a)?</p>
              <div className="flex space-x-4 pt-1">
                <button onClick={() => vote(selectedCase.id, 'votes_wrong_yes')} className="flex-1 bg-white text-black py-2 rounded-xl hover:bg-gray-200">Sim</button>
                <button onClick={() => vote(selectedCase.id, 'votes_wrong_no')} className="flex-1 bg-white text-black py-2 rounded-xl hover:bg-gray-200">Não</button>
              </div>
            </div>

            <div>
              <p className="text-gray-400">Você teria feito o mesmo?</p>
              <div className="flex space-x-4 pt-1">
                <button onClick={() => vote(selectedCase.id, 'votes_same_yes')} className="flex-1 bg-white text-black py-2 rounded-xl hover:bg-gray-200">Sim</button>
                <button onClick={() => vote(selectedCase.id, 'votes_same_no')} className="flex-1 bg-white text-black py-2 rounded-xl hover:bg-gray-200">Não</button>
              </div>
            </div>
          </div>

          <div className="pt-6 text-sm text-gray-500 italic">
            Resultado parcial:<br />
            Errado? {selectedCase.votes_wrong_yes} Sim / {selectedCase.votes_wrong_no} Não<br />
            Você faria igual? {selectedCase.votes_same_yes} Sim / {selectedCase.votes_same_no} Não
          </div>
        </section>
      )}

      <footer className="text-sm text-gray-600 pt-10">feito por alguém que nunca será julgado...</footer>
    </main>
  );
}