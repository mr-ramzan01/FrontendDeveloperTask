import React from 'react'

const Heading = ({text}: {text: string}) => {
  return (
    <h3 className='text-[32px] font-semibold'>{text}</h3>
  )
}

export default Heading