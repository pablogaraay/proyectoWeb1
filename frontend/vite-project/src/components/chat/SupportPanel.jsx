// src/components/chat/SupportPanel.jsx
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';

/**
 * Panel de soporte para agentes
 * Muestra lista de chats pendientes y permite responder
 */
function SupportPanel() {
  const { isConnected, connectionError, emit, on, off } = useSocket();
  
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState(null);
  const [agentName, setAgentName] = useState(() => {
    // Recuperar nombre del agente del localStorage
    return localStorage.getItem('supportAgentName') || '';
  });
  const [isJoined, setIsJoined] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [agentStatus, setAgentStatus] = useState('available'); // available, busy, away
  const [showHistory, setShowHistory] = useState(false);
  const [closedChats, setClosedChats] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [viewingHistoryChat, setViewingHistoryChat] = useState(null);
  const [historyMessages, setHistoryMessages] = useState([]);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Respuestas predefinidas
  const quickReplies = [
    { id: 1, label: '👋 Saludo', text: `¡Hola! Soy ${agentName || 'tu agente de soporte'}. ¿En qué puedo ayudarte hoy?` },
    { id: 2, label: '⏳ Espera', text: 'Dame un momento mientras reviso tu consulta...' },
    { id: 3, label: '✅ Resuelto', text: '¡Me alegra haber podido ayudarte! ¿Hay algo más en lo que pueda asistirte?' },
    { id: 4, label: '📧 Email', text: 'Te enviaré más información a tu correo electrónico registrado.' },
    { id: 5, label: '🔄 Escalado', text: 'Voy a transferir tu consulta a un especialista que podrá ayudarte mejor.' },
    { id: 6, label: '📞 Contacto', text: 'Si prefieres, puedes contactarnos también por teléfono al +34 900 000 000.' },
  ];

  const commonEmojis = ['😊', '👍', '👋', '🙏', '✅', '❌', '⏳', '📧', '📞', '🔧', '💡', '🎉', '❤️', '👀', '🤔', '😅'];

  // Contar chats pendientes
  const pendingCount = chats.filter(c => c.status === 'pending').length;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Escuchar eventos del socket
  useEffect(() => {
    if (!isConnected || !isJoined) return;

    const handleNewChat = (data) => {
      setChats(prev => [...prev, {
        id: data.chatId,
        client_name: data.clientName,
        status: 'pending',
        created_at: data.createdAt
      }]);
    };

    const handleChatTaken = (data) => {
      setChats(prev => prev.map(chat => 
        chat.id === data.chatId 
          ? { ...chat, status: 'active', agentName: data.agentName }
          : chat
      ));
    };

    const handleChatClosed = (data) => {
      setChats(prev => prev.filter(chat => chat.id !== data.chatId));
      if (activeChat?.id === data.chatId) {
        setActiveChat(null);
        setMessages([]);
      }
    };

    const handleChatRated = (data) => {
      // Mostrar notificación de valoración
      setChats(prev => prev.filter(chat => chat.id !== data.chatId));
    };

    const handleNewMessage = (data) => {
      if (activeChat && data.chatId === activeChat.id) {
        setMessages(prev => [...prev, data]);
      }
    };

    const handleUserTyping = (data) => {
      if (activeChat && data.chatId === activeChat.id) {
        if (data.isTyping) {
          setIsOtherTyping(true);
          setTypingUser(data.userName);
        } else {
          setIsOtherTyping(false);
          setTypingUser('');
        }
      }
    };

    const handleChatTransferred = (data) => {
      // Recargar la lista de chats para ver el chat transferido
      emit('support:join', { agentId: Date.now(), agentName })
        .then(response => {
          setChats(response.chats || []);
        })
        .catch(() => {});
    };

    on('support:new_chat', handleNewChat);
    on('support:chat_taken', handleChatTaken);
    on('support:chat_closed', handleChatClosed);
    on('support:chat_rated', handleChatRated);
    on('chat:new_message', handleNewMessage);
    on('chat:user_typing', handleUserTyping);
    on('support:chat_transferred', handleChatTransferred);

    return () => {
      off('support:new_chat', handleNewChat);
      off('support:chat_taken', handleChatTaken);
      off('support:chat_closed', handleChatClosed);
      off('support:chat_rated', handleChatRated);
      off('chat:new_message', handleNewMessage);
      off('chat:user_typing', handleUserTyping);
      off('support:chat_transferred', handleChatTransferred);
    };
  }, [isConnected, isJoined, activeChat, agentName, emit, on, off]);

  // Obtener ID del usuario logueado
  const getAgentId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificar el JWT para obtener el ID (sin verificar, solo leer)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch {
        return Date.now();
      }
    }
    return Date.now();
  };

  // Auto-join si ya tenemos nombre guardado
  useEffect(() => {
    if (isConnected && agentName && !isJoined) {
      joinAsSupport();
    }
  }, [isConnected]);

  // Unirse como agente de soporte
  const joinAsSupport = async () => {
    if (!agentName.trim()) {
      setError('Por favor, introduce tu nombre');
      return;
    }

    try {
      const agentId = getAgentId();
      const response = await emit('support:join', {
        agentId,
        agentName: agentName.trim()
      });

      // Guardar nombre en localStorage
      localStorage.setItem('supportAgentName', agentName.trim());

      setChats(response.chats || []);
      setIsJoined(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al conectar como soporte');
    }
  };

  // Tomar un chat
  const takeChat = async (chat) => {
    try {
      // Si el chat ya está activo, solo cargar los mensajes
      if (chat.status === 'active') {
        const response = await emit('support:rejoin_chat', {
          chatId: chat.id
        });
        
        setActiveChat(chat);
        setMessages(response.messages || []);
        setError(null);
        return;
      }

      // Si está pendiente, tomarlo normalmente
      const agentId = getAgentId();
      const response = await emit('support:take_chat', {
        chatId: chat.id,
        agentId,
        agentName
      });

      setActiveChat(chat);
      setMessages(response.messages || []);
      setChats(prev => prev.map(c => 
        c.id === chat.id ? { ...c, status: 'active' } : c
      ));
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al tomar el chat');
    }
  };

  // Emitir evento de escribiendo
  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    
    if (!activeChat) return;

    emit('chat:typing', { chatId: activeChat.id, isTyping: true, userName: agentName }).catch(() => {});

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emit('chat:typing', { chatId: activeChat.id, isTyping: false, userName: agentName }).catch(() => {});
    }, 2000);
  };

  // Enviar mensaje
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !activeChat) return;

    emit('chat:typing', { chatId: activeChat.id, isTyping: false, userName: agentName }).catch(() => {});
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      await emit('chat:send_message', {
        chatId: activeChat.id,
        senderType: 'support',
        senderName: agentName,
        message: messageText
      });
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje');
      setInputMessage(messageText);
    }
  };

  // Cerrar chat (solicitar valoración)
  const closeChat = async () => {
    if (!activeChat) return;

    try {
      await emit('support:close_chat', { chatId: activeChat.id });
      setActiveChat(null);
      setMessages([]);
      setChats(prev => prev.filter(c => c.id !== activeChat.id));
    } catch (err) {
      setError(err.message || 'Error al cerrar el chat');
    }
  };

  // Volver a la lista
  const backToList = () => {
    setActiveChat(null);
    setMessages([]);
    setShowQuickReplies(false);
    setShowEmojiPicker(false);
  };

  // Enviar respuesta rápida
  const sendQuickReply = async (text) => {
    if (!activeChat) return;
    
    try {
      await emit('chat:send_message', {
        chatId: activeChat.id,
        senderType: 'support',
        senderName: agentName,
        message: text
      });
      setShowQuickReplies(false);
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje');
    }
  };

  // Insertar emoji
  const insertEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Cargar historial de chats cerrados
  const loadHistory = async () => {
    try {
      const response = await emit('support:get_history', {});
      setClosedChats(response.chats || []);
      setShowHistory(true);
      setViewingHistoryChat(null);
    } catch (err) {
      setError('Error al cargar el historial');
    }
  };

  // Ver mensajes de un chat del historial
  const viewHistoryChat = async (chat) => {
    try {
      const response = await emit('support:get_chat_messages', { chatId: chat.id });
      setViewingHistoryChat(chat);
      setHistoryMessages(response.messages || []);
    } catch (err) {
      setError('Error al cargar los mensajes');
    }
  };

  // Cambiar estado del agente
  const changeStatus = async (newStatus) => {
    setAgentStatus(newStatus);
    try {
      await emit('support:change_status', { status: newStatus, agentName });
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  // Transferir chat
  const transferChat = async (targetAgentId) => {
    if (!activeChat) return;
    
    try {
      await emit('support:transfer_chat', {
        chatId: activeChat.id,
        fromAgent: agentName,
        toAgentId: targetAgentId
      });
      setShowTransferModal(false);
      backToList();
    } catch (err) {
      setError(err.message || 'Error al transferir el chat');
    }
  };

  // Formatear fecha
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Ocupado';
      case 'away': return 'Ausente';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="fixed bottom-6 right-24 z-50">
      {/* Botón flotante con contador */}
      <button
        onClick={() => setIsOpen(true)}
        className={`w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 relative ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        title="Panel de soporte"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Panel de soporte */}
      <div className={`absolute bottom-0 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 ease-out origin-bottom-right ${
        isOpen 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-0 opacity-0 translate-y-4 pointer-events-none'
      }`}>
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {(activeChat || showHistory || viewingHistoryChat) && (
                  <button onClick={() => { 
                    if (viewingHistoryChat) {
                      setViewingHistoryChat(null);
                      setHistoryMessages([]);
                    } else {
                      backToList(); 
                      setShowHistory(false); 
                    }
                  }} className="hover:bg-green-700 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <div>
                  <h3 className="font-semibold">
                    {activeChat ? `Chat con ${activeChat.client_name}` : viewingHistoryChat ? `Chat con ${viewingHistoryChat.client_name}` : showHistory ? 'Historial' : 'Panel de Soporte'}
                  </h3>
                  <p className="text-xs text-green-100">
                    {viewingHistoryChat 
                      ? 'Chat archivado (solo lectura)' 
                      : isConnected 
                        ? (isJoined ? `${pendingCount} chats pendientes` : 'Conectado') 
                        : 'Conectando...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Estado del agente */}
                {isJoined && !activeChat && !showHistory && (
                  <div className="relative group">
                    <button className={`w-3 h-3 rounded-full ${getStatusColor(agentStatus)} ring-2 ring-white`} />
                    <div className="absolute right-0 top-6 bg-white rounded-lg shadow-lg py-1 min-w-[120px] hidden group-hover:block z-10">
                      {['available', 'busy', 'away'].map((status) => (
                        <button
                          key={status}
                          onClick={() => changeStatus(status)}
                          className={`w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 ${agentStatus === status ? 'bg-gray-50' : ''}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></span>
                          {getStatusText(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-green-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Pestañas Activos/Historial - NO mostrar cuando vemos un chat del historial */}
            {isJoined && !activeChat && !viewingHistoryChat && (
              <div className="flex mt-3 -mb-3 border-b border-green-500">
                <button
                  onClick={() => setShowHistory(false)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${!showHistory ? 'text-white border-b-2 border-white' : 'text-green-200 hover:text-white'}`}
                >
                  Activos ({chats.length})
                </button>
                <button
                  onClick={loadHistory}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${showHistory ? 'text-white border-b-2 border-white' : 'text-green-200 hover:text-white'}`}
                >
                  Historial
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {(connectionError || error) && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm flex justify-between items-center">
              <span>{connectionError || error}</span>
              {error && <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">✕</button>}
            </div>
          )}

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto">
            {/* Login de agente */}
            {!isJoined && (
              <div className="h-full flex flex-col justify-center p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">Acceso Soporte</h4>
                  <p className="text-gray-600 text-sm mt-1">Introduce tu nombre para comenzar</p>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && joinAsSupport()}
                  />
                  <button
                    onClick={joinAsSupport}
                    disabled={!isConnected}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Entrar al panel
                  </button>
                </div>
              </div>
            )}

            {/* Lista de chats */}
            {isJoined && !activeChat && !viewingHistoryChat && (
              <div className="p-4">
                {chats.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No hay chats pendientes</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => takeChat(chat)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          chat.status === 'pending'
                            ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                            : 'bg-green-50 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{chat.client_name}</p>
                            <p className="text-xs text-gray-500">{formatTime(chat.created_at)}</p>
                            {chat.agentName && chat.status === 'active' && (
                              <p className="text-xs text-green-600 mt-1">Atendido por {chat.agentName}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            chat.status === 'pending'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-green-200 text-green-800'
                          }`}>
                            {chat.status === 'pending' ? 'Pendiente' : 'Activo'}
                          </span>
                        </div>
                        <p className="text-xs mt-2 ${chat.status === 'pending' ? 'text-yellow-700' : 'text-green-700'}">
                          {chat.status === 'pending' ? 'Click para atender' : 'Click para ver'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Historial de chats cerrados */}
            {isJoined && !activeChat && showHistory && !viewingHistoryChat && (
              <div className="p-4">
                {closedChats.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No hay chats en el historial</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {closedChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => viewHistoryChat(chat)}
                        className="p-4 rounded-lg border bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{chat.client_name}</p>
                            <p className="text-xs text-gray-500">{formatTime(chat.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {chat.rating && (
                              <span className="text-yellow-500 text-sm">{'⭐'.repeat(chat.rating)}</span>
                            )}
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                              Cerrado
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click para ver conversación</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Vista de mensajes del historial */}
            {isJoined && viewingHistoryChat && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Info del chat - compacta */}
                <div className="flex items-center justify-center gap-3 py-2 text-xs text-gray-500">
                  <span>{formatTime(viewingHistoryChat.created_at)}</span>
                  {viewingHistoryChat.rating && (
                    <>
                      <span>•</span>
                      <span className="text-yellow-500">{'⭐'.repeat(viewingHistoryChat.rating)}</span>
                    </>
                  )}
                </div>

                {/* Mensajes */}
                {historyMessages.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-4">No hay mensajes en este chat</p>
                ) : (
                  historyMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'support' ? 'justify-end' : msg.sender_type === 'system' ? 'justify-center' : 'justify-start'}`}
                    >
                      {msg.sender_type === 'system' ? (
                        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {msg.message}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            msg.sender_type === 'support'
                              ? 'bg-green-600 text-white rounded-br-md'
                              : 'bg-gray-200 text-gray-800 rounded-bl-md'
                          }`}
                        >
                          <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender_name}</p>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Chat activo */}
            {isJoined && activeChat && (
              <div className="p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === 'support' ? 'justify-end' : msg.senderType === 'system' ? 'justify-center' : 'justify-start'}`}
                  >
                    {msg.senderType === 'system' ? (
                      <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {msg.message}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.senderType === 'support'
                            ? 'bg-green-600 text-white rounded-br-md'
                            : 'bg-gray-200 text-gray-800 rounded-bl-md'
                        }`}
                      >
                        {msg.senderType !== 'support' && (
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
          </div>

          {/* Input y acciones */}
          {isJoined && activeChat && (
            <div className="border-t border-gray-200 bg-gray-50">
              {/* Panel de respuestas rápidas */}
              {showQuickReplies && (
                <div className="p-2 border-b border-gray-200 bg-white max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-1">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => sendQuickReply(reply.text)}
                        className="text-left px-2 py-1.5 text-xs bg-gray-100 hover:bg-green-100 rounded transition-colors truncate"
                        title={reply.text}
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Panel de emojis */}
              {showEmojiPicker && (
                <div className="p-2 border-b border-gray-200 bg-white">
                  <div className="flex flex-wrap gap-1">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => insertEmoji(emoji)}
                        className="w-8 h-8 text-lg hover:bg-gray-100 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Barra de herramientas */}
              <div className="flex items-center gap-1 px-3 pt-2">
                <button
                  onClick={() => { setShowQuickReplies(!showQuickReplies); setShowEmojiPicker(false); }}
                  className={`p-1.5 rounded transition-colors ${showQuickReplies ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200 text-gray-500'}`}
                  title="Respuestas rápidas"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowQuickReplies(false); }}
                  className={`p-1.5 rounded transition-colors ${showEmojiPicker ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200 text-gray-500'}`}
                  title="Emojis"
                >
                  <span className="text-lg">😊</span>
                </button>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                  title="Transferir chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              <form onSubmit={sendMessage} className="p-3 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleTyping}
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="w-10 h-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </form>
              <div className="px-3 pb-3">
                <button
                  onClick={closeChat}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cerrar chat y solicitar valoración
                </button>
              </div>
            </div>
          )}

          {/* Modal de transferencia */}
          {showTransferModal && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
              <div className="bg-white rounded-lg p-4 w-full max-w-xs">
                <h4 className="font-semibold text-gray-800 mb-3">Transferir chat</h4>
                <p className="text-sm text-gray-600 mb-3">Esta función transferirá el chat a otro agente disponible.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => transferChat('next_available')}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Transferir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

export default SupportPanel;
