// src/components/chat/ChatWidget.jsx
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import { INVITADO } from '../../constantes';

/**
 * Widget de chat flotante para clientes
 * Aparece en la esquina inferior derecha
 */
function ChatWidget({ esInvitado }) {
  const { isConnected, connectionError, emit, on, off } = useSocket();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [clientName, setClientName] = useState('');
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [chatStatus, setChatStatus] = useState('idle'); // idle, active, awaiting_rating, closed
  const [error, setError] = useState(null);
  const [agentName, setAgentName] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const commonEmojis = ['😊', '👍', '👋', '🙏', '✅', '❌', '😢', '😅', '❤️', '👀', '🤔', '🎉'];

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Escuchar eventos del socket
  useEffect(() => {
    if (!isConnected) return;

    const handleNewMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    const handleAgentJoined = (data) => {
      setAgentName(data.agentName);
      setMessages(prev => [...prev, {
        id: Date.now(),
        senderType: 'system',
        message: `${data.agentName} se ha unido al chat. Te ayudará con tu consulta.`,
        createdAt: new Date().toISOString()
      }]);
    };

    const handleRequestRating = () => {
      setChatStatus('awaiting_rating');
      setMessages(prev => [...prev, {
        id: Date.now(),
        senderType: 'system',
        message: 'El chat ha sido cerrado. Por favor, valora la atención recibida.',
        createdAt: new Date().toISOString()
      }]);
    };

    const handleUserTyping = (data) => {
      if (data.isTyping) {
        setIsOtherTyping(true);
        setTypingUser(data.userName);
      } else {
        setIsOtherTyping(false);
        setTypingUser('');
      }
    };

    on('chat:new_message', handleNewMessage);
    on('chat:agent_joined', handleAgentJoined);
    on('chat:request_rating', handleRequestRating);
    on('chat:user_typing', handleUserTyping);

    return () => {
      off('chat:new_message', handleNewMessage);
      off('chat:agent_joined', handleAgentJoined);
      off('chat:request_rating', handleRequestRating);
      off('chat:user_typing', handleUserTyping);
    };
  }, [isConnected, on, off]);

  // Recuperar chat existente del localStorage
  useEffect(() => {
    const savedChatId = localStorage.getItem('supportChatId');
    const savedName = localStorage.getItem('supportClientName');
    
    if (savedChatId && savedName && isConnected) {
      setClientName(savedName);
      rejoinChat(savedChatId);
    }
  }, [isConnected]);

  const rejoinChat = async (savedChatId) => {
    try {
      const response = await emit('client:rejoin_chat', { chatId: parseInt(savedChatId) });
      setChatId(parseInt(savedChatId));
      setMessages(response.messages || []);
      setChatStatus(response.chat.status === 'awaiting_rating' ? 'awaiting_rating' : 'active');
    } catch (err) {
      // Chat no existe o está cerrado, limpiar localStorage
      localStorage.removeItem('supportChatId');
      localStorage.removeItem('supportClientName');
    }
  };

  const startChat = async () => {
    if (!clientName.trim()) {
      setError('Por favor, introduce tu nombre');
      return;
    }

    setIsStartingChat(true);
    setError(null);

    try {
      const response = await emit('client:start_chat', {
        clientId: null, // Podría ser el ID del usuario si está logueado
        clientName: clientName.trim()
      });

      setChatId(response.chatId);
      setChatStatus('active');
      localStorage.setItem('supportChatId', response.chatId);
      localStorage.setItem('supportClientName', clientName.trim());
      
      setMessages([{
        id: Date.now(),
        senderType: 'system',
        message: 'Chat iniciado. Un agente de soporte te atenderá pronto.',
        createdAt: new Date().toISOString()
      }]);
    } catch (err) {
      setError(err.message || 'Error al iniciar el chat');
    } finally {
      setIsStartingChat(false);
    }
  };

  // Emitir evento de escribiendo
  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    
    if (!chatId) return;

    // Emitir que está escribiendo
    emit('chat:typing', { chatId, isTyping: true, userName: clientName }).catch(() => {});

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Dejar de "escribir" después de 2 segundos de inactividad
    typingTimeoutRef.current = setTimeout(() => {
      emit('chat:typing', { chatId, isTyping: false, userName: clientName }).catch(() => {});
    }, 2000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !chatId) return;

    // Dejar de mostrar "escribiendo" al enviar
    emit('chat:typing', { chatId, isTyping: false, userName: clientName }).catch(() => {});
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const messageText = inputMessage.trim();
    setInputMessage('');
    setError(null);

    try {
      await emit('chat:send_message', {
        chatId,
        senderType: 'client',
        senderName: clientName,
        message: messageText
      });
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje');
      setInputMessage(messageText); // Restaurar mensaje si falla
    }
  };

  const submitRating = async (selectedRating) => {
    try {
      await emit('client:rate_chat', { chatId, rating: selectedRating });
      setChatStatus('closed');
      localStorage.removeItem('supportChatId');
      localStorage.removeItem('supportClientName');
      
      setTimeout(() => {
        setIsOpen(false);
        setChatId(null);
        setMessages([]);
        setChatStatus('idle');
        setClientName('');
        setAgentName(null);
        setRating(0);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al enviar la valoración');
    }
  };

  const closeWithoutRating = async () => {
    try {
      await emit('client:close_without_rating', { chatId });
      localStorage.removeItem('supportChatId');
      localStorage.removeItem('supportClientName');
      setIsOpen(false);
      setChatId(null);
      setMessages([]);
      setChatStatus('idle');
      setClientName('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Renderizar estrellas para valoración
  const renderStars = () => {
    return (
      <div className="flex justify-center gap-2 my-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => submitRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-3xl transition-transform hover:scale-110"
          >
            {star <= (hoverRating || rating) ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        title="Abrir chat de soporte"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Ventana de chat */}
      <div className={`absolute bottom-0 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 ease-out origin-bottom-right ${
        isOpen 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-0 opacity-0 translate-y-4 pointer-events-none'
      }`}>
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Soporte en vivo</h3>
              <p className="text-xs text-blue-100">
                {isConnected ? (agentName ? `Atendido por ${agentName}` : 'Conectado') : 'Conectando...'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error de conexión */}
          {connectionError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm">
              {connectionError}
            </div>
          )}

          {/* Error general */}
          {error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 text-sm flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-yellow-700 hover:text-yellow-900">✕</button>
            </div>
          )}

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Usuario no logueado - Pedir que se registre */}
            {esInvitado === INVITADO.SI && chatStatus === 'idle' && !chatId && (
              <div className="h-full flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">Inicia sesión</h4>
                  <p className="text-gray-600 text-sm mt-1">Para contactar con soporte necesitas una cuenta</p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => { setIsOpen(false); navigate('/login'); }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); navigate('/register'); }}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                  >
                    Crear cuenta
                  </button>
                </div>
              </div>
            )}

            {/* Formulario inicial para nombre (usuario logueado) */}
            {esInvitado === INVITADO.NO && chatStatus === 'idle' && !chatId && (
              <div className="h-full flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">¡Hola! 👋</h4>
                  <p className="text-gray-600 text-sm mt-1">¿En qué podemos ayudarte?</p>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && startChat()}
                  />
                  <button
                    onClick={startChat}
                    disabled={isStartingChat || !isConnected}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    {isStartingChat ? 'Iniciando...' : 'Iniciar chat'}
                  </button>
                </div>
              </div>
            )}

            {/* Mensajes del chat */}
            {(chatStatus === 'active' || chatStatus === 'awaiting_rating') && (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === 'client' ? 'justify-end' : msg.senderType === 'system' ? 'justify-center' : 'justify-start'}`}
                  >
                    {msg.senderType === 'system' ? (
                      <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {msg.message}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.senderType === 'client'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-gray-200 text-gray-800 rounded-bl-md'
                        }`}
                      >
                        {msg.senderType !== 'client' && (
                          <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName}</p>
                        )}
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Indicador de escribiendo */}
                {isOtherTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{typingUser} está escribiendo</span>
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Pantalla de valoración */}
            {chatStatus === 'awaiting_rating' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-center text-gray-700 font-medium mb-2">
                  ¿Cómo valorarías la atención recibida?
                </p>
                {renderStars()}
                <button
                  onClick={closeWithoutRating}
                  className="w-full text-gray-500 text-sm hover:text-gray-700 mt-2"
                >
                  Cerrar sin valorar
                </button>
              </div>
            )}

            {/* Chat cerrado */}
            {chatStatus === 'closed' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-700 font-medium">¡Gracias por tu valoración!</p>
                  <p className="text-gray-500 text-sm">El chat se cerrará automáticamente</p>
                </div>
              </div>
            )}
          </div>

          {/* Input de mensaje */}
          {chatStatus === 'active' && chatId && (
            <div className="border-t border-gray-200 bg-gray-50">
              {/* Panel de emojis */}
              {showEmojiPicker && (
                <div className="p-2 border-b border-gray-200 bg-white">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setInputMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="w-8 h-8 text-lg hover:bg-gray-100 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <form onSubmit={sendMessage} className="p-3">
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-1 rounded transition-colors ${showEmojiPicker ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                  >
                    <span className="text-lg">😊</span>
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={handleTyping}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </form>
              {/* Botón para finalizar chat */}
              <div className="px-3 pb-3">
                <button
                  onClick={closeWithoutRating}
                  className="w-full text-red-500 hover:text-red-600 text-sm py-1 transition-colors"
                >
                  Finalizar chat
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

export default ChatWidget;
