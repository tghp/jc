import React, { Fragment } from "react"
import parse from 'html-react-parser'
import { InlineMath, BlockMath } from 'react-katex'

const Content = ({
    content,
    hasReferences,
    hasLatex,
    mainContentMeasureRef,
    referenceContentRefs
}) => {
    let processedReferences = [];

    // Remove weird JS in content
    content = content.replace(/<a href="javascript:\s*?void\(0?\);?">(.*?)<\/a>/g, '$1')

    const latexErrorDisplay = (error) => {
        console.error(`LaTeX parse error:\n${error}`)

        return <code>{error.name}: {error.message}</code>
    }

    return (
        <div className="single-essay__main-content" ref={mainContentMeasureRef}>
            {!hasReferences && !hasLatex &&
                <div dangerouslySetInnerHTML={{ __html: content }} />
            }
            {(hasReferences || hasLatex) &&
                <div>
                    {parse(content, {
                        replace: domNode => {
                            /**
                             * LaTeX parsing
                             */
                            if (domNode.name === 'p' && domNode.children.length === 1) {
                                if (domNode.children[0].type === 'text'
                                    && domNode.children[0].data.match(/^\[latex\]/)
                                    && domNode.children[0].data.match(/\[\/latex\]$/))
                                {
                                    const latex = domNode.children[0].data.replace(/\[\/?latex\]/g, '')

                                    return (
                                        <BlockMath
                                            math={latex}
                                            renderError={latexErrorDisplay}
                                        />
                                    )
                                }
                            }

                            if (domNode.type === 'text' && domNode.data.match(/\[latex\]/)) {
                                if (!domNode.data.match(/^\[latex\]/) || !domNode.data.match(/\[\/latex\]$/)) {
                                    const elems = domNode.data.split(/(\[latex\].*?\[\/latex\])/g).map(partContent => {
                                        if (partContent.match(/\[latex\]/)) {
                                            const latex = partContent.replace(/\[\/?latex\]/g, '')

                                            return (
                                                <InlineMath
                                                    key={partContent}
                                                    math={latex}
                                                    renderError={latexErrorDisplay}
                                                />
                                            )
                                        }

                                        return (
                                            <Fragment key={partContent}>
                                                {partContent}
                                            </Fragment>
                                        )
                                    })

                                    return (
                                        <>
                                            {elems}
                                        </>
                                    )
                                }
                            }

                            /**
                             * Reference parsing
                             */
                            if (domNode.name === 'sup') {
                                const referenceNumber = domNode.attribs['data-reference-number'];

                                if (!referenceNumber) {
                                    return
                                }

                                const supProps = {
                                    className: 'article-reference',
                                    id: `ref-${referenceNumber}`
                                };

                                if (processedReferences.indexOf(referenceNumber) === -1) {
                                    supProps.ref = (ref) => {
                                        referenceContentRefs.current[domNode.attribs['data-reference-number']] = ref;
                                    };

                                    processedReferences.push(referenceNumber);
                                }

                                function jumpToSidebarRef() {
                                    document.getElementById(`reference-item-${referenceNumber}`).scrollIntoView();
                                }

                                return (
                                    <sup {...supProps}>
                                        <button onClick={jumpToSidebarRef}>
                                            {domNode.children[0].data}
                                        </button>
                                    </sup>
                                );
                            }
                        }
                    })}
                </div>
            }
        </div>
    )
}

export default Content