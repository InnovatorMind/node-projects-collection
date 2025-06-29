
async function fetchFiles() {
    try {
        const res = await fetch('http://localhost:4000/');
        const files = await res.json();

        const container = document.getElementById('file-list');
        container.innerHTML = '';

        if (files.length === 0) {
            container.innerHTML = 'No files found.';
            return;
        }

        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'file';

            div.innerHTML = `
            <p>${file}</p>
            <div>
            <button onclick="viewFile('${file}')">View</button>
            <button onclick="downloadFile('${file}')">Download</button>
            </div>
          `;

            container.appendChild(div);
        });

    } catch (err) {
        console.error('Error fetching files:', err);
        document.getElementById('file-list').innerText = 'Failed to load file list.';
    }
}

function viewFile(name) {
    const url = `http://localhost:4000/${name}?action=open`;
    const preview = document.getElementById('preview-content');

    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(name);
    const isText = /\.(txt|md|log)$/i.test(name);
    const isPDF = /\.pdf$/i.test(name);

    if (isImage) {
        preview.innerHTML = `<img src="${url}" id="preview-content" />`;
    } else if (isPDF) {
        preview.innerHTML = `<iframe src="${url}" width="100%" height="500px" style="border:none;"></iframe>`;
    } else if (isText) {
        fetch(url)
            .then(res => res.text())
            .then(text => {
                preview.innerHTML = `<pre style="max-height:500px;overflow:auto;">${text}</pre>`;
            });
    } else {
        preview.innerHTML = `<p>Preview not supported. Try downloading it.</p>`;
    }
}

function downloadFile(name) {
    window.location.href = `http://localhost:4000/${name}?action=download`;
}

fetchFiles();