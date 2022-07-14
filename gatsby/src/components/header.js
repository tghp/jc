import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby";

const Header = ({ title }) => {
    const {
        menu: {
            menuData: { items },
        },
    } = useStaticQuery(graphql`
        query HeaderNav {
          menu: wordpressMenuLocation(slug: {eq: "header-nav"}) {
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
        <header className="site-header">
            <div className="site-header__inner">
                <div className="site-header__logo">
                    <Link to={'/'}>
                        {title}
                    </Link>
                </div>

                <ul className="site-header__nav">
                    {items.map(({ ID, title, url }) => (
                        <li key={ID}>
                            <Link to={url}>
                                {title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    )
}

export default Header