# Database Queries Tutorial

Complete guide to working with Firestore in ShipSafe, including queries, filters, pagination, and data conversion.

## Overview

ShipSafe uses Firebase Firestore as its database. This tutorial covers:

- **Reading data** - Single documents and queries
- **Writing data** - Creating and updating documents
- **Using converters** - Type-safe data conversion
- **Querying** - Filters, sorting, pagination
- **Error handling** - Handling Firestore errors

## Firestore Instances

### Server-Side Instance

For API routes and server components:

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";

// Server-side only (uses Admin SDK, bypasses security rules)
const firestore = getFirestoreInstance();
```

**Characteristics:**
- ✅ Full admin access (bypasses security rules)
- ✅ Can read/write any data
- ✅ Server-side only
- ❌ Cannot be used in client components

### Client-Side Instance

For client components (optional):

```typescript
"use client";
import { getFirestoreInstance } from "@/lib/firebase/client";

// Client-side (subject to security rules)
const firestore = getFirestoreInstance();
```

**Characteristics:**
- ✅ Can be used in client components
- ⚠️ Subject to Firestore security rules
- ⚠️ Limited to rules-permitted operations

**Note:** ShipSafe primarily uses server-side Firestore via API routes. Client-side Firestore is optional.

## Reading Data

### Single Document

#### Server-Side

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";
import { userFromFirestore } from "@/models/user";

export async function getUser(userId: string) {
  const firestore = getFirestoreInstance();
  const doc = await firestore.collection("users").doc(userId).get();

  if (!doc.exists) {
    return null; // Document doesn't exist
  }

  // Convert Firestore data to TypeScript type
  const user = userFromFirestore({
    ...doc.data(),
    uid: doc.id,
  } as any);

  return user;
}
```

#### Pattern: Check if Document Exists

```typescript
const doc = await firestore.collection("users").doc(userId).get();

if (!doc.exists) {
  throw new Error("User not found");
}

const data = doc.data(); // Safe to call - document exists
```

### Multiple Documents (Query)

#### Basic Query

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";
import { userFromFirestore } from "@/models/user";

export async function getPremiumUsers() {
  const firestore = getFirestoreInstance();

  // Query with filter
  const snapshot = await firestore
    .collection("users")
    .where("role", "==", "PREMIUM")
    .get();

  // Convert documents to array
  const users = snapshot.docs.map((doc) =>
    userFromFirestore({
      ...doc.data(),
      uid: doc.id,
    } as any)
  );

  return users;
}
```

#### Query with Multiple Filters

```typescript
const snapshot = await firestore
  .collection("users")
  .where("role", "==", "PREMIUM")
  .where("emailVerified", "==", true)
  .get();
```

**Limitation:** Firestore has restrictions on composite queries. See [Firestore Query Limitations](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations).

#### Query with Sorting

```typescript
// Sort by createdAt descending (newest first)
const snapshot = await firestore
  .collection("users")
  .orderBy("createdAt", "desc")
  .limit(10)
  .get();
```

#### Query with Limit

```typescript
// Get first 10 documents
const snapshot = await firestore
  .collection("users")
  .limit(10)
  .get();
```

### Pagination

#### Simple Pagination

```typescript
const PAGE_SIZE = 10;

export async function getUsersPaginated(page: number = 0) {
  const firestore = getFirestoreInstance();

  // Calculate offset
  const offset = page * PAGE_SIZE;

  // Get documents with pagination
  const snapshot = await firestore
    .collection("users")
    .orderBy("createdAt", "desc")
    .limit(PAGE_SIZE)
    .offset(offset)
    .get();

  const users = snapshot.docs.map((doc) =>
    userFromFirestore({
      ...doc.data(),
      uid: doc.id,
    } as any)
  );

  return users;
}
```

#### Cursor-Based Pagination (Recommended)

```typescript
interface PaginationResult {
  items: User[];
  lastDoc: any; // Last document for next page
  hasMore: boolean;
}

