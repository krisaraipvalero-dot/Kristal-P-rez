import React, { useEffect, useRef, useState } from 'react';
import { Activity, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Substrate {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
}

interface Ghost {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  name: string;
}

const QUESTIONS_BY_MEMBER: Record<string, { q: string, a: string, options: string[] }[]> = {
  "Kristal P (Teoría Enzimática)": [
    { q: "¿Qué son las enzimas?", a: "Proteínas", options: ["Proteínas", "Lípidos", "Carbohidratos"] },
    { q: "¿Cómo se llama el lugar único donde encaja el sustrato?", a: "Sitio activo", options: ["Sitio pasivo", "Sitio activo", "Núcleo"] },
    { q: "¿La enzima desaparece después de la reacción?", a: "No", options: ["Sí", "No", "A veces"] },
    { q: "¿Cómo se llama el proceso que rompe moléculas complejas en simples?", a: "Catabolismo", options: ["Anabolismo", "Catabolismo", "Metabolismo"] },
    { q: "¿Cómo se llama el proceso que construye moléculas complejas?", a: "Anabolismo", options: ["Anabolismo", "Catabolismo", "Metabolismo"] },
    { q: "¿Las enzimas son generales o específicas?", a: "Altamente específicas", options: ["Generales", "Altamente específicas", "Aleatorias"] },
    { q: "¿A qué conjunto de procesos pertenecen las enzimas?", a: "Al metabolismo", options: ["Al metabolismo", "A la digestión", "Al crecimiento"] },
    { q: "¿Qué pasaría con nuestra comida sin enzimas?", a: "No podríamos obtener energía", options: ["No podríamos obtener energía", "Sabría mal", "No pasaría nada"] },
    { q: "¿Por qué se dice que son 'arquitectas de la vida'?", a: "Regeneran células y manejan energía", options: ["Construyen casas", "Regeneran células y manejan energía", "Son bonitas"] },
    { q: "¿Cuántas veces puede repetir su trabajo una enzima?", a: "Miles de veces por segundo", options: ["Una sola vez", "Diez veces", "Miles de veces por segundo"] }
  ],
  "Juan V (El Proyecto)": [
    { q: "¿Qué proceso natural estamos simulando?", a: "La bioluminiscencia", options: ["Fotosíntesis", "La bioluminiscencia", "Respiración"] },
    { q: "¿Cómo se llama la enzima de la naturaleza que mencionaste?", a: "Luciferasa", options: ["Amilasa", "Luciferasa", "Pepsina"] },
    { q: "¿Cuál es el sustrato o molécula que se oxida en la naturaleza?", a: "Luciferina", options: ["Glucosa", "Luciferina", "ATP"] },
    { q: "¿Qué tipo de reacción química usamos en el laboratorio?", a: "Quimioluminiscencia", options: ["Combustión", "Quimioluminiscencia", "Fermentación"] },
    { q: "¿Qué objeto cotidiano usamos para obtener los componentes?", a: "Barras luminosas", options: ["Linternas", "Barras luminosas", "Velas"] },
    { q: "¿Qué buscamos representar con este proyecto?", a: "Un proceso invisible", options: ["Un proceso invisible", "Un arcoíris", "Electricidad"] },
    { q: "¿La Luciferasa es una enzima o un sustrato?", a: "Es una enzima", options: ["Es una enzima", "Es un sustrato", "Es un gas"] },
    { q: "¿Qué le hace la Luciferasa a la Luciferina?", a: "La oxida", options: ["La congela", "La oxida", "La duplica"] },
    { q: "¿Cómo se llama nuestro proyecto?", a: "¡Enzima, Luz, Acción!", options: ["¡Enzima, Luz, Acción!", "Mundo Enzimático", "Luz Química"] },
    { q: "¿Por qué es una 'simulación'?", a: "Imitamos lo que hacen los seres vivos", options: ["Es un dibujo", "Imitamos lo que hacen los seres vivos", "Es magia"] }
  ],
  "Cristina O (Metodología)": [
    { q: "¿Qué líquido añadiste con el gotero?", a: "Peróxido de hidrógeno", options: ["Agua", "Alcohol", "Peróxido de hidrógeno"] },
    { q: "¿En qué recipientes estamos haciendo la mezcla?", a: "En tubos de ensayo", options: ["En vasos", "En tubos de ensayo", "En platos"] },
    { q: "¿Qué representan las gotas de peróxido?", a: "Activación del sustrato", options: ["Limpieza", "Activación del sustrato", "Dilución"] },
    { q: "¿Cómo se llaman las partículas de luz que se emiten?", a: "Fotones", options: ["Electrones", "Fotones", "Neutrones"] },
    { q: "¿Qué tipo de energía se transforma en luz?", a: "Energía química", options: ["Energía solar", "Energía química", "Energía eólica"] },
    { q: "¿La luz que observamos es fría o caliente?", a: "Luz fría", options: ["Luz caliente", "Luz fría", "Luz tibia"] },
    { q: "¿Cuándo comienza la mezcla a emitir fotones?", a: "Inmediatamente", options: ["Después de una hora", "Inmediatamente", "Al día siguiente"] },
    { q: "¿Qué reactivo químico extrajeron?", a: "Oxalato", options: ["Vinagre", "Oxalato", "Sal"] },
    { q: "¿Se necesita fuego para crear esta luz?", a: "No", options: ["Sí", "No", "A veces"] },
    { q: "¿Qué pasa visualmente cuando el peróxido toca el reactivo?", a: "Se genera brillo", options: ["Explota", "Se genera brillo", "Cambia a negro"] }
  ],
  "Mauricio M (Variables)": [
    { q: "¿Cuántos escenarios de temperatura comparamos?", a: "Tres", options: ["Uno", "Dos", "Tres"] },
    { q: "¿Qué le pasa a la luz en el hielo (5°C)?", a: "Se inhibe/es tenue", options: ["Brilla más", "Se inhibe/es tenue", "Cambia de color"] },
    { q: "¿Qué aumenta en el tubo caliente para que brille más?", a: "La energía cinética", options: ["La energía cinética", "La cantidad de agua", "El tamaño del tubo"] },
    { q: "¿En cuál de los tubos la reacción es más rápida?", a: "En el caliente a 45°C", options: ["En el frío a 5°C", "En el ambiente a 25°C", "En el caliente a 45°C"] },
    { q: "¿Qué pasa con la duración de la luz en el tubo caliente?", a: "Se agota rápido", options: ["Dura para siempre", "Se agota rápido", "Dura más que el frío"] },
    { q: "¿Qué demuestra este experimento sobre el ambiente?", a: "Regula la actividad química", options: ["No importa el clima", "Regula la actividad química", "El calor es malo"] },
    { q: "¿La acción enzimática ocurre siempre a la misma velocidad?", a: "No", options: ["Sí", "No", "Solo en humanos"] },
    { q: "¿Cómo se ve el brillo en el tubo a 25°C?", a: "Punto medio o normal", options: ["Muy fuerte", "Punto medio o normal", "No brilla"] },
    { q: "¿Por qué brilla más fuerte el tubo caliente?", a: "Moléculas chocan más rápido", options: ["Moléculas chocan más rápido", "Hay más luz solar", "Es más grande"] },
    { q: "¿El frío detiene la reacción o solo la hace más lenta?", a: "La hace más lenta", options: ["La detiene", "La hace más lenta", "La acelera"] }
  ],
  "Andrea L (Conclusión)": [
    { q: "¿La luz biológica es eficiente o desperdicia energía?", a: "Es eficiente y controlado", options: ["Es eficiente y controlado", "Desperdicia mucha energía", "No sirve"] },
    { q: "¿Para qué sirve entender la cinética enzimática en medicina?", a: "Detectar enfermedades", options: ["Hacer ejercicio", "Detectar enfermedades", "Cocinar mejor"] },
    { q: "¿Qué es la cinética enzimática?", a: "Estudio de la velocidad de reacciones", options: ["Estudio de la velocidad de reacciones", "Estudio de los huesos", "Estudio de las plantas"] },
    { q: "¿Mencionaste algún uso práctico?", a: "Uso en medicina", options: ["Uso en medicina", "Uso en carpintería", "Uso en música"] },
    { q: "¿Qué se entrega al final de la exposición?", a: "Trípticos o souvenirs", options: ["Dinero", "Trípticos o souvenirs", "Nada"] },
    { q: "¿La simulación confirmó que la luz es un proceso químico?", a: "Sí", options: ["Sí", "No", "Tal vez"] },
    { q: "¿Qué tipo de agentes podemos detectar?", a: "Bacterias o enfermedades", options: ["Fantasmas", "Bacterias o enfermedades", "Metales"] },
    { q: "¿Cómo se describe la producción de luz?", a: "Proceso químico controlado", options: ["Accidente", "Proceso químico controlado", "Magia"] },
    { q: "¿A quiénes agradecemos al final?", a: "Al público/jueces", options: ["A nadie", "Al público/jueces", "A los sustratos"] },
    { q: "¿Cuál es el objetivo final de entender estas enzimas?", a: "Aplicarlas en tecnología y salud", options: ["Ganar dinero", "Aplicarlas en tecnología y salud", "Hacer luces de colores"] }
  ]
};

export const EnzymeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [eatenCount, setEatenCount] = useState(0);
  const eatenCountRef = useRef(0);
  const [instruction, setInstruction] = useState("");
  const [targetType, setTargetType] = useState<'CATABOLIC' | 'ANABOLIC' | null>(null);
  const targetTypeRef = useRef<'CATABOLIC' | 'ANABOLIC' | null>(null);
  const [status, setStatus] = useState("Buscando Luciferina...");
  const [gameActive, setGameActive] = useState(true);
  const [showMemberSelection, setShowMemberSelection] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [feedbacks, setFeedbacks] = useState<{ id: number; x: number; y: number; text: string; color: string }[]>([]);
  const [shake, setShake] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  
  // Game state refs to avoid re-renders
  const enzymeRef = useRef({
    x: 300,
    y: 200,
    radius: 18,
    speed: 4,
    baseSpeed: 4,
    color: "#ffff00",
    dirX: 0,
    dirY: 0,
    mouthOpen: 0
  });

  const substratesRef = useRef<Substrate[]>([]);
  const ghostsRef = useRef<Ghost[]>([]);
  const requestRef = useRef<number>(null);

  const addFeedback = (x: number, y: number, text: string, color: string) => {
    const id = Date.now();
    setFeedbacks(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    }, 1000);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const initGame = (width: number, height: number) => {
    // Init Luciferin (Substrates)
    const newSubstrates: Substrate[] = [];
    for (let i = 0; i < 8; i++) {
      newSubstrates.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        radius: 6,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
    substratesRef.current = newSubstrates;

    // Init Inhibitors (Ghosts)
    const newGhosts: Ghost[] = [
      { x: 50, y: 50, radius: 15, vx: 2, vy: 2, color: "#ff0000", name: "Temp. Extrema" },
      { x: width - 50, y: height - 50, radius: 15, vx: -2, vy: -2, color: "#ff00ff", name: "Inhibidor" }
    ];
    ghostsRef.current = newGhosts;
    
    setInstruction("¡Recolecta Luciferina para brillar!");
  };

  const triggerGlow = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 500);
  };

  const update = (width: number, height: number) => {
    const enzyme = enzymeRef.current;
    const substrates = substratesRef.current;
    const ghosts = ghostsRef.current;

    // Update mouth animation
    enzyme.mouthOpen = (Math.sin(Date.now() * 0.01) + 1) / 2;

    // Move Luciferase (Pac-Man)
    enzyme.x += enzyme.dirX * enzyme.speed;
    enzyme.y += enzyme.dirY * enzyme.speed;

    // Wrap around
    if (enzyme.x < 0) enzyme.x = width;
    if (enzyme.x > width) enzyme.x = 0;
    if (enzyme.y < 0) enzyme.y = height;
    if (enzyme.y > height) enzyme.y = 0;

    // Move Ghosts (Inhibitors)
    ghosts.forEach(g => {
      g.x += g.vx;
      g.y += g.vy;
      if (g.x < 0 || g.x > width) g.vx *= -1;
      if (g.y < 0 || g.y > height) g.vy *= -1;

      // Collision with Ghost
      const dist = Math.hypot(enzyme.x - g.x, enzyme.y - g.y);
      if (dist < enzyme.radius + g.radius) {
        setScore(prev => Math.max(0, prev - 150));
        addFeedback(g.x, g.y, "-150", "#ff0000");
        triggerShake();
        setStatus(`¡${g.name}! Enzima desnaturalizada`);
        // Reposition enzyme
        enzyme.x = width / 2;
        enzyme.y = height / 2;
        enzyme.dirX = 0;
        enzyme.dirY = 0;
      }
    });

    // Move Substrates (Luciferin)
    for (let i = substrates.length - 1; i >= 0; i--) {
      const s = substrates[i];
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0 || s.x > width) s.vx *= -1;
      if (s.y < 0 || s.y > height) s.vy *= -1;

      const dist = Math.hypot(enzyme.x - s.x, enzyme.y - s.y);
      if (dist < enzyme.radius + s.radius) {
        setStatus("¡Fotón emitido! ✨");
        addFeedback(s.x, s.y, "+100", "#ffff00");
        triggerGlow();
        substrates.splice(i, 1);
        setScore(prev => prev + 100);
        
        eatenCountRef.current += 1;
        const newCount = eatenCountRef.current;
        setEatenCount(newCount);

        if (newCount >= 5) {
          setStatus("¡Bioluminiscencia Exitosa!");
          setGameActive(false);
          setShowMemberSelection(true);
        } else {
          // Add a new substrate to keep the game going if needed
          substrates.push({
            x: Math.random() * (width - 40) + 20,
            y: Math.random() * (height - 40) + 20,
            radius: 6,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
          });
        }
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Draw Luciferin (Pelotitas)
    substratesRef.current.forEach(s => {
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      // Glow effect for dots
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffff00";
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Draw Ghosts (Inhibitors)
    ghostsRef.current.forEach(g => {
      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.arc(g.x, g.y - 2, g.radius, Math.PI, 0);
      ctx.lineTo(g.x + g.radius, g.y + g.radius);
      // Wavy bottom
      for (let i = 0; i <= 3; i++) {
        ctx.lineTo(g.x + g.radius - (i * g.radius * 2 / 3), g.y + g.radius + (i % 2 === 0 ? -5 : 0));
      }
      ctx.lineTo(g.x - g.radius, g.y + g.radius);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(g.x - 5, g.y - 5, 4, 0, Math.PI * 2);
      ctx.arc(g.x + 5, g.y - 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(g.x - 5, g.y - 5, 2, 0, Math.PI * 2);
      ctx.arc(g.x + 5, g.y - 5, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Luciferase (Pac-Man)
    const enzyme = enzymeRef.current;
    
    if (isGlowing) {
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#ffff00";
    }

    ctx.fillStyle = enzyme.color;
    ctx.beginPath();
    const mouthSize = enzyme.mouthOpen * 0.4;
    ctx.moveTo(enzyme.x, enzyme.y);
    
    let angle = 0;
    if (enzyme.dirX === 1) angle = 0;
    if (enzyme.dirX === -1) angle = Math.PI;
    if (enzyme.dirY === -1) angle = -Math.PI/2;
    if (enzyme.dirY === 1) angle = Math.PI/2;

    ctx.arc(enzyme.x, enzyme.y, enzyme.radius, angle + mouthSize, angle + Math.PI * 2 - mouthSize);
    ctx.lineTo(enzyme.x, enzyme.y);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (gameActive) {
      update(canvas.width, canvas.height);
    }
    draw(ctx, canvas.width, canvas.height);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initGame(canvas.width, canvas.height);
      requestRef.current = requestAnimationFrame(gameLoop);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const enzyme = enzymeRef.current;
      if (e.key === "ArrowUp")    { enzyme.dirX = 0; enzyme.dirY = -1; }
      if (e.key === "ArrowDown")  { enzyme.dirX = 0; enzyme.dirY = 1; }
      if (e.key === "ArrowLeft")  { enzyme.dirX = -1; enzyme.dirY = 0; }
      if (e.key === "ArrowRight") { enzyme.dirX = 1; enzyme.dirY = 0; }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameActive]);

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    enzymeRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 18,
      speed: 4,
      baseSpeed: 4,
      color: "#ffff00",
      dirX: 0,
      dirY: 0,
      mouthOpen: 0
    };
    
    initGame(canvas.width, canvas.height);
    setScore(0);
    setEatenCount(0);
    eatenCountRef.current = 0;
    setStatus("Buscando Luciferina...");
    setGameActive(true);
    setShowMemberSelection(false);
    setQuizMode(false);
    setShowWinner(false);
    setWrongAnswer(false);
  };

  useEffect(() => {
    if (instruction) {
      const timer = setTimeout(() => {
        setInstruction("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [instruction]);

  const selectMember = (member: string) => {
    const memberQuestions = QUESTIONS_BY_MEMBER[member];
    const randomQ = memberQuestions[Math.floor(Math.random() * memberQuestions.length)];
    setCurrentQuestion({ ...randomQ, member });
    setShowMemberSelection(false);
    setQuizMode(true);
  };

  const handleAnswer = (option: string) => {
    if (option === currentQuestion.a) {
      setShowWinner(true);
      setQuizMode(false);
    } else {
      setWrongAnswer(true);
      setTimeout(() => setWrongAnswer(false), 2000);
    }
  };

  const handleMove = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const enzyme = enzymeRef.current;
    if (dir === 'UP')    { enzyme.dirX = 0; enzyme.dirY = -1; }
    if (dir === 'DOWN')  { enzyme.dirX = 0; enzyme.dirY = 1; }
    if (dir === 'LEFT')  { enzyme.dirX = -1; enzyme.dirY = 0; }
    if (dir === 'RIGHT') { enzyme.dirX = 1; enzyme.dirY = 0; }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 md:p-8 w-full">
      <div className="grid grid-cols-3 gap-4 w-full max-w-[600px] font-mono text-sm">
        <motion.div 
          key={eatenCount}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          className="data-grid-border p-3 md:p-4 bg-[#141414]"
        >
          <div className="text-[#888] italic mb-1 uppercase tracking-widest text-[10px]">Progreso</div>
          <div className="text-xl md:text-2xl text-yellow-400">{eatenCount}/5</div>
        </motion.div>
        
        <motion.div 
          key={score}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          className="data-grid-border p-3 md:p-4 bg-[#141414]"
        >
          <div className="text-[#888] italic mb-1 uppercase tracking-widest text-[10px]">Puntaje</div>
          <div className={`text-xl md:text-2xl font-bold ${score < 0 ? 'text-red-500' : 'text-green-400'}`}>
            {score}
          </div>
        </motion.div>

        <motion.div 
          key={status}
          initial={{ x: 0 }}
          animate={status.includes('Error') || status.includes('Inhibidor') || status.includes('Temp') ? { x: [-2, 2, -2, 2, 0] } : { scale: [1, 1.02, 1] }}
          className="data-grid-border p-3 md:p-4 bg-[#141414]"
        >
          <div className="text-[#888] italic mb-1 uppercase tracking-widest text-[10px]">Estado</div>
          <div className={`text-[9px] md:text-[11px] font-medium leading-tight ${status.includes('Fotón') ? 'text-yellow-400' : status.includes('Inhibidor') || status.includes('Temp') ? 'text-red-500' : 'text-white'}`}>
            {status}
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-[600px] aspect-[3/2]"
      >
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="w-full h-full bg-black border-4 border-[#262626] shadow-2xl rounded-sm touch-none"
        />

        {/* Floating Feedbacks */}
        <AnimatePresence>
          {feedbacks.map(f => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2, y: -50 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none font-mono font-bold text-lg z-50"
              style={{ 
                color: f.color, 
                left: `${(f.x / 600) * 100}%`, 
                top: `${(f.y / 400) * 100}%`,
                textShadow: '0 0 10px rgba(0,0,0,0.8)'
              }}
            >
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {instruction && gameActive && !quizMode && (
            <motion.div
              key={instruction}
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
              transition={{ 
                duration: 0.8,
                exit: { duration: 1.5, delay: 1 } 
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-black/40 backdrop-blur-sm px-6 py-3 border border-yellow-400/30 rounded-sm">
                <span className="text-yellow-400 font-mono text-lg md:text-2xl font-bold uppercase tracking-tighter text-center block">
                  {instruction}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showMemberSelection && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center gap-4 backdrop-blur-md p-6 text-center overflow-y-auto z-50">
            <h2 className="text-xl font-mono font-bold text-yellow-400 uppercase tracking-tighter mb-2">¿A qué integrante entendiste más?</h2>
            <div className="grid gap-2 w-full max-w-sm">
              {Object.keys(QUESTIONS_BY_MEMBER).map((member, i) => (
                <button
                  key={i}
                  onClick={() => selectMember(member)}
                  className="px-4 py-3 bg-[#1a1a1a] border border-[#333] text-white font-mono text-[11px] hover:bg-yellow-400 hover:text-black transition-all uppercase text-left flex items-center gap-3"
                >
                  <span className="bg-yellow-400 text-black w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                  {member}
                </button>
              ))}
            </div>
          </div>
        )}

        {quizMode && currentQuestion && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 backdrop-blur-md p-6 text-center z-50">
            <h2 className="text-xl font-mono font-bold text-yellow-400 uppercase tracking-tighter">DESAFÍO FINAL: ACCIÓN ENZIMÁTICA</h2>
            <div className="bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
              <span className="text-yellow-400 font-mono text-[10px] uppercase font-bold">Pregunta de {currentQuestion.member}</span>
            </div>
            <p className="text-white font-mono text-sm mb-4">{currentQuestion.q}</p>
            <div className="grid gap-3 w-full max-w-xs">
              {currentQuestion.options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="px-4 py-3 bg-[#1a1a1a] border border-[#333] text-white font-mono text-xs hover:bg-yellow-400 hover:text-black transition-all uppercase"
                >
                  {opt}
                </button>
              ))}
            </div>
            {wrongAnswer && <p className="text-red-500 font-mono text-[10px] animate-bounce">¡Respuesta incorrecta! Inténtalo de nuevo.</p>}
          </div>
        )}

        {showWinner && (
          <div className="absolute inset-0 bg-yellow-400 flex flex-col items-center justify-center gap-4 p-6 text-center animate-in fade-in zoom-in duration-500 overflow-y-auto">
            <div className="p-3 bg-black rounded-full animate-bounce">
              <Activity className="w-10 h-10 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-mono font-black text-black tracking-tighter italic leading-none">
              ¡GANASTE!<br/>
              <div className="relative inline-flex items-center justify-center mt-2">
                <div className="flex">
                  {"ACCIÓN ENZIMÁTICA".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ delay: 1.5 + i * 0.08, duration: 0.01 }}
                      className="inline-block whitespace-pre text-xl md:text-2xl uppercase"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  initial={{ left: -40, opacity: 0 }}
                  animate={{ left: "100%", opacity: 1 }}
                  transition={{ delay: 1.2, duration: 2, ease: "linear" }}
                  className="absolute w-10 h-10 z-20"
                >
                  <div className="relative w-full h-full">
                    <motion.div 
                      animate={{ rotate: [0, -35, 0] }}
                      transition={{ repeat: Infinity, duration: 0.2 }}
                      className="absolute top-0 w-full h-1/2 bg-black rounded-t-full origin-bottom"
                    />
                    <motion.div 
                      animate={{ rotate: [0, 35, 0] }}
                      transition={{ repeat: Infinity, duration: 0.2 }}
                      className="absolute bottom-0 w-full h-1/2 bg-black rounded-b-full origin-top"
                    />
                  </div>
                </motion.div>
              </div>
            </h2>
            
            <button 
              onClick={resetGame}
              className="mt-4 px-8 py-3 bg-black text-white font-mono font-bold hover:bg-white hover:text-black transition-colors uppercase text-sm border-2 border-black"
            >
              Reiniciar Juego
            </button>
          </div>
        )}

        {!gameActive && !quizMode && !showWinner && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 backdrop-blur-sm p-4 text-center">
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tighter">SIMULACIÓN COMPLETADA</h2>
            <p className="text-yellow-400 font-mono text-xs uppercase">Has procesado 3 moléculas con éxito</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-white text-black font-mono font-bold hover:bg-yellow-400 transition-colors uppercase text-sm"
            >
              Reiniciar Ciclo
            </button>
          </div>
        )}
      </motion.div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 w-48 md:hidden">
        <div />
        <button 
          onPointerDown={() => handleMove('UP')}
          className="w-14 h-14 bg-[#262626] border border-[#444] rounded-full flex items-center justify-center active:bg-yellow-400 active:text-black transition-colors"
        >
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-bottom-[12px] border-bottom-white" />
        </button>
        <div />
        <button 
          onPointerDown={() => handleMove('LEFT')}
          className="w-14 h-14 bg-[#262626] border border-[#444] rounded-full flex items-center justify-center active:bg-yellow-400 active:text-black transition-colors"
        >
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-right-[12px] border-right-white" />
        </button>
        <div className="w-14 h-14 flex items-center justify-center text-[#444] font-mono text-[10px]">MOVE</div>
        <button 
          onPointerDown={() => handleMove('RIGHT')}
          className="w-14 h-14 bg-[#262626] border border-[#444] rounded-full flex items-center justify-center active:bg-yellow-400 active:text-black transition-colors"
        >
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-left-[12px] border-left-white" />
        </button>
        <div />
        <button 
          onPointerDown={() => handleMove('DOWN')}
          className="w-14 h-14 bg-[#262626] border border-[#444] rounded-full flex items-center justify-center active:bg-yellow-400 active:text-black transition-colors"
        >
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-top-[12px] border-top-white" />
        </button>
        <div />
      </div>

      <div className="w-full max-w-[600px] mt-4">
        {/* Instructions / Info */}
        <div className="data-grid-border bg-[#141414] p-4">
          <div className="flex items-center gap-2 mb-4 border-b border-[#262626] pb-2">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">Instrucciones</h3>
          </div>
          <ul className="space-y-2 font-mono text-[9px] text-[#888] uppercase leading-tight">
            <li>• Pac-Man: Luciferasa (Enzima)</li>
            <li>• Pelotitas: Luciferina (Sustrato)</li>
            <li>• Fantasmas: Inhibidores / Temp. Extrema</li>
            <li>• Al comer: Brillo (Emisión de Fotón)</li>
            <li>• Meta: 5 Luciferinas para el Quiz</li>
          </ul>
        </div>
      </div>

      <div className="hidden md:flex flex-wrap justify-center gap-8 text-[11px] font-mono uppercase tracking-widest text-[#666]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#ffff00] rounded-full shadow-[0_0_5px_#ffff00]" />
          <span>Luciferina: +100 Puntos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#ff0000] rounded-sm" />
          <span>Inhibidores: Peligro</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white border border-[#444] px-1">↑↓←→</span>
          <span>Control de Luciferasa</span>
        </div>
      </div>
    </div>
  );
};
