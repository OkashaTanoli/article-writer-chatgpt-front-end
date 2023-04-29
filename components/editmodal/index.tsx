import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Loader from '../loader';
import { IContext } from '@/types';
import { ContextApi } from '@/store/context';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    minHeight: '90vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column'
};

export default function EditModal({ open, setOpen, handleOpen, handleClose, editModalData }: any) {

    const { state, dispatch }: IContext = useContext(ContextApi)

    const [editedData, setEditedData] = useState('')
    const [loading, setLoading] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        setEditedData(editModalData?.singleArticle?.article)
    }, [editModalData?.singleArticle?.article])


    const handleSave = () => {
        const articles = editModalData?.completeArticle?.articles?.map((val: any) => {
            if (val._id === editModalData?.singleArticle?._id) {
                val.article = editedData
            }
            return val
        })
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articleshistory/${editModalData?.completeArticle._id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.user?.token}`
            },
            body: JSON.stringify({ articles: articles })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'error') {
                    console.log(data.error)
                    return
                }
                setSaveSuccess(true)
                setTimeout(() => {
                    setSaveSuccess(false)
                }, 2000)
            })
            .finally(() => {
                setLoading(false)
            })
    }


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <textarea name="" id="" onChange={(e) => setEditedData(e.target.value)} value={editedData} rows={20} className='w-full flex-grow resize-none focus:outline-none'></textarea>
                    <div>
                        <div className='w-full h-[1px] bg-zinc-400'></div>
                        <div className='flex gap-5'>
                            <button onClick={handleSave} className={`h-[40px] w-[120px] text-center ${saveSuccess ? 'bg-green-700' : 'bg-main'} rounded-lg text-sm text-white font-bold mt-5`}>{loading ? <Loader height='h-4' width='w-4' /> : saveSuccess ? 'Saved' : 'Save'}</button>
                            <button onClick={handleClose} className='h-[40px] w-[120px] text-center bg-zinc-500 rounded-lg text-sm text-white font-bold mt-5'>Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}