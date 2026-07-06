exports.onClientEntry = () => {
    if (typeof window === "undefined") {
        return;
    }

    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');

        if (link && link.host && link.host !== window.location.host) {
            e.preventDefault();
            window.open(link.href, '_blank', 'noopener');
        }
    });
}
