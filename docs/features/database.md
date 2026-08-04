# Database

Firestore integration with Firebase Admin SDK for secure server-side data storage and queries.

## Overview

ShipSafe uses Firestore (Firebase's NoSQL database) via the Firebase Admin SDK for all server-side database operations. This ensures secure access with admin privileges, allowing you to read and write data without client-side security rules restrictions. The database is used for storing user profiles, subscription data, and any application-specific data.

**Key Features:**
- **Server-side access** - Uses Firebase Admin SDK (bypasses security rules)
- **Type-safe models** - TypeScript interfaces with Firestore converters
- **Real-time support** - Can use Firestore listeners for real-time updates
- **Secure by default** - All operations are server-side only
- **Timestamp handling** - Automatic conversion between Firestore Timestamps and JavaScript Dates

## Architecture

### Server-Side Only

All Firestore operations use the Firebase Admin SDK, which:
- **Bypasses security rules** - Has full admin access to all collections
- **Requires server-side code** - Cannot be used in client components
- **Secure credentials** - Uses service account keys (never exposed to clients)

**Location:** `src/lib/firebase/init.ts`

### Client-Side Access (Optional)

For client-side Firestore access (with security rules), use the client SDK:

**Location:** `src/lib/firebase/client.ts`

**Note:** ShipSafe primarily uses server-side Firestore via Admin SDK for security.

## Getting Firestore Instance

### Server-Side

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";

// Get Firestore instance (singleton pattern)
const firestore = getFirestoreInstance();

// Now you can use firestore for queries
const doc = await firestore.collection("users").doc(userId).get();
```

**Important:** This function can only be called server-side (API routes, server components, server actions).

## Data Models

ShipSafe provides type-safe models with Firestore converters:

### User Model

**Location:** `src/models/user.ts`

```typescript
import { userFromFirestore, userToFirestore, type User } from "@/models/user";

// Read from Firestore
const doc = await firestore.collection("users").doc(userId).get();
const user = userFromFirestore({ ...doc.data(), uid: userId });

// Write to Firestore
await firestore.collection("users").doc(userId).set(userToFirestore(user));
```

### Subscription Model

**Location:** `src/models/subscription.ts`

```typescript
import {
  subscriptionFromFirestore,
  subscriptionToFirestore,
  type Subscription,
} from "@/models/subscription";

// Read subscription
const doc = await firestore.collection("subscriptions").doc(subId).get();
const subscription = subscriptionFromFirestore({
  ...doc.data(),
  subscriptionId: doc.id,
});
```

## Reading Data

### Single Document

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";
import { userFromFirestore } from "@/models/user";

const firestore = getFirestoreInstance();

// Get user document
const userDoc = await firestore.collection("users").doc(userId).get();

if (userDoc.exists) {
  const user = userFromFirestore({
    ...userDoc.data(),
    uid: userId,
  });
  console.log(user.email);
}
```

### Querying Collections

```typescript
// Query subscriptions by user
const snapshot = await firestore
  .collection("subscriptions")
  .where("userId", "==", userId)
  .where("status", "==", "ACTIVE")
  .limit(1)
  .get();

if (!snapshot.empty) {
  const doc = snapshot.docs[0];
  const subscription = subscriptionFromFirestore({
    ...doc.data(),
    subscriptionId: doc.id,
  });
}
```

### Query Examples

```typescript
// Get all active subscriptions
const activeSubs = await firestore
  .collection("subscriptions")
  .where("status", "==", "ACTIVE")
  .get();

// Get users created in last 7 days
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);
const recentUsers = await firestore
  .collection("users")
  .where("createdAt", ">=", Timestamp.fromDate(weekAgo))
  .get();

// Order by creation date (descending)
const latestUsers = await firestore
  .collection("users")
  .orderBy("createdAt", "desc")
  .limit(10)
  .get();
```

## Writing Data

### Create Document

```typescript
import { Timestamp } from "firebase-admin/firestore";
import { userToFirestore } from "@/models/user";

// Create new user document
await firestore.collection("users").doc(userId).set({
  email: "user@example.com",
  displayName: "John Doe",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});

// Or use converter
const user = createUserObject(userId, email);
await firestore.collection("users").doc(userId).set(userToFirestore(user));
```

### Update Document

```typescript
// Update specific fields (merge)
await firestore.collection("users").doc(userId).update({
  displayName: "Updated Name",
  updatedAt: Timestamp.now(),
});

// Update with merge option
await firestore.collection("users").doc(userId).set(
  {
    displayName: "Updated Name",
    updatedAt: Timestamp.now(),
  },
  { merge: true }
);
```

### Delete Document

```typescript
// Delete document
await firestore.collection("users").doc(userId).delete();

// Delete field
await firestore.collection("users").doc(userId).update({
  displayName: FieldValue.delete(),
});
```

## Timestamp Handling

Firestore stores dates as `Timestamp` objects, but TypeScript uses `Date`. The model converters handle this automatically:

```typescript
// When reading: Timestamp → Date
const user = userFromFirestore(docData); // Timestamps converted to Dates

// When writing: Date → Timestamp
await firestore.collection("users").doc(userId).set(userToFirestore(user)); // Dates converted to Timestamps
```

**Manual conversion:**

```typescript
import { Timestamp } from "firebase-admin/firestore";

// Date to Timestamp
const timestamp = Timestamp.fromDate(new Date());

// Timestamp to Date
const date = timestamp.toDate();

// Unix timestamp (seconds)
const unixSeconds = Math.floor(Date.now() / 1000);
const timestampFromUnix = Timestamp.fromMillis(unixSeconds * 1000);
```

## Real-time Listeners

For real-time updates, use Firestore listeners (client-side only):

**Location:** `src/lib/firebase/client.ts`

```typescript
// Client-side only (requires "use client")
import { getFirestoreInstance } from "@/lib/firebase/client";

const firestore = getFirestoreInstance();

// Listen to user document changes
const unsubscribe = firestore
  .collection("users")
  .doc(userId)
  .onSnapshot((doc) => {
    if (doc.exists()) {
      const user = doc.data();
      // Update UI with new user data
    }
  });

// Cleanup
unsubscribe();
```

**Server-side:** Use polling or webhooks for updates (no real-time listeners).

## Security Considerations

### Server-Side Access

- **Admin SDK** - Has full access to all collections
- **No security rules** - Bypasses Firestore security rules
- **Server-only** - Never import Admin SDK in client components

### Data Validation

Always validate data before writing:

```typescript
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
});

// Validate before writing
const validated = userSchema.parse(userData);
await firestore.collection("users").doc(userId).set(validated);
```

### Access Control

Implement access control in your API routes:

```typescript
// API route example
export async function GET(req: NextRequest) {
  // Verify user is authenticated
  const user = await requireAuth(req);
  
  // Check authorization
  if (user.uid !== targetUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  // Now safe to read user data
  const doc = await firestore.collection("users").doc(targetUserId).get();
  // ...
}
```

## Best Practices

1. **Use model converters** - Always use `fromFirestore` and `toFirestore` functions
2. **Validate data** - Use Zod schemas before writing to Firestore
3. **Handle errors** - Wrap Firestore operations in try-catch blocks
4. **Check existence** - Always check `doc.exists()` before accessing data
5. **Update timestamps** - Always update `updatedAt` when modifying documents
6. **Batch operations** - Use transactions/batches for multi-document operations

## Common Patterns

### Check if Document Exists

```typescript
const doc = await firestore.collection("users").doc(userId).get();
if (!doc.exists) {
  throw new Error("User not found");
}
```

### Upsert (Create or Update)

```typescript
// Create if doesn't exist, update if it does
await firestore
  .collection("users")
  .doc(userId)
  .set(userData, { merge: true });
```

### Batch Operations

```typescript
const batch = firestore.batch();

batch.set(firestore.collection("users").doc(userId), userData);
batch.update(firestore.collection("subscriptions").doc(subId), {
  status: "ACTIVE",
});

await batch.commit();
```

### Transactions

```typescript
await firestore.runTransaction(async (transaction) => {
  const userDoc = await transaction.get(
    firestore.collection("users").doc(userId)
  );
  
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  
  transaction.update(firestore.collection("users").doc(userId), {
    subscriptionCount: (userDoc.data()?.subscriptionCount || 0) + 1,
  });
});
```

## Learn More

- [Firebase Setup](./firebase-setup) - Complete Firebase configuration guide
- [Database Queries Tutorial](../tutorials/database-queries) - Query patterns and examples
- [Real-time Listeners Tutorial](../tutorials/realtime-listeners) - Client-side real-time updates
