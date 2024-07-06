import { Table } from "@renderer/components/table";
import { IoIosPeople } from "react-icons/io";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiClock } from "react-icons/fi";
import { IMusic } from "./music";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@renderer/redux/store";
import { setMusic, setMusicList, setSelectedMusicPlaylist } from "@renderer/redux/general-slice";
import { IArtist } from "./singer";
import Image from "@renderer/components/image";
import logo from '../../../../resources/icon.ico';
import { useEffect, useRef, useState } from "react";
import { request } from "@renderer/utils/axios";
import { TbArrowBackUp } from "react-icons/tb";

export default function SingerDetail(
    { artistDetail, setArtistDetail }: 
    Readonly<{ artistDetail: IArtist; setArtistDetail: React.Dispatch<React.SetStateAction<IArtist | undefined>> }>
){
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    const [musicData, setMusicData] = useState<IMusic[]>([]);
    const [search, setSearch] = useState('');

    const header = [
        { key: 'name', value: 'Title' },
        { key: 'artist', value: 'Artist' },
        { key: 'duration', value: <FiClock size={20} /> },
        { key: 'action', value: '' }
    ]

    const bodyFormatter = (key: string, row: IMusic) => {
        switch (key) {
            case 'artist':
                return <div>{artistDetail.name}</div>
            case 'name':
                return <div className="flex gap-4 items-center min-w-[10rem]">
                    <div className="relative w-10 h-10 min-w-[2.5rem] max-h-[2.5rem] rounded-md overflow-hidden flex items-center justify-center">
                        <Image 
                            alt="Beat Wave" 
                            src={artistDetail.image ? `http://203.194.114.17:4000${artistDetail.image}` : logo} 
                            className="absolute top-0 left-0 object-cover w-full h-full" 
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

    useEffect(() => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const newController = new AbortController();
        controllerRef.current = newController;

        setLoading(true);

        const fetchData = async () => {
            try {
                const response = await request().get(`/music?artistId=${artistDetail.id}&search=${search}`, {
                    signal: newController.signal
                });
                setMusicData(response.data?.message?.list ?? []);
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
    }, [artistDetail.id, search])

    const onRowClick = (_, row: IMusic) => {
        dispatch(setMusicList(musicData))
        dispatch(setMusic(row))
    }

    return (
        <div className="flex flex-col w-full h-full gap-6 overflow-y-auto">
            {loading && <progress className="fixed inset-0 w-full rounded-none progress progress-accent"></progress>}
            <div className="flex items-center justify-between gap-2 px-4 pt-6">
                <div className='flex items-center gap-4 p-2'>
                    <button onClick={() => { setArtistDetail && setArtistDetail(undefined) }} className="text-primary"><TbArrowBackUp size={30} /></button>
                    <IoIosPeople size={30} />
                    <div>{artistDetail.name + "'"}s Music</div>
                </div>
            </div>
            <div className="w-[25rem] join px-4">
                <input value={search} onChange={(e) => { setSearch(e.target.value) }} type="text" placeholder="Search…" className="w-full input join-item" />
                <button type='submit' className="btn btn-ghost bg-base-100 join-item">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
            <div className="flex-1 px-4 overflow-auto">
                <Table clickable onRowClick={onRowClick} header={header} bodyFormatter={bodyFormatter} body={musicData} />
            </div>
        </div>
    )
}