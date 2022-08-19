import React from "react"
import { getPostDate, getPostPath } from '../../model/post';
import { Link } from 'gatsby';

const Series = ({ title, description, posts }) =>
    <div className="category-essays__series">
        <div className="category-essays__series-title">
            [Series] {title}
        </div>
        {description &&
            <div className="category-essays__series-excerpt" dangerouslySetInnerHTML={{__html: description}} />
        }
        <div className="category-essays__series-date">
            {getPostDate(posts[0].date)}
        </div>
        <div className="category-essays__series-essays">
            {posts
                .sort((postA, postB) =>
                    Number(postA.tghpjcPostSeriesPartNumber) - Number(postB.tghpjcPostSeriesPartNumber))
                .map(({
                    slug,
                    title,
                    date,
                    tghpjcPostSeriesPartNumber: partNumber,
                    tghpjcExternalUrl: externalUrl,
                }) => {
                    const essayOutput = (
                        <div className="category-essays__series-essay-title">
                            {partNumber && `Part ${partNumber}: `}{title}
                        </div>
                    )

                    const linkClassName = 'category-essays__series-essay';

                    if (externalUrl) {
                        return (
                            <a href={externalUrl} className={linkClassName} key={slug}>
                                {essayOutput}
                            </a>
                        )
                    } else {
                        return (
                            <Link to={getPostPath(slug, date)} className={linkClassName} key={slug}>
                                {essayOutput}
                            </Link>
                        )
                    }
                })}
        </div>
    </div>

export default Series