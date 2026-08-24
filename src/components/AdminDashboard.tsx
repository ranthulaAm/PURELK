import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { SiteItem, ItemType } from '../types';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

const tabs = [
  'general',
  'navigation',
  'project',
  'service',
  'team',
  'testimonial',
  'blog',
  'inbox',
  'analytics',
  'seo',
  'social',
  'admins',
  'contact',
] as const;

type TabKey = (typeof tabs)[number];

const labels: Record<string, string> = {
  general: 'Website',
  navigation: 'Navigation',
  project: 'Portfolio',
  service: 'Services',
  team: 'Team',
  testimonial: 'Testimonials',
  blog: 'Blog / News',
  inbox: 'Inbox',
  analytics: 'Analytics',
  seo: 'SEO',
  social: 'Social Links',
  admins: 'Admin Users',
  contact: 'Contact',
};

const itemTypes = ['project', 'service', 'team', 'testimonial', 'blog'];

const navigationFields = [
  ['navLabel1', 'Link 1 (Portfolio section)', 'Work'],
  ['navLabel2', 'Link 2 (Services page)', 'What We Do'],
  ['navLabel3', 'Link 3 (About section)', 'About'],
  ['navLabel4', 'Link 4 (Blog page)', 'Insights'],
];

const generalFields = [
  ['eyebrow', 'Eyebrow badge', 'Independent creative agency · Sri Lanka'],
  ['heroLine1', 'Hero Line 1', 'WE CREATE'],
  ['heroAccent', 'Hero Highlight Line 2', 'WHAT MOVES'],
  ['heroLine3', 'Hero Line 3', 'PEOPLE.'],
  ['heroDescription', 'Hero description', 'Strategy, stories and experiences for brands ready to stand out—not just show up.'],
  ['ticker', 'Ticker marquee', 'PURE IDEAS ✦ REAL IMPACT ✦ BUILT DIFFERENT ✦'],
  ['workHeading', 'Work section heading', 'Ideas that earned attention.'],
  ['servicesHeading', 'Services section heading', 'Creativity with a job to do.'],
  ['aboutKicker', 'About kicker', 'Our point of view'],
  ['aboutHeading', 'About heading', 'Not another agency. A creative force.'],
  ['aboutBody', 'About body', 'PURE.LK is a new-generation creative agency combining strategy, culture, technology and craft.'],
  ['teamHeading', 'Team heading', 'Small team. Big energy.'],
];

const contactFields = [
  ['contactKicker', 'Contact kicker', 'Have a project in mind?'],
  ['contactLine1', 'Contact Line 1', 'LET’S MAKE'],
  ['contactAccent', 'Contact Highlight Line', 'SOMETHING'],
  ['contactLine3', 'Contact Line 3', 'UNMISSABLE.'],
  ['whatsapp', 'WhatsApp number (with country code, no +)', '94770000000'],
  ['email', 'Public email', 'hello@purelk.com'],
  ['footerText', 'Footer text', 'Creative agency · Sri Lanka'],
];

const seoFields = [
  ['seoTitle', 'Default title', 'PURE.LK — Creative Agency'],
  ['seoDescription', 'Meta description', 'A new-generation Sri Lankan creative agency building ideas, stories and experiences that move people.'],
  ['seoKeywords', 'Keywords (comma-separated)', 'creative agency sri lanka, marketing, branding, video production'],
  ['blogHeading', 'Insights heading', 'PURE INSIGHTS'],
  ['blogDescription', 'Insights description', 'Thinking for brands that want to move forward.'],
];

const socialFields = [
  ['instagram', 'Instagram URL', 'https://instagram.com/purelk'],
  ['facebook', 'Facebook URL', 'https://facebook.com/purelk'],
  ['linkedin', 'LinkedIn URL', 'https://linkedin.com/company/purelk'],
  ['tiktok', 'TikTok URL', 'https://tiktok.com/@purelk'],
  ['youtube', 'YouTube URL', 'https://youtube.com/@purelk'],
];

