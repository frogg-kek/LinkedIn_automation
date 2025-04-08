# LinkedIn Job Search Automation

A JavaScript-based automation tool designed to streamline the job application process on LinkedIn. This script helps job seekers automate repetitive tasks by automatically searching for relevant job postings and applying to positions that match specified criteria.

## ⚠️ Disclaimer

This tool is provided for **educational purposes only**. Using automation scripts on websites may violate their Terms of Service. LinkedIn actively monitors for automated activity and may restrict or ban accounts engaged in such behavior. Use at your own risk.

## Features

- 🔍 Automated job searching based on keywords and location
- ✅ Focus on "Easy Apply" positions for streamlined applications
- ⛔ Filter out unwanted companies or job titles
- 📝 Auto-fill simple application forms
- 🔄 Automatically scroll to load more job listings
- 📊 Track application statistics
- ⏸️ Pause/resume functionality

## How It Works

The script navigates through LinkedIn's job listings, clicks on jobs matching your criteria, and attempts to complete the application process for "Easy Apply" positions. It intelligently skips complex applications that require detailed information while focusing on positions that can be applied to with minimal input.

## Installation

1. Clone this repository or download the script:
   ```
   git clone https://github.com/yourusername/linkedln_automation.git
   ```

2. No additional dependencies are required as this is pure JavaScript meant to run in a browser console.

## Usage

1. Log in to your LinkedIn account in your web browser
2. Navigate to LinkedIn's job search page
3. Open your browser's developer console:
   - Chrome/Edge: `F12` or right-click → Inspect → Console
   - Firefox: `F12` or right-click → Inspect Element → Console
   - Safari: Enable developer tools in preferences first, then right-click → Inspect Element

4. Copy and paste the entire script into the console
5. Configure your search parameters and preferences:

```javascript
const automation = new LinkedInJobAutomation({
  keywords: 'Software Engineer',  // Job title or keywords
  location: 'San Francisco, CA',  // Job location
  maxApplications: 15,            // Maximum number of applications to submit
  easyApplyOnly: true,            // Only apply to "Easy Apply" jobs
  blacklistCompanies: ['Unwanted Company'],  // Skip these companies
  blacklistTitles: ['Senior', 'Lead'],       // Skip job titles containing these words
  autoScroll: true                // Automatically scroll to load more jobs
});
```

6. Start the automation:
```javascript
automation.start();
```

7. To stop the automation at any time:
```javascript
automation.stop();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `keywords` | String | `''` | Job title, skills, or keywords to search for |
| `location` | String | `''` | Job location |
| `delay` | Number | `3000` | Delay between actions in milliseconds |
| `maxApplications` | Number | `10` | Maximum number of applications to submit |
| `easyApplyOnly` | Boolean | `true` | Only apply to "Easy Apply" jobs |
| `blacklistCompanies` | Array | `[]` | List of companies to ignore |
| `blacklistTitles` | Array | `[]` | List of title keywords to ignore |
| `autoScroll` | Boolean | `true` | Automatically scroll to load more jobs |
| `verbose` | Boolean | `true` | Show detailed logs in console |

## Best Practices

1. **Start Small**: Begin with a low `maxApplications` value to test the script.
2. **Be Selective**: Use blacklists to filter out positions that aren't relevant.
3. **Monitor the Process**: Watch the automation run to ensure it's working correctly.
4. **Be Ethical**: Don't abuse the system; use this tool responsibly.
5. **Customize Your Profile**: Ensure your LinkedIn profile is complete before applying.

## Limitations

- Complex application forms requiring custom responses will be skipped
- LinkedIn's interface may change, potentially breaking the script
- The script cannot bypass LinkedIn's anti-automation measures
- Some jobs may require assessment tests that cannot be automated

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Improvements

- [ ] Add support for saving job details to a local database
- [ ] Implement browser extension functionality for easier use
- [ ] Create a visual interface for configuration
- [ ] Add resume/cover letter customization features
- [ ] Implement machine learning to improve job relevance filtering

---

⭐ Found this useful? Star the repository! ⭐

📢 **Remember**: This tool should complement, not replace, your job search efforts. Personalized applications generally yield better results than automated ones.
