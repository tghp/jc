import React from "react"
import { Link } from "gatsby"
import {categoryPageSlug, getPostPath, getPostDate} from "../model/post";

const HomeEssayCategory = ({ title, slug, posts: { nodes: posts  } }) => {

    const sortedPosts = posts.sort((postA, postB) => new Date(postB.date) - new Date(postA.date)).slice(0, 3)

    return (
        <div className="essay-categories__category">
            <h2>{title}</h2>
            {sortedPosts.map(({ slug, date, title, excerpt }) => (
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
            <Link to={`${categoryPageSlug}/${slug}`} className="essay-categories__category-link">
                View all {title} essays
            </Link>
        </div>
    )
}

export default HomeEssayCategory