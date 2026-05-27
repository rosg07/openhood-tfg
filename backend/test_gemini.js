import { generarRespuestaMecanico } from './services/chatbot.service.js';
import dotenv from 'dotenv';
dotenv.config();

const testChat = async () => {
    console.log("🚀 Iniciando prueba del Mecánico Virtual...");
    
    // Simulamos un historial vacío (primera conversación)
    const historial = []; 
    const mensajeUsuario = "Hola, mi coche hace un ruido metálico al frenar, ¿qué puede ser?";

    try {
        const respuesta = await generarRespuestaMecanico(historial, mensajeUsuario);
        console.log("\n--- Respuesta de Gemini ---");
        console.log(respuesta);
        console.log("---------------------------\n");
    } catch (error) {
        console.error("❌ Error en la prueba:", error.message);
    }
};

testChat();