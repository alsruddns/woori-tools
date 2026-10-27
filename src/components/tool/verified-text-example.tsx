import { verifiedTextExamples } from "@/registry/verified-text-examples";

type Props = {
  slug: string;
  toolName: string;
  labels: { input: string; secondInput: string; result: string };
};

export function VerifiedTextExample({ slug, toolName, labels }: Props) {
  const example = verifiedTextExamples[slug];
  if (!example) return null;

  return (
    <section aria-label={`${toolName}: ${labels.input} / ${labels.result}`} className="mt-4 min-w-0 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 [overflow-wrap:anywhere] sm:p-6">
      <h2 className="font-semibold text-indigo-950">{toolName}: {labels.input} / {labels.result}</h2>
      <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-slate-700">{labels.input}</h3>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-sm text-slate-900">{example.input}</pre>
        </div>
        {example.secondText && (
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-slate-700">{labels.secondInput}</h3>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-sm text-slate-900">{example.secondText}</pre>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-slate-700">{labels.result}</h3>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-sm text-slate-900">{example.output}</pre>
        </div>
      </div>
    </section>
  );
}
