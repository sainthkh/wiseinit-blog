const path = require('path')
const fs = require('fs')

const rootDir = path.join(__dirname, '../..')

function end(builder) {
	createPages()
	createMainPage(builder)
}

function createPages() {
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

function createMainPage(builder) {
	let recentPosts = builder.orderedPosts.slice(0, 6)

	let html = recentPosts.map(post => {
		let content = post.__content
		content = content.replace(/<.*?>/g, '')
		content = content.replace(/!\[.*\]\(.*\)/g, '')
		content = content.replace(/# Korean Only/g, '')
		content = content.replace(/# With English( Translations)?/g, '')
		let summary = content.split(' ').slice(0, 80).join(' ')
		summary = builder.compileContent(summary)
		return [
			`<div class="main-page-post">`,
			`<div class="post-title">`,
			`<a href="/${post.baseUrl}">${post.title}</a>`,
			`</div>`,
			`<div class="post-summary">`,
			`${summary}`,
			`</div>`,
			`<div class="post-cta">`,
			`<a href="/${post.baseUrl}">Read More</a>`,
			`</div>`,
			`</div>`,
		].join('\n')
	}).join('\n')

	let mainPagePath = path.join(rootDir, '_book/index.html')
	let mainPage = fs.readFileSync(mainPagePath).toString()
	mainPage = mainPage.replace('[[[posts]]]', html)
	fs.writeFileSync(mainPagePath, mainPage)
}

module.exports = {
	end,
}