import { AnalysisResult } from '@/store/useVibeStore';

const MOCK_WAIT_TIME = 2500; // 2.5s for realism

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export async function analyzeUI(
  imageUrl: string,
  mode: 'NORMAL' | 'ROAST' | 'FIX'
): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scores = {
        visualHierarchy: getRandomInt(40, 95),
        spacing: getRandomInt(40, 95),
        colorConsistency: getRandomInt(40, 95),
        readability: getRandomInt(40, 95),
        ctaVisibility: getRandomInt(40, 95),
      };

      const overallScore = Math.round(
        (scores.visualHierarchy +
          scores.spacing +
          scores.colorConsistency +
          scores.readability +
          scores.ctaVisibility) /
          5
      );

      let verdict = '';
      let strengths = ['Clean layout approach'];
      let weaknesses = ['Some padding issues'];
      let fixPlan: string[] | undefined = undefined;
      let primaryIssue = 'Inconsistent padding structure across active elements.';
      let tags: string[] = [];

      if (overallScore > 80) {
        verdict =
          mode === 'ROAST'
            ? 'Surprisingly not garbage. I can tolerate calling this a UI.'
            : 'Excellent work. The UI is clean, modern, and follows best practices.';
        strengths = ['Strong visual hierarchy', 'Excellent color contrast', 'Clear call to actions'];
        weaknesses = ['Minor spacing inconsistencies in secondary elements'];
        primaryIssue = 'Minor misalignment in secondary footers.';
        tags = ['Great Layout', 'Clear CTAs', 'Accessible'];
      } else if (overallScore > 60) {
        verdict =
          mode === 'ROAST'
            ? 'Looks like an engineer designed it. Needs more salt.'
            : 'Good foundation, but lacks polish. Needs attention to detail.';
        strengths = ['Functional layout', 'Okay readability'];
        weaknesses = ['Inconsistent padding', 'Colors clash slightly', 'CTAs blend in'];
        primaryIssue = 'Call-to-actions wash out against the background and lack prominent padding.';
        tags = ['Weak CTA', 'Cluttered', 'Inconsistent Styling'];
      } else {
        verdict =
          mode === 'ROAST'
            ? 'My eyes are bleeding. Did you build this in 1999?'
            : 'Needs significant rework. Visual hierarchy and alignment are completely off.';
        strengths = ['At least it loads'];
        weaknesses = [
          'No clear focal point',
          'Poor contrast',
          'Typography is all over the place',
          'Buttons look like plain text',
        ];
        primaryIssue = 'Complete lack of visual hierarchy causing severe cognitive load for the user.';
        tags = ['No Hierarchy', 'Poor Contrast', 'Low Legibility', 'Rethink Needed'];
      }

      if (mode === 'FIX') {
        fixPlan = [
          'Standardize your spacing system to multiples of 4px or 8px.',
          'Increase contrast on secondary text to at least 4.5:1 (WCAG AA).',
          'Make primary buttons stand out with a solid fill and sufficient padding.',
          'Limit the number of font weights to 2-3 to reduce visual noise.',
        ];
      }

      const confidenceScore = getRandomInt(85, 98);
      const shipReadiness = parseFloat((Math.min(10, Math.max(0, overallScore / 10 + (Math.random() - 0.5)))).toFixed(1));

      resolve({
        id: crypto.randomUUID(),
        imageUrl,
        timestamp: new Date().toISOString(),
        mode,
        scores,
        overallScore,
        verdict,
        strengths,
        weaknesses,
        fixPlan,
        primaryIssue,
        confidenceScore,
        tags,
        shipReadiness,
      });
    }, MOCK_WAIT_TIME);
  });
}
