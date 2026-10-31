// shc-clock-strip-card: single-row clock strip (date | season + time | weather + temperatures).
// Everything scales with the width of the container (cqw units), no narrow layout.
// Standalone: it only reads entities through hass. https://github.com/Simonz82/date_hours_meteo

const SHC_CLOCK_VERSION = "1.0.0";

const SHC_CLOCK_WEATHER_MDI = {
  "clear-night": "weather-night", cloudy: "weather-cloudy", fog: "weather-fog", hail: "weather-hail",
  lightning: "weather-lightning", "lightning-rainy": "weather-lightning-rainy", partlycloudy: "weather-partly-cloudy",
  rainy: "weather-rainy", snowy: "weather-snowy", "snowy-rainy": "weather-snowy-rainy", sunny: "weather-sunny",
  windy: "weather-windy", "windy-variant": "weather-windy-variant",
};

const SHC_CLOCK_SEASON_IMG = { spring: "01.png", summer: "02.png", autumn: "03.png", winter: "04.png" };
const SHC_CLOCK_SEASON_EMOJI_SVG = {
  spring: '<svg viewBox="0 0 24 24"><path fill="#f9a8d4" d="M12 2c2 3 2 6 0 8-2-2-2-5 0-8zm9 7c-3 0-6 1-7 3 2 1 5 1 7-3zM3 9c3 0 6 1 7 3-2 1-5 1-7-3zm4 11c1-3 3-5 5-5 0 3-2 5-5 5zm10 0c-3 0-5-2-5-5 2 0 4 2 5 5z"/></svg>',
  summer: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#fbbf24"/><g stroke="#fbbf24" stroke-width="2" stroke-linecap="round"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></g></svg>',
  autumn: '<svg viewBox="0 0 24 24"><path fill="#f59e0b" d="M12 2l2 4 3-1-1 4 4 1-3 3 2 3-4 0 1 4-4-2-4 2 1-4-4 0 2-3-3-3 4-1-1-4 3 1z"/></svg>',
  winter: '<svg viewBox="0 0 24 24"><g stroke="#bae6fd" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/></g></svg>',
};
const SHC_CLOCK_WEATHER_ICONS = {
  "clear-night": "clear-night", cloudy: "cloudy", fog: "fog", hail: "hail", lightning: "lightning",
  "lightning-rainy": "lightning-rainy", partlycloudy: "partlycloudy", pouring: "rainy", rainy: "rainy",
  snowy: "snowy", "snowy-rainy": "snowy-rainy", sunny: "sunny", windy: "windy", "windy-variant": "windy-variant",
  exceptional: "sunny",
};

class ShcClockStripCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._timer = null;
    this._built = false;
  }

  static getConfigElement() { return document.createElement("shc-clock-strip-card-editor"); }
  static getStubConfig() {
    return {
      indoor_entity: "sensor.living_room_temperature",
      outdoor_entity: "weather.home",
      weather_entity: "weather.home",
    };
  }

  setConfig(config) {
    this._config = {
      show_seconds: false, show_season: true, show_weather: true, show_date: true,
      transparent: true, season_images: "/local/stagioni/var1/", weather_icons: "/local/weather_icons/",
      ...config,
    };
    this._built = false;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._render();
    this._update();
  }

  getCardSize() { return 2; }
  getGridOptions() { return { columns: 12, rows: 2, min_columns: 4, min_rows: 1 }; }

  connectedCallback() { this._startTimer(); }
  disconnectedCallback() { if (this._timer) { clearInterval(this._timer); this._timer = null; } }

  _startTimer() {
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => this._updateTime(), 1000);
  }

  _lang() {
    const h = this._hass;
    return (h && (h.locale && h.locale.language || h.language)) || "it";
  }
  _tz() { return this._hass && this._hass.config && this._hass.config.time_zone; }

  _render() {
    const c = this._config;
    if (!c) return;
    this._built = true;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { background: ${c.transparent ? "none" : "var(--ha-card-background, var(--card-background-color))"};
          border: none; box-shadow: none; overflow: visible; color: var(--primary-text-color, #fff); }
        .wrap { container-type: inline-size; container-name: strip; width: 100%; }
        .strip { display: grid; align-items: center; column-gap: 1.5cqw; padding: 1.5cqw 2cqw; box-sizing: border-box;
          grid-template-columns: 1fr auto 1fr; font-family: Roboto, "Segoe UI", sans-serif; white-space: nowrap; }
        .date { justify-self: start; line-height: 1.12; }
        .date .wd { font-size: min(3.3cqw, 34px); font-weight: 300; opacity: .92; }
        .date .dm { font-size: min(3.7cqw, 42px); font-weight: 600; }
        .time { display: flex; align-items: center; justify-content: center; gap: 1.6cqw; }
        .season { width: 6.5cqw; height: 6.5cqw; max-width: 84px; max-height: 84px; flex: none; }
        .season img, .season svg { width: 100%; height: 100%; object-fit: contain; display: block; }
        .clock { font-size: min(10.5cqw, 150px); font-weight: 600; line-height: 1; letter-spacing: -.01em;
          font-variant-numeric: tabular-nums; white-space: nowrap; }
        .clock .sec { font-size: .5em; font-weight: 400; opacity: .75; margin-left: .12em; }
        .weather { justify-self: end; display: flex; align-items: center; gap: 1.2cqw; }
        .wicon { width: 7.5cqw; height: 7.5cqw; max-width: 100px; max-height: 100px; flex: none; }
        .wicon img { width: 100%; height: 100%; object-fit: contain; display: block; }
        .temps { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.05; }
        .t-in { font-size: min(2.7cqw, 30px); font-weight: 400; opacity: .85; }
        .t-out { font-size: min(4.2cqw, 56px); font-weight: 600; }
        .u { font-size: .62em; font-weight: 400; margin-left: .15em; }
        .hide { display: none !important; }
      </style>
      <ha-card><div class="wrap"><div class="strip">
        <div class="date ${c.show_date ? "" : "hide"}"><div class="wd"></div><div class="dm"></div></div>
        <div class="time"><div class="season ${c.show_season ? "" : "hide"}"></div><div class="clock"></div></div>
        <div class="weather ${c.show_weather ? "" : "hide"}"><div class="wicon"></div>
          <div class="temps"><div class="t-in"></div><div class="t-out"></div></div></div>
      </div></div></ha-card>`;
    this._el = {
      wd: this.shadowRoot.querySelector(".wd"), dm: this.shadowRoot.querySelector(".dm"),
      season: this.shadowRoot.querySelector(".season"), clock: this.shadowRoot.querySelector(".clock"),
      wicon: this.shadowRoot.querySelector(".wicon"), tin: this.shadowRoot.querySelector(".t-in"),
      tout: this.shadowRoot.querySelector(".t-out"),
    };
    this._last = {};
    this._startTimer();
    this._update();
  }

  _season(now) {
    const c = this._config;
    const st = c.season_entity && this._hass && this._hass.states[c.season_entity];
    if (st) {
      const m = { primavera: "spring", estate: "summer", autunno: "autumn", inverno: "winter" };
      const v = String(st.state).toLowerCase();
      const k = SHC_CLOCK_SEASON_IMG[v] ? v : m[v];
      if (k) return k;
    }
    const lat = this._hass && this._hass.config && this._hass.config.latitude;
    const md = (now.getMonth() + 1) * 100 + now.getDate();
    let s = md >= 321 && md < 621 ? "spring" : md >= 621 && md < 923 ? "summer" : md >= 923 && md < 1221 ? "autumn" : "winter";
    if (lat != null && lat < 0) s = { spring: "autumn", summer: "winter", autumn: "spring", winter: "summer" }[s];
    return s;
  }

  _weatherKey() {
    const c = this._config, h = this._hass;
    const ent = c.weather_entity && h.states[c.weather_entity];
    if (!ent) return null;
    let s = ent.state;
    const sun = h.states["sun.sun"];
    const night = sun ? sun.state === "below_horizon" : s === "clear-night";
    if (s === "sunny" && night) s = "clear-night";
    if (s === "clear-night" && sun && !night) s = "sunny";
    return SHC_CLOCK_WEATHER_ICONS[s] || null;
  }

  _temp(entityId) {
    const h = this._hass;
    const e = entityId && h.states[entityId];
    if (!e) return null;
    let v = e.entity_id.startsWith("weather.") ? e.attributes.temperature : e.state;
    const n = Number(v);
    if (v == null || v === "unknown" || v === "unavailable" || !isFinite(n)) return null;
    let unit = e.attributes.temperature_unit || e.attributes.unit_of_measurement || "°C";
    return { v: n.toFixed(1), unit };
  }

  _updateTime() {
    if (!this._el || !this._config) return;
    const now = new Date();
    const lang = this._lang(), tz = this._tz();
    const opt = { hour: "2-digit", minute: "2-digit", hour12: false };
    if (tz) opt.timeZone = tz;
    const hm = new Intl.DateTimeFormat("en-GB", opt).format(now);
    let sec = "";
    if (this._config.show_seconds) {
      const so = { second: "2-digit" }; if (tz) so.timeZone = tz;
      sec = new Intl.DateTimeFormat("en-GB", so).format(now).padStart(2, "0");
    }
    const key = hm + "|" + sec;
    if (this._last.time !== key) {
      this._last.time = key;
      this._el.clock.innerHTML = hm + (sec ? `<span class="sec">${sec}</span>` : "");
    }
    const dopt = tz ? { timeZone: tz } : {};
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const wd = cap(new Intl.DateTimeFormat(lang, { weekday: "long", ...dopt }).format(now)) + ",";
    const dm = (() => {
      const p = new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", ...dopt }).formatToParts(now);
      return p.map((x) => (x.type === "month" ? cap(x.value) : x.value)).join("");
    })();
    if (this._last.wd !== wd) { this._last.wd = wd; this._el.wd.textContent = wd; }
    if (this._last.dm !== dm) { this._last.dm = dm; this._el.dm.textContent = dm; }
    const s = this._season(now);
    if (this._last.season !== s && this._config.show_season) {
      this._last.season = s;
      const base = this._config.season_images;
      this._el.season.innerHTML = `<img src="${base}${SHC_CLOCK_SEASON_IMG[s]}" alt="${s}">`;
      const img = this._el.season.querySelector("img");
      img.onerror = () => { this._el.season.innerHTML = SHC_CLOCK_SEASON_EMOJI_SVG[s]; };
    }
  }

  _update() {
    if (!this._el || !this._hass || !this._config) return;
    this._updateTime();
    if (!this._config.show_weather) return;
    const wk = this._weatherKey();
    if (this._last.wk !== wk) {
      this._last.wk = wk;
      this._el.wicon.innerHTML = wk ? `<img src="${this._config.weather_icons}${wk}.svg" alt="${wk}">` : "";
      const wimg = this._el.wicon.querySelector("img");
      // Fallback: if the SVG set is not installed, use the built-in Home Assistant icon.
      if (wimg) wimg.onerror = () => {
        this._el.wicon.innerHTML = `<ha-icon icon="mdi:${SHC_CLOCK_WEATHER_MDI[wk] || "weather-cloudy"}" style="--mdc-icon-size:100%;width:100%;height:100%;display:block"></ha-icon>`;
      };
    }
    const tin = this._temp(this._config.indoor_entity), tout = this._temp(this._config.outdoor_entity);
    const f = (t) => (t ? `${t.v}<span class="u">${t.unit}</span>` : "");
    const a = f(tin), b = f(tout);
    if (this._last.tin !== a) { this._last.tin = a; this._el.tin.innerHTML = a; }
    if (this._last.tout !== b) { this._last.tout = b; this._el.tout.innerHTML = b; }
  }
}
customElements.define("shc-clock-strip-card", ShcClockStripCard);

class ShcClockStripCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._draw(); }
  set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
  _draw() {
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => s.label || s.name;
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = ev.detail.value;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    const it = String((this._hass && (this._hass.language || (this._hass.locale && this._hass.locale.language))) || "en").startsWith("it");
    const L = (en, itl) => (it ? itl : en);
    this._form.schema = [
      { name: "indoor_entity", label: L("Indoor temperature (small)", "Temperatura interna (piccola)"), selector: { entity: { domain: "sensor", device_class: "temperature" } } },
      { name: "outdoor_entity", label: L("Outdoor temperature (large): sensor or weather", "Temperatura esterna (grande): sensore o meteo"), selector: { entity: { domain: ["sensor", "weather"] } } },
      { name: "weather_entity", label: L("Weather (icon)", "Meteo (icona)"), selector: { entity: { domain: "weather" } } },
      { name: "season_entity", label: L("Season (empty = automatic from date)", "Stagione (vuoto = automatica dalla data)"), selector: { entity: { domain: "sensor" } } },
      { name: "show_seconds", label: L("Show seconds", "Mostra i secondi"), selector: { boolean: {} } },
      { name: "show_date", label: L("Show date", "Mostra la data"), selector: { boolean: {} } },
      { name: "show_season", label: L("Show season icon", "Mostra l'icona della stagione"), selector: { boolean: {} } },
      { name: "show_weather", label: L("Show weather and temperatures", "Mostra meteo e temperature"), selector: { boolean: {} } },
      { name: "transparent", label: L("Transparent background", "Sfondo trasparente"), selector: { boolean: {} } },
    ];
    this._form.data = { show_seconds: false, show_date: true, show_season: true, show_weather: true, transparent: true, ...this._config };
  }
}
customElements.define("shc-clock-strip-card-editor", ShcClockStripCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "shc-clock-strip-card",
  name: "Clock Strip",
  description: "Single-row clock strip: date, season, time, weather and temperatures. Scales to any screen.",
  author: "Simonz82",
});
