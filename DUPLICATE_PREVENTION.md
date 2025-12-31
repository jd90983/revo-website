# Duplicate Prevention Implementation

## Overview

The system now has **multi-layer duplicate prevention** to ensure no duplicate entries are created, even if someone tries to submit the same form multiple times.

## How Duplicate Prevention Works

### Layer 1: Database Level (RLS Policy)
- **Prevents:** Exact duplicates (same email + phone + industry + calls) within 1 hour
- **Enforced at:** Database level via RLS policy
- **Cannot be bypassed:** Even if API is compromised, database will reject duplicates

### Layer 2: Database Index (Unique Constraint)
- **Prevents:** Exact duplicates (same email + phone + industry + calls) within the same hour
- **Enforced at:** Database level via unique index
- **Error:** Returns database constraint violation if duplicate attempted

### Layer 3: API Level (Application Logic)
- **Prevents:** Exact duplicates within 1 hour
- **Prevents:** Same email with different data (updates existing instead)
- **Enforced at:** API route before database insert
- **Response:** Returns 409 Conflict with helpful message

## Duplicate Detection Rules

### Exact Duplicate (Rejected)
If someone submits the **exact same** information:
- Same email
- Same phone number
- Same industry
- Same calls per week
- Within 1 hour

**Result:** 
- ❌ Submission rejected
- Returns: `409 Conflict` error
- Message: "You have already submitted this information X minutes ago"

### Same Email, Different Data (Updated)
If someone submits with the **same email** but **different** information:
- Same email
- Different phone number OR
- Different industry OR
- Different calls per week

**Result:**
- ✅ Existing lead is **updated** with new information
- Returns: `200 Success` with `isUpdate: true`
- Original submission timestamp preserved

### Same Email, Same Data After 1 Hour (Allowed)
If someone submits the **same data** but more than **1 hour** has passed:
- Same email + phone + industry + calls
- More than 1 hour since last submission

**Result:**
- ✅ New submission created
- Returns: `200 Success` with `isUpdate: false`
- Allows legitimate resubmissions after time has passed

## Examples

### Example 1: Exact Duplicate (Rejected)
```
Submission 1: john@example.com, 555-1234, HVAC, 10-20
Submission 2 (5 min later): john@example.com, 555-1234, HVAC, 10-20
Result: ❌ Rejected - "You have already submitted this information 5 minutes ago"
```

### Example 2: Same Email, Different Data (Updated)
```
Submission 1: john@example.com, 555-1234, HVAC, 10-20
Submission 2 (30 min later): john@example.com, 555-5678, HVAC, 21-50
Result: ✅ Updated - Phone and calls per week changed
```

### Example 3: Same Data After 1 Hour (Allowed)
```
Submission 1: john@example.com, 555-1234, HVAC, 10-20
Submission 2 (2 hours later): john@example.com, 555-1234, HVAC, 10-20
Result: ✅ New submission created (legitimate resubmission)
```

## Database Schema Changes

### Unique Index Added
```sql
CREATE UNIQUE INDEX idx_leads_duplicate_prevention 
ON leads (
  email, 
  contact_number, 
  industry, 
  calls_per_week, 
  DATE_TRUNC('hour', submitted_at)
) 
WHERE deleted_at IS NULL;
```

This index prevents exact duplicates within the same hour at the database level.

### RLS Policy Updated
The RLS policy now includes a check:
```sql
-- Prevent exact duplicates within 1 hour
NOT EXISTS (
  SELECT 1 
  FROM leads 
  WHERE email = NEW.email 
    AND contact_number = NEW.contact_number
    AND industry = NEW.industry
    AND calls_per_week = NEW.calls_per_week
    AND submitted_at > NOW() - INTERVAL '1 hour'
    AND deleted_at IS NULL
)
```

## API Response Codes

### 200 Success (New Submission)
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "leadId": "uuid-here",
  "isUpdate": false
}
```

### 200 Success (Updated Existing)
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "leadId": "uuid-here",
  "isUpdate": true
}
```

### 409 Conflict (Duplicate)
```json
{
  "error": "Duplicate submission",
  "message": "You have already submitted this information 5 minutes ago. Please wait before submitting again.",
  "leadId": "uuid-here"
}
```

## Testing Duplicate Prevention

### Test 1: Exact Duplicate
1. Submit form with: `test@example.com`, `555-1234`, `HVAC`, `10-20`
2. Immediately submit again with same data
3. **Expected:** 409 error, duplicate rejected

### Test 2: Same Email, Different Data
1. Submit form with: `test@example.com`, `555-1234`, `HVAC`, `10-20`
2. Submit again with: `test@example.com`, `555-5678`, `Plumbing`, `21-50`
3. **Expected:** 200 success, existing lead updated

### Test 3: Same Data After 1 Hour
1. Submit form with: `test@example.com`, `555-1234`, `HVAC`, `10-20`
2. Wait 2 hours
3. Submit again with same data
4. **Expected:** 200 success, new submission created

## Configuration

### Time Windows
- **Exact Duplicate Window:** 1 hour (configurable in API)
- **Update Window:** 30 days (configurable in API)
- **Rate Limit:** 5 submissions per email per 24 hours (RLS policy)

### Customization
To change the duplicate detection window, update:
1. **API:** `oneHourAgo` calculation in `api/submit-form-secure.js`
2. **Database:** `INTERVAL '1 hour'` in RLS policy
3. **Index:** `DATE_TRUNC('hour', submitted_at)` in unique index

## Benefits

✅ **Prevents Spam:** Can't submit same form repeatedly
✅ **Prevents Accidents:** Double-clicking won't create duplicates
✅ **Allows Updates:** Same person can update their information
✅ **Allows Legitimate Resubmissions:** After 1 hour, same data can be resubmitted
✅ **Multi-Layer Protection:** Database + API + RLS = triple protection
✅ **User-Friendly:** Clear error messages explain what happened

## Migration Notes

If you're upgrading from the old version:
1. Run the updated `supabase-setup-secure.sql`
2. Replace `api/submit-form.js` with `api/submit-form-secure.js`
3. The unique index will be created automatically
4. Existing duplicates won't be affected (only new submissions are prevented)

## Troubleshooting

### "Duplicate submission" error but it's not a duplicate
- Check if email, phone, industry, and calls_per_week are exactly the same
- Check if submission was within the last hour
- Verify the data being sent matches exactly

### Want to allow duplicates after shorter time
- Update `oneHourAgo` in API to shorter interval (e.g., 30 minutes)
- Update RLS policy `INTERVAL '1 hour'` to match
- Update index `DATE_TRUNC('hour'` to `DATE_TRUNC('minute'` if needed

### Want stricter duplicate prevention
- Change 1 hour to 24 hours in both API and RLS policy
- This will prevent same submission for a full day
