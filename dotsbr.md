---
title: "dotsbr — Brazil as census dots"
description: "National Census 2022 dot-density map of Brazil. Switch race and household income; one point per N people or households, from settlements to census tracts."
canonical_url: https://carabetta.xyz/dotsbr/
md_url: https://carabetta.xyz/dotsbr.md
last_updated: 2026-09-07
doc_version: "1.0"
---

# dotsbr — Brazil as census dots

National Census 2022 dot-density map of Brazil. Switch race and household income; one point per N people or households, from settlements to census tracts.

## What the map shows

dotsbr is a national Census 2022 dot-density map. The **race** view places one point per N people, colored by the race the person declared (parda, branca, preta, indígena, amarela). The **income** view places one point per N households, colored by the typical income of the household head in minimum wages. Death tiles exist in the pipeline but are hidden from the switcher.

## How to read a point

A point is not a precise home. At country scale, dots sit on settlements; up close they sit on census tracts. Zooming in lowers N so neighborhoods resolve. Filters and solo buttons isolate groups.

## Sources and method

- IBGE, Censo Demográfico 2022, aggregates by census tract.
- Treated copies also appear on [Base dos Dados](https://basedosdados.org/dataset/08a1546e-251f-4546-9fe0-b1e6ab2b203d).
- Frontend: MapLibre GL JS. Tiles: static PMTiles at `/dotsbr/data/tiles/*.pmtiles` (HTTP Range, no gzip).
- Code: [github.com/JoaoCarabetta/dotsbr](https://github.com/JoaoCarabetta/dotsbr).

## Controls

Switch Raça / Renda, search places, toggle legend rows, or solo a group. The live map is at [/dotsbr/](/dotsbr/). The old slug `/dataviz/brazildots/` 301s here.

## Portuguese

Mapa nacional de densidade de pontos do Censo 2022. Alterne raça e renda do responsável; um ponto a cada N pessoas ou domicílios, dos assentamentos aos setores.

## Sitemap

See the full [sitemap](/sitemap.md) for all pages.
