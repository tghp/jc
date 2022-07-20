import React from "react"
import { Link } from "gatsby"
import { getPostPath, getPostDate } from "../model/post";

const EssayLink = ({ post: { slug, date, title, excerpt } }) => (

    <Link to={getPostPath(slug, date)} className="post-essay">
        <div className="post-essay__date">
            {getPostDate(date)}
        </div>
        <div className="post-essay__title">
            {title}
        </div>
        <div className="post-essay__excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />
        <div className="post-essay__action">
            Continue reading
        </div>
    </Link>
)

export default EssayLink