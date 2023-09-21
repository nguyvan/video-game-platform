import React from "react";
import { PostReturnI } from "../../../../api/new-feed/getPost";
import { VideoComponent } from "./video.component";
import "./videos.component.scss";

interface VideosI {
    posts: PostReturnI[];
    setSkip: React.Dispatch<React.SetStateAction<number>>;
}

export const Videos = ({ posts, setSkip }: VideosI) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const isNearBottom =
            target.scrollTop + target.clientHeight >= target.scrollHeight;
        if (isNearBottom) {
            setSkip((skip) => skip + 1);
        }
    };

    const trackScrolling = () => {
        if (ref.current) {
            const { scrollTop, scrollHeight, clientHeight } = ref.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight;
            if (isNearBottom) {
                setSkip((skip) => skip + 1);
            }
        }
    };

    React.useEffect(() => {
        if (ref.current) {
            const element: HTMLDivElement = ref.current;
            element.addEventListener("scroll", trackScrolling);
            return () => {
                element.removeEventListener("scroll", trackScrolling);
            };
        }
    }, []);
    return (
        <div className='videos-container' ref={ref} onScroll={handleScroll}>
            {posts.map((post) => (
                <VideoComponent
                    urlPoster={post.urlImage}
                    urlVideo={post.urlVideo}
                    idPost={post._id}
                    key={post._id}
                />
            ))}
        </div>
    );
};
