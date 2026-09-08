---
title: "Glossary — joão carabetta"
description: "Definitions for public data infrastructure, city platforms, dotsbr, PMTiles, and other terms used on this site."
canonical_url: https://carabetta.xyz/glossary.html
md_url: https://carabetta.xyz/glossary.md
last_updated: 2026-09-07
doc_version: "1.0"
---

# Glossary

Terms used on carabetta.xyz. Portuguese equivalents are in parentheses.

## public data infrastructure

*infraestrutura pública de dados*

Treated, documented, joinable public datasets and the warehouses, APIs, and governance that keep them usable — closer to a road than to a one-off portal dump.

## city platform

*plataforma de cidade*

Municipal software the public or the administration actually runs on: service centers, eligibility checks, health records, open-data sites, and the data lake behind them.

## Base dos Dados

*Base dos Dados*

A nonprofit public-data warehouse João co-founded. Brazilian tables are cleaned once, identifiers are standardized so they join, and anyone can query them on BigQuery.

## Escritório de Dados

*Escritório de Dados*

Rio de Janeiro's Data Office, founded under the mayor's cabinet. It built the municipal public datalake and the open storytelling site dados.rio.

## iplanrio

*iplanrio*

Rio's municipal technology company (founded 1979). It runs systems such as 1746, Carioca Digital, processo.rio, and health stacks. João was its president from 2025-01 to 2026-04.

## dotsbr

*dotsbr*

Interactive Census 2022 dot map of Brazil on this site. Race and household-income views; one point per N units, clustered at country scale and census-tract resolution up close.

## PMTiles

*PMTiles*

A single-file archive for map tiles that browsers Range-request. Gzip of the whole file breaks HTTP 206, so nginx serves /dotsbr/data/tiles/*.pmtiles uncompressed.

## census tract (setor censitário)

*setor censitário*

IBGE's smallest standard dissemination geography for the Demographic Census. dotsbr uses tract aggregates for close zooms and clustered settlements for the national view.

## Sitemap

See the full [sitemap](/sitemap.md) for all pages.
