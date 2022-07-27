import React from "react"
import { Link } from "gatsby"
import { getPostPath, getPostDate } from "../model/post";
import LinkArrow from "../assets/link-arrow.svg";

const EssayLink = ({ post: { slug, date, title, excerpt, tghpTaxonomySeries } }) => {
    const seriesTitle = tghpTaxonomySeries?.nodes[0]?.name

    return (
        <Link to={getPostPath(slug, date)} className="post-essays__essay">
            <div className="post-essays__essay-date">
                {getPostDate(date)}
            </div>
            <div className="post-essays__essay-title">
                {seriesTitle && `${seriesTitle}: `}{title}
            </div>
            {excerpt && <div className="post-essays__essay-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />}
            <div className="post-essays__essay-action">
                Continue reading <LinkArrow />
            </div>
        </Link>
    )
}

export default EssayLink