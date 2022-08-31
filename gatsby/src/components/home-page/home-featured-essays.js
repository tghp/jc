import React from "react"
import { getPostPath } from "../../model/post";
import HeadingWithLink from "../heading-with-link";
import EssayLinkWrapper from "../essay-link-wrapper";

const HomeFeaturedEssays = ({ title, posts, linkText, linkTo }) => (

    <div className="featured-essays__latest">
        <HeadingWithLink
            title={title}
            linkText={linkText}
            linkTo={linkTo}
            linkArrow={false}
        />
        {posts.map(({
            slug,
            date,
            title,
            excerpt,
            tghpTaxonomySeries,
            tghpjcPostSeriesPartNumber: seriesPart,
            tghpjcExternalUrl: externalUrl,
        }) => {
            const seriesTitle = tghpTaxonomySeries?.nodes[0]?.name

            const essayOutput = (
                <>
                    <div className="featured-essays__essay-title">
                        {seriesTitle && `${seriesTitle} / Part ${seriesPart}: `}
                        {title}
                    </div>
                    <div className="featured-essays__essay-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />
                </>
            )

            return (
                <EssayLinkWrapper
                    externalUrl={externalUrl}
                    className={`featured-essays__essay`}
                    postPath={getPostPath(slug, date)}
                    key={slug}
                >
                    {essayOutput}
                </EssayLinkWrapper>
            )
        })}
    </div>
)

export default HomeFeaturedEssays