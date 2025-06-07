# Control Chart Analyzer

All calculations run locally on your machine. Nothing gets sent over the internet.
It’s built entirely in vanilla JavaScript. No LLMs were used, as you can probably tell lol.

I made this as a personal project to improve my vanilla JS skills and get a better feel for how different frameworks work.

This tool was originally built for the 2R2 community after visiting a few bases where people were struggling with the basics of control charts. The goal was to make those concepts easier to understand.

If you're curious how it works, take a look at home.js. The only external library I used was Chart.js because coding a line graph from scratch sounded like a nightmare.

Everything is bundled into the project and runs completely offline.

If you found this helpful and want to say thanks, just send me an email on the global.
nathaniel.pahlow@us.af.mil

# Resources used to help create the logic:

https://www.pharmaceuticalonline.com/doc/rules-for-properly-interpreting-control-charts-0001

# Setup prettier format

npx prettier-init

#my current setup for formatting.
-file: .prettierrc.json
{
"printWidth": 160,
"singleQuote": true
}

tested using weather data
