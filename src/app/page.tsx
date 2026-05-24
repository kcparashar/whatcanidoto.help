"use client";

import {
  Banknote,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Flame,
  Globe2,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  House,
  Landmark,
  Leaf,
  MapPin,
  Megaphone,
  Moon,
  Search,
  ShieldCheck,
  Siren,
  Sparkles,
  Stethoscope,
  Sun,
  Users,
  Utensils,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Offer = "time" | "money" | "skills" | "local" | "voice" | "not-sure";
type Effort = "10-min" | "1-hour" | "weekend" | "ongoing";
type Goal = "any" | "learn" | "donate" | "volunteer" | "advocate" | "skills" | "habit";
type Energy = "overwhelmed" | "angry" | "heartbroken" | "urgent" | "steady";
type ThemePreference = "system" | "paper" | "blueprint";
type ResolvedTheme = "paper" | "blueprint";
type ActionKind =
  | "Donate"
  | "Volunteer"
  | "Learn"
  | "Advocate"
  | "Share"
  | "Skill"
  | "Prepare";

type Action = {
  title: string;
  effort: Effort;
  kind: ActionKind;
  mode: "Remote" | "Local" | "Either";
  offers: Offer[];
  why: string;
  firstStep: string;
  trustNote?: string;
};

type Cause = {
  id: string;
  name: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  actions: Action[];
};

const effortLabels: Record<Effort, string> = {
  "10-min": "10 minutes",
  "1-hour": "1 hour",
  weekend: "This weekend",
  ongoing: "Ongoing",
};

const effortOrder: Effort[] = ["10-min", "1-hour", "weekend", "ongoing"];

const offerOptions: { id: Offer; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "not-sure", label: "Not sure", icon: Compass },
  { id: "time", label: "Time", icon: Clock3 },
  { id: "money", label: "Money", icon: Banknote },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "local", label: "Local presence", icon: MapPin },
  { id: "voice", label: "Social reach", icon: Megaphone },
];

const effortOptions: { id: Effort | "any"; label: string }[] = [
  { id: "any", label: "Any effort" },
  { id: "10-min", label: "10 min" },
  { id: "1-hour", label: "1 hour" },
  { id: "weekend", label: "Weekend" },
  { id: "ongoing", label: "Ongoing" },
];

const goalOptions: {
  id: Goal;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  actionKinds: ActionKind[];
}[] = [
  { id: "any", label: "Pick for me", icon: Sparkles, actionKinds: [] },
  { id: "learn", label: "Learn", icon: BookOpen, actionKinds: ["Learn"] },
  { id: "donate", label: "Give money", icon: Banknote, actionKinds: ["Donate"] },
  { id: "volunteer", label: "Volunteer", icon: Users, actionKinds: ["Volunteer"] },
  { id: "advocate", label: "Use my voice", icon: Megaphone, actionKinds: ["Advocate", "Share"] },
  { id: "skills", label: "Use skills", icon: Wrench, actionKinds: ["Skill"] },
  { id: "habit", label: "Build habit", icon: CalendarDays, actionKinds: ["Prepare"] },
];

const energyOptions: {
  id: Energy;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  actionKinds: ActionKind[];
  efforts: Effort[];
}[] = [
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    description: "Give me one small, real step.",
    icon: Compass,
    actionKinds: ["Learn", "Prepare"],
    efforts: ["10-min"],
  },
  {
    id: "angry",
    label: "Angry",
    description: "Turn heat into pressure.",
    icon: Flame,
    actionKinds: ["Advocate", "Share"],
    efforts: ["10-min", "1-hour"],
  },
  {
    id: "heartbroken",
    label: "Heartbroken",
    description: "Do something caring.",
    icon: HeartPulse,
    actionKinds: ["Donate", "Volunteer"],
    efforts: ["10-min", "weekend"],
  },
  {
    id: "urgent",
    label: "Urgent",
    description: "Act fast without making noise.",
    icon: Siren,
    actionKinds: ["Donate", "Share", "Volunteer"],
    efforts: ["10-min", "1-hour"],
  },
  {
    id: "steady",
    label: "Ready",
    description: "Build a repeatable commitment.",
    icon: HandHeart,
    actionKinds: ["Skill", "Prepare", "Volunteer"],
    efforts: ["weekend", "ongoing"],
  },
];

