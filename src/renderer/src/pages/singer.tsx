import { Card } from "@renderer/components/card";
import { request } from "@renderer/utils/axios";
import { useEffect, useRef, useState } from "react";
import artistImg from '../assets/no-artist.png';
import SingerDetail from "./singer-detail";
import { PiMicrophoneStageFill } from "react-icons/pi";

export type IArtist = {
    id: string;
    name: string;
    image?: string | null;
};

export default function Singer(){
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [artist, setArtist] = useState<IArtist[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const controllerRef = useRef<AbortController | null>(null);
    const [selectedArtist, setSelectedArtist] = useState<IArtist | undefined>(undefined);

    useEffect(() => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const newController = new AbortController();
        controllerRef.current = newController;

        setLoading(true);

        const fetchData = async () => {
            try {
                const response = await request().get(`/artist?page=${page}&search=${search}`, {
                    signal: newController.signal
                });
                setArtist(response.data?.message?.list ?? []);
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

    const nextPage = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    }

    const prevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    }

    if (!selectedArtist) {
        return(
            <div className="flex flex-col w-full h-full gap-6 overflow-y-auto">
                {loading && <progress className="fixed inset-0 w-full rounded-none progress progress-accent"></progress>}
                <div className="flex items-center justify-between gap-2 px-4 pt-6">
                    <div className='flex items-center gap-4 px-2 pt-2'>
                        <PiMicrophoneStageFill size={30} />
                        <div>Singer List</div>
                    </div>
                </div>
                <div className="w-[25rem] join px-4">
                    <input value={search} onChange={(e) => { setSearch(e.target.value) }} type="text" placeholder="Search…" className="w-full input join-item" />
                    <button type='submit' className="btn btn-ghost bg-base-100 join-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
                <div className='grid flex-1 grid-cols-5 gap-4 px-4 overflow-y-auto'>
                    {artist.map((item) => {
                        return (
                            <Card onClick={() => { setSelectedArtist(item) }} key={item.id} src={item.image ? `http://203.194.114.17:4000${item.image}` : artistImg} body={item.name} />
                        )
                    })}
                </div>
                <div className="flex justify-end px-12 pb-3">
                    <div className="join">
                        <button onClick={prevPage} className="join-item btn">«</button>
                        <button className="join-item btn">Page {page}</button>
                        <button onClick={nextPage} className="join-item btn">»</button>
                    </div>
                </div>
            </div>
        )
    }

    return <SingerDetail artistDetail={selectedArtist} setArtistDetail={setSelectedArtist} />
}