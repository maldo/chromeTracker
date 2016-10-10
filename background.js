let to_send = [];
let urls = {};


chrome.webNavigation.onCompleted.addListener(function(details) {
    if(details.frameId === 0) {
        // Fires only when details.url === currentTab.url
        chrome.tabs.get(details.tabId, function(tab) {
            if(tab.url === details.url) {

            	if(urls.hasOwnProperty[tab.url]) {
            		urls[tab.url] = 0;
            	}



                let p = new Promise(function(resolve, reject) {
			        chrome.tabs.executeScript(details.tabId, {code: 'document.referrer;'}, (result) => resolve(result));
			    });
			    p.then(function (res) {
			    	console.log(res);
			    	to_send.push({
			    		"tab_id": details.tabId,
			    		"url": tab.url,
			    		"visit_start": details.timeStamp,
			    		"duration": urls[tab.url],
			    		"referrer": res[0]
			    	});
			    	console.log(to_send)
			    })
            }
        });
    }
});