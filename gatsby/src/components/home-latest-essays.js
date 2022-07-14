import React from "react"
import { Link } from "gatsby"
import { getPostPath } from "../model/post";

const HomeLatestEssays = ({ posts }) => (

    <div className="featured-essays__latest">
        <h2>Latest</h2>
        <ul>
            {posts.map(({id, slug, date, title}) => (
                <li key={id}>
                    <Link to={getPostPath(slug, date)}>
                        {title}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
)

export default HomeLatestEssays