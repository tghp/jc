import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header";
import Footer from "./footer";
import SubscribeButton from "./subscribe-button";

import '../styles/main.scss';

const Layout = ({ isHomePage, children, location }) => {
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

    const globalWrapperClasses = [
        "global-wrapper",
    ]
    location && globalWrapperClasses.push(location)

    return (
        <div className={globalWrapperClasses.join(' ')} data-is-root-path={isHomePage}>
            <Header siteTitle={title} />
            <main className="site-main">
                {children}
            </main>
            <Footer siteTitle={title} />
            <SubscribeButton />
        </div>
    )
}

export default Layout