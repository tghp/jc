import React from "react"
import { getPostDate, getPostPath } from '../../model/post';
import { Link } from 'gatsby';
import Arrow from '../../assets/link-arrow.svg';

const Essay = ({ post: { title, slug, date, excerpt } }) =>
    <Link to={getPostPath(slug, date)} className="category-essays__essay">
        <div className="category-essays__essay-title">
            {title}
        </div>
        <div className="category-essays__essay-excerpt" dangerouslySetInnerHTML={{__html: excerpt}}/>
        <div className="category-essays__essay-date">
            {getPostDate(date)}
        </div>
        <div className="category-essays__essay-action">
            Continue reading <Arrow/>
        </div>
    </Link>

export default Essay