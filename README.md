a simple trello clone application built on vue and json-server. The point of this app is to be super easy to install and run, so that you don’t need to set up complicated database and have several scripts running in order to open app. Just install, write npm start and you are good to go.

The original version of this app was built by Zack Thoutt and [you can find it here](https://github.com/zackthoutt/vue-trello). I updated the app to vue 2 and am using json-server and axios instead of local storage to handle data. I also implemented a simple JWT authentication by utilizing json-server-auth. You can also upload images to tasks, files are saved to your drive. 

I’m pretty happy with the result, although I have to say, that I am no Vue expert. I learn by copying the work of others, code from stackoverflow, documentation(s) and then try to use that knowledge and code to make something on my own. I bet you could find some antipatterns in the code and you are more than welcome to create an issue with a suggestion. I made this app for a workshop I’m am doing on testing in Cypress.io. If you are intereseted how that looks, check out my [quick course on Udemy](https://www.udemy.com/course/cypress-test-automation-for-people-in-a-hurry/?couponCode=D7F5FD6D19C9A5FF823D) (link with a discount coupon, cause you’re nice), although I’m using another app there. Maybe next time.

Oh and the installation
`npm install`
`npm start`

That should do it. If you update the code, use `npx grunt dev` to build the app again.

I’ll do a better readme file, I swear. I’m just a little busy now.