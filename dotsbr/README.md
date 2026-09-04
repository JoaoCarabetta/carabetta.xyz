# dotsbr

National dot-density map of race and household income in Brazil (Censo 2022 / IBGE). Óbitos tiles exist but stay hidden in the UI switcher. Live at `/dotsbr/`. `/dataviz/brazildots/` 301s here.

Tiles are **static PMTiles** next to the page (`data/tiles/*.pmtiles`). The browser Range-requests them — no tileserver-gl. Nginx must send `Accept-Ranges: bytes` and must **not** gzip the `.pmtiles` body.

Copy `mapbox-token.js.example` to `mapbox-token.js` and set a public Mapbox token. That file is gitignored (GitHub blocks `pk.` tokens) but `./deploy.sh` rsyncs it.

```sh
# refresh the archives from the dotmap repo, then deploy
# (or set DOTMAP_TILES=/path/to/data/tiles)
# from the carabetta.xyz repo root:
./deploy.sh
```

Push to `main` also deploys (GitHub Actions). CI skips the ~700MB PMTiles upload and leaves whatever is already on the VPS.

Gotchas:

- `index.html` resolves archives as `data/tiles/{name}.pmtiles` relative to the page, so production URLs are `/dotsbr/data/tiles/…`.
- Gzip of a whole `.pmtiles` file breaks HTTP 206 and the map stays blank.
- The old Docker tileserver on `:8088` is stopped by `deploy.sh`.
