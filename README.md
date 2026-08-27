# Task Overview

Utkrusht runs a proof-of-skills marketplace where finance and operations teams rely on a browser-based Payments Dashboard to review daily and monthly payments for assessments. This dashboard is used to reconcile payouts to partners, spot anomalies in revenue, and answer time-sensitive questions from leadership. The current front-end implementation is slow, brittle, and hard to evolve, which creates risk every time traffic spikes or a new reporting requirement appears. Your task is to reshape this dashboard into a more robust, modular, and performant JavaScript application that can support Utkrusht's growth.

## Objectives

- Build a coherent payments dashboard experience that loads daily and monthly payment data for a selected date range and presents it clearly to the user.
- Introduce a structured data layer that hides network complexity behind a simple, well-defined API the rest of the app can call.
- Implement a caching approach that avoids unnecessary network traffic while ensuring users still see fresh-enough data for operational use.
- Improve the way the UI updates the DOM so that the dashboard feels responsive, avoids unnecessary layout work, and keeps the page stable while data is loading.
- Provide clear, predictable behavior when something goes wrong, including visible error messaging and sensible fallback behavior instead of silent failures.
- Ensure the final codebase is organized into logical modules with consistent naming, making it straightforward for another engineer to extend or debug.

## How to Verify

- Load the dashboard in a modern browser and confirm that selecting a date range leads to a visible update of daily and monthly payment information.
- Interact with the controls multiple times and observe whether repeated requests for the same date range avoid redundant network activity while still reflecting data changes appropriately.
- Intentionally cause network or data errors (for example, by pointing the base URL at an invalid host or by clearing expected storage values) and confirm that the UI shows a clear, human-readable error instead of breaking.
- Observe how the page behaves while data is loading: the UI should provide an obvious loading state and avoid jarring layout jumps or flickers.
- Review the structure of the JavaScript modules to see whether different responsibilities (data access, caching, event coordination, and rendering) are clearly separated and easy to reason about.

## Helpful Tips

- Consider how to separate concerns so that data fetching, caching, event coordination, and rendering do not become tangled together.
- Think about how to design interfaces between modules so they remain flexible if new payment views or additional filters are added in the future.
- Explore browser storage and in-memory strategies that balance freshness of data against the cost and latency of network requests.
- Review techniques for updating the DOM incrementally in ways that keep the UI responsive even as data size grows.
- Reflect on how you will surface failures so that non-technical users can still understand what is happening without needing to open developer tools.
