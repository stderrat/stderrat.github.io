// Extracted from layouts/helm-charts/list.html so the page works with a CSP without 'unsafe-inline'.
document.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('helm-charts-container');
  const deprecatedContainer = document.getElementById('deprecated-charts-container');
  const deprecatedSection = document.getElementById('deprecated-section');
  const searchInput = document.getElementById('helm-chart-search');
  const countElement = document.getElementById('helm-chart-count');
  const deprecatedCountElement = document.getElementById('deprecated-count');
  
  let allCharts = [];

  // Fetch the Helm repo index.yaml
  try {
    const response = await fetch('https://charts.stderr.at/index.yaml');
    if (!response.ok) throw new Error('Failed to fetch charts');
    
    const yamlText = await response.text();
    const charts = parseHelmIndex(yamlText);
    allCharts = charts;
    
    renderAllCharts(charts);
  } catch (error) {
    console.error('Error loading charts:', error);
    container.innerHTML = `
      <div class="helm-error">
        <h3>Unable to load charts</h3>
        <p>Please try again later or visit <a href="https://charts.stderr.at/">charts.stderr.at</a> directly.</p>
      </div>
    `;
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const filtered = allCharts.filter(chart => {
        return chart.name.toLowerCase().includes(query) ||
               (chart.description && chart.description.toLowerCase().includes(query)) ||
               (chart.keywords && chart.keywords.some(k => k.toLowerCase().includes(query)));
      });
      renderAllCharts(filtered);
    });
  }

  function renderAllCharts(charts) {
    const activeCharts = charts.filter(c => !c.deprecated);
    const deprecatedCharts = charts.filter(c => c.deprecated);
    
    // Update counts
    countElement.textContent = activeCharts.length;
    deprecatedCountElement.textContent = deprecatedCharts.length;
    
    // Render active charts
    renderCharts(activeCharts, container);
    
    // Render deprecated charts
    if (deprecatedCharts.length > 0) {
      deprecatedSection.style.display = 'block';
      renderCharts(deprecatedCharts, deprecatedContainer);
    } else {
      deprecatedSection.style.display = 'none';
    }
  }

  function parseHelmIndex(yamlText) {
    // Use js-yaml to properly parse the YAML
    const data = jsyaml.load(yamlText);
    const charts = [];
    
    if (data && data.entries) {
      for (const [chartName, versions] of Object.entries(data.entries)) {
        if (versions && versions.length > 0) {
          // First entry is the latest version
          const latest = versions[0];
          charts.push({
            name: latest.name || chartName,
            version: latest.version || '',
            description: latest.description || '',
            icon: latest.icon || '',
            home: latest.home || '',
            keywords: latest.keywords || [],
            maintainers: (latest.maintainers || []).map(m => m.name || m.email || '').filter(n => n),
            urls: latest.urls || [],
            created: latest.created || '',
            deprecated: latest.deprecated || false
          });
        }
      }
    }
    
    return charts;
  }

  function renderCharts(charts, targetContainer) {
    if (charts.length === 0) {
      targetContainer.innerHTML = '<div class="helm-loading">No charts found</div>';
      return;
    }

    targetContainer.innerHTML = charts.map(chart => `
      <div class="helm-chart-card ${chart.deprecated ? 'deprecated' : ''}">
        <div class="helm-chart-top">
          ${chart.icon ? `<div class="helm-chart-icon" style="background-image: url('${chart.icon}')" title="${chart.name}"></div>` : ''}
          <div class="helm-chart-info">
            <h3 class="helm-chart-title"><a href="${chart.home}" target="_blank" rel="noopener noreferrer" class="highlight" title="Opens external site">${chart.name}<i class="fas fa-arrow-up-right-from-square external-link-icon" aria-hidden="true"></i></a></h3>
            ${chart.maintainers.length > 0 ? `
              <div class="helm-chart-maintainer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                </svg>
                ${chart.maintainers.join(', ')}
              </div>
            ` : ''}
            ${chart.deprecated ? '<span class="helm-deprecated-badge">Deprecated</span>' : ''}
          </div>
        </div>
        <div class="helm-chart-actions">
            ${chart.home ? `
              <a href="${chart.home}" target="_blank" rel="noopener noreferrer" class="helm-chart-btn" title="View source">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                </svg>
                Source
              </a>
            ` : ''}
            ${chart.urls && chart.urls.length > 0 ? `
              <a href="${chart.urls[0]}" target="_blank" rel="noopener noreferrer" class="helm-chart-btn" title="Download ${chart.name} v${chart.version}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                </svg>
                Download
              </a>
            ` : ''}
        </div>
        <p class="helm-chart-description">${chart.description || 'No description available'}</p>
        <div class="helm-chart-meta">
          <span class="helm-chart-meta-item">📦 v${chart.version}</span>
          ${chart.created ? `<span class="helm-chart-meta-item">📅 ${new Date(chart.created).toLocaleDateString()}</span>` : ''}
          <a href="https://artifacthub.io/packages/helm/openshift-bootstraps/${chart.name}" target="_blank" rel="noopener noreferrer" class="helm-link highlight" title="View on ArtifactHub">
            🔗 ArtifactHub<i class="fas fa-arrow-up-right-from-square external-link-icon" aria-hidden="true"></i>
          </a>
        </div>
        ${chart.keywords.length > 0 ? `
          <div class="helm-chart-tags">
            ${chart.keywords.map(k => `<span class="helm-chart-tag">${k}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  }
});
