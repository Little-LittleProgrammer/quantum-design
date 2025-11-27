// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod fetch;
mod http_utils;
mod stream;
mod system;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            stream::stream_fetch,
            fetch::json_fetch,
            system::run_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
