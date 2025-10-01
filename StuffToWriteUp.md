# Development Process: "Fetching Upcoming Bookings" Feature

This document provides a highly detailed breakdown of the coding process for the "Fetching Upcoming Bookings" feature in [GolfBooks](https://github.com/tk-tomker/GolfBooks), including specific code changes, rationale, mistakes, fixes, and multiple iterations where applicable.

---

## 1. Dependency Upgrades

### **First Iteration: Initial Upgrade**

```diff name=my-app/package.json url=https://github.com/tk-tomker/GolfBooks/blob/main/my-app/package.json
-    "@supabase/supabase-js": "^2.57.2",
+    "@supabase/supabase-js": "^2.57.4",
```
And in `package-lock.json`:

```diff
-      "version": "2.4.5",
+      "version": "2.4.6",
-      "version": "1.21.3",
+      "version": "1.21.4",
-      "version": "2.11.1",
+      "version": "2.12.1",
```

### **Second Iteration: Fixing Lockfile Issues**

**Mistake:**  
After upgrading, forgot to run `npm install` → stale lockfile errors.

**Fix:**  
Ran `npm install`, committed the fresh lockfile, and verified that no dependency mismatches remained.

**Impact:**  
Stable build, access to new bug fixes and features.

---

## 2. Refactoring Supabase Client Imports

### **First Iteration: Path Change**

```diff name=my-app/src/app/api/clerk-webhook/route.ts url=https://github.com/tk-tomker/GolfBooks/blob/main/my-app/src/app/api/clerk-webhook/route.ts
-import { createClient } from "../utils/supabase/server"
+import { createClient } from "../lib/supabase/server"
```

### **Second Iteration: Repo-wide Audit**

**Mistake:**  
Some files still used the old path, causing runtime errors.

**Fix:**  
Used `grep`/search tools to find all references and update them. Ensured all API and utility files used the new location.

---

## 3. UI: Authenticated User Menu

### **First Iteration: Global User Menu**

```diff name=my-app/src/app/layout.tsx url=https://github.com/tk-tomker/GolfBooks/blob/main/my-app/src/app/layout.tsx
-            <Navbar />
-            <UserButton />
+            <Navbar />
```

### **Second Iteration: Conditional Rendering**

```diff
+        {/* Button only for **authenticated** users */}
+        <SignedIn>
+          <UserButton />
+        </SignedIn>
```

**Mistake:**  
User menu always rendered, confusing unauthenticated users.

**Fix:**  
Wrapped `UserButton` in `<SignedIn>` for security and clarity.

---

## 4. Fetching Internal User ID and Bookings

### **First Iteration: Only User Fetch**

```typescript name=my-app/src/app/page.tsx url=https://github.com/tk-tomker/GolfBooks/blob/main/my-app/src/app/page.tsx
async function fetchUser() {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
  } else {
    setUserData(data);
  }
}
fetchUser();
```

**Mistake:**  
Only fetched user, not bookings; selected all fields, increasing payload size and leaking sensitive info.

---

### **Second Iteration: Adding Bookings Fetch and Scoping Data**

```typescript
async function fetchUserBookings(clerkId: string) {
  const { data: dbUser, error: userError } = await supabaseClient
    .from('users')
    .select('user_id')
    .eq('clerk_id', clerkId)
    .single();
  if (userError) {
    console.error('Error fetching user:', userError);
    return;
  }
  const supabaseId = dbUser?.user_id;
  setInternalUserId(supabaseId);

  const { data: bookings, error: bookingsError } = await supabaseClient
    .from('bookings')
    .select('start_time')
    .eq('user_id', supabaseId);

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
    return;
  }
  return bookings;
}
fetchUserBookings(user.id).then(bookings => {
  setUserData(bookings);
  setBookings(bookings);
});
```

**Fix:**  
Scoped user query, chained bookings fetch, reduced data exposure.

---

## 5. Passing Data to Components

### **First Iteration: Incorrect Props**

```diff name=my-app/src/app/page.tsx url=https://github.com/tk-tomker/GolfBooks/blob/main/my-app/src/app/page.tsx
-            <LiveFeed user={clerkId} userData={userData} />
-            <NextBooking />
+            <LiveFeed user={internalUserId}  />
+            <NextBooking bookings={bookings} />
```

**Mistake:**  
Passed Clerk ID and omitted bookings prop, resulting in incorrect/incomplete data in child components.

**Fix:**  
Passed internal user ID and bookings array as props.

---

## 6. Component Refactoring

### **LiveFeed.tsx**

**First Iteration: Clerk ID Prop**

```typescript
interface LiveFeedProps {
  clerkId: string | undefined;
}

export default function LiveFeed({ user }: LiveFeedProps) {
  return (
    <h2 className="text-lg font-semibold mb-4">
      Live Feed for {user ?? 'Unknown User'}
    </h2>
  );
}
```

**Second Iteration: Internal User ID, Loading State**

```typescript
import { useUser } from "@clerk/nextjs"; // adjust import if needed

export default function LiveFeed({user}) {
  return (
    <h2 className="text-lg font-semibold mb-4">
       {user ? `Live Feed for ${user}` : "Live Feed for Loading user…"}
    </h2>
  );
}
```

### **NextBooking.tsx**

**First Iteration: Hardcoded Display**

```typescript
<Card className="w-40 h-35">
  <CardHeader>
    <CardTitle>MON 17th</CardTitle>
    <CardDescription>@ 17:30</CardDescription>
  </CardHeader>
</Card>
...
```

**Second Iteration: Dynamic Rendering, Fallback**

```typescript
{bookings && bookings.length > 0 ? (
  bookings.slice(0, 3).map((booking, idx) => (
    <Card className="w-40 h-35" key={idx}>
      <CardHeader>
        <CardTitle>{new Date(booking.start_time).toDateString()}</CardTitle>
        <CardDescription>
          @{new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </CardDescription>
      </CardHeader>
    </Card>
  ))
) : (
  <Card className="w-40 h-35">
    <CardHeader>
      <CardTitle>No bookings</CardTitle>
      <CardDescription>—</CardDescription>
    </CardHeader>
  </Card>
)}
```

**Mistake:**  
Static cards regardless of bookings.

**Fix:**  
Mapped bookings array, displayed dynamically, handled empty states.

---

## 7. Error Handling and Edge Cases

### **First Iteration: No Error Handling**

```typescript
// No error handling for failed fetches.
```

### **Second Iteration: Adding Logging and UI Fallbacks**

```typescript
if (userError) {
  console.error('Error fetching user:', userError);
  return;
}
if (bookingsError) {
  console.error("Error fetching bookings:", bookingsError);
  return;
}
```
And in UI:

```typescript
if (!isLoaded) {
  return (
    <div>Loading user...</div>
  )
}
```

**Impact:**  
Silent failures replaced with console errors; UI fallbacks prevent blank screens.

---

## 8. Cleanup and Future-proofing

### **Redundant UI Removal**

```diff name=my-app/src/components/ui/navbar.tsx url=https://github.com/tk-tomker/GolfBooks/blob/main/my-app/src/components/ui/navbar.tsx
-        <SignedIn>
-    
-          <UserButton />
-        </SignedIn>
+        <SignedIn>
+          <UserButton />
+        </SignedIn>
```

### **Export for Browser-side Supabase Client**

```diff name=my-app/src/lib/supabase/supabaseClient.ts url=https://github.com/tk-tomker/GolfBooks/blob/main/my-app/src/lib/supabase/supabaseClient.ts
+export { createBrowserClient }
```

**Impact:**  
Cleaner UI, easier to maintain, ready for future browser-based DB calls.

---

## 9. Testing and Iterative Improvements

### **Manual Testing Iterations**

- **First:** Bookings only loaded for some users (bug: missing user_id mapping).
- **Second:** Bookings fetched for all users, but UI crashed if no bookings.
- **Third:** Added UI fallback and error handling.
- **Fourth:** Confirmed correct booking times rendered, both for users with and without bookings.

---

## 10. Summary Table of Key Code Changes

| Area               | Example Line(s) Changed                                             | Mistake                         | Fix                                            |
|--------------------|---------------------------------------------------------------------|----------------------------------|------------------------------------------------|
| Dependencies       | `@supabase/supabase-js: ^2.57.2 → ^2.57.4`                          | Outdated lockfile                | Ran `npm install`, updated lockfile            |
| API Imports        | `../utils/supabase/server → ../lib/supabase/server`                 | Broken import                    | Updated all import paths                       |
| Auth UI            | Added `<SignedIn><UserButton /></SignedIn>`                         | Menu shown to all users          | Wrapped menu in `<SignedIn>`                   |
| Data Fetch         | Added separate queries for `user_id` and `bookings`                 | Fetched wrong/insufficient data  | Split queries, mapped IDs correctly            |
| Component Props    | Passed `internalUserId` & `bookings` as props                       | Wrong props, missing data        | Updated to correct values                      |
| Component Logic    | Dynamic rendering of bookings, error handling                       | Hardcoded data, no fallback      | Made UI robust and data-driven                 |
| Error Handling     | Added `console.error` calls and loading/empty UI states             | Silent failures                  | Proper error logging and UI fallbacks          |
| Cleanup            | Removed duplicate user menu, exported browser client                | Redundant code                   | DRY principle and future-proofing              |

---

## 11. Lessons Learned

- Centralize shared logic for maintainability.
- Validate and test data flow, especially across authentication and DB boundaries.
- Handle errors and empty states proactively in UI.
- Upgrade dependencies with care; always test for breakages.
- Keep components prop-driven and focused for easy reuse/debugging.
- Manual testing is essential for catching edge cases.

---

## 12. Next Steps

- Add automated tests for bookings fetch logic.
- Expand error messages and fallback UI.
- Paginate or filter bookings for users with many appointments.
- Document data flow and prop requirements for future contributors.

---

**For further details or questions about the process, see the [merged pull request](https://github.com/tk-tomker/GolfBooks/pull/10) and related code changes.**
