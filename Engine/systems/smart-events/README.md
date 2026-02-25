<div align="center">
  <h1>Smart Events</h1>
</div>

**Smart Events** is a tiny wrapper for DOM event listeners with built-in tracking and context-aware removal.  
Perfect for games, tools, or small apps that need quick and simple event management.

<div align="center">
  <h2>Features</h2>
</div>

- ⚡ Auto-binds and registers events  
- 🔍 Easily find or remove events by type or ID  
- 🧠 `this.remove()` inside the listener removes itself  
- 📦 ~1KB unminified

<div align="center">
  <h2>Example</h2>
</div>

```js
import { event } from "./smart-events/event.js";

new event("keydown", function (e) {
  if (e.key === "Escape") this.remove();
});
```

<div align="center">
  <h2>Liscense</h2>
</div>
<div align="center">
  <p>
    Smart Events is MIT licensed.
    Use it freely, modify it, or bundle it however you want.
  </p>
</div>
