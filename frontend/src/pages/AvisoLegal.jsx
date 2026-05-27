const AvisoLegal = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Borde superior decorativo con los colores de la marca */}
        <div className="h-2 w-full bg-linear-to-r from-[#1A365D] to-[#00B4D8]"></div>
        
        <div className="p-8 sm:p-12">
          
          {/* Cabecera del documento */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
            <span className="text-4xl p-4 bg-[#e6f7fa] rounded-2xl">🏛️</span>
            <div>
              <h1 className="text-3xl font-bold text-[#1A365D]">Aviso Legal</h1>
              <p className="text-gray-500 mt-2">Información legal y titularidad del proyecto</p>
            </div>
          </div>

          {/* Contenido legal */}
          <div className="space-y-8 text-gray-600 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-[#1A365D] mb-4 flex items-center gap-2">
                <span className="text-[#00B4D8] font-black">01.</span> Información General
              </h2>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700">
                <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que esta plataforma es un proyecto académico (TFG) desarrollado con fines educativos y de demostración técnica.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A365D] mb-4 flex items-center gap-2">
                <span className="text-[#00B4D8] font-black">02.</span> Propiedad Intelectual
              </h2>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700">
                <p>El código fuente, los diseños gráficos, las imágenes, las fotografías, los sonidos, las animaciones, el software, los textos, así como la información y los contenidos que se recogen en <strong className="font-bold text-[#1A365D]">Open<span className="text-[#00B4D8]">Hood</span></strong> están protegidos por la legislación española sobre los derechos de propiedad intelectual.</p>
              </div>
            </section>
            
            {/* Pie del documento */}
            <div className="pt-8 mt-12 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400 font-medium">
                Última actualización: Mayo de 2026
              </p>
              <span className="font-bold tracking-tight text-[#1A365D] opacity-50">
                Open<span className="text-[#00B4D8]">Hood</span>
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default AvisoLegal;