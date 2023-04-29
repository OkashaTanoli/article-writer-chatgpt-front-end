'use client'

import { Loader } from '@/components';
import { Joan } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import Cookies from 'js-cookie'
import { IContext } from '@/types';
import { ContextApi } from '@/store/context';


function Login() {
    const [formdata, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { state, dispatch }: IContext = useContext(ContextApi)



    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formdata,
            [e.target.name]: e.target.value
        })
    }
    const router = useRouter()


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        // console.log(formdata)
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formdata.email,
                password: formdata.password,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                if (data.status) {
                    Cookies.set('userData', JSON.stringify(data.user))
                    dispatch({ type: 'AUTH', payload: data.user })
                    router.replace('/dashboard')
                    return
                }
                setError(data.message)
                setTimeout(() => {
                    setError('')
                }, 2000)

            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }



    return (
        <div className=''>
            <div className='w-[500px] sm:w-[90%] m-auto mt-10'>
                <h1 className='text-5xl sm:text-3xl text-center font-semibold text-main'>Login</h1>
                <p className='text-zinc-800 text-center mt-5'>Don&#39;t have an account? <Link href={'/signup'}>Signup</Link></p>
                <form action="" className='w-[70%] xs:w-full m-auto mt-10' onSubmit={handleSubmit}>
                    <div className='mb-5'>
                        <p className='text-zinc-700 text-sm tracking-widest'>EMAIL</p>
                        <input type="email" value={formdata.email} required name="email" id="email" onChange={handleChange} className='py-4 px-5 text-zinc-800 border border-zinc-500 w-full rounded-md' />
                    </div>
                    <div className='mb-5'>
                        <p className='text-zinc-700 text-sm tracking-widest'>PASSWORD</p>
                        <input type="password" value={formdata.password} required name="password" id="password" onChange={handleChange} className='py-4 px-5 text-zinc-800 border border-zinc-500 w-full rounded-md' />
                    </div>
                    {
                        error &&
                        <p className='text-red-700'>{error}</p>
                    }
                    <div className='flex justify-center mt-10'>
                        <button disabled={loading} className='text-sm text-white tracking-widest bg-blue-500 w-[200px] text-center py-4'>{loading ? <Loader height='h-4' width='w-4' /> : 'LOGIN'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;