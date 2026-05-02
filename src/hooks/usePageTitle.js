import { useEffect } from 'react'

const BASE = 'WELLPrint'

/**
 * Sets the document title for a page.
 * Usage:  usePageTitle('Products')  →  "Products — WELLPrint"
 *         usePageTitle()            →  "WELLPrint — Premium Printing Services"
 */
export default function usePageTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle} — ${BASE}`
      : `${BASE} — Premium Printing Services`
    return () => {
      document.title = `${BASE} — Premium Printing Services`
    }
  }, [pageTitle])
}