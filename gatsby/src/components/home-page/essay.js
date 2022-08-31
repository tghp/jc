import React from "react"
import { getPostDate, getPostPath } from '../../model/post';
import Arrow from '../../assets/link-arrow.svg';
import EssayLinkWrapper from "../essay-link-wrapper";

const Essay = ({
    post: {
        title,
        slug,
        date,
        excerpt,
        tghpjcExternalUrl: externalUrl,
    }
}) => {
    const essayOutput = (
        <>
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
        </>
    )

    return (
        <EssayLinkWrapper
            externalUrl={externalUrl}
            className={`category-essays__essay`}
            postPath={getPostPath(slug, date)}
        >
            {essayOutput}
        </EssayLinkWrapper>
    )
}

export default Essay