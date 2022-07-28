import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby";
import BoatIllustration from "../assets/footer-boat.svg";

const Footer = ({ siteTitle }) => {
    const {
        menu: {
            menuData: { items },
        },
    } = useStaticQuery(graphql`
        query FooterNav {
            menu: wordpressMenuLocation(slug: {eq: "footer-nav"}) {
                menuData {
                    items {
                        title
                        url
                        ID
                    }
                }
            }
        }
    `)

    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                <div className="site-footer__inner-boat-illustration">
                    <BoatIllustration />
                </div>
                <div className="site-footer__inner-content">
                    <div className="site-footer__copyright">
                        @ { siteTitle }, { new Date().getFullYear() }
                    </div>
                    <ul className="site-footer__nav">
                        {items.map(({ ID, title, url }) => (
                            <li key={ID}>
                                <Link to={url}>
                                    {title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="site-footer__built-by">
                        <a href="https://and-now.co.uk/" target="_blank" rel="noreferrer">Designed by And–Now</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer