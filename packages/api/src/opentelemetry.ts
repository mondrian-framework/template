import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { Resource } from '@opentelemetry/resources'
import { LogRecordExporter, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import * as opentelemetry from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } from '@opentelemetry/semantic-conventions'
import { PrismaInstrumentation } from '@prisma/instrumentation'

class MultiLogRecordExporter implements LogRecordExporter {
  private readonly exporters: LogRecordExporter[]
  constructor(exporters: LogRecordExporter[]) {
    this.exporters = exporters
  }
  export(logs: opentelemetry.logs.ReadableLogRecord[], resultCallback: (result: opentelemetry.core.ExportResult) => void): void {
    for (const exp of this.exporters) {
      exp.export(logs, resultCallback)
    }
  }
  async shutdown(): Promise<void> {
    for (const exp of this.exporters) {
      await exp.shutdown()
    }
  }
}

class MyConsoleLogRecordExporter implements LogRecordExporter {
  export(logs: opentelemetry.logs.ReadableLogRecord[], resultCallback: (result: opentelemetry.core.ExportResult) => void): void {
    for (const log of logs) {
      console.log(`[${log.severityText}, ${new Date(log.hrTime[0] * 1000 + log.hrTime[1] / 1000000).toISOString()}, ${log.attributes.server}] ${log.body}`)
    }
    resultCallback({ code: opentelemetry.core.ExportResultCode.SUCCESS })
  }
  async shutdown(): Promise<void> {}
}

const traceExporter = process.env.OTLP_TRACE_EXPORTER_URL
  ? new OTLPTraceExporter({
      url: process.env.OTLP_TRACE_EXPORTER_URL,
      headers: process.env.OTLP_EXPORTER_AUTH ? { Authorization: process.env.OTLP_EXPORTER_AUTH } : undefined,
    })
  : new ConsoleSpanExporter()

const metricReader = new PeriodicExportingMetricReader({
  exporter: process.env.OTLP_METRIC_EXPORTER_URL
    ? new OTLPMetricExporter({
        url: process.env.OTLP_METRIC_EXPORTER_URL,
        headers: process.env.OTLP_EXPORTER_AUTH ? { Authorization: process.env.OTLP_EXPORTER_AUTH } : undefined,
      })
    : new ConsoleMetricExporter(),
})

const logRecordProcessor = new SimpleLogRecordProcessor(
  process.env.OTLP_LOG_EXPORTER_URL
    ? new MultiLogRecordExporter([
        new MyConsoleLogRecordExporter(),
        new OTLPLogExporter({
          url: process.env.OTLP_LOG_EXPORTER_URL,
          headers: process.env.OTLP_EXPORTER_AUTH ? { Authorization: process.env.OTLP_EXPORTER_AUTH } : undefined,
        }),
      ])
    : new MyConsoleLogRecordExporter(),
)

const sdk = new opentelemetry.NodeSDK({
  serviceName: 'my-service-name',
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'my-service-name',
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: `my-service-name_${process.env.ENVIRONMENT ?? 'develop'}`,
  }),
  spanProcessor: new SimpleSpanProcessor(traceExporter),
  traceExporter,
  metricReader,
  logRecordProcessor,
  instrumentations: [
    /*new PrismaInstrumentation()*/
  ],
})

if (process.env.OTLP_TRACE_EXPORTER_URL) {
  console.log(`Trace exporter enabled at ${process.env.OTLP_TRACE_EXPORTER_URL}`)
}
if (process.env.OTLP_METRIC_EXPORTER_URL) {
  console.log(`Metric exporter enabled at ${process.env.OTLP_METRIC_EXPORTER_URL}`)
}
if (process.env.OTLP_LOG_EXPORTER_URL) {
  console.log(`Log exporter enabled at ${process.env.OTLP_LOG_EXPORTER_URL}`)
}

sdk.start()
