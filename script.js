document.getElementById('toggle-sidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
});

let fileStructure = {};
let fileContents = {};
const defaultFile = 'docs/home';

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeImage = document.getElementById('themeImage');

    const svgLight = `
<svg class="icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
    <path d="M 12 0 C 11.4 0 11 0.4 11 1 L 11 2 C 11 2.6 11.4 3 12 3 C 12.6 3 13 2.6 13 2 L 13 1 C 13 0.4 12.6 0 12 0 z M 4.1992188 3.1992188 C 3.9492188 3.1992187 3.7 3.3 3.5 3.5 C 3.1 3.9 3.1 4.5003906 3.5 4.9003906 L 4.1992188 5.5996094 C 4.5992187 5.9996094 5.1996094 5.9996094 5.5996094 5.5996094 C 5.9996094 5.1996094 5.9996094 4.5992188 5.5996094 4.1992188 L 4.9003906 3.5 C 4.7003906 3.3 4.4492188 3.1992188 4.1992188 3.1992188 z M 19.800781 3.1992188 C 19.550781 3.1992188 19.299609 3.3 19.099609 3.5 L 18.400391 4.1992188 C 18.000391 4.5992187 18.000391 5.1996094 18.400391 5.5996094 C 18.800391 5.9996094 19.400781 5.9996094 19.800781 5.5996094 L 20.5 4.9003906 C 20.9 4.5003906 20.9 3.9 20.5 3.5 C 20.3 3.3 20.050781 3.1992188 19.800781 3.1992188 z M 12 5 A 7 7 0 0 0 5 12 A 7 7 0 0 0 12 19 A 7 7 0 0 0 19 12 A 7 7 0 0 0 12 5 z M 1 11 C 0.4 11 0 11.4 0 12 C 0 12.6 0.4 13 1 13 L 2 13 C 2.6 13 3 12.6 3 12 C 3 11.4 2.6 11 2 11 L 1 11 z M 22 11 C 21.4 11 21 11.4 21 12 C 21 12.6 21.4 13 22 13 L 23 13 C 23.6 13 24 12.6 24 12 C 24 11.4 23.6 11 23 11 L 22 11 z M 4.9003906 18.099609 C 4.6503906 18.099609 4.3992188 18.200391 4.1992188 18.400391 L 3.5 19.099609 C 3.1 19.499609 3.1 20.1 3.5 20.5 C 3.9 20.9 4.5003906 20.9 4.9003906 20.5 L 5.5996094 19.800781 C 5.9996094 19.400781 5.9996094 18.800391 5.5996094 18.400391 C 5.3996094 18.200391 5.1503906 18.099609 4.9003906 18.099609 z M 19.099609 18.099609 C 18.849609 18.099609 18.600391 18.200391 18.400391 18.400391 C 18.000391 18.800391 18.000391 19.400781 18.400391 19.800781 L 19.099609 20.5 C 19.499609 20.9 20.1 20.9 20.5 20.5 C 20.9 20.1 20.9 19.499609 20.5 19.099609 L 19.800781 18.400391 C 19.600781 18.200391 19.349609 18.099609 19.099609 18.099609 z M 12 21 C 11.4 21 11 21.4 11 22 L 11 23 C 11 23.6 11.4 24 12 24 C 12.6 24 13 23.6 13 23 L 13 22 C 13 21.4 12.6 21 12 21 z"></path>
</svg>
    `;

    const svgDark = `
<svg class="icon" fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>moon</title> <path d="M10.895 7.574c0 7.55 5.179 13.67 11.567 13.67 1.588 0 3.101-0.38 4.479-1.063-1.695 4.46-5.996 7.636-11.051 7.636-6.533 0-11.83-5.297-11.83-11.83 0-4.82 2.888-8.959 7.023-10.803-0.116 0.778-0.188 1.573-0.188 2.39z"></path> </g></svg>
    `;

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeIcon.innerHTML = svgDark;
        themeImage.src = 'assets/render-dark.png';
    } else {
        themeIcon.innerHTML = svgLight;
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');

        if (document.body.classList.contains('dark')) {
            themeIcon.innerHTML = svgDark;
            themeImage.src = 'assets/render-dark.png';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.innerHTML = svgLight;
            themeImage.src = 'assets/render-light.png';
            localStorage.setItem('theme', 'light');
        }
    });
});

