//
//

use futures_util::StreamExt;
use reqwest::header::HeaderMap;
use std::collections::HashMap;
use std::error::Error;
use std::sync::atomic::{AtomicU32, Ordering};
use tauri::Emitter;

static REQUEST_COUNTER: AtomicU32 = AtomicU32::new(0);

#[derive(Debug, Clone, serde::Serialize)]
pub struct StreamResponse {
    request_id: u32,
    status: u16,
    status_text: String,
    headers: HashMap<String, String>,
}

#[derive(Clone, serde::Serialize)]
pub struct EndPayload {
    request_id: u32,
    status: u16,
}

#[derive(Clone, serde::Serialize)]
pub struct ChunkPayload {
    request_id: u32,
    chunk: Vec<u8>,
}

#[tauri::command]
pub async fn stream_fetch(
    window: tauri::Window,
    method: String,
    url: String,
    headers: HashMap<String, String>,
    body: Vec<u8>,
) -> Result<StreamResponse, String> {
    let event_name = "stream-response";
    let request_id = REQUEST_COUNTER.fetch_add(1, Ordering::SeqCst);

    let mut _headers = HeaderMap::new();
    _headers = crate::http_utils::build_header_map(&headers)?;

    // println!("method: {:?}", method);
    // println!("url: {:?}", url);
    // println!("headers: {:?}", headers);
    // println!("headers: {:?}", _headers);

    let method = crate::http_utils::parse_method(&method)?;
    let client = crate::http_utils::build_client_with_headers(_headers, 3)?;

    let mut request = client.request(method.clone(), crate::http_utils::parse_url(&url)?);

    if method == reqwest::Method::POST
        || method == reqwest::Method::PUT
        || method == reqwest::Method::PATCH
    {
        // println!("body: {:?}", body);
        request = request.body(body);
    }

    //   println!("client: {:?}", client);
    //   println!("request: {:?}", request);

    let response_future = request.send();

    let res = response_future.await;
    let response = match res {
        Ok(res) => {
            // get response and emit to client
            let headers = crate::http_utils::response_headers_to_map(res.headers());
            let status = res.status().as_u16();

            tauri::async_runtime::spawn(async move {
                let mut stream = res.bytes_stream();

                while let Some(chunk) = stream.next().await {
                    match chunk {
                        Ok(bytes) => {
                            //   println!("chunk: {:?}", bytes);
                            if let Err(e) = window.emit(
                                event_name,
                                ChunkPayload {
                                    request_id,
                                    chunk: bytes.to_vec(),
                                },
                            ) {
                                println!("Failed to emit chunk payload: {:?}", e);
                            }
                        }
                        Err(err) => {
                            println!("Error chunk: {:?}", err);
                        }
                    }
                }
                if let Err(e) = window.emit(event_name, EndPayload { request_id, status }) {
                    println!("Failed to emit end payload: {:?}", e);
                }
            });

            StreamResponse {
                request_id,
                status,
                status_text: "OK".to_string(),
                headers,
            }
        }
        Err(err) => {
            let error: String = err
                .source()
                .map(|e| e.to_string())
                .unwrap_or_else(|| "Unknown error occurred".to_string());
            println!("Error response: {:?}", error);
            tauri::async_runtime::spawn(async move {
                let error_bytes: Vec<u8> = error.into_bytes();
                if let Err(e) = window.emit(
                    event_name,
                    ChunkPayload {
                        request_id,
                        chunk: error_bytes,
                    },
                ) {
                    println!("Failed to emit chunk payload: {:?}", e);
                }
                if let Err(e) = window.emit(
                    event_name,
                    EndPayload {
                        request_id,
                        status: 599,
                    },
                ) {
                    println!("Failed to emit end payload: {:?}", e);
                }
            });
            StreamResponse {
                request_id,
                status: 599,
                status_text: "Error".to_string(),
                headers: HashMap::new(),
            }
        }
    };
    // println!("Response: {:?}", response);
    Ok(response)
}
