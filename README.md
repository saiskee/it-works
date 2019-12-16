# It Works!

It Works is a Survey Creation and Management Tool, being created for Ultimate Software as an in-house solution for fetching and analyzing feedback over time through surveys.


## Using the project:

If you would like to test our the product without setting up your own environment, we offer a production version hosted here:
[https://itworks320.herokuapp.com](https://itworks320.herokuapp.com)

This version is preloaded with test data obtained from the following dataset: [flipchart_dataset.json]
If you would like to access any of the accounts please use the login information in the provided dataset to access the application, or create your own account!

An example login would be the CEO of the company:
```
Username: Abigail_Keith@flipchart.com 
Password: keithab
```
You could then create a survey inside this account and assign it to any employee beneath the CEO, for example Jaslene Sparks:
```
Username: Jaslene_Sparks@flipchart.com
Password: sparksja
```

## Installation for Development and Testing

Building and Running requires the Yarn dependency manager. Yarn is available for [download here (Yarn)](https://yarnpkg.com/lang/en/docs/install/#windows-stable)

Once yarn is installed clone the project using the following command:

```git clone git@github.com:saiskee/it-works.git```

Then you have to install all the dependencies using Yarn. Use the following commands to install the dependencies:
```
cd it-works
yarn
cd server
yarn
cd ..
cd client 
yarn
```

_If these do not install correctly, please try running these commands as administrator, whether that be opening the command prompt as Admin, or running yarn using sudo._

This can be done by prepending sudo to the yarn command like so:
```sudo yarn```


To start the server run this command from the project root directory:
```sudo yarn dev```

Then you can connect by opening a browser and going to:
```localhost:3000/login```


## Technologies used

It Works Employee Perception Tool uses a wide variety of technologies including but not limited to:



#### Client-Side Technologies
* React-Redux - For formatting the frontend and creating a dynamic UI experience.
* SurveyJS - For presenting surveys and creating models for our MongoDB Database.
* ChartJS - For plotting analytics to make survey results easier to understand.

#### Server-Side Technologies
* MongoDB - For storing the surveys and it's results.
* ExpressJS (Mongoose) - An API used to safely and securely communicate with our MongoDB Database.
