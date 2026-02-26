# Examples

## Creating an Element
```js
import { game } from "./Engine/Unlocked.js";

const { frame, event } = game.presets.scripts;

new game.element(
    { x: 100, y: 100 }
    ,{ color: [255, 0, 0] }
    ,{}
    ,[new frame({
        fired() {
            // runs every frame
        }
    })]
);
```

## Using on_insert and on_removal
```js
new game.element(
    {}
    ,{ color: [0, 255, 0] }
    ,{}
    ,[new frame({
        on_insert(myNumber) {
            console.log("inserted!", myNumber);
        }
        ,fired() {
            this.remove();
        }
        ,on_removal(myNumber) {
            console.log("removed!", myNumber);
        }
    }), 5]
);
```