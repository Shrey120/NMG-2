import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { remove } from '../../api.js';
import Loading from '../../components/Loading.jsx';

export default function AdminPosts() {
  const wanted = useLoad('/wanted');
  const exchanges = useLoad('/exchanges');
  const [tab, setTab] = useState('wanted');

  const showingWanted = tab === 'wanted';
  const source = showingWanted ? wanted : exchanges;
  const posts = source.data || [];

  async function deletePost(post) {
    if (!confirm(`Remove "${post.title}"?`)) return;
    await remove(`/${showingWanted ? 'wanted' : 'exchanges'}/${post.id}`);
    source.reload();
  }

  return (
    <div>
      <h1>Wanted &amp; Exchange</h1>
      <p className="muted" style={{ marginTop: 6 }}>Posts made by the workshop and by site visitors.</p>

      <div className="row" style={{ margin: '24px 0' }}>
        <button className={showingWanted ? 'pill pill-on' : 'pill'} onClick={() => setTab('wanted')}>
          Parts Wanted ({wanted.data?.length || 0})
        </button>
        <button className={!showingWanted ? 'pill pill-on' : 'pill'} onClick={() => setTab('exchange')}>
          Exchange ({exchanges.data?.length || 0})
        </button>
      </div>

      {source.loading ? (
        <Loading />
      ) : (
        <div className="stack">
          {posts.map((post) => (
            <article key={post.id} className="card card-body between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="row" style={{ gap: 8 }}>
                  {post.isStaff === 1 && <span className="badge">Workshop</span>}
                  {post.make && <span className="badge badge-quiet">{post.make}</span>}
                </div>
                <h3 style={{ marginTop: 10 }}>{post.title}</h3>
                <p className="small muted" style={{ marginTop: 6 }}>
                  {showingWanted ? post.description : `${post.offering} for ${post.wanting}`}
                </p>
                <p className="small muted" style={{ marginTop: 8 }}>
                  {post.postedBy} - {post.createdAt}
                </p>
              </div>
              <button className="link-button small" onClick={() => deletePost(post)}>Remove</button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
