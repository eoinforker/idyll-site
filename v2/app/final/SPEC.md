# Idyll app, final design spec

For the iOS (SwiftUI) and Android (Jetpack Compose) builds. Written 11 October 2026.

**Reference files**
* `final.html` shows all 11 screens in two rows: dark above, light below.
  * `?mode=dark` or `?mode=light` keeps one row; `?only=N` shows one screen.
  * Preview it over a local server from the `idyll-site` root, because the halftone needs same-origin images. For example: `python3 -m http.server`, then open `/v2/app/final/final.html`.
* PNGs: `png/dark/` and `png/light/`, 1170 x 2532 (3x of 390 x 844 pt). The two-row board is `png/00-board.png`.
* Assets: `assets/`. `export-assets.html` regenerates the halftones (see section 7).

**Design rules**
* Direction C (Night) is the master.
* Light mode mirrors it screen for screen: the same layouts, sizes, spacing and hierarchy, recoloured in the site's paper and ink.
* The app follows the phone's appearance setting, with no in-app override:
  * iOS: do not set `preferredColorScheme`.
  * Android: use `isSystemInDarkTheme()`.
* Focus running is the magenta plate in both modes.

All sizes are in points (iOS pt = Android dp; text in sp). The canvas is 390 x 844, with a top safe area of 54 and a bottom safe area of 34.

---

## 1. Colour tokens

Use the flattened hex values natively. The rgba column shows how each one was derived (cream or ink over the background).

| Token | Dark | Light | Used for |
|---|---|---|---|
| `bg` | `#141416` night | `#f6f5f1` paper | Screen background, browser chrome, overlay card |
| `surface` | `#1f1f22` | `#ffffff` | Brand mark tile |
| `fg` | `#fff6ee` cream | `#161514` ink | Text, icons, chart bars, selected chips |
| `soft` | `#a6a09c` (cream 62%) | `#5b5853` | Secondary text, labels, placeholders |
| `hairline` | `#333132` (cream 13%) | `#d7d6d2` (ink 14%) | Row separators, bar separators |
| `track` | `#2c2b2c` (10%) | `#e4e3df` (8%) | Per-app bar track |
| `trackStrong` | `#353434` (14%) | `#dbdad6` (12%) | Allowance bar track, Sleep timeline track |
| `primaryBg` | `#d81b7a` magenta | `#161514` ink | Primary button |
| `primaryFg` | `#fff6ee` | `#fff6ee` | Primary button label |
| `line` | `#dcd4ce` (cream 85%) | `#161514` | Secondary button border |
| `tileEdge` | `#302f30` | `#d2d1ce` | 1 pt inner edge of brand tiles |
| `fieldBg` | `#222223` | transparent | Paste a link field |
| `fieldEdge` | `#353434` | `#b3b2af` | Paste a link field border |
| `cardEdge` | `#565352` | `#161514` | First-run overlay border |
| `crop` | `#b8b2ad` | `#161514` | Crop marks and the rule inside crop boxes |
| `boxEdge` | `#5a5857` | `#aeadaa` | Unpicked checkbox, off weekday |
| `switchOff` | `#3e3d3d` | `#d2d1ce` | Switch track when off |
| `chevron` | `#726e6c` | `#9c9b99` | Row chevrons |
| `magenta` | `#d81b7a` | `#d81b7a` | Full stops, checks, switch on, today bar, Sleep span, plate, tag |
| `blue` | `#2d5bff` | `#2d5bff` | The strike through removed things, the halftone water |
| `cream` | `#fff6ee` | `#fff6ee` | Type and dots on the plate |
| `plate` | `#d81b7a` | `#d81b7a` | Plate background (Hello in light, Focus in both) |

**Text on magenta**
* Text on the plate is cream.
* A full stop on the plate is ink `#161514`, as a second ink.
* A full stop anywhere else is magenta.

