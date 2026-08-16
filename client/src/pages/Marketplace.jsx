import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../api.js';
import { useApi } from '../useApi.js';
import { PageHeader, Thumb, Badge, StatusPill, Loader, Empty, Button } from '../components/ui.jsx';

const BLANK = { q: '', category: '', make: '', condition: '', maxPrice: '', sort: 'newest' };

export default function Marketplace() {
  const [filters, setFilters] = useState(BLANK);
  const [draft, setDraft] = useState('');

  const { data, loading } = useApi(() => api.listings(filters), [JSON.stringify(filters)]);
  const items = data?.items || [];
  const facets = data?.facets || { categories: [], makes: [], conditions: [] };

  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const active = Object.entries(filters).filter(([k, v]) => v && k !== 'sort').length;

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Parts for sale"
        blurb="OEM, NOS and performance parts from the workshop's rotating stock. Enquire on anything here and we will confirm availability and freight."
      >
        <form
          className="mt-8 flex max-w-xl gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            set('q', draft);
          }}
        >
          <input
            className="field"
            placeholder="Search parts, part numbers, fitment…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
      </PageHeader>

      <div className="mx-auto max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:flex">
        {/* Filters */}
        <aside className="mb-8 lg:mb-0 lg:w-64 lg:shrink-0">
          <div className="panel sticky top-24 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filters</h2>
              {active > 0 && (
                <button
                  onClick={() => {
                    setFilters(BLANK);
                    setDraft('');
                  }}
                  className="text-xs text-accent hover:underline"
                >
                  Clear ({active})
                </button>
              )}
            </div>

            <div className="space-y-4">
              {[
                ['category', 'Category', facets.categories],
                ['make', 'Marque', facets.makes],
                ['condition', 'Condition', facets.conditions],
              ].map(([key, label, options]) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
                    {label}
                  </span>
                  <select className="field" value={filters[key]} onChange={(e) => set(key, e.target.value)}>
                    <option value="">All</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              ))}

              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
                  Max price
                </span>
                <input
                  type="number"
                  className="field"
                  placeholder="Any"
                  value={filters.maxPrice}
                  onChange={(e) => set('maxPrice', e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Sort</span>
                <select className="field" value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <p className="mb-5 text-sm text-muted">
            {loading ? 'Searching…' : `${items.length} ${items.length === 1 ? 'part' : 'parts'} found`}
            {filters.q && <> for “{filters.q}”</>}
          </p>

          {loading ? (
            <Loader />
          ) : items.length === 0 ? (
            <Empty
              title="No parts match that search"
              blurb="Try removing a filter, or post what you are chasing in Parts Wanted and we will keep an eye out."
              action={
                <Button as="link" to="/parts-wanted" variant="ghost">
                  Post a wanted ad
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((l) => (
                <Link
                  key={l.id}
                  to={`/marketplace/${l.id}`}
                  className="panel group flex flex-col overflow-hidden transition hover:border-accent/50"
                >
                  <Thumb
                    label={l.title}
                    seed={l.id}
                    ratio="aspect-[5/3]"
                    className="rounded-none border-0 border-b"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] uppercase tracking-wider text-muted">
                        {l.category}
                      </span>
                      <StatusPill status={l.status} />
                    </div>
                    <h2 className="line-clamp-2 text-sm font-semibold transition group-hover:text-accent">
                      {l.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted">{l.fitment}</p>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <span className="font-mono text-lg font-bold text-accent">{money(l.price)}</span>
                      <Badge>{l.condition}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
