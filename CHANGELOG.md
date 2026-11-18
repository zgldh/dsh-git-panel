# Changelog

Notable changes to the Git panel bundle, newest first. Versions follow SemVer;
the market index pins each release to the commit that changed the package
payload, so a release tag and an index entry always describe the same code.

Each release lists what changed from the reader's side: features under `Added`,
moved or reshaped behaviour under `Changed`, corrected behaviour under `Fixed`.

## Unreleased

- Nothing yet.

## 1.4.3

### Added

- Commit-file diff tabs: an "open the whole file" button that opens the file in
  the Sidebar's built-in text preview.

## 1.4.2

### Fixed

- The split/unified toggle rotates its icon when side-by-side is active, instead
  of always showing the same orientation.

## 1.4.1

### Changed

- The expanded commit detail attaches to its row: no top border and square top
  corners, so it reads as one surface with the expanded commit.

## 1.4.0

### Added

- The commit graph loads older commits when scrolled to the bottom, with a
  loading row and a retry row.
- Commit-file diff tabs are address-driven: the repository, commit, and file are
  encoded in the tab's resource URL, so the tab restores after a page reload.

## 1.3.0

### Added

- Commit-file diffs open in the right Sidebar, mirroring the Harness review
  tab: syntax highlighting, old/new line numbers, add/delete gutters, split or
  unified layout, and line wrapping.
- The source-control pane can be dragged down to 160px.

## 1.2.1

### Fixed

- The AI toolbar glyph sits on the same centre line as its label.

## 1.2.0

### Changed

- Graph lanes keep fixed columns: continuing lines stay straight, merges and
  joins are short diagonals, and a new branch takes the leftmost free column.

## 1.1.0

### Added

- A cascading repository picker that probes one directory level at a time.
- Commit times rendered with the browser's own date and time format.
- Branch and tag labels coloured by their commit's lane.

### Fixed

- Expanded commit details keep the graph lanes running beside them.

## 1.0.1

- First market-indexed release of the bundle.