**Contrast**
* Body `fg` on `bg` passes AAA in both modes.
* `soft` on `bg` is about 7:1 in dark and 6.5:1 in light.
* Cream on magenta is about 4.5:1, which just passes AA, so keep plate text at 14 pt or larger.

## 2. Type

**Families**
* Timeless Sans VF: `fonts/TimelessSansVF.woff2` in the site repo. It needs converting to TTF or OTF for the apps.
* Paper Mono VF: `fonts/PaperMonoVF.woff2`, under the OFL (`fonts/PaperMono-OFL.txt`).
* **Open question:** check that Timeless Sans's licence allows embedding in an app before shipping.
* The status bar is the system's own; do not draw it.

**Rules for all roles**
* Tabular figures for every number: SwiftUI `.monospacedDigit()`, Compose `fontFeatureSettings = "tnum"`.
* Sentence case everywhere.
* Paper Mono is used only for the small `label` role. Never all caps.

| Role | Family, weight | Size | Line height | Tracking | Where |
|---|---|---|---|---|---|
| `display` | Sans 500 | 88 | 79 (0.9) | -0.06 em (-5.3 pt) | "Idyll." on Hello |
| `hero` | Sans 500 | 96 (Sleep), 84 (Support) | 0.9 / 0.86 | -0.055 em / -0.06 em | Centred hero headlines |
| `countdown` | Sans 500, tabular | 104 | 104 | -0.06 em (-6.2 pt) | Focus timer |
| `titleL` | Sans 500 | 48 | 49 | -0.045 em (-2.2 pt) | That's Idyll, This week |
| `titleM` | Sans 500 | 38 | 39 | -0.045 em (-1.7 pt) | Which ones, Instagram, What Idyll connects to |
| `numeralL` | Sans 500, tabular | 50 (Home), 52 (Sleep) | 1.0 | -0.05 em | 18 of 30 min, 23:00 |
| `numeralM` | Sans 500, tabular | 30 | 30 | -0.035 em | 3 h 24 min |
| `heading` | Sans 500 | 21 | 25 | -0.02 em | Focus until 15:20 |
| `noteTitle` | Sans 500 | 18 | 22.5 | -0.02 em | Overlay title |
| `button` | Sans 500 | 18 (16 inside tip and price buttons) | 18 | -0.01 em | Buttons |
| `wordmark` | Sans 600 | 20 | 20 | -0.02 em | "Idyll." in the Home header |
| `body` | Sans 400 | 17 | 24.5 (1.45) | 0 | Body, row labels |
| `bodyStrong` | Sans 500 | 17 | 24.5 | 0 | Row titles (Home apps, chapters) |
| `link` | Sans 400 | 16 | 16 | 0 | Text links, nav back label |
| `small` | Sans 400 | 14 (15 in the overlay) | 20.3 (1.45) | 0 | Secondary lines |
| `caption` | Sans 400 | 13 | 18.2 (1.4) | 0 | Button sublines, field hint |
| `label` | Paper Mono 400 | 11.5 (13 for Sleep weekdays) | 13.8 | +0.03 em (+0.35 pt) | Today in the real apps, Gone, Stays, chart axes |

**Native tracking and line height**
* SwiftUI: `.tracking(pt)`, with pt = em x size.
* Compose: `letterSpacing = (-0.06).em`.
* Compose: `lineHeight` in sp, with `LineHeightStyle(Alignment.Center, Trim.None)`.
* SwiftUI has no absolute line height. Use `lineSpacing(lineHeight - font.lineHeight)` in a small `IdyllText` modifier.

**Dynamic Type and font scale**
* These roles scale up to accessibility XL: `body`, `bodyStrong`, `small`, `caption`, `label`, `link` and `button`.
* Display, hero, countdown and title roles scale to at most 1.2x and may wrap.

## 3. Spacing, radii, borders, shadow

