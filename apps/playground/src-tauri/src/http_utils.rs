use std::collections::HashMap;
use std::time::Duration;

use reqwest::header::{HeaderMap, HeaderName, HeaderValue, ACCEPT};
use reqwest::{Client, Method, Url};

pub fn parse_method(method: &str) -> Result<Method, String> {
    method
        .parse::<Method>()
        .map_err(|err| format!("failed to parse method: {}", err))
}

pub fn parse_url(url: &str) -> Result<Url, String> {
    url.parse::<Url>()
        .map_err(|err| format!("failed to parse url: {}", err))
}

pub fn build_header_map(headers: &HashMap<String, String>) -> Result<HeaderMap, String> {
    let mut header_map = HeaderMap::new();
    for (key, value) in headers {
        let name = key
            .parse::<HeaderName>()
            .map_err(|err| format!("invalid header name '{}': {}", key, err))?;
        let val = HeaderValue::from_str(value)
            .map_err(|err| format!("invalid header value for '{}': {}", key, err))?;
        header_map.insert(name, val);
    }
    Ok(header_map)
}

pub fn ensure_accept_json(header_map: &mut HeaderMap) {
    if !header_map.contains_key(ACCEPT) {
        header_map.insert(
            ACCEPT,
            HeaderValue::from_static("application/json, */*;q=0.1"),
        );
    }
}

pub fn build_client_with_headers(
    default_headers: HeaderMap,
    connect_timeout_secs: u64,
) -> Result<Client, String> {
    Client::builder()
        .default_headers(default_headers)
        .redirect(reqwest::redirect::Policy::limited(3))
        .connect_timeout(Duration::from_secs(connect_timeout_secs))
        .build()
        .map_err(|err| format!("failed to build client: {}", err))
}

pub fn response_headers_to_map(headers: &reqwest::header::HeaderMap) -> HashMap<String, String> {
    let mut headers_out = HashMap::new();
    for (name, value) in headers {
        headers_out.insert(
            name.as_str().to_string(),
            String::from_utf8_lossy(value.as_bytes()).into_owned(),
        );
    }
    headers_out
}
