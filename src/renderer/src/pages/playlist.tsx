import { useState, useEffect, ChangeEvent } from "react";
import { TbPlaylist } from "react-icons/tb";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

interface Playlist {
  name: string;
}

export default function Playlist() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [newPlaylistName, setNewPlaylistName] = useState<string>("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editPlaylistName, setEditPlaylistName] = useState<string>("");

    useEffect(() => {
        const storedPlaylists = localStorage.getItem("playlists");
        if (storedPlaylists) {
        setPlaylists(JSON.parse(storedPlaylists));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("playlists", JSON.stringify(playlists));
    }, [playlists]);

    const addPlaylist = () => {
        if (newPlaylistName.trim() !== "") {
        setPlaylists([...playlists, { name: newPlaylistName }]);
        setNewPlaylistName("");
        }
    };

    const editPlaylist = (index: number) => {
        setEditIndex(index);
        setEditPlaylistName(playlists[index].name);
    };

    const updatePlaylist = () => {
        if (editIndex !== null) {
        const updatedPlaylists = [...playlists];
        updatedPlaylists[editIndex].name = editPlaylistName;
        setPlaylists(updatedPlaylists);
        setEditIndex(null);
        setEditPlaylistName("");
        }
    };

    const deletePlaylist = (index: number) => {
        const updatedPlaylists = playlists.filter((_, i) => i !== index);
        setPlaylists(updatedPlaylists);
    };

    const handleNewPlaylistChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPlaylistName(e.target.value);
    };

    const handleEditPlaylistChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditPlaylistName(e.target.value);
    };

    return (
        <div className="flex flex-col w-full h-full gap-4 overflow-y-auto">
            <div className="flex items-center justify-between gap-2 px-4 pt-6">
                <div className="flex items-center gap-4 p-2">
                <TbPlaylist size={25} />
                <div>Your Playlist</div>
                </div>
            </div>

            <div className="flex gap-4 px-4">
                <input
                    type="text"
                    value={newPlaylistName}
                    onChange={handleNewPlaylistChange}
                    placeholder="Add new playlist"
                    className="flex-1 input"
                />
                <button
                    onClick={addPlaylist}
                    className="btn btn-primary"
                >
                    Add Playlist
                </button>
            </div>

            <div className="flex-1 px-4 py-2 overflow-auto">
                {playlists.map((playlist, index) => {
                    return (
                        <div
                            key={Math.floor(Math.random() * 1000000)}
                            className="flex items-center justify-between py-2 border-y border-base-100"
                        >
                            {editIndex === index ? (
                            <div className="flex w-full gap-2">
                                <input
                                    type="text"
                                    value={editPlaylistName}
                                    onChange={handleEditPlaylistChange}
                                    className="flex-1 input"
                                />
                                <button
                                    onClick={updatePlaylist}
                                    className="w-20 p-2 btn btn-success"
                                >
                                    Save
                                </button>
                            </div>
                            ) : (
                            <div className="flex items-center justify-between w-full gap-2">
                                <div>{playlist.name}</div>
                                <div className="flex gap-2">
                                <button
                                    onClick={() => editPlaylist(index)}
                                    className="w-12 p-2 btn btn-warning"
                                >
                                    <FaPencilAlt size={20} />
                                </button>
                                <button
                                    onClick={() => deletePlaylist(index)}
                                    className="w-12 p-2 btn btn-error"
                                >
                                    <FaTrashAlt size={20} />
                                </button>
                                </div>
                            </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}