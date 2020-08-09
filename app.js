const pupperter = require("puppeteer")

async function start() {

    async function loadMore(page, selector) {

        const moreButton = await page.$(selector)
        if (moreButton) {
            console.log("Botão")
            await moreButton.click()
            await page.waitFor(selector, { timeout: 3000 }).catch(() => { console.log("Acabou") })
            await loadMore(page, selector)
        }
    }

    async function getComments(page, selector) {
        const comments = await page.$$eval(selector, links => links.map(link => { return link.innerText }))
        return comments
    }

    const browser = await pupperter.launch()
    const page = await browser.newPage()
    await page.goto("https://www.instagram.com/p/CDTpYE6puSU/")

    await loadMore(page, ".dCJp8");
    const arrobas = await getComments(page, ".C4VMK span a")
    const counted = count(arrobas)
    const sorted = sort(counted)
    sorted.forEach(arroba => { console.log(arroba) })
    // console.log(comments)

    await browser.close()
}


function count(arrobas) {
    const count = {}
    arrobas.forEach(arroba => { count[arroba] = (count[arroba] || 0) + 1 })
    return count
}

function sort(counted) {
    const entries = Object.entries(counted)
    const sorted = entries.sort((a, b) => b[1] - a[1])
    return sorted
}


start()