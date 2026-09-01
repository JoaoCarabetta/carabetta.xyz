# Brazil dots

Dot-density map of race in Rio de Janeiro (Censo 2022 / IBGE). Live at `/dataviz/brazildots/`.

Tiles come from `tileserver-gl-light` in Docker (`docker-compose.yml`), reading `data/censo2022.mbtiles`. Nginx proxies `/dataviz/brazildots/tiles/{z}/{x}/{y}.pbf` to `127.0.0.1:8088/data/censo2022/...`. Host port 8080 is already used by another container on this VPS.

Copy `mapbox-token.js.example` to `mapbox-token.js` and set a public Mapbox token. That file is gitignored (GitHub blocks `pk.` tokens) but `./deploy.sh` rsyncs it.

```sh
# refresh the MBTiles from the dotmap repo, then deploy
cp ../../dotmap/data/tiles/censo2022.mbtiles data/censo2022.mbtiles
# from the carabetta.xyz repo root:
./deploy.sh
```

Gotchas (the map was empty until these were fixed):

- Mapbox GL JS workers resolve relative tile URLs against a `blob:` origin — use `window.location.origin + '/dataviz/brazildots/tiles/{z}/{x}/{y}.pbf'`.
- A cached Mapbox style can fire `load` during `new mapboxgl.Map()`. Register `load` / `style.load` immediately and call the adder if `map.loaded()` is already true.
- Host port 8080 is taken on this VPS; the compose file binds `127.0.0.1:8088`.
