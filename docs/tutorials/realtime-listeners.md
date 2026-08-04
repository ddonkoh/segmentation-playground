# Real-time Listeners Tutorial

Complete guide to implementing real-time data synchronization with Firestore listeners in ShipSafe.

## Overview

Real-time listeners allow your application to automatically update when data changes in Firestore, providing a seamless, live user experience without manual polling or refresh.

**What You'll Learn:**
- Setting up Firestore listeners
- Listening to single documents
- Listening to collections
- Handling connection states
- Cleanup and performance optimization

## Architecture

### Client-Side Only

Real-time listeners use the Firebase **client SDK** (not Admin SDK):

- ✅ **Requires client component** - Must use `"use client"`
- ✅ **Respects security rules** - Subject to Firestore security rules
- ✅ **Live updates** - Automatic updates when data changes
- ✅ **Efficient** - Only sends changes, not full documents

**Location:** `src/lib/firebase/client.ts`

**Important:** Real-time listeners are client-side only. For server-side operations, use Firestore queries via Admin SDK.

## Basic Usage

### Single Document Listener

Listen to changes to a single document:

```tsx
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { userFromFirestore } from "@/models/user";

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const firestore = getFirestoreInstance();
    const userRef = doc(firestore, "users", userId);

    // Subscribe to document changes
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // Document exists - convert and set user
          const userData = userFromFirestore({
            ...snapshot.data(),
            uid: snapshot.id,
          } as any);
          setUser(userData);
        } else {
          // Document doesn't exist
          setUser(null);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error listening to user:", error);
        setError("Failed to load user");
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts or userId changes
    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.displayName || user.email}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

**Key Points:**
- ✅ Use `onSnapshot()` to subscribe
- ✅ Return cleanup function from `useEffect`
- ✅ Handle loading, error, and empty states
- ✅ Use converters for type safety

### Collection Listener

Listen to changes to a collection query:

```tsx
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { subscriptionFromFirestore } from "@/models/subscription";

function ActiveSubscriptions({ userId }: { userId: string }) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const firestore = getFirestoreInstance();
    const subscriptionsRef = collection(firestore, "subscriptions");

    // Build query
    const q = query(
      subscriptionsRef,
      where("userId", "==", userId),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    // Subscribe to query changes
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) =>
          subscriptionFromFirestore({
            ...doc.data(),
            subscriptionId: doc.id,
          } as any)
        );
        setSubscriptions(items);
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

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  return (
    <div>
      <h2>Active Subscriptions ({subscriptions.length})</h2>
      {subscriptions.map((sub) => (
        <div key={sub.subscriptionId}>
          <p>Status: {sub.status}</p>
          <p>Plan: {sub.priceId}</p>
        </div>
      ))}
    </div>
  );
}
```

## Advanced Patterns

### Custom Hook for Reusability

Create a reusable hook for common listeners:

```tsx
// hooks/useSubscription.ts
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { subscriptionFromFirestore, type Subscription } from "@/models/subscription";

export function useSubscription(
  subscriptionId: string | null
): {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
} {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          } as any);
          setSubscription(subData);
          setError(null);
        } else {
          setSubscription(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to subscription:", err);
        setError("Failed to load subscription");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [subscriptionId]);

  return { subscription, loading, error };
}
```

**Usage:**
```tsx
function SubscriptionStatus({ subscriptionId }: { subscriptionId: string }) {
  const { subscription, loading, error } = useSubscription(subscriptionId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!subscription) return <div>No subscription found</div>;

  return <div>Status: {subscription.status}</div>;
}
```

### Multiple Listeners

Listen to multiple documents simultaneously:

```tsx
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

function MultiUserView({ userIds }: { userIds: string[] }) {
  const [users, setUsers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userIds.length === 0) {
      setUsers({});
      setLoading(false);
      return;
    }

    const firestore = getFirestoreInstance();
    const unsubscribes: (() => void)[] = [];

    // Create listener for each user ID
    userIds.forEach((userId) => {
      const userRef = doc(firestore, "users", userId);

      const unsubscribe = onSnapshot(userRef, (snapshot) => {
        setUsers((prev) => ({
          ...prev,
          [userId]: snapshot.exists() ? snapshot.data() : null,
        }));
        setLoading(false);
      });

      unsubscribes.push(unsubscribe);
    });

    // Cleanup all listeners
    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [userIds]);

  return (
    <div>
      {Object.entries(users).map(([userId, user]) => (
        <div key={userId}>
          {user ? user.displayName : "User not found"}
        </div>
      ))}
    </div>
  );
}
```

## Connection States

### Listen to Connection State

Firestore provides connection state monitoring:

```tsx
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { onSnapshot } from "firebase/firestore";