fetch('file_structure.json')
    .then(response => response.json())
    .then(data => {
        fileStructure = data;
        createSidebarItems(data, document.getElementById('sidebar'));
        loadFileContents(data).then(() => {
            loadFileContent(defaultFile);
        });
    })
    .catch(error => console.error('Error:', error));

    function createSidebarItems(structure, parentElement) {
        for (const key in structure) {
            let item;
    
            if (key.endsWith('.text')) {
                item = document.createElement('h4');
                item.className = 'text-item';
                item.innerText = key.replace('.text', '');
                parentElement.appendChild(item);
            } else {
                item = document.createElement('div');
                item.className = structure[key] instanceof Object ? 'folder' : 'file';
    
                if (key.includes('.hide')) {
                    continue;
                }
    
                let icon;
                switch (true) {
                    case key.includes("Home"):
                        icon = '<svg xmlns="http://www.w3.org/2000/svg" class="global-icon" width="18" height="18" viewBox="0 0 48 48"> <path d="M39.5,43h-9c-1.381,0-2.5-1.119-2.5-2.5v-9c0-1.105-0.895-2-2-2h-4c-1.105,0-2,0.895-2,2v9c0,1.381-1.119,2.5-2.5,2.5h-9	C7.119,43,6,41.881,6,40.5V21.413c0-2.299,1.054-4.471,2.859-5.893L23.071,4.321c0.545-0.428,1.313-0.428,1.857,0L39.142,15.52	C40.947,16.942,42,19.113,42,21.411V40.5C42,41.881,40.881,43,39.5,43z"></path></svg>';
                        break;
                    case key.includes("Getting started"):
                        icon = '<svg class="global-icon" height="18" width="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="question" class="icon glyph"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,16a1,1,0,1,1,1-1A1,1,0,0,1,12,18Zm1.71-4.61c-.71.34-.71.39-.71.61a1,1,0,0,1-2,0,2.6,2.6,0,0,1,1.84-2.42C13.61,11.21,14,11,14,10a1,1,0,0,0-.49-.86A2.82,2.82,0,0,0,12,8.75c-.69,0-2,.26-2,1.25a1,1,0,0,1-2,0c0-1.88,1.68-3.25,4-3.25S16,8.12,16,10A3.41,3.41,0,0,1,13.71,13.39Z"></path></svg>';
                        break;
                    case key.includes("Examples"):
                        icon = '<svg class="global-icon" height="18" width="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="folder-alt" class="icon glyph"><path d="M19,8H7A3,3,0,0,0,4.26,9.78L2,14.87V5A2,2,0,0,1,4,3H8a2.05,2.05,0,0,1,1.4.56L11.83,6H17A2,2,0,0,1,19,8Zm2.81,2.42A1,1,0,0,0,21,10H7a1,1,0,0,0-.91.59l-4,9A1,1,0,0,0,3,21H18a1,1,0,0,0,.95-.68l3-9A1,1,0,0,0,21.81,10.42Z"></path></svg>';
                        break;
                    default:
                        icon = '';
                        break;
                }
    
                item.innerHTML = icon + key;
    
                if (structure[key] instanceof Object) {
                    const arrow = document.createElement('span');
                    arrow.className = 'arrow';
                    arrow.innerHTML = `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height="16" width="16">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.293 7.293a1 1 0 0 1 1.414 0L12 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414l-8 8a1 1 0 0 1-1.414 0l-8-8a1 1 0 0 1 0-1.414Z"></path>
                        </svg>
                    `;
                    item.appendChild(arrow);
    
                    const nested = document.createElement('div');
                    nested.className = 'nested';
                    createSidebarItems(structure[key], nested);
                    
                    parentElement.appendChild(item);
                    parentElement.appendChild(nested);
    
                    item.onclick = function (e) {
                        e.stopPropagation();
                        nested.classList.toggle('active');
                        const arrow = item.querySelector('.arrow svg');
                        arrow.style.transform = nested.classList.contains('active') ? 'rotate(270deg)' : 'rotate(0deg)';
                    };
                } else {
                    item.onclick = function () {
                        loadFileContent(structure[key]);
                    };
                    
                    parentElement.appendChild(item);
                }
            }
        }
    }    

function loadFileContents(structure) {
    const promises = [];
    for (const key in structure) {
        if (structure[key] instanceof Object) {
            promises.push(loadFileContents(structure[key]));
        } else {
            const promise = fetch(structure[key])
                .then(response => response.text())
                .then(content => {
                    fileContents[structure[key]] = content;
                })
                .catch(error => console.error('Error:', error));
            promises.push(promise);
        }
    }
    return Promise.all(promises);
}

