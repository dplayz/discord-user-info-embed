var dcdnData;
function dcdnFetch(id){
    const apiUrl = `${endpoints.DCDNAPI}/profile/${id}`;

    // Make a GET request to the API
    fetch(apiUrl)
      .then(response => {
        // Check if the request was successful (status code 200)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Parse the JSON in the response
        return response.json();
      })
      .then(data => {
        // Handle the data
//      console.log(data);
        window.dcdnData = data
        console.log(dcdnData);
        document.getElementById("profileBanner").style.backgroundColor = dcdnData.user.banner_color ? dcdnData.user.banner_color : null;
        if (dcdnData.user.banner !== undefined ) {
        document.getElementById("profileBanner").style.backgroundImage = `url('https://cdn.discordapp.com/banners/${dcdnData.user.id}/${dcdnData.user.banner}?size=480')`
        }
        document.getElementById("pronoun").innerHTML = dcdnData.user_profile.pronouns ? dcdnData.user_profile.pronouns : null;
        document.getElementById("aboutMeData").innerHTML = marked.parse(dcdnData.user_profile.bio).replace(/\n/g, '<br>').replace(/a href=/g, 'a target="_parent" href=');
      })
      .catch(error => {
        // Handle errors
        console.error('Fetch error:', error);
      });
}  