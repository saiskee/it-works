# It Works!

It Works is a Survey Creation and Management Tool, being created for Ultimate Software as an in-house solution for fetching and analyzing feedback over time through surveys.


## Installation for Dev

Building and Running requires the Yarn dependency manager. Yarn is available for [download here (Yarn)](https://yarnpkg.com/lang/en/docs/install/#windows-stable)

Once yarn is installed and the directory is cloned on to your machine, run the following commands in command prompt from the current directory to install dependencies.

`yarn`
`(cd server && yarn)`
`(cd client && yarn)`

_If these do not install correctly, please try running these commands as administrator, whether that be opening the command prompt as Admin, or running yarn using sudo._

To start the server run this command from the project root directory:
```sudo yarn dev```

Then you can connect on ```localhost:3000/login```


## Technologies used
#### Client-Side Technologies
* React-Redux
* SurveyJS
* ChartJS

#### Server-Side Technologies
* MongoDB
* ExpressJS (Mongoose)
