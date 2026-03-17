import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import { useProducts, useCategories } from '../hooks/useProducts'
import {
  ArrowRight, Search, Grid, List,
  Clock, ImagePlus, ChevronRight, Package, X, RefreshCw
} from 'lucide-react'

function formatPHP(n) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })
}

function useScrollReveal(deps = []) {
  useEffect(() => {
    // Small delay to let React finish rendering the new cards
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.animate-on-scroll:not(.visible)')
      if (!els.length) return
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
        { threshold: 0.05 }
      )
      els.forEach(el => io.observe(el))
      return () => io.disconnect()
    }, 50)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

function ProductCard({ product, view }) {
  const { slug, name, short_description, base_price, thumbnail_url, turnaround_days, categories, min_qty, unit } = product

  if (view === 'list') {
    return (
      <div className="card-press flex gap-5 p-5 group">
        <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0 flex items-center justify-center"
          style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
          {thumbnail_url
            ? <img src={thumbnail_url} alt={name} className="w-full h-full object-cover" />
            : <ImagePlus size={20} style={{ color: 'var(--text-faint)' }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold group-hover:text-wp-green transition-colors"
              style={{ fontFamily: "'Lora', serif", color: 'var(--text-primary)' }}>{name}</h3>
            {categories?.name && (
              <span className="text-[9px] font-body px-2 py-0.5 rounded-sm"
                style={{ background: 'rgba(25,147,210,0.10)', color: '#1993D2', border: '1px solid rgba(25,147,210,0.2)' }}>
                {categories.name}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed mb-2 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{short_description}</p>
          <div className="flex items-center gap-3">
            {turnaround_days && (
              <span className="flex items-center gap-1 text-[10px] font-body" style={{ color: 'var(--text-faint)' }}>
                <Clock size={9} /> {turnaround_days}d turnaround
              </span>
            )}
            {min_qty && (
              <span className="text-[10px] font-body" style={{ color: 'var(--text-faint)' }}>Min. {min_qty} {unit ?? 'pcs'}</span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right flex flex-col justify-between">
          <div>
            <div className="font-bold text-base" style={{ fontFamily: "'Lora', serif", color: 'var(--text-primary)' }}>
              {formatPHP(base_price)}
            </div>
            <div className="text-[10px] font-body" style={{ color: 'var(--text-faint)' }}>starting price</div>
          </div>
          <Link to={`/products/${slug}`} className="btn-press text-xs py-2 px-4 whitespace-nowrap mt-3">Order Now</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card-press flex flex-col overflow-hidden group">
      <div className="relative" style={{ aspectRatio: '4/3', background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-subtle)' }}>
        {thumbnail_url
          ? <img src={thumbnail_url} alt={name} className="w-full h-full object-cover" />
          : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <ImagePlus size={26} style={{ color: 'var(--text-faint)', opacity: 0.5 }} />
              <span className="font-body text-[8px] tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>No Photo</span>
            </div>
          )}
        {categories?.name && (
          <div className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-body font-bold tracking-wider uppercase rounded-sm"
            style={{ background: 'rgba(25,147,210,0.18)', color: '#1993D2', border: '1px solid rgba(25,147,210,0.3)', backdropFilter: 'blur(4px)' }}>
            {categories.name}
          </div>
        )}
        {turnaround_days && (
          <div className="absolute top-3 right-3 px-2 py-0.5 text-[8px] font-body tracking-wide rounded-sm flex items-center gap-1"
            style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
            <Clock size={8} /> {turnaround_days}d
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-semibold mb-1.5 leading-snug group-hover:text-wp-green transition-colors"
          style={{ fontFamily: "'Lora', serif", color: 'var(--text-primary)' }}>{name}</h3>
        <p className="text-xs leading-relaxed mb-4 line-clamp-2 flex-1" style={{ color: 'var(--text-muted)' }}>
          {short_description || 'Premium quality printing service.'}
        </p>
        {min_qty && (
          <div className="mb-4">
            <span className="text-[9px] font-body px-2 py-0.5 rounded-sm"
              style={{ background: 'var(--surface-raised)', color: 'var(--text-faint)', border: '1px solid var(--border-subtle)' }}>
              Min. {min_qty} {unit ?? 'pcs'}
            </span>
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="font-bold text-lg leading-none" style={{ fontFamily: "'Lora', serif", color: 'var(--text-primary)' }}>
              {formatPHP(base_price)}
            </div>
            <div className="text-[9px] font-body mt-0.5" style={{ color: 'var(--text-faint)' }}>starting price</div>
          </div>
          <Link to={`/products/${slug}`} className="btn-press text-[10px] py-2 px-3 shrink-0">
            Order <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProductSkeleton({ view }) {
  if (view === 'list') {
    return (
      <div className="card-press flex gap-5 p-5 animate-pulse">
        <div className="w-20 h-20 rounded-sm shrink-0" style={{ background: 'var(--surface-raised)' }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded-sm w-2/3" style={{ background: 'var(--surface-raised)' }} />
          <div className="h-3 rounded-sm w-full" style={{ background: 'var(--surface-raised)' }} />
          <div className="h-3 rounded-sm w-1/3" style={{ background: 'var(--surface-raised)' }} />
        </div>
        <div className="w-24 space-y-2">
          <div className="h-5 rounded-sm" style={{ background: 'var(--surface-raised)' }} />
          <div className="h-8 rounded-sm" style={{ background: 'var(--surface-raised)' }} />
        </div>
      </div>
    )
  }
  return (
    <div className="card-press overflow-hidden animate-pulse">
      <div style={{ aspectRatio: '4/3', background: 'var(--surface-raised)' }} />
      <div className="p-5 space-y-3">
        <div className="h-4 rounded-sm w-3/4" style={{ background: 'var(--surface-raised)' }} />
        <div className="h-3 rounded-sm w-full" style={{ background: 'var(--surface-raised)' }} />
        <div className="h-3 rounded-sm w-2/3" style={{ background: 'var(--surface-raised)' }} />
        <div className="flex justify-between items-end pt-2">
          <div className="h-6 w-20 rounded-sm" style={{ background: 'var(--surface-raised)' }} />
          <div className="h-8 w-20 rounded-sm" style={{ background: 'var(--surface-raised)' }} />
        </div>
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { value: 'sort_order', label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name',       label: 'Name A–Z' },
]

export default function ProductsPage() {
  const [search, setSearch]   = useState('')
  const [catSlug, setCatSlug] = useState(null)
  const [sortBy, setSortBy]   = useState('sort_order')
  const [view, setView]       = useState('grid')

  const { products, loading, error, refetch } = useProducts({ categorySlug: catSlug, search, sortBy })
  const { categories, loading: catsLoading }  = useCategories()

  useScrollReveal([products])

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-page)' }}>
      <PageHero
        title="Our Products"
        subtitle="Premium printing, delivered fast. Browse our full catalog — every product is crafted to make your brand look its best."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
      />

      {/* Sticky filters bar */}
      <div className="sticky top-16 z-30 border-b" style={{ background: 'var(--surface-page)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">

          {/* Search */}
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-faint)' }} />
            <input type="text" placeholder="Search products…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-sm pl-9 pr-8 py-2 text-sm outline-none transition-all"
              style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setCatSlug(null)}
              className="text-[10px] font-body px-3 py-1.5 rounded-sm border transition-all"
              style={{
                background: catSlug === null ? 'var(--wp-green)' : 'transparent',
                color: catSlug === null ? '#fff' : 'var(--text-muted)',
                borderColor: catSlug === null ? 'var(--wp-green)' : 'var(--border-subtle)',
              }}>All</button>
            {!catsLoading && categories.map(c => (
              <button key={c.id} onClick={() => setCatSlug(catSlug === c.slug ? null : c.slug)}
                className="text-[10px] font-body px-3 py-1.5 rounded-sm border transition-all"
                style={{
                  background: catSlug === c.slug ? 'var(--wp-green)' : 'transparent',
                  color: catSlug === c.slug ? '#fff' : 'var(--text-muted)',
                  borderColor: catSlug === c.slug ? 'var(--wp-green)' : 'var(--border-subtle)',
                }}>{c.name}</button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-[11px] font-body rounded-sm px-3 py-2 outline-none border transition-all"
            style={{ background: 'var(--surface-card)', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* View toggle */}
          <div className="flex items-center rounded-sm border overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
            {[{ v: 'grid', Icon: Grid }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
              <button key={v} onClick={() => setView(v)} className="p-2 transition-all"
                style={{ background: view === v ? 'var(--wp-green)' : 'var(--surface-card)', color: view === v ? '#fff' : 'var(--text-faint)' }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-body" style={{ color: 'var(--text-faint)' }}>
            {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </p>
          {(catSlug || search) && (
            <button onClick={() => { setCatSlug(null); setSearch('') }}
              className="text-[10px] font-body flex items-center gap-1 transition-colors"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--wp-green)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}>
              <X size={10} /> Clear filters
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Could not load products. {error}</p>
            <button onClick={refetch} className="btn-press text-xs py-2 px-4 flex items-center gap-2 mx-auto">
              <RefreshCw size={12} /> Try Again
            </button>
          </div>
        )}

        {/* Skeletons */}
        {loading && !error && (
          <div className={view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
            : 'flex flex-col gap-4'}>
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} view={view} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-5"
              style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
              <Package size={28} style={{ color: 'var(--text-faint)' }} />
            </div>
            <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'Lora', serif", color: 'var(--text-primary)' }}>
              No products found
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              {search || catSlug ? 'Try adjusting your search or filters.' : 'No active products yet.'}
            </p>
            {(search || catSlug) && (
              <button onClick={() => { setCatSlug(null); setSearch('') }} className="btn-press text-xs py-2 px-5">
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className={view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
            : 'flex flex-col gap-4'}>
            {products.map(p => <ProductCard key={p.id} product={p} view={view} />)}
          </div>
        )}
      </div>

      {/* CTA footer */}
      {!loading && !error && (
        <div className="border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-raised)' }}>
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Lora', serif", color: 'var(--text-primary)' }}>
              Can't find what you need?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              We handle custom print jobs too. Get in touch and we'll work out the details.
            </p>
            <Link to="/contact" className="btn-press">
              Request a Custom Quote <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
