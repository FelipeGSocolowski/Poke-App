import { useState, useRef,  memo } from 'react'

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('')

  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className='search-input-wrapper'>
        <input
          type="text"
          ref={inputRef}
          placeholder="Search by name or ID (e.g., Pikachu or 25)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          className="search-input"
        />

        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={handleClear}
            disabled={loading}
            aria-label="Clear search"
          > × </button> )
        }
      </div>

      <button type="submit" className="search-submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default memo(SearchBar)