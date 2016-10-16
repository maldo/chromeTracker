
let to_send = [];
let urls = {};

const period = 1 * 60 * 1000;
const postUrl = 'http://127.0.0.1:3000';


chrome.webNavigation.onCompleted.addListener(function(details) {
    if(details.frameId === 0) {
        // Fires only when details.url === currentTab.url
        chrome.tabs.get(details.tabId, function(tab) {
            if(tab.url === details.url) {

            	if(!urls.hasOwnProperty[tab.url]) {
            		urls[tab.url] = {
            			time: 0,
            			current: true,
            			delta: details.timeStamp,
            			id: details.tabId
            		};
        		} else {
        			urls[tab.url].current = true;
        		}
            	updateTime(tab.url, details.timeStamp);


			    chrome.tabs.executeScript(details.tabId, {code: 'document.referrer;'}, function(result){
			    	urls[tab.url].referrer = result[0];
			    });
            }
        });
    }
});


function updateTime(urlActive, timeStamp) {
	for(let url in urls) {
		data = urls[url];
		if(data.current && urlActive != url) {
			data.current = false;
            // Update time duration from timestamp minus the timestamp of the last change
			data.time += timeStamp - data.delta;
			urls[url] = data;
		}
	}
	//console.log(urls)
}

chrome.alarms.create('Wracker', {delayInMinutes: 0.1, periodInMinutes: period/60000});


chrome.alarms.onAlarm.addListener(function(alarm) {
    // Create the array of data for each url
	let to_send = [];
	for(let url in urls){
		let data = urls[url];
		let obj = {
			tab_id: data.id,
			url: url,
			visit_start: new Date().toISOString(data.delta),
			duration: data.time,
			referrer: data.referrer
		};
		if(data.current) {
			obj.duration += period; 
		}
		to_send.push(obj);
	}
	sendData(to_send);
});

/*
 * Post the data to the backend and 
 * remove other urls if the request is OK
 */
function sendData(to_send) {
	let xhr = new XMLHttpRequest();

    xhr.open('POST', postUrl, true);

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange = function() { 
        // If the request completed
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                for (let obj of to_send) {
                	if (urls.hasOwnProperty(obj.url) && !urls[obj.url].current) {
                		delete urls[obj.url];
                	}
                }
            } else {
                // Deal with the error
            }
        }
    };

    // Send the request and set status
    xhr.send(JSON.stringify(to_send));
}

