import React, { useEffect } from 'react'
import PDFviewer from '../components/PDFviewer'
import Convorsation from '../components/Convorsation'
import { useLocation } from "react-router-dom";

export default function Chat({ fileData }) {
    const location = useLocation();
    const fileName = location.state.fileName;
    useEffect(() => {
        console.info(fileData, "{Data}")
    }, [fileData])
    return (
        <div className='grid grid-cols-12   gap-4 h-screen bg-white'>
            <div className=' p-6 col-span-2 bg-gray rounded-sm'>
                <div className='flex flex-col justify-between items-center h-full'>
                    <div className='grid gap-4 text-left w-full'>
                        {
                            [1]?.map(_ => (
                                <div className='border-l-4  border-black  bg-green-600  shadow py-3 px-1.5 text-white font-semibold rounded-md'>
                                   {fileName}
                                </div>
                            ))
                        }
                    </div>

                   
                </div>
            </div>
            <div className='col-span-5 rounded-md'>
                <PDFviewer pdf={fileData} />
            </div>
            <div className=' p-4 col-span-5 bg-gray rounded-md '>
                <Convorsation />
            </div>
           
        </div>
    )
}
