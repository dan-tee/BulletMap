BulletMap
=========

Crowd sourced database of bullets being used in conflict regions.

Project Structure
=================

This repository will host the server and the mobile app. There will be one folder for each and a folder for the shared HTML and JS.

Architecture
============

We will have a NodeJs backend using MongoDB and offering a json API, a web frontend and mobile apps using PhoneGap. For HTML templates we will use Moustache.

Installation Guide
==================
1. Install [node.js](http://nodejs.org) and [MongoDB](http://www.mongodb.org/).
2. Download this repository. All shell commands will assume your are in the base directory of this repo.
3. Import ./Shared/test/bullet\_info.json into the DB **bullet\_map** and collection **bullet\_info**.
 ```
 mongoimport --db bullet_map --collection bullet_info --file ./Shared/test/bullet_info.json
 ```   
4. Run the server  
 ```
 node ./BulletMapServer/server.js
 ```
5. Access page via your browser by entering the URL  
 ```
 http://localhost:3000/
 ```
6. Create Phonegap/Cordova app (http://docs.phonegap.com/, http://cordova.apache.org/) and use Shared as the app's www-directory.

Links
=====
http://cartridgecollectors.org/?page=headstampcodes

http://gundata.org/bullet-database/

http://nazarian.no/def.asp

http://www.shootforum.com/forum/bulletdb.html

http://www.worldwithjan.com/post/74585253223/focusing-ukraine-armour-piercing-shotgun-projectiles

License
=======
BulletMap is free software. You can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, version 2. 

It comes WITHOUT ANY WARRANTY. Without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

