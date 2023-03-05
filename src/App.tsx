import { useCallback, useRef, useState } from 'react'
import useBookSearch from './hooks/useBookSearch'
import styled from 'styled-components'
import './styles.css'

const App = () => {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber)
  const observer = useRef<null | IntersectionObserver>(null)

  const lastBookElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <Container>
      <Title>Find Books</Title>
      <Search>
        <Input
          name="bookSearch"
          type="text"
          value={query}
          onChange={handleSearch}
          required
        />
        <div></div>
        <Label htmlFor="bookSearch">Keyword</Label>
      </Search>
      <Result>
        {books.map((book: any, idx) => {
          if (books.length === idx + 1) {
            return (
              <Book ref={lastBookElementRef} key={idx}>
                {book}
              </Book>
            )
          } else {
            return <Book key={idx}>{book}</Book>
          }
        })}
      </Result>
      <Sub>
        <div> {loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </Sub>
    </Container>
  )
}

export default App

const Container = styled.div`
  margin: 5rem 0;
  width: 800px;
  padding: 30px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Title = styled.h1`
  font-size: 35px;
  margin-bottom: 3rem;
`

const Search = styled.div`
  width: 100%;
  position: relative;

  div:nth-child(2) {
    position: absolute;
    bottom: 0;
    height: 2px;
    width: 100%;

    ::before {
      height: 100%;
      width: 100%;
      content: '';
      position: absolute;
      background: linear-gradient(
        to right,
        rgb(233, 170, 191),
        rgb(255, 148, 114)
      );
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
  }

  input:focus ~ div:nth-child(2)::before,
  input:valid ~ div:nth-child(2)::before {
    transform: scaleX(1);
    transition: transform 0.3s ease;
  }
`

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  border-bottom: 2px solid silver;
  font-family: 'NanumSquare', sans-serif;
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 0.5px;

  &:focus ~ label,
  &:valid ~ label {
    transform: translateY(-30px);
    color: rgb(250, 128, 114);
    font-size: 14px;
  }
`

const Label = styled.label`
  position: absolute;
  pointer-events: none;
  bottom: 9px;
  left: 0;
  color: rgb(179, 171, 171);
  transition: all 0.3s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 800;
  font-size: 20px;
`

const Result = styled.div`
  width: 100%;
`

const Book = styled.div`
  padding: 0.5rem 0;
  font-size: 17px;
  color: rgb(51, 51, 51);
  font-weight: 600;

  &:hover {
    color: rgb(255, 255, 255);
    background-color: rgb(250, 128, 114);
    padding: 0.5rem 0;
    cursor: pointer;
  }
`

const Sub = styled.div`
  div {
    padding: 0.3rem 0;
    color: rgb(194, 192, 192);
  }
`
