A playground for building tools that let me

- watch inputs in [Ractive](http://www.ractivejs.org/) templates
- turn them into [Bacon](baconjs.github.io) streams
- send them to a server
- update the Ractive element to reflect the "saving" state
- on response from the server, update the inputs with the server-validated data
- update the Ractive element to reflect the "saved" state
- handle saves that fail because of [optimistic concurrency control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control) and reflect the updated state in the Ractive element

To see the current state of things:

```sh
git clone git@github.com:TehShrike/ractive-saving-stuff.git
cd ractive-saving-stuff
npm install
npm run dev
```
