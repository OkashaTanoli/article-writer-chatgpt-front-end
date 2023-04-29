import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

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

export default function EditGeneratedModal({ openGenerated, setOpenGenerated, handleOpenGenerated, handleCloseGenerated, articles, setArticles, editModalGeneratedIndex }: any) {

    const [editedData, setEditedData] = useState('')

    useEffect(() => {
        console.log(editModalGeneratedIndex)
        console.log(articles)
        setEditedData(articles[editModalGeneratedIndex]?.text)
    }, [articles, editModalGeneratedIndex])


    const handleSave = () => {
        const latest = articles?.map((val: any, index: number) => {
            if (index === editModalGeneratedIndex) {
                val.text = editedData
            }
            return val
        })
        setArticles(latest)
        handleCloseGenerated()
    }


    return (
        <div>
            <Modal
                open={openGenerated}
                onClose={handleCloseGenerated}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <textarea name="" id="" onChange={(e) => setEditedData(e.target.value)} value={editedData} rows={20} className='w-full flex-grow resize-none focus:outline-none'></textarea>
                    <div>
                        <div className='w-full h-[1px] bg-zinc-400'></div>
                        <div className='flex gap-5'>
                            <button onClick={handleSave} className={`h-[40px] w-[120px] text-center bg-main rounded-lg text-sm text-white font-bold mt-5`}>Save</button>
                            <button onClick={handleCloseGenerated} className='h-[40px] w-[120px] text-center bg-zinc-500 rounded-lg text-sm text-white font-bold mt-5'>Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}