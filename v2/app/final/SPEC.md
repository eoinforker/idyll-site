# Idyll app, final design spec

For the iOS (SwiftUI) and Android (Jetpack Compose) builds. Updated 11 October 2026.

**Reference files**
* `final.html` shows the twelve screens in two rows (dark, then light), then the four riffs on the first-run sheet (dark, then light), then Home in the electric blue accent.
  * `?mode=dark` or `?mode=light` keeps one mode. Add `?only=N`: 1 to 12 are the screens, 13 to 16 the riffs, 17 blue Home.
  * Preview over a local server from the `idyll-site` root, because the halftone needs same-origin images. For example: `python3 -m http.server`, then open `/v2/app/final/final.html`.
* PNGs: `png/dark/` and `png/light/`, 17 each at 1170 x 2532 (3x of 390 x 844 pt). The whole board is `png/00-board.png`.
* Assets: `assets/`. `export-assets.html` regenerates them (see section 8).

**Design rules**
* Direction C (Night) is the master. Light mode mirrors it screen for screen in the site's paper and ink.
* Exceptions that are the same in both modes:
  * Focus running is the full plate.
  * The first-run sheet is the plate.
  * Sleep and Support use D's headlines.
* In light mode, Hello is a full-bleed plate.
* The app follows the phone's appearance setting, with no in-app light or dark override:
  * iOS: do not set `preferredColorScheme`.
  * Android: use `isSystemInDarkTheme()`.

All sizes are in points (iOS pt = Android dp; text in sp). The canvas is 390 x 844, with a top safe area of 54 and a bottom safe area of 34.

---

## 1. Colour tokens

### 1.1 Accent tokens (chosen in Settings, Appearance)

The accent is a user choice, independent of light and dark. These three tokens are the same in both modes.

| Token | Magenta accent (default) | Electric blue accent | Used for |
|---|---|---|---|
| `accent` | `#d81b7a` | `#2d5bff` | Full stops, checks, switch on, today bar, Sleep span, tag, primary button in dark, small halftone cygnets in light |
| `accentInk` (the second ink) | `#2d5bff` | `#d81b7a` | The strike through removed things, the water dots under large cygnets, the strike on struck marks |
| `plate` | `#d81b7a` | `#2d5bff` | Plate backgrounds: Hello in light, Focus, the first-run sheet and riffs |

The two inks swap places: with the blue accent, blue takes magenta's place and magenta becomes the strike and the water.

Cream on the plate is about 4.5:1 on magenta and 4.9:1 on blue. Keep plate text at 14 pt or larger.

### 1.2 Mode tokens

Use the flattened hex values natively. The rgba column shows how each one was derived.

| Token | Dark | Light | Used for |
|---|---|---|---|
| `bg` | `#141416` night | `#f6f5f1` paper | Screen background, browser chrome |
| `surface` | `#1f1f22` | `#ffffff` | Brand mark tile |
| `fg` | `#fff6ee` cream | `#161514` ink | Text, icons, chart bars, selected day chips |
| `soft` | `#a6a09c` (cream 62%) | `#5b5853` | Secondary text, labels, placeholders |
| `hairline` | `#333132` (cream 13%) | `#d7d6d2` (ink 14%) | Row separators |
| `track` | `#2c2b2c` (10%) | `#e4e3df` (8%) | Per-app bar track, Sleep timeline track |
| `trackStrong` | `#353434` (14%) | `#dbdad6` (12%) | Allowance bar track |
| `primaryBg` | `accent` | `#161514` ink | Primary button |
| `primaryFg` | `#fff6ee` | `#fff6ee` | Primary button label |
| `line` | `#dcd4ce` (cream 85%) | `#161514` | Secondary button border |
| `tileEdge` | `#302f30` | `#d2d1ce` | 1 pt inner edge of brand tiles |
| `fieldBg` | `#222223` | transparent | Paste a link field |
| `fieldEdge` | `#353434` | `#b3b2af` | Field border |
| `crop` | `#b8b2ad` | `#161514` | Crop marks, the rule in crop boxes, Sleep's divider |
| `boxEdge` | `#5a5857` | `#aeadaa` | Unpicked checkbox, off day chip |
| `switchOff` | `#3e3d3d` | `#d2d1ce` | Switch track when off |
| `chevron` | `#726e6c` | `#9c9b99` | Row chevrons |
| `smallMark` | `#fff6ee` cream | `accent` | Small halftone cygnets (section 4.6) |
| `cream` | `#fff6ee` | `#fff6ee` | Type and dots on the plate |
| `ink` | `#161514` | `#161514` | Full stop on the plate, primary button on the plate |

