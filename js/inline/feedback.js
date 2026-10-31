// Extracted from layouts/partials/feedback.html so the page works with a CSP without 'unsafe-inline'.
(function() {
    const widget = document.getElementById('feedback-widget');
    const question = widget.querySelector('.feedback-question');
    const response = document.getElementById('feedback-response');
    const thanks = document.getElementById('feedback-thanks');
    const btnYes = document.getElementById('feedback-yes');
    const btnNo = document.getElementById('feedback-no');
    
    // Check if already voted (using localStorage)
    const pageId = window.location.pathname;
    const voted = localStorage.getItem('feedback-' + pageId);
    
    if (voted) {
        question.style.display = 'none';
        response.style.display = 'flex';
        thanks.textContent = 'Thank you for your feedback!';
    }
    
    function handleFeedback(isHelpful) {
        const feedbackType = isHelpful ? 'helpful' : 'not-helpful';
        
        // Store in localStorage to prevent multiple votes
        localStorage.setItem('feedback-' + pageId, feedbackType);
        
        // Optional: Send to Google Analytics if available
        if (typeof gtag === 'function') {
            gtag('event', 'feedback', {
                'event_category': 'Article Feedback',
                'event_label': pageId,
                'value': isHelpful ? 1 : 0
            });
        }
        
        // Optional: Send to Plausible if available
        if (typeof plausible === 'function') {
            plausible('Feedback', { props: { helpful: isHelpful, page: pageId } });
        }
        
        // Show thank you message
        question.style.display = 'none';
        response.style.display = 'flex';
        thanks.textContent = isHelpful 
            ? 'Glad this helped! Thank you for the feedback.' 
            : 'Thank you! We\'ll work on improving this article.';
        
        // Add animation class
        response.classList.add('feedback-animate');
    }
    
    btnYes.addEventListener('click', function() {
        handleFeedback(true);
    });
    
    btnNo.addEventListener('click', function() {
        handleFeedback(false);
    });
})();
