import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <img src="/logo.png" alt="Mundo Gráfico" className="h-32 mb-8" />
      <h1 className="text-4xl font-bold text-brand-red mb-4">Mundo Gráfico Madrid</h1>
      <p className="text-xl text-gray-600 max-w-2xl text-center mb-8">
        Bienvenido al proyecto. Esta base está lista para ser editada visualmente en Lovable.dev.
        Usa el chat de Lovable para recrear las secciones de Rotulación, Ropa Laboral y Gran Formato usando las imágenes que ya están cargadas en este repositorio.
      </p>
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-brand-cyan text-white rounded-lg font-semibold">
          Listo para editar en Lovable
        </div>
      </div>
    </div>
  );
}

export default App;
