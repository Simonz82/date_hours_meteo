# Changelog

## 1.0.0
- First release of `custom:shc-clock-strip-card`: single-row strip with date, season, time, weather icon and indoor/outdoor temperatures.
- Proportional scaling with CSS container queries (`cqw`), no narrow layout.
- Visual editor with Italian/English labels.
- Options: `indoor_entity`, `outdoor_entity`, `weather_entity`, `season_entity`, `show_date`, `show_seconds`, `show_season`, `show_weather`, `transparent`, `season_images`, `weather_icons`.
- Weather icons fall back to Home Assistant `mdi:` icons when the SVG set is missing; season icons fall back to built-in SVGs.
- HACS support (`hacs.json`), issue templates, validation and release workflows.

## Before 1.0.0
- Classic version made of `button-card` + `layout-card` (`date_hours_meteo_card.yaml`, `packages/sensor_time_e_date.yaml`). Still available, unchanged.
