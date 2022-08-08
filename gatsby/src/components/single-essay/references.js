import React from "react"
import classnames from "classnames"

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
            {references.map((reference, i) =>
                <div
                    className="single-essay__references-item reference"
                    key={i}
                    ref={ref => referenceSidebarRefs.current[i] = ref}
                    style={{
                        gridRow: `${(i*2)+2}/${(i*2)+3}`
                    }}
                >
                    <div className="reference__index">
                        {i+1}
                    </div>
                    <div className="reference__text" dangerouslySetInnerHTML={{ __html: reference.text }} />
                </div>
            )}
        </div>
    )
}

export default References