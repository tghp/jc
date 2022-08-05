import React from "react"
import Layout from "../components/layout"
import {graphql, Link} from "gatsby"
import LinkArrow from "../assets/link-arrow.svg";
import {MetaData} from "../components/meta-data";

export default function Page({ data }) {
    const { title, content } = data.allWpPage.nodes[0];

    return (
        <>
            <MetaData title={title} />
            <Layout location={'default-page'}>
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
        </>
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
            }
        }
    }
`