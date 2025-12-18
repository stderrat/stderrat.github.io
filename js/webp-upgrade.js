/**
 * Automatically upgrade IMG tags to use WebP with fallback
 * Works with AsciiDoc, Markdown, and any content format
 */
(function() {
  'use strict';
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upgradeImages);
  } else {
    upgradeImages();
  }
  
  function upgradeImages() {
    // Find all img tags in the content area
    var images = document.querySelectorAll('#body-inner img, .article-content img, .post-content img, article img');
    
    images.forEach(function(img) {
      // Skip if already processed or inside a picture element
      if (img.hasAttribute('data-webp-upgraded') || img.parentElement.tagName === 'PICTURE') {
        return;
      }
      
      var src = img.src || img.getAttribute('src');
      if (!src) return;
      
      // Check if this is a PNG or JPG
      var isPNG = /\.png(\?|$)/i.test(src);
      var isJPG = /\.(jpe?g)(\?|$)/i.test(src);
      
      if (!isPNG && !isJPG) return;
      
      // Generate WebP source URL
      var webpSrc = src.replace(/\.(png|jpe?g)(\?|$)/i, '.webp$2');
      
      // Create picture element
      var picture = document.createElement('picture');
      
      // Copy classes from img to picture
      if (img.className) {
        picture.className = img.className;
        img.className = '';
      }
      
      // Create WebP source
      var sourceWebP = document.createElement('source');
      sourceWebP.srcset = webpSrc;
      sourceWebP.type = 'image/webp';
      
      // Create fallback source
      var sourceFallback = document.createElement('source');
      sourceFallback.srcset = src;
      sourceFallback.type = isPNG ? 'image/png' : 'image/jpeg';
      
      // Mark img as upgraded
      img.setAttribute('data-webp-upgraded', 'true');
      
      // Add lazy loading if not already present
      if (!img.loading) {
        img.loading = 'lazy';
      }
      
      // Clone img and mark to skip animation (already animated once)
      var newImg = img.cloneNode(true);
      newImg.setAttribute('data-webp-upgraded', 'true');
      newImg.classList.add('no-animate');
      
      // Build picture element
      picture.appendChild(sourceWebP);
      picture.appendChild(sourceFallback);
      picture.appendChild(newImg);
      
      // Replace img with picture
      img.parentNode.replaceChild(picture, img);
    });
  }
})();