**Spacing scale:** 4, 8, 12, 16, 20, 24, 28, 34. Odd values on the screens (10, 14, 18, 22, 26) are optical tweaks of the nearest step; keep them where `final.html` uses them.
* Side margin: 24 everywhere. The overlay card uses 16.
* Content starts under the status bar (54). A nav bar is 44 tall.
* The footer block (primary button plus link) sits 8 above the bottom safe area. A button and the link under it are 6 apart.
* Row heights: 48 for the pick list, 50 for switch rows, 44 for check rows, 54 for the Home app rows, 64 for tip rows.

**Radii**
* 0 for buttons, fields, cards, crop boxes, weekday chips and the tag. The square edge is part of the print look; keep it.
* Brand tiles: 10 at 40 pt, 8 at 30 pt.
* Chart bars: 4 on the top corners only.
* Switch: capsule.

**Borders**
* Hairline: 1 pt `hairline`.
* Secondary button: 1.5 pt `line`, drawn inside.
* Overlay card: 1 pt `cardEdge`.
* Field: 1 pt `fieldEdge`.
* Crop marks: four corners, each two 11 pt arms of 1 pt `crop` (cream on the plate).

**Hard offset shadow** (the site's "window")
* 6, 6 offset with no blur: magenta in dark, ink in light.
* No final screen uses it now that site settings is a list. Keep the token for later windows.
* There are no soft shadows, gradients or blurs anywhere.

## 4. Components

### Buttons
* **Primary**
  * Full width (342) by 56. Fill `primaryBg`, label `primaryFg` in the `button` style.
  * The Home variant is 64 tall with a `caption` subline ("50 min") at 80% opacity.
* **Secondary**
  * Transparent, with a 1.5 pt inner border in `line` and the label in `fg`.
  * Sizes: full width by 56 (Stop Focus), half width by 64 (Post Mode), and a third of the width by 64 (tips, price on top, `caption` name under it in `soft`).
* **On the plate:** the secondary button turns cream, with a cream border and cream label (Stop Focus).
* **Text link**
  * `link` style, underlined 1 pt with a 0.2 em offset, centred in a 44 tall hit area.
  * Plain text otherwise (How it works, Just show me, Not now, Add 10 minutes, Change, Paste).
* **States**
  * Pressed: 82% opacity for 90 ms. No scale and no ripple colour change; on Android use `indication = null` and handle the press yourself.
  * Disabled: 35% opacity and not tappable. Next on Pick is disabled until one app is picked.
  * Focus (keyboard, Switch Control, TV): a 2 pt magenta outline offset by 3. On a magenta button use a cream outline.

### Brand mark tile
* Sizes: 40 with a 22 mark (Home rows, the settings title) or 30 with a 16 mark (lists). Corner radius 10 or 8.
* The tile has a 1 pt `tileEdge` inner stroke.
* Marks are the official ones from Simple Icons (CC0), unmodified, in `assets/brands/*.svg`.
* **Light mode:** `surface` (white) tile, mark in its official colour:
  * YouTube `#FF0000`, Facebook `#0866FF`, Reddit `#FF4500`, LinkedIn `#0A66C2`.
  * Instagram, X, TikTok and Threads `#000000`. Instagram uses its official black glyph, because its pink would clash with ours.
  * Snapchat: a `#FFFC00` tile with the ghost filled white and a 1.1 unit black stroke (in the 24 unit viewBox).
* **Dark mode:** `surface` `#1f1f22` tile, mark filled cream. Snapchat's tile is not yellow in dark mode.
* **Native import**
  * iOS: Xcode asset catalog, "Preserve Vector Data". Render as a template and tint per mode, except Snapchat light, which is two layers.
  * Android: convert to VectorDrawable and tint.
* Never use generic icons for the sites.

### Pick row (screen 2)
* 48 tall: tile 30, 14 gap, label `body`, and a checkbox at the trailing edge.
* Unpicked: a 24 square with a 1.5 pt `boxEdge` inner border.
* Picked: a magenta 24 square with a cream check (18 pt, stroke 2.4).
* The whole row is the hit target.

### Switch row and the Gone struck item (screen 6)
* 50 tall: label `body`, native switch at the trailing edge, hairline under each row and over the first.
* **Switch:** 51 x 31. Track magenta when on, `switchOff` when off; white knob.
  * SwiftUI: `Toggle` with `.tint(magenta)`.
  * Compose: `Switch` with `checkedTrackColor = magenta`, `uncheckedTrackColor = switchOff`, and `uncheckedBorderColor = Transparent`.
* **On means removed:**
  * The label carries the strike, and VoiceOver or TalkBack reads "Reels, hidden. Switch, on".
  * When switched off, the strike lifts and the label is plain ("Comments under reels" in the mock shows the off state).
* **The strike**
  * A `blue` bar 0.22 em thick (3.7 pt at 17 pt), running from 3 pt before the text to 3 pt after it.
  * Centred vertically on the text box, rotated by -1.4 degrees and moved 1 pt right.
  * When switched on, it draws left to right over 420 ms with an ease-out cubic curve. This "ink landing" is the app's only flourish. With Reduce Motion on, it appears instantly.
* The same strike is used, without a switch, on the overlay's struck words and on Privacy's "Nothing else" list.
* **Stays list:** 44 tall rows, label `body`, and a magenta check (24, stroke 2.2) at the trailing edge. Not interactive.

### Plate and the halftone cygnet
* **Plate**
  * `plate` magenta, edge to edge, with cream crop marks inset 12 from the sides (on Focus, 52 from the top and 46 from the bottom).
  * The site adds a faint paper grain: fractal noise multiplied at 50%. It is optional natively. If used, ship it as a 240 pt tiling noise PNG at 50% multiply and keep it barely visible.
* **Where it appears**
  * Hello in light mode: a 342 x 236 block holding the 300 pt cygnet. In dark mode the cygnet sits on the bare night background at the same size and position.
  * Focus in both modes: the whole screen.
* For the cygnet assets and how to render them, see section 7.

### Home logo (screen 5)
* `assets/icon/cygnet-mark.svg` as a template image at 34 x 20 in `fg`, then a 10 gap, then "Idyll" in `wordmark` with a magenta full stop.
* It replaces the app icon tile.
* Settings sits at the trailing edge as a text link.

### Tag (the site's "Coming soon" tag)
* A magenta block with Paper Mono 12 cream text, padded 5 top, 4 right, 5 bottom, 9 left.
* It is followed directly by the halftone edge, `assets/icon/tag-edge.svg` at 26 x 22: 14 magenta dots shrinking to the right.
* Uses:
  * "Free, for good" on Hello.
  * "Idyll" on the first-run overlay, sitting on its top edge (12 up, 14 in).

### Focus countdown (screen 7)
* `countdown` style, cream on the plate, centred under the cygnet with a 34 gap.
* `heading` "Focus until 15:20" with an ink full stop.
* Under that, three 34 pt struck halftone marks of the paused apps, cream with blue strike, 12 apart (assets in section 7), then the `small` line "Paused in the real apps. Idyll still works."
* Update once a second.
* Stop Focus is the on-plate secondary button; Add 10 minutes is a text link.
* Status bar and home indicator are light (cream) in both modes.

### Week chart (screen 9)
* One series, honest numbers, no goals.
* **Geometry**
  * Seven equal columns across 342. The chart is 140 tall, including 24 of headroom for the value labels.
  * Each bar is 40% of its column, centred, with a 4 radius on the top corners only, sitting on a 1 pt baseline rule in `soft`.
* **Colour:** bars in `fg`; today's bar in magenta.
* **Labels**
  * Only the week's peak and today get a value, in `label` style 6 above the bar. Today's value is magenta.
  * Weekday initials in `label` `soft`, with "Today" for the last day.
* Accessibility: each bar is one element, for example "Tuesday, 41 minutes"; offer the numbers as a list too.
* **Per-app rows** (under the chart)
  * Tile 30, name `body` (fixed 92 wide), a 4 pt bar (`track` with an `fg` fill, scaled to the largest app), then the time in `small` tabular, right aligned and 54 wide.

### Nav bar
* 44 tall: chevron (24, stroke 1.7) plus the `link` label of the parent ("Home", "Settings"), 10 from the leading edge.
* No title in the bar; the screen title sits below it.
* Swipe back works as normal.

### Clean browser chrome (screen 3)
* **Top bar,** 44 tall on `bg` with a hairline under it:
  * Leading: the cygnet mark (30 x 18, template, `fg`) in a 44 hit area. It goes Home.
  * Centre: the site name in Sans 500 16.
  * Trailing: a sliders icon that opens that site's settings (screen 6).
* **Bottom toolbar,** 49 tall plus the 34 safe area, on `bg` with a hairline above it: back, forward (30% opacity when unavailable), share and reload. Icons are 24 with stroke 1.7, in 44 hit areas.
* **Site theme:** load the site's own colour scheme to match the phone. In dark mode, send `prefers-color-scheme: dark` so YouTube renders dark. Reddit has no dark web theme signed out, which is fine.

### First-run overlay (screen 3)
* **Card**
  * 16 from each side, its bottom 148 above the screen bottom, so it clears the site's own bottom bar and the toolbar.
  * Fill `bg`, 1 pt `cardEdge` border, padding 30 top, 18 sides, 14 bottom.
* **Contents**
  * The tag "Idyll" on the top edge.
  * `noteTitle` "This is YouTube in Idyll" with a magenta full stop.
  * A 15 pt body line.
  * A row with the struck words (Shorts, ads, Up next) in `soft` on the left and an "OK" link on the right.
* **Behaviour**
  * Shown once per site.
  * Folds away after 6 seconds or on OK: height and opacity to 0 over 240 ms.
* Copy for each site is in the onboarding spec, section 3.

### Field (Paste a link)
* 52 tall: `fieldBg` fill with a 1 pt `fieldEdge` inner border.
* Inside: a 20 link icon in `soft`, the placeholder "Paste a link" in 16 `soft`, and a trailing "Paste" text link.
* The `caption` hint sits under it with an 8 gap.

### Sleep timeline (screen 8)
* Two times in `numeralL` 52 with "to" between them in `soft`. Tapping a time opens the native wheel picker in a sheet.
* **Track:** 6 tall in `trackStrong`, spanning 18:00 to 12:00 the next day.
  * The magenta span runs from bedtime to morning.
  * Axis labels in `label` `soft` at 18:00, 00:00, 06:00 and 12:00.
* **Weekdays:** a row of Paper Mono 13 labels in `fg`. Off days are at 35% opacity; tap to toggle.
* **Apps to rest row**
  * `body` label, then a dotted leader (1.5 pt dotted `fg` at 55%), then 22 pt marks in `fg` (single colour), then a "Change" link.
  * Hairlines above and below the row.
  * "Change" opens Apple's FamilyActivityPicker.

### Support tips (screen 11)
* Three equal secondary buttons (64 tall, 10 apart) showing the App Store price and the tip's name.
* Then "Paid through Apple. Idyll never learns who you are." in `small` `soft`, centred.
* The support cygnet (120 pt) sits at the bottom left, above a footer line: a hairline on top, "Idyll. Social without the scroll." on the left and a "Tell a friend" link (opens the share sheet) on the right.
* No confetti and no thank-you sheet. After a purchase, change the line to "Thank you." in place.

## 5. States, motion, accessibility

**States** (same in both modes)
* Pressed: 82% opacity.
* Disabled: 35% opacity.
* Focus: a 2 pt magenta outline (cream on magenta fills).
* Selected (pick, weekday): as drawn.

**Motion**
* There is only one flourish: the blue strike drawing on, plus optionally the halftone dots growing in on Hello and Focus (section 7).
* Everything else uses system transitions.
* Respect Reduce Motion: no strike animation and no dot growth.

**Hit targets and announcements**
* Every hit target is at least 44 x 44, including the 30 pt tiles, which sit inside full-row targets.
* Struck items are announced as hidden; Stays items as kept.
* The halftone cygnet is decorative (`accessibilityHidden` / `contentDescription = null`). Struck marks on Focus are announced with the line next to them.

**Sample numbers**
* The "Sample numbers" labels exist only in the mockups.
* In the app, show only the source line ("Screen Time's count" on iOS, "Android's count" on Android).
* Show only measured numbers, never projections.

## 6. Screens

These are the differences per screen. The layout, sizes and copy are in `final.html`.

1. **Hello:** C's layout.
   * The tag at the top, then the cygnet: bare in dark, on a 342 x 236 plate in light.
   * "Idyll." in `display`, body, the small print "No account. Idyll collects nothing."
   * Primary Start and the "How it works" link, which opens a sheet with the copy from the onboarding spec.
2. **Pick your apps:** nine rows in this order: YouTube, Instagram, Facebook, X, Snapchat, TikTok, Reddit, LinkedIn, Threads.
   * Next is disabled until one app is picked.
   * "Just show me" picks YouTube and continues.
   * On Android, apps installed on the phone show "On this phone" in `caption` and come ticked.
3. **First clean app:** see browser chrome and first-run overlay above.
4. **That's Idyll:**
   * The 84 pt cygnet (cream in dark, ink in light), the `titleL` title and the body.
   * Five rows (`bodyStrong` title, `small` `soft` line, chevron), then the primary button "Go to Idyll".
   * On Android the rows are those in the onboarding spec, Part 4.
5. **Home:**
   * Header: the logo and Settings.
   * Allowance: "Today in the real apps" `label`, then "18 of 30 min" in `numeralL` 50 with "of 30 min" in `soft`, then a 4 pt `trackStrong` bar with an `fg` fill, then a `label` source line.
   * App rows at 54 tall with tile 40.
   * Focus (primary) and Post Mode (secondary).
   * The field.
   * Footer row: a 26 pt glint cygnet with "Resting from 23:00" (shown only if Sleep is set), and "Free, for good." on the right.
   * If no allowance is set, the allowance block becomes one quiet row: "Time in the real apps: off" plus a link.
   * The "Set up" list from screen 4 can sit above the footer until dismissed (not shown in this mock).
6. **A site's settings:**
   * Tile 40 plus the `titleM` title.
   * `label` "Gone", the `small` line "Switch one off to bring it back.", then the switch rows.
   * `label` "Stays", then the check rows.
   * Footer links: "Open the real Instagram" and "Sign out" (`soft`).
   * Same in both modes.
7. **Focus running:** the full plate in both modes. See Focus countdown above.
8. **Sleep:**
   * The `hero` 96 "Sleep." centred, a centred `soft` body, then the timeline block.
   * Primary Save and a "Not now" link.
   * Reached from Home or from the chapter list. If Screen Time access is missing, ask for it first, using the copy in the onboarding spec.
9. **Hours:**
   * `titleL`, the total in `numeralM`, the `small` source line, the chart, the per-app rows.
   * Footer in `small` `soft`: "Idyll reads these from Screen Time when you open this page. It doesn't keep them."
10. **What Idyll connects to:**
    * A crop-marked box with two entries, separated by a `crop` rule at 60%.
    * `label` "Nothing else", then the struck words in `body`, then the `small` note.
    * The link "Read the privacy policy" opens the policy page in the clean browser.
11. **Support Idyll:** D's design.
    * The `hero` 84 "Free. For good." centred, with magenta full stops.
    * Body, then "Tips unlock nothing.", then the three tip buttons, the Apple line, the cygnet and the footer line.
    * Tips are consumable in-app purchases. They unlock nothing, and there is no restore.

## 7. The halftone, natively

**Recommended: pre-rendered PNGs** with transparent backgrounds, rendered by the site's own halftone code (`../kit.js`). They are in `assets/cygnet/` and `assets/halftone-marks/` at @2x, @3x and @4x.
* iOS: @2x and @3x in an image set.
* Android: @2x goes in `drawable-xhdpi`, @3x in `drawable-xxhdpi`, @4x in `drawable-xxxhdpi`.
* Draw them at the point size given and never tint them. The water layer is a second colour.

| Asset | pt size | Inks | Used |
|---|---|---|---|
| `cygnet-hello-cream` | 300 x 178 | cream dots, blue water | Hello (night in dark, on the plate in light) |
| `cygnet-focus-cream` | 330 x 196 | cream dots, blue water | Focus, both modes |
| `cygnet-support-{cream,ink}` | 120 x 71 | cream (dark) or ink (light), no water | Support footer |
| `cygnet-chapters-{cream,ink}` | 84 x 50 | cream or ink, no water | That's Idyll |
| `cygnet-glint-{cream,ink}` | 26 x 16 | cream or ink, no water | Home "Resting from" line |
| `mark-struck-{brand}-cream` | 34 x 34 | cream dots, blue strike | Focus paused apps (all nine brands) |

* To regenerate, serve the site root and run Chrome headless with `--dump-dom` on `final/export-assets.html`. Then decode the JSON in `#out`. The tool is also documented in the file's header comment.
* Other files in `assets/`:
  * `assets/icon/app-icon-H2.png`: the app icon source (512 px).
  * `assets/icon/cygnet-mark.svg`: the solid cygnet, for the logo and browser chrome.
  * `assets/icon/tag-edge.svg`
  * `assets/brands/`

**Optional: a Canvas port,** if we later want the dots to grow in on Hello or Focus. This is the algorithm, ported from the site.

1. Rasterise `cygnet-mark.svg` (viewBox 640 x 380) to an alpha bitmap at the target pixel size. Apply a Gaussian blur of `cell * 0.45` px.
2. **Cell size** in pt: `max(4.5, width / 120)`. Overrides: support 3.4, chapters 3, glint 1.6. Multiply by the screen scale.
3. **Cream layer**
   * Walk a grid rotated 45 degrees with pitch `cell`, centred on the bitmap.
   * At each point, `v = alpha x tone(u, v)`, where u and v are normalised x and y and `tone = 0.5 + 0.5 x min(1, 0.25 + 1.1u² + 0.6v)`. Use `tone = 1` for the struck marks.
   * Skip points where v < 0.05. Otherwise draw a dot of radius `cell x 0.56 x sqrt(min(v, 1))`.
4. **Water layer** (Hello and Focus only), drawn first:
   * Pitch `0.9 x cell`, grid rotated 15 degrees, offset +3 pt x and -2 pt y.
   * `tone = 0.45 x max(0, (v - 0.66) x 2.6)^1.4`, in `blue`.
5. **Struck marks**
   * Pitch `width / 22`, radius factor 0.58, image inset 10%, blur `cell x 0.15`, cream.
   * Then a `blue` line `0.1 x width` thick (butt caps) from (2 pt, 0.6h - 1.5 pt) to (w, 0.4h - 1.5 pt).
6. **Grow-in** (optional): each dot scales from 0 over 360 ms (ease-out cubic). The delay is `v x 315 + u x 585` ms plus a random 0 to 280 ms. The strike draws 700 ms after start over 420 ms. Skip it with Reduce Motion.

* SwiftUI: a `Canvas` that builds a `Path` of ellipses.
* Compose: `Canvas` with `drawCircle` in a loop, cached in `remember` (or `drawWithCache`).
* Draw once per size; never per frame, except during the grow-in.
