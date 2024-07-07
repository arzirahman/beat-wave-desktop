import { MouseEvent } from "react";
import artistImg from '../assets/no-artist.png';
import Image from "./image";

export type CardProps = {
    src: string;
    body: string;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Card = ({ src, body, onClick }: CardProps) => {
    return (
        <button onClick={onClick} className="transition-all h-[15rem] duration-300 cursor-pointer card glass hover:scale-95">
            <figure className="w-full h-full bg-accent">
                <Image alt="" className="object-cover w-full h-full" src={src ? `http://203.194.114.17:4000${src}` : ''} defaultSrc={artistImg} />
            </figure>
            <div className="p-4 card-body">
                <div className='overflow-hidden font-bold'>{body}</div>
            </div>
        </button>
    )
}