# Load Testing Report (Artillery)

## Test setup
- Tool: Artillery
- Scenario file: `artillery/groups-load.yml`
- Target: `http://localhost:3000`
- Date:
- Environment:

## Workload profile
- Warm-up: 30s at 5 req/s
- Sustained load: 60s at 15 req/s
- Stress: 30s at 30 req/s
- Scenario mix:
  - `read-heavy-list`: 60%
  - `mixed-crud`: 40%

## Results summary
- Total requests:
- Successful responses:
- Failed responses:
- Error rate (%):
- Throughput (req/sec):
- p50 response time (ms):
- p95 response time (ms):
- p99 response time (ms):

## Endpoint observations
- `GET /items`:
- `GET /items/:id`:
- `POST /items`:
- `PUT /items/:id`:
- `DELETE /items/:id`:

## Key findings
1.
2.
3.

## Recommendations
1.
2.
3.
