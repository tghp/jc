import React from "react"
import { Link } from "gatsby"
import { getPostPath } from "../../model/post";

const HomeFeaturedEssays = ({ title, posts, titleLink }) => (

    <div className="featured-essays__latest">
        <div className="featured-essays__header">
            <div className="featured-essays__header-title">{title}</div>
            {titleLink && <Link to={'/archive'} className="featured-essays__header-view-all">View all the latest essays</Link>}
        </div>
        {posts.map(({ slug, date, title, excerpt }) => (
            <Link to={getPostPath(slug, date)} className="featured-essays__essay" key={slug}>
                <div className="featured-essays__essay-title">
                    {title}
                </div>
                <div className="featured-essays__essay-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />
            </Link>
        ))}
    </div>
)

export default HomeFeaturedEssays