"use client";
import {useState} from "react";
import {OFFICIAL_PRICING} from "@/lib/official-pricing";

// #12 conversion layer: an ROI worksheet on every guide. No default inputs and no promised outcome:
// the visitor's own numbers against Revo's published plan prices (lib/official-pricing.ts).
const usd = (n: number) => new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: n % 1 ? 2 : 0}).format(n);
const price = (s: string) => Number(String(s).replace(/[^0-9.]/g, ""));
// Same rule as scenarioValue in lib/review-cohort.ts, kept here so the guide pages do not ship the page registry to the browser.
function scenarioValue(inquiries: number, probability: number, value: number) {
  if (![inquiries, probability, value].every(Number.isFinite) || inquiries < 0 || !Number.isInteger(inquiries) || probability < 0 || probability > 100 || value < 0) throw new Error("Invalid scenario inputs");
  return inquiries * (probability / 100) * value;
}
const PLANS = OFFICIAL_PRICING.plans.map(p => ({name: p.name, regular: price(p.was), launch: price(p.amount)}));

export function roiScenario(missedCalls: number, bookingPercent: number, jobValue: number, planName: string) {
  const plan = PLANS.find(p => p.name === planName);
  if (!plan) throw new Error("Unknown plan");
  const value = scenarioValue(missedCalls, bookingPercent, jobValue);
  const jobsToCover = jobValue > 0 ? Math.ceil(plan.regular / jobValue) : null;
  return {plan, value, net: value - plan.regular, jobsToCover};
}

export function RoiCalculator() {
  const [calls, setCalls] = useState("");
  const [pct, setPct] = useState("");
  const [job, setJob] = useState("");
  const [plan, setPlan] = useState("");
  let out = "Enter your numbers and pick a plan to see your scenario.";
  if (calls !== "" && pct !== "" && job !== "" && plan) {
    try {
      const r = roiScenario(Number(calls), Number(pct), Number(job), plan);
      out = `Potential job value: ${usd(r.value)} a month. ${r.plan.name} is ${usd(r.plan.regular)}/mo (${usd(r.plan.launch)}/mo for the first 3 paid months). ` +
        (r.jobsToCover === null ? "" : `At your job value, ${r.jobsToCover} booked job${r.jobsToCover === 1 ? "" : "s"} a month cover the regular plan price.`);
    } catch {
      out = "Use a whole number of missed calls, a percentage from 0 to 100 and a job value of 0 or more.";
    }
  }
  return <section className="revo-roi" id="roi-calculator" aria-labelledby="roi-calculator-title">
    <link rel="stylesheet" href="/css/revo-roi-calculator.css" />
    <div className="revo-roi-inner">
      <h2 id="roi-calculator-title">ROI calculator: your missed calls against a Revo plan</h2>
      <p>No default numbers. Use your own figures for one month.</p>
      <div className="revo-roi-grid">
        <label>Missed calls per month<input type="number" inputMode="numeric" min="0" step="1" value={calls} onChange={e => setCalls(e.target.value)} /></label>
        <label>Share that would book a job (%)<input type="number" inputMode="decimal" min="0" max="100" value={pct} onChange={e => setPct(e.target.value)} /></label>
        <label>Average job value (USD)<input type="number" inputMode="decimal" min="0" value={job} onChange={e => setJob(e.target.value)} /></label>
        <label>Plan<select value={plan} onChange={e => setPlan(e.target.value)}><option value="">Choose a plan</option>{PLANS.map(p => <option key={p.name} value={p.name}>{p.name} · {usd(p.regular)}/mo</option>)}</select></label>
      </div>
      <output aria-live="polite">{out}</output>
      <p className="revo-roi-note">A hypothetical scenario from your inputs, not measured results or a promise of revenue. Plan prices from <a href="/pricing">Revo’s pricing page</a>.</p>
    </div>
  </section>;
}
