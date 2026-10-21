# Font backup (2026-10-21)

Full Font Awesome 6 + Red Hat `.woff` copies before subset / woff2 migration.

## Active setup (after migration)

- Subset CSS: `static/css/fontawesome-subset.min.css`
- Subset fonts: `static/webfonts/subset/*.woff2`
- Full FA left in place: `static/css/fontawesome-all.min.css` + `static/webfonts/fa-*.woff2`
- Red Hat `.woff2` added next to existing `.woff` (`.woff` kept as fallback)

## Rollback (no file restore needed)

In `config.toml`:

```toml
useFontAwesomeSubset = false
```

That loads the full `fontawesome-all.min.css` and original webfonts again.

## Hard restore from this backup

```bash
cp themes/yaub/static/_font-backups/2026-10-21/css/fontawesome-all.min.css \
   themes/yaub/static/css/
cp themes/yaub/static/_font-backups/2026-10-21/webfonts/* \
   themes/yaub/static/webfonts/
cp themes/yaub/static/_font-backups/2026-10-21/fonts/* \
   themes/yaub/static/fonts/
```

## Rebuild subset after adding icons

1. Append icon name (without `fa-`) to `themes/yaub/fa-icons-used.txt`
2. `python3 scripts/build-fontawesome-subset.py`
