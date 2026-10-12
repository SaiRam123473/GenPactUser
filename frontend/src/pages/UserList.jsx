import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage, usersApi } from '../services/api.js';

export default function UserList({ notice, clearNotice }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadUsers() {
    setLoading(true); setError('');
    try { setUsers(await usersApi.getAll()); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadUsers(); }, []);

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    setDeletingId(user.id); setError('');
    try { await usersApi.remove(user.id); setUsers(current => current.filter(item => item.id !== user.id)); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setDeletingId(null); }
  }

  return <section>
    <div className="page-heading"><div><p className="eyebrow">DIRECTORY</p><h1>Users</h1><p className="subtitle">View and manage the people in your directory.</p></div><Link className="button primary" to="/add"><span>＋</span> Add user</Link></div>
    {notice && <div className="alert success" role="status"><span className="alert-icon">✓</span>{notice}<button className="alert-close" onClick={clearNotice} aria-label="Dismiss notification">×</button></div>}
    {error && <div className="alert danger" role="alert"><span className="alert-icon">!</span><span>{error}</span><button className="button small secondary" onClick={loadUsers}>Try again</button></div>}
    <div className="panel"><div className="panel-header"><div><h2>All users</h2><p>{loading ? 'Loading directory…' : `${users.length} ${users.length === 1 ? 'user' : 'users'} found`}</p></div><span className="table-label">USER DIRECTORY</span></div>
      {loading ? <div className="loading-state"><span className="spinner"/><span>Loading users…</span></div> : users.length === 0 && !error ? <div className="empty-state"><div className="empty-icon">♙</div><h3>No users yet</h3><p>Add your first user to get started.</p><Link to="/add" className="button primary">Add first user</Link></div> : !loading && users.length > 0 ? <div className="table-wrap"><table><thead><tr><th>Name</th><th>Age</th><th>City</th><th>State</th><th>Pincode</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{users.map(user => <tr key={user.id}><td><div className="user-cell"><span className="avatar">{user.name.trim().charAt(0).toUpperCase()}</span><span className="user-name">{user.name}</span></div></td><td>{user.age}</td><td>{user.city}</td><td>{user.state}</td><td><span className="pincode">{user.pincode}</span></td><td className="actions"><button className="text-button delete" disabled={deletingId === user.id} onClick={() => deleteUser(user)}>{deletingId === user.id ? 'Deleting…' : 'Delete'}</button></td></tr>)}</tbody></table></div> : null}
    </div>
  </section>;
}
