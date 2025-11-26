// src/hooks/useSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000/support';

/**
 * Hook para manejar la conexión de Socket.IO
 */
export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Crear conexión
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log('✅ Conectado al servidor de chat');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Desconectado del servidor de chat');
    });

    socket.on('connect_error', (error) => {
      setConnectionError('No se pudo conectar al servidor de soporte');
      console.error('Error de conexión:', error);
    });

    // Cleanup al desmontar
    return () => {
      socket.disconnect();
    };
  }, []);

  // Función para emitir eventos con callback
  const emit = useCallback((event, data) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error('No hay conexión con el servidor'));
        return;
      }

      socketRef.current.emit(event, data, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Error desconocido'));
        }
      });
    });
  }, []);

  // Función para escuchar eventos
  const on = useCallback((event, callback) => {
    socketRef.current?.on(event, callback);
    return () => socketRef.current?.off(event, callback);
  }, []);

  // Función para dejar de escuchar
  const off = useCallback((event, callback) => {
    socketRef.current?.off(event, callback);
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    emit,
    on,
    off
  };
}
