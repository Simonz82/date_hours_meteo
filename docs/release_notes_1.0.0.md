Clock Strip Card 1.0.0 - first release of the `custom:shc-clock-strip-card` card.

New
- Standalone Lovelace card: date | season + time | weather + indoor/outdoor temperatures, always on one row.
- Everything scales with the card width (CSS container queries): phones, tablets, wall panels.
- Visual editor (Italian and English labels, follows the Home Assistant language).
- Time and date are rendered in the Home Assistant time zone and language, optional seconds.
- Season from an optional sensor or calculated from the date (southern hemisphere aware).
- Day/night weather icon (uses `sun.sun`), with fallback to built-in Home Assistant icons when the SVG set is not installed.
- Season icons fall back to built-in SVGs when no custom images are present.
- HACS installation (Dashboard / plugin).

Unchanged
- The classic button-card version (`date_hours_meteo_card.yaml` + `packages/sensor_time_e_date.yaml`) is still in the repository and works as before.

Installation: HACS > Custom repositories > `Simonz82/date_hours_meteo` > Dashboard, or copy `shc-clock-strip-card.js` to `/config/www/`.
