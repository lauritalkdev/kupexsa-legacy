"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Gender = "male" | "female" | "prefer_not_to_say";
type MaritalStatus =
  | "single"
  | "married"
  | "divorced"
  | "widowed"
  | "prefer_not_to_say";

type Profile = {
  id: string;
  member_id: string;
  full_name: string;
  preferred_name: string | null;
  gender: Gender | null;
  date_of_birth: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  entry_year: number | null;
  graduation_year: number | null;
  badge_id: string | null;
  country_id: string | null;
  chapter_id: string | null;
  occupation_id: string | null;
  custom_chapter: string | null;
  custom_occupation: string | null;
  company: string | null;
  marital_status: MaritalStatus | null;
  biography: string | null;
  profile_photo: string | null;
  status: "pending" | "verified" | "suspended" | "inactive";
};

type BadgeOption = {
  id: string;
  display_name: string;
  badge_year: number;
  entry_year: number | null;
  graduation_year: number | null;
};

type CountryOption = {
  id: string;
  name: string;
  code: string | null;
};

type ChapterOption = {
  id: string;
  name: string;
  country_id: string | null;
  city: string | null;
  region: string | null;
  is_active: boolean;
};

type OccupationOption = {
  id: string;
  name: string;
};

interface ProfileFormProps {
  profile: Profile;
  badges: BadgeOption[];
  countries: CountryOption[];
  chapters: ChapterOption[];
  occupations: OccupationOption[];
}

function optionalValue(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function statusLabel(status: Profile["status"]) {
  switch (status) {
    case "verified":
      return "Verified Member";
    case "suspended":
      return "Suspended";
    case "inactive":
      return "Inactive";
    default:
      return "Pending Approval";
  }
}


const MAX_SOURCE_PHOTO_BYTES = 12 * 1024 * 1024;
const MAX_UPLOAD_PHOTO_BYTES = 200 * 1024;
const PROFILE_PHOTO_BUCKET = "profile-photos";
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function extensionForMimeType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function loadBrowserImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The selected image could not be processed."));
    };
    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("The selected image could not be compressed."));
    }, type, quality);
  });
}

async function compressProfilePhoto(file: File): Promise<File> {
  if (file.size <= MAX_UPLOAD_PHOTO_BYTES) return file;

  const image = await loadBrowserImage(file);
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (Math.max(width, height) > 1200) {
    const scale = 1200 / Math.max(width, height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  let quality = 0.86;

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser could not prepare the profile photo.");
    }

    context.drawImage(image, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, "image/webp", quality);

    if (blob.size <= MAX_UPLOAD_PHOTO_BYTES) {
      return new File([blob], "profile.webp", {
        type: "image/webp",
        lastModified: Date.now(),
      });
    }

    if (quality > 0.48) {
      quality -= 0.08;
    } else {
      width = Math.max(320, Math.round(width * 0.85));
      height = Math.max(320, Math.round(height * 0.85));
      quality = 0.72;
    }
  }

  throw new Error(
    "We could not reduce this image below 200 KB. Please choose another photo."
  );
}

