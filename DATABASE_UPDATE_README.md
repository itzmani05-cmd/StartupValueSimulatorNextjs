# Database Update Guide

This guide explains how to update your database tables to support the enhanced company creation system.

## 🚀 **Quick Update (Recommended)**

### Option 1: Run the Update Script

```bash
npm run db:update
```

### Option 2: Manual SQL Execution

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `comprehensive-database-update.sql`
4. Paste and execute the SQL

## 📋 **What Gets Updated**

### **Companies Table - New Fields:**

- `legal_structure` - Company legal structure (C-Corp, LLC, etc.)
- `headquarters` - Company location
- `website` - Company website URL
- `total_shares` - Total number of shares
- `initial_valuation` - Initial company valuation
- `esop_pool_percentage` - ESOP pool percentage

### **Company Settings Table - Enhanced:**

- `initial_valuation` - Initial valuation tracking
- `legal_structure` - Legal structure reference
- `headquarters` - Location reference
- `website` - Website reference

### **Founders Table - Improved:**

- `equity_percentage` - Founder equity percentage
- `role` - Founder role/title

### **Funding Rounds Table - Enhanced:**

- `capital_raised` - Amount raised in round
- `valuation` - Round valuation
- `investors` - JSON array of investors
- `notes` - Additional round notes

### **ESOP Grants Table - Complete:**

- `employee_id` - Employee identifier
- `position` - Employee position
- `department` - Employee department
- `cliff_period` - Vesting cliff period
- `vesting_frequency` - Vesting frequency
- `status` - Grant status
- `notes` - Additional grant notes

## 🔧 **Database Constraints Added**

- **Legal Structure Validation**: Ensures valid legal structure values
- **Total Shares Validation**: Ensures positive share numbers
- **ESOP Pool Validation**: Ensures ESOP percentage is 0-100%

## 📊 **Performance Improvements**

- **New Indexes**: Added for legal_structure, industry, founded_date
- **Query Optimization**: Better performance for filtered searches

## ✅ **Verification**

After running the update, the script will show:

- Updated table structures
- Sample data from each table
- Success confirmation message

## 🚨 **Important Notes**

1. **Backup First**: Always backup your database before major updates
2. **Test Environment**: Test updates in development before production
3. **Downtime**: Updates are non-destructive and can run while app is active
4. **Rollback**: If issues occur, the original structure remains intact

## 🆘 **Troubleshooting**

### **If the script fails:**

1. Check your Supabase credentials
2. Ensure you have admin access to the database
3. Try running the SQL manually in Supabase SQL editor

### **If you see errors:**

1. Check the error messages for specific issues
2. Verify table names match your database
3. Ensure you have the required permissions

## 📞 **Support**

If you encounter issues:

1. Check the error logs
2. Verify your database connection
3. Ensure all environment variables are set correctly

---

**Status**: ✅ Ready to run  
**Last Updated**: Current session  
**Compatibility**: Supabase PostgreSQL

