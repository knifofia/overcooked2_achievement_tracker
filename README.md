# Overcooked! 2 – Achievement Tracker

A web page that shows your progress on Overcooked! 2's counter-based achievements, which neither Steam nor the game displays.

**👉 [Open the page](https://knifofia.github.io/overcooked2_achievement_tracker/)**

## Usage

1. Find your save folder: `%USERPROFILE%\AppData\LocalLow\Team17\Overcooked2\<SteamID64>\`. The folder name is your SteamID64 (17 digits).
2. On the page, choose `Meta_SaveFile.save` and enter your SteamID64.
3. Click "Show progress".

## Privacy

Everything is computed in your browser (WebCrypto). The file is never uploaded and the page never modifies your save. The code is in `index.html` and `app.js`.

## Tracked achievements

| Achievement | Goal |
|---|---|
| Soaker Cola | Wash 150 dirty plates or glasses with the water gun |
| Heat and Greet | Use the Bellows on BBQs 500 times |
| Tree Hater | Burn 300 pieces of wood |
| Backpack Hijack | Take 500 items from a backpack |
| Coal of Duty | Burn 300 buckets of coal in the furnace |
| Heads Will Roll | Chop 500 ingredients using the guillotine |

All other statistics stored in the save are available in the "All statistics" section.

## Credits and disclaimer

The save encryption format was documented by the community, notably in [OC2SaveDecryption](https://github.com/WTassoux/OC2SaveDecryption). Unofficial fan-made tool, not affiliated with Team17, Ghost Town Games or Valve.
