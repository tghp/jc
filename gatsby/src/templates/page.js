import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import LinkArrow from "../assets/link-arrow.svg"

export default function Page({ data }) {
    const wpPage = data.allWpPage.nodes[0]
    const { title, content, seo } = wpPage

    return (
        <Layout location={'default-page'} seoData={seo}>
            <div className="archive-posts">
                <div className="archive-posts__header">
                    <div className="archive-posts__header-inner">
                        <Link to={'/'} className="archive-posts__header-back-btn">
                            <LinkArrow /> Back to homepage
                        </Link>
                        <h1 className="archive-posts__header-title">
                            {title}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="default-page-content">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </Layout>
    )
}

export const query = graphql`
    query($slug: String!) {
        allWpPage(filter: { slug: { eq: $slug } }) {
            nodes {
                title
                content
                slug
                date
                ...SeoData
            }
        }
    }
`