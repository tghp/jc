import React, { useEffect, useState } from 'react';

const Reference = ({
  reference,
  index,
  referenceSidebarRefs,
  openIndexes,
  toggleOpenIndex,
  clearOpenIndexes,
}) => {
  const hash = `ref-${index + 1}`;

  const { text: fullText } = reference;
  const characterCount = 270;

  if (!fullText) {
    return <></>;
  }

  const isLongText = fullText.length > characterCount + 20;

  let shortenedText;
  if (isLongText) {
    shortenedText = `${fullText.substring(0, characterCount)} ...`;
  } else {
    shortenedText = fullText;
  }

  const isOpen = openIndexes.includes(index);

  const jumpToContentRef = (e) => {
    e.preventDefault();
    document.getElementById(hash).scrollIntoView();

    clearOpenIndexes();
  };

  const handleReferenceToggleClick = () => {
    toggleOpenIndex(index);
  };

  return (
    <div
      className="single-essay__references-item reference"
      key={index}
      ref={(ref) => (referenceSidebarRefs.current[index] = ref)}
      style={{
        gridRow: `${index * 2 + 2}/${index * 2 + 3}`,
      }}
      id={`reference-item-${index + 1}`}
    >
      <a
        href={`#${hash}`}
        className="reference__index reference__index--link"
        onClick={jumpToContentRef}
      >
        {index + 1}
      </a>
      <div
        className="reference__text"
        dangerouslySetInnerHTML={{ __html: isOpen ? fullText : shortenedText }}
      />
      {isLongText && (
        <button
          className={`reference__more-link${
            isOpen ? ' reference__more-link--less' : ''
          }`}
          onClick={handleReferenceToggleClick}
        >
          {isOpen ? 'Less' : 'More'}
        </button>
      )}
    </div>
  );
};

export default Reference;
