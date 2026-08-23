import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import { money } from '../api.js';
import Photo from '../components/Photo.jsx';
import Loading from '../components/Loading.jsx';

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [typed, setTyped] = useState('');
  const [category, setCategory] = useState('');
  const [make, setMake] = useState('');
  const [sort, setSort] = useState('newest');

  // The filters become the query string, so changing one reloads the data.
  const query = new URLSearchParams({ search, category, make, sort }).toString();
  const { data, loading } = useLoad(`/listings?${query}`);

  const listings = data?.listings || [];

  function clearAll() {
    setSearch('');
    setTyped('');
    setCategory('');
    setMake('');
    setSort('newest');
  }

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Marketplace</p>
          <h1 style={{ marginTop: 12 }}>Parts for sale</h1>

          <form
            className="row"
            style={{ marginTop: 24, maxWidth: 520, flexWrap: 'nowrap' }}
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(typed);
            }}
          >
            <input
              className="input"
              placeholder="Search parts, part numbers, fitment"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              aria-label="Search parts"
            />
            <button type="submit" className="btn">Search</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="with-filters">
            {/* Filters */}
            <aside className="card card-body">
              <div className="between" style={{ alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem' }}>Filters</h3>
                <button className="link-button small" onClick={clearAll}>Clear</button>
              </div>

              <div className="stack" style={{ marginTop: 16 }}>
                <div>
                  <label className="label" htmlFor="f-category">Category</label>
                  <select id="f-category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All categories</option>
                    {(data?.categories || []).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label" htmlFor="f-make">Marque</label>
                  <select id="f-make" className="input" value={make} onChange={(e) => setMake(e.target.value)}>
                    <option value="">All marques</option>
                    {(data?.makes || []).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label" htmlFor="f-sort">Sort by</label>
                  <select id="f-sort" className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="cheapest">Price: low to high</option>
                    <option value="dearest">Price: high to low</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div>
              <p className="small muted" style={{ marginBottom: 16 }}>
                {loading ? 'Searching...' : `${listings.length} part${listings.length === 1 ? '' : 's'} found`}
              </p>

              {loading ? (
                <Loading />
              ) : listings.length === 0 ? (
                <div className="empty">
                  <h3>No parts match that search</h3>
                  <p className="small muted" style={{ marginTop: 8 }}>
                    Try removing a filter, or post what you are chasing in Parts Wanted.
                  </p>
                  <Link to="/wanted" className="btn btn-outline" style={{ marginTop: 20 }}>
                    Post a wanted ad
                  </Link>
                </div>
              ) : (
                <div className="grid grid-3">
                  {listings.map((listing) => (
                    <Link to={`/marketplace/${listing.id}`} key={listing.id} className="card">
                      <Photo name={listing.title} />
                      <div className="card-body">
                        <div className="between" style={{ alignItems: 'center', gap: 8 }}>
                          <span className="small muted">{listing.category}</span>
                          {listing.status !== 'available' && (
                            <span className="badge badge-solid">{listing.status}</span>
                          )}
                        </div>
                        <h3 style={{ fontSize: '0.95rem', marginTop: 8 }}>{listing.title}</h3>
                        <p className="small muted" style={{ marginTop: 6 }}>{listing.fitment}</p>
                        <p className="mono" style={{ marginTop: 12, fontWeight: 700 }}>{money(listing.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
