import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = 'http://localhost:3000/api';

function AdminPanel() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordModal, setPasswordModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const token = localStorage.getItem('token');

  // Cargar usuarios y estadísticas
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar estadísticas');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error stats:', err);
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Error al actualizar usuario');
      const updated = await res.json();
      setUsers(users.map(u => u.id === userId ? updated : u));
      setSuccess(t('admin.userUpdated'));
      setEditingUser(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError(t('admin.passwordMinLength'));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/admin/users/${passwordModal.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      if (!res.ok) throw new Error('Error al cambiar contraseña');
      setSuccess(t('admin.passwordChanged'));
      setPasswordModal(null);
      setNewPassword('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar usuario');
      }
      setUsers(users.filter(u => u.id !== userId));
      setSuccess(t('admin.userDeleted'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.display_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">{t('admin.title')}</h1>

      {/* Mensajes de error/éxito */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          {success}
        </div>
      )}

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
            <p className="text-sm text-slate-500">{t('admin.totalUsers')}</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
            <p className="text-sm text-slate-500">{t('admin.clients')}</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalClients}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
            <p className="text-sm text-slate-500">{t('admin.supportAgents')}</p>
            <p className="text-2xl font-bold text-green-600">{stats.totalSupport}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
            <p className="text-sm text-slate-500">{t('admin.avgRating')}</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.avgRating ? stats.avgRating.toFixed(1) : '-'} ⭐
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('admin.searchUsers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">{t('admin.allRoles')}</option>
              <option value="client">{t('admin.roleClient')}</option>
              <option value="support">{t('admin.roleSupport')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">{t('admin.email')}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">{t('admin.displayName')}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">{t('admin.role')}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">{t('admin.createdAt')}</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">{user.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {editingUser?.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.display_name || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, display_name: e.target.value })}
                        className="px-2 py-1 border rounded w-full"
                      />
                    ) : (
                      user.display_name || '-'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingUser?.id === user.id ? (
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="client">Client</option>
                        <option value="support">Support</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'support' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'support' ? t('admin.roleSupport') : t('admin.roleClient')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      {editingUser?.id === user.id ? (
                        <>
                          <button
                            onClick={() => updateUser(user.id, {
                              display_name: editingUser.display_name,
                              role: editingUser.role
                            })}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            {t('common.save')}
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                          >
                            {t('common.cancel')}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            title={t('common.edit')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setPasswordModal(user)}
                            className="p-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                            title={t('admin.changePassword')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            title={t('common.delete')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            {t('admin.noUsers')}
          </div>
        )}
      </div>

      {/* Modal cambiar contraseña */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {t('admin.changePasswordFor')} {passwordModal.email}
            </h3>
            <input
              type="password"
              placeholder={t('admin.newPassword')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={changePassword}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                {t('admin.changePassword')}
              </button>
              <button
                onClick={() => { setPasswordModal(null); setNewPassword(''); }}
                className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
