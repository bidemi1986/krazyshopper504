//Key extractor for firebase uploaded images only!!*****
function getCacheKey(url) {
	if (!url) return;
	let key = url.split('alt=media&token=')[1];
	console.log('key ', key);
	return key;
}

export default getCacheKey;
