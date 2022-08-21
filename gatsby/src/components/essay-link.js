import React from "react"
import { Link } from "gatsby"
import { getPostPath, getPostDate } from "../model/post";
import LinkArrow from "../assets/link-arrow.svg";

const EssayLink = ({
    post: {
        slug,
        date,
        title,
        excerpt,
        tghpTaxonomySeries,
        tghpjcPostSeriesPartNumber: seriesPart,
        tghpjcExternalUrl: externalUrl,
    }
}) => {
    const seriesTitle = tghpTaxonomySeries?.nodes[0]?.name

    const essayOutput = (
        <>
            <div className="post-essays__essay-date">
                {getPostDate(date)}
            </div>
            <div className="post-essays__essay-title">
                <div className="post-essays__essay-title-series">
                    {seriesTitle && `${seriesTitle} / Part ${seriesPart}: `}
                </div>
                {title}
            </div>
            {excerpt && <div className="post-essays__essay-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />}
            <div className="post-essays__essay-action">
                Continue reading <LinkArrow />
            </div>
        </>
    )

    const linkClassName = 'post-essays__essay';

    if (externalUrl) {
        return (
            <a href={externalUrl} className={linkClassName}>
                {essayOutput}
            </a>
        )
    } else {
        return (
            <Link to={getPostPath(slug, date)} className={linkClassName}>
                {essayOutput}
            </Link>
        )
    }
}

export default EssayLink