const ITEMS_ON_PAGE = 10;

async function getJSON(url) {
    let response = await fetch(url);

    let json = await response.json();

    let pageItems = Math.ceil(json.count / ITEMS_ON_PAGE);

    createPaginationItems(pageItems);

    console.log(pageItems);
}

function createPaginationItems(num) {

    for (let i = 1; i <= num; i++) {
        let itemHTML = `
            <li class="items__list-item"><a href="#">${i}</a></li>
        `
        let li = createElementFromHTML(itemHTML);

        let pagination = document.getElementById('pagination');

        pagination.append(li);
    }
}

function createElementFromHTML(htmlString) {

    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
 
    return div.firstChild;
}