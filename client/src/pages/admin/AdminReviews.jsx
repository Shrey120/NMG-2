import { useLoad } from '../../useLoad.js';
import { patch } from '../../api.js';
import Loading from '../../components/Loading.jsx';

export default function AdminReviews() {
  const { data, loading, reload } = useLoad('/testimonials?all=true');
  const reviews = data || [];

  async function toggleApproval(review) {
    await patch(`/testimonials/${review.id}`, { approved: review.approved === 0 });
    reload();
  }

  if (loading) return <Loading />;

  const waiting = reviews.filter((r) => r.approved === 0);
  const published = reviews.filter((r) => r.approved === 1);

  function Card({ review }) {
    return (
      <article className="card card-body">
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
            <strong style={{ display: 'block', marginTop: 10 }}>{review.name}</strong>
            <span className="small muted">{review.vehicle} - {review.createdAt}</span>
          </div>
          <span className="badge badge-quiet">{review.approved === 1 ? 'Published' : 'Waiting'}</span>
        </div>

        <p className="small" style={{ marginTop: 14 }}>{review.quote}</p>

        <button
          className={review.approved === 1 ? 'btn btn-outline btn-small' : 'btn btn-small'}
          style={{ marginTop: 16 }}
          onClick={() => toggleApproval(review)}
        >
          {review.approved === 1 ? 'Unpublish' : 'Approve and publish'}
        </button>
      </article>
    );
  }

  return (
    <div>
      <h1>Testimonials</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Reviews stay hidden from the public site until they are approved here.
      </p>

      {waiting.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.1rem', margin: '28px 0 16px' }}>Waiting for approval ({waiting.length})</h2>
          <div className="grid grid-2">
            {waiting.map((review) => <Card key={review.id} review={review} />)}
          </div>
        </>
      )}

      <h2 style={{ fontSize: '1.1rem', margin: '28px 0 16px' }}>Published ({published.length})</h2>
      <div className="grid grid-2">
        {published.map((review) => <Card key={review.id} review={review} />)}
      </div>
    </div>
  );
}
