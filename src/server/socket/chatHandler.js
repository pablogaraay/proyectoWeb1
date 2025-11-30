// server/socket/chatHandler.js
const db = require('../db');

/**
 * Manejador de eventos de Socket.IO para el chat de soporte
 * @param {Object} io - Instancia de Socket.IO
 */
function setupChatHandlers(io) {
  // Namespace para el chat de soporte
  const supportChat = io.of('/support');

  supportChat.on('connection', (socket) => {
    console.log(`🔌 Usuario conectado al chat: ${socket.id}`);

    // Cliente inicia un nuevo chat
    socket.on('client:start_chat', async (data, callback) => {
      try {
        const { clientId, clientName } = data;
        
        if (!clientName || clientName.trim() === '') {
          throw new Error('El nombre del cliente es requerido');
        }

        // Crear nuevo chat en la base de datos
        db.run(
          `INSERT INTO support_chats (client_id, client_name, status) VALUES (?, ?, 'pending')`,
          [clientId || null, clientName],
          function(err) {
            if (err) {
              console.error('Error al crear chat:', err);
              callback({ success: false, error: 'Error al iniciar el chat. Inténtalo de nuevo.' });
              return;
            }

            const chatId = this.lastID;
            socket.join(`chat_${chatId}`);
            socket.chatId = chatId;
            socket.userType = 'client';

            // Notificar a los agentes de soporte que hay un nuevo chat
            supportChat.to('support_agents').emit('support:new_chat', {
              chatId,
              clientName,
              createdAt: new Date().toISOString()
            });

            callback({ success: true, chatId });
            console.log(`📝 Nuevo chat creado: ${chatId} por ${clientName}`);
          }
        );
      } catch (error) {
        console.error('Error en client:start_chat:', error);
        callback({ success: false, error: error.message || 'Error inesperado al iniciar el chat' });
      }
    });

    // Cliente se reconecta a un chat existente
    socket.on('client:rejoin_chat', (data, callback) => {
      try {
        const { chatId } = data;
        
        db.get(
          `SELECT * FROM support_chats WHERE id = ? AND status != 'closed'`,
          [chatId],
          (err, chat) => {
            if (err) {
              callback({ success: false, error: 'Error al recuperar el chat' });
              return;
            }
            if (!chat) {
              callback({ success: false, error: 'Chat no encontrado o ya cerrado' });
              return;
            }

            socket.join(`chat_${chatId}`);
            socket.chatId = chatId;
            socket.userType = 'client';

            // Obtener mensajes anteriores
            db.all(
              `SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC`,
              [chatId],
              (err, messages) => {
                if (err) {
                  callback({ success: false, error: 'Error al cargar mensajes' });
                  return;
                }
                callback({ success: true, chat, messages });
              }
            );
          }
        );
      } catch (error) {
        console.error('Error en client:rejoin_chat:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Agente de soporte se une a la sala de agentes
    socket.on('support:join', (data, callback) => {
      try {
        socket.join('support_agents');
        socket.userType = 'support';
        socket.agentId = data.agentId;
        socket.agentName = data.agentName;

        // Obtener lista de chats pendientes y activos
        db.all(
          `SELECT * FROM support_chats WHERE status IN ('pending', 'active') ORDER BY created_at ASC`,
          [],
          (err, chats) => {
            if (err) {
              callback({ success: false, error: 'Error al cargar chats' });
              return;
            }
            callback({ success: true, chats });
            console.log(`👨‍💼 Agente ${data.agentName} conectado`);
          }
        );
      } catch (error) {
        console.error('Error en support:join:', error);
        callback({ success: false, error: 'Error al conectar como soporte' });
      }
    });

    // Agente se reconecta a un chat activo
    socket.on('support:rejoin_chat', (data, callback) => {
      try {
        const { chatId } = data;
        
        socket.join(`chat_${chatId}`);
        socket.currentChatId = chatId;

        // Obtener mensajes del chat
        db.all(
          `SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC`,
          [chatId],
          (err, messages) => {
            if (err) {
              callback({ success: false, error: 'Error al cargar mensajes' });
              return;
            }
            callback({ success: true, messages });
          }
        );
      } catch (error) {
        console.error('Error en support:rejoin_chat:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Agente toma un chat
    socket.on('support:take_chat', (data, callback) => {
      try {
        const { chatId, agentId, agentName } = data;

        db.run(
          `UPDATE support_chats SET support_agent_id = ?, status = 'active' WHERE id = ? AND status = 'pending'`,
          [agentId, chatId],
          function(err) {
            if (err) {
              console.error('Error SQL al tomar chat:', err);
              callback({ success: false, error: 'Error al tomar el chat: ' + err.message });
              return;
            }
            if (this.changes === 0) {
              callback({ success: false, error: 'El chat ya fue tomado por otro agente' });
              return;
            }

            socket.join(`chat_${chatId}`);
            socket.currentChatId = chatId;

            // Obtener mensajes del chat
            db.all(
              `SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC`,
              [chatId],
              (err, messages) => {
                if (err) {
                  callback({ success: false, error: 'Error al cargar mensajes' });
                  return;
                }

                // Notificar al cliente que un agente se unió
                supportChat.to(`chat_${chatId}`).emit('chat:agent_joined', {
                  agentName
                });

                // Notificar a otros agentes que el chat fue tomado
                supportChat.to('support_agents').emit('support:chat_taken', {
                  chatId,
                  agentName
                });

                callback({ success: true, messages });
                console.log(`✅ Agente ${agentName} tomó el chat ${chatId}`);
              }
            );
          }
        );
      } catch (error) {
        console.error('Error en support:take_chat:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Enviar mensaje
    socket.on('chat:send_message', (data, callback) => {
      try {
        const { chatId, senderType, senderName, message } = data;

        if (!message || message.trim() === '') {
          callback({ success: false, error: 'El mensaje no puede estar vacío' });
          return;
        }

        if (!chatId) {
          callback({ success: false, error: 'No hay chat activo' });
          return;
        }

        db.run(
          `INSERT INTO chat_messages (chat_id, sender_type, sender_name, message) VALUES (?, ?, ?, ?)`,
          [chatId, senderType, senderName, message],
          function(err) {
            if (err) {
              console.error('Error al guardar mensaje:', err);
              callback({ success: false, error: 'Error al enviar el mensaje' });
              return;
            }

            const messageData = {
              id: this.lastID,
              chatId,
              senderType,
              senderName,
              message,
              createdAt: new Date().toISOString()
            };

            // Emitir mensaje a todos en la sala del chat
            supportChat.to(`chat_${chatId}`).emit('chat:new_message', messageData);
            callback({ success: true, messageId: this.lastID });
          }
        );
      } catch (error) {
        console.error('Error en chat:send_message:', error);
        callback({ success: false, error: 'Error inesperado al enviar mensaje' });
      }
    });

    // Agente cierra el chat (solicita valoración)
    socket.on('support:close_chat', (data, callback) => {
      try {
        const { chatId } = data;

        db.run(
          `UPDATE support_chats SET status = 'awaiting_rating', closed_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [chatId],
          function(err) {
            if (err) {
              callback({ success: false, error: 'Error al cerrar el chat' });
              return;
            }

            // Notificar al cliente que debe valorar
            supportChat.to(`chat_${chatId}`).emit('chat:request_rating', { chatId });
            
            // Notificar a agentes
            supportChat.to('support_agents').emit('support:chat_closed', { chatId });

            callback({ success: true });
            console.log(`🔒 Chat ${chatId} cerrado, esperando valoración`);
          }
        );
      } catch (error) {
        console.error('Error en support:close_chat:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Cliente envía valoración
    socket.on('client:rate_chat', (data, callback) => {
      try {
        const { chatId, rating } = data;

        if (rating < 1 || rating > 5) {
          callback({ success: false, error: 'La valoración debe ser entre 1 y 5' });
          return;
        }

        db.run(
          `UPDATE support_chats SET rating = ?, status = 'closed' WHERE id = ?`,
          [rating, chatId],
          function(err) {
            if (err) {
              callback({ success: false, error: 'Error al guardar la valoración' });
              return;
            }

            // Notificar a agentes de la valoración
            supportChat.to('support_agents').emit('support:chat_rated', {
              chatId,
              rating
            });

            callback({ success: true });
            console.log(`⭐ Chat ${chatId} valorado con ${rating} estrellas`);
          }
        );
      } catch (error) {
        console.error('Error en client:rate_chat:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Cliente cierra chat sin valorar (opcional)
    socket.on('client:close_without_rating', (data, callback) => {
      try {
        const { chatId } = data;

        db.run(
          `UPDATE support_chats SET status = 'closed', closed_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [chatId],
          function(err) {
            if (err) {
              callback({ success: false, error: 'Error al cerrar el chat' });
              return;
            }
            callback({ success: true });
          }
        );
      } catch (error) {
        console.error('Error en client:close_without_rating:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Usuario está escribiendo
    socket.on('chat:typing', (data) => {
      const { chatId, isTyping, userName } = data;
      // Emitir a todos en la sala excepto al que envía
      socket.to(`chat_${chatId}`).emit('chat:user_typing', {
        chatId,
        isTyping,
        userName
      });
    });

    // Obtener historial de chats cerrados
    socket.on('support:get_history', (data, callback) => {
      try {
        db.all(
          `SELECT * FROM support_chats WHERE status = 'closed' ORDER BY closed_at DESC LIMIT 50`,
          [],
          (err, chats) => {
            if (err) {
              console.error('Error al obtener historial:', err);
              callback({ success: false, error: 'Error al cargar el historial' });
              return;
            }
            callback({ success: true, chats: chats || [] });
          }
        );
      } catch (error) {
        console.error('Error en support:get_history:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Obtener mensajes de un chat específico
    socket.on('support:get_chat_messages', (data, callback) => {
      try {
        const { chatId } = data;
        
        db.all(
          `SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC`,
          [chatId],
          (err, messages) => {
            if (err) {
              console.error('Error al obtener mensajes:', err);
              callback({ success: false, error: 'Error al cargar los mensajes' });
              return;
            }
            callback({ success: true, messages: messages || [] });
          }
        );
      } catch (error) {
        console.error('Error en support:get_chat_messages:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Cambiar estado del agente
    socket.on('support:change_status', (data, callback) => {
      try {
        const { status, agentName } = data;
        socket.agentStatus = status;
        
        // Notificar a otros agentes del cambio de estado
        supportChat.to('support_agents').emit('support:agent_status_changed', {
          agentName,
          status
        });

        if (callback) callback({ success: true });
        console.log(`👤 ${agentName} cambió su estado a: ${status}`);
      } catch (error) {
        console.error('Error en support:change_status:', error);
        if (callback) callback({ success: false, error: 'Error al cambiar estado' });
      }
    });

    // Transferir chat a otro agente
    socket.on('support:transfer_chat', (data, callback) => {
      try {
        const { chatId, fromAgent, toAgentId } = data;

        // Actualizar el chat para que vuelva a estar pendiente
        db.run(
          `UPDATE support_chats SET support_agent_id = NULL, status = 'pending' WHERE id = ?`,
          [chatId],
          function(err) {
            if (err) {
              callback({ success: false, error: 'Error al transferir el chat' });
              return;
            }

            // Notificar a todos los agentes que hay un chat disponible
            supportChat.to('support_agents').emit('support:chat_transferred', {
              chatId,
              fromAgent
            });

            // El agente actual sale de la sala del chat
            socket.leave(`chat_${chatId}`);

            callback({ success: true });
            console.log(`🔄 ${fromAgent} transfirió el chat ${chatId}`);
          }
        );
      } catch (error) {
        console.error('Error en support:transfer_chat:', error);
        callback({ success: false, error: 'Error inesperado' });
      }
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`🔌 Usuario desconectado: ${socket.id}`);
    });
  });

  return supportChat;
}

module.exports = setupChatHandlers;
