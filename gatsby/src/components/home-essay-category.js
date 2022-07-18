import React from "react"
import { Link } from "gatsby"
import { getPostPath, getPostDate } from "../model/post";

const HomeEssayCategory = ({ title, posts }) => (

    <div className="essay-categories__category">
        <h2>{title}</h2>
        {posts.nodes.map(({ slug, date, title, excerpt }) => (
            <Link to={getPostPath(slug, date)} className="essay-categories__essay" key={slug}>
                <div className="essay-categories__essay-title">
                    {title}
                </div>
                <div className="essay-categories__essay-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />
                <div className="essay-categories__essay-date">
                    {getPostDate(date)}
                </div>
            </Link>
        ))}
    </div>
)

export default HomeEssayCategory