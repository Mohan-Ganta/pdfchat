import React from 'react'

export default function Content () {
  return (
    <div className='flex gap-32 justify-center  w-[60vw] p-10 place-items-center '>
        <div className='grid place-items-center'>
            <img src="./src/assets/icon.png"   className='h-48 object-contain' alt="" />
       
        </div>
        <div>
            <h1 className='text-4xl font-bold' >It's not just reading anymore,
                                it's a conversation</h1>
            <p className='text-2xl'>Say hello to documents that respond to you! With AskYourPDF, your reading isn't just simple, it's fun!</p>
        </div>
    </div>
  )
}
