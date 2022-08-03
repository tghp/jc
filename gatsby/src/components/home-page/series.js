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
                .map(({slug, title, date, tghpjcPostSeriesPartNumber: partNumber}) => (
                    <Link to={getPostPath(slug, date)} className="category-essays__series-essay" key={slug}>
                        <div className="category-essays__series-essay-title">
                            Part {partNumber}: {title}
                        </div>
                    </Link>
                ))}
        </div>
    </div>

export default Series