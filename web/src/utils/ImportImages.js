
export default function importImages(r) {
    let paths = r.keys()
    let urls = r.keys().map(r)
    let paths_urls = {}
    for (let i = 0; i < paths.length; i++) {
        Object.assign(paths_urls, { [paths[i]]: urls[i] });
    }
    return {urls, paths, dict: paths_urls};
}