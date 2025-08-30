# Database Setup Guide for Startup Value Simulator

This guide will help you set up the database for the Startup Value Simulator application, ensuring all data is properly stored and persisted.

## 🗄️ Database Overview

The application uses **Supabase** as the backend database service, which provides:

- PostgreSQL database with real-time capabilities
- Row Level Security (RLS) for data protection
- Automatic API generation
- Built-in authentication (for future use)

## 📋 Database Schema

The application includes the following tables:

### 🏢 Companies

- Company basic information (name, description, industry)
- User association for future multi-user support
- Creation and update timestamps

### 👥 Founders

- Founder details (name, equity percentage, shares, role)
- Linked to companies with foreign key relationships
- Support for multiple founders per company

### 💰 Funding Rounds

- Comprehensive funding round data (SAFE, Priced Rounds)
- Capital raised, valuation, investor information
- Support for different round types and structures

### 📈 ESOP Grants

- Employee stock option plan details
- Vesting schedules, cliff periods, exercise prices
- Employee information and grant status

### ⚙️ Company Settings

- Current valuation, ESOP pool percentage
- Total shares and exit valuation
- Company-specific configuration

### 📋 Scenarios

- Saved financial modeling scenarios
- JSON data storage for complex scenario data
- Version control and scenario management

### 💬 Comments

- Collaboration and feedback system
- Entity-specific commenting (founders, rounds, grants)
- User attribution and timestamps

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note your project URL and anon key

### 2. Update Configuration

Update the database connection in `src/lib/supabase.ts`:

```typescript
const supabaseUrl = "YOUR_SUPABASE_PROJECT_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
```

### 3. Run Database Schema

1. Copy the SQL from `database-schema.sql`
2. Go to your Supabase project dashboard
3. Navigate to SQL Editor
4. Paste and run the schema

### 4. Test Database Connection

Run the database initialization script:

```bash
node scripts/init-database.js
```

## 🔧 Detailed Setup

### Database Schema Installation

1. **Access SQL Editor**: In your Supabase dashboard, go to SQL Editor
2. **Run Schema**: Copy and paste the entire contents of `database-schema.sql`
3. **Verify Tables**: Check that all tables are created successfully
4. **Check RLS**: Ensure Row Level Security is enabled on all tables

### Row Level Security (RLS) Policies

The schema includes basic RLS policies that allow:

- Public read access to active records
- Public insert access for new records
- Public update access for existing records

For production use, you may want to:

- Restrict access based on user authentication
- Implement company-specific access control
- Add audit logging for sensitive operations

### Sample Data

The schema includes sample data for:

- Demo startup company
- Sample founders
- Example funding round
- Sample ESOP grants
- Default scenario

## 📊 Data Persistence Features

### Automatic Saving

The application automatically saves data changes:

- **Auto-save**: Changes are saved after 2 seconds of inactivity
- **Real-time sync**: All components stay synchronized
- **Error handling**: Failed saves are logged and can be retried

### Data Loading

Data is automatically loaded when:

- Application starts
- Company selection changes
- Scenarios are loaded
- Components are mounted

### Data Validation

All data is validated before saving:

- Required field validation
- Data type checking
- Business rule validation
- Format validation

## 🔍 Database Operations

### Creating Records

```typescript
// Create a new company
const newCompany = await createCompany({
  name: "My Startup",
  description: "Innovative tech company",
  industry: "Technology",
});

// Create a new founder
const newFounder = await createFounder({
  company_id: companyId,
  name: "John Doe",
  equity_percentage: 60,
  shares: 6000000,
  role: "CEO",
});
```

### Reading Records

```typescript
// Get all companies
const companies = await getCompanies();

// Get founders for a company
const founders = await getFounders(companyId);

// Get funding rounds
const rounds = await getFundingRounds(companyId);
```

### Updating Records

```typescript
// Update company settings
await updateCompanySettings(companyId, {
  current_valuation: 10000000,
  esop_pool_percentage: 15,
});

// Update founder information
await updateFounder(founderId, {
  equity_percentage: 65,
  shares: 6500000,
});
```

### Deleting Records

```typescript
// Soft delete (recommended)
await deleteCompany(companyId); // Sets is_active to false

// Hard delete (use with caution)
await supabase.from("companies").delete().eq("id", companyId);
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Errors**

   - Check your Supabase URL and API key
   - Ensure your project is not paused
   - Verify network connectivity

2. **Permission Errors**

   - Check RLS policies are properly configured
   - Verify table permissions
   - Check if tables exist

3. **Data Not Saving**

   - Check browser console for errors
   - Verify database connection
   - Check RLS policies allow insert/update

4. **Data Not Loading**
   - Check if tables have data
   - Verify RLS policies allow select
   - Check for JavaScript errors

### Debug Mode

Enable debug logging in the browser console:

```typescript
// Add to your component
useEffect(() => {
  console.log("Current data state:", { founders, fundingRounds, esopGrants });
}, [founders, fundingRounds, esopGrants]);
```

### Database Health Check

Run the health check script:

```bash
node scripts/init-database.js
```

This will show:

- Connection status
- Table accessibility
- Record counts
- Any configuration issues

## 🔒 Security Considerations

### Row Level Security

- All tables have RLS enabled
- Basic policies allow public access (for demo)
- Production should implement user-based access control

### Data Validation

- Input validation on all forms
- Server-side validation in database constraints
- Type checking in TypeScript interfaces

### API Security

- Supabase handles API security
- Rate limiting and abuse protection
- SQL injection protection

## 📈 Performance Optimization

### Indexes

The schema includes indexes for:

- Foreign key relationships
- Frequently queried fields
- Date-based sorting
- Status filtering

### Query Optimization

- Use specific field selection
- Implement pagination for large datasets
- Cache frequently accessed data
- Use database views for complex queries

## 🔄 Data Migration

### Schema Updates

When updating the schema:

1. Backup existing data
2. Test changes in development
3. Use migration scripts for production
4. Update TypeScript interfaces

### Data Export/Import

```typescript
// Export company data
const exportData = {
  companies: await getCompanies(),
  founders: await getFounders(companyId),
  fundingRounds: await getFundingRounds(companyId),
  esopGrants: await getEsopGrants(companyId),
};

// Import data
await saveCompanyData(companyId, importData);
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Best Practices](https://supabase.com/docs/guides/database/best-practices)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review browser console for errors
3. Run the database health check script
4. Check Supabase project logs
5. Review RLS policies and permissions

## 🎯 Next Steps

After setting up the database:

1. **Test the application** - Create a company and add data
2. **Verify persistence** - Check that data saves and loads correctly
3. **Test all features** - Founders, funding rounds, ESOP grants
4. **Create scenarios** - Save and load different financial models
5. **Monitor performance** - Check database query performance

---

**Note**: This setup provides a solid foundation for the Startup Value Simulator. For production use, consider implementing user authentication, more restrictive RLS policies, and additional security measures.