const blank: Partial<SiteItem> = {
  title: '',
  subtitle: '',
  body: '',
  meta: '',
  imageKey: '',
  slug: '',
  seoTitle: '',
  seoDescription: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  deliverables: '',
  process: '',
  sectors: '',
  price: '',
  status: 'published',
  sortOrder: 1,
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    items,
    settings,
    submissions,
    admins,
    currentAdmin,
    analytics,
    saveItem,
    deleteItem,
    updateSettings,
    setSubmissionStatus,
    deleteSubmission,
    removeAdmin,
    logoutAdmin,
    uploadMedia,
  } = useSite();

  const [active, setActive] = useState<TabKey>('general');
  const [localSettings, setLocalSettings] = useState(settings);
  const [draft, setDraft] = useState<Partial<SiteItem>>({ ...blank, type: 'project' });
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const displayName = currentAdmin?.displayName || currentAdmin?.email || 'Admin';
  const visible = items.filter((x) => x.type === active);
  const unreadCount = submissions.filter((s) => s.status === 'new').length;

  const switchTab = (t: TabKey) => {
    setActive(t);
    setDraft({ ...blank, type: itemTypes.includes(t) ? (t as ItemType) : 'project' });
    setNotice('');
  };

  const handleSaveSettings = async () => {
    setBusy(true);
    setNotice('');
    try {
      await updateSettings(localSettings);
      setNotice('Website updated.');
    } catch {
      setNotice('Failed to update settings.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveItem = async () => {
    if (!draft.title?.trim()) {
      setNotice('Title is required.');
      return;
    }
    setBusy(true);
    setNotice('');
    try {
      await saveItem({
        ...draft,
        title: draft.title.trim(),
        type: (draft.type || active) as ItemType,
      });
      setDraft({ ...blank, type: active as ItemType });
      setNotice('Saved successfully.');
    } catch {
      setNotice('Failed to save item.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteItem(id);
      if (draft.id === id) {
        setDraft({ ...blank, type: active as ItemType });
      }
    } catch {
      setNotice('Failed to delete item.');
    }
  };

  const upload = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      setNotice('Image must be under 4 MB.');
      return;
    }
    setUploading(true);
    setNotice('');
    try {
      const res = await uploadMedia(file);
      setDraft((prev) => ({ ...prev, imageKey: res.url }));
      setNotice('Image uploaded. Save the item.');
    } catch (e: any) {
      console.error('Upload error', e);
      setNotice('Upload failed. (Storage may not be enabled)');
    } finally {
      setUploading(false);
    }
  };

  const settingForm = (fields: string[][]) => (
    <div className="settings-card">
      {fields.map(([k, l, p]) => (
        <label key={k}>
          {l}
          {['heroDescription', 'aboutBody', 'seoDescription', 'blogDescription'].includes(k) ? (
            <textarea
              rows={4}
              value={localSettings[k] || ''}
              placeholder={p}
              onChange={(e) => setLocalSettings({ ...localSettings, [k]: e.target.value })}
            />
          ) : (
            <input
              value={localSettings[k] || ''}
              placeholder={p}
              onChange={(e) => setLocalSettings({ ...localSettings, [k]: e.target.value })}
            />
          )}
        </label>
      ))}
      <p className="notice">{notice}</p>
      <button className="save" disabled={busy} onClick={handleSaveSettings}>
        {busy ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );

  return (
    <main className="admin-shell">
      <aside>
        <a
          href="/"
          className="admin-logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
        >
          <img src="/purelk-wordmark.png" alt="PURE.LK" />
        </a>
        <p>CONTENT STUDIO PRO</p>
        <nav>
          {tabs.map((t) => (
            <button
              key={t}
              className={active === t ? 'active' : ''}
              onClick={() => switchTab(t)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                <span>{labels[t]}</span>
                {itemTypes.includes(t) && (
                  <b style={{ marginLeft: 'auto' }}>{items.filter((x) => x.type === t).length}</b>
                )}
                {t === 'inbox' && unreadCount > 0 && (
                  <span className="unread-dot" style={{
                    marginLeft: 'auto',
                    background: 'var(--red, #f43f5e)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>{unreadCount}</span>
                )}
              </div>
            </button>
          ))}
        </nav>
        <a
          className="view-site"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
        >
          View website ↗
        </a>
      </aside>

      <section className="admin-main">
        <header>
          <div>
            <p>Signed in as</p>
            <h1>{displayName}</h1>
          </div>
          <button
            onClick={() => {
              logoutAdmin();
              onNavigate('/admin/login');
            }}
          >
            Sign out
          </button>
        </header>

        <div className="admin-title">
          <div>
            <p>Manage PURE.LK</p>
            <h2>{labels[active]}</h2>
          </div>
          <span>LIVE SYSTEM</span>
        </div>

        {active === 'general' && settingForm(generalFields)}
        {active === 'navigation' && settingForm(navigationFields)}
        {active === 'contact' && settingForm(contactFields)}
        {active === 'seo' && settingForm(seoFields)}
        {active === 'social' && settingForm(socialFields)}

        {itemTypes.includes(active) && (
          <div className="admin-grid">
            <div className="item-list">
              {visible.length === 0 && (
                <div className="empty">No {labels[active].toLowerCase()} yet.</div>
              )}
              {visible.map((x) => (
                <article key={x.id}>
                  {x.imageKey ? (
                    <img className="item-thumb" src={x.imageKey} alt="" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="item-thumb placeholder">{x.meta || '+'}</div>
                  )}
                  <div className="item-copy">
                    <small>{x.subtitle || labels[active]}</small>
                    <h3>{x.title}</h3>
                    <p>{x.body || x.meta}</p>
                  </div>
                  <div className="row-actions">
                    <button onClick={() => setDraft({ ...x })}>Edit</button>
                    <button className="danger" onClick={() => remove(x.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="editor">
              <p className="editor-kicker">{draft.id ? 'Edit item' : 'Add new'}</p>

              {['project', 'team', 'blog', 'service'].includes(active) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="upload-zone">
                    {draft.imageKey ? (
                      <img src={draft.imageKey} alt="Preview" referrerPolicy="no-referrer" />
                    ) : (
                      <span>{uploading ? 'Uploading…' : '＋ Upload image'}</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                    />
                  </label>
                  <label>
                    Or paste an image URL directly:
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={draft.imageKey || ''}
                      onChange={(e) => setDraft({ ...draft, imageKey: e.target.value })}
                    />
                  </label>
                </div>
              )}

              <label>
                Title
                <input
                  value={draft.title || ''}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </label>

              <label>
                Subtitle / category
                <input
                  value={draft.subtitle || ''}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                />
              </label>

              <label>
                Description / article
                <textarea
                  rows={active === 'blog' ? 10 : 5}
                  value={draft.body || ''}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </label>

              <label>
                {active === 'service' ? 'Starting price / quotation text' : 'Extra detail'}
                <input
                  value={draft.meta || ''}
                  onChange={(e) => setDraft({ ...draft, meta: e.target.value })}
                />
              </label>

              {(active === 'service' || active === 'project') && (
                <>
                  <label>
                    What we deliver (one per line)
                    <textarea
                      rows={6}
                      value={draft.deliverables || ''}
                      onChange={(e) => setDraft({ ...draft, deliverables: e.target.value })}
                    />
                  </label>
                  <label>
                    Our process (one step per line)
                    <textarea
                      rows={6}
                      value={draft.process || ''}
                      onChange={(e) => setDraft({ ...draft, process: e.target.value })}
                    />
                  </label>
                  <label>
                    Suitable sectors (one per line)
                    <textarea
                      rows={5}
                      value={draft.sectors || ''}
                      onChange={(e) => setDraft({ ...draft, sectors: e.target.value })}
                    />
                  </label>
                  <label>
                    Price / quote note
                    <input
                      value={draft.price || ''}
                      onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                    />
                  </label>
                  <label>
                    Visibility
                    <select
                      value={draft.status || 'published'}
                      onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </label>
                </>
              )}

              {['project', 'blog', 'service'].includes(active) && (
                <>
                  <label>
                    Page URL slug
                    <input
                      value={draft.slug || ''}
                      placeholder="my-project"
                      onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                    />
                  </label>
                  <label>
                    SEO title
                    <input
                      value={draft.seoTitle || ''}
                      onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })}
                    />
                  </label>
                  <label>
                    SEO description
                    <textarea
                      rows={3}
                      value={draft.seoDescription || ''}
                      onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })}
                    />
                  </label>
                  <label>
                    Publish date
                    <input
                      type="date"
                      value={draft.publishedAt || ''}
                      onChange={(e) => setDraft({ ...draft, publishedAt: e.target.value })}
                    />
                  </label>
                </>
              )}

              <label>
                Display order
                <input
                  type="number"
                  value={draft.sortOrder ?? ''}
                  onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value ? Number(e.target.value) : 0 })}
                />
              </label>

              <p className="notice">{notice}</p>

              <button
                className="save"
                disabled={busy || uploading}
                onClick={handleSaveItem}
              >
                {busy ? 'Saving…' : draft.id ? 'Update item' : 'Add item'}
              </button>

              {draft.id && (
                <button
                  className="cancel"
                  onClick={() => setDraft({ ...blank, type: active as ItemType })}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {active === 'inbox' && (
          <div className="inbox-list">
            {submissions.length ? (
              submissions.map((x) => (
                <article key={x.id} className={x.status === 'new' ? 'unread' : ''}>
                  <header>
                    <div>
                      <b>{x.name}</b>
                      <span>{x.email} · {x.phone}</span>
                    </div>
                    <small>{new Date(x.createdAt).toLocaleString()}</small>
                  </header>
                  <p>{x.message}</p>
                  <footer>
                    <span>
                      {x.company} {x.service && `· ${x.service}`} {x.budget && `· ${x.budget}`}
                    </span>
                    <div>
                      <button
                        onClick={() =>
                          setSubmissionStatus(x.id, x.status === 'new' ? 'read' : 'new')
                        }
                      >
                        {x.status === 'new' ? 'Mark read' : 'Mark unread'}
                      </button>
                      <button onClick={() => deleteSubmission(x.id)}>
                        Delete
                      </button>
                    </div>
                  </footer>
                </article>
              ))
            ) : (
              <div className="empty">No inquiries yet.</div>
            )}
          </div>
        )}

        {active === 'analytics' && (
          <div>
            <div className="metric">
              <span>Total page views</span>
              <b>{analytics.total || 0}</b>
            </div>
            <div className="analytics-list">
              {analytics.paths?.map((x) => (
                <div key={x.path}>
                  <span>{x.path}</span>
                  <b>{x.count}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'admins' && (
          <div className="admin-users">
            {admins.map((x) => (
              <article key={x.email}>
                <div>
                  <b>{x.name || x.email}</b>
                  <span>{x.email}</span>
                </div>
                <em>{x.role}</em>
                {x.role !== 'owner' && (
                  <button onClick={() => removeAdmin(x.email)}>Remove</button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
