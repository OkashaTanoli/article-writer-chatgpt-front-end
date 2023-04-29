'use client'

import Image from 'next/image'
import styles from './page.module.css'
import Img from '@/public/hero.png'
import Link from 'next/link'
import { useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import { IContext } from '@/types'
import { ContextApi } from '@/store/context'


export default function Home() {
    const { state, dispatch }: IContext = useContext(ContextApi)

    useEffect(() => {
        const user = Cookies.get('userData')
        if (user) {
            const parsed_user = JSON.parse(user)
            console.log(parsed_user)
            dispatch({ type: 'AUTH', payload: parsed_user })
        }
    }, [dispatch])

    return (
        <div>
            <div className={`pt-10`}>
                <div className='w-[1300px] xl:w-[90%] flex lg-md:block justify-between items-center gap-10 m-auto'>
                    <div className='w-1/2 lg-md:w-full'>
                        <h1 className='text-4xl text-main font-bold'>ONEclick Writer</h1>
                        <p className='text-zinc-800 font-semibold mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et iusto nihil vel aliquid id veritatis corrupti nemo debitis repellendus corporis, doloremque iure veniam accusamus commodi soluta minus harum suscipit distinctio!</p>
                        <div className='flex gap-10 mt-10 sm:block'>
                            <Link href={'/signup'}><button className='py-4 text-white text-sm tracking-widest w-[200px] sm:w-full mb-5 text-center bg-blue-500'>JOIN NOW</button></Link>
                            <Link href={'/login'}><button className='py-4 text-white text-sm tracking-widest w-[200px] sm:w-full mb-5 text-center bg-blue-500'>LOGIN</button></Link>
                        </div>
                    </div>
                    <div className='flex items-end w-1/2 lg-md:w-full'>
                        <Image src={Img} alt='hero' className='w-[90%] lg-md:w-full' />
                    </div>
                </div>
            </div>
        </div>
    )
}
