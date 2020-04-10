const HTMLAsset = parseInt(process.versions.node, 10) < 8
    ? require('parcel-bundler/lib/assets/HTMLAsset')
    : require('parcel-bundler/src/assets/HTMLAsset');

class HTMLIgnoreMustacheAsset extends HTMLAsset {
    async collectDependencies() {
        this.ast = new Proxy(this.ast, {
            get(target, key) {
                if (key === 'walk') {
                    return _walk.call(target, target[key]);
                }
                return target[key];
            }
        });

        return HTMLAsset.prototype.collectDependencies.call(this);
    }
}

function _walk(walk) {
    return htmlWalkFn => walk.call(this, node => {
        const src = node.attrs && (
            (node.tag === 'script' && node.attrs.src) ||
            (node.tag === 'link' && node.attrs.href)
        );

        if (src && src.startsWith('{{') && src.endsWith('}}')) {
            return node;
        }

        return htmlWalkFn(node);
    });
}

module.exports = HTMLIgnoreMustacheAsset;