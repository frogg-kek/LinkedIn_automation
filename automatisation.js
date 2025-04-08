/**
 * LinkedIn Job Search Automation
 * 
 * This script helps automate LinkedIn job searching and application processes.
 * IMPORTANT: This is for educational purposes only.
 * LinkedIn may change their UI/structure which could break this script.
 * 
 * Requirements:
 * - You need to be logged into LinkedIn in your browser
 * - Run this in browser console on LinkedIn jobs page
 */

class LinkedInJobAutomation {
  constructor(config = {}) {
    // Default configuration
    this.config = {
      keywords: config.keywords || '',
      location: config.location || '',
      delay: config.delay || 3000, // Delay between actions in ms
      maxApplications: config.maxApplications || 10,
      easyApplyOnly: config.easyApplyOnly !== undefined ? config.easyApplyOnly : true,
      blacklistCompanies: config.blacklistCompanies || [],
      blacklistTitles: config.blacklistTitles || [],
      autoScroll: config.autoScroll !== undefined ? config.autoScroll : true,
      verbose: config.verbose !== undefined ? config.verbose : true
    };
    
    this.appliedCount = 0;
    this.processedJobs = new Set();
    this.running = false;
  }

  log(message) {
    if (this.config.verbose) {
      console.log(`%c[LinkedIn Automation] ${message}`, 'color: #0077b5; font-weight: bold;');
    }
  }

