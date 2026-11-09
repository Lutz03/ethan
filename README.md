# Ethan's 1st Birthday — It's Game Time

Static invitation site (GitHub Pages) with RSVP and messages saved to Google Sheets.

## 1. Google Sheets setup

1. Create a new Google Sheet (e.g. "Ethan 1st Birthday RSVP").
2. **Extensions → Apps Script**, delete the sample code, paste `apps-script/Code.gs`, save.
3. **Deploy → New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize, then copy the **Web app URL** (ends in `/exec`).
5. Paste it into `SHEET_URL` at the top of `script.js`.

The "RSVP" tab (including each guest's message to Ethan) is created automatically on the first submission.

> If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## 2. GitHub Pages

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin master
```

Then on GitHub: **Settings → Pages → Deploy from a branch → master / (root)**.
The site will be at `https://<you>.github.io/<repo>/`.

## To customize

- Party start time: `PARTY_DATE` in `script.js` (currently 10:00 AM PH time).
- Health protocol text: the "Health Protocol" section in `index.html`.
