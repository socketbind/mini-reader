module.exports = bundler => {
    bundler.addAssetType('html', require.resolve('./HTMLIgnoreMustacheAsset'));
};