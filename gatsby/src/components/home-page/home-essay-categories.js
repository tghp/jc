import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import HomeEssayCategory from "./home-essay-category";
import {getFilteredCategoriesWithSelectedPosts} from "../../model/post";

const HomeEssayCategories = ({ selectedCategories, allPosts }) => {

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
                    tghpjcCategoryHomePosts   
                }
            }
        }
    `)

    const categoriesWithPosts = getFilteredCategoriesWithSelectedPosts(selectedCategories, allCategories, allPosts)

    return (
        categoriesWithPosts.map(({ name, posts, slug }) => (
            <HomeEssayCategory title={name} posts={posts} slug={slug} key={slug} />
        ))
    )
}

export default HomeEssayCategories