  async sleep(ms = this.config.delay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Navigate to LinkedIn jobs search page with specified filters
   */
  async navigateToJobsPage() {
    this.log('Navigating to jobs page...');
    
    // Construct the URL with search parameters
    const baseUrl = 'https://www.linkedin.com/jobs/search/?';
    const params = new URLSearchParams();
    
    if (this.config.keywords) params.append('keywords', this.config.keywords);
    if (this.config.location) params.append('location', this.config.location);
    if (this.config.easyApplyOnly) params.append('f_AL', 'true'); // Easy Apply filter
    
    window.location.href = baseUrl + params.toString();
    
    // Wait for page to load
    await this.sleep(5000);
    this.log('Jobs page loaded');
  }

  /**
   * Get all visible job cards on the page
   */
  getJobCards() {
    const jobCards = document.querySelectorAll('.jobs-search-results__list-item');
    return Array.from(jobCards);
  }

  /**
   * Check if job should be filtered based on title or company
   */
  shouldFilterJob(jobElement) {
    try {
      const jobTitle = jobElement.querySelector('.job-card-list__title')?.textContent.trim().toLowerCase() || '';
      const companyName = jobElement.querySelector('.job-card-container__company-name')?.textContent.trim().toLowerCase() || '';
      
      // Check against blacklisted titles
      for (const blacklistedTitle of this.config.blacklistTitles) {
        if (jobTitle.includes(blacklistedTitle.toLowerCase())) {
          this.log(`Filtering job with blacklisted title: ${jobTitle}`);
          return true;
        }
      }
      
      // Check against blacklisted companies
      for (const blacklistedCompany of this.config.blacklistCompanies) {
        if (companyName.includes(blacklistedCompany.toLowerCase())) {
          this.log(`Filtering job with blacklisted company: ${companyName}`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      this.log('Error in filtering job: ' + error.message);
      return true; // Filter on error to be safe
    }
  }

  /**
   * Click on a job card to view details
   */
  async clickJobCard(jobCard) {
    try {
      const jobLink = jobCard.querySelector('.job-card-list__title');
      if (jobLink) {
        jobLink.click();
        await this.sleep();
        return true;
      }
      return false;
    } catch (error) {
      this.log('Error clicking job card: ' + error.message);
      return false;
    }
  }

  /**
   * Check if the current job is an Easy Apply job
   */
  isEasyApplyJob() {
    const easyApplyButton = document.querySelector('.jobs-apply-button');
    return !!easyApplyButton;
  }

  /**
   * Extract job details from the current job view
   */
  extractJobDetails() {
    try {
      const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.textContent.trim() || 'Unknown Title';
      const companyName = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.textContent.trim() || 'Unknown Company';
      const location = document.querySelector('.job-details-jobs-unified-top-card__bullet')?.textContent.trim() || 'Unknown Location';
      
      const jobId = new URLSearchParams(window.location.search).get('currentJobId') || '';
      
      return { jobTitle, companyName, location, jobId };
    } catch (error) {
      this.log('Error extracting job details: ' + error.message);
      return { jobTitle: 'Unknown', companyName: 'Unknown', location: 'Unknown', jobId: '' };
    }
  }

  /**
   * Apply to the current job
   */
  async applyToJob() {
    try {
      const applyButton = document.querySelector('.jobs-apply-button');
      if (!applyButton) {
        this.log('Apply button not found');
        return false;
      }
      
      // Click Apply button
      applyButton.click();
      await this.sleep();
      
      // Wait for the application modal to appear
      const applicationModal = document.querySelector('.jobs-easy-apply-content');
      if (!applicationModal) {
        this.log('Application modal not found');
        return false;
      }
      
      // Process until we reach the submit button or run into complex form
      let continueToSubmit = true;
      let steps = 0;
      const maxSteps = 10; // Safety limit
      
      while (continueToSubmit && steps < maxSteps) {
        await this.sleep();
        steps++;
        
        // Check for complex form that requires manual filling
        const complexInputs = document.querySelectorAll('input[required]:not([value]), textarea[required]:not([value])');
        if (complexInputs.length > 0) {
          this.log('Complex application form detected - requires manual input');
          
          // Close the modal if we can't proceed automatically
          this.closeModal();
          return false;
        }
        
        // Look for next button or submit button
        const nextButton = document.querySelector('button[aria-label="Continue to next step"]');
        const submitButton = document.querySelector('button[aria-label="Submit application"]');
        const reviewButton = document.querySelector('button[aria-label="Review your application"]');
        
        if (submitButton) {
          this.log('Submitting application...');
          submitButton.click();
          await this.sleep(1500);
          continueToSubmit = false;
          return true;
        } else if (reviewButton) {
          this.log('Reviewing application...');
          reviewButton.click();
          await this.sleep(1500);
        } else if (nextButton) {
          this.log('Moving to next step...');
          nextButton.click();
          await this.sleep(1500);
        } else {
          this.log('No navigation buttons found, ending application process');
          continueToSubmit = false;
        }
      }
      
      // If we've gone through several steps but never found a submit button
      if (steps >= maxSteps) {
        this.log('Too many steps in application, stopping process');
        this.closeModal();
        return false;
      }
      
      return false;
    } catch (error) {
      this.log('Error in application process: ' + error.message);
      this.closeModal();
      return false;
    }
  }

  /**
   * Close any open modals
   */
  closeModal() {
    try {
      const closeButtons = document.querySelectorAll('button[aria-label="Dismiss"]');
      if (closeButtons.length > 0) {
        closeButtons.forEach(button => button.click());
      }
      
      // Alternative close button
      const dismissButton = document.querySelector('.artdeco-modal__dismiss');
      if (dismissButton) {
        dismissButton.click();
      }
      
      // If a discard button appears, click it
      setTimeout(() => {
        const discardButton = document.querySelector('button[data-control-name="discard_application_confirm_btn"]');
        if (discardButton) {
          discardButton.click();
        }
      }, 1000);
    } catch (error) {
      this.log('Error closing modal: ' + error.message);
    }
  }

  /**
   * Scroll the job list to load more jobs
   */
  async scrollJobsList() {
    if (!this.config.autoScroll) return;
    
    this.log('Scrolling to load more jobs...');
    const jobsList = document.querySelector('.jobs-search-results-list');
    if (jobsList) {
      const previousHeight = jobsList.scrollHeight;
      jobsList.scrollTo(0, jobsList.scrollHeight);
      
      // Wait for new content to load
      await this.sleep(2000);
      
      // Check if we've reached the bottom
      if (previousHeight === jobsList.scrollHeight) {
        this.log('Reached end of job listings');
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Main process to run the automation
   */
  async start() {
    if (this.running) {
      this.log('Automation is already running');
      return;
    }
    
    this.running = true;
    this.log('Starting LinkedIn job automation');
    
    // Navigate to jobs page if needed
    if (!window.location.href.includes('linkedin.com/jobs')) {
      await this.navigateToJobsPage();
    }
    
    let continueScrolling = true;
    
    try {
      while (this.appliedCount < this.config.maxApplications && continueScrolling) {
        const jobCards = this.getJobCards();
        this.log(`Found ${jobCards.length} job cards`);
        
        // Process each job card
        for (const jobCard of jobCards) {
          // Skip if we've reached the maximum applications
          if (this.appliedCount >= this.config.maxApplications) {
            this.log('Reached maximum number of applications');
            break;
          }
          
          // Extract job ID to avoid processing the same job twice
          const jobLink = jobCard.querySelector('a.job-card-list__title');
          const jobUrl = jobLink?.href || '';
          const jobId = new URLSearchParams(new URL(jobUrl).search).get('currentJobId');
          
          if (!jobId || this.processedJobs.has(jobId)) {
            continue;
          }
          
          this.processedJobs.add(jobId);
          
          // Filter out blacklisted jobs
          if (this.shouldFilterJob(jobCard)) {
            continue;
          }
          
          // Click on the job card to view details
          const clicked = await this.clickJobCard(jobCard);
          if (!clicked) continue;
          
          // Wait for job details to load
          await this.sleep();
          
          // Extract job details
          const jobDetails = this.extractJobDetails();
          this.log(`Processing: ${jobDetails.jobTitle} at ${jobDetails.companyName}`);
          
          // Check if it's an Easy Apply job if that option is enabled
          if (this.config.easyApplyOnly && !this.isEasyApplyJob()) {
            this.log('Skipping non-Easy Apply job');
            continue;
          }
          
          // Apply to the job
          const applied = await this.applyToJob();
          if (applied) {
            this.appliedCount++;
            this.log(`Successfully applied to ${jobDetails.jobTitle} at ${jobDetails.companyName}. (${this.appliedCount}/${this.config.maxApplications})`);
          } else {
            this.log(`Could not apply to ${jobDetails.jobTitle} at ${jobDetails.companyName}`);
          }
          
          // Add some random delay between 2-5 seconds to mimic human behavior
          await this.sleep(2000 + Math.random() * 3000);
        }
        
        // Scroll to load more jobs
        continueScrolling = await this.scrollJobsList();
      }
    } catch (error) {
      this.log('Error in automation: ' + error.message);
    } finally {
      this.running = false;
      this.log(`Automation completed. Applied to ${this.appliedCount} jobs.`);
    }
  }

  /**
   * Stop the automation process
   */
  stop() {
    this.running = false;
    this.log('Stopping automation');
  }
}

// Example usage
const automation = new LinkedInJobAutomation({
  keywords: 'Software Engineer',
  location: 'San Francisco, CA',
  maxApplications: 15,
  easyApplyOnly: true,
  blacklistCompanies: ['Unwanted Company'],
  blacklistTitles: ['Senior', 'Lead'], // Filter out senior positions if you're not qualified
  autoScroll: true
});

// To start the automation, run in the browser console:
// automation.start();

// To stop the running automation:
// automation.stop();
