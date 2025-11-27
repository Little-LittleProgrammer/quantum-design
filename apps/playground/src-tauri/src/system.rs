use std::process::Command as StdCommand;

#[derive(Debug, Clone, serde::Serialize)]
pub struct CmdOutput {
    code: i32,
    stdout: String,
    stderr: String,
}

fn is_allowed_program(program: &str) -> bool {
    // Restrict which programs can be executed for safety.
    // Extend this allowlist as needed.
    matches!(program, "uname" | "ls" | "echo" | "open" | "system_profiler" | "sw_vers")
}

#[tauri::command]
pub async fn run_command(program: String, args: Vec<String>) -> Result<CmdOutput, String> {
    if !is_allowed_program(&program) {
        return Err(format!("program not allowed: {}", program));
    }

    let program_clone = program.clone();
    let args_clone = args.clone();

    let output = tauri::async_runtime::spawn_blocking(move || {
        StdCommand::new(program_clone)
            .args(args_clone)
            .output()
            .map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())??;

    let code = output.status.code().unwrap_or(-1);
    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    Ok(CmdOutput { code, stdout, stderr })
}
