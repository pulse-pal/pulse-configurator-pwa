# PulsePal Configurator

Staff-only mobile web app (PWA) for installing PulsePal tracking devices in client vehicles. An installer registers the device, records who it is for, plugs it in, runs a connection test, and saves the installation.

This is separate from the Driver PWA. Only `@pulsepal.com` staff can log in.

## Status

Front end complete. All data is **dummy data held in memory**, so installations, photos and notes are lost on refresh until the backend is connected.

## Run it locally

1. Install VS Code and the **Live Server** extension.
2. Open the `pulse-configurator-pwa` folder in VS Code.
3. Set Live Server to port **5501** (the Driver PWA uses 5500). In `.vscode/settings.json`:
```json
   { "liveServer.settings.port": 5501 }
```
4. Right-click `index.html` and choose **Open with Live Server**.
5. Log in with any `@pulsepal.com` email and any password:
   - `fred@pulsepal.com` (Admin-001)
   - `adow@pulsepal.com` (Admin-002)

After changing CSS or JS, hard refresh with **Ctrl+Shift+R**. The service worker caches files.

## Folder structure

```
pulse-configurator-pwa/
  index.html          App shell: top bar, #view, bottom nav
  manifest.json       Android "Add to Home screen" settings
  sw.js               Service worker (offline shell, network-first)
  css/
    main.css          Colours, themes, type scale, app shell
    components.css    Buttons, forms, cards, badges, modals
    pages.css         Screen-specific styles
  js/
    theme.js          Auto / Light / Dark (loaded in <head>)
    dummy-data.js     Staff, fleets, installations, test steps, fix guide
    router.js         Hash router and route table
    app.js            Icons, Auth, Store, Fmt, Validate, Installs, Toast, boot
  pages/              One .frag file per screen
  assets/             Icons and images
```

Pages are `.frag` files, not `.html`, because Live Server injects a reload script into every `.html` response, even ones fetched by JavaScript.

## Screens

| Route | Page |
|---|---|
| `#/login` | Staff login |
| `#/home` | Home: Install button and recent installs |
| `#/install/1` to `#/install/5` | Register device, user type, client details, install, test connection |
| `#/install/complete` | Summary, SMS note, photo and notes, 10 s auto-return |
| `#/installations` | My Installations: stats, filter, search |
| `#/installation?id=5` | Installation detail |
| `#/tools` | Tools: Check a device, Fix a problem |
| `#/device-check?code=PULSE-0001` | Device check |
| `#/troubleshoot?area=obd` | Fix a problem (areas: 4g, obd, gps, server) |
| `#/settings` | Profile, theme, log out |

The bottom nav (Home, Installs, Tools, Settings) is on every page except login.

## How it works

- **Router** (`js/router.js`): reads the hash, fetches the `.frag`, injects it into `#view`, and re-runs its `<script>`. Each page script is wrapped in an IIFE and uses `Router.onLeave()` to clean up timers.
- **Install state** lives in `sessionStorage` (`install_state`) through `Store`, so a refresh mid-install keeps your place.
- **Auth** is a dummy check stored in `localStorage` (`pp_staff_id`).
- **Theme** is stored in `localStorage` (`pp_theme`) and follows the phone when set to Auto.

## Test hooks

- `#/install/5?fail=obd` forces the OBD test step to fail, to check the failure and fix path.

## Install on a phone (Android)

Open the hosted URL in Chrome, then use the menu and **Add to Home screen**. It needs HTTPS (or localhost).

## Connecting the real backend

Replace these dummy pieces with API calls:

- `Auth` in `js/app.js` (login against the staff table)
- `Installs.all / add / byId` in `js/app.js`
- `FLEET_ACCOUNTS` and `NEXT_DEVICE_CODE` in `js/dummy-data.js`
- The animated tests in `pages/install-step5.frag`, which should call the real device-connection check

Known gaps to fill in then:

- Vehicle make, model and year are not collected in Step 3.
- The total on My Installations includes `installs_before_today`.
- Photos and notes are not persisted.

## Conventions

- Vanilla HTML, CSS and JS. No build step, no framework.
- Orange accent `#FF7A1A`, dark charcoal theme matching the Driver PWA.
- No emoji, only stroke SVG icons.
- 56px minimum touch targets.