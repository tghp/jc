import React from "react"
import { useStaticQuery, graphql } from "gatsby"

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
      <header>
        Logo
      </header>
      <main>
        {children}
      </main>
      <footer>
        Footer here
      </footer>
    </div>
  )
}

export default Layout