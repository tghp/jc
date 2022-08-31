import React from "react"
import { getPostPath, getPostDateMonthDay, getPostDateFullYear } from "../model/post";
import EssayLinkWrapper from "./essay-link-wrapper";

const PostArchive = ({posts}) => {
    const postsUniqueYears = [...new Set(posts.map(post => getPostDateFullYear(post.date)))].sort((postA, postB) => postB - postA)
    const postsArchive = postsUniqueYears.map(year => posts.filter(post => year === getPostDateFullYear(post.date)))

    return (
        postsUniqueYears.map((year, index) => (
            <div className="archive-posts__posts-year archive-year" key={year}>
                <h4 className="archive-year__title">{year}</h4>
                {postsArchive[index].map(({
                    title,
                    slug,
                    date,
                    tghpjcPostSeriesPartNumber: partNumber,
                    tghpjcExternalUrl: externalUrl,
                }) => {
                    const essayOutput = (
                        <>
                            <div className="archive-year__post-date">
                                {`${getPostDateMonthDay(date)}`}
                            </div>
                            <div className="archive-year__post-title">
                                {title}{partNumber && `: Part ${partNumber}`}
                            </div>
                        </>
                    )

                    return (
                        <EssayLinkWrapper
                            externalUrl={externalUrl}
                            className={`archive-year__post`}
                            postPath={getPostPath(slug, date)}
                            key={slug}
                        >
                            {essayOutput}
                        </EssayLinkWrapper>
                    )
                })}
            </div>
        ))
    )
}

export default PostArchive