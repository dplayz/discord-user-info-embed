
var urlParamValues = {};
const urlParams = new URLSearchParams(window.location.search);
for (const [key, value] of urlParams) {
    urlParamValues[key] = value;
}

const endpoints = {
    LANYARDAPI: `https://api.lanyard.rest/v1`,
    LANYARDWS: `wss://api.lanyard.rest/socket`,
    DCDNAPI: `https://dcdn.dstn.to`,
    HEARTBEAT_PERIOD: 100 * 30
}

function largeImageSourceConvertion(source, appId){
    if (source.includes("mp:")){
        var actLargeImageSource = source.replace('mp:', '');
        actLargeImageSource = "https://media.discordapp.net/" + actLargeImageSource
    } else {    
        var actLargeImageSource = "https://cdn.discordapp.com/app-assets/" + appId + "/" + source + ".png";
    }
    return actLargeImageSource;
}
var jsonCache;
// different from updatepresence, adds the username, pfp, status, original activities
async function init(data) {
    let json = data;

    // initialize an global cache
    window.jsonCache = data

    if (json.discord_user['discriminator'] == "0"){
        document.getElementById("username").innerHTML = json.discord_user['username'];
    } else{
        document.getElementById("username").innerHTML = json.discord_user['username'] + '#' + json.discord_user['discriminator'];
    }
    document.getElementById("globalname").innerHTML = json.discord_user['global_name'];
    if (json.discord_user['avatar'] !== null){
        document.getElementById("avatar").src = "https://cdn.discordapp.com/avatars/" + userid + "/" + json.discord_user['avatar'];
    } else {
        document.getElementById("avatar").src = "https://steamuserimages-a.akamaihd.net/ugc/1838031787134393485/7749992FAA91DA086B56CB76D3FB4BD4F63A2DEA/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true";
    }

    let activities = json.activities;
    let currentdiv = document.getElementById("activities");
    let curractiv = 1;
        activities.forEach(element => {
        // if not the status activity, continue
        if(element['type'] !== 4) {
            var div = document.createElement("div");
            div.id = element['name'].split(' ').join('').toLowerCase();
            div.className = "activity";
            // if the activity is spotify try to get all of the song info instead of the activity details
            if(element['name'] === "Spotify") {
                var songinfo = [json.spotify['song'], json.spotify['artist'].split('; ').join(', '), json.spotify['album']]

                var timeNow = Date.now();
                var timeStart = element.timestamps.start
                var timeEnd = element.timestamps.end;

                var percentCalc =  ((timeNow - timeStart) / (timeEnd - timeStart) ) * 100
                div.innerHTML = ('<div id="spotifyProgBarCover"><img draggable="false" alt="" width="64" height="64" src="' +
                data.spotify['album_art_url'] + '"><progress id="file" value="' + percentCalc + '" max="100"></progress> </div>'
                + '<ul>'+"<strong>" + element['name'] + "</strong>"+'<li>' + songinfo.join("</li><li>") + "</li>");
            } else {
                // time elapsed timer
                if (element.timestamps !== undefined){
                const current_time = element.timestamps['start'],
                exp_time = Math.floor(Date.now() / 1000)
                diff = (exp_time * 1000) - current_time;
                } else {
                    diff = null;
                    timestampsUndefined = true
                }
                formatTime = (ms) => {
                    const seconds = Math.floor((ms / 1000) % 60);
                    const minutes = Math.floor((ms / 1000 / 60) % 60);
                    const hours = Math.floor((ms / 1000 / 3600) % 60);
                    return [hours, minutes, seconds].map(v => String(v).padStart(2,0)).join(':');
                }
                var actLargeImageSource = largeImageSourceConvertion(element.assets.large_image, element.application_id );
                var activityinfo = ["<div><strong>" + element['name'] + "</strong> <br>", "<p>" + (element['details'] === undefined ? "<br>" : element['details']) + "</p>", "<p>" + (element['state'] === undefined ? (element['timestamp'] ? formatTime(diff) + " elapsed" : "") : element['state']) + (element['state'] ? "<br>" + formatTime(diff) + " elapsed" : '') + "</p></div>"];
                if(element.assets !== undefined) {
                    div.innerHTML = ('<img draggable="false" alt="" /' + element.assets['large_image'] +
                        '.png" width="64" height="64" src="' + actLargeImageSource +'"> <div class="other">' +
                        "<ul><li>" + activityinfo.join("</li><li>") + "</li></ul>" + '</div>');
                } else if(element.assets === undefined) {
                    div.innerHTML = ('<img draggable="false" alt="" width="64" height="64" src="unknown.png"> <div class="other">' +
                        "<ul><li>" + activityinfo.join("</li><li>") + "</li></ul>" + '</div>');
                }

            }

            currentdiv.appendChild(div);
        } else {
            // if it is the status, set the src of the emoji img and the status text itself
            //document.getElementById("statusemoji").src = "https://cdn.discordapp.com/emojis/" + element.emoji['id'] + (element.emoji['animated'] ? ".gif" : ".png");

            if (json.activities[0].emoji.id !== undefined) {
                document.getElementById("statusemoji").innerHTML = '<img draggable="false" width="32px" alt="" src="https://cdn.discordapp.com/emojis/' + element.emoji['id'] + (element.emoji['animated'] ? ".gif" : ".webp") + '?size=44&quality=lossless">'
            } 
            else {
                document.getElementById("statusemoji").innerHTML = json.activities[0].emoji.name;
            }
            document.getElementById("status").innerHTML = json.activities[0].state ? json.activities[0].state : "";
        }
    });
}
async function updatepresence(isDataRecalc) {
    if (isDataRecalc === true){
    // If it's just recalculating, get the value from cache for updating
    var json = jsonCache;
    } else {
    // Otherwise, ping the API for value, then update the global cache, and return
        const json = await lanyard({userId: userid});
        window.jsonCache = json;
        return
    }
    let activities = json.activities;
    let currentdiv = document.getElementById("activities");
        activities.forEach(element => {
        // if not the status activity, continue
        if(element['type'] !== 4) {
            var activityname = element['name'].split(' ').join('').toLowerCase();
            var exists = true;
            if(document.getElementById(activityname) !== null)
                exists = document.getElementById(activityname)['length'] == 0;
            let div = document.getElementById(activityname);

            // check if the activity already exists, if it does just modify the existing one to not create multiple instances
            if(exists) {
                div = document.createElement("div");
                div.id = activityname;
                div.className = "activity";
            }
            // if the activity is spotify try to get all of the song info instead of the activity details
            if(element['name'] === "Spotify") {
                var songinfo = [json.spotify['song'], json.spotify['artist'].split('; ').join(', '), json.spotify['album']];
                
                var timeNow = Date.now();
                var timeStart = element.timestamps.start
                var timeEnd = element.timestamps.end;

                var percentCalc =  ((timeNow - timeStart) / (timeEnd - timeStart) ) * 100
                
                div.innerHTML = '<div id="spotifyProgBarCover"><img draggable="false" alt="" width="64" height="64" src="' +
                    json.spotify['album_art_url'] + '"><progress id="file" value="' + percentCalc + '" max="100"></progress> </div>' + '<ul>'+"<li><strong>" + element['name'] + "</strong></li>" + '<li>' +
                    songinfo.join("</li><li>") + '</li></ul> ';

            } else {
                // time elapsed timer
                const current_time = element.timestamps['start'],
                exp_time = Math.floor(Date.now() / 1000)
                diff = (exp_time * 1000) - current_time,
                formatTime = (ms) => {
                    const seconds = Math.floor((ms / 1000) % 60);
                    const minutes = Math.floor((ms / 1000 / 60) % 60);
                    const hours = Math.floor((ms / 1000 / 3600) % 60);
                    return [hours, minutes, seconds].map(v => String(v).padStart(2,0)).join(':');
                }

                var activityinfo = ["<div><strong>" + element['name'] + "</strong> <br>", "<p>" + (element['details'] === undefined ? "<br>" : element['details']) + "</p>", "<p>" + (element['state'] === undefined ? (element['timestamp'] ? formatTime(diff) + " elapsed" : "") : element['state']) + (element['state'] ? "<br>" + formatTime(diff) + " elapsed" : '') + "</p></div>"];
                if(element.assets !== undefined) {
                    var actLargeImageSource = largeImageSourceConvertion(element.assets.large_image, element.application_id );
                    div.innerHTML = ('<img draggable="false" alt="" width="64" height="64" src="'+ actLargeImageSource +'"> <div class="other">' +
                        "<ul><li>" + activityinfo.join("</li><li>") + "</li></ul>" + '</div>');
                } else if(element.assets === undefined) {
                    div.innerHTML = ('<img draggable="false" alt="" width="64" height="64" src="unknown.png"> <div class="other">' +
                        "<ul><li>" + activityinfo.join("</li><li>") + "</li></ul>" + '</div>');
                }
            }

            if(exists)
                currentdiv.appendChild(div);
        }

    });
    
    // get the difference of the current activities and the last, mostly just to remove activities that aren't active anymore
    let names = [];
    activities.forEach(e => {if(e['type'] !== 4)names.push(e['name'].split(' ').join('').toLowerCase())})
    var children = [].slice.call(currentdiv.getElementsByClassName('activity'), 0);
    var childnames = new Array(children.length);
    var array1Length = children.length;
    var array2Length = names.length;
    for (var i = 0; i < array1Length; i++) {
        var name = children[i].getAttribute("id");    
        childnames[i] = name;
    }
    var toremove = childnames.filter(x => !names.includes(x));
    children.filter(x => toremove.includes(x.id)).forEach(e => {e.remove()});
}

const presenceOnload = async () => {
    // init all of the original divs and main user details
    const start = async () => {
        var json = await lanyard({userId: userid});
        init(json); 
        window.jsonCache = json;

        function loop() {
            setInterval(function() {
                updatepresence(true);
            }, 1000)
        }
        loop();


    }
    start();
    // start the websocket to automatically fetch the new details on presence update
    lanyard({
        userId: userid,
        socket: true,
        onPresenceUpdate: updatepresence
    })
    dcdnFetch(userid);
}
