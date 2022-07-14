import React from "react"
import { Link } from "gatsby"
import { getPostPath } from "../model/post";

const HomeEssayCategory = ({ title, posts }) => (

    <div className="essays-categories__category">
        <h2>{title}</h2>
        <ul>
            {posts.map(({ slug, date, title }) => (
                <li key={slug}>
                    <Link to={getPostPath(slug, date)}>
                        {title}
                    </Link>
                </li>
            ))}
        </ul>
    </div>

)

export default HomeEssayCategory