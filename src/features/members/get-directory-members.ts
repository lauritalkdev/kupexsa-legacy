import { createClient } from "@/lib/supabase/server";

export type DirectoryMember = {
  id: string;
  memberId: string;
  fullName: string;
  preferredName: string | null;
  phone: string | null;
  whatsapp: string | null;
  entryYear: number | null;
  graduationYear: number | null;
  company: string | null;
  biography: string | null;
  profilePhoto: string | null;
  badge: {
    id: string;
    displayName: string;
    badgeYear: number;
  } | null;
  country: {
    id: string;
    name: string;
    code: string | null;
  } | null;
  chapter: {
    id: string;
    name: string;
    city: string | null;
    region: string | null;
  } | null;
  occupation: {
    id: string;
    name: string;
  } | null;
};

export type DirectoryLookupOption = {
  id: string;
  name: string;
};

export type DirectoryBadgeOption = {
  id: string;
  displayName: string;
  badgeYear: number;
};

export type DirectoryData = {
  isLoggedIn: boolean;
  canAccessDirectory: boolean;
  members: DirectoryMember[];
  countries: DirectoryLookupOption[];
  chapters: DirectoryLookupOption[];
  occupations: DirectoryLookupOption[];
  badges: DirectoryBadgeOption[];
  error: string | null;
};

type RelationValue<T> = T | T[] | null;

type RawDirectoryMember = {
  id: string;
  member_id: string;
  full_name: string;
  preferred_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  entry_year: number | null;
  graduation_year: number | null;
  company: string | null;
  biography: string | null;
  profile_photo: string | null;
  badge: RelationValue<{
    id: string;
    display_name: string;
    badge_year: number;
  }>;
  country: RelationValue<{
    id: string;
    name: string;
    code: string | null;
  }>;
  chapter: RelationValue<{
    id: string;
    name: string;
    city: string | null;
    region: string | null;
  }>;
  occupation: RelationValue<{
    id: string;
    name: string;
  }>;
};

function firstRelation<T>(value: RelationValue<T>): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export async function getDirectoryMembers(): Promise<DirectoryData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      isLoggedIn: false,
      canAccessDirectory: false,
      members: [],
      countries: [],
      chapters: [],
      occupations: [],
      badges: [],
      error: null,
    };
  }

  const [
    membersResult,
    countriesResult,
    chaptersResult,
    occupationsResult,
    badgesResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `
          id,
          member_id,
          full_name,
          preferred_name,
          phone,
          whatsapp,
          entry_year,
          graduation_year,
          company,
          biography,
          profile_photo,
          badge:badges (
            id,
            display_name,
            badge_year
          ),
          country:countries (
            id,
            name,
            code
          ),
          chapter:chapters (
            id,
            name,
            city,
            region
          ),
          occupation:occupations (
            id,
            name
          )
        `
      )
      .eq("status", "verified")
      .order("full_name", { ascending: true }),
    supabase
      .from("countries")
      .select("id, name")
      .order("name", { ascending: true }),
    supabase
      .from("chapters")
      .select("id, name")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase
      .from("occupations")
      .select("id, name")
      .order("name", { ascending: true }),
    supabase
      .from("badges")
      .select("id, display_name, badge_year")
      .order("badge_year", { ascending: false }),
  ]);

  const firstError =
    membersResult.error ??
    countriesResult.error ??
    chaptersResult.error ??
    occupationsResult.error ??
    badgesResult.error;

  if (firstError) {
    return {
      isLoggedIn: true,
      canAccessDirectory: true,
      members: [],
      countries: [],
      chapters: [],
      occupations: [],
      badges: [],
      error: firstError.message,
    };
  }

  const members = ((membersResult.data ?? []) as RawDirectoryMember[]).map(
    (member) => {
      const badge = firstRelation(member.badge);
      const country = firstRelation(member.country);
      const chapter = firstRelation(member.chapter);
      const occupation = firstRelation(member.occupation);

      return {
        id: member.id,
        memberId: member.member_id,
        fullName: member.full_name,
        preferredName: member.preferred_name,
        phone: member.phone,
        whatsapp: member.whatsapp,
        entryYear: member.entry_year,
        graduationYear: member.graduation_year,
        company: member.company,
        biography: member.biography,
        profilePhoto: member.profile_photo,
        badge: badge
          ? {
              id: badge.id,
              displayName: badge.display_name,
              badgeYear: badge.badge_year,
            }
          : null,
        country: country
          ? {
              id: country.id,
              name: country.name,
              code: country.code,
            }
          : null,
        chapter: chapter
          ? {
              id: chapter.id,
              name: chapter.name,
              city: chapter.city,
              region: chapter.region,
            }
          : null,
        occupation: occupation
          ? {
              id: occupation.id,
              name: occupation.name,
            }
          : null,
      };
    }
  );

  return {
    isLoggedIn: true,
    canAccessDirectory: true,
    members,
    countries: (countriesResult.data ?? []).map((country) => ({
      id: country.id,
      name: country.name,
    })),
    chapters: (chaptersResult.data ?? []).map((chapter) => ({
      id: chapter.id,
      name: chapter.name,
    })),
    occupations: (occupationsResult.data ?? []).map((occupation) => ({
      id: occupation.id,
      name: occupation.name,
    })),
    badges: (badgesResult.data ?? []).map((badge) => ({
      id: badge.id,
      displayName: badge.display_name,
      badgeYear: badge.badge_year,
    })),
    error: null,
  };
}