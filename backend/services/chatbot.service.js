import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Genera una respuesta de experto mecánico integrando contexto de vehículo y talleres locales.
 * @param {Array} historial - Mensajes previos del usuario y el asistente.
 * @param {string} mensajeUsuario - Consulta actual.
 * @param {Object|null} datosVehiculo - Datos técnicos del coche activo.
 * @param {Array} talleresCercanos - Lista de talleres obtenidos por geolocalización.
 */
export const generarRespuestaMecanico = async (historial, mensajeUsuario, datosVehiculo = null, talleresCercanos = []) => {
    try {
        // 1. Contexto del vehículo
        let contextoVehiculo = "El usuario no tiene un vehículo seleccionado en este momento.";
        if (datosVehiculo) {
            contextoVehiculo = `El usuario está consultando sobre su vehículo:
            - Marca: ${datosVehiculo.marca}
            - Modelo: ${datosVehiculo.modelo}
            - Año: ${datosVehiculo.anio}
            - Motor/Combustible: ${datosVehiculo.motor || 'No especificado'}
            - Kilometraje: ${datosVehiculo.kilometraje || 'No especificado'} km.`;
        }

        // 2. Contexto de Talleres Cercanos
        let contextoTalleres = "No se han detectado talleres cercanos en la base de datos para la ubicación actual.";
        if (talleresCercanos && talleresCercanos.length > 0) {
            const listaTalleres = talleresCercanos.map(t => 
                `- ${t.nombre}: ${t.direccion} (a ${(t.distance).toFixed(1)} km)${t.telefono ? `, Tel: ${t.telefono}` : ''}`
            ).join('\n');
            
            contextoTalleres = `Actualmente, estos son los talleres más cercanos de la red OpenHood al usuario:\n${listaTalleres}`;
        }

        // 3. System Prompt con Inyección de Datos
        const systemPrompt = {
            role: "system",
            content: `Eres un experto mecánico virtual de la plataforma OpenHood. 
            
            ${contextoVehiculo}
            
            ${contextoTalleres}

            Instrucciones de respuesta:
            1. Si el usuario pregunta por reparaciones, revisiones o "dónde llevar el coche", recomienda PRIORITARIAMENTE los talleres cercanos mencionados arriba.
            2. Usa los datos del vehículo para dar consejos técnicos precisos (mantenimientos, averías comunes de ese modelo).
            3. Mantén un tono profesional, resolutivo y cercano.
            4. Si detectas una avería de seguridad (frenos, dirección, humo extraño), insta al usuario a acudir de inmediato a uno de los talleres sugeridos.
            5. Responde siempre en español de forma concisa pero completa.`
        };

        // 4. Formateo del historial
        const historialFormateado = historial.map(msg => ({
            role: msg.rol === 'user' ? 'user' : 'assistant',
            content: msg.contenido
        }));

        // 5. Llamada a Groq (Llama 3.3 70B)
        const completion = await groq.chat.completions.create({
            messages: [
                systemPrompt,
                ...historialFormateado,
                { role: "user", content: mensajeUsuario },
            ],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.5, // Bajamos ligeramente para mayor precisión técnica
            max_tokens: 600,
        });

        return completion.choices[0]?.message?.content || "Lo siento, no he podido procesar tu consulta.";
    } catch (error) {
        console.error("❌ Error en Groq Service:", error);
        return "Lo siento, tengo problemas para conectar con mi cerebro mecánico. Inténtalo de nuevo en un momento.";
    }
};