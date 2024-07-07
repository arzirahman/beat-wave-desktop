import { Table } from "@renderer/components/table";
import { FiClock } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import logo from '../assets/icon.ico';
import { useEffect, useRef, useState } from "react";
import { request } from "@renderer/utils/axios";
import { IArtist } from "./singer";
import Image from "@renderer/components/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@renderer/redux/store";
import { setMusic, setMusicList, setSelectedMusicPlaylist } from "@renderer/redux/general-slice";
import { GiMusicSpell } from "react-icons/gi";

export type IMusic = {
    id: string;
    name: string;
    artistMusic: {
        artist: IArtist;
    }[];
    duration: string;
    url: string;
}

export default function Music(){
    const [page, setPage] = useState(1);
    const [musicData, setMusicData] = useState<IMusic[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const controllerRef = useRef<AbortController | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const header = [
        { key: 'name', value: 'Title' },
        { key: 'artist', value: 'Artist' },
        { key: 'duration', value: <FiClock size={20} /> },
        { key: 'action', value: '' }
    ];
    
    useEffect(() => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const newController = new AbortController();
        controllerRef.current = newController;

        setLoading(true);

        const fetchData = async () => {
            try {
                const response = await request().get(`/music?page=${page}&search=${search}`, {
                    signal: newController.signal
                });
                setMusicData(response.data?.message?.list ?? []);
                setTotalPages(response.data?.message?.pages ?? 0);
            } catch (_) {} finally {
                if (newController.signal.aborted === false) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            newController.abort();
        };
    }, [page, search]);

    const bodyFormatter = (key: string, row: IMusic) => {
        switch (key) {
            case 'artist':
                return <div>{row.artistMusic.map((item) => item.artist.name).join(", ")}</div>
            case 'name':
                return <div className="flex gap-4 items-center min-w-[10rem]">
                    <div className="relative w-10 h-10 min-w-[2.5rem] max-h-[2.5rem] rounded-md overflow-hidden flex items-center justify-center">
                        <Image 
                            alt="Beat Wave" 
                            src={row.artistMusic[0].artist.image ? `http://203.194.114.17:4000${row.artistMusic[0].artist.image}` : ''} 
                            className="absolute top-0 left-0 object-cover w-full h-full" 
                            defaultSrc={logo}
                        />
                    </div>
                    <span>{row.name}</span>
                </div>
            case 'action':
                return <div className="flex items-center justify-end gap-3">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setSelectedMusicPlaylist(row));
                    }} className="p-2 rounded-full btn-ghost">
                        <AiOutlinePlusCircle size={20} />
                    </button>
                </div>
            default:
                return <div>{row[key as keyof IMusic] as string}</div>
        }
    }

    const onRowClick = (_, row: IMusic) => {
        dispatch(setMusicList([row]))
        dispatch(setMusic(row))
    }

    return (
        <div className="flex flex-col w-full h-full gap-4 overflow-y-auto">
            {loading && <progress className="fixed inset-0 w-full rounded-none progress progress-accent"></progress>}
            <div className="flex items-center justify-between gap-2 px-4 pt-6">
                <div className='flex items-center gap-4 p-2'>
                    <GiMusicSpell size={30} />
                    <div>Music List</div>
                </div>
            </div>
            <div className="w-[25rem] join px-4">
                <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} type="text" placeholder="Search…" className="w-full input join-item" />
                <button type='submit' className="btn btn-ghost bg-base-100 join-item">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
            <div className="flex-1 px-4 overflow-auto">
                <Table 
                    onNextPage={(value) => { setPage(value) }} 
                    onPrevPage={(value) => { setPage(value) }}
                    header={header} 
                    body={musicData} 
                    bodyFormatter={bodyFormatter} 
                    onRowClick={onRowClick}
                    clickable={true} 
                    totalPages={totalPages}
                    page={page}
                    pagination
                />
            </div>
        </div>
    )
}