import React, { useContext, useEffect } from "react"
import ModalContext from "../../context/modal-context"
import {getFavouritePosts, getOrderedPosts} from '../../model/post';
import HomeFeaturedEssays from "./home-featured-essays";
import HomeEssayCategories from "./home-essay-categories";
import FenceIllustration from "../../assets/footer-fence.svg";
import WalkerIllustration from "../../assets/footer-walker.svg";

const HomeContent = ({ homeMeta, allPosts, favouritePostIds }) => {
    /**
     * Subscribe modal trigger
     */
    const modalContext = useContext(ModalContext)

    useEffect(() => {
        const showModalHandler = () => modalContext.showModal()

        const button = document.querySelector('.shortcode-text-button__button')
        if (button) {
            button.addEventListener('click', showModalHandler)

            return () => button.removeEventListener('click', showModalHandler)
        }
    }, [modalContext]);

    /**
     * Get favourite essays (Top 3)
     */
    const favouritePosts = getFavouritePosts(favouritePostIds, allPosts)
        .slice(0, 3)

    /**
     * Get latest essays (Top 3)
     * exclude favourite posts
     */
    const latestPosts = allPosts
        .filter(item => !favouritePostIds.includes(String(item.databaseId)))
        .slice(0, 3)

    return (
        <>
        <div className="intro-text">
            <div className="intro-text__inner">
                <div className="intro-text__column-1" dangerouslySetInnerHTML={{ __html: homeMeta.tghpjcIntroColumn1}} />
                <div className="intro-text__column-2" dangerouslySetInnerHTML={{ __html: homeMeta.tghpjcIntroColumn2}} />
                <div className="intro-text__photo">
                    {/* TODO: Work out how to get this image into Gatsby itself, rather than loading the WP image URL */}
                    <img src={homeMeta.introPhoto.publicURL}
                         sizes="200px"
                         alt={homeMeta.tghpjcIntroPhoto.alt} />
                </div>
            </div>
        </div>
        <div className="featured-essays">
            <div className="featured-essays__inner">
                <HomeFeaturedEssays
                    title="Latest"
                    posts={latestPosts}
                    linkText="View all the latest essays"
                    linkTo={'/archive'} />
                <HomeFeaturedEssays
                    title="Favourites"
                    posts={favouritePosts}
                    linkText="View all Favourites"
                    linkTo={'/favourites'} />
            </div>
        </div>
        <div className="essay-categories">
            <div className="essay-categories__inner">
                <HomeEssayCategories selectedCategories={homeMeta.tghpjcHomeEssayCategories} />
            </div>
        </div>
        <div className="about-text" id="about-section">
            <div className="about-text__inner">
                <div className="about-text__pre-illustration">
                    <WalkerIllustration />
                </div>
                <div className="about-text__header">
                    <h2 className="about-text__header-title">{homeMeta.tghpjcAboutTextTitle}</h2>
                    <div className="about-text__header-illustration">
                        <FenceIllustration />
                    </div>
                </div>
                <div className="about-text__columns">
                    <div className="about-text__columns-1" dangerouslySetInnerHTML={{ __html: homeMeta.tghpjcAboutTextColumn1}} />
                    <div className="about-text__columns-2" dangerouslySetInnerHTML={{ __html: homeMeta.tghpjcAboutTextColumn2}} />
                </div>
            </div>
        </div>
        </>
    )
}

export default HomeContent