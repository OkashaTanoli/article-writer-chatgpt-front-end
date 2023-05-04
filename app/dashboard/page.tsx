'use client'

import { ContextApi } from '@/store/context';
import { IContext } from '@/types';
import Cookies from 'js-cookie';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { MdDelete, MdModeEditOutline, MdOutlineAccessTimeFilled } from 'react-icons/md'
import { ImCross } from 'react-icons/im'
import { FaCheck } from 'react-icons/fa'
import { RxCross2 } from 'react-icons/rx'
import { BiTimeFive } from 'react-icons/bi'
import readXlsxFile from 'read-excel-file'
import { EditModadl, Loader } from '@/components';
import moment from 'moment';
import EditGeneratedModal from '@/components/editgeneratedmodal';
import { saveAs } from 'file-saver';




type IData = {
    id: number,
    text: string
}

function Dashboard() {
    const { state, dispatch }: IContext = useContext(ContextApi)
    // MUI EDIT MODAL
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    //-----//

    // MUI EDIT GENERATED MODAL
    const [openGenerated, setOpenGenerated] = React.useState(false);
    const handleOpenGenerated = () => setOpenGenerated(true);
    const handleCloseGenerated = () => setOpenGenerated(false);
    //-----//

    const [keywords, setKeywords] = useState<IData[]>([])
    const [keyword, setKeyword] = useState('')
    const [activeEdit, setActiveEdit] = useState<number>()
    const [activeEditKeyword, setActiveEditKeyword] = useState('')
    const [promptText, setPromptText] = useState('')
    const [error, setError] = useState('')
    const [articles, setArticles] = useState<any[]>([])
    const [articlesHistory, setArticlesHistory] = useState<any[]>([])
    // const [options, setOptions] = useState<string[]>([])
    const [selectedArticles, setSelectedArticles] = useState<string[]>([])
    const [selectedHistoryArticles, setSelectedHistoryArticles] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [articleHistoryLoading, setArticleHistoryLoading] = useState(true)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [editModalData, setEditModalData] = useState<any>()
    const [editModalGeneratedIndex, setEditModalGeneratedIndex] = useState<any>()

    // const [numberOfArticles, setNumberOfArticles] = useState<number>(1)
    const [lengthOfArticles, setLengthOfArticles] = useState<string>('medium')


    function getArticlesHistory(token: string | undefined) {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articleshistory`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'error') {
                    console.log(data.error)
                    return
                }
                // console.log(data)
                setArticlesHistory(data.articles)
            })
            .finally(() => {
                setArticleHistoryLoading(false)
            })
    }


    useEffect(() => {
        setArticleHistoryLoading(true)
        const user = Cookies.get('userData')
        if (user) {
            const parsed_user = JSON.parse(user)
            dispatch({ type: 'AUTH', payload: parsed_user })
            getArticlesHistory(parsed_user.token)
        }
    }, [dispatch, state.user?.token])



    const addKeyword = (e: FormEvent) => {
        e.preventDefault()
        if (!keyword.trim()) {
            alert('Empty keyword is not allowed')
            return
        }
        if (keywords.length === 20) {
            alert('only 20 keywords are allowed')
            return
        }
        const id = Math.random() * 99999999999999
        setKeywords([...keywords, { id, text: keyword.trim() }])
    }

    const deleteKeyword = (id: number) => {
        const newList = keywords.filter((val) => val.id !== id)
        setKeywords(newList)
    }

    const editKeyword = (id: number) => {
        const newList = keywords.map((val, index) => {
            if (val.id === id) {
                val.text = activeEditKeyword.trim()
            }
            return val
        })
        setKeywords(newList)
        setActiveEdit(0)
    }



    const bulkKeyword = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            readXlsxFile(file).then((rows) => {
                const list = rows.flat()
                const newList = []
                // const length = list.length >= 10 ? 10 - keywords.length : (list.length + keywords.length) > 10
                for (let j = 0; j < list.length; j++) {
                    if ((keywords.length + newList.length) === 20 || j === list.length) {
                        break
                    }
                    const id = Math.random() * 99999999999999
                    newList.push({ id, text: String(list[j]) })
                }
                setKeywords([...keywords, ...newList])
            })
        }
    }


    // const handleOptions = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.checked) {
    //         setOptions([...options, e.target.value])
    //     }
    //     else {
    //         const filtered = options.filter((val) => val !== e.target.value)
    //         setOptions(filtered)
    //     }
    // }


    const handleSelectedArticles = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedArticles([...selectedArticles, e.target.value])
        }
        else {
            const filtered = selectedArticles.filter((val) => val !== e.target.value)
            setSelectedArticles(filtered)
        }
    }

    const handleSelectedHistoryArticles = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedHistoryArticles([...selectedHistoryArticles, e.target.value])
        }
        else {
            const filtered = selectedHistoryArticles.filter((val) => val !== e.target.value)
            setSelectedHistoryArticles(filtered)
        }
    }


    const openEditModalAndSetData = (completeArticle: any, singleArticle: any) => {
        setEditModalData({ completeArticle, singleArticle })
        handleOpen()
    }


    const openEditGeneratedModalAndSetData = (index: number) => {
        setEditModalGeneratedIndex(index)
        handleOpenGenerated()
    }



    // const handleGenerate = () => {
    //     let finalKeywords = ''
    //     for (let i = 0; i < keywords.length; i++) {
    //         finalKeywords += `${keywords[i].text}, `
    //     }
    //     // const finalPrompt = `Using the list of keywords mentioned below create ${options.join(', ')} ${promptText ? `and ${promptText}` : ''} and ${lengthOfArticles} article of ${lengthOfArticles === 'small' ? 500 : lengthOfArticles === 'medium' ? 1000 : lengthOfArticles === 'very large' ? 2000 : 1000}. The list of keywords is here: ${finalKeywords}`
    //     const finalPrompt = `${promptText} and the length of article should be ${lengthOfArticles} and the article should use the following kwywords ${finalKeywords}`
    //     setLoading(true)
    //     setSelectedArticles([])
    //     setArticles([])
    //     // fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/createarticle`, {
    //     //     method: 'POST',
    //     //     headers: {
    //     //         "Content-Type": "application/json",
    //     //         Authorization: `Bearer ${state.user?.token}`
    //     //     },
    //     //     body: JSON.stringify({ prompt: finalPrompt, length: lengthOfArticles, number: numberOfArticles })
    //     // })
    //     //     .then((res) => res.json())
    //     //     .then((data) => {
    //     //         if (data.status === 'error') {
    //     //             setError(data.error.message)
    //     //             return
    //     //         }
    //     //         setArticles(data.data.choices)
    //     //         console.log(articles)
    //     //     })
    //     //     .catch((err) => {
    //     //         alert(err)
    //     //     })
    //     //     .finally(() => {
    //     //         setLoading(false)
    //     //     })



    //     const length = lengthOfArticles === 'small' ? 500 : lengthOfArticles === 'medium' ? 2000 : lengthOfArticles === 'very large' ? 3500 : 2000
    //     fetch(`https://api.openai.com/v1/completions`, {
    //         method: 'POST',
    //         headers: {
    //             Authorization: `Bearer ${state.user?.key}`,
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             model: 'text-davinci-003',
    //             prompt: finalPrompt,
    //             max_tokens: length,
    //             n: numberOfArticles
    //         })
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             if (data.error) {
    //                 setError(data.error.message)
    //                 return
    //             }
    //             setArticles(data.choices)
    //             console.log(articles)
    //         })
    //         .catch((err) => {
    //             alert(err)
    //         })
    //         .finally(() => {
    //             setLoading(false)
    //         })
    // }






















    const handleGenerate = () => {
        if (keywords.length === 0) {
            alert('Enter atleast one keyword')
            return
        }

        setLoading(true)
        setSelectedArticles([])
        setArticles([])
        let n = 0

        for (let i = 0; i < keywords.length; i++) {
            // function callApi(n = 0) {
            const length = lengthOfArticles === 'medium' ? 1000 : lengthOfArticles === 'very large' ? 3500 : 2000
            const finalPrompt = `${promptText}. Generate ${lengthOfArticles} article of ${lengthOfArticles === 'medium' ? '1200' : lengthOfArticles === 'very large' ? '3000' : '1500'} words using the keyword "${keywords[i].text}, with multiple paragraphs"`
            fetch(`https://api.openai.com/v1/completions`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${state.user?.key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: 'text-davinci-003',
                    prompt: finalPrompt,
                    max_tokens: length,
                    n: 1
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setError(data.error.message)
                        return
                    }
                    setArticles((prev) => [...prev, data.choices[0]])
                })
                .catch((err) => {
                    alert(err)
                })
                .finally(() => {
                    n += 1
                    if (n === keywords.length) {
                        setLoading(false)
                        // return
                    }
                    // callApi(n + 1)
                })
            // }
            // callApi()
        }
    }
















    const saveArticles = () => {
        setSaveLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articleshistory`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.user?.token}`
            },
            body: JSON.stringify({ articles: selectedArticles })
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.status) {
                    return alert('error')
                }
                setSaveSuccess(true)
                setTimeout(() => {
                    setSaveSuccess(false)
                }, 2000)
                getArticlesHistory(state?.user?.token)
            })
            .finally(() => {
                setSaveLoading(false)
            })
    }


    function exportAsXML(articles: string[]) {
        let xmlContent = ''
        for (let i = 0; i < articles.length; i++) {
            xmlContent += `
                        <item>
                            <title><![CDATA[This is an Article]]></title>
                            <dc:creator><![CDATA[wpx_]]></dc:creator>
                            <description></description>
                            <content:encoded><![CDATA[<!-- wp:paragraph --><p>${articles[i]}</p><!-- /wp:paragraph -->]]></content:encoded>
                            <excerpt:encoded><![CDATA[]]></excerpt:encoded>
                        </item>    
                        `
        }
        const content = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE root>
                            <rss version="2.0"
                                xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
                                xmlns:content="http://purl.org/rss/1.0/modules/content/"
                                xmlns:wfw="http://wellformedweb.org/CommentAPI/"
                                xmlns:dc="http://purl.org/dc/elements/1.1/"
                                xmlns:wp="http://wordpress.org/export/1.2/"
                            >
                                <channel>
                                    <wp:wxr_version>1.2</wp:wxr_version>
                                    ${xmlContent}
                                </channel>
                            </rss>`;
        const file = new Blob([content], { type: 'text/xml' });
        saveAs(file, 'article.xml');
        console.log(content)
    }


    return (
        <>
            <EditModadl open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} editModalData={editModalData} />
            <EditGeneratedModal openGenerated={openGenerated} setOpenGenerated={setOpenGenerated} handleOpenGenerated={handleOpenGenerated} handleCloseGenerated={handleCloseGenerated} articles={articles} setArticles={setArticles} editModalGeneratedIndex={editModalGeneratedIndex} />
            <div className='w-[1300px] m-auto mt-10 mb-20'>
                <div>
                    <h1 className='text-2xl text-main font-bold'>Keywords</h1>
                    <div className='flex gap-5 mt-3'>
                        <input type="text" onChange={(e) => setKeyword(e.target.value)} placeholder='Enter Keyword' className='py-4 px-6 text-sm border border-zinc-300 rounded-full flex-grow' />
                        <div className='flex gap-3'>
                            <button onClick={addKeyword} className='w-[100px] py-4 flex items-center justify-center text-sm text-white font-bold bg-main rounded-full'>ADD</button>
                            <label>
                                <input type="file" onChange={bulkKeyword} hidden />
                                <div className='w-[150px] cursor-pointer py-4 flex items-center justify-center text-sm text-white font-bold bg-main rounded-full'>BULK (.XLSX)</div>
                            </label>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <h1 className='text-2xl text-main font-bold'>Keyword List</h1>
                        <div className='mt-3 p-4 border border-zinc-300 rounded-2xl'>
                            {
                                !keywords.length ?
                                    <h1 className='text-xl text-zinc-600 font-bold text-center'>No Keyword Added</h1>
                                    :
                                    <div>
                                        {
                                            keywords.map((val: IData, index: number) => {
                                                return (
                                                    <div key={index} className='mb-2 mt-2 bg-zinc-200 text-zinc-800 font-semibold flex justify-between items-center gap-10'>
                                                        <div className='pl-5'>
                                                            {
                                                                activeEdit === val.id ?
                                                                    <input type="text" onChange={(e) => setActiveEditKeyword(e.target.value)} value={activeEditKeyword} className='bg-transparent flex-grow border px-2 py-1 rounded-md border-dashed border-gray-500' />
                                                                    :
                                                                    <p className='flex-grow'>
                                                                        {val.text}
                                                                    </p>
                                                            }
                                                        </div>
                                                        {/* <div className='w-[2px] h-8 bg-zinc-400'></div> */}
                                                        <div className='py-4 w-[90px] flex justify-center bg-zinc-400'>
                                                            {
                                                                activeEdit === val.id ?
                                                                    <div className='flex gap-5 items-center'>
                                                                        <ImCross onClick={() => setActiveEdit(0)} size={16} className='text-red-700 font-bold cursor-pointer' />
                                                                        <FaCheck onClick={() => editKeyword(val.id)} size={20} className='text-green-700 font-bold cursor-pointer' />
                                                                    </div>
                                                                    :
                                                                    <div className='flex gap-5 items-center'>
                                                                        <MdModeEditOutline onClick={() => { setActiveEdit(val.id); setActiveEditKeyword(val.text) }} size={20} className='text-zinc-800 cursor-pointer' />
                                                                        <MdDelete onClick={() => deleteKeyword(val.id)} size={20} className='text-zinc-800 cursor-pointer' />
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                            }
                        </div>
                    </div>

                    <div className='mt-5'>
                        <h1 className='text-2xl text-main font-bold'>Prompt</h1>
                        <input type="text" onChange={(e) => setPromptText(e.target.value)} className='w-full py-3 px-5 border border-zinc-300 rounded-lg mt-3' placeholder='Enter Prompt' />
                        {/* <div className='mt-5'>
                            <div><input type="checkbox" value={'title'} onChange={handleOptions} id="title" /><label htmlFor="title" className='ml-3'>Title</label></div>
                            <div><input type="checkbox" value={'frequently asked questions'} onChange={handleOptions} id="faq" /><label htmlFor="faq" className='ml-3'>FAQ</label></div>
                            <div><input type="checkbox" value={'5 bullet points'} onChange={handleOptions} id="bullets" /><label htmlFor="bullets" className='ml-3'>Bullet Points</label></div>
                            <div><input type="checkbox" value={'summary'} onChange={handleOptions} id="summary" /><label htmlFor="summary" className='ml-3'>Summary</label></div>
                        </div> */}
                        <div className='mt-5'>
                            <h1 className='text-zinc-800 font-bold mb-3'>Select length of article</h1>
                            <select value={lengthOfArticles} onChange={(e) => setLengthOfArticles(e.target.value)} className='border border-zinc-300 rounded-xl py-2 px-10'>
                                {/* <option value="small">small</option> */}
                                <option value="medium">medium</option>
                                <option value="very large">large</option>
                            </select>
                        </div>
                        {/* <div className='mt-5'>
                            <h1 className='text-zinc-800 font-bold mb-3'>Select number of articles you want to generate (max = 10)</h1>
                            <select value={numberOfArticles} onChange={(e) => setNumberOfArticles(Number(e.target.value))} name="" id="" className='border border-zinc-300 rounded-xl py-2 px-10'>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="8">8</option>
                                <option value="10">10</option>
                            </select>
                        </div> */}
                    </div>
                    <button onClick={handleGenerate} disabled={loading} className='h-[50px] w-[200px] text-center bg-main rounded-lg text-sm text-white font-bold mt-5'>{loading ? <Loader height='h-4' width='w-4' /> : 'Generate Article'}</button>
                    {
                        loading &&
                        <h1 className='text-zinc-800 font-semibold'>Note: Generating {keywords.length} articles. This may take sometime. Please have patience</h1>
                    }
                    {
                        error &&
                        <div className='text-red-700 text-sm font-semibold mt-3 flex justify-between'>{error} <RxCross2 size={25} className='text-zinc-800 cursor-pointer' onClick={() => setError('')} /></div>
                    }
                    <div className='w-full h-[1px] bg-zinc-400 my-5'></div>
                    <div className='mt-5'>
                        <h1 className='text-2xl text-main font-bold'>Generated Articles</h1>
                        <div className='mt-3 p-4 border border-zinc-300 rounded-2xl'>
                            {
                                !articles.length ?
                                    <div className='flex justify-center items-center'>
                                        <h1 className='text-xl text-zinc-600 font-bold text-center'>No Articles Generated</h1>
                                    </div>
                                    :
                                    articles.map((val: any, index: number) => {
                                        return (
                                            <div key={index} className='flex gap-5'>
                                                <input type="checkbox" value={val.text} onChange={handleSelectedArticles} name="" id={String(index)} />
                                                <label htmlFor={String(index)} className='flex-grow'>
                                                    <div className='mb-2 mt-2 flex justify-between items-center bg-gray-300 text-zinc-800 font-semibold'>
                                                        <div className='line-clamp-1 pl-5 w-[80%]'>{val.text}</div>
                                                        <div className='py-4 w-[50px] flex justify-center bg-zinc-400'>
                                                            <MdModeEditOutline size={20} onClick={() => openEditGeneratedModalAndSetData(index)} className='text-zinc-800 cursor-pointer' />
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        )
                                    })
                            }
                            {
                                selectedArticles.length ?
                                    <div className='flex gap-5'>
                                        <button onClick={saveArticles} disabled={saveLoading} className={`h-[40px] w-[120px] text-center ${saveSuccess ? ' bg-green-700' : 'bg-main'} rounded-lg text-sm text-white font-bold mt-5`}>{saveLoading ? <Loader height='h-4' width='w-4' /> : saveSuccess ? 'Saved' : 'Save'}</button>
                                        <button onClick={() => exportAsXML(selectedArticles)} className={`h-[40px] w-[120px] text-center bg-main rounded-lg text-sm text-white font-bold mt-5`}>Export XML</button>
                                    </div>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className='mt-5'>
                        <h1 className='text-2xl text-main font-bold'>Articles History</h1>
                        <div className='mt-3 p-4 border border-zinc-300 rounded-2xl'>
                            {
                                articleHistoryLoading ?
                                    <Loader width='w-10' height='h-10' />
                                    :
                                    !articlesHistory?.length ?
                                        <div className='flex justify-center items-center'>
                                            <h1 className='text-xl text-zinc-600 font-bold text-center'>No Articles History</h1>
                                        </div>
                                        :
                                        articlesHistory.map((val, index) => {
                                            return (
                                                <div key={index} className='py-3 border-b border-zinc-300 flex flex-col'>
                                                    {
                                                        val.articles.map((val2: any, index: number) => {
                                                            return (
                                                                <div key={index} className='flex gap-5'>
                                                                    <input type="checkbox" value={val2.article} onChange={handleSelectedHistoryArticles} name="" id={`${val.time}${String(index)}`} />
                                                                    <label htmlFor={`${val.time}${String(index)}`} className='flex-grow'>
                                                                        <div className='mb-2 mt-2 flex justify-between items-center bg-gray-300 text-zinc-800 font-semibold'>
                                                                            <div className='line-clamp-1 pl-5 w-[80%]'>{val2.article}</div>
                                                                            <div className='py-4 w-[50px] flex justify-center bg-zinc-400'>
                                                                                <MdModeEditOutline onClick={() => openEditModalAndSetData(val, val2)} size={20} className='text-zinc-800 cursor-pointer' />
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    <p className='text-sm self-end font-semibold text-zinc-600 flex gap-3 items-center'><MdOutlineAccessTimeFilled size={22} className='text-zinc-800' /> {moment(val.time).fromNow()}</p>
                                                </div>
                                            )
                                        })
                            }
                            {
                                selectedHistoryArticles.length ?
                                    <div className='flex gap-5'>
                                        <button onClick={() => exportAsXML(selectedHistoryArticles)} className={`h-[40px] w-[120px] text-center bg-main rounded-lg text-sm text-white font-bold mt-5`}>Export XML</button>
                                    </div>
                                    :
                                    ''
                            }
                        </div>
                    </div>

                </div>
            </div >
        </>
    );
}

export default Dashboard;