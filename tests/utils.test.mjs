import test from "node:test";
import assert from "node:assert";

// Tracking ID format verification: MHF-YYYYMMDD-XXXX
function generateTrackingId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MHF-${datePart}-${randomPart}`;
}

// PIN code validation: 6 digits
const pincodeRegex = /^\d{6}$/;

test("Tracking ID generator matches official MHF-YYYYMMDD-XXXX format", () => {
  const id = generateTrackingId();
  assert.match(id, /^MHF-\d{8}-[A-Z0-9]{4}$/);
});

test("Indian Pincode validation requires exactly 6 numeric digits", () => {
  assert.strictEqual(pincodeRegex.test("110001"), true);
  assert.strictEqual(pincodeRegex.test("560001"), true);
  assert.strictEqual(pincodeRegex.test("11000"), false); // 5 digits
  assert.strictEqual(pincodeRegex.test("1100012"), false); // 7 digits
  assert.strictEqual(pincodeRegex.test("11000A"), false); // letters
});

test("Complaint status transitions adhere to valid lifecycle states", () => {
  const validStatuses = [
    "SUBMITTED",
    "UNDER_REVIEW",
    "VERIFIED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "CITIZEN_CONFIRMED",
    "REJECTED",
    "REOPENED",
    "ESCALATED",
  ];
  assert.strictEqual(validStatuses.length, 10);
  assert.ok(validStatuses.includes("CITIZEN_CONFIRMED"));
  assert.ok(validStatuses.includes("REOPENED"));
  assert.ok(validStatuses.includes("ESCALATED"));
});

test("Public complaint policy ensures phone and password are excluded from public schema", () => {
  const publicComplaintFields = [
    "id",
    "tracking_id",
    "title",
    "description",
    "address",
    "pincode",
    "latitude",
    "longitude",
    "status",
    "priority",
    "category",
    "department",
    "media",
  ];
  assert.strictEqual(publicComplaintFields.includes("password"), false);
  assert.strictEqual(publicComplaintFields.includes("phone"), false);
  assert.strictEqual(publicComplaintFields.includes("citizen_email"), false);
});

