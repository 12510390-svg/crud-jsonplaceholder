
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // READ: mengambil data dengan GET
 
useEffect(() => {
  async function fetchPosts() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.json();

      // Menampilkan 10 postingan pertama dari API
      setPosts(data.slice(0, 10));
    } catch (error) {
      setMessage("Gagal memuat data. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  }

  fetchPosts();
}, []);

  // CREATE dan UPDATE
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!title.trim() || !body.trim()) {
      setMessage("Judul dan isi postingan wajib diisi.");
      return;
    }

    const postData = {
      userId: 1,
      title: title.trim(),
      body: body.trim(),
    };

    try {
      if (editingId !== null) {
        // UPDATE: PUT
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...postData }),
        });

        if (!response.ok) throw new Error("Gagal memperbarui");

        const updatedPost = await response.json();

        setPosts((current) =>
          current.map((post) =>
            post.id === editingId
              ? { ...post, ...updatedPost, ...postData }
              : post
          )
        );

        setMessage("Postingan berhasil diperbarui.");
      } else {
        // CREATE: POST
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });

        if (!response.ok) throw new Error("Gagal menambahkan");

        const newPost = await response.json();

        setPosts((current) => [
          { ...newPost, ...postData, id: Date.now() },
          ...current,
        ]);

        setMessage("Postingan berhasil ditambahkan.");
      }

      setTitle("");
      setBody("");
      setEditingId(null);
    } catch (error) {
      setMessage("Operasi gagal. Silakan coba lagi.");
    }
  }

  // Mengisi form untuk diedit
  function handleEdit(post) {
    setEditingId(post.id);
    setTitle(post.title);
    setBody(post.body);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // DELETE
  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus postingan ini?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal menghapus");

      setPosts((current) => current.filter((post) => post.id !== id));

      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setBody("");
      }

      setMessage("Postingan berhasil dihapus.");
    } catch (error) {
      setMessage("Gagal menghapus postingan.");
    }
  }

  function handleCancel() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setMessage("");
  }

  return (
    <main className="container">
      <header className="header">
        <p className="eyebrow">REACT + JAVASCRIPT + REST API</p>
        <h1>Post Manager</h1>
        <p>Kelola postingan menggunakan operasi CRUD.</p>
      </header>

      <section className="form-card">
        <h2>
          {editingId !== null ? "Edit Postingan" : "Tambah Postingan"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Judul</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Masukkan judul postingan"
            required
          />

          <label htmlFor="body">Isi Postingan</label>
          <textarea
            id="body"
            rows="4"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Tulis isi postingan..."
            required
          />

          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingId !== null ? "Simpan Perubahan" : "Tambah Postingan"}
            </button>

            {editingId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={handleCancel}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      {message && <p className="message" role="status">{message}</p>}

      <section className="posts-section">
        <div className="section-heading">
          <h2>Daftar Postingan</h2>
          <span>{posts.length} postingan</span>
        </div>

        {loading ? (
          <p className="empty-state">Sedang memuat data...</p>
        ) : posts.length === 0 ? (
          <p className="empty-state">Belum ada postingan.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article className="post-card" key={post.id}>
                <span className="post-id">ID: {post.id}</span>
                <h3>{post.title}</h3>
                <p>{post.body}</p>

                <div className="post-actions">
                  <button
                    className="edit-button"
                    type="button"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDelete(post.id)}
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>Data latihan dari JSONPlaceholder API</footer>
    </main>
  );
}

export default App;
