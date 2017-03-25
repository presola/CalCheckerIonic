# CalCheckerIonic
A simple application for checking food calories and recipes with instructions.
Application also contains BMI calculation.

How to use:
Download Ionic as instructed in the link below:

https://ionicframework.com/getting-started/

Before running the ionic application, get your fat secret API key and Consumer Secret from the link below
https://platform.fatsecret.com/api/

Enter your keys on line 9 and 10 of the server.js file.
The server.js file is located in the NodeJS folder, the application will not properly without the Node server on.
To run the node server:

First:
Run ```npm install```

Then ```node server.js```

Once the server is on, from the main folder, run ```ionic serve```

Voila the application is ready.

###Screen Shots
<div>
<img src="/screenshots/search.png?raw=true" height="400" alt="Splash" style="margin-right: 30px">
<img src="/screenshots/foodlist.png?raw=true" height="400" alt="HealthKit" style="margin-right: 30px">
<img src="/screenshots/recipelist.png?raw=true" height="400" alt="Line Chart View Controller">
</div>
<div>
<img src="/screenshots/recipe.png?raw=true" height="400" alt="Prompt" style="margin-right: 30px">
<img src="/screenshots/instructions.png?raw=true" height="400" alt="Table View Controller" style="margin-right: 30px">
<img src="/screenshots/chart.png?raw=true" height="400" alt="Suggestion View Controller">
</div>
<div><b>Chart is c3.js</b></div>
<br/>

**Enjoy!!!**
