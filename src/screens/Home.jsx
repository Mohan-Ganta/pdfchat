import React from 'react'
import Fileupload from '../components/Fileupload'
import Content from '../components/Content'
import Cover from '../components/Cover'
import Footer from '../components/Footer'

export default function Home({setFileData}) {
  return (
    <div className='grid gap-6 h-100 bg-white'>
       <div className='flex justify-center' >
            <Content/>
        </div>
        <div className='grid place-items-center'>
            <Fileupload setFileData={setFileData} />
        </div>
        <div className='flex justify-center' >
            <Cover/>
        </div>
        
    </div>

  )
}
