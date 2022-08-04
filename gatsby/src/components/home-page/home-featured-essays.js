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
        {posts.map(({ slug, date, title, excerpt, tghpTaxonomySeries, tghpjcPostSeriesPartNumber: seriesPart }) => {
            const seriesTitle = tghpTaxonomySeries?.nodes[0]?.name

            return (
                <Link to={getPostPath(slug, date)} className="featured-essays__essay" key={slug}>
                    <div className="featured-essays__essay-title">
                        <div className="featured-essays__essay-title-series">
                            {seriesTitle && `${seriesTitle} / Part ${seriesPart}: `}
                        </div>
                        {title}
                    </div>
                    <div className="featured-essays__essay-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />
                </Link>
            )
        })}
    </div>
)

export default HomeFeaturedEssays