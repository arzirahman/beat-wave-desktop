import { MouseEvent } from "react";
import Image from "./image";

export type CardProps = {
    src: string;
    body: string;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Card = ({ src, body, onClick }: CardProps) => {
    return (
        <button onClick={onClick} className="transition-all duration-300 cursor-pointer card glass hover:scale-95">
            <figure className="h-full bg-red-400">
                <Image alt="" className="object-cover w-full h-full" src={src} />
            </figure>
            <div className="p-4 card-body">
                <div className='font-bold whitespace-nowrap text-ellipsis'>{body}</div>
            </div>
        </button>
    )
}