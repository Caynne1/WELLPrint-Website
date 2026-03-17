import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// ── Fetch all active products (with category join) ─────────────
export function useProducts({ categorySlug = null, search = '', sortBy = 'sort_order' } = {}) {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('products')
        .select(`
          id, name, slug, short_description, base_price,
          thumbnail_url, is_featured, turnaround_days, status, sort_order,
          categories ( id, name, slug )
        `)
        .eq('status', 'active')

      if (categorySlug) {
        // join filter via category slug
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single()
        if (cat) query = query.eq('category_id', cat.id)
      }

      if (search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`)
      }

      // sorting
      if (sortBy === 'price_asc')  query = query.order('base_price', { ascending: true })
      else if (sortBy === 'price_desc') query = query.order('base_price', { ascending: false })
      else if (sortBy === 'name')  query = query.order('name', { ascending: true })
      else                         query = query.order('sort_order', { ascending: true })

      const { data, error: err } = await query
      if (err) throw err
      setProducts(data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [categorySlug, search, sortBy])

  useEffect(() => { fetch() }, [fetch])

  return { products, loading, error, refetch: fetch }
}

// ── Fetch single product by slug (with variants) ───────────────
export function useProduct(slug) {
  const [product,  setProduct]  = useState(null)
  const [variants, setVariants] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!slug) return
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: prod, error: pErr } = await supabase
          .from('products')
          .select(`
            *,
            images,
            categories ( id, name, slug )
          `)
          .eq('slug', slug)
          .eq('status', 'active')
          .single()
        if (pErr) throw pErr

        const { data: vars, error: vErr } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', prod.id)
          .order('price', { ascending: true })
        if (vErr) throw vErr

        setProduct(prod)
        setVariants(vars ?? [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [slug])

  return { product, variants, loading, error }
}

// ── Fetch all categories (with real-time sync) ────────────────
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  const fetch = useCallback(async () => {
    // Try sort_order first, fall back to name if column missing
    let { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) {
      const fallback = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      data = fallback.data
    }
    setCategories(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()

    // Real-time: re-fetch whenever categories change so dropdowns/filters stay current
    const channel = supabase
      .channel('categories-hook-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetch()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetch])

  return { categories, loading, refetch: fetch }
}