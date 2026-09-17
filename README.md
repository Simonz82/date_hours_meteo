<h2><span style="text-decoration: underline;"><strong>🌤️ ha_date_hours_meteo card for home assistant</strong></span></h2>

<p><img src="example/example1.jpg" alt="" /></p>

<p><img src="example/example2.jpg" alt="" /></p>

<p>Volevo condividere una scheda che ho creato con l'aiuto delle varie community per visualizzare data, ora e meteo interno ed esterno di casa.</p>

<p dir="auto">Instructions:</p>

da Hacs, installare:
1. button-card
2. layout-card

poi ...
1. nella cartella packeges incollare il file sensor_time_e_date.yaml
2. nella cartella www dovete andare ad incollare tutte le immagini del meteo come da percorso: www\weather_icons\
3. in HA create una card manuale e incollate il contenuto del file: date_hours_meteo_card.yaml
4. Temperatura interna, modificare l'entità con la vostra alla riga 66 (io ho messo il sensore di temperatura del mio salone)
5. Temperatura esterna, modificare l'entità con la vostra alla riga 69 e 75 se avete un altro servizio di meteo (io ho usato weather.forecast)
6. per gli allineamenti e dimensioni dovete eventualmente modificare i parametri alle righe CARD, NAME, LABEL per i 3 blocchi: data, ora e meteo


<p>Enjoy!</p>

---

## ☕ Vuoi darmi una mano?

Il contenuto di questa pagina è completamente gratuito e lo scopo non è certamente fare soldi. Se vuoi darmi una mano per le spese e il tempo perso, ecco alcuni modi:

| | |
|---|---|
| [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C713VTGJ) | Offrimi un caffè su Ko-fi |
| [![PayPal](https://github.com/Simonz82/shared-assets/blob/main/paypal.svg)](https://www.paypal.com/paypalme/simongmail) | Una donazione libera su PayPal |
| [![Amazon](https://github.com/Simonz82/shared-assets/blob/main/Amazon_logo.png)](https://amzn.to/3XWWTgz) | Fai i tuoi acquisti Amazon partendo da questo link |

**Canali Telegram:**

| | |
|---|---|
| [![Home_Assistant_News](https://github.com/Simonz82/shared-assets/blob/main/home_assistant_news.jpg)](https://t.me/Home_Assistant_News) | Notizie dedicate a Home Assistant |
| [![Offerte Domotica](https://github.com/Simonz82/shared-assets/blob/main/offerte_domotica.jpg)](https://t.me/offerte_domotica_ita) | Offerte sui prodotti di domotica |

---

Sviluppato e curato da [Simonz82](https://t.me/Simonz82) · © 2026
