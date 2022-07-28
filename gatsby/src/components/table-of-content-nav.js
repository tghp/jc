import React from "react";

const TableOfContentNav = ({ hTags }) => (
    <ul className="single-essay__sidebar-menu-nav">
        {hTags?.map(({ url, title, items: hTags }) => (
            <li key={url}>
                <a href={url}>{title}</a>
                {hTags && <TableOfContentNav hTags={hTags} />}
            </li>
        ))}
    </ul>
)

export default TableOfContentNav