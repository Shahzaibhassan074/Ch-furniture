"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { MediaUploader, type UploadedMedia } from "@/components/admin/MediaUploader";
import { updateSettings } from "@/app/actions/admin";

type Settings = Record<string, any>;

const field =
  "w-full rounded-lg border border-inkBorder bg-white px-4 py-2.5 text-ink placeholder:text-inkMuted/60 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra/20 transition-colors";
const label = "block text-[11px] font-sans font-medium uppercase tracking-wider text-inkMuted mb-1.5";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
      <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [og,                      setOg]                      = useState<string>(settings.ogImageUrl || "");
  const [founderImg,              setFounderImg]              = useState<string>(settings.founderImageUrl || "");
  const [processImg,              setProcessImg]              = useState<string>(settings.processImageUrl || "");
  const [workshopVideoDesktop,    setWorkshopVideoDesktop]    = useState<string>(settings.workshopVideoDesktopUrl || "");
  const [workshopDesktopPoster,   setWorkshopDesktopPoster]   = useState<string>(settings.workshopVideoDesktopPosterUrl || "");
  const [workshopVideoMobile,     setWorkshopVideoMobile]     = useState<string>(settings.workshopVideoMobileUrl || "");
  const [workshopMobilePoster,    setWorkshopMobilePoster]    = useState<string>(settings.workshopVideoMobilePosterUrl || "");
  const [saving, setSaving] = useState(false);

  async function action(formData: FormData) {
    setSaving(true);
    formData.set("ogImageUrl", og);
    formData.set("founderImageUrl", founderImg);
    formData.set("processImageUrl", processImg);
    formData.set("workshopVideoDesktopUrl",       workshopVideoDesktop);
    formData.set("workshopVideoDesktopPosterUrl", workshopDesktopPoster);
    formData.set("workshopVideoMobileUrl",        workshopVideoMobile);
    formData.set("workshopVideoMobilePosterUrl",  workshopMobilePoster);
    try {
      await updateSettings(formData);
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  const f = (k: string) => settings[k] ?? "";

  return (
    <div>
      <div>
        <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">Configuration</p>
        <h1 className="mt-1 font-display text-4xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-inkMuted">Brand, contact, social, SEO and About-page content.</p>
      </div>

      <form action={action} className="mt-8 space-y-6">
        <Section title="Brand">
          <div>
            <label className={label}>Brand name</label>
            <input name="brandName" defaultValue={f("brandName")} className={field} />
          </div>
          <div>
            <label className={label}>Tagline</label>
            <input name="tagline" defaultValue={f("tagline")} className={field} />
          </div>
          <div>
            <label className={label}>Short description</label>
            <textarea name="description" defaultValue={f("description")} rows={3} className={field} />
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label}>Phone</label>
              <input name="phone" defaultValue={f("phone")} className={field} />
            </div>
            <div>
              <label className={label}>WhatsApp number</label>
              <input name="whatsapp" defaultValue={f("whatsapp")} className={field} />
            </div>
            <div>
              <label className={label}>Email</label>
              <input name="email" type="email" defaultValue={f("email")} placeholder="optional" className={field} />
            </div>
            <div>
              <label className={label}>Business hours</label>
              <input name="businessHours" defaultValue={f("businessHours")} className={field} />
            </div>
          </div>
          <div>
            <label className={label}>Address</label>
            <textarea name="address" defaultValue={f("address")} rows={2} className={field} />
          </div>
          <div>
            <label className={label}>Prefilled WhatsApp message</label>
            <textarea name="whatsappMessage" defaultValue={f("whatsappMessage")} rows={3} className={field} />
          </div>
          <div>
            <label className={label}>Google Maps embed URL (optional)</label>
            <input
              name="mapEmbedUrl"
              defaultValue={f("mapEmbedUrl")}
              placeholder="Leave blank to auto-generate from address"
              className={field}
            />
          </div>
        </Section>

        <Section title="Social links">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label}>Facebook</label>
              <input name="facebook" defaultValue={f("facebook")} className={field} />
            </div>
            <div>
              <label className={label}>Instagram</label>
              <input name="instagram" defaultValue={f("instagram")} className={field} />
            </div>
            <div>
              <label className={label}>YouTube</label>
              <input name="youtube" defaultValue={f("youtube")} className={field} />
            </div>
            <div>
              <label className={label}>TikTok</label>
              <input name="tiktok" defaultValue={f("tiktok")} className={field} />
            </div>
            <div>
              <label className={label}>LinkedIn</label>
              <input name="linkedin" defaultValue={f("linkedin")} className={field} />
            </div>
          </div>
        </Section>

        <Section title="About page & stats">
          <div>
            <label className={label}>Founder photo</label>
            {founderImg && (
              <div className="relative mb-2 aspect-[4/5] max-w-[180px] overflow-hidden rounded-2xl">
                <Image src={founderImg} alt="Founder" fill className="object-cover" />
              </div>
            )}
            <MediaUploader
              resourceType="image"
              onUploaded={(m: UploadedMedia[]) => m[0] && setFounderImg(m[0].url)}
            />
          </div>
          <div>
            <label className={label}>Process section image (workshop / craftsmen)</label>
            {processImg && (
              <div className="relative mb-2 aspect-[4/5] max-w-[180px] overflow-hidden rounded-2xl">
                <Image src={processImg} alt="Process" fill className="object-cover" />
              </div>
            )}
            <MediaUploader
              resourceType="image"
              onUploaded={(m: UploadedMedia[]) => m[0] && setProcessImg(m[0].url)}
            />
          </div>
          <div>
            <label className={label}>Story</label>
            <textarea name="aboutStory" defaultValue={f("aboutStory")} rows={3} className={field} />
          </div>
          <div>
            <label className={label}>Experience paragraph</label>
            <textarea name="aboutExperience" defaultValue={f("aboutExperience")} rows={3} className={field} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label}>Mission</label>
              <textarea name="aboutMission" defaultValue={f("aboutMission")} rows={2} className={field} />
            </div>
            <div>
              <label className={label}>Vision</label>
              <textarea name="aboutVision" defaultValue={f("aboutVision")} rows={2} className={field} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-4">
            <div>
              <label className={label}>Years</label>
              <input name="yearsExperience" type="number" defaultValue={f("yearsExperience")} className={field} />
            </div>
            <div>
              <label className={label}>Projects</label>
              <input name="projectsCompleted" type="number" defaultValue={f("projectsCompleted")} className={field} />
            </div>
            <div>
              <label className={label}>Clients</label>
              <input name="happyClients" type="number" defaultValue={f("happyClients")} className={field} />
            </div>
            <div>
              <label className={label}>Craftsmen</label>
              <input name="craftsmenCount" type="number" defaultValue={f("craftsmenCount")} className={field} />
            </div>
          </div>
        </Section>

        <Section title="Workshop Banner Videos">
          <p className="text-sm text-inkMuted -mt-2">
            Videos for the &quot;The Workshop&quot; card on the homepage. Leave the desktop video blank to keep the static photo.
            If the mobile video is empty, the desktop video is used on mobile too.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label}>Desktop video (1920×1080)</label>
              <input
                value={workshopVideoDesktop}
                onChange={(e) => setWorkshopVideoDesktop(e.target.value)}
                placeholder="Paste Cloudinary / CDN URL, or upload below"
                className={field}
              />
              <div className="mt-2">
                <MediaUploader
                  resourceType="video"
                  onUploaded={(m: UploadedMedia[]) => m[0] && setWorkshopVideoDesktop(m[0].url)}
                />
              </div>
            </div>
            <div>
              <label className={label}>Desktop poster image</label>
              {workshopDesktopPoster && (
                <div className="relative mb-2 aspect-video max-w-[220px] overflow-hidden rounded-lg">
                  <Image src={workshopDesktopPoster} alt="Desktop poster" fill className="object-cover" />
                </div>
              )}
              <input
                value={workshopDesktopPoster}
                onChange={(e) => setWorkshopDesktopPoster(e.target.value)}
                placeholder="Paste URL, or upload below"
                className={field}
              />
              <div className="mt-2">
                <MediaUploader
                  resourceType="image"
                  onUploaded={(m: UploadedMedia[]) => m[0] && setWorkshopDesktopPoster(m[0].url)}
                />
              </div>
            </div>
            <div>
              <label className={label}>Mobile video (1080×1350) — optional</label>
              <input
                value={workshopVideoMobile}
                onChange={(e) => setWorkshopVideoMobile(e.target.value)}
                placeholder="Leave blank to use desktop video on mobile"
                className={field}
              />
              <div className="mt-2">
                <MediaUploader
                  resourceType="video"
                  onUploaded={(m: UploadedMedia[]) => m[0] && setWorkshopVideoMobile(m[0].url)}
                />
              </div>
            </div>
            <div>
              <label className={label}>Mobile poster image — optional</label>
              {workshopMobilePoster && (
                <div className="relative mb-2 aspect-[4/5] max-w-[110px] overflow-hidden rounded-lg">
                  <Image src={workshopMobilePoster} alt="Mobile poster" fill className="object-cover" />
                </div>
              )}
              <input
                value={workshopMobilePoster}
                onChange={(e) => setWorkshopMobilePoster(e.target.value)}
                placeholder="Leave blank to use desktop poster"
                className={field}
              />
              <div className="mt-2">
                <MediaUploader
                  resourceType="image"
                  onUploaded={(m: UploadedMedia[]) => m[0] && setWorkshopMobilePoster(m[0].url)}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title="SEO">
          <div>
            <label className={label}>SEO title</label>
            <input name="seoTitle" defaultValue={f("seoTitle")} className={field} />
          </div>
          <div>
            <label className={label}>SEO description</label>
            <textarea name="seoDescription" defaultValue={f("seoDescription")} rows={2} className={field} />
          </div>
          <div>
            <label className={label}>SEO keywords (comma-separated)</label>
            <textarea name="seoKeywords" defaultValue={f("seoKeywords")} rows={2} className={field} />
          </div>
          <div>
            <label className={label}>Default OG / share image</label>
            {og && (
              <div className="relative mb-2 aspect-[1200/630] max-w-md overflow-hidden rounded-lg">
                <Image src={og} alt="" fill className="object-cover" />
              </div>
            )}
            <MediaUploader
              resourceType="image"
              onUploaded={(m: UploadedMedia[]) => m[0] && setOg(m[0].url)}
            />
          </div>
        </Section>

        <div className="sticky bottom-0 -mx-8 border-t border-inkBorder bg-parchment/95 px-8 py-4 backdrop-blur">
          <button type="submit" disabled={saving} className="btn-terra disabled:opacity-60">
            {saving ? "Saving…" : "Save all settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
