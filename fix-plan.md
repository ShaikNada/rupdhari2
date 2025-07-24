# Fix Plan for AdminDashboard.tsx Type Mismatch

## Problem

There's a type mismatch error on line 219 in `src/pages/AdminDashboard.tsx`:

```
Types of property 'price' are incompatible.
  Type 'string' is not assignable to type 'number'.
```

The issue is that the `price` field is being passed as a string, but the database expects it to be a number.

## Solution

We need to convert the string price values to numbers before sending them to the database. This needs to be done in two places:

1. For the main product (around line 192):
   ```typescript
   // Current code
   price: mainPrice,
   
   // Fix
   price: parseFloat(mainPrice) || 0,
   ```

2. For the variations (around line 212):
   ```typescript
   // Current code
   price: variationData[key]?.price || '',
   
   // Fix
   price: parseFloat(variationData[key]?.price) || 0,
   ```

## Implementation Steps

1. Open `src/pages/AdminDashboard.tsx`
2. Find line 192 and replace `price: mainPrice,` with `price: parseFloat(mainPrice) || 0,`
3. Find line 212 and replace `price: variationData[key]?.price || '',` with `price: parseFloat(variationData[key]?.price) || 0,`
4. Save the file

## Expected Result

After making these changes, the type mismatch error should be resolved because we're now converting the string price values to numbers before sending them to the database.