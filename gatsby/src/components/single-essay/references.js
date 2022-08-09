import React from "react"
import classnames from "classnames"
import Reference from "./reference"

const References = ({ references, referenceRowSizes, referencesAreaMeasureRef, referenceSidebarRefs }) => {
    const [referenceRowSizesDesktop, referenceRowSizesMobile] = referenceRowSizes;

    const classNames = [
        'single-essay__references',
        referenceRowSizesDesktop.length && 'single-essay__references--visible',
    ];

    return (
        <div
            className={classnames(classNames)}
            ref={referencesAreaMeasureRef}
            style={{
                gridTemplateRows: referenceRowSizesDesktop.join(' '),
                '--reference-row-sizes-mobile': referenceRowSizesMobile.join(' '),
            }}
        >
            {references.map((reference, index) =>
                <Reference
                    key={index}
                    reference={reference}
                    index={index}
                    referenceSidebarRefs={referenceSidebarRefs}
                />
            )}
        </div>
    )
}

export default References