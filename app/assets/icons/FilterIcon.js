import React from 'react'

const FilterIcon = ({ ...props }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.3334 4.66675L7.33337 4.66675" stroke="#131123" strokeLinecap="round" />
      <path d="M2.66663 11.3333L8.66663 11.3333" stroke="#131123" strokeLinecap="round" />
      <path d="M2.66663 8H4.66663L13.3333 8" stroke="#131123" strokeLinecap="round" />
    </svg>
  )
}

export default FilterIcon