export default function ProfileForm({
  profile,
  badges,
  countries,
  chapters,
  occupations,
}: ProfileFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [preferredName, setPreferredName] = useState(
    profile.preferred_name ?? ""
  );
  const [gender, setGender] = useState<Gender | "">(profile.gender ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    profile.date_of_birth ?? ""
  );
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? "");
  const [entryYear, setEntryYear] = useState(
    profile.entry_year?.toString() ?? ""
  );
  const [graduationYear, setGraduationYear] = useState(
    profile.graduation_year?.toString() ?? ""
  );
  const [badgeId, setBadgeId] = useState(profile.badge_id ?? "");
  const [countryId, setCountryId] = useState(profile.country_id ?? "");
  const [chapterId, setChapterId] = useState(profile.chapter_id ?? "");
  const [customChapter, setCustomChapter] = useState(
    profile.custom_chapter ?? ""
  );
  const [occupationId, setOccupationId] = useState(
    profile.occupation_id ?? ""
  );
  const [customOccupation, setCustomOccupation] = useState(
    profile.custom_occupation ?? ""
  );
  const [company, setCompany] = useState(profile.company ?? "");
  const [maritalStatus, setMaritalStatus] = useState<
    MaritalStatus | ""
  >(profile.marital_status ?? "");
  const [biography, setBiography] = useState(profile.biography ?? "");
  const [profilePhoto, setProfilePhoto] = useState(profile.profile_photo ?? "");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(profile.profile_photo ?? "");
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const [photoNote, setPhotoNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const filteredChapters = useMemo(() => {
    if (!countryId) {
      return chapters;
    }

    return chapters.filter(
      (chapter) =>
        !chapter.country_id || chapter.country_id === countryId
    );
  }, [chapters, countryId]);

  const otherOccupation = useMemo(
    () =>
      occupations.find(
        (occupation) => occupation.name.trim().toLowerCase() === "other"
      ) ?? null,
    [occupations]
  );

  const isOtherChapter = chapterId === "__other__";
  const isOtherOccupation =
    Boolean(otherOccupation) && occupationId === otherOccupation?.id;

  const profileFields = [
    fullName,
    preferredName,
    gender,
    dateOfBirth,
    phone,
    whatsapp,
    entryYear,
    graduationYear,
    badgeId,
    countryId,
    isOtherChapter ? customChapter : chapterId,
    isOtherOccupation ? customOccupation : occupationId,
    company,
    maritalStatus,
    biography,
  ];

  const completedFields = profileFields.filter((value) =>
    String(value).trim()
  ).length;

  const completion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setMessage("");
    setMessageType("");
    setPhotoNote("");

    if (!file) return;

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setMessage("Please choose a JPEG, PNG or WebP image.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_SOURCE_PHOTO_BYTES) {
      setMessage("Profile photos must not be larger than 12 MB.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    setPhotoProcessing(true);

    try {
      const prepared = await compressProfilePhoto(file);
      if (photoPreview.startsWith("blob:")) URL.revokeObjectURL(photoPreview);

      setSelectedPhoto(prepared);
      setPhotoPreview(URL.createObjectURL(prepared));

      setPhotoNote(
        file.size <= MAX_UPLOAD_PHOTO_BYTES
          ? `Ready to upload without compression (${Math.ceil(file.size / 1024)} KB).`
          : `Compressed from ${(file.size / (1024 * 1024)).toFixed(1)} MB to ${Math.ceil(prepared.size / 1024)} KB.`
      );
    } catch (error) {
      setSelectedPhoto(null);
      setPhotoPreview(profilePhoto);
      setMessage(
        error instanceof Error
          ? error.message
          : "The selected profile photo could not be prepared."
      );
      setMessageType("error");
      event.target.value = "";
    } finally {
      setPhotoProcessing(false);
    }
  }

  async function uploadSelectedPhoto() {
    if (!selectedPhoto) return profilePhoto || null;

    const supabase = createClient();
    const extension = extensionForMimeType(selectedPhoto.type);
    const objectPath = `${profile.id}/profile.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(PROFILE_PHOTO_BUCKET)
      .upload(objectPath, selectedPhoto, {
        cacheControl: "3600",
        contentType: selectedPhoto.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(PROFILE_PHOTO_BUCKET)
      .getPublicUrl(objectPath);

    const newUrl = `${data.publicUrl}?v=${Date.now()}`;

    if (profilePhoto) {
      try {
        const oldUrl = new URL(profilePhoto);
        const marker = `/storage/v1/object/public/${PROFILE_PHOTO_BUCKET}/`;
        const index = oldUrl.pathname.indexOf(marker);
        if (index >= 0) {
          const oldPath = decodeURIComponent(
            oldUrl.pathname.slice(index + marker.length)
          );
          if (oldPath && oldPath !== objectPath) {
            await supabase.storage.from(PROFILE_PHOTO_BUCKET).remove([oldPath]);
          }
        }
      } catch {
        // An older external URL should not block a new upload.
      }
    }

    setProfilePhoto(newUrl);
    return newUrl;
  }

  function handleCountryChange(value: string) {
    setCountryId(value);

    if (!value) {
      return;
    }

    if (chapterId === "__other__") {
      return;
    }

    const currentChapter = chapters.find(
      (chapter) => chapter.id === chapterId
    );

    if (
      currentChapter?.country_id &&
      currentChapter.country_id !== value
    ) {
      setChapterId("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const normalizedFullName = fullName.trim();
    const parsedEntryYear = optionalNumber(entryYear);
    const parsedGraduationYear = optionalNumber(graduationYear);

    if (normalizedFullName.length < 2) {
      setMessage("Please enter your full name.");
      setMessageType("error");
      return;
    }

    if (
      parsedEntryYear &&
      parsedGraduationYear &&
      parsedGraduationYear < parsedEntryYear
    ) {
      setMessage(
        "Graduation year cannot be earlier than entry year."
      );
      setMessageType("error");
      return;
    }

    if (isOtherChapter && !customChapter.trim()) {
      setMessage("Please enter your KUPEXSA chapter.");
      setMessageType("error");
      return;
    }

    if (isOtherOccupation && !customOccupation.trim()) {
      setMessage("Please enter your occupation.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const uploadedProfilePhoto = await uploadSelectedPhoto();

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: normalizedFullName,
          preferred_name: optionalValue(preferredName),
          gender: gender || null,
          date_of_birth: dateOfBirth || null,
          phone: optionalValue(phone),
          whatsapp: optionalValue(whatsapp),
          entry_year: parsedEntryYear,
          graduation_year: parsedGraduationYear,
          badge_id: badgeId || null,
          country_id: countryId || null,
          chapter_id: isOtherChapter ? null : chapterId || null,
          custom_chapter: isOtherChapter
            ? optionalValue(customChapter)
            : null,
          occupation_id: occupationId || null,
          custom_occupation: isOtherOccupation
            ? optionalValue(customOccupation)
            : null,
          company: optionalValue(company),
          marital_status: maritalStatus || null,
          biography: optionalValue(biography),
          profile_photo: uploadedProfilePhoto,
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      await supabase.auth.updateUser({
        data: {
          full_name: normalizedFullName,
          preferred_name: optionalValue(preferredName),
        },
      });

      setSelectedPhoto(null);
      setPhotoNote("");
      setMessage("Your KUPEXSA profile has been updated successfully.");
      setMessageType("success");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Your profile could not be updated.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-8">
            {photoPreview ? (
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-yellow-400 shadow-xl">
                {photoPreview.startsWith("blob:") ? (
  <>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={photoPreview}
      alt={`${profile.full_name} profile preview`}
      className="h-full w-full object-cover"
    />
  </>
) : (
                  <Image
                    src={photoPreview}
                    alt={profile.full_name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                )}
              </div>
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-yellow-400/50 bg-white/10 text-4xl font-bold text-yellow-300">
                {profile.full_name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((name) => name[0]?.toUpperCase())
                  .join("") || "KPX"}
              </div>
            )}
          </div>

          <div className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-700">
              {profile.member_id}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-blue-950">
              {profile.full_name}
            </h2>

            <span className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-950">
              {statusLabel(profile.status)}
            </span>

            <div className="mt-6">
              <label
                htmlFor="profile-photo"
                className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-400"
              >
                {photoProcessing
                  ? "Preparing Photo..."
                  : profilePhoto
                    ? "Change Profile Photo"
                    : "Upload Profile Photo"}
              </label>

              <input
                id="profile-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                disabled={loading || photoProcessing}
                className="sr-only"
              />

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Choose a JPEG, PNG or WebP image up to 12 MB. Photos above
                200 KB are automatically resized and compressed before upload.
              </p>

              {photoNote && (
                <p className="mt-2 text-sm font-semibold text-green-700">
                  {photoNote}
                </p>
              )}

              {selectedPhoto && (
                <p className="mt-2 text-xs text-gray-500">
                  Your new photo will be uploaded when you save your profile.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-bold text-blue-950">
              Profile Completion
            </h2>

            <span className="text-lg font-bold text-yellow-700">
              {completion}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-950 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            Complete the remaining fields to make your profile easier for
            fellow Kupexsans to identify.
          </p>
        </section>
      </aside>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Personal Information
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-950">
            Your member details
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Fields marked with an asterisk are required.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="full-name"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Full Name *
            </label>

            <input
              id="full-name"
              name="full_name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="preferred-name"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Preferred Name
            </label>

            <input
              id="preferred-name"
              name="preferred_name"
              value={preferredName}
              onChange={(event) => setPreferredName(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={profile.email ?? ""}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              Email changes will be handled under Account Settings.
            </p>
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(event) =>
                setGender(event.target.value as Gender | "")
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">
                Prefer not to say
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date-of-birth"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Date of Birth
            </label>

            <input
              id="date-of-birth"
              name="date_of_birth"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              WhatsApp Number
            </label>

            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="my-10 border-t border-gray-200" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            School Information
          </p>

          <h2 className="mt-3 text-2xl font-bold text-blue-950">
            Your PHS journey
          </h2>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="entry-year"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Entry Year
            </label>

            <input
              id="entry-year"
              name="entry_year"
              type="number"
              min="1963"
              max="2100"
              value={entryYear}
              onChange={(event) => setEntryYear(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="graduation-year"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Graduation Year
            </label>

            <input
              id="graduation-year"
              name="graduation_year"
              type="number"
              min="1963"
              max="2100"
              value={graduationYear}
              onChange={(event) =>
                setGraduationYear(event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="badge"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Badge / Class
            </label>

            <select
              id="badge"
              name="badge_id"
              value={badgeId}
              onChange={(event) => setBadgeId(event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select badge or class</option>

              {badges.map((badge) => (
                <option key={badge.id} value={badge.id}>
                  {badge.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="my-10 border-t border-gray-200" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Location and Chapter
          </p>

          <h2 className="mt-3 text-2xl font-bold text-blue-950">
            Where you are connected
          </h2>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Country
            </label>

            <select
              id="country"
              name="country_id"
              value={countryId}
              onChange={(event) =>
                handleCountryChange(event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select country</option>

              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="chapter"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              KUPEXSA Chapter
            </label>

            <select
              id="chapter"
              name="chapter_id"
              value={chapterId}
              onChange={(event) => {
                const value = event.target.value;
                setChapterId(value);

                if (value !== "__other__") {
                  setCustomChapter("");
                }
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select chapter</option>

              {filteredChapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                  {chapter.city ? ` — ${chapter.city}` : ""}
                </option>
              ))}

              <option value="__other__">Other</option>
            </select>
          </div>

          {isOtherChapter && (
            <div className="md:col-span-2">
              <label
                htmlFor="custom-chapter"
                className="mb-2 block text-sm font-semibold text-blue-950"
              >
                Enter Your KUPEXSA Chapter
              </label>

              <input
                id="custom-chapter"
                name="custom_chapter"
                value={customChapter}
                onChange={(event) => setCustomChapter(event.target.value)}
                placeholder="e.g. Bamenda Chapter"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}
        </div>

        <div className="my-10 border-t border-gray-200" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Professional and Personal
          </p>

          <h2 className="mt-3 text-2xl font-bold text-blue-950">
            Tell the community about yourself
          </h2>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="occupation"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Occupation
            </label>

            <select
              id="occupation"
              name="occupation_id"
              value={occupationId}
              onChange={(event) => {
                const value = event.target.value;
                setOccupationId(value);

                if (value !== otherOccupation?.id) {
                  setCustomOccupation("");
                }
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select occupation</option>

              {occupations.map((occupation) => (
                <option key={occupation.id} value={occupation.id}>
                  {occupation.name}
                </option>
              ))}
            </select>
          </div>

          {isOtherOccupation && (
            <div>
              <label
                htmlFor="custom-occupation"
                className="mb-2 block text-sm font-semibold text-blue-950"
              >
                Enter Your Occupation
              </label>

              <input
                id="custom-occupation"
                name="custom_occupation"
                value={customOccupation}
                onChange={(event) => setCustomOccupation(event.target.value)}
                placeholder="Enter your occupation"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Company / Organisation
            </label>

            <input
              id="company"
              name="company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="marital-status"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Marital Status
            </label>

            <select
              id="marital-status"
              name="marital_status"
              value={maritalStatus}
              onChange={(event) =>
                setMaritalStatus(
                  event.target.value as MaritalStatus | ""
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="prefer_not_to_say">
                Prefer not to say
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="biography"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Short Biography
            </label>

            <textarea
              id="biography"
              name="biography"
              value={biography}
              onChange={(event) => setBiography(event.target.value)}
              rows={6}
              maxLength={1000}
              placeholder="Share a short introduction, your interests, achievements or how fellow Kupexsans can connect with you."
              className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {biography.length}/1000
            </p>
          </div>
        </div>

        {message && (
          <div
            role="status"
            className={`mt-8 rounded-xl border px-5 py-4 text-sm font-medium ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Your member ID and account status are managed by KUPEXSA.
          </p>

          <button
            type="submit"
            disabled={loading || photoProcessing}
            className="rounded-xl bg-blue-950 px-7 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {photoProcessing
              ? "Preparing Photo..."
              : loading
                ? "Saving Profile..."
                : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}