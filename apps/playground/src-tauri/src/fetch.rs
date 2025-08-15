use std::collections::HashMap;

use reqwest::header::CONTENT_TYPE;
use reqwest::Method;
use serde_json::Value;

use crate::http_utils::{
    build_client_with_headers, build_header_map, ensure_accept_json, parse_method, parse_url,
    response_headers_to_map,
};

#[derive(Debug, Clone, serde::Serialize)]
pub struct JsonResponse {
    status: u16,
    status_text: String,
    headers: HashMap<String, String>,
    body: Value,
}

#[tauri::command]
pub async fn json_fetch(
    method: String,
    url: String,
    headers: HashMap<String, String>,
    json: Option<Value>,
) -> Result<JsonResponse, String> {
    let method = parse_method(&method)?;
    let mut header_map = build_header_map(&headers)?;
    ensure_accept_json(&mut header_map);
    let client = build_client_with_headers(header_map, 5)?;
    let mut request = client.request(method.clone(), parse_url(&url)?);

    if let Some(j) = json {
        if method == Method::POST || method == Method::PUT || method == Method::PATCH {
            request = request.json(&j);
        }
    }

    let res = request.send().await.map_err(|err| err.to_string())?;

    let status = res.status().as_u16();
    let status_text = res.status().canonical_reason().unwrap_or("").to_string();

    // Copy headers out before consuming the body
    let headers_out = response_headers_to_map(res.headers());

    let content_type_is_json = res
        .headers()
        .get(CONTENT_TYPE)
        .and_then(|hv| hv.to_str().ok())
        .map(|v| v.contains("application/json") || v.contains("+json"))
        .unwrap_or(false);

    let body_value: Value = if content_type_is_json {
        match res.json::<Value>().await {
            Ok(v) => v,
            Err(err) => return Err(format!("failed to parse json: {}", err)),
        }
    } else {
        // Fallback to text; wrap in JSON for a consistent return type
        let text = res.text().await.map_err(|err| err.to_string())?;
        serde_json::json!({ "text": text })
    };

    Ok(JsonResponse {
        status,
        status_text,
        headers: headers_out,
        body: body_value,
    })
}
