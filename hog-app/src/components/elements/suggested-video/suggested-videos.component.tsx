import React from "react";
import "./suggested-videos.component.scss";
import { PostReturnI, getPosts } from "../../../api/new-feed/getPost";
import { SuggestedVideo } from "./suggested-video.component";

export const SuggestedVideos = () => {
    const [skip, setSkip] = React.useState<number>(0);
    const [posts, setPosts] = React.useState<PostReturnI[] | []>([]);
    const ref = React.useRef<HTMLDivElement>(null);

    const trackScrolling = () => {
        if (ref.current) {
            const isNearBottom =
                ref.current.getBoundingClientRect().bottom <=
                window.innerHeight;
            if (isNearBottom) {
                setSkip((skip) => skip + 1);
            }
        }
    };

    React.useEffect(() => {
        if (ref.current) {
            document.addEventListener("scroll", trackScrolling);
            return () => {
                document.removeEventListener("scroll", trackScrolling);
            };
        }
    }, []);

    React.useEffect(() => {
        (async () => {
            const response = await getPosts(skip, true, undefined);
            setPosts((posts) => {
                if (posts.length) {
                    return [...posts, ...response];
                } else {
                    return response;
                }
            });
        })();
    }, [skip]);

    if (posts.length === 0) {
        return <></>;
    }

    return (
        <div className='suggest-post-container' ref={ref}>
            {posts.map((post) => (
                <SuggestedVideo post={post} key={post._id} />
            ))}
        </div>
    );
};
