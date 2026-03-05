const API_BASE_URL = 'http://127.0.0.1:8000';

// index.html logic
const shortenForm = document.getElementById('shorten-form');
if (shortenForm) {
    shortenForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const longUrl = document.getElementById('long-url').value;
        const expiresInStr = document.getElementById('expires-in').value;
        const expiresIn = expiresInStr ? parseInt(expiresInStr, 10) : null;

        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = document.getElementById('loading-spinner');
        const resultContainer = document.getElementById('result-container');
        const errorContainer = document.getElementById('error-message');
        const shortUrlLink = document.getElementById('short-url-link');

        // Reset state
        errorContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');

        try {
            const response = await fetch(`${API_BASE_URL}/api/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    long_url: longUrl,
                    expires_in_days: expiresIn
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to shorten URL');
            }

            const data = await response.json();

            shortUrlLink.href = data.short_url;
            shortUrlLink.textContent = data.short_url;
            resultContainer.classList.remove('hidden');

        } catch (error) {
            errorContainer.textContent = error.message;
            errorContainer.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    });

    // Copy button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const url = document.getElementById('short-url-link').textContent;
            navigator.clipboard.writeText(url).then(() => {
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                }, 2000);
            });
        });
    }
}

// stats.html logic
const statsForm = document.getElementById('stats-form');
if (statsForm) {
    statsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let code = document.getElementById('short-code').value.trim();

        // Extract code if user pasted full URL
        if (code.startsWith('http')) {
            const parts = code.split('/');
            code = parts[parts.length - 1];
        }

        const submitBtn = document.getElementById('stats-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = document.getElementById('stats-spinner');
        const resultContainer = document.getElementById('stats-result');
        const errorContainer = document.getElementById('stats-error');

        // Reset state
        errorContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');

        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/${code}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Short code not found.');
                }
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to fetch statistics');
            }

            const data = await response.json();

            const origLink = document.getElementById('stat-original-url');
            origLink.href = data.long_url;
            origLink.textContent = data.long_url;

            document.getElementById('stat-clicks').textContent = data.clicks;

            const createdDate = new Date(data.created_at);
            document.getElementById('stat-created').textContent = createdDate.toLocaleString();

            const expiresEl = document.getElementById('stat-expires');
            if (data.expires_at) {
                const expiresDate = new Date(data.expires_at);
                expiresEl.textContent = expiresDate.toLocaleString();

                if (expiresDate < new Date()) {
                    expiresEl.textContent += ' (Expired)';
                    expiresEl.style.color = 'var(--error)';
                } else {
                    expiresEl.style.color = '';
                }
            } else {
                expiresEl.textContent = 'Never';
                expiresEl.style.color = '';
            }

            resultContainer.classList.remove('hidden');

        } catch (error) {
            errorContainer.textContent = error.message;
            errorContainer.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    });
}