export async function getUsersPaginated(
  lastDocId?: string
): Promise<PaginationResult> {
  const firestore = getFirestoreInstance();
  const PAGE_SIZE = 10;

  let query = firestore
    .collection("users")
    .orderBy("createdAt", "desc")
    .limit(PAGE_SIZE + 1); // Get one extra to check if more exists

  // Start after last document if provided
  if (lastDocId) {
    const lastDoc = await firestore.collection("users").doc(lastDocId).get();
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  const docs = snapshot.docs;

  // Check if there are more documents
  const hasMore = docs.length > PAGE_SIZE;
  const items = docs
    .slice(0, PAGE_SIZE)
    .map((doc) =>
      userFromFirestore({
        ...doc.data(),
        uid: doc.id,
      } as any)
    );

  const lastDoc = hasMore ? docs[PAGE_SIZE - 1] : null;

  return {
    items,
    lastDoc: lastDoc?.id || null,
    hasMore,
  };
}
```

## Writing Data

### Create Document

#### Using `set()`

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";
import { Timestamp } from "firebase-admin/firestore";
import { userToFirestore } from "@/models/user";

export async function createUser(userId: string, userData: Partial<User>) {
  const firestore = getFirestoreInstance();

  // Convert to Firestore format
  const firestoreData = userToFirestore({
    uid: userId,
    email: userData.email!,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    ...userData,
  } as User);

  // Create document
  await firestore.collection("users").doc(userId).set(firestoreData);

  return userId;
}
```

#### Using `add()` (Auto-Generated ID)

```typescript
export async function createItem(itemData: ItemInput) {
  const firestore = getFirestoreInstance();

  const docRef = await firestore.collection("items").add({
    ...itemData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return docRef.id; // Return generated ID
}
```

### Update Document

#### Partial Update

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";
import { Timestamp } from "firebase-admin/firestore";

export async function updateUser(userId: string, updates: Partial<User>) {
  const firestore = getFirestoreInstance();

  // Partial update (only updates provided fields)
  await firestore.collection("users").doc(userId).update({
    ...updates,
    updatedAt: Timestamp.now(),
  });
}
```

#### Conditional Update (Check Exists First)

```typescript
export async function updateUserSafe(userId: string, updates: Partial<User>) {
  const firestore = getFirestoreInstance();
  const doc = await firestore.collection("users").doc(userId).get();

  if (!doc.exists) {
    throw new Error("User not found");
  }

  await firestore.collection("users").doc(userId).update({
    ...updates,
    updatedAt: Timestamp.now(),
  });
}
```

#### Update or Create (Upsert)

```typescript
export async function upsertUser(userId: string, userData: Partial<User>) {
  const firestore = getFirestoreInstance();

  // set() with merge option creates or updates
  await firestore.collection("users").doc(userId).set(
    {
      ...userData,
      updatedAt: Timestamp.now(),
    },
    { merge: true } // Merge with existing document
  );
}
```

### Delete Document

```typescript
export async function deleteUser(userId: string) {
  const firestore = getFirestoreInstance();

  await firestore.collection("users").doc(userId).delete();
}
```

## Using Converters

### What Are Converters?

Converters transform Firestore data (Timestamps, etc.) to JavaScript types (numbers, Dates) and vice versa.

### Example: User Model

```typescript
// src/models/user.ts

import { Timestamp } from "firebase-admin/firestore";

export interface User {
  uid: string;
  email: string;
  displayName?: string | null;
  createdAt: number; // Unix timestamp (number)
  // ...
}

// Convert FROM Firestore (Timestamp → number)
export function userFromFirestore(data: {
  uid: string;
  createdAt: Timestamp | number;
  // ...
}): User {
  return {
    ...data,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toMillis() / 1000
        : data.createdAt,
  };
}

// Convert TO Firestore (number → Timestamp)
export function userToFirestore(user: User): {
  createdAt: Timestamp;
  // ...
} {
  return {
    ...user,
    createdAt: Timestamp.fromMillis(user.createdAt * 1000),
  };
}
```

### Using Converters

#### Reading (From Firestore)

```typescript
import { userFromFirestore } from "@/models/user";

const doc = await firestore.collection("users").doc(userId).get();
const user = userFromFirestore({
  ...doc.data(),
  uid: doc.id,
} as any);

// user.createdAt is now a number (Unix timestamp)
```

#### Writing (To Firestore)

```typescript
import { userToFirestore } from "@/models/user";

const firestoreData = userToFirestore(user);
await firestore.collection("users").doc(userId).set(firestoreData);

// Firestore receives Timestamp objects
```

## Advanced Queries

### Array Contains Query

```typescript
// Find documents where array field contains value
const snapshot = await firestore
  .collection("posts")
  .where("tags", "array-contains", "javascript")
  .get();
```

### In Query

```typescript
// Find documents where field matches any value in array
const snapshot = await firestore
  .collection("users")
  .where("role", "in", ["admin", "moderator"])
  .get();
```

### Range Queries

```typescript
// Greater than
const snapshot = await firestore
  .collection("items")
  .where("price", ">", 100)
  .get();

// Less than or equal
const snapshot = await firestore
  .collection("items")
  .where("price", "<=", 1000)
  .get();
```

### Composite Queries

```typescript
// Note: Requires composite index in Firestore
const snapshot = await firestore
  .collection("items")
  .where("category", "==", "electronics")
  .where("price", ">", 100)
  .orderBy("price", "asc")
  .get();
```

**Important:** Composite queries with multiple `where()` clauses and `orderBy()` require an index. Firestore will provide a link to create the index when needed.

## Error Handling

### Handling Firestore Errors

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";

export async function getUserSafely(userId: string) {
  try {
    const firestore = getFirestoreInstance();
    const doc = await firestore.collection("users").doc(userId).get();

    if (!doc.exists) {
      return null; // Document doesn't exist - not an error
    }

    return userFromFirestore({
      ...doc.data(),
      uid: doc.id,
    } as any);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Firestore error:", error.message);
      throw new Error("Failed to fetch user");
    }
    throw error;
  }
}
```

### Common Errors

```typescript
try {
  // Firestore operation
} catch (error: any) {
  if (error.code === "not-found") {
    // Document doesn't exist
  } else if (error.code === "permission-denied") {
    // Insufficient permissions (if using client SDK)
  } else if (error.code === "unavailable") {
    // Firestore service unavailable
  } else {
    // Other errors
  }
}
```

## Best Practices

### 1. Always Use Converters

✅ **Do:**
```typescript
const user = userFromFirestore({ ...doc.data(), uid: doc.id });
```

❌ **Don't:**
```typescript
const user = doc.data(); // No type safety, no conversion
```

### 2. Check Document Exists

✅ **Do:**
```typescript
if (!doc.exists) {
  return null;
}
```

❌ **Don't:**
```typescript
const data = doc.data(); // May be undefined
```

### 3. Handle Errors Gracefully

✅ **Do:**
```typescript
try {
  const doc = await firestore.collection("users").doc(userId).get();
  // ...
} catch (error) {
  console.error("Error:", error);
  throw new Error("Failed to fetch user");
}
```

### 4. Use Transactions for Critical Operations

```typescript
const firestore = getFirestoreInstance();
await firestore.runTransaction(async (transaction) => {
  const docRef = firestore.collection("users").doc(userId);
  const doc = await transaction.get(docRef);

  if (!doc.exists) {
    throw new Error("User not found");
  }

  transaction.update(docRef, {
    balance: doc.data()!.balance + amount,
  });
});
```

### 5. Batch Operations for Multiple Writes

```typescript
const firestore = getFirestoreInstance();
const batch = firestore.batch();

batch.update(firestore.collection("users").doc(userId1), { role: "admin" });
batch.update(firestore.collection("users").doc(userId2), { role: "user" });
batch.delete(firestore.collection("users").doc(userId3));

await batch.commit();
```

## Complete Example: User Management

```typescript
import { getFirestoreInstance } from "@/lib/firebase/init";
import { userFromFirestore, userToFirestore, type User } from "@/models/user";
import { Timestamp } from "firebase-admin/firestore";

export class UserService {
  private firestore = getFirestoreInstance();

  async getUser(userId: string): Promise<User | null> {
    const doc = await this.firestore.collection("users").doc(userId).get();

    if (!doc.exists) {
      return null;
    }

    return userFromFirestore({
      ...doc.data(),
      uid: doc.id,
    } as any);
  }

  async createUser(userId: string, userData: Partial<User>): Promise<string> {
    const firestoreData = userToFirestore({
      uid: userId,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
      ...userData,
    } as User);

    await this.firestore.collection("users").doc(userId).set(firestoreData);
    return userId;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await this.firestore.collection("users").doc(userId).update({
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const snapshot = await this.firestore
      .collection("users")
      .where("role", "==", role)
      .get();

    return snapshot.docs.map((doc) =>
      userFromFirestore({
        ...doc.data(),
        uid: doc.id,
      } as any)
    );
  }
}
```

## Learn More

- [Database Features](../features/database) - Complete Firestore guide
- [Real-time Listeners Tutorial](./realtime-listeners) - Live data updates
- [Firestore Documentation](https://firebase.google.com/docs/firestore) - Official docs