function createCodeContainer(code, headerText) {
    const container = document.createElement('div');
    container.className = 'code-container';
    
    const header = document.createElement('div');
    header.className = 'code-header';
    
    const headerTextElement = document.createElement('h3');
    headerTextElement.textContent = headerText;

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = `
        <svg class="icon" fill="#000000" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.49 3 10.74.37A1.22 1.22 0 0 0 9.86 0h-4a1.25 1.25 0 0 0-1.22 1.25v11a1.25 1.25 0 0 0 1.25 1.25h6.72a1.25 1.25 0 0 0 1.25-1.25V3.88a1.22 1.22 0 0 0-.37-.88zm-.88 9.25H5.89v-11h2.72v2.63a1.25 1.25 0 0 0 1.25 1.25h2.75zm0-8.37H9.86V1.25l2.75 2.63z"></path>
        </svg>
        <span>Copy</span>
    `;
    
    header.appendChild(headerTextElement);
    header.appendChild(copyButton);

    copyButton.onclick = function() {
        navigator.clipboard.writeText(code).then(() => {
            const span = copyButton.querySelector('span');
            span.textContent = 'Copied!';
            setTimeout(() => {
                span.textContent = 'Copy';
            }, 3000);
        }).catch(err => {
            console.error('Copying error: ', err);
        });
    };
    
    const codeContent = document.createElement('pre');
    const codeElement = document.createElement('code');
    codeElement.innerHTML = highlightComments(code);

    codeContent.appendChild(codeElement);
    container.appendChild(header);
    container.appendChild(codeContent);
    
    return container;
}

function highlightComments(code) {
    const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    return code.replace(commentRegex, '<span class="comment">\$1</span>');
}

function loadFileContent(filePath) {
    const content = fileContents[filePath];
    document.getElementById('file-content').innerHTML = '';

    if (!content) {
        const defaultFilePath = 'docs/default.md';
        const defaultContent = fileContents[defaultFilePath];

        if (defaultContent) {
            loadContent(defaultContent);
        } else {
            document.getElementById('file-content').textContent = 'Default content not found. You should check your internet connection.';
        }
    } else {
        loadContent(content);
    }
}

function loadContent(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const codeContainers = tempDiv.querySelectorAll('.code-container');
    codeContainers.forEach(container => {
        const code = container.querySelector('.code-content').textContent;
        const headerText = container.querySelector('.code-header h3').textContent;
        const codeContainerElement = createCodeContainer(code, headerText);
        container.parentNode.replaceChild(codeContainerElement, container);
    });

    const loadContentElements = tempDiv.querySelectorAll('.load-content, .load-content-no-bg');
    loadContentElements.forEach(element => {
        element.addEventListener('click', function() {
            const filePath = this.getAttribute('data-file');
            loadFileContent(filePath);
        });
    });
    
    const fileContentElement = document.getElementById('file-content');
    fileContentElement.appendChild(tempDiv);

    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.id = 'backToTopButton';
    backToTopButton.innerHTML = `
<svg class="to-top-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"></path> </g></svg>
    `;

    fileContentElement.appendChild(backToTopButton);

    backToTopButton.onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    backToTopButton.style.zIndex = '1000';
}

document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (query === '') {
        resultsContainer.style.display = 'none';
        return;
    }

    for (const [filePath, content] of Object.entries(fileContents)) {
        if (filePath.includes('bindings/') || filePath.includes('how/')) {
            continue;
        }

        const textContent = content.replace(/<[^>]*>/g, '');
        const regex = new RegExp(`(${query})`, 'gi');
        const matches = textContent.match(regex);

        if (matches) {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result';

            const fileName = filePath.replace(/^docs\//, '');

            resultItem.innerHTML = `<strong>${fileName}</strong>: <span class="highlight">${matches.join(', ')}</span>`;

            resultItem.onclick = function() {
                loadFileContent(filePath);
                resultsContainer.style.display = 'none';
                resultsContainer.innerHTML = '';
            };
            resultsContainer.appendChild(resultItem);
        }
    }

    if (resultsContainer.children.length > 0) {
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.style.display = 'none';
    }
});



function openProfile(url) {
    window.open(url, '_blank');
}
