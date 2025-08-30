# 🔧 Funding Rounds Fix Guide

## 🚨 **The Problem**

The "Add Round" functionality in the Funding Rounds tab is not working due to several issues:

1. **Database Schema Mismatch**: The database table structure doesn't match what the application expects
2. **Field Name Inconsistencies**: Mismatched field names between app and database
3. **Data Mapping Issues**: The application data format doesn't properly map to database format

## 🔍 **Root Causes**

### **1. Database Schema Issues**

- Missing `capital_raised` and `valuation` columns
- Inconsistent field naming (`investment_amount` vs `capital_raised`)
- Missing default values and constraints

### **2. Application Code Issues**

- Data validation errors not being handled properly
- Incorrect field mapping between frontend and backend
- Missing error handling for database operations

### **3. Data Type Mismatches**

- Application sends `capitalRaised` but database expects `capital_raised`
- Date format inconsistencies
- JSON field handling issues

## 🛠️ **Step-by-Step Fix**

### **Step 1: Fix Database Schema**

Run the SQL fix script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of fix-funding-rounds.sql
-- This will:
-- 1. Add missing columns
-- 2. Update existing data
-- 3. Set proper constraints
-- 4. Verify the structure
```

### **Step 2: Test the Fix**

1. **Open your app** and go to the Funding Rounds tab
2. **Try to add a new round** with this test data:
   - Name: "Test Seed Round"
   - Type: SAFE
   - Capital Raised: 500000
   - Valuation: 2000000
   - Date: Today's date
3. **Check the browser console** for any errors
4. **Verify the round appears** in the list

### **Step 3: Debug Any Remaining Issues**

If you still see errors, check:

1. **Browser Console**: Look for JavaScript errors
2. **Network Tab**: Check for failed API calls
3. **Database Logs**: Look for SQL errors in Supabase

## 📊 **Expected Database Structure**

After running the fix, your `funding_rounds` table should have:

```sql
CREATE TABLE funding_rounds (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    name TEXT NOT NULL,
    round_type TEXT NOT NULL,
    capital_raised DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    valuation DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    valuation_type TEXT NOT NULL,
    shares_issued INTEGER,
    share_price DECIMAL(10,4),
    valuation_cap DECIMAL(15,2),
    discount_rate DECIMAL(5,2),
    conversion_trigger TEXT,
    investors JSONB NOT NULL,
    round_date DATE NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🧪 **Testing the Fix**

### **Test 1: Basic Round Creation**

1. Go to Funding Rounds tab
2. Click "Add New Funding Round"
3. Fill in required fields
4. Click "Add Round"
5. Verify round appears in list

### **Test 2: Round Validation**

1. Try to create a round with invalid data (e.g., $0 capital)
2. Verify validation errors appear
3. Fix the data and try again

### **Test 3: Round Editing**

1. Click on an existing round
2. Modify some fields
3. Save changes
4. Verify changes persist

### **Test 4: Round Deletion**

1. Click delete on a round
2. Confirm deletion
3. Verify round is removed

## 🐛 **Common Error Messages & Solutions**

### **Error: "Column 'capital_raised' does not exist"**

**Solution**: Run the `fix-funding-rounds.sql` script

### **Error: "Invalid input syntax for type date"**

**Solution**: Ensure date format is YYYY-MM-DD

### **Error: "Column 'investors' is of type jsonb"**

**Solution**: Ensure investors array is properly formatted

### **Error: "Validation failed"**

**Solution**: Check that all required fields are filled

## 🔄 **Alternative Fix (If SQL Script Fails)**

If the SQL script doesn't work, manually create the missing columns:

```sql
-- Add missing columns manually
ALTER TABLE funding_rounds
ADD COLUMN capital_raised DECIMAL(15,2) DEFAULT 0.00;

ALTER TABLE funding_rounds
ADD COLUMN valuation DECIMAL(15,2) DEFAULT 0.00;

-- Update existing data
UPDATE funding_rounds
SET
    capital_raised = COALESCE(investment_amount, 0.00),
    valuation = COALESCE(pre_money_valuation, 0.00)
WHERE capital_raised IS NULL OR valuation IS NULL;

-- Make columns NOT NULL
ALTER TABLE funding_rounds
ALTER COLUMN capital_raised SET NOT NULL,
ALTER COLUMN valuation SET NOT NULL;
```

## 📱 **Frontend Testing**

### **Console Test Script**

Copy and paste this into your browser console to test the logic:

```javascript
// Copy the contents of test-funding-rounds.js
// This will test the validation and data mapping
```

### **Manual Testing Steps**

1. **Open Funding Rounds tab**
2. **Click "Add New Funding Round"**
3. **Fill form with test data**:
   - Name: "Test Round"
   - Type: SAFE
   - Capital: 1000000
   - Valuation: 5000000
   - Date: Today
4. **Submit and check for errors**
5. **Verify round appears in list**

## ✅ **Success Indicators**

You'll know the fix worked when:

1. ✅ **No console errors** when adding rounds
2. ✅ **Rounds appear** in the list after creation
3. ✅ **Validation works** for invalid data
4. ✅ **Editing and deleting** rounds works
5. ✅ **Data persists** after page refresh

## 🆘 **Still Having Issues?**

If the fix doesn't work:

1. **Check Supabase logs** for database errors
2. **Verify table structure** matches expected schema
3. **Test with minimal data** to isolate the issue
4. **Check browser console** for JavaScript errors
5. **Verify environment variables** are set correctly

## 📞 **Support**

For additional help:

1. Check the browser console for specific error messages
2. Verify your Supabase database connection
3. Ensure all environment variables are properly set
4. Test with the provided test scripts

---

**Status**: 🔧 Ready to fix  
**Last Updated**: Current session  
**Priority**: High (Core functionality)


