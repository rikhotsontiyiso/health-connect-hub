import { Link } from "@tanstack/react-router";
import { HeartPulse, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { clinic } from "@/lib/clinic";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-[oklch(0.22_0.03_260)] text-white/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </span>
            <div>
              <div className="font-display font-bold text-white">Ubuntu Family</div>
              <div className="text-xs text-white/60">Healthcare Clinic</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Compassionate, affordable and professional healthcare for families in Pretoria and surrounding communities.
          </p>
          <div className="mt-4 flex gap-3">
            <a aria-label="Facebook" href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Facebook className="h-4 w-4" /></a>
            <a aria-label="Instagram" href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Instagram className="h-4 w-4" /></a>
            <a aria-label="Twitter" href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/about", "About Us"],
              ["/services", "Our Services"],
              ["/doctors", "Our Doctors"],
              ["/appointments", "Book Appointment"],
              ["/patient-info", "Patient Info"],
              ["/blog", "Health Blog"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-white/70 hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" /><span>{clinic.address}</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" /><span>{clinic.phone}</span></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" /><span>{clinic.email}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Opening Hours</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {clinic.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-white/90">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Ubuntu Family Healthcare Clinic. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/patient-info" className="hover:text-white">Privacy Policy</Link>
            <Link to="/patient-info" className="hover:text-white">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
