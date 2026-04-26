import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Pagination hook for Supabase queries.
 *
 * Usage:
 *   const {
 *     data, loading, error, page, totalPages, totalCount,
 *     goToPage, nextPage, prevPage, refetch,
 *   } = usePagination({
 *     queryFn: (range) =>
 *       supabase
 *         .from('orders')
 *         .select('*', { count: 'exact' })
 *         .order('created_at', { ascending: false })
 *         .range(range.from, range.to),
 *     pageSize: 20,
 *   })
 */
export default function usePagination({ queryFn, pageSize = 20, enabled = true }) {
  const [data, setData]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [page, setPage]             = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const abortRef = useRef(0)

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const fetchPage = useCallback(
    async (pageNum) => {
      if (!enabled) return

      const id = ++abortRef.current
      setLoading(true)
      setError(null)

      try {
        const from = (pageNum - 1) * pageSize
        const to = from + pageSize - 1

        const { data: rows, error: err, count } = await queryFn({ from, to })

        // Abort if a newer request was made
        if (id !== abortRef.current) return

        if (err) throw err

        setData(rows ?? [])
        if (typeof count === 'number') setTotalCount(count)
      } catch (e) {
        if (id !== abortRef.current) return
        setError(e.message || 'Failed to fetch data')
      } finally {
        if (id === abortRef.current) setLoading(false)
      }
    },
    [queryFn, pageSize, enabled]
  )

  // Fetch when page or queryFn changes
  useEffect(() => {
    fetchPage(page)
  }, [page, fetchPage])

  const goToPage = useCallback(
    (p) => {
      const clamped = Math.max(1, Math.min(p, totalPages))
      setPage(clamped)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1))
  }, [])

  const refetch = useCallback(() => {
    fetchPage(page)
  }, [fetchPage, page])

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    totalCount,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    refetch,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
