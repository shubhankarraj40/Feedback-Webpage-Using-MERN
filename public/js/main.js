document.addEventListener('DOMContentLoaded', () => {
  const feedbackForm = document.getElementById('feedbackForm');
  const successMessage = document.getElementById('successMessage');
  const feedbackFormSection = document.querySelector('.feedback-form');
  const feedbackListSection = document.querySelector('.feedback-list');
  const feedbackItems = document.getElementById('feedbackItems');
  const viewFeedbackBtn = document.getElementById('viewFeedbackBtn');
  const newFeedbackBtn = document.getElementById('newFeedbackBtn');
  
  // Submit form
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      rating: document.querySelector('input[name="rating"]:checked').value
    };
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        feedbackForm.reset();
        feedbackFormSection.classList.add('hidden');
        successMessage.classList.remove('hidden');
      } else {
        alert('Error submitting feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting feedback. Please try again.');
    }
  });
  
  // View all feedback
  viewFeedbackBtn.addEventListener('click', () => {
    loadFeedbackItems();
    successMessage.classList.add('hidden');
    feedbackListSection.classList.remove('hidden');
  });
  
  // Add new feedback
  newFeedbackBtn.addEventListener('click', () => {
    feedbackListSection.classList.add('hidden');
    feedbackFormSection.classList.remove('hidden');
    feedbackForm.reset();
  });
  
  // Load all feedback items
  async function loadFeedbackItems() {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      
      feedbackItems.innerHTML = '';
      
      if (data.length === 0) {
        feedbackItems.innerHTML = '<p>No feedback submitted yet.</p>';
        return;
      }
      
      data.forEach(item => {
        const date = new Date(item.createdAt).toLocaleDateString();
        
        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('feedback-item');
        feedbackItem.innerHTML = `
          <div class="feedback-header">
            <span class="feedback-name">${item.name}</span>
            <span class="feedback-date">${date}</span>
          </div>
          <div class="feedback-subject">${item.subject}</div>
          <div class="feedback-message">${item.message}</div>
          <div class="feedback-rating">Rating: ${item.rating} / 5</div>
        `;
        
        feedbackItems.appendChild(feedbackItem);
      });
    } catch (error) {
      console.error('Error loading feedback:', error);
      feedbackItems.innerHTML = '<p>Error loading feedback. Please try again later.</p>';
    }
  }
});