let to_send = [];
let urls = {};


chrome.webNavigation.onCompleted.addListener(function(details) {
    if(details.frameId === 0) {
        // Fires only when details.url === currentTab.url
        chrome.tabs.get(details.tabId, function(tab) {
            if(tab.url === details.url) {

            	if(!urls.hasOwnProperty[tab.url]) {
            		urls[tab.url] = {
            			time: 0,
            			current: true,
            			delta: details.timeStamp
            		};
        		} else {
        			urls[tab.url].current = true;
        		}
            	updateTime(tab.url, details.timeStamp);



                let p = new Promise(function(resolve, reject) {
			        chrome.tabs.executeScript(details.tabId, {code: 'document.referrer;'}, (result) => resolve(result));
			    });
			    p.then(function (res) {
			    	console.log(res);
			    	to_send.push({
			    		"tab_id": details.tabId,
			    		"url": tab.url,
			    		"visit_start": details.timeStamp,
			    		"duration": urls[tab.url].time,
			    		"referrer": res[0]
			    	});
			    	console.log(to_send)
			    })
            }
        });
    }
});


function updateTime(urlActive, timeStamp) {
	for(let url in urls) {
		data = urls[url];
		if(data.current && urlActive != url) {
			data.current = false;
			data.time += timeStamp - data.delta;
			urls[url] = data;
		}
	}
	console.log(urls)
}

/*function getCurrentActiveTab() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
    	let url + tabs[0].url;
        getURL(tabs[0].url);
        clearInterval(interval);
        interval = null;
        interval = setInterval(function() {
            ();
        }, updateTime);
    });
};*/
