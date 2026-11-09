// Google Apps Script — paste into Extensions > Apps Script of your Google Sheet.
// Saves each RSVP (with the guest's message to Ethan) to the "RSVP" tab.

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
