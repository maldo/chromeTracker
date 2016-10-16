# Wakoopa extension
## Installation
### Server
Navigate to the server folder and execute:
```
npm install
node app.js
```
This will start a simple web server listenning on port 3000. The server just logs all the requests.

### Extension
Open chrome (*the extension has been tested in google chrome canary, but it should work in any chrome supporting basic ES6 features*), go to settings, extension and select developer mode. Choose the extension folder and the extension will load into the browser.

## Design
After reading about chrome extension architecture, API, background script and content script. I decided to try to work just with a background script, because I do not want to populate each website with a script. This has some limitations but for track the time of the website I believe it can be achieved with a background script.

So the idea behind the extension is check whenever the url is completed loaded, the extension checks if the  url is in a object used to save partial, it can be stored in the chrome store, but for this assignment we are storing this in memory.

After that we checked the url we calculate duration and the referrer.

The extension has an alarm that fires every one minute, sending a post to the webserver, saving the the data in the backend and erasing old data in the extension.

However, deleting keys from an object could deteriorate the performance of looping over the object but this will be accepted for this extension.


