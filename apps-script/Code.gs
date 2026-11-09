// Google Apps Script — saves each RSVP (with the guest's message to Ethan) to the "RSVP" tab.
//
// Setup:
// 1. Google Sheet > Extensions > Apps Script, paste this file, save.
// 2. Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
// 3. Copy the Web app URL (ends in /exec) into SHEET_URL at the top of script.js.
// After editing this file later: Deploy > Manage deployments > Edit > New version.

const HEADERS = ["Timestamp", "Name", "Contact", "Attending", "Guests", "Additional Guest", "Message to Ethan"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("RSVP");
  if (!sh) {
    sh = ss.insertSheet("RSVP");
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  const p = e.parameter;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date(), p.name, p.contact, p.attending, p.guests, p.extraGuest, p.message]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput("ok");
}
