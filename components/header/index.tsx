'use client'

import Cookies from 'js-cookie';
import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import { RiAccountCircleLine } from 'react-icons/ri'
import { ChakraProvider, MenuDivider } from '@chakra-ui/react'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { ContextApi } from '@/store/context';
import { IContext } from '@/types';

function Header() {
    // const [user, setUser] = useState<{ name: string, email: string } | undefined>()
    const router = useRouter()
    const { state, dispatch }: IContext = useContext(ContextApi)

    const handleLogout = () => {
        Cookies.remove('userData')
        dispatch({ type: 'AUTH_LOGOUT' })
        router.replace('/login')
    }
    return (
        <ChakraProvider>
            <div className='w-full py-3 bg-header'>
                <div className='w-[1300px] xl:w-[90%] m-auto flex justify-between'>
                    <Link href={'/'}><h1 className='text-3xl font-bold text-zinc-800'>LOGO</h1></Link>
                    <div className='flex gap-10 items-center'>
                        <input type="text" placeholder='search' className='border-none py-2 px-5 bg-white sm:hidden' />
                        {
                            state.user &&
                            <Menu>
                                <MenuButton className='w-10 h-10 rounded-full bg-zinc-700 flex justify-center items-center text-2xl text-white uppercase'>
                                    {state.user?.name[0]}
                                </MenuButton>
                                <MenuList className='w-[200px]'>
                                    <div className='py-2 px-3 flex items-center gap-3 capitalize '>
                                        <RiAccountCircleLine size={35} className='text-zinc-700' />
                                        {
                                            state.user?.name
                                        }
                                    </div>
                                    <MenuDivider />
                                    <div className='py-2 px-3'>
                                        <button onClick={handleLogout} className='bg-blue-500 py-2 px-5 text-white text-sm tracking-widest'>LOGOUT</button>
                                    </div>
                                </MenuList>
                            </Menu>
                        }
                    </div>
                </div>
            </div>
        </ChakraProvider>
    );
}

export default Header;