import React, {useState} from "react";

const TocNav = ({ hTags }) => {

    const SubMenu = ({ url, title, hTags }) => {
        const [subMenuOpen, setSubMenuOpen] = useState(false);

        const handleToggle = function() {
            setSubMenuOpen(!subMenuOpen)
        }
        // console.log(subMenuOpen)

        return (
            <li key={url} onClick={handleToggle}>
                <a href={url}>{title} <i className="arrow-right" /></a>
                {hTags &&
                    <ul className={`subnav${subMenuOpen ? ' is-open' : ''}`}>
                        {hTags?.map(function({ url, title, items: hTags }) {
                            return (
                                <li key={url}>
                                    <a href={url}>{title} <i className="arrow-right" /></a>
                                </li>
                            )
                        })}
                    </ul>
                }
            </li>
        )
    }

    return (
        <ul className="single-essay__sidebar-menu-nav">
            {hTags?.map(({ url, title, items: hTags }) => (
                <SubMenu
                    key={url}
                    url={url}
                    title={title}
                    hTags={hTags} />
            ))}
        </ul>
    )
}


export default TocNav