function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

showTab('home');

document.querySelectorAll('.text-container').forEach(container => {
    const filePath = container.getAttribute('data-file');
    const textContent = container.querySelector('.text-content');
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            const highlightedText = text.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, '<span class="comment">$&</span>');
            textContent.innerHTML = highlightedText;
        })
        .catch(error => {
            console.error('File import error:', error);
            textContent.textContent = 'Something went wrong.';
        });

    const copyButton = container.querySelector('.copy-button');
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(textContent.textContent).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        }).catch(err => {
            console.error('Text copying error:', err);
        });
    });
});