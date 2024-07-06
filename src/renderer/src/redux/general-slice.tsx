import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Music, { IMusic } from "@renderer/pages/music";
import Playlist from "@renderer/pages/playlist";
import Singer from "@renderer/pages/singer";

import { GiMusicSpell } from "react-icons/gi";
import { PiMicrophoneStageFill } from "react-icons/pi";
import { TbPlaylist } from "react-icons/tb";

export interface IMenu {
    id: number
    icon?: JSX.Element;
    label?: string;
    element: JSX.Element;
    listed?: boolean;
}

export const menu: IMenu[] = [
    { id: Math.floor(Math.random() * 1000000), label: 'Music', element: <Music />, listed: true, icon: <GiMusicSpell size={25} /> },
    { id: Math.floor(Math.random() * 1000000), label: 'Singer', element: <Singer />, listed: true, icon: <PiMicrophoneStageFill size={25} /> },
    { id: Math.floor(Math.random() * 1000000), label: 'Playlist', element: <Playlist />, listed: true, icon: <TbPlaylist size={25} /> }
]

type GeneralState = {
    selectedMenu: string;
    isPlay: boolean;
    selectedMusic?: IMusic;
    loading: boolean;
    musicList: IMusic[];
    currentIndex: number;
    isRestart: boolean;
    refreshPlaylist: boolean;
    selectedMusicPlaylist?: IMusic;
}

const initialState: GeneralState = {
    selectedMenu: 'Music',
    isPlay: false,
    loading: false,
    musicList: [],
    currentIndex: -1,
    isRestart: false,
    refreshPlaylist: false,
}

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setMenu: (state, action: PayloadAction<string>) => {
            state.selectedMenu = action.payload;
        },
        startMusic: (state) => {
            state.isPlay = true
        },
        stopMusic: (state) => {
            state.isPlay = false
        },
        setMusic: (state, action: PayloadAction<IMusic>) => {
            if (!state.loading && state.musicList.length > 0) {
                if (state.selectedMusic?.url !== action.payload.url) {
                    state.loading = true
                    state.isPlay = false;
                    const index = state.musicList.findIndex((item) => item.id === action.payload?.id);
                    state.currentIndex = index;
                    state.selectedMusic = action.payload;
                } else {
                    state.isRestart = true;
                }
            }
        },
        setRestart: (state, action: PayloadAction<boolean>) => {
            state.isRestart = action.payload
        },
        setMusicList: (state, action: PayloadAction<IMusic[]>) => {
            state.musicList = action.payload;
        },
        setSelectedMusicPlaylist: (state, action: PayloadAction<IMusic>) => {
            state.selectedMusicPlaylist = action.payload
        },
        nextMusic: (state) => {
            if (!state.loading) {
                if (state.musicList.length > 1) {
                    state.loading = true;
                    state.isPlay = false;
                    if (state.currentIndex < 0) {
                        state.currentIndex = 0;
                    } else {
                        state.currentIndex = (state.currentIndex + 1) % state.musicList.length;
                    }
                    state.selectedMusic = state.musicList[state.currentIndex];
                } else if (state.musicList.length === 1) {
                    state.isRestart = true
                }
            }
        },
        prevMusic: (state) => {
            if (!state.loading) {
                if (state.musicList.length > 1) {
                    state.loading = true;
                    state.isPlay = false;
                    if (state.currentIndex < 0) {
                        state.currentIndex = 0;
                    } else {
                        state.currentIndex = (state.currentIndex - 1 + state.musicList.length) % state.musicList.length;
                    }
                    state.selectedMusic = state.musicList[state.currentIndex];
                } else if (state.musicList.length === 1) {
                    state.isRestart = true
                }
            }
        },
        startLoading: (state) => {
            state.loading = true
        },
        stopLoading: (state) => {
            state.loading = false
        },
        setRefreshPlaylist: (state, action: PayloadAction<boolean>) => {
            state.refreshPlaylist = action.payload
        }
    }
});

export const { 
    setMenu,
    startMusic,
    stopMusic,
    setMusic,
    startLoading,
    stopLoading,
    setMusicList,
    nextMusic,
    prevMusic,
    setRestart,
    setRefreshPlaylist,
    setSelectedMusicPlaylist
} = generalSlice.actions;
export default generalSlice.reducer;