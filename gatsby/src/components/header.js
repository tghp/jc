import React, {useEffect, useRef} from "react"
import { graphql, useStaticQuery, Link } from "gatsby";

const Header = ({ siteTitle }) => {
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

    const header = useRef()

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        const body = document.body
        const scrollUp = "scroll-up"
        const scrollDown = "scroll-down"
        let lastScroll = 0

        body.classList.remove(scrollDown, scrollUp)

        const onScroll = () => {
            const currentScroll = window.pageYOffset

            if (currentScroll <= header.current.offsetHeight) {
                body.classList.remove(scrollUp)
                return
            }

            if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
                // Down scroll
                body.classList.remove(scrollUp)
                body.classList.add(scrollDown)
            } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
                // Up scroll
                body.classList.remove(scrollDown)
                body.classList.add(scrollUp)
            }
            lastScroll = currentScroll
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className="site-header" ref={header}>
            <div className="site-header__inner">
                <div className="site-header__inner-content">
                    <div className="site-header__logo">
                        <Link to={'/'}>
                            {siteTitle}
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
            </div>
        </header>
    )
}

export default Header