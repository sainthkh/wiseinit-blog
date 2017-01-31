const path = require('path')
const fs = require('fs')

const rootDir = path.join(__dirname, '../..')

function end() {
	const bookDir = path.join(rootDir, '_book/books')
	const pagesDir = path.join(rootDir, '_book/pages')
	if(!fs.existsSync(pagesDir)) {
		fs.mkdirSync(pagesDir)
	}
	copyHtml(bookDir)
}

function copyHtml(dir) {
	fs.readdirSync(dir).forEach(name => {
		let fullPath = path.join(dir, name)
			let stat = fs.statSync(fullPath)
			if(stat.isDirectory()) {
				copyHtml(fullPath)
			} else {
				if(path.extname(name) == '.html') {
					fs.createReadStream(fullPath)
						.pipe(fs.createWriteStream(path.join(rootDir, '_book/pages', name)))
				}
			}
	})
}

module.exports = {
	end,
}