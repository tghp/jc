import React from "react"
import { Link } from "gatsby"
import { categoryPageSlug, getPostPath, getPostDate } from "../model/post";

import Arrow from "../assets/link-arrow.svg";

const HomeEssayCategory = ({ title, slug, posts: { nodes: essays } }) => {
    const essaysBySeries = {}

    essays.forEach((essay, index) => {
        let slug, type
        const slugName = essay.tghpTaxonomySeries.nodes[0]?.slug

        if (slugName) {
            slug = `series-${slugName}`
            type = `series`
        } else {
            slug = `post-${essay.slug}`
            type = `post`
        }

        if(essaysBySeries[slug] === undefined) {
            essaysBySeries[slug] = {
                type,
                position: index,
            }
            essaysBySeries[slug].data = []
        }

        essaysBySeries[slug].data.push(essay)
    })

    const sortedEssaysBySeries = Object.values(essaysBySeries).sort((postA, postB) => postA.position - postB.position)

    return (
        <div className="essay-categories__category">
            <h2 className="essay-categories__category-title">{title}</h2>
            {sortedEssaysBySeries
            .slice(0, 3)
            .map(({ type, data }) => {
                const [{ slug, date, title, excerpt }] = data

                const seriesTitle = data[0].tghpTaxonomySeries.nodes[0]?.name
                const seriesDescription = data[0].tghpTaxonomySeries.nodes[0]?.description

                return (
                    <div className="essay-categories__category-essays category-essays" key={slug}>

                        {type === 'series'

                            ?

                            <div className="category-essays__series">
                                <div className="category-essays__series-title">
                                    [Series] {seriesTitle}
                                </div>
                                <div className="category-essays__series-excerpt" dangerouslySetInnerHTML={{__html: seriesDescription}}/>
                                <div className="category-essays__series-date">
                                    {getPostDate(data[0].date)}
                                </div>
                                <div className="category-essays__series-essays">
                                    {data
                                    .sort((postA, postB) => new Date(postA.date) - new Date(postB.date))
                                    .map(({slug, title, date}, index) => (
                                        <Link to={getPostPath(slug, date)} className="category-essays__series-essay" key={slug}>
                                            <div className="category-essays__series-essay-title">
                                                Part {++index}: {title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                        :

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
                        }
                    </div>
                )
            })}
            <Link to={`${categoryPageSlug}/${slug}`} className="essay-categories__category-link">
                View all {title} essays
            </Link>
        </div>
    )
}

export default HomeEssayCategory