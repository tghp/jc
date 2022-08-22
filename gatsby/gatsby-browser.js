exports.wrapRootElement = ({ element }) => {
    if (typeof window !== "undefined") {
        document.body.addEventListener('click', e => {
            if (e.target.host && e.target.host !== window.location.host) {
                e.preventDefault();
                window.open(e.target.href, '_blank');
            }
        });
    }

    return element;
}