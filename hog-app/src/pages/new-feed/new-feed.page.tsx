import React from "react";
import { PostReturnI, getPostById } from "../../api/new-feed/getPost";
import { PrincipalVideo } from "../../components/elements/principal-video/principal-video.component";
import { HomeLayout } from "../../components/layouts/home-layout.component";
import { useSearchParams } from "react-router-dom";
import { SuggestedVideos } from "../../components/elements/suggested-video/suggested-videos.component";

export const NewFeedPage = () => {
    const [params] = useSearchParams();
    const [post, setPost] = React.useState<PostReturnI>();

    React.useEffect(() => {
        (async () => {
            const idPost = params.get("q");
            const post = await getPostById(idPost);
            setPost(post);
        })();
    }, [params]);

    return (
        <HomeLayout>
            <PrincipalVideo post={post} />
            <SuggestedVideos />
        </HomeLayout>
    );
};
