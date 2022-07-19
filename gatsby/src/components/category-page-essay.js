import React from "react"
import { Link } from "gatsby"
import { getPostPath, getPostDate } from "../model/post";

const CategoryEssay = ({ post: { slug, date, title, excerpt } }) => (

    <Link to={getPostPath(slug, date)} className="post-category__essay">
        <div className="post-category__essay-date">
            {getPostDate(date)}
        </div>
        <div className="post-category__essay-title">
            {title}
        </div>
        <div className="post-category__essay-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />
            <div className="post-category__essay-title">
                {title}
            </div>
    </Link>
)

export default CategoryEssay