import React, {useState} from "react";

const TocNav = ({ hTags }) => {

    const handleToggle = () => {

    }

    const SubMenu = ({hTags}) => {
        const [subMenuOpen, setSubMenuOpen] = useState(false);
        return (
            <ul className="subnav">
                {hTags?.map(function({ url, title, items: hTags }) {
                    return (
                        <li key={url}>
                            <a href={url}>{title} <i className="arrow-right" /></a>
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        <ul className="single-essay__sidebar-menu-nav">
            {hTags?.map(function({ url, title, items: hTags }) {
                return (
                    <li key={url} onClick={handleToggle}>
                        <a href={url}>{title} <i className="arrow-right" /></a>
                        {hTags && <SubMenu hTags={hTags} />}
                    </li>
                )
            })}
        </ul>
    )
}


export default TocNav