const THEME_COOKIE = "whatcanidoto-theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readThemeCookie(): ThemePreference {
  if (typeof document === "undefined") {
    return "system";
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${THEME_COOKIE}=`))
    ?.split("=")[1];

  return cookie === "paper" || cookie === "blueprint" ? cookie : "system";
}

function writeThemeCookie(theme: ResolvedTheme) {
  document.cookie = `${THEME_COOKIE}=${theme}; Max-Age=${THEME_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

function resolveSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "blueprint" : "paper";
}

const causes: Cause[] = [
  {
    id: "climate",
    name: "Climate action",
    summary: "Reduce harm, support resilience, and move local systems toward cleaner choices.",
    icon: Leaf,
    actions: [
      {
        title: "Switch one recurring bill or habit",
        effort: "10-min",
        kind: "Prepare",
        mode: "Remote",
        offers: ["time", "not-sure"],
        why: "Small defaults matter when they repeat every month.",
        firstStep: "Pick one utility, bank, commute, meal, or purchase habit and make the lower-emission option the default.",
      },
      {
        title: "Call one local decision maker",
        effort: "1-hour",
        kind: "Advocate",
        mode: "Either",
        offers: ["voice", "time", "not-sure"],
        why: "Local officials hear from far fewer people than national offices, so specific comments carry weight.",
        firstStep: "Ask your city council, utility board, or school board what climate resilience project is currently waiting on public support.",
      },
      {
        title: "Join a cleanup, tree, transit, or resilience day",
        effort: "weekend",
        kind: "Volunteer",
        mode: "Local",
        offers: ["time", "local", "not-sure"],
        why: "Visible local work builds capacity and helps you meet the people already organizing nearby.",
        firstStep: "Search your city name plus climate volunteer, watershed group, tree planting, or transit advocacy.",
        trustNote: "Choose groups that list partners, safety expectations, and a named local organizer.",
      },
      {
        title: "Offer a useful professional skill",
        effort: "ongoing",
        kind: "Skill",
        mode: "Either",
        offers: ["skills"],
        why: "Many climate groups need design, data, writing, operations, legal, translation, and event help more than generic labor.",
        firstStep: "Write a two-sentence offer naming your skill, your weekly time limit, and one concrete task you can do.",
      },
    ],
  },
  {
    id: "food",
    name: "Food access",
    summary: "Help neighbors get reliable meals with dignity, consistency, and fewer barriers.",
    icon: Utensils,
    actions: [
      {
        title: "Add one high-need item to your next grocery run",
        effort: "10-min",
        kind: "Donate",
        mode: "Local",
        offers: ["money", "time", "local", "not-sure"],
        why: "Food pantries often need predictable staples more than random leftovers.",
        firstStep: "Check a nearby pantry wish list and buy exactly one requested item.",
        trustNote: "Pantry needs change quickly; check current lists before buying in bulk.",
      },
      {
        title: "Help one person find nearby food support",
        effort: "1-hour",
        kind: "Share",
        mode: "Either",
        offers: ["voice", "time", "not-sure"],
        why: "Access often fails because people do not know what exists or feel unsure about eligibility.",
        firstStep: "Find your local food bank locator or 211 page and save the link with hours, eligibility, and transit notes.",
      },
      {
        title: "Take a pantry or meal-shift slot",
        effort: "weekend",
        kind: "Volunteer",
        mode: "Local",
        offers: ["time", "local", "not-sure"],
        why: "Reliable shift coverage keeps services open and reduces burnout for regular volunteers.",
        firstStep: "Choose one shift you can actually attend and complete any required orientation.",
      },
      {
        title: "Become a monthly donor",
        effort: "ongoing",
        kind: "Donate",
        mode: "Remote",
        offers: ["money"],
        why: "Predictable funding lets food programs plan purchases instead of guessing week to week.",
        firstStep: "Pick a local food bank or mutual aid fund and set a small monthly amount.",
        trustNote: "Review the group mission, financial transparency, and whether it explains how money is used.",
      },
    ],
  },
  {
    id: "housing",
    name: "Housing stability",
    summary: "Support eviction prevention, shelter access, tenant power, and practical neighbor care.",
    icon: House,
    actions: [
      {
        title: "Learn the nearest emergency housing path",
        effort: "10-min",
        kind: "Learn",
        mode: "Remote",
        offers: ["time", "not-sure"],
        why: "When someone needs help, a correct first phone number can matter more than vague advice.",
        firstStep: "Search your county plus eviction help, tenant hotline, shelter intake, or 211 housing.",
      },
      {
        title: "Share a tenant resource without panic",
        effort: "1-hour",
        kind: "Share",
        mode: "Either",
        offers: ["voice", "time", "not-sure"],
        why: "Clear, specific resources help people act before a deadline becomes an emergency.",
        firstStep: "Post or send one verified hotline, clinic, or rights guide with who it is for and when to use it.",
      },
      {
        title: "Volunteer for move-in or supply support",
        effort: "weekend",
        kind: "Volunteer",
        mode: "Local",
        offers: ["time", "local"],
        why: "Practical logistics can turn housing placement into actual stability.",
        firstStep: "Ask a shelter, resettlement group, or mutual aid network what move-in supplies or transport they need this week.",
        trustNote: "Follow the group rules around privacy and photos, especially for people in crisis.",
      },
      {
        title: "Support eviction defense or rental assistance",
        effort: "ongoing",
        kind: "Donate",
        mode: "Remote",
        offers: ["money", "skills"],
        why: "Early legal help and small-dollar assistance can prevent a costly spiral.",
        firstStep: "Look for a legal aid, tenant union, or community fund that publishes clear eligibility and request processes.",
        trustNote: "Avoid groups that pressure you for urgent payment without public contact information or accountability.",
      },
    ],
  },
  {
    id: "disaster",
    name: "Disaster relief",
    summary: "Help people recover without adding noise, duplication, or unsafe volunteer pressure.",
    icon: Siren,
    actions: [
      {
        title: "Share only one verified update",
        effort: "10-min",
        kind: "Share",
        mode: "Remote",
        offers: ["voice", "not-sure"],
        why: "During disasters, old or wrong posts can waste time and put people at risk.",
        firstStep: "Use an official emergency management, local government, or established relief org source before reposting.",
        trustNote: "Check timestamps and location names before sharing urgent posts.",
      },
      {
        title: "Donate money instead of unsolicited goods",
        effort: "10-min",
        kind: "Donate",
        mode: "Remote",
        offers: ["money"],
        why: "Cash lets responders buy what is actually needed near the affected area.",
        firstStep: "Choose a relief fund with clear local partners and a published response plan.",
        trustNote: "Be cautious with brand-new payment links, celebrity screenshots, or direct messages asking for money.",
      },
      {
        title: "Check on one vulnerable neighbor",
        effort: "1-hour",
        kind: "Volunteer",
        mode: "Local",
        offers: ["time", "local", "not-sure"],
        why: "Prepared neighbors reduce strain on emergency systems.",
        firstStep: "Ask if they have power, medication, food, transport, or a safe contact person.",
      },
      {
        title: "Train before the next emergency",
        effort: "ongoing",
        kind: "Prepare",
        mode: "Local",
        offers: ["time", "local", "skills"],
        why: "Prepared volunteers are more useful and safer than spontaneous ones.",
        firstStep: "Look up CERT, Red Cross, medical reserve, or local emergency volunteer training in your county.",
      },
    ],
  },
  {
    id: "humanitarian",
    name: "War and humanitarian crises",
    summary: "Support civilians, displaced people, and relief efforts without amplifying panic or misinformation.",
    icon: Globe2,
    actions: [
      {
        title: "Verify before you share",
        effort: "10-min",
        kind: "Learn",
        mode: "Remote",
        offers: ["time", "voice", "not-sure"],
        why: "In fast-moving conflicts, old footage and false claims spread quickly and can put people at risk.",
        firstStep: "Check the date, location, original source, and whether a trusted humanitarian or newsroom source confirms the claim.",
        trustNote: "Avoid reposting graphic images, private details, or donation links that cannot be traced to a real organization.",
      },
      {
        title: "Give to civilian relief through a clear channel",
        effort: "10-min",
        kind: "Donate",
        mode: "Remote",
        offers: ["money"],
        why: "Flexible cash helps vetted responders buy what people need close to where they are.",
        firstStep: "Choose a humanitarian fund with named local partners, a current response page, and a normal donation URL.",
        trustNote: "Be careful with payment handles in screenshots, urgent DMs, or posts that hide who receives the money.",
      },
      {
        title: "Ask your representative for a specific civilian-protection action",
        effort: "1-hour",
        kind: "Advocate",
        mode: "Remote",
        offers: ["voice", "time"],
        why: "Public offices track calls and messages, especially when requests are concrete and tied to pending decisions.",
        firstStep: "Write a three-sentence message asking for humanitarian access, civilian protection, refugee support, or a specific aid vote.",
      },
      {
        title: "Support refugees or displaced families near you",
        effort: "weekend",
        kind: "Volunteer",
        mode: "Local",
        offers: ["time", "local", "skills"],
        why: "Conflict often becomes local through resettlement, translation, legal support, school enrollment, and basic logistics.",
        firstStep: "Search your city plus refugee resettlement, immigration legal aid, language support, or community sponsorship.",
        trustNote: "Work through groups with privacy rules and clear volunteer screening.",
      },
      {
        title: "Offer a skill that lowers the workload",
        effort: "ongoing",
        kind: "Skill",
        mode: "Either",
        offers: ["skills"],
        why: "Translation, design, fundraising operations, data cleanup, and intake support can make small organizations more effective.",
        firstStep: "Send one bounded offer: your skill, your weekly time limit, and one task you can complete without needing much supervision.",
      },
    ],
  },
  {
    id: "health",
    name: "Public health",
    summary: "Improve access to care, reliable information, and community protection.",
    icon: Stethoscope,
    actions: [
      {
        title: "Make one appointment easier",
        effort: "10-min",
        kind: "Volunteer",
        mode: "Either",
        offers: ["time", "local", "not-sure"],
        why: "Transportation, forms, and reminders are real barriers to care.",
        firstStep: "Offer a ride, reminder, translation help, or paperwork help to someone who has already asked for support.",
      },
      {
        title: "Replace rumor with a reliable source",
        effort: "1-hour",
        kind: "Share",
        mode: "Remote",
        offers: ["voice", "time"],
        why: "People are more likely to trust useful information when it comes from someone they know.",
        firstStep: "Share one plain-language local health department, CDC, clinic, or hospital resource with a short summary.",
      },
      {
        title: "Support a clinic supply or outreach drive",
        effort: "weekend",
        kind: "Donate",
        mode: "Local",
        offers: ["money", "time", "local"],
        why: "Community clinics often need practical support for outreach, hygiene, and basic care access.",
        firstStep: "Check whether a nearby clinic, harm reduction group, or health nonprofit lists current supply needs.",
        trustNote: "Use public wish lists or official donation pages rather than informal payment requests.",
      },
      {
        title: "Volunteer a specialized skill",
        effort: "ongoing",
        kind: "Skill",
        mode: "Either",
        offers: ["skills"],
        why: "Translation, data entry, web updates, grant writing, and outreach materials can expand care capacity.",
        firstStep: "Email one clinic or health group with your skill, availability, and whether you can work remotely.",
      },
    ],
  },
  {
    id: "education",
    name: "Education access",
    summary: "Support students, families, teachers, libraries, and learning opportunities.",
    icon: GraduationCap,
    actions: [
      {
        title: "Clear one classroom wish-list item",
        effort: "10-min",
        kind: "Donate",
        mode: "Remote",
        offers: ["money", "not-sure"],
        why: "Small supplies can remove daily friction for teachers and students.",
        firstStep: "Find a local teacher, library, or after-school program wish list and fund one specific item.",
        trustNote: "Prefer official school, library, or platform pages with named educators and clear item lists.",
      },
      {
        title: "Share a free learning resource",
        effort: "1-hour",
        kind: "Share",
        mode: "Remote",
        offers: ["voice", "time"],
        why: "Families often need one relevant program more than a pile of links.",
        firstStep: "Send one local library, tutoring, scholarship, FAFSA, or after-school resource to someone who can use it.",
      },
      {
        title: "Volunteer for reading, tutoring, or mentoring",
        effort: "weekend",
        kind: "Volunteer",
        mode: "Local",
        offers: ["time", "local", "skills"],
        why: "Consistent adult support helps students build confidence and stay connected.",
        firstStep: "Choose one school, library, or youth nonprofit and complete its background-check process.",
        trustNote: "Programs serving minors should have clear screening, supervision, and safety policies.",
      },
      {
        title: "Support one education policy meeting",
        effort: "ongoing",
        kind: "Advocate",
        mode: "Local",
        offers: ["voice", "time", "local"],
        why: "School board and library decisions often happen with very little public participation.",
        firstStep: "Read the next agenda and submit one short comment about funding, access, or student support.",
      },
    ],
  },
  {
    id: "civic",
    name: "Voting and civic participation",
    summary: "Help people vote, understand decisions, and participate beyond election day.",
    icon: Landmark,
    actions: [
      {
        title: "Check your own registration and deadlines",
        effort: "10-min",
        kind: "Prepare",
        mode: "Remote",
        offers: ["time", "not-sure"],
        why: "Being ready yourself makes every later ask more credible.",
        firstStep: "Use your state election site to confirm registration, ballot options, and key dates.",
        trustNote: "Use official state or county election pages for dates and registration status.",
      },
      {
        title: "Help three people make a voting plan",
        effort: "1-hour",
        kind: "Volunteer",
        mode: "Either",
        offers: ["voice", "time", "local"],
        why: "Specific plans beat vague reminders.",
        firstStep: "Ask when they will vote, how they will get there, and whether they know ID or mail-ballot rules.",
      },
      {
        title: "Work a nonpartisan voter support shift",
        effort: "weekend",
        kind: "Volunteer",
        mode: "Local",
        offers: ["time", "local"],
        why: "Election offices and civic groups need reliable people for registration, rides, and information.",
        firstStep: "Search your county election office or a nonpartisan voter group for volunteer openings.",
        trustNote: "Keep legal guidance nonpartisan and source it from official election authorities.",
      },
      {
        title: "Follow one local public meeting",
        effort: "ongoing",
        kind: "Advocate",
        mode: "Either",
        offers: ["time", "voice", "skills"],
        why: "Local decisions shape daily life and usually receive little attention.",
        firstStep: "Subscribe to one city council, school board, transit, or county agenda and summarize it for your network.",
      },
    ],
  },
  {
    id: "community",
    name: "Community care",
    summary: "Make everyday mutual support easier, safer, and more consistent.",
    icon: HeartHandshake,
    actions: [
      {
        title: "Text one concrete offer",
        effort: "10-min",
        kind: "Volunteer",
        mode: "Either",
        offers: ["time", "not-sure"],
        why: "Specific offers are easier to accept than a vague let me know.",
        firstStep: "Send: I can bring dinner Tuesday, make a pharmacy run, or sit with you for an hour. Which would help?",
      },
      {
        title: "Create a tiny help roster",
        effort: "1-hour",
        kind: "Prepare",
        mode: "Either",
        offers: ["skills", "time", "voice"],
        why: "A simple roster turns scattered goodwill into something dependable.",
        firstStep: "Ask three people what they can reliably do: rides, meals, childcare, calls, admin, repairs, or translation.",
      },
      {
        title: "Stock a local free fridge or supply shelf",
        effort: "weekend",
        kind: "Donate",
        mode: "Local",
        offers: ["money", "time", "local"],
        why: "Direct aid works best when it is easy to access and locally maintained.",
        firstStep: "Check the posted rules, then bring labeled, allowed items during the preferred drop-off window.",
        trustNote: "Respect food safety rules and avoid leaving items outside accepted hours.",
      },
      {
        title: "Become the steady operations person",
        effort: "ongoing",
        kind: "Skill",
        mode: "Either",
        offers: ["skills", "time"],
        why: "Calendars, spreadsheets, intake forms, and reminders keep care work from collapsing onto one person.",
        firstStep: "Offer to maintain one shared tracker or weekly reminder for a mutual aid, neighborhood, or family support effort.",
      },
    ],
  },
];

const fallbackActions = (causeName: string): Action[] => [
  {
    title: `Find the credible first door for ${causeName}`,
    effort: "10-min",
    kind: "Learn",
    mode: "Remote",
    offers: ["time", "not-sure"],
    why: "Most causes already have people doing the work; the fastest help starts by finding the right entry point.",
    firstStep: `Search "${causeName} help near me", "${causeName} mutual aid", or "${causeName} nonprofit" and save two organizations with clear contact info.`,
    trustNote: "Look for named staff or organizers, recent updates, a clear mission, and public contact information.",
  },
  {
    title: "Ask what is needed before sending things",
    effort: "1-hour",
    kind: "Volunteer",
    mode: "Either",
    offers: ["time", "local", "not-sure"],
    why: "Unrequested help can create extra work. A specific, humble offer is easier to use.",
    firstStep: "Send a short note: I can give two hours, make calls, move supplies, write copy, or donate a small amount. What would actually help this week?",
  },
  {
    title: "Turn attention into one useful share",
    effort: "10-min",
    kind: "Share",
    mode: "Remote",
    offers: ["voice"],
    why: "Good sharing points people toward a verified action, not just awareness.",
    firstStep: "Share one current need, deadline, event, or resource from a credible source with the date and location visible.",
    trustNote: "Avoid reposting screenshots with no source, no date, or no way to verify the request.",
  },
  {
    title: "Make a small recurring commitment",
    effort: "ongoing",
    kind: "Donate",
    mode: "Remote",
    offers: ["money", "skills"],
    why: "Predictable support helps groups plan and prevents the all-at-once burnout cycle.",
    firstStep: "Choose one monthly action: a donation, a volunteer shift, an office-hours skill offer, or a recurring check-in.",
    trustNote: "If money is involved, review the organization mission, financial transparency, and donation page URL before giving.",
  },
];

function createFallbackCause(query: string): Cause {
  const trimmed = query.trim();
  const name = trimmed ? trimmed.replace(/\s+/g, " ") : "a cause you care about";

  return {
    id: "custom",
    name,
    summary: "A general action path for causes that need care, verification, and practical follow-through.",
    icon: Sparkles,
    actions: fallbackActions(name.toLowerCase()),
  };
}

function actionScore(action: Action, selectedOffers: Offer[]) {
  if (selectedOffers.includes("not-sure")) {
    return action.offers.includes("not-sure") ? 2 : 1;
  }

  return action.offers.filter((offer) => selectedOffers.includes(offer)).length;
}

function actionMatchesGoal(action: Action, goal: Goal) {
  const goalOption = goalOptions.find((option) => option.id === goal);

  return !goalOption || goalOption.actionKinds.length === 0 || goalOption.actionKinds.includes(action.kind);
}

function emotionalScore(action: Action, energy: Energy) {
  const energyOption = energyOptions.find((option) => option.id === energy);

  if (!energyOption) {
    return 0;
  }

  const kindScore = energyOption.actionKinds.includes(action.kind) ? 2 : 0;
  const effortScore = energyOption.efforts.includes(action.effort) ? 1 : 0;

  return kindScore + effortScore;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCauseId, setSelectedCauseId] = useState(causes[0].id);
  const [selectedOffers, setSelectedOffers] = useState<Offer[]>(["not-sure"]);
  const [selectedEffort, setSelectedEffort] = useState<Effort | "any">("any");
  const [selectedGoal, setSelectedGoal] = useState<Goal>("any");
  const [selectedEnergy, setSelectedEnergy] = useState<Energy>("overwhelmed");
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => readThemeCookie());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("paper");

  const trimmedQuery = query.trim().toLowerCase();
  const queryTokens = trimmedQuery.split(/\s+/).filter((token) => token.length > 2);
  const searchedCause = causes.find((cause) => {
    const searchableCause = `${cause.name} ${cause.summary}`.toLowerCase();
    const searchableWords = new Set(searchableCause.match(/[a-z0-9]+/g) ?? []);

    return (
      (trimmedQuery.length > 3 && searchableCause.includes(trimmedQuery)) ||
      queryTokens.some((token) => searchableWords.has(token))
    );
  });
  const selectedCause = useMemo(() => {
    if (trimmedQuery) {
      return searchedCause ?? createFallbackCause(query);
    }

    return causes.find((cause) => cause.id === selectedCauseId) ?? causes[0];
  }, [query, searchedCause, selectedCauseId, trimmedQuery]);

  const filteredActions = useMemo(() => {
    const capacityFiltered = selectedCause.actions
      .filter((action) => selectedEffort === "any" || action.effort === selectedEffort)
      .filter((action) => selectedOffers.includes("not-sure") || actionScore(action, selectedOffers) > 0);
    const goalFiltered = capacityFiltered.filter((action) => actionMatchesGoal(action, selectedGoal));
    const actions = goalFiltered.length > 0 ? goalFiltered : capacityFiltered;

    return actions
      .sort((a, b) => {
        const emotionalDifference = emotionalScore(b, selectedEnergy) - emotionalScore(a, selectedEnergy);

        if (emotionalDifference !== 0) {
          return emotionalDifference;
        }

        const scoreDifference = actionScore(b, selectedOffers) - actionScore(a, selectedOffers);

        if (scoreDifference !== 0) {
          return scoreDifference;
        }

        return effortOrder.indexOf(a.effort) - effortOrder.indexOf(b.effort);
      });
  }, [selectedCause.actions, selectedEffort, selectedEnergy, selectedGoal, selectedOffers]);

  const recommendedAction = filteredActions[0] ?? selectedCause.actions[0];
  const groupedActions = effortOrder
    .map((effort) => ({
      effort,
      actions: filteredActions.filter((action) => action.effort === effort),
    }))
    .filter((group) => group.actions.length > 0);

  const CauseIcon = selectedCause.icon;
  const selectedEnergyOption = energyOptions.find((energy) => energy.id === selectedEnergy) ?? energyOptions[0];
  const selectedGoalLabel = goalOptions.find((goal) => goal.id === selectedGoal)?.label ?? "Pick for me";
  const isBlueprint = resolvedTheme === "blueprint";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      const nextTheme = themePreference === "system" ? resolveSystemTheme() : themePreference;

      setResolvedTheme(nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme === "blueprint" ? "dark" : "light";
    }

    applyTheme();

    if (themePreference !== "system") {
      return undefined;
    }

    mediaQuery.addEventListener("change", applyTheme);

    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [themePreference]);

  function chooseTheme() {
    const nextTheme = resolvedTheme === "blueprint" ? "paper" : "blueprint";

    setThemePreference(nextTheme);
    writeThemeCookie(nextTheme);
  }

  function toggleOffer(offer: Offer) {
    setSelectedOffers((current) => {
      if (offer === "not-sure") {
        return ["not-sure"];
      }

      const withoutNotSure = current.filter((item) => item !== "not-sure");
      const next = withoutNotSure.includes(offer)
        ? withoutNotSure.filter((item) => item !== offer)
        : [...withoutNotSure, offer];

      return next.length > 0 ? next : ["not-sure"];
    });
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[var(--page)] text-[var(--page-contrast)] transition-colors duration-300"
      data-theme={resolvedTheme}
    >
      <section className="relative overflow-hidden border-b border-[color:var(--grid-line)] [background:var(--hero-gradient)]">
        <div className="absolute inset-0 [background-image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(360px,0.56fr)] lg:gap-8 lg:px-8">
          <div className="flex min-w-0 flex-col justify-between gap-6 lg:gap-8">
            <header className="flex items-center justify-between gap-3">
              <a
                className="inline-flex min-w-0 items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--page-contrast)] sm:text-sm sm:tracking-[0.24em]"
                href="#top"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-text)]">
                  ?
                </span>
                <span className="truncate">whatcanidoto.help</span>
              </a>
              <button
                aria-label={`Switch to ${isBlueprint ? "paper" : "blueprint"} theme`}
                aria-pressed={themePreference !== "system"}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--grid-line)] bg-[var(--control-muted)] text-[var(--page-contrast)] hover:bg-[var(--control)]"
                onClick={chooseTheme}
                title={
                  themePreference === "system"
                    ? `Following system theme: ${isBlueprint ? "blueprint" : "paper"}`
                    : `Saved theme: ${isBlueprint ? "blueprint" : "paper"}`
                }
                type="button"
              >
                {isBlueprint ? (
                  <Sun className="size-4" aria-hidden="true" />
                ) : (
                  <Moon className="size-4" aria-hidden="true" />
                )}
              </button>
            </header>

            <div id="top" className="max-w-4xl">
              <p className="mb-4 inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border border-[color:var(--grid-line)] bg-[var(--accent)] px-2.5 py-1 text-[0.625rem] font-black uppercase tracking-[0.09em] text-[var(--accent-text)] sm:gap-2 sm:px-3 sm:text-xs sm:tracking-[0.2em]">
                <Sparkles className="size-3 shrink-0 sm:size-3.5" aria-hidden="true" />
                Turn emotional energy into action
              </p>
              <h1 className="max-w-3xl text-balance text-[2.55rem] font-black leading-[0.94] tracking-normal text-[var(--ink)] sm:text-6xl lg:text-7xl">
                The world feels heavy. Choose one useful next move.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--copy)] sm:text-xl sm:leading-8">
                For climate dread, war headlines, local crises, and the long
                list of things you are told to care about. Start with what you
                are carrying, then channel it into something real.
              </p>
            </div>

            <div className="grid min-w-0 gap-4 rounded-[1.5rem] border border-[color:var(--grid-line)] bg-[var(--soft)] p-4 shadow-[var(--shadow)] backdrop-blur sm:rounded-[2rem] sm:p-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                  What are you carrying?
                </p>
                <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {energyOptions.map((energy) => {
                    const Icon = energy.icon;
                    const isSelected = selectedEnergy === energy.id;

                    return (
                      <button
                        className={`min-w-0 rounded-2xl border p-3 text-left transition ${
                          isSelected
                            ? "border-[color:var(--primary)] bg-[var(--primary)] text-[var(--primary-text)]"
                            : "border-[color:var(--grid-line)] bg-[var(--control-muted)] text-[var(--copy)] hover:bg-[var(--control)]"
                        }`}
                        key={energy.id}
                        onClick={() => setSelectedEnergy(energy.id)}
                        type="button"
                      >
                        <Icon className="mb-2 size-5" aria-hidden="true" />
                        <span className="block text-sm font-black">{energy.label}</span>
                        <span className="mt-1 block text-xs font-bold opacity-75">
                          {energy.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="text-sm font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                What cause is on your mind?
              </label>
              <div className="flex min-h-14 min-w-0 items-center gap-3 rounded-2xl border-2 border-[color:var(--primary)] bg-[var(--control)] px-4 shadow-[var(--heavy-shadow)]">
                <Search className="size-5 shrink-0 text-[var(--muted)]" aria-hidden="true" />
                <input
                  className="h-12 w-full bg-transparent text-lg font-bold text-[var(--page-contrast)] outline-none placeholder:text-[var(--muted)]"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Climate, a war, housing, food..."
                  aria-label="Search or enter a cause"
                />
              </div>
              <div
                className="flex min-w-0 flex-wrap gap-2"
                aria-label="Starter causes"
              >
                {causes.map((cause) => {
                  const Icon = cause.icon;
                  const isSelected = !trimmedQuery && selectedCauseId === cause.id;

                  return (
                    <button
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold transition ${
                        isSelected
                          ? "border-[color:var(--primary)] bg-[var(--primary)] text-[var(--primary-text)]"
                          : "border-[color:var(--grid-line)] bg-[var(--control-muted)] text-[var(--copy)] hover:bg-[var(--control)]"
                      }`}
                      key={cause.id}
                      onClick={() => {
                        setSelectedCauseId(cause.id);
                        setQuery("");
                      }}
                      type="button"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {cause.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="self-end rounded-[1.5rem] border border-[color:var(--grid-line)] bg-[var(--primary)] p-4 text-[var(--primary-text)] shadow-[var(--shadow)] sm:rounded-[2rem] sm:p-5 lg:mb-4">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--accent)]">
                  Action finder
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-normal">
                  Give the feeling a job.
                </h2>
              </div>
              <div className="grid size-12 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-text)]">
                <CauseIcon className="size-6" aria-hidden="true" />
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                What would help today?
              </p>
              <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                {goalOptions.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.id;

                  return (
                    <button
                      className={`action-control min-h-14 rounded-2xl p-3 text-left text-[var(--primary-text)] ${
                        isSelected ? "action-control-selected" : ""
                      }`}
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      type="button"
                    >
                      <Icon className="mb-2 size-4" aria-hidden="true" />
                      <span className="block text-sm font-black">{goal.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">
              What can you offer?
            </p>
            <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
              {offerOptions.map((offer) => {
                const Icon = offer.icon;
                const isSelected = selectedOffers.includes(offer.id);

                return (
                  <button
                    className={`action-control min-h-20 rounded-2xl p-3 text-left text-[var(--primary-text)] ${
                      isSelected ? "action-control-selected" : ""
                    }`}
                    key={offer.id}
                    onClick={() => toggleOffer(offer.id)}
                    type="button"
                  >
                    <Icon className="mb-3 size-5" aria-hidden="true" />
                    <span className="block text-sm font-black">{offer.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                Effort
              </p>
              <div className="flex flex-wrap gap-2">
                {effortOptions.map((effort) => (
                  <button
                    className={`action-control rounded-full px-3 py-2 text-sm font-black text-[var(--primary-text)] ${
                      selectedEffort === effort.id ? "action-control-selected" : ""
                    }`}
                    key={effort.id}
                    onClick={() => setSelectedEffort(effort.id)}
                    type="button"
                  >
                    {effort.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="actions">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(320px,0.28fr)]">
          <div className="rounded-[1.5rem] border border-[color:var(--grid-line)] bg-[var(--panel)] p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
            <div className="flex flex-col gap-4 border-b border-[color:var(--grid-line)] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--signal)]">
                  Current cause
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-normal text-[var(--ink)] sm:text-3xl">
                  {selectedCause.name}
                </h2>
                <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--muted)]">
                  {selectedCause.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--primary)] px-3 py-2 text-sm font-black text-[var(--primary-text)]">
                  <HeartPulse className="size-4" aria-hidden="true" />
                  Carrying: {selectedEnergyOption.label}
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-2 text-sm font-black text-[var(--accent-text)]">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Goal: {selectedGoalLabel}
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--panel-tint)] px-3 py-2 text-sm font-black text-[var(--page-contrast)]">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {filteredActions.length} useful option{filteredActions.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            <article className="my-5 rounded-[1.25rem] border-2 border-[color:var(--primary)] bg-[var(--accent)] p-4 text-[var(--accent-text)] shadow-[var(--heavy-shadow)] sm:rounded-[1.5rem] sm:p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--primary-text)]">
                  Best next step
                </span>
                <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-black text-[var(--primary-text)]">
                  {effortLabels[recommendedAction.effort]}
                </span>
                <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-black text-[var(--primary-text)]">
                  {recommendedAction.mode}
                </span>
              </div>
              <h3 className="text-xl font-black tracking-normal sm:text-2xl">{recommendedAction.title}</h3>
              <p className="mt-3 max-w-2xl text-base leading-7">
                {recommendedAction.why}
              </p>
              <p className="mt-3 max-w-2xl rounded-2xl bg-[var(--accent-panel)] px-4 py-3 text-sm font-black leading-6">
                When you feel {selectedEnergyOption.label.toLowerCase()}, this is a good-sized way to start: {selectedEnergyOption.description.toLowerCase()}
              </p>
              <div className="mt-4 rounded-2xl bg-[var(--accent-panel)] p-3 sm:p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                  First step
                </p>
                <p className="mt-1 font-bold leading-7">{recommendedAction.firstStep}</p>
              </div>
            </article>

            <div className="space-y-6">
              {groupedActions.map((group) => (
                <div key={group.effort}>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {effortLabels[group.effort]}
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {group.actions.map((action) => (
                      <ActionCard action={action} key={`${action.title}-${action.effort}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[1.5rem] border border-[color:var(--grid-line)] bg-[var(--panel-tint)] p-4 sm:rounded-[2rem] sm:p-5">
              <ShieldCheck className="size-7 text-[var(--page-contrast)]" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black tracking-normal sm:text-2xl">Trust check</h2>
              <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-[var(--copy)]">
                <li>Use current pages with dates, names, and public contact info.</li>
                <li>Prefer specific needs over vague urgency.</li>
                <li>Check donation URLs before giving money.</li>
                <li>Do not share private stories, faces, or locations without consent.</li>
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-[color:var(--grid-line)] bg-[var(--panel)] p-4 sm:rounded-[2rem] sm:p-5">
              <BookOpen className="size-7 text-[var(--signal)]" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black tracking-normal sm:text-2xl">Good help is specific</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[var(--muted)]">
                The best first message usually names a task, a time limit, and
                a boundary. Try: I can do two hours of calls, design one flyer,
                bring supplies Saturday, or donate $25 monthly.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[color:var(--grid-line)] bg-[var(--primary)] p-4 text-[var(--primary-text)] sm:rounded-[2rem] sm:p-5">
              <Users className="size-7 text-[var(--accent)]" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black tracking-normal sm:text-2xl">Built for overwhelm</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[var(--muted)]">
                You do not have to do everything. Pick one useful next move,
                make it real, then come back when you have more capacity.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ActionCard({ action }: { action: Action }) {
  return (
    <article className="flex flex-col rounded-[1.25rem] border border-[color:var(--grid-line)] bg-[var(--soft)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-72">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[var(--primary)] px-2.5 py-1 text-xs font-black text-[var(--primary-text)]">
          {action.kind}
        </span>
        <span className="rounded-full bg-[var(--panel-tint)] px-2.5 py-1 text-xs font-black text-[var(--page-contrast)]">
          {action.mode}
        </span>
      </div>
      <h4 className="mt-4 text-xl font-black leading-6 tracking-normal">{action.title}</h4>
      <p className="mt-3 text-sm font-semibold leading-6 text-[var(--muted)]">{action.why}</p>
      <div className="mt-auto pt-4">
        <div className="rounded-2xl bg-[var(--control)] p-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--signal)]">
            First step
          </p>
          <p className="mt-1 text-sm font-bold leading-6 text-[var(--copy)]">{action.firstStep}</p>
        </div>
        {action.trustNote ? (
          <p className="mt-3 flex gap-2 text-xs font-bold leading-5 text-[var(--muted)]">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--signal)]" aria-hidden="true" />
            {action.trustNote}
          </p>
        ) : null}
      </div>
    </article>
  );
}
