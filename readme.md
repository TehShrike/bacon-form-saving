For a single row in a database somewhere, and a single web form that lets you edit that data in real time.

Create a BaconJS stream of objects whose properties are the column identifiers and whose values are the new values entered by the user: `{ name: 'Josh' }`

Call the function exported by this module, passing in

1. that stream
2. an object containing the initial/current state of the object in the database
3. the name of the primary key column
3. a function that takes an object and a callback function, that saves the object and calls back with either an error, and if possible, the new state of the object in the database.

It's pretty opinionated.  It handles populating a `version` value with whatever the latest `version` was on the object received from the server, and a primary key column populated from the initial state, or the latest object received from the server.

To check out the play/testing ground:

```sh
git clone git@github.com:TehShrike/ractive-saving-stuff.git
cd ractive-saving-stuff
npm install
npm run dev
```
