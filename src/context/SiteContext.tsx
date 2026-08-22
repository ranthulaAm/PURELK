import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SiteItem, SiteSettings, ContactSubmission, AdminUser, AnalyticsSummary, ItemType } from '../types';
import { db, auth, storage } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { starterItems, defaultSettings, starterAdmins } from '../data/starterData';

interface SiteContextType {
  items: SiteItem[];
  settings: SiteSettings;
  submissions: ContactSubmission[];
  admins: AdminUser[];
  currentAdmin: { email: string; displayName: string; role: string } | null;
  analytics: AnalyticsSummary;
  saveItem: (item: Partial<SiteItem> & { title: string; type: ItemType }) => Promise<SiteItem>;
  deleteItem: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  submitInquiry: (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service?: string;
    budget?: string;
    message: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  setSubmissionStatus: (id: string, status: 'new' | 'read') => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;
  loginAdmin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  trackView: (path: string) => void;
  uploadMedia: (file: File) => Promise<{ key: string; url: string }>;
  resetToDefaults: () => void;
}

const SiteContext = createContext<SiteContextType | null>(null);

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<SiteItem[]>(starterItems);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>(starterAdmins);
  const [pageViews, setPageViews] = useState<{ path: string; count: number }[]>([]);
  
  const [currentAdmin, setCurrentAdmin] = useState<{ email: string; displayName: string; role: string } | null>(null);

