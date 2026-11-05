# MusicXML test fixtures

Real-world choir scores from the [Choral Public Domain Library (CPDL)](https://www.cpdl.org),
used for manual and automated testing. Each file was picked because it covers
a specific edge case that ChoirMate has to handle.

Only freely licensed scores belong here, because this repository is public.
Copyrighted scores, or scores without permission to redistribute, go into
`../private/`, which is ignored by Git.

| File | Work | Composer / arranger | Source | Exported by | License | Edge cases |
| -------------------------------------- | ----------------------- | --------------------------------------- | ------------------------------ | --------------- | ------------ | ---------------------------------------- | ----------------------- | --------------------------------------- | -------------------------------| --------------- | ------------ |
| `tallis-if-ye-love-me-satb.mxl` | If ye love me | Thomas Tallis | CPDL | MuseScore 3.4.2 | CPDL License | Baseline: SATB on 4 staves, tenor in treble-8 clef, repeat |  
| `rheinberger-abendlied-ssattb.mxl` | Abendlied, Op. 69 No. 3 | Josef Rheinberger | CPDL | MuseScore 3.6.2 | CPDL License | 6 voices (SSATTB) on 6 staves |  
| `silcher-aennchen-von-tharau-satb.mxl` | Ännchen von Tharau | Friedrich Silcher | CPDL | MuseScore 3.6.2 | CPDL License | 3/4 time; **tenor in plain treble clef without octave shift** (sounds an octave too high if read literally) |  
| `silcher-muss-i-denn-satb.mxl` | Muß i denn | Friedrich Silcher, arr. Philipp Wolfrum | CPDL | Finale 27.4 | CPDL License | 2/4 time; **pickup measure not marked as implicit** (numbered as measure 1); repeats; 16th notes; no lyrics; extra part file inside the `.mxl`
| `silcher-frisch-gesungen-satb.mxl` | Frisch gesungen | Friedrich Silcher | CPDL #48365, ed. Nikolaus Hold | MuseScore 2.1.0 | CC BY-NC 3.0 | **S+A and T+B share a staff** (separated as voice 1 and 2) |  
| `mendelssohn-beati-mortui-ttbb.mxl` | Beati mortui, Op. 115/1 | Felix Mendelssohn Bartholdy | CPDL #46600, ed. Nikolaus Hold | MuseScore 2.1.0 | CC BY-NC 3.0 | Men's choir (TTBB) on 4 staves, two tenors in treble-8 clef; **pickup measure correctly marked as implicit** (measure 0) |

## Not covered yet

- Export from Sibelius or Dorico
- Uncompressed `.musicxml` file
- Time signature change within a piece
