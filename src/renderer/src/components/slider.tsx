import { ChangeEventHandler, MouseEvent, useEffect, useRef } from "react";

export type SliderProps = {
    min: number;
    max: number;
    value: number;
    step: number;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onClick?: (e: MouseEvent<HTMLInputElement>) => void
}

export const Slider = ({ min, max, value, step, onChange, onClick }: SliderProps) => {
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.width = (max === 0 ? 0 : (value / max)) * step * 100 + "%";
        }
    }, [value, max, step])

    return (
        <div className='w-full'>
            <div className="relative h-1 rounded-md slider bg-base-300">
                <div ref={progressRef} className="absolute left-0 h-1 rounded-full progress bg-accent"></div>
            </div>
            <div className="relative range-input">
                <input onClick={onClick} type="range" min={min} max={max} onChange={onChange} step={step} value={value} className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer -top-1 thumb" />
            </div>
        </div>
    )
}