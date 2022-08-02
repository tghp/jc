import React, { useState } from "react";

const TocItem = ({ url, title, navItems }) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const handleToggle = () => setSubMenuOpen(!subMenuOpen)

    return (
        <li>
            <a href={url} onClick={navItems && handleToggle}>{title} <i className="arrow-right" /></a>
            {navItems &&
            <ul className={`subnav${subMenuOpen ? ' is-open' : ''}`}>
                {navItems?.map(({ url, title }) => (
                    <li key={url}>
                        <a href={url}>{title} <i className="arrow-right" /></a>
                    </li>
                ))}
            </ul>
            }
        </li>
    )
}

export default TocItem