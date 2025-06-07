# Control Chart Analyzer

All calculations run locally on your machine. Nothing gets sent over the internet.  
It’s built entirely in vanilla JavaScript. No LLMs were used, as you can probably tell lol.

I made this as a personal project to improve my vanilla JS skills and get a better feel for how different frameworks work.

This tool was originally built for the 2R2 community after visiting a few bases where people were struggling with the basics of control charts. The goal was to make those concepts easier to understand.

If you're curious how it works, take a look at `home.js`. The only external library I used was `Chart.js` because coding a line graph from scratch sounded like a nightmare.

Everything is bundled into the project and runs completely offline.

If you found this helpful and want to say thanks, just send me an email on the global:  
**nathaniel.pahlow@us.af.mil**

---

## Resources Used to Help Create the Logic

- [Rules for Properly Interpreting Control Charts](https://www.pharmaceuticalonline.com/doc/rules-for-properly-interpreting-control-charts-0001)

---

## Features

- **Automated data cleaning**  
  If you accidentally include values that aren't supported, the tool will filter them out and provide a warning.

- **Automated rule violation detection and visualization**  
  Helps you easily identify where your process may be going out of control.

- **Export to CSV/Excel**  
  Quickly download your processed results for sharing or reporting.

- **Automated test type selection**  
  The app intelligently picks the best control chart based on your input.

- **Completely offline**  
  Everything runs in your browser. No internet? No problem.

- Tells you approximately how much time it has saved you
  Curious as to how much time it would have taken you to manually check each rule? Well now it tells you!

- Informs you how much time Pahlow has left in the military!
  I'm sure your dying to know when you can hire me on the outside so I put in a handy dandy countdown.

- Automatically adjusts to any data size!
  I've only tested it on 5,000 rows of data if you go further than that your computer may have a seizure lol

---

## Setup Instructions

1. Go to the top right of this repository.
2. Click the **Code** button.
3. Select **Download ZIP**.
4. Right-click the ZIP file you downloaded and extract it to a folder where you want to store the tool.
5. Open the `home.html` file by double-clicking it.
6. Paste your data directly from Excel into the webpage.
7. Select your data’s parameters.
8. Review your results.

---

Enjoy!
