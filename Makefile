
clean:
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name 'dist' -type d -prune -exec rm -rf '{}' +
	find . -name '.turbo' -type d -prune -exec rm -rf '{}' +
	find . -name '.output' -type d -prune -exec rm -rf '{}' +
	find . -name '.nuxt' -type d -prune -exec rm -rf '{}' +
