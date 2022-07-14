import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header";
import Footer from "./footer";

import '../styles/main.scss';

const Layout = ({ isHomePage, children }) => {
    const {
        wp: {
            generalSettings: { title },
        },
    } = useStaticQuery(graphql`
        query LayoutQuery {
            wp {
                generalSettings {
                    title
                    description
                }
            }
        }
    `)

    return (
        <div className="global-wrapper" data-is-root-path={isHomePage}>
            <Header title={title} />
            <main className="site-main">
                {children}
            </main>
            <Footer title={title} />
        </div>
    )
}

export default Layout