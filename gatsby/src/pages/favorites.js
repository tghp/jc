import React from 'react'
import { graphql, Link } from 'gatsby'
import { HeadMeta } from "../components/meta-data-head";
import { MetaData } from '../components/meta-data';
import { getFavouritePosts } from '../model/post';
import Layout from '../components/layout';
import EssayLink from '../components/essay-link';
import LinkArrow from '../assets/link-arrow.svg';

export default function FavouritesPage({
       data: {
           wp: {
               siteOptionsMetaboxSettings: {
                   optionsFavouritesPosts: favouritePostIds
               }
           },
           allWpPost: { nodes: allPosts }
       }
    }) {

    const favouritePosts = getFavouritePosts(favouritePostIds, allPosts)

    return (
        <>
            <MetaData title={`Favorites`} />
            <Layout location={'favourites'}>
                <div className="archive-posts">
                    <div className="archive-posts__header">
                        <div className="archive-posts__header-inner">
                            <Link to={'/'} className="archive-posts__header-back-btn">
                                <LinkArrow /> Back to homepage
                            </Link>
                            <h1 className="archive-posts__header-title">
                                Favorites
                            </h1>
                        </div>
                    </div>
                    <div className="archive-posts__posts">
                        <div className="archive-posts__posts-sidebar">

                        </div>
                        <div className="archive-posts__posts-latest" id="most-recent-posts">
                            {favouritePosts.map(post => (
                                <EssayLink post={post} key={post.databaseId} />
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export const query = graphql`
{
    wp {
        siteOptionsMetaboxSettings {
            optionsFavouritesPosts
        }
    }
    
    allWpPost {
        nodes {
            title
            slug
            date
            excerpt
            tghpjcPostSeriesPartNumber
            tghpTaxonomySeries {
                nodes {
                    name
                }
            }
            databaseId
        }
    }
}
`

export const Head = () => <HeadMeta />