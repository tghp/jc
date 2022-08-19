import React from "react"
import { Link } from "gatsby"
import { getPostPath } from "../../model/post";
import HeadingWithLink from "../heading-with-link";

const HomeFeaturedEssays = ({ title, posts, titleLink }) => (

    <div className="featured-essays__latest">
        <HeadingWithLink
            title={title}
            titleLink={titleLink}
            linkText="View all the latest essays"
            linkTo={'/archive'}
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

            const linkClassName = 'featured-essays__essay';

            if (externalUrl) {
                return (
                    <a href={externalUrl} className={linkClassName} key={slug}>
                        {essayOutput}
                    </a>
                )
            } else {
                return (
                    <Link to={getPostPath(slug, date)} className={linkClassName} key={slug}>
                        {essayOutput}
                    </Link>
                )
            }
        })}
    </div>
)

export default HomeFeaturedEssays