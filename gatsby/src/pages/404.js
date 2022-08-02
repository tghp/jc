import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout";
import LinkArrow from "../assets/link-arrow.svg";

const NotFoundPage = () => {
    return (
        <Layout location={'error-404'}>
            <div className="archive-posts">
                <div className="archive-posts__header">
                    <div className="archive-posts__header-inner">
                        <Link to={'/'} className="archive-posts__header-back-btn">
                            <LinkArrow /> Back to homepage
                        </Link>
                        <h1 className="archive-posts__header-title">
                            Page not found
                        </h1>
                    </div>
                </div>
            </div>
            <div className="default-page-content">
                <h3>Sorry we couldn’t find what you were looking for</h3>
                <Link to="/"><LinkArrow /> Go home</Link>
            </div>
        </Layout>
    )
}

export default NotFoundPage
