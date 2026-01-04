var urlParamValues = {};
const urlParams = new URLSearchParams(window.location.search);
for (const [key, value] of urlParams) {
    urlParamValues[key] = value;
}

const uid = urlParamValues.id
const dcdnAPI = `https://dcdn.dstn.to/profile/${uid}`
const lanyardWS = "wss://api.lanyard.rest/socket";
const heartbeatPeriod = (100 * 30);
var profileData;


function updateDiscordData(data){
    var newData = {data: {}, profileData: {}};
        // ensure url params are available on the nested `data` object
        data = data || {};
        data.urlparams = urlParamValues;
        // also keep top-level urlparams (optional)
        newData.urlparams = urlParamValues;
        newData.data = data;
        newData.profileData = profileData;
    Object.assign(discordData, newData);
}

const initializeData = async () => {
    try {
        const getProfileData = async () => {
            const response = await fetch(`${dcdnAPI}`, { cache: "force-cache" });
            const data = await response.json(); 
            data.urlparams = urlParamValues;
            data.user_profile.bio = marked.parse(data.user_profile.bio)
            return data;
        };

        // Fetch the profile data
        profileData = await getProfileData();
        console.log("Profile data fetched!");

        // Initialize WebSocket Connection
        const ws = new WebSocket(lanyardWS);

        function sendHeartbeat() {
            const heartbeatPayload = {
                op: 3
            };
            ws.send(JSON.stringify(heartbeatPayload));
        }


        ws.onopen = function() {
            console.log("Connected to WebSocket!");
            const payload = {
                op: 2,
                d: {
                    subscribe_to_id: uid
                }
            };
        
            ws.send(JSON.stringify(payload));
            console.log("Subscription request sent!");
        
            setInterval(sendHeartbeat, heartbeatPeriod);
        };
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log("Message received:", data);
            if (data.op !== 1 ){
                data.d.activities.forEach(activity => {
                    if (activity.assets) {
                      if(activity.assets.large_image) activity.assets.large_image = imageUrlHandler(activity.assets.large_image, activity.application_id);
                      if(activity.assets.small_image) activity.assets.small_image = imageUrlHandler(activity.assets.small_image, activity.application_id);
                    }
                });
                updateDiscordData(data.d, event.t);
            }
        };
        
        ws.onerror = function(error) {
            console.error("WebSocket Error:", error);
        };
        ws.onclose = function() {
            console.log("WebSocket connection closed.");
        };
        
    } catch (error) {
        console.error("Error fetching data or initializing WebSocket:", error);
    }
};
initializeData();

function imageUrlHandler(image, appId){
    if (image.startsWith("mp:external")){
        image = `https://media.discordapp.net/external/${image.replace("mp:external/","")}`;    
        return image;
    } else {
        image = `https://cdn.discordapp.com/app-assets/${appId}/${image}.png`;    
        return image;
    }
}

