import React, {useState} from "react"
import classnames from "classnames"
import Reference from "./reference"

const References = ({ references, referenceRowSizes, referencesAreaMeasureRef, referenceSidebarRefs }) => {
    const [referenceRowSizesDesktop, referenceRowSizesMobile] = referenceRowSizes;

    const classNames = [
        'single-essay__references',
        referenceRowSizesDesktop.length && 'single-essay__references--visible',
    ];

    const [openIndexes, setOpenIndexes] = useState([])

    const toggleOpenIndex = (index) => {
        if (openIndexes.includes(index)) {
            setOpenIndexes(openIndexes.filter(val => val !== index))
        } else {
            setOpenIndexes([
                ...openIndexes,
                index
            ])
        }
    }

    const clearOpenIndexes = () => {
        setOpenIndexes([]);
    }

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
                    openIndexes={openIndexes}
                    toggleOpenIndex={toggleOpenIndex}
                    clearOpenIndexes={clearOpenIndexes}
                />
            )}
        </div>
    )
}

export default References