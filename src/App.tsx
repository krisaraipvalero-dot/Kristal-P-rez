import React from 'react';
import { EnzymeGame } from './components/EnzymeGame';
import { Activity, Beaker, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#262626] p-6 flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400/10 rounded-lg">
            <Activity className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-mono font-bold tracking-tighter uppercase">Enzima-Man</h1>
            <p className="text-[10px] font-mono text-[#666] uppercase tracking-[0.2em]">Simulador de Rutas Metabólicas v1.0</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest text-[#888]">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-orange-500" />
            <span>ATP: Optimizado</span>
          </div>
          <div className="flex items-center gap-2">
            <Beaker className="w-3 h-3 text-cyan-400" />
            <span>Sustratos: Activos</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter mb-4 italic">
              METABOLISMO <span className="text-yellow-400">ACTIVO</span>
            </h2>
            <p className="max-w-xl mx-auto text-sm text-[#888] leading-relaxed">
              Controla la enzima para procesar sustratos. Los procesos catabólicos liberan energía aumentando tu velocidad, 
              mientras que los anabólicos sintetizan nuevas estructuras aumentando tu tamaño.
            </p>
          </div>

          <EnzymeGame />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626] p-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[#444]">
          <div>© 2026 Laboratorio de Bioquímica Digital</div>
          <div className="flex gap-6">
            <span>Protocolo: 0x4421</span>
            <span>Seguridad: Nivel 4</span>
            <span>Estado: Estable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
