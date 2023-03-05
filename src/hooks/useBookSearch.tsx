import { useEffect, useState } from 'react'
import axios, { Canceler } from 'axios'

interface Book {
  title: string
}

const useBookSearch = (query: string, pageNumber: number) => {
  const [books, setBooks] = useState<Book[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)

    let cancel: Canceler

    axios({
      method: 'GET',
      url: 'https://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...res.data.docs.map((b: any) => b.title),
            ]),
          ]
        })
        setHasMore(res.data.docs.length > 0)
        setLoading(false)
        console.log(res.data.docs)
      })
      .catch((e) => {
        if (axios.isCancel(e)) return
        setError(true)
      })

    return () => cancel()
  }, [query, pageNumber])
  return { loading, error, books, hasMore }
}

export default useBookSearch
