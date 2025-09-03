import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Note = { _id: string; title: string; content: string; };
type User = { id: string; name: string; email: string };

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  async function load() {
    try {
      const token = localStorage.getItem('access')!;
      if (!token) { window.location.href = '/signin'; return; }
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.sub, name: payload.name, email: payload.email });
      const data = await api.notes.list(token);
      setNotes(data);
    } catch (e:any) { setError(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access')!;
      const note = await api.notes.create(token, title, content);
      setNotes([note, ...notes]);
      setTitle(''); setContent('');
    } catch (e:any) { setError(e.message); }
  }

  async function remove(id: string) {
    try {
      const token = localStorage.getItem('access')!;
      await api.notes.remove(token, id);
      setNotes(notes.filter(n => n._id !== id));
    } catch (e:any) { setError(e.message); }
  }

  async function signOut() {
    await api.auth.logout();
    localStorage.removeItem('access');
    window.location.href = '/signin';
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:800}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="brand">Notely</div>
          <button className="link" onClick={signOut} style={{background:'transparent',border:'none',padding:0}}>Sign Out</button>
        </div>
        <h2 className="h1">Dashboard</h2>
        <div className="sub">{user ? <>Welcome, <b>{user.name}</b> — {user.email}</> : 'Loading...'}</div>

        <form className="form" onSubmit={addNote}>
          <div>
            <label>Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Note title" required />
          </div>
          <div>
            <label>Content</label>
            <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Write something..." rows={4} />
          </div>
          <button style={{alignSelf:'flex-start'}}>Add Note</button>
        </form>

        <div className="notes">
          {error && <div className="footer" style={{color:'var(--danger)'}}>{error}</div>}
          {notes.length===0 && <div className="small">No notes yet</div>}
          {notes.map(n=>(
            <div className="note" key={n._id}>
              <div>
                <div className="title">{n.title}</div>
                <div className="small" style={{marginTop:6}}>{n.content}</div>
              </div>
              <div>
                <button onClick={()=>remove(n._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
