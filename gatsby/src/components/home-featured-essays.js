import React from "react"
import { Link } from "gatsby"
import { getPostPath } from "../model/post";

const HomeFeaturedEssays = ({ title,  posts }) => (

    <div className="featured-essays__latest">
        <h2>{title}</h2>
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