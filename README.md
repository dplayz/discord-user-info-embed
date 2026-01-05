
<img src="" align="left"
     alt="dplayz/discord-user-embed" width="125" height="125">
### dplayz/discord-user-embed (v2)
A site that can be used to embed your discord user info easily

---

# Usage
1. Join the [Lanyard Discord server](https://discord.com/invite/UrXF2cfJ7F)
2. Paste these lines of code to your page of choice
```html
<!--Paste these-->
<script src="https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@latest"></script>
<!-- For User info-->
<iframe id="userInfoIframe" src="https://dist.dpg06.top/discord-user-embed/v2/embed/index.html?id=[userid]&activities=[true|false]" width="100%" style="border:none;padding:0px;margin:0px; background:none transparent; background-color: transparent;" allowtransparency="true"></iframe>
<script>
iframeResize({ license: 'GPLv3', log: 'collapsed'})
</script>
```  
3. Check if it works  

For more info on how it works, see here:
https://github.com/phineas/lanyard

# Found an issue? 
Report it at ``/issues`` tracker

# Want to contribute?
Send a PR at ``/pulls``

# Upcoming Plans?
- [ ] Online Status
- [ ] Accent color
- [/] Custom Status Message
- [ ] Badges
from v1
- [ ] Activities only view 

# Versioning
This project does not follow any versioning yet, but I'm planning to use Calendar Versioning

# Would I want this to be at the Lanyard Community Projects Lists?
I'm too hesitant for that because:
1. It has a very messy codebase
2. I'm simply shy enough lol

# Dependencies
- API:
    - [phineas/lanyard](https://github.com/phineas/lanyard)
    - [Dustin's dcdn.dustin.co](https://dcdn.dstn.to/gist)
- Frontend
    - VueJS library
    - marked npm library
    - iframe-resizer library
- and many more resources that made it possible


# License
Unless otherwise noted, this project is licensed under MIT License.