  // Initial Seed check
  const checkInitialSeed = async () => {
    try {
      const q = query(collection(db, 'site_items'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // Seed initial items
        for (const item of starterItems) {
          await setDoc(doc(db, 'site_items', item.id), item);
        }
        // Seed initial settings
        for (const [key, value] of Object.entries(defaultSettings)) {
          await setDoc(doc(db, 'site_settings', key), { value: String(value) });
        }
        // Seed admins
        for (const admin of starterAdmins) {
          await setDoc(doc(db, 'admin_users', admin.email), admin);
        }
      }
    } catch (e) {
      console.warn('Check seed skipped', e);
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const adminDoc = await getDoc(doc(db, 'admin_users', user.email));
        let role = 'editor';
        let name = user.email.split('@')[0];
        
        if (adminDoc.exists()) {
          role = adminDoc.data().role;
          name = adminDoc.data().name || name;
        } else if (user.email === 'ranthulaicloud112@gmail.com' || user.email === 'dineththeekshana67@gmail.com') {
          role = 'owner';
          // Auto add them to firestore
          await setDoc(doc(db, 'admin_users', user.email), { email: user.email, name, role });
        }

        setCurrentAdmin({
          email: user.email,
          displayName: name,
          role,
        });
      } else {
        setCurrentAdmin(null);
      }
    });
    checkInitialSeed();
    return () => unsubscribe();
  }, []);

  // Listeners for Data
  useEffect(() => {
    const unsubItems = onSnapshot(collection(db, 'site_items'), (snapshot) => {
      const newItems: SiteItem[] = [];
      snapshot.forEach((d) => newItems.push(d.data() as SiteItem));
      if (newItems.length > 0) setItems(newItems);
    });

    const unsubSettings = onSnapshot(collection(db, 'site_settings'), (snapshot) => {
      const newSettings: any = {};
      snapshot.forEach((d) => {
        newSettings[d.id] = d.data().value;
      });
      if (Object.keys(newSettings).length > 0) {
        setSettings((prev) => ({ ...defaultSettings, ...prev, ...newSettings }));
      }
    });

    return () => { unsubItems(); unsubSettings(); };
  }, []);

  // Listeners for protected data (Admins only)
  useEffect(() => {
    let unsubSubs: () => void = () => {};
    let unsubAdmins: () => void = () => {};
    let unsubViews: () => void = () => {};

    if (currentAdmin) {
      unsubSubs = onSnapshot(query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc')), (snapshot) => {
        const newSubs: ContactSubmission[] = [];
        snapshot.forEach((d) => newSubs.push(d.data() as ContactSubmission));
        setSubmissions(newSubs);
      });

      unsubAdmins = onSnapshot(collection(db, 'admin_users'), (snapshot) => {
        const newAdmins: AdminUser[] = [];
        snapshot.forEach((d) => newAdmins.push(d.data() as AdminUser));
        setAdmins(newAdmins);
      });

      unsubViews = onSnapshot(collection(db, 'page_views'), (snapshot) => {
        const pathCounts: Record<string, number> = {};
        snapshot.forEach((d) => {
          const path = d.data().path;
          pathCounts[path] = (pathCounts[path] || 0) + 1;
        });
        const viewArr = Object.entries(pathCounts).map(([path, count]) => ({ path, count }));
        setPageViews(viewArr.sort((a, b) => b.count - a.count));
      });
    }

    return () => { unsubSubs(); unsubAdmins(); unsubViews(); };
  }, [currentAdmin]);

  const trackView = async (path: string) => {
    try {
      const newDoc = doc(collection(db, 'page_views'));
      await setDoc(newDoc, {
        id: newDoc.id,
        path,
        createdAt: new Date().toISOString(),
        visitorId: 'anon',
        referrer: document.referrer || '',
      });
    } catch (e) {}
  };

  const saveItem = async (data: Partial<SiteItem> & { title: string; type: ItemType }): Promise<SiteItem> => {
    const id = data.id || `${data.type}-${crypto.randomUUID().slice(0, 8)}`;
    const newItem: SiteItem = {
      id,
      type: data.type,
      sortOrder: data.sortOrder ?? items.filter((x) => x.type === data.type).length + 1,
      title: data.title.trim(),
      subtitle: data.subtitle || '',
      body: data.body || '',
      meta: data.meta || '',
      imageKey: data.imageKey || '',
      slug: data.slug ? slugify(data.slug) : slugify(data.title),
      seoTitle: data.seoTitle || `${data.title} | PURE.LK`,
      seoDescription: data.seoDescription || (data.body || '').slice(0, 160),
      publishedAt: data.publishedAt || new Date().toISOString().slice(0, 10),
      deliverables: data.deliverables || '',
      process: data.process || '',
      sectors: data.sectors || '',
      price: data.price || '',
      status: data.status || 'published',
      ...(data as any) // Override with existing if update
    };
    await setDoc(doc(db, 'site_items', id), newItem, { merge: true });
    return newItem;
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'site_items', id));
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    for (const [key, value] of Object.entries(newSettings)) {
      if (value !== undefined) {
        await setDoc(doc(db, 'site_settings', key), { value: String(value) });
      }
    }
  };

  const submitInquiry = async (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service?: string;
    budget?: string;
    message: string;
  }) => {
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      return { ok: false, error: 'Name, email, and message are required.' };
    }
    try {
      const id = `sub-${crypto.randomUUID().slice(0, 8)}`;
      const newSub: ContactSubmission = {
        id,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || '',
        company: data.company?.trim() || '',
        service: data.service?.trim() || '',
        budget: data.budget?.trim() || '',
        message: data.message.trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'contact_submissions', id), newSub);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  };

  const setSubmissionStatus = async (id: string, status: 'new' | 'read') => {
    await updateDoc(doc(db, 'contact_submissions', id), { status });
  };

  const deleteSubmission = async (id: string) => {
    await deleteDoc(doc(db, 'contact_submissions', id));
  };

  const removeAdmin = async (email: string) => {
    await deleteDoc(doc(db, 'admin_users', email));
  };

  const loginAdmin = async (email: string, password?: string) => {
    try {
      try {
        await signInWithEmailAndPassword(auth, email, password || 'Admin123!');
      } catch (e: any) {
        if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
          // Check if user is allowed to be auto-created
          let allowed = false;
          if (email === 'ranthulaicloud112@gmail.com' || email === 'dineththeekshana67@gmail.com') {
            allowed = true;
          }

          if (allowed) {
            try {
              await createUserWithEmailAndPassword(auth, email, password || 'Admin123!');
            } catch (createErr: any) {
              if (createErr.code === 'auth/email-already-in-use') {
                 throw new Error('Incorrect password for this account.');
              }
              throw createErr;
            }
          } else {
            throw new Error('Not authorized to access this admin panel. Please ensure the user is added in Firebase Auth.');
          }
        } else {
          throw e;
        }
      }

      // Sync the user to admin_users collection so they show up in the Admin list
      await setDoc(doc(db, 'admin_users', email.toLowerCase()), {
        email: email.toLowerCase(),
        name: email.toLowerCase().split('@')[0],
        role: (email === 'ranthulaicloud112@gmail.com' || email === 'dineththeekshana67@gmail.com') ? 'owner' : 'editor',
        lastLogin: new Date().toISOString()
      }, { merge: true });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const logoutAdmin = () => {
    signOut(auth);
  };

  const uploadMedia = async (file: File): Promise<{ key: string; url: string }> => {
    return new Promise((resolve, reject) => {
      const key = `site-media/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, key);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        () => {}, 
        (error) => {
          reject(error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ key, url: downloadURL });
        }
      );
    });
  };

  const resetToDefaults = () => {
    // Optional implementation
  };

  const totalViews = pageViews.reduce((acc, cur) => acc + cur.count, 0);

  return (
    <SiteContext.Provider
      value={{
        items,
        settings,
        submissions,
        admins,
        currentAdmin,
        analytics: { total: totalViews, paths: pageViews },
        saveItem,
        deleteItem,
        updateSettings,
        submitInquiry,
        setSubmissionStatus,
        deleteSubmission,
        removeAdmin,
        loginAdmin,
        logoutAdmin,
        trackView,
        uploadMedia,
        resetToDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
