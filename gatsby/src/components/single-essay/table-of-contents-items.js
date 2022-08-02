import React from "react";
import TocItem from './table-of-contents-item'

const TocNav = ({ navItems }) => (
    <ul className="single-essay__sidebar-menu-nav">
        {navItems?.map(({ url, title, items: navItems }) => (
            <TocItem
                key={url}
                url={url}
                title={title}
                navItems={navItems} />
        ))}
    </ul>
)

export default TocNav