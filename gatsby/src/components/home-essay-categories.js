import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import HomeEssayCategory from "../components/home-essay-category";

const HomeEssayCategories = ({ selectedCategories }) => {

    const {
        allWpCategory: {
            nodes: allCategories
        }
    } = useStaticQuery(graphql`
        query categoriesQuery {    
            allWpCategory(filter: {slug: {ne: "uncategorized"}}) {
                nodes {
                    databaseId
                    slug
                    name
                    posts {
                        nodes {
                            slug
                            title
                            excerpt
                            date
                            tghpTaxonomySeries {
                                nodes {
                                    name
                                    slug
                                    description
                                }
                            }
                        }
                    }
                }
            }
        }
    `)

    const categories = selectedCategories
        .map((category, idx) => ({ ...category, menuOrder: idx }))
    const filteredCategories = allCategories
        .filter(category => categories.find(item => parseInt(item.id) === category.databaseId))
        .map(category => {
            const item = categories.find(item => parseInt(item.id) === category.databaseId)
            return {
                ...category,
                menuOrder: item.menuOrder
            }
        })
        .sort((catA, catB) => catA.menuOrder - catB.menuOrder)

    return (
        filteredCategories.map(({ name, posts, slug }) => (
            <HomeEssayCategory title={name} posts={posts} slug={slug} key={slug} />
        ))
    )
}

export default HomeEssayCategories