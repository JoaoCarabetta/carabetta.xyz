#!/usr/bin/env python3
"""Extract an MBTiles archive to static XYZ .pbf files.

MBTiles store TMS rows (Y origin at the bottom). Mapbox GL JS requests XYZ
(Y origin at the top), so we flip Y on write. Tippecanoe tiles are already
gzip-compressed; we keep that bytes as-is so nginx can send Content-Encoding: gzip.
"""

from __future__ import annotations

import argparse
import sqlite3
from pathlib import Path


def extract(mbtiles: Path, dest: Path) -> int:
    dest.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(mbtiles)
    rows = con.execute(
        "SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles"
    )
    count = 0
    for z, x, y_tms, data in rows:
        y_xyz = (2**z - 1) - y_tms
        path = dest / str(z) / str(x) / f"{y_xyz}.pbf"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        count += 1
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mbtiles", type=Path)
    parser.add_argument("dest", type=Path)
    args = parser.parse_args()
    n = extract(args.mbtiles, args.dest)
    print(f"wrote {n} tiles to {args.dest}")


if __name__ == "__main__":
    main()
