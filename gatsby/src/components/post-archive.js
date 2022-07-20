import React from "react"
import { Link } from "gatsby"
import { getPostPath, getPostDateMonthDay, getPostDateFullYear} from "../model/post";

const PostArchive = ({posts}) => {
    const postsUniqueYears = [...new Set(posts.map(post => getPostDateFullYear(post.date)))].sort((postA, postB) => postB - postA)
    const postsArchive = postsUniqueYears.map(year => posts.filter(post => year === getPostDateFullYear(post.date)))

    return (
        postsUniqueYears.map((year, index) => (
            <div className="archive-posts__post-year" key={year}>
                <h3>{year}</h3>
                {postsArchive[index].map(({ title, slug, date }) => (
                    <Link to={getPostPath(slug, date)} className="archive-posts__year-post" key={slug}>
                        <div className="archive-posts__year-post-date">
                            {`${getPostDateMonthDay(date)}`}
                        </div>
                        <div className="archive-posts__year-post-title">
                            {title}
                        </div>
                    </Link>
                ))}
            </div>
        ))
    )
}

export default PostArchive