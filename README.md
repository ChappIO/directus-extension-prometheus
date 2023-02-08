# Directus Extension: Prometheus

Expose directus metrics to your prometheus instance.

No configuration required.

## Install into your project

```bash
npm install directus-extension-prometheus
```

Now, when you launch your directus instance, you will receive
metrics on the /metrics endpoint.

## Optional Configuration


| Option                        | Description                                               | Default      |
|-------------------------------|-----------------------------------------------------------|--------------|
| `PROMETHEUS_METRICS_ENDPOINT` | The endpoint on which the prometheus metrics are exposed. | `"/metrics"` |

## Metrics

Here is an example of the types of metrics exposed by this extension:

```
# HELP directus_request_count The total number of http requests
# TYPE directus_request_count counter
directus_request_count{status="200",method="GET"} 160
directus_request_count{status="200",method="POST"} 2
directus_request_count{status="304",method="GET"} 12
directus_request_count{status="204",method="PATCH"} 5

# HELP directus_request_duration_seconds The total duration of http requests
# TYPE directus_request_duration_seconds histogram
directus_request_duration_seconds_bucket{le="0.005",method="GET",status="200"} 10
directus_request_duration_seconds_bucket{le="0.01",method="GET",status="200"} 57
directus_request_duration_seconds_bucket{le="0.025",method="GET",status="200"} 141
directus_request_duration_seconds_bucket{le="0.05",method="GET",status="200"} 158
directus_request_duration_seconds_bucket{le="0.1",method="GET",status="200"} 160
directus_request_duration_seconds_bucket{le="0.25",method="GET",status="200"} 160
directus_request_duration_seconds_bucket{le="0.5",method="GET",status="200"} 160
directus_request_duration_seconds_bucket{le="1",method="GET",status="200"} 160
directus_request_duration_seconds_bucket{le="2.5",method="GET",status="200"} 160
directus_request_duration_seconds_bucket{le="5",method="GET",status="200"} 160
directus_request_duration_seconds_bucket{le="10",method="GET",status="200"} 160
directus_request_duration_seconds_bucket{le="+Inf",method="GET",status="200"} 160
directus_request_duration_seconds_sum{method="GET",status="200"} 2.239873104999999
directus_request_duration_seconds_count{method="GET",status="200"} 160
directus_request_duration_seconds_bucket{le="0.005",method="POST",status="200"} 0
directus_request_duration_seconds_bucket{le="0.01",method="POST",status="200"} 0
directus_request_duration_seconds_bucket{le="0.025",method="POST",status="200"} 1
directus_request_duration_seconds_bucket{le="0.05",method="POST",status="200"} 1
directus_request_duration_seconds_bucket{le="0.1",method="POST",status="200"} 2
directus_request_duration_seconds_bucket{le="0.25",method="POST",status="200"} 2
directus_request_duration_seconds_bucket{le="0.5",method="POST",status="200"} 2
directus_request_duration_seconds_bucket{le="1",method="POST",status="200"} 2
directus_request_duration_seconds_bucket{le="2.5",method="POST",status="200"} 2
directus_request_duration_seconds_bucket{le="5",method="POST",status="200"} 2
directus_request_duration_seconds_bucket{le="10",method="POST",status="200"} 2
directus_request_duration_seconds_bucket{le="+Inf",method="POST",status="200"} 2
directus_request_duration_seconds_sum{method="POST",status="200"} 0.08861785999999999
directus_request_duration_seconds_count{method="POST",status="200"} 2
directus_request_duration_seconds_bucket{le="0.005",method="GET",status="304"} 0
directus_request_duration_seconds_bucket{le="0.01",method="GET",status="304"} 6
directus_request_duration_seconds_bucket{le="0.025",method="GET",status="304"} 11
directus_request_duration_seconds_bucket{le="0.05",method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="0.1",method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="0.25",method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="0.5",method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="1",method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="2.5",method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="5",method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="10",method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="+Inf",method="GET",status="304"} 12
directus_request_duration_seconds_sum{method="GET",status="304"} 0.16695966899999998
directus_request_duration_seconds_count{method="GET",status="304"} 12
directus_request_duration_seconds_bucket{le="0.005",method="PATCH",status="204"} 0
directus_request_duration_seconds_bucket{le="0.01",method="PATCH",status="204"} 4
directus_request_duration_seconds_bucket{le="0.025",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="0.05",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="0.1",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="0.25",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="0.5",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="1",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="2.5",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="5",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="10",method="PATCH",status="204"} 5
directus_request_duration_seconds_bucket{le="+Inf",method="PATCH",status="204"} 5
directus_request_duration_seconds_sum{method="PATCH",status="204"} 0.059318456000000006
directus_request_duration_seconds_count{method="PATCH",status="204"} 5

# HELP directus_collection_size The total number of items in each collection
# TYPE directus_collection_size gauge
directus_collection_size{collection="directus_activity"} 4
directus_collection_size{collection="directus_collections"} 1
directus_collection_size{collection="directus_fields"} 1
directus_collection_size{collection="directus_files"} 0
directus_collection_size{collection="directus_folders"} 0
directus_collection_size{collection="directus_migrations"} 62
directus_collection_size{collection="directus_permissions"} 0
directus_collection_size{collection="directus_presets"} 0
directus_collection_size{collection="directus_relations"} 0
directus_collection_size{collection="directus_revisions"} 2
directus_collection_size{collection="directus_roles"} 1
directus_collection_size{collection="directus_sessions"} 2
directus_collection_size{collection="directus_settings"} 0
directus_collection_size{collection="directus_users"} 1
directus_collection_size{collection="directus_webhooks"} 0
directus_collection_size{collection="directus_dashboards"} 0
directus_collection_size{collection="directus_panels"} 0
directus_collection_size{collection="directus_notifications"} 0
directus_collection_size{collection="directus_shares"} 0
directus_collection_size{collection="directus_flows"} 0
directus_collection_size{collection="directus_operations"} 0
directus_collection_size{collection="thing"} 0
```