### 1.3 Onplate tokens

These apply to any screen printed whole on the plate: Hello in light mode, and Focus in both modes. They override the mode tokens.

| Token | Value |
|---|---|
| `bg` | `plate` |
| `fg` | `#fff6ee` |
| `soft` | cream at 82% |
| `primaryBg` | `#161514` ink |
| `primaryFg` | `#fff6ee` |
| `line` | `#fff6ee` |
| `crop` | `#fff6ee` |
| Full stop | `ink` |
| Tag | Cream block with `accent` text and cream dots |

On these screens the status bar and home indicator are light (cream). They are also light on screens where the sheet covers the bottom edge.

## 2. Type

**Families**
* Timeless Sans VF: `fonts/TimelessSansVF.woff2` in the site repo. It needs converting to TTF or OTF for the apps.
* Paper Mono VF: `fonts/PaperMonoVF.woff2`, under the OFL.
* **Open question:** confirm that Timeless Sans's licence allows embedding in an app.

**Rules for all roles**
* Tabular figures for every number: SwiftUI `.monospacedDigit()`, Compose `fontFeatureSettings = "tnum"`.
* Sentence case everywhere.
* Paper Mono only for the `label` role.

| Role | Family, weight | Size | Line height | Tracking | Where |
|---|---|---|---|---|---|
| `display` | Sans 500 | 88 | 79 (0.9) | -0.06 em | "Idyll." on Hello |
| `hero` | Sans 500, centred | 88 (Sleep), 84 (Support) | 0.9 / 0.86 | -0.055 em / -0.06 em | "Sleep.", "Free. For good." |
| `countdown` | Sans 500, tabular | 104 | 104 | -0.06 em | Focus timer |
| `titleL` | Sans 500 | 48 | 49 | -0.045 em | That's Idyll, This week, Appearance |
| `titleM` | Sans 500 | 38 | 39 | -0.045 em | Which ones, Instagram, What Idyll connects to |
| `reveal` | Sans 500, centred | 40 | 40 | -0.045 em | Riff 3 headline |
| `numeralL` | Sans 500, tabular | 48 (Sleep), 50 (Home) | 1.0 | -0.05 em | 23:00, 18 of 30 min |
| `numeralM` | Sans 500, tabular | 30 | 30 | -0.035 em | 3 h 24 min |
| `sheetTitle` | Sans 500 | 24 | 26.4 | -0.03 em | "This is YouTube in Idyll." |
| `heading` | Sans 500 | 21 | 25 | -0.02 em | Focus until 15:20 |
| `noteTitle` | Sans 500 | 18 | 22.5 | -0.02 em | Riff 2 title |
| `button` | Sans 500 | 18 | 18 | -0.01 em | Buttons |
| `wordmark` | Sans 600 | 20 | 20 | -0.02 em | "Idyll." in the Home header |
| `body` | Sans 400 | 17 | 24.5 | 0 | Body, row labels |
| `bodyStrong` | Sans 500 | 17 | 24.5 | 0 | Row titles |
| `link` | Sans 400 | 16 | 16 | 0 | Text links, nav back label |
| `small` | Sans 400 | 14 (15 on the sheet) | 20.3 | 0 | Secondary lines |
| `caption` | Sans 400 | 13 | 18.2 | 0 | Button sublines, field hint |
| `label` | Paper Mono 400 | 11.5 | 13.8 | +0.03 em | Gone, Stays, Accent, chart axes, Bedtime |

**Native tracking and line height**
* SwiftUI tracking in pt is em x size: `.tracking(-0.06 * 88)`.
* Compose takes em directly: `letterSpacing = (-0.06).em`.
* Compose: `lineHeight` in sp, with `LineHeightStyle(Alignment.Center, Trim.None)`.
* SwiftUI: wrap `lineSpacing(lineHeight - font.lineHeight)` in an `IdyllText` modifier.

**Dynamic Type and font scale**
* These roles scale up to accessibility XL: `body`, `bodyStrong`, `small`, `caption`, `label`, `link` and `button`.
* Display, hero, countdown, title and reveal roles scale to at most 1.2x and may wrap.

