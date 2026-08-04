# Real-time Sync

Real-time data synchronization with Firestore listeners for live updates.

## Overview

ShipSafe supports real-time data synchronization using Firestore listeners. This allows your application to automatically update when data changes in Firestore, providing a seamless, live user experience without manual polling or refresh.

**Key Features:**
- **Real-time updates** - Automatically sync when data changes
- **Client-side listeners** - Use Firestore client SDK
- **Type-safe** - TypeScript support with converters
- **Automatic cleanup** - Unsubscribe when component unmounts
- **Efficient** - Only listens to needed data

## Architecture

### Client-Side Only

Real-time listeners use the Firebase **client SDK** (not Admin SDK):
- **Requires client component** - Must use `"use client"`
- **Respects security rules** - Subject to Firestore security rules
- **Live updates** - Automatic updates when data changes
- **Efficient** - Only sends changes, not full documents

**Location:** `src/lib/firebase/client.ts`

## Basic Usage

### Single Document Listener

```typescript
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firestore = getFirestoreInstance();
    const userRef = doc(firestore, "users", userId);

    // Subscribe to document changes
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setUser(snapshot.data());
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to user:", error);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.displayName}</div>;
}
```

### Collection Listener

```typescript
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { collection, onSnapshot, query, where } from "firebase/firestore";

function ActiveSubscriptions({ userId }: { userId: string }) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firestore = getFirestoreInstance();
    const subscriptionsRef = collection(firestore, "subscriptions");

    // Query with filter
    const q = query(
      subscriptionsRef,
      where("userId", "==", userId),
      where("status", "==", "ACTIVE")
    );

    // Subscribe to query changes
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubscriptions(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to subscriptions:", error);
        setLoading(false);
      }
    );

    // Cleanup
    return () => unsubscribe();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {subscriptions.map((sub) => (
        <li key={sub.id}>{sub.subscriptionId}</li>
      ))}
    </ul>
  );
}
```

## Type-Safe Listeners

### Using Model Converters

```typescript
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { userFromFirestore, type User } from "@/models/user";

function TypedUserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firestore = getFirestoreInstance();
    const userRef = doc(firestore, "users", userId);

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // Use converter for type safety
          const userData = userFromFirestore({
            ...snapshot.data(),
            uid: snapshot.id,
          });
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.displayName}</div>;
}
```

## Custom Hooks

### Reusable Subscription Hook

```typescript
// src/hooks/useSubscription.ts
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import {
  subscriptionFromFirestore,
  type Subscription,
} from "@/models/subscription";

export function useSubscription(subscriptionId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!subscriptionId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const firestore = getFirestoreInstance();
    const subRef = doc(firestore, "subscriptions", subscriptionId);

    const unsubscribe = onSnapshot(
      subRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const subData = subscriptionFromFirestore({
            ...snapshot.data(),
            subscriptionId: snapshot.id,
          });
          setSubscription(subData);
        } else {
          setSubscription(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error listening to subscription:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [subscriptionId]);

  return { subscription, loading, error };
}

// Usage
function SubscriptionStatus({ subscriptionId }: { subscriptionId: string }) {
  const { subscription, loading, error } = useSubscription(subscriptionId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!subscription) return <div>No subscription found</div>;

  return <div>Status: {subscription.status}</div>;
}
```

### Generic Document Hook

```typescript
// src/hooks/useFirestoreDocument.ts
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot, DocumentSnapshot } from "firebase/firestore";

export function useFirestoreDocument<T>(
  collection: string,
  documentId: string | null,
  converter?: (snapshot: DocumentSnapshot) => T
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentId) {
      setData(null);
      setLoading(false);
      return;
    }

    const firestore = getFirestoreInstance();
    const docRef = doc(firestore, collection, documentId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const converted = converter
            ? converter(snapshot)
            : ({ id: snapshot.id, ...snapshot.data() } as T);
          setData(converted);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error listening to ${collection}/${documentId}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collection, documentId, converter]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useFirestoreDocument(
    "users",
    userId,
    (snapshot) =>
      userFromFirestore({
        ...snapshot.data()!,
        uid: snapshot.id,
      })
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.displayName}</div>;
}
```

## Advanced Patterns

### Multiple Listeners

```typescript
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

function UserDashboard({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const firestore = getFirestoreInstance();
    const unsubscribes: (() => void)[] = [];

    // Listen to user
    const userUnsubscribe = onSnapshot(
      doc(firestore, "users", userId),
      (snapshot) => {
        setUser(snapshot.data());
      }
    );
    unsubscribes.push(userUnsubscribe);

    // Listen to subscription (if exists)
    const subscriptionUnsubscribe = onSnapshot(
      doc(firestore, "subscriptions", userId),
      (snapshot) => {
        setSubscription(snapshot.exists() ? snapshot.data() : null);
      }
    );
    unsubscribes.push(subscriptionUnsubscribe);

    // Cleanup all listeners
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [userId]);

  return (
    <div>
      <div>User: {user?.displayName}</div>
      <div>Subscription: {subscription?.status || "None"}</div>
    </div>
  );
}
```

### Conditional Listening

```typescript
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

function ConditionalListener({ userId, enabled }: { userId: string; enabled: boolean }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!enabled) {
      setUser(null);
      return;
    }

    const firestore = getFirestoreInstance();
    const unsubscribe = onSnapshot(doc(firestore, "users", userId), (snapshot) => {
      setUser(snapshot.data());
    });

    return () => unsubscribe();
  }, [userId, enabled]);

  if (!enabled) return <div>Listening disabled</div>;
  return <div>{user?.displayName}</div>;
}
```

## Best Practices

1. **Always unsubscribe** - Clean up listeners on component unmount
2. **Handle errors** - Provide error callback in `onSnapshot`
3. **Show loading states** - Display loading indicator while fetching
4. **Use converters** - Convert Firestore data to TypeScript types
5. **Minimize listeners** - Only listen to data you need
6. **Optimize queries** - Use indexes for filtered queries
7. **Handle null/empty** - Check if document/query exists before using

## Security Considerations

### Firestore Security Rules

Real-time listeners respect Firestore security rules. Ensure your rules allow read access:

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own user document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
    }

    // Users can read their own subscriptions
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### Server-Side Alternative

For sensitive data, use server-side polling instead:

```typescript
// Server component with polling
async function ServerSubscriptionStatus({ userId }: { userId: string }) {
  const subscription = await getUserSubscriptionFromFirestore(userId);
  return <div>Status: {subscription?.status}</div>;
}
```

## Troubleshooting

### Listener Not Updating

1. **Check security rules** - Ensure rules allow read access
2. **Verify document path** - Ensure collection/document IDs are correct
3. **Check network** - Verify internet connection
4. **Review console** - Check for error messages

### Performance Issues

1. **Limit listeners** - Don't create too many listeners
2. **Use indexes** - Create composite indexes for queries
3. **Filter queries** - Use `where` clauses to limit data
4. **Pagination** - Use `limit()` for large collections

## Learn More

- [Database Features](./database) - Firestore operations
- [Real-time Listeners Tutorial](../tutorials/realtime-listeners) - Detailed guide
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
