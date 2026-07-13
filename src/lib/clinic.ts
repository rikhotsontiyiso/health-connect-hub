export const clinic = {
  name: "Ubuntu Family Healthcare Clinic",
  short: "Ubuntu Family Clinic",
  tagline: "Quality Healthcare for You and Your Family",
  address: "125 Nelson Mandela Drive, Arcadia, Pretoria, Gauteng, 0007",
  phone: "+27 12 345 6789",
  emergency: "+27 72 345 6789",
  whatsapp: "+27 72 345 6789",
  email: "info@ubuntufamilyclinic.co.za",
  hours: [
    { day: "Monday – Friday", time: "08:00 – 18:00" },
    { day: "Saturday", time: "08:00 – 13:00" },
    { day: "Sunday", time: "Closed" },
    { day: "Public Holidays", time: "Emergency Services Only" },
  ],
  medicalAids: [
    "Discovery Health",
    "Bonitas",
    "Momentum Health",
    "Fedhealth",
    "Bestmed",
    "Medshield",
  ],
};

export const services = [
  { icon: "Stethoscope", title: "General Consultations", desc: "Comprehensive check-ups and diagnosis for all ages." },
  { icon: "HeartPulse", title: "Family Medicine", desc: "Continuous, whole-person care for every member of your family." },
  { icon: "Baby", title: "Children's Health", desc: "Paediatric care, growth monitoring, and childhood immunisations." },
  { icon: "Venus", title: "Women's Health", desc: "Pap smears, family planning, prenatal care and screenings." },
  { icon: "Activity", title: "Chronic Disease Management", desc: "Ongoing care for diabetes, hypertension and more." },
  { icon: "Syringe", title: "Vaccinations", desc: "Adult and childhood vaccinations following WHO schedules." },
  { icon: "FlaskConical", title: "Laboratory Services", desc: "On-site blood tests and specimen collection." },
  { icon: "Pill", title: "Pharmacy", desc: "Prescription dispensing and medication counselling." },
  { icon: "ShieldCheck", title: "Health Screenings", desc: "BP, cholesterol, BMI and general wellness checks." },
  { icon: "TestTube", title: "HIV Testing & Counselling", desc: "Confidential rapid testing and support." },
  { icon: "Droplet", title: "Diabetes Care", desc: "Blood sugar monitoring, education and lifestyle plans." },
  { icon: "Gauge", title: "Hypertension Management", desc: "Blood pressure control and cardiovascular risk reviews." },
];

import drSarah from "@/assets/dr-sarah.jpg";
import drMichael from "@/assets/dr-michael.jpg";
import drAmanda from "@/assets/dr-amanda.jpg";

export const doctors = [
  {
    id: "sarah-nkosi",
    name: "Dr. Sarah Nkosi",
    qualifications: "MBChB",
    specialty: "Family Medicine",
    experience: "10+ years",
    days: "Monday – Friday",
    image: drSarah,
    bio: "Dr. Nkosi is passionate about family-centred care, with a special interest in preventive medicine and chronic disease management.",
  },
  {
    id: "michael-dlamini",
    name: "Dr. Michael Dlamini",
    qualifications: "MBChB",
    specialty: "General Practitioner",
    experience: "8+ years",
    days: "Monday – Saturday",
    image: drMichael,
    bio: "Dr. Dlamini treats patients of all ages, focusing on approachable, evidence-based general practice.",
  },
  {
    id: "amanda-jacobs",
    name: "Dr. Amanda Jacobs",
    qualifications: "MBChB",
    specialty: "Women's Health",
    experience: "12+ years",
    days: "Tuesday – Friday",
    image: drAmanda,
    bio: "Dr. Jacobs specialises in women's health across life stages, including reproductive and prenatal care.",
  },
];

export const testimonials = [
  {
    name: "Thandi M.",
    text: "The staff are friendly and professional, and booking an appointment online was quick and easy. I highly recommend Ubuntu Family Healthcare Clinic.",
  },
  {
    name: "Sipho K.",
    text: "The doctors truly listen. I never feel rushed and always leave with a clear plan for my health.",
  },
  {
    name: "Rachel B.",
    text: "Same-day appointment, warm reception, and my kids actually enjoy going to the clinic now.",
  },
];

export const blogPosts = [
  {
    slug: "5-tips-for-a-healthier-heart",
    title: "5 Simple Tips for a Healthier Heart",
    date: "12 March 2026",
    author: "Dr. Sarah Nkosi",
    category: "Preventive Care",
    excerpt: "Small daily habits that make a real difference to your cardiovascular health.",
  },
  {
    slug: "childhood-vaccination-schedule",
    title: "Understanding the Childhood Vaccination Schedule",
    date: "28 February 2026",
    author: "Dr. Michael Dlamini",
    category: "Children's Health",
    excerpt: "A parent-friendly guide to the vaccines your child needs and when.",
  },
  {
    slug: "managing-diabetes-through-diet",
    title: "Managing Diabetes Through Diet",
    date: "14 February 2026",
    author: "Dr. Amanda Jacobs",
    category: "Nutrition",
    excerpt: "Practical, affordable meal ideas to help stabilise blood sugar levels.",
  },
  {
    slug: "womens-health-checklist",
    title: "The Women's Health Check-Up Checklist",
    date: "30 January 2026",
    author: "Dr. Amanda Jacobs",
    category: "Women's Health",
    excerpt: "Which screenings you should schedule at every stage of life.",
  },
  {
    slug: "mental-wellness-daily-habits",
    title: "Mental Wellness: Daily Habits That Help",
    date: "18 January 2026",
    author: "Dr. Sarah Nkosi",
    category: "Mental Health",
    excerpt: "Small routines that support resilience and emotional balance.",
  },
  {
    slug: "flu-season-preparation",
    title: "Preparing Your Family for Flu Season",
    date: "05 January 2026",
    author: "Dr. Michael Dlamini",
    category: "Vaccination News",
    excerpt: "When to vaccinate and how to keep your household protected.",
  },
];
