import { WebTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

// Parse "Key=Value,Key2=Value2" header strings (OTEL_EXPORTER_OTLP_HEADERS format)
function parseOtlpHeaders(raw: string): Record<string, string> {
  return Object.fromEntries(
    raw.split(',').flatMap(pair => {
      const idx = pair.indexOf('=');
      if (idx === -1) return [];
      return [[pair.slice(0, idx).trim(), pair.slice(idx + 1).trim()]];
    })
  );
}

const endpoint = import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT as string | undefined;
const rawHeaders = import.meta.env.VITE_OTEL_EXPORTER_OTLP_HEADERS as string | undefined;
const serviceName =
  (import.meta.env.VITE_OTEL_SERVICE_NAME as string | undefined) ?? 'habit-tracker-frontend';
const rawResourceAttrs = import.meta.env.VITE_OTEL_RESOURCE_ATTRIBUTES as string | undefined;

if (!endpoint || !rawHeaders) {
  console.debug('[OTel] VITE_OTEL_EXPORTER_OTLP_ENDPOINT or VITE_OTEL_EXPORTER_OTLP_HEADERS not set — telemetry disabled');
} else {
  const exporter = new OTLPTraceExporter({
    url: `${endpoint}/v1/traces`,
    headers: parseOtlpHeaders(rawHeaders),
  });

  const extraAttrs = rawResourceAttrs ? parseOtlpHeaders(rawResourceAttrs) : {};

  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: serviceName, ...extraAttrs }),
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });

  // register() wires up W3C trace-context propagation and StackContextManager by default
  provider.register();

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-fetch': {
          // Propagate W3C trace context headers to all outbound requests so the backend
          // can correlate frontend spans with server-side traces.
          propagateTraceHeaderCorsUrls: [/.+/],
        },
        '@opentelemetry/instrumentation-xml-http-request': {
          // axios uses XHR in browsers — propagate trace context through those requests too.
          propagateTraceHeaderCorsUrls: [/.+/],
        },
      }),
    ],
  });
}
