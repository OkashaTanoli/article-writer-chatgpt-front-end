'use client'

import { Loader } from '@/components';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

function Login() {

    const router = useRouter()

    const [formdata, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        key: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formdata,
            [e.target.name]: e.target.value
        })
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formdata.name,
                email: formdata.email,
                password: formdata.password,
                key: formdata.key,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data)
                if (data.status) {
                    setSuccess(true)
                    setTimeout(() => { }, 1000)
                    router.push('/login')
                    return
                }
                setError(data.message)
                setTimeout(() => {
                    setError('')
                }, 3000)

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
                <h1 className='text-5xl sm:text-3xl text-center font-semibold text-main '>Create New Account</h1>
                <p className='text-zinc-800 text-center mt-5'>Already Registered? <Link href={'/login'}>Login</Link></p>
                <form action="" className='w-[70%] xs:w-full m-auto mt-10' onSubmit={handleSubmit}>
                    <div className='mb-5'>
                        <p className='text-zinc-700 text-sm tracking-widest'>NAME</p>
                        <input type="text" name="name" required id="name" onChange={handleChange} className='py-4 px-5 text-zinc-800 border border-zinc-500 w-full rounded-md' />
                    </div>
                    <div className='mb-5'>
                        <p className='text-zinc-700 text-sm tracking-widest'>EMAIL</p>
                        <input type="email" name="email" required id="email" onChange={handleChange} className='py-4 px-5 text-zinc-800 border border-zinc-500 w-full rounded-md' />
                    </div>
                    <div className='mb-5'>
                        <p className='text-zinc-700 text-sm tracking-widest'>PASSWORD</p>
                        <input type="password" name="password" required id="password" onChange={handleChange} className='py-4 px-5 text-zinc-800 border border-zinc-500 w-full rounded-md' />
                    </div>
                    <div className='mb-5'>
                        <p className='text-zinc-700 text-sm tracking-widest'>OPEN AI - API KEY</p>
                        <input type="text" name="key" required id="key" onChange={handleChange} className='py-4 px-5 text-zinc-800 border border-zinc-500 w-full rounded-md' />
                    </div>
                    {
                        success &&
                        <p className='text-green-700'>Account Creaed Successfully Redirecting to login....</p>
                    }
                    {
                        error &&
                        <p className='text-red-700'>{error}</p>
                    }
                    <div className='flex justify-center mt-5'>
                        <button disabled={loading} className='text-sm text-white tracking-widest bg-blue-500 w-[200px] text-center py-4'>{loading ? <Loader height='h-4' width='w-4' /> : 'SIGN UP'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;