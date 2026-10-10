import briefingTemplatesEn from '../data/briefing-templates.en.json';
import briefingTemplatesHi from '../data/briefing-templates.hi.json';
import briefingTemplatesGu from '../data/briefing-templates.gu.json';
import type { EventRecord, Plan, Briefing, SupportedLang, BriefingBlock } from './types';

export function getBriefingTemplates(lang: SupportedLang) {
  if (lang === 'hi') return briefingTemplatesHi;
  if (lang === 'gu') return briefingTemplatesGu;
  return briefingTemplatesEn;
}

export function generateBriefingFromPlan(
  event: EventRecord,
  plan: Plan,
  lang: SupportedLang,
  existingBriefing?: Briefing | null
): Briefing {
  const templates = getBriefingTemplates(lang);
  const metroPax = Math.round(event.attendance * event.metroShare).toLocaleString();
  const attendanceStr = event.attendance.toLocaleString();
  const metroSharePct = Math.round(event.metroShare * 100).toString();

  // Calculate last train time string
  const baseEnd = new Date(event.endsAt);
  const extendedEnd = new Date(baseEnd.getTime() + (60 + plan.lastTrainExtMin) * 60000);
  const lastTrainTime = extendedEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const blocks: BriefingBlock[] = templates.map((tmpl) => {
    // Check if user previously edited this block in an existing briefing
    const priorBlock = existingBriefing?.blocks.find((b) => b.key === tmpl.key);
    if (priorBlock && priorBlock.edited) {
      return priorBlock;
    }

    const text = tmpl.text
      .replace(/{eventName}/g, event.name)
      .replace(/{stationName}/g, event.stationId === 'motera-stadium' ? 'Motera Stadium' : 'Ahmedabad Metro')
      .replace(/{attendance}/g, attendanceStr)
      .replace(/{metroSharePct}/g, metroSharePct)
      .replace(/{metroPax}/g, metroPax)
      .replace(/{gatesOpen}/g, plan.gatesOpen.toString())
      .replace(/{headwayMin}/g, plan.headwayMin.toString())
      .replace(/{lastTrainTime}/g, lastTrainTime)
      .replace(/{lastTrainExtMin}/g, plan.lastTrainExtMin.toString())
      .replace(/{staffRequired}/g, plan.staff.toString())
      .replace(/{staffForecourt}/g, Math.round(plan.staff * 0.35).toString())
      .replace(/{staffGates}/g, Math.round(plan.staff * 0.35).toString())
      .replace(/{staffPlatform}/g, Math.round(plan.staff * 0.30).toString())
      .replace(/{meteringLimit}/g, plan.metering.limit.toString())
      .replace(/{criticalLimit}/g, '4.8');

    return {
      key: tmpl.key,
      title: tmpl.title,
      text,
      edited: false,
    };
  });

  return {
    id: `brf-${event.id}-${plan.id}-${lang}`,
    eventId: event.id,
    planId: plan.id,
    lang,
    blocks,
    final: existingBriefing?.final ?? false,
  };
}
