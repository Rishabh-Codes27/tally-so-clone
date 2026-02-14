import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "app.db"


def dump_table(cur: sqlite3.Cursor, table: str) -> None:
    rows = cur.execute(f"SELECT * FROM {table} ORDER BY id DESC").fetchall()
    columns = [d[0] for d in cur.description]
    print(f"\n{table} ({len(rows)} rows)")
    for row in rows:
        item = dict(zip(columns, row))
        # Pretty-print JSON columns if present
        for key in ("blocks", "data"):
            if key in item and item[key] is not None:
                try:
                    item[key] = json.loads(item[key])
                except (TypeError, json.JSONDecodeError):
                    pass
        print(json.dumps(item, indent=2, default=str))


def main() -> None:
    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()

    tables = cur.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).fetchall()
    print("Tables:", [t[0] for t in tables])

    for (name,) in tables:
        if name.startswith("sqlite_"):
            continue
        dump_table(cur, name)

    conn.close()


if __name__ == "__main__":
    main()
