import { memo } from 'react'

const Pagination = ({ gotoPrevPage, gotoNextPage }) => {
  return (
    <div className='pagination'>
      {gotoPrevPage && <button className='prev' onClick={gotoPrevPage}> Previous </button>}

      {gotoNextPage && <button className='next' onClick={gotoNextPage}> Next </button>}
    </div>
  )
}

export default memo(Pagination)