import {
    TbPlayerSkipBackFilled,
    TbPlayerSkipForwardFilled,
    TbPlayerPlayFilled,
    TbVolume,
    TbPlayerPauseFilled
} from 'react-icons/tb'
import { Slider } from './slider'
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import logo from '../assets/icon.ico'
import { AppDispatch, RootState } from '@renderer/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { nextMusic, prevMusic, setRestart, startLoading, startMusic, stopLoading, stopMusic } from '@renderer/redux/general-slice';
import { convertToSeconds, formatDuration } from '@renderer/utils/formatter';
import Image from './image';

export default function MusicPlayer(){
    const footerRef = useRef<HTMLDivElement>(null);
    const [volume, setVolume] = useState(100);
    const [maxProgress, setMaxProgress] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isFooterFocused, setIsFooterFocused] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const buttonPlayRef = useRef<HTMLButtonElement | null>(null)
    const dispatch = useDispatch<AppDispatch>();

    const isPlay = useSelector((state: RootState) => state.general.isPlay);
    const selectedMusic = useSelector((state: RootState) => state.general.selectedMusic);
    const loading = useSelector((state: RootState) => state.general.loading);
    const musicList = useSelector((state: RootState) => state.general.musicList)
    const isRestart = useSelector((state: RootState) => state.general.isRestart)

    const resetAudio = () => {
        if (audioRef.current) {
            setProgress(0)
            audioRef.current.currentTime = 0
        }
    }

    useEffect(() => {
        const handleDocumentClick = (event: Event) => {
            if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
                setIsFooterFocused(false)
            }
        };
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [])

    useEffect(() => {
        const audio = audioRef.current;
        if (audio && selectedMusic && audio.src !== selectedMusic.url) {
            dispatch(startLoading())
            setMaxProgress(convertToSeconds(selectedMusic?.duration))
            setProgress(0)
            audio.currentTime = 0
            audio.src = `http://203.194.114.17:4000${selectedMusic.url}`;
            audio.play().then(() => {
                setIsFooterFocused(true)
                dispatch(stopLoading())
                dispatch(startMusic())
            }).catch((_) => {
                dispatch(stopLoading())
                resetAudio()
                dispatch(nextMusic())
            })
        }
    }, [selectedMusic])

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume / 100
        }
    }, [volume])

    useEffect(() => {
        const audio = audioRef.current;
        const updateHandler = () => {
            if (isPlay && audio) {
                setProgress(audio.currentTime);
            }
        }
        const endHandler = () => {
            if (audio) {
                if (musicList.length > 1) {
                    audio.currentTime = 0;
                    setProgress(0)
                    dispatch(nextMusic())
                } else {
                    audio.currentTime = 0;
                    audio.play()
                }
            }
        }
        audio?.addEventListener('ended', endHandler)
        audio?.addEventListener('timeupdate', updateHandler)
        return () => {
            audio?.removeEventListener('timeupdate', updateHandler)
            audio?.removeEventListener('ended', endHandler)
        }
    }, [isPlay, musicList])

    useEffect(() => {
        const audio = audioRef.current;
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            resetAudio()
            dispatch(nextMusic())
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            resetAudio()
            dispatch(prevMusic())
        });
        navigator.mediaSession.setActionHandler('play', () => {
            if (!loading && audio?.src) {
                audio.play()
                dispatch(startMusic())
            }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if (!loading && audio?.src) {
                audio.pause()
                dispatch(stopMusic())
            }
        });
        return () => {
            navigator.mediaSession.setActionHandler('nexttrack', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
        };
    }, [loading]);

    useEffect(() => {
        const audio = audioRef.current;
        const buttonPlay = buttonPlayRef.current;
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space' && isFooterFocused && buttonPlay) {
                event.stopPropagation()
                if (!loading && audio?.src && document.activeElement !== buttonPlay) {
                    if (isPlay) {
                        audio.pause()
                        dispatch(stopMusic())
                    } else {
                        audio.play()
                        dispatch(startMusic())
                    }
                }
            } else if (event.code === 'ArrowLeft' && !loading && isFooterFocused && audio) {
                event.stopPropagation()
                audio.currentTime -= 5
                setProgress(prev => prev - 5)
            } else if (event.code === 'ArrowRight' && !loading && isFooterFocused && audio) {
                event.stopPropagation()
                audio.currentTime += 5
                setProgress(prev => prev + 5)
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [loading, isPlay, isFooterFocused]);

    useEffect(() => {
        if (audioRef.current?.src && isRestart) {
            audioRef.current.currentTime = 0
            audioRef.current.play()
            dispatch(setRestart(false))
        }
    }, [isRestart])

    const togglePlay = (e: MouseEvent<HTMLButtonElement>) => {
        const audio = audioRef.current;
        e.stopPropagation()
        if (!loading && audio?.src) {
            if (isPlay) {
                audio.pause()
                dispatch(stopMusic())
            } else {
                audio.play()
                dispatch(startMusic())
            }
        }
    }

    const next = () => {
        const audio = audioRef.current;
        if (audio) {
            setProgress(0)
            audio.currentTime = 0
        }
        dispatch(nextMusic())
    }

    const prev = () => {
        const audio = audioRef.current;
        if (audio) {
            setProgress(0)
            audio.currentTime = 0
        }
        dispatch(prevMusic())
    }

    const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio && !loading) {
            const newProgress = parseInt(e.target.value);
            audio.currentTime = newProgress
            setProgress(newProgress);
        }
    };

    return (
        <div className={`flex flex-col items-center gap-4 w-full h-24 overflow-x-auto bg-base-100`}>
            {loading && <progress className="fixed inset-0 w-full rounded-none progress progress-accent"></progress>}
            <div className="relative flex items-center justify-between flex-1 w-full gap-2 px-4 py-2">
                <div className='absolute inset-0 w-full'>
                    <Slider min={0} max={maxProgress} step={1} value={progress} onChange={handleProgressChange} />
                </div>
                <audio ref={audioRef} className="hidden" />
                <div className="flex items-center flex-1 gap-2">
                    <div className="relative flex items-center justify-center overflow-hidden rounded-md w-14 h-14">
                        <Image 
                            alt="Beat Wave" 
                            src={selectedMusic?.artistMusic[0].artist.image ? `http://203.194.114.17:4000${selectedMusic.artistMusic[0].artist.image}` : ''} 
                            className="absolute top-0 left-0 object-cover w-full h-full" 
                            defaultSrc={logo}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>{selectedMusic?.name ?? 'Music not selected'}</div>
                        <div className="text-sm text-primary">{
                            selectedMusic?.artistMusic?.map((item) => item.artist.name)?.join(", ") ?? 'Music not selected'
                        }</div>
                    </div>
                </div>
                <div className="z-10 flex flex-col items-center flex-1 w-full gap-2">
                    <div className="flex gap-2">
                    <button onClick={prev} className="px-3 rounded-full btn btn-ghost"><TbPlayerSkipBackFilled size={20} /></button>
                    <button ref={buttonPlayRef} onClick={togglePlay} className="px-3 rounded-full btn btn-primary">{
                        !isPlay ? <TbPlayerPlayFilled size={20} /> : <TbPlayerPauseFilled size={20} />
                    }</button>
                    <button onClick={next} className="px-3 rounded-full btn btn-ghost"><TbPlayerSkipForwardFilled size={20} /></button>
                    </div>
                    {/* <div className='flex gap-2 items-center w-full md:min-w-[20rem] max-w-[28rem]'>
                        <div className='text-sm'>{formatDuration(progress)}</div>
                        <Slider min={0} max={maxProgress} step={1} value={progress} onChange={handleProgressChange} />
                        <div className='text-sm'>{formatDuration(maxProgress)}</div>
                    </div> */}
                </div>
                <div className="flex items-center justify-end flex-1">
                    <div className="flex items-center w-32 gap-2">
                        <TbVolume size={20} />
                        <div className='flex-1'>
                            <Slider min={0} max={100} step={1} value={volume} onChange={(e) => { setVolume(parseInt(e.target.value)) }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}