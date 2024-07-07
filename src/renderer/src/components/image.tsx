import { useEffect, useState } from 'react';
import { request } from '@renderer/utils/axios';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    defaultSrc: string;
}

const fetchAndCacheImage = async (url: string): Promise<string | null> => {
    try {
        if (!url) return null;

        const cachedImage = localStorage.getItem(url);
        if (cachedImage) {
            return cachedImage;
        }

        const response = await request().get(url, { responseType: 'blob' });

        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        return new Promise((resolve) => {
            reader.onloadend = () => {
                const base64data = reader.result as string;
                localStorage.setItem(url, base64data);
                resolve(base64data);
            };
        });
    } catch (error) {
        return null;
    }
};

const Image = ({ src, alt, className, defaultSrc }: ImageProps) => {
    const [imageSrc, setImageSrc] = useState<string>(defaultSrc);

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            const cachedSrc = await fetchAndCacheImage(src);
            if (isMounted && cachedSrc) {
                setImageSrc(cachedSrc);
            } else {
                setImageSrc(defaultSrc);
            }
        };

        loadImage();

        return () => {
            isMounted = false;
        };
    }, [src]);

    return <img src={imageSrc} alt={alt} className={className} />;
};

export default Image;
