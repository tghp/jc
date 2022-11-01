import React, { Fragment, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import { InlineMath, BlockMath } from 'react-katex';

const Content = ({
  content,
  setImagesReady,
  hasReferences,
  hasLatex,
  mainContentRef,
  mainContentMeasureRef,
  referenceContentRefs,
  referenceSidebarRefs,
  onReferenceClearOpenIndexes,
}) => {
  const imagesLoadedRef = useRef(0);
  let processedReferences = [];

  // Remove weird JS in content
  if (content) {
    content = content.replace(
      /<a href="javascript:\s*?void\(0?\);?">(.*?)<\/a>/g,
      '$1',
    );
  }

  const latexErrorDisplay = (error) => {
    console.error(`LaTeX parse error:\n${error}`);

    return (
      <code>
        {error.name}: {error.message}
      </code>
    );
  };

  useEffect(() => {
    if (!mainContentRef.current) {
      return;
    }

    const maybeSetImagesReady = (totalImageCount) => {
      if (imagesLoadedRef.current === totalImageCount) {
        setImagesReady(true);
      }
    };

    const images = mainContentRef.current.querySelectorAll('img');

    for (const image of images) {
      if (image.complete) {
        imagesLoadedRef.current++;
        maybeSetImagesReady(images.length);
      } else {
        image.addEventListener('load', () => {
          imagesLoadedRef.current++;
          maybeSetImagesReady(images.length);
        });
      }
    }
  }, [setImagesReady, mainContentRef]);

  return (
    <div className="single-essay__main-content" ref={mainContentMeasureRef}>
      {!hasReferences && !hasLatex && (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
      {(hasReferences || hasLatex) && (
        <div>
          {parse(content, {
            replace: (domNode) => {
              /**
               * LaTeX parsing
               */
              if (domNode.name === 'p' && domNode.children.length === 1) {
                if (
                  domNode.children[0].type === 'text' &&
                  domNode.children[0].data.match(/^\[latex\]/) &&
                  domNode.children[0].data.match(/\[\/latex\]$/)
                ) {
                  const latex = domNode.children[0].data.replace(
                    /\[\/?latex\]/g,
                    '',
                  );

                  return (
                    <BlockMath math={latex} renderError={latexErrorDisplay} />
                  );
                }
              }

              if (domNode.type === 'text' && domNode.data.match(/\[latex\]/)) {
                if (
                  !domNode.data.match(/^\[latex\]/) ||
                  !domNode.data.match(/\[\/latex\]$/)
                ) {
                  const elems = domNode.data
                    .split(/(\[latex\].*?\[\/latex\])/g)
                    .map((partContent) => {
                      if (partContent.match(/\[latex\]/)) {
                        const latex = partContent.replace(/\[\/?latex\]/g, '');

                        return (
                          <InlineMath
                            key={partContent}
                            math={latex}
                            renderError={latexErrorDisplay}
                          />
                        );
                      }

                      return (
                        <Fragment key={partContent}>{partContent}</Fragment>
                      );
                    });

                  return <>{elems}</>;
                }
              }

              /**
               * Reference parsing
               */
              if (domNode.name === 'sup') {
                const referenceNumber =
                  domNode.attribs['data-reference-number'];

                if (!referenceNumber) {
                  return;
                }

                const hash = `ref-${referenceNumber}`;

                const supProps = {
                  className: 'article-reference',
                  id: hash,
                };

                if (processedReferences.indexOf(referenceNumber) === -1) {
                  supProps.ref = (ref) => {
                    referenceContentRefs.current[
                      domNode.attribs['data-reference-number']
                    ] = ref;
                  };

                  processedReferences.push(referenceNumber);
                }

                const jumpToSidebarRef = async (e) => {
                  e.preventDefault();
                  await onReferenceClearOpenIndexes();
                  referenceSidebarRefs.current[
                    Number(referenceNumber) - 1
                  ].scrollIntoView();
                };

                return (
                  <sup {...supProps}>
                    <a href={`#${hash}`} onClick={jumpToSidebarRef}>
                      {domNode.children[0].data}
                    </a>
                  </sup>
                );
              }
            },
          })}
        </div>
      )}
    </div>
  );
};

export default Content;