## 3. Spacing, radii, borders, shadow

**Spacing scale:** 4, 8, 12, 16, 20, 24, 28, 34. Intermediate values in `final.html` (10, 14, 18, 22, 26) are optical tweaks; keep them.
* Side margin: 24.
* A nav bar is 44 tall, under the 54 status bar.
* The footer block sits 8 above the bottom safe area. A button and the link under it are 6 apart.
* Rows: 48 pick, 50 switch, 44 check, 54 Home apps, 50 per-app hours.

**Radii**
* 0 for buttons, fields, crop boxes, day chips, swatches, the sheet and the tag. The square edge is part of the print look.
* Brand tiles: 10 at 40 pt, 8 at 30 pt.
* App icon previews: 22.5% (iOS squircle; on Android use the adaptive icon mask).
* Chart bars: 4 on the top corners only.
* Switch: capsule.

**Borders**
* Hairline: 1 pt `hairline`.
* Secondary button: 1.5 pt `line`, drawn inside.
* Field: 1 pt `fieldEdge`.
* Crop marks: four corners, each two 11 pt arms of 1 pt `crop`.
* Selected choice (Appearance): a 2 pt `fg` outline, 4 outside the item.

**Hard offset shadow** (the site's "window")
* 6, 6 offset with no blur: `accent` in dark, ink in light.
* Not used on the current screens; keep the token.
* There are no soft shadows, gradients or blurs anywhere.

## 4. Components

### 4.1 Buttons
* **Primary**
  * 342 x 56, fill `primaryBg`, label `primaryFg` in the `button` style.
  * The Home variant is 64 tall with a `caption` subline at 80% opacity.
* **Secondary**
  * A 1.5 pt `line` inner border with an `fg` label.
  * Sizes: full width by 56 (Stop Focus, using the onplate tokens), half width by 64 (Post Mode), a third of the width by 64 (tips, price on top, a 12 pt `soft` name under it).
* **Text link**
  * `link` style, underlined 1 pt with a 0.2 em offset, in a 44 tall hit area.
* **States** (same in both modes and on the plate)
  * Pressed: 82% opacity for 90 ms. No ripple tint; on Android use `indication = null`.
  * Disabled: 35% opacity. Next on Pick is disabled until one app is picked.
  * Focus (keyboard, Switch Control): a 2 pt `accent` outline offset by 3; cream when the fill is the accent.

### 4.2 Brand mark tile
* Sizes: 40 with a 22 mark, or 30 with a 16 mark. Corner radius 10 or 8. A 1 pt `tileEdge` inner stroke.
* Official marks from Simple Icons (CC0), unmodified, in `assets/brands/*.svg`.
* **Light mode:** `surface` tile, official colours:
  * YouTube `#FF0000`, Facebook `#0866FF`, Reddit `#FF4500`, LinkedIn `#0A66C2`.
  * Instagram, X, TikTok and Threads `#000000`.
  * Snapchat: a `#FFFC00` tile with a white ghost and a 1.1 unit black stroke.
* **Dark mode:** `surface` tile, mark in cream; Snapchat's tile is not yellow.
* **Native import**
  * iOS: Xcode asset catalog with Preserve Vector Data, template rendering, tinted per mode. Snapchat light is two layers.
  * Android: VectorDrawable, tinted.

### 4.3 Pick row (screen 2)
* 48 tall: tile 30, 14 gap, `body` label, and a 24 checkbox at the trailing edge.
* Unpicked: a 1.5 pt `boxEdge` inner border.
* Picked: an `accent` fill with a cream check (18, stroke 2.4).
* The whole row is the target.

### 4.4 Switch row and the Gone struck item (screen 6)
* 50 tall: `body` label, native switch at the trailing edge, hairlines between rows and above the first.
* **Switch:** 51 x 31, track `accent` when on and `switchOff` when off, white knob.
  * SwiftUI: `Toggle` with `.tint(accent)`.
  * Compose: `Switch` with `checkedTrackColor = accent`, `uncheckedTrackColor = switchOff`, and a transparent unchecked border.
* **On means removed.** The label carries the strike, and the screen reader says "Reels, hidden. Switch, on". Switched off, the strike lifts ("Comments under reels" shows the off state).
* **The strike**
  * An `accentInk` bar 0.22 em thick (3.7 pt at 17 pt), from 3 pt before the text to 3 pt after it.
  * Centred vertically on the text box, rotated by -1.4 degrees and moved 1 pt right.
  * When switched on it draws left to right over 420 ms with an ease-out cubic curve. This is the app's one flourish. With Reduce Motion on, it appears instantly.
* The same strike, without a switch, is used on the sheet's Gone list, on Riff 3, and on Privacy's "Nothing else".
* **Stays list:** 44 tall rows, `body` label, and an `accent` check (24, stroke 2.2) at the trailing edge. Not interactive.

### 4.5 The plate
* `plate` fill, edge to edge, with cream crop marks.
* **Crop mark insets**
  * Full screens (Hello in light, Focus): 12 from the sides, 52 from the top, 46 from the bottom.
  * The sheet: 14 from the top and sides, 40 from the bottom.
* The site multiplies a faint paper grain over the plate. It is optional natively; if used, tile a 240 pt noise PNG at 50% multiply.

### 4.6 The logo: one form, the halftone cygnet
* There is no solid silhouette anywhere. Every cygnet in the app is the dotted halftone, from 26 pt up to 330 pt.
* **Large cygnets** (Hello, Focus, the sheet, Riff 3)
  * Cream dots, with an `accentInk` water layer.
  * The tone graduates from left to right.
  * Dot pitch: `max(4.5, width / 120)` pt.
* **Small cygnets**
  * Flat tone, no water, in `smallMark` (cream in dark, `accent` in light).
  * The pitch is tuned per size so the head and neck still read. I checked this at 20 to 34 pt on a @3x render; anything coarser loses the neck.

| Use | Size (pt) | Dot pitch (pt) |
|---|---|---|
| Home footer "Resting from" | 26 x 15 | 1.6 |
| Browser chrome Home button | 30 x 18 | 1.7 |
| Home header logo, with "Idyll." | 34 x 20 | 1.8 |
| That's Idyll, Support footer | 56 x 33 | 2.2 |

* For any new small size, interpolate the pitch, keep the tone flat and check it at @3x.
* Assets and how to render them natively are in section 8.

### 4.7 Home header
* The 34 pt halftone cygnet, a 10 gap, then "Idyll" in `wordmark` with an `accent` full stop.
* Settings at the trailing edge as a text link.

### 4.8 Tag (the site's "Coming soon" tag)
* An `accent` block with Paper Mono 12 cream text, padded 5 top, 4 right, 5 bottom, 9 left.
* Followed directly by the halftone edge, `assets/icon/tag-edge.svg` at 26 x 22: 14 dots in `accent`.
* On the plate it inverts: a cream block with accent text and cream dots.
* Used for "Free, for good" on Hello.

### 4.9 Focus (screen 7)
* The onplate screen in both modes: crop marks and the 330 pt large cygnet with its top 104 from the screen top.
* Then the `countdown`, `heading` "Focus until 15:20." with an ink full stop, three 34 pt struck halftone marks of the paused apps, and the `small` line "Paused in the real apps. Idyll still works."
* Stop Focus is a cream secondary button; Add 10 minutes is a link.
* The timer ticks once a second.

### 4.10 Week chart (screen 9)
* One series and honest numbers.
* **Geometry**
  * Seven columns across 342. The chart is 140 tall, including 24 of headroom.
  * Each bar is 40% of its column, centred, with a 4 radius on the top corners only, on a 1 pt `soft` baseline.
* **Colour:** bars in `fg`, today in `accent`.
* **Labels:** only the peak and today carry a value (`label`, 6 above the bar, today's in `accent`). Weekday initials in `label` `soft`, with "Today" last.
* Each bar is one accessibility element, for example "Tuesday, 41 minutes".
* **Per-app rows:** tile 30, name (92 wide), a 4 pt bar in `track` with an `fg` fill scaled to the largest app, then the time in `small`, right aligned and 54 wide.

### 4.11 Nav bar
* 44 tall: chevron (24, stroke 1.7) plus the `link` label of the parent, 10 from the leading edge.
* The screen title sits below the bar.

### 4.12 Clean browser chrome (screens 3, 13 to 16)
* **Top bar,** 44 tall on `bg` with a hairline under it:
  * Leading: the 30 pt halftone cygnet as Home (44 hit area).
  * Centre: the site name in Sans 500 16.
  * Trailing: a sliders icon that opens the site's settings.
* **Bottom toolbar,** 49 tall plus the safe area, with a hairline above it: back, forward (30% opacity when unavailable), share, reload. Icons are 24 with stroke 1.7.
* **Site theme:** load the site's own scheme to match the phone. Send `prefers-color-scheme: dark` in dark mode, so YouTube and Instagram render dark.

### 4.13 The first-run sheet (screen 3)
* **Layout**
  * A plate 318 tall, anchored to the bottom edge. It covers the toolbar while shown; the cream home indicator sits on it.
  * Crop marks inset 14, 14, 40.
  * The 132 pt large cygnet at (28, 30).
  * At (176, 34): `label` "Gone", then the struck items in `small` 15, 4 apart, cream with `accentInk` strikes.
  * From y 148, inset 28: the `sheetTitle` with an ink full stop, a 15 pt body, and a row of two links, left and right.
* **Copy for YouTube:** "This is YouTube in Idyll." / "No Shorts, no home feed. Search and subscriptions are here." / "Back to YouTube", "OK".
* **Motion:** slides up over 320 ms (ease-out) once the page has loaded; down over 240 ms on either link. Reduce Motion: a 200 ms fade.
* Shown once per site, on first open.

### 4.14 Riffs on the sheet (13 to 16)
1. **First open, per site** (Instagram shown).
   * The same sheet with the site's own Gone list and copy. Instagram: "This is Instagram in Idyll." / "No Reels, no Explore. Messages are where they always were." / "Back to Instagram", "OK".
   * Write one per site, using the spec's fold-away notes.
2. **Removed mid-session.**
   * A compact plate 84 tall, 12 from each side, its bottom 96 above the screen bottom (resting on the toolbar).
   * Contents: a 40 pt struck halftone mark of the site, `noteTitle` "Reels removed." with an ink full stop, a `small` link "Your messages are here." (jumps to the inbox), and "OK".
   * Slides up over 240 ms and folds away after 4 seconds.
   * Shown at most once per element per session, when Idyll hides something the person tapped toward (a Reels tab, an Explore link).
3. **Full-height reveal.**
   * On the very first clean page, the plate wipes up from the bottom over 600 ms (ease-in-out) to the bottom of the chrome bar.
   * Contents: the 300 pt cygnet, `reveal` "YouTube, without the feeds.", the struck list in Sans 500 20, and "Search and subscriptions are here."
   * It holds for 1.2 s, then settles into the standard sheet over 500 ms: the plate shrinks to 318, the cygnet scales from 300 to 132 and moves to its sheet position, and the text cross-fades.
   * The mock shows it mid-wipe. With Reduce Motion, show the sheet directly.
   * Use it only for the first site of all, not every site.
4. **A friend's video ends.**
   * When a single video opened from a link ends, the sheet appears in place of YouTube's end screen.
   * Gone list: Up next, Autoplay, Shorts.
   * Title "That's everything." with body "Leo sent you this one. Nothing plays after it."
   * Name the sender only when Idyll knows who sent it (opened from a message inside Idyll); otherwise the body is "Nothing plays after it."
   * Links: "Back to messages" (or "Back" when there's no thread) and "Watch again".

### 4.15 Field (Paste a link)
* 52 tall, `fieldBg` with a 1 pt `fieldEdge` inner border.
* Inside: a 20 link icon in `soft`, the placeholder "Paste a link" in 16 `soft`, and a trailing "Paste" link.
* A `caption` hint sits 8 below.

### 4.16 Sleep (screen 8)
* **Top:** D's `hero` "Sleep." with an `accent` full stop, then the centred `soft` intro.
* **Time block**
  * A crop box 24 from each side, padded 18 top and bottom, in two columns.
  * Each column: `label` "Bedtime" or "Morning", then the time in `numeralL` 48.
  * A 1 pt `crop` vertical divider between them.
  * Tapping a time opens the native wheel picker in a sheet.
* **Timeline**
  * 28 tall in `track`, spanning 18:00 to 12:00 the next day, with the `accent` span from bedtime to morning.
  * `label` axis labels at 18:00, 00:00, 06:00 and 12:00.
* **Day chips**
  * Seven 40 squares (M T W T F S S) in Sans 500 15, spread across 342.
  * On: `fg` fill with `bg` text (cream in dark, ink in light). Off: a 1 pt `boxEdge` inner border.
* **Apps to rest**
  * `body` label, three 30 brand tiles, then a "Change" link (Apple's FamilyActivityPicker), with hairlines above and below.
* Then primary Save and a "Not now" link.

### 4.17 Appearance (screen 12)
* Settings, Appearance.
* `titleL` "Appearance." and the line "Light and dark follow your phone's setting."
* **Accent**
  * Two swatches side by side, each 163 x 112, square, filled `#d81b7a` and `#2d5bff`, with the name in Sans 500 17 cream at the bottom left.
  * Selected: a 2 pt `fg` outline 4 outside, and a 26 cream disc with an ink check at the top right.
  * Changing the accent recolours the app at once, with a 200 ms cross-fade.
* **App icon**
  * Two 84 icon previews (H2 magenta, H4 electric blue) with a `small` name under each, and the same selected treatment.
  * Note: "The app icon changes on your home screen too. iPhone shows a short note to confirm it."
* Accent and icon are separate choices, stored on the phone (`UserDefaults`, `DataStore`).

### 4.18 Support (screen 11)
* **Top:** D's `hero` "Free. For good." with accent full stops, the body, then "Tips unlock nothing."
* **Tips:** three tip buttons, then "Paid through Apple. Idyll never learns who you are."
* **Bottom:** the 56 pt small cygnet bottom left (C's placement), then a footer line: hairline, "Idyll. Social without the scroll." on the left and "Tell a friend" (share sheet) on the right.
* Tips are consumable purchases with no restore. After a purchase, the Apple line changes to "Thank you." in place.

## 5. Alternate app icons

* **Icon sources**
  * `assets/icon/app-icon-H2.png` (magenta, the default) and `app-icon-H4.png` (electric blue).
  * Both are 512 px. **We need 1024 px masters** for the App Store and the iOS asset catalog: re-export them from the icon source files.
* **iOS**
  * Add both sets to the asset catalog as `AppIcon` and `AppIcon-Blue`.
  * In build settings, set `ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES = AppIcon-Blue` and `ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS = YES`.
  * Switch with `UIApplication.shared.setAlternateIconName("AppIcon-Blue")`, or `nil` for the default, after checking `supportsAlternateIcons`.
  * iOS shows its own confirmation alert, which is why the note on screen says so.
* **Android**
  * Declare two `<activity-alias>` entries pointing at the main activity. Each has the launcher intent filter and its own `android:icon` and `android:roundIcon`: `.IconMagenta` is enabled by default, `.IconBlue` disabled.
  * Swap them with `packageManager.setComponentEnabledSetting(…, COMPONENT_ENABLED_STATE_ENABLED / DISABLED, DONT_KILL_APP)`: enable the new one first, then disable the old.
  * Some launchers close the app or move the home screen shortcut. Do the swap when the person leaves Settings, and say nothing more.
  * Adaptive icons: background layer the plate colour, foreground the cream halftone cygnet inside the 66 dp safe zone.

## 6. States, motion, accessibility

**States**
* Pressed: 82% opacity.
* Disabled: 35% opacity.
* Focus: a 2 pt accent outline.
* Selected: as drawn.

**Motion**
* The strike drawing on, the sheet and its riffs (section 4.14), and optionally the halftone dots growing in on Hello and Focus.
* Everything else uses system transitions.
* Respect Reduce Motion everywhere.

**Accessibility**
* Hit targets are at least 44 x 44.
* Struck items are announced as hidden; Stays items as kept.
* Halftone cygnets are decorative. The Home header logo is one element, read as "Idyll".

**Sample numbers**
* The "Sample numbers" labels exist only in the mockups.
* The app shows only the source ("Screen Time's count" on iOS, "Android's count" on Android).
* Show only measured numbers, never projections.

## 7. Screens

The layout, sizes and copy for each screen are in `final.html`.

1. **Hello**
   * Dark: night, with the 300 pt large cygnet on the bare background.
   * Light: the whole screen is the plate, using the onplate tokens: cream type, an ink full stop on "Idyll.", the cream tag, and an ink primary Start.
   * "How it works" opens a sheet with the copy from the onboarding spec.
2. **Pick your apps:** nine rows. Next is disabled until one app is picked. "Just show me" picks YouTube.
3. **First clean app:** the browser chrome and the sheet (section 4.13).
4. **That's Idyll:** the 56 pt small cygnet, the title, five chapter rows, and "Go to Idyll".
5. **Home:**
   * Header logo, the allowance block, four app rows, Focus and Post Mode, the field.
   * Footer: the 26 pt cygnet with "Resting from 23:00" (only if Sleep is set), and "Free, for good."
6. **A site's settings:** the Gone switch rows (one shown off), the Stays check rows, "Open the real Instagram" and "Sign out".
7. **Focus running:** see section 4.9.
8. **Sleep:** see section 4.16.
9. **Hours:** the week chart, per-app rows and the honest footer.
10. **What Idyll connects to:** the crop box with two entries, "Nothing else" struck, the on-phone note, and "Read the privacy policy" (opens the policy in the clean browser).
11. **Support Idyll:** see section 4.18.
12. **Appearance:** see section 4.17.

* 13 to 16: the riffs (section 4.14).
* 17: Home with the electric blue accent, to show the token swap. Only `accent`, `accentInk` and `plate` change.

## 8. Halftone assets and native rendering

**Recommended: the pre-rendered PNGs** in `assets/`, with transparent backgrounds, rendered by the site's own halftone code at @2x, @3x and @4x.
* iOS: @2x and @3x.
* Android: @2x goes in `drawable-xhdpi`, @3x in `drawable-xxhdpi`, @4x in `drawable-xxxhdpi`.
* Draw them at their point size and never tint them: each file is already the right ink.

| File pattern | pt size | Variants |
|---|---|---|
| `cygnet/cygnet-hello-{magenta,blue}` | 300 x 178 | Cream dots, water in that accent's second ink. Also Riff 3. |
| `cygnet/cygnet-focus-{magenta,blue}` | 330 x 196 | The same |
| `cygnet/cygnet-sheet-{magenta,blue}` | 132 x 78 | The same |
| `cygnet/cygnet-small-{26,30,34,56}-{cream,magenta,blue}` | See 4.6 | Flat tone, no water. Cream for dark mode, the accent colour for light. |
| `halftone-marks/mark-struck-{brand}-{magenta,blue}-{34,40}` | 34, 40 | Cream dots with the second-ink strike: Focus (34), Riff 2 (40) |

Other files in `assets/`:
* `assets/brands/`: the nine official SVGs.
* `assets/icon/`: `app-icon-H2.png`, `app-icon-H4.png` and `tag-edge.svg`.
* `assets/source/cygnet-silhouette-source.svg`: the silhouette that the halftone is sampled from. It is a source file, never drawn directly.

**To regenerate**
1. Serve the site root.
2. Run Chrome headless with `--dump-dom` on `final/export-assets.html`.
3. Decode the JSON in `#out`. The sizes and pitches are listed at the top of that file.

**Optional: a Canvas port,** for growing the dots in on Hello and Focus.

1. Rasterise the silhouette (viewBox 640 x 380) to an alpha bitmap at the target pixel size. Apply a Gaussian blur of `pitch x 0.45` px.
2. **Pitch:** large sizes use `max(4.5, width / 120)` pt; small sizes use the table in 4.6. Multiply by the screen scale.
3. **Dot layer**
   * Walk a grid rotated 45 degrees with spacing `pitch`, centred on the bitmap.
   * At each point, `v = alpha x tone`, with u and v as normalised x and y:
     * Large: `tone = 0.5 + 0.5 x min(1, 0.25 + 1.1u² + 0.6v)`.
     * Small: `tone = 1`.
   * Skip points where v < 0.05. Otherwise draw a dot of radius `pitch x 0.56 x sqrt(min(v, 1))`.
4. **Water layer** (large only), drawn first:
   * Spacing `0.9 x pitch`, grid rotated 15 degrees, offset +3 pt x and -2 pt y.
   * `tone = 0.45 x max(0, (v - 0.66) x 2.6)^1.4`, in `accentInk`.
5. **Struck marks**
   * Spacing `width / 22`, radius factor 0.58, image inset 10%, blur `pitch x 0.15`.
   * Then an `accentInk` line `0.1 x width` thick (butt caps) from (2 pt, 0.6h - 1.5 pt) to (w, 0.4h - 1.5 pt).
6. **Grow-in** (optional): each dot scales from 0 over 360 ms (ease-out cubic). The delay is `v x 315 + u x 585` ms plus a random 0 to 280 ms. Skip it with Reduce Motion.

* SwiftUI: a `Canvas` building one `Path` of ellipses.
* Compose: `drawWithCache`, then a `drawCircle` loop.
* Render once per size and cache; never draw per frame outside the grow-in.