function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const firestore = getFirestoreInstance();

    // Listen to connection state
    const unsubscribe = onSnapshot(
      firestore.collection("_").limit(0), // Dummy query for connection state
      () => setIsOnline(true), // Connected
      () => setIsOnline(false) // Disconnected
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className={`badge ${isOnline ? "badge-success" : "badge-error"}`}>
      {isOnline ? "Online" : "Offline"}
    </div>
  );
}
```

## Best Practices

### 1. Always Cleanup Listeners

✅ **Do:**
```tsx
useEffect(() => {
  const unsubscribe = onSnapshot(docRef, callback);
  return () => unsubscribe(); // Cleanup
}, [dependencies]);
```

❌ **Don't:**
```tsx
useEffect(() => {
  onSnapshot(docRef, callback);
  // Missing cleanup - memory leak!
}, [dependencies]);
```

### 2. Handle Loading and Error States

✅ **Do:**
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const unsubscribe = onSnapshot(
    ref,
    (snapshot) => {
      setData(snapshot.data());
      setLoading(false);
      setError(null);
    },
    (err) => {
      setError(err.message);
      setLoading(false);
    }
  );
  return () => unsubscribe();
}, []);
```

### 3. Use Converters for Type Safety

✅ **Do:**
```tsx
const user = userFromFirestore({
  ...snapshot.data(),
  uid: snapshot.id,
});
```

❌ **Don't:**
```tsx
const user = snapshot.data(); // No type safety
```

### 4. Optimize Queries

✅ **Do:**
```tsx
// Limit results
const q = query(
  collection(firestore, "items"),
  where("status", "==", "active"),
  limit(10)
);
```

❌ **Don't:**
```tsx
// Listening to entire collection
const q = collection(firestore, "items"); // May be expensive
```

### 5. Check Document Exists

✅ **Do:**
```tsx
onSnapshot(docRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.data();
    // Use data
  } else {
    // Handle document doesn't exist
  }
});
```

## Performance Optimization

### Limit Listener Scope

Only listen to data you actually need:

```tsx
// ✅ Good: Query with filters
const q = query(
  collection(firestore, "items"),
  where("userId", "==", userId),
  where("status", "==", "active"),
  limit(10)
);

// ❌ Bad: Listen to entire collection
const q = collection(firestore, "items");
```

### Use Single Document When Possible

```tsx
// ✅ Good: Single document listener
const docRef = doc(firestore, "users", userId);
onSnapshot(docRef, callback);

// ❌ Bad: Collection query for single document
const q = query(
  collection(firestore, "users"),
  where("__name__", "==", userId)
);
```

### Debounce Rapid Updates

For frequently changing data, consider debouncing:

```tsx
import { useMemo } from "react";
import { debounce } from "lodash";

function useDebouncedListener(docRef: any, delay: number = 300) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const debouncedSetData = debounce((snapshot: any) => {
      setData(snapshot.data());
    }, delay);

    const unsubscribe = onSnapshot(docRef, debouncedSetData);
    return () => {
      unsubscribe();
      debouncedSetData.cancel();
    };
  }, [docRef, delay]);

  return data;
}
```

## Example: Subscription Status Component

Complete example of a subscription status component with real-time updates:

```tsx
"use client";

import { useEffect, useState } from "react";
import { getFirestoreInstance } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { subscriptionFromFirestore, type Subscription } from "@/models/subscription";
import Badge from "@/components/ui/Badge";

interface SubscriptionStatusProps {
  subscriptionId: string | null;
  userId: string;
}

export default function SubscriptionStatus({
  subscriptionId,
  userId,
}: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          } as any);

          // Verify subscription belongs to user
          if (subData.userId === userId) {
            setSubscription(subData);
            setError(null);
          } else {
            setError("Subscription not found");
          }
        } else {
          setSubscription(null);
          setError("Subscription not found");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to subscription:", err);
        setError("Failed to load subscription");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [subscriptionId, userId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm"></span>
        <span>Loading subscription...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div>
        <Badge variant="warning">No active subscription</Badge>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "canceled":
      case "past_due":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold">Status:</span>
        <Badge variant={getStatusVariant(subscription.status)}>
          {subscription.status}
        </Badge>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <div className="text-warning">
          Subscription will cancel at end of period
        </div>
      )}

      <div className="text-sm text-base-content/70">
        Next billing: {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
      </div>
    </div>
  );
}
```

## Troubleshooting

### Listener Not Updating

- ✅ Check if listener is properly subscribed
- ✅ Verify document exists in Firestore
- ✅ Check Firestore security rules
- ✅ Verify converter functions work correctly

### Memory Leaks

- ✅ Always return cleanup function from `useEffect`
- ✅ Unsubscribe when component unmounts
- ✅ Clear listeners when dependencies change

### Performance Issues

- ✅ Limit query results with `.limit()`
- ✅ Use filters to reduce scope
- ✅ Consider pagination for large collections
- ✅ Debounce rapid updates if needed

## Learn More

- [Database Queries Tutorial](./database-queries) - Firestore queries
- [Real-time Sync Features](../features/realtime-sync) - Feature documentation
- [Firestore Real-time Documentation](https://firebase.google.com/docs/firestore/query-data/listen) - Official docs
