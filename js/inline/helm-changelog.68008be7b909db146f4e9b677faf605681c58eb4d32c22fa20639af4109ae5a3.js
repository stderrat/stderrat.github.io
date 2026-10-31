// Helm chart changelog widget (extracted from layouts/shortcodes/helm-changelog.html).
(function() {
  const container = document.getElementById('helm-changelog-widget');
  if (!container) return;
  const maxItems = parseInt(container.getAttribute('data-limit'), 10) || 10;
  
  // Add cache-busting parameter to bypass browser cache
  const cacheBuster = Math.floor(Date.now() / 60000); // Changes every minute
  fetch(`https://charts.stderr.at/changelog.json?v=${cacheBuster}`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load changelog');
      return response.json();
    })
    .then(data => {
      if (!data.charts || data.charts.length === 0) {
        container.innerHTML = '<p class="helm-changelog-error">No charts found</p>';
        return;
      }
      
      const genDate = new Date(data.generated);
      
      // Helper to safely parse dates (handles ISO strings and timestamps)
      const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? new Date(0) : d;
      };
      
      // Sort by lastModified (most recent first) then take top items
      const charts = data.charts
        .filter(c => c.lastModified) // Only include charts with a lastModified date
        .sort((a, b) => parseDate(b.lastModified).getTime() - parseDate(a.lastModified).getTime())
        .slice(0, maxItems);
      
      let html = `
        <div class="helm-changelog-header">
          <h3><i class="fa fa-cubes"></i> Latest Helm Chart Updates</h3>
          <span class="helm-changelog-generated">Updated: ${genDate.toLocaleDateString()}</span>
        </div>
      `;
      
      charts.forEach(chart => {
        const date = new Date(chart.lastModified);
        const dateStr = date.toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        });
        
        const iconHtml = chart.icon 
          ? `<img src="${chart.icon}" alt="" class="helm-chart-icon" width="60" height="60" data-webp-upgraded="true">`
          : '<i class="fa fa-cube helm-chart-icon-fallback"></i>';
        
        let changesHtml = '';
        if (chart.changes && chart.changes.length > 0) {
          // Reverse changes to show most recent first (in case JSON has oldest-first)
          const sortedChanges = [...chart.changes].reverse();
          changesHtml = '<ul class="helm-changes-list">';
          sortedChanges.slice(0, 4).forEach(change => {
            const kind = (change.kind || 'changed').toLowerCase();
            changesHtml += `<li class="${kind}"><span class="helm-change-badge ${kind}">${kind}</span>${change.description}</li>`;
          });
          if (sortedChanges.length > 4) {
            changesHtml += `<li style="color:#888;border-left-color:#888;">... and ${sortedChanges.length - 4} more changes</li>`;
          }
          changesHtml += '</ul>';
        }
        
        const chartUrl = chart.home || 'https://github.com/tjungbauer/helm-charts';
        html += `
          <div class="helm-chart-item" data-href="${chartUrl}" role="link" tabindex="0">
            <div class="helm-chart-header">
              ${iconHtml}
              <span class="helm-chart-name"><a href="${chartUrl}" target="_blank" rel="noopener noreferrer" class="highlight">${chart.name}</a></span>
              <span class="helm-chart-version">v${chart.version}</span>
              <span class="helm-chart-date">📅 ${dateStr}</span>
            </div>
            <div class="helm-chart-description">${chart.description}</div>
            ${changesHtml}
          </div>
        `;
      });
      
      html += `
        <div class="helm-changelog-footer">
          <a href="https://github.com/tjungbauer/helm-charts" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-github"></i> View all ${data.charts.length} charts on GitHub
          </a>
          &nbsp;|&nbsp;
          <a href="https://charts.stderr.at/" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-external-link"></i> Helm Repository
          </a>
        </div>
      `;
      
      container.innerHTML = html;

      // Former inline onerror/onclick handlers (blocked by the CSP): icon fallback and clickable cards
      container.querySelectorAll('img.helm-chart-icon').forEach(img => {
        img.addEventListener('error', () => {
          const i = document.createElement('i');
          i.className = 'fa fa-cube helm-chart-icon-fallback';
          img.replaceWith(i);
        }, { once: true });
      });
      container.querySelectorAll('.helm-chart-item[data-href]').forEach(item => {
        item.addEventListener('click', event => {
          if (event.target.closest('a')) return;   // the link inside the card opens itself
          window.open(item.getAttribute('data-href'), '_blank', 'noopener');
        });
      });
    })
    .catch(error => {
      console.error('Helm changelog error:', error);
      container.innerHTML = `
        <p class="helm-changelog-error">
          <i class="fa fa-exclamation-triangle"></i> 
          Could not load Helm chart updates. 
          <a href="https://github.com/tjungbauer/helm-charts" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </p>
      `;
    });